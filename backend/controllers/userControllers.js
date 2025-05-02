import bcrypt from 'bcryptjs';
import asyncHandler from '../middlewares/asyncHandler.js';
import UserModel from '../models/UserModel.js'; 
import createToken from '../utils/createToken.js'; 

const generateAccountNumber = () =>
  'NTB' + Math.floor(100000000 + Math.random() * 900000000);

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  console.log('REGISTER payload:', req.body); // Debugging: Log the registration payload
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
    accounts: defaultAccounts, // Add default accounts
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
    // Generate and set the JWT cookie, and get the token string
    const token = createToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: token, // Send the token in the response
      message: 'Login successful',
    });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  console.log('Logging out user...');
  res.clearCookie('token'); // Clear the token cookie
  res.status(200).json({ message: 'Logout successful' });
});


const getUserProfile = asyncHandler(async (req, res) => {
  // The user's information is already attached to the request by the 'authenticate' middleware
  // as 'req.user'.  We can directly access it here.
  const user = await UserModel.findById(req.user._id).select('-password');

  if (!user) {
    // It's possible that the user was deleted after the token was issued.
    res.status(404);
    throw new Error('User not found');
  }

  // Send the user data in the response.  Include the accounts information.
  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    accounts: user.accounts,
  });
});

// @desc    Get user accounts
// @route   GET /api/users/accounts
// @access  Private
const getUserAccounts = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Access user ID from req.user

  const user = await UserModel.findById(userId).select('accounts');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user.accounts);
});

const getUserData = async (req, res) => {
  try {
    // Use the provided userId from the route parameter or fallback to the authenticated user's ID
    const userId = req.params.id || req.user?._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Find the user and exclude the password
    const user = await UserModel.findById(req.user?._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return the user data
    return res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        accounts: user.accounts, // Include accounts in the response
        profileImage: user.profileImage,
        role: user.role,
        status: user.status, // Include status
        createdAt: user.createdAt, // Include creation date
        lastLogin: user.lastLogin, // Include last login
      },
    });
  } catch (err) {
    console.error(`Error fetching user data for userId: ${req.params.id || req.user?._id}`, err);

    // Handle token expiration error
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired, please log in again." });
    }

    // Handle malformed token error
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token, please log in again." });
    }

    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export { registerUser, loginUser, logoutUser, getUserProfile, getUserAccounts, getUserData };