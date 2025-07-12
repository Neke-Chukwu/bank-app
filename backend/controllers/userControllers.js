import bcrypt from 'bcryptjs';
import asyncHandler from '../middlewares/asyncHandler.js';
import UserModel from '../models/UserModel.js';
import ProfileImageModel from '../models/uploadModel.js'; // Import ProfileImageModel
import createToken from '../utils/createToken.js';

const generateAccountNumber = () =>
  'NTB' + Math.floor(100000000 + Math.random() * 900000000);

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  console.log('REGISTER payload:', req.body);
  const { username, email, password } = req.body;

  console.log('Checking if user already exists...');
  const exists = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  if (exists) {
    console.log('User already exists:', exists);
    return res
      .status(400)
      .json({ message: 'Username or email already exists.' });
  }

  console.log('Hashing password...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log('Generating default accounts...');
  const defaultAccounts = [
    { type: 'Checking Account', number: generateAccountNumber(), balance: 0 },
    { type: 'Savings Account', number: generateAccountNumber(), balance: 0 },
    { type: 'Investment Account', number: generateAccountNumber(), balance: 0 },
  ];

  console.log('Creating new user...');
  const user = new UserModel({
    username,
    email,
    password: hashedPassword,
    accountNumber: generateAccountNumber(),
    accounts: defaultAccounts,
  });

  console.log('Saving user to database...');
  const savedUser = await user.save();

  if (savedUser) {
    console.log('→ 201: registration successful');
    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
      message: 'Registration successful!',
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const user = await UserModel.findOne({ $or: [{ username }, { email }] });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = createToken(res, user._id);

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: token,
      message: 'Login successful',
    });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  console.log('Logging out user...');
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id)
    .select('-password')
    .populate('profileImage');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      accounts: user.accounts,
      profileImage: user.profileImage
        ? {
            data: user.profileImage.data.toString('base64'),
            contentType: user.profileImage.contentType,
          }
        : { data: null, contentType: '' },
      idDocument: user.idDocument,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    },
  });
});

// @desc    Get user accounts
// @route   GET /api/users/accounts
// @access  Private
const getUserAccounts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await UserModel.findById(userId).select('accounts');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user.accounts);
});

// @desc    Get user data
// @route   GET /api/users/:id
// @access  Private
const getUserData = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id)
    .select('-password')
    .populate('profileImage');

  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  console.log('getUserData - Populated profileImage:', user.profileImage);

  res.status(200).json({
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      accounts: user.accounts,
      profilePicture: user.profileImage
        ? {
            data: user.profileImage.data.toString('base64'),
            contentType: user.profileImage.contentType,
          }
        : { data: null, contentType: '' },
      idDocument: user.idDocument || { frontUrl: '', backUrl: '' },
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    },
  });
});

// @desc    Get savings accounts
// @route   GET /api/users/accounts/savings
// @access  Private
const getSavingsAccounts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await UserModel.findById(userId).select('accounts');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const savingsAccounts = user.accounts.filter(
    (account) => account.type === 'Savings Account'
  );

  if (savingsAccounts.length === 0) {
    return res.status(404).json({ message: 'No savings accounts found' });
  }

  res.status(200).json(savingsAccounts);
});

// @desc    Get investment accounts
// @route   GET /api/users/accounts/investment
// @access  Private
const getInvestmentAccounts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await UserModel.findById(userId).select('accounts');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const investmentAccounts = user.accounts.filter(
    (account) => account.type === 'Investment Account'
  );

  if (investmentAccounts.length === 0) {
    return res.status(404).json({ message: 'No investment accounts found' });
  }

  res.status(200).json(investmentAccounts);
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getUserAccounts,
  getUserData,
  getSavingsAccounts,
  getInvestmentAccounts,
};