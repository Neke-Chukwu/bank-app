import asyncHandler from '../middlewares/asyncHandler.js';
import UserModel from '../models/UserModel.js';
import transferModel from '../models/transferModel.js'; 


// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find({}).select('-password'); // Exclude passwords

  res.status(200).json(users);
});


// @desc    Edit user by ID
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
const editUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await UserModel.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update user fields.  Only allow admins to update specific fields.
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role; //  admin can change role

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    role: updatedUser.role,
  });
});

// @desc    Delete user by ID
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await UserModel.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne(); // Use deleteOne()

  res.status(200).json({ message: 'User deleted successfully' });
});

// @desc    Suspend user by ID
// @route   PUT /api/admin/users/suspend/:id
// @access  Private (Admin only)
const suspendUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await UserModel.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Add a isSuspended field to your UserModel
  user.status = 'Suspended'; 
  await user.save();

  res.status(200).json({ message: 'User suspended successfully' });
});

// @desc    Add funds to a user's account by ID
// @route   PUT /api/admin/users/:userId/accounts/fund
// @access  Private (Admin only)
const addFundsToAccount = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { amount, accountName } = req.body;
  
    // Validate amount
    if (!amount || amount <= 0) {
      res.status(400);
      throw new Error('Amount must be a positive number.');
    }
  
    // Validate accountName
    if (!accountName) {
      res.status(400);
      throw new Error('Account name is required.');
    }
  
    // Find the user
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found.');
    }
  
    // Find the account by name
    const account = user.accounts.find((acc) => acc.type.toLowerCase() === accountName.toLowerCase());
    if (!account) {
      res.status(404);
      throw new Error(`Account with name ${accountName} not found for user.`);
    }
  
    // Add the amount to the account balance
    account.balance += amount;
    await user.save();
  
    // Create a credit transaction record
    const creditTransfer = new transferModel({
      senderAccount: 'Admin', // Or some system identifier
      recipientName: user.username, // Or fetch from user
      recipientAccount: account.number,
      recipientBank: 'Internal System', // Or a relevant identifier
      amount: amount,
      currency: 'USD', // Or your default currency
      transferType: 'Business', // Or a relevant type
      transferDate: new Date(), // Current date
      reference: `Admin funding of ${accountName} for user ${user.username}`,
      status: 'Approved', // Or set to 'Pending' if it needs approval
      transactionType: 'credit', // Set to 'credit'
    });
  
    await creditTransfer.save();
  
    res.status(200).json({
      message: `Amount ${amount} added to ${account.type} for user ${user.username} successfully.`,
      updatedBalance: account.balance,
      transactionId: creditTransfer._id, // Optionally return the transaction ID
    });
  });

const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await UserModel.findById(userId).select('-password'); // Exclude password
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.status(200).json(user);
});

export { editUser, deleteUser, suspendUser, addFundsToAccount, getAllUsers, getUserById };
