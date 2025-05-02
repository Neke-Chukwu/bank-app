import asyncHandler from '../middlewares/asyncHandler.js';
import UserModel from '../models/UserModel.js'; 
import transferModel from '../models/transferModel.js'; 

// @desc    Initiate a local transfer
// @route   POST /api/transfers/local
// @access  Private
const localTransfer = asyncHandler(async (req, res) => {
    const { recipientName, recipientAccount, recipientBank, amount, transferDate, reference } = req.body;

    const user = await UserModel.findById(req.user._id); // Find user by ID
    if (!user) {
        res.status(404);
        throw new Error('User not found.');
    }

    const checkingAccount = user.accounts.find((acc) => acc.type === 'Checking Account');
    if (!checkingAccount) {
        res.status(404);
        throw new Error('Checking Account not found.');
    }

    if (checkingAccount.balance < amount) {
        res.status(400);
        throw new Error('Insufficient balance.');
    }

    // Deduct amount and save user
    checkingAccount.balance -= amount;
    await user.save();

    // Create and save transfer record
    const transfer = new transferModel({
        senderAccount: checkingAccount.number,
        recipientName,
        recipientAccount,
        recipientBank,
        amount,
        transferDate,
        reference,
        status: 'Pending',
        transactionType: 'debit', // Set transaction type
    });
    await transfer.save();

    // Simulate approval after 5 seconds
    setTimeout(async () => {
        transfer.status = 'Approved';
        await transfer.save();
        console.log(`Transfer ${transfer._id} approved.`);
    }, 5000);

    res.status(201).json({ message: 'Transfer initiated successfully.', transfer });
});

// @desc    Initiate an international transfer
// @route   POST /api/transfers/international
// @access  Private
const internationalTransfer = asyncHandler(async (req, res) => {
    const {
        recipientName,
        recipientAccount,
        recipientBank,
        recipientSwift,
        recipientIban,
        recipientCountry,
        amount,
        currency,
        transferType,
        transferDate,
        reference,
    } = req.body;

    console.log('Processing international transfer...');

    // Validate the user
    const user = await UserModel.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found.');
    }

    // Find the Checking Account
    const checkingAccount = user.accounts.find((acc) => acc.type === 'Checking Account');
    if (!checkingAccount) {
        res.status(404);
        throw new Error('Checking Account not found.');
    }

    // Check if the Checking Account has sufficient balance
    if (checkingAccount.balance < amount) {
        res.status(400);
        throw new Error('Insufficient balance in Checking Account.');
    }

    // Debit the Checking Account
    checkingAccount.balance -= amount;

    // Save the updated user
    await user.save();

    // Create a new transfer record
    const transfer = new transferModel({
        senderAccount: checkingAccount.number,
        recipientName,
        recipientAccount,
        recipientBank,
        recipientSwift,
        recipientIban,
        recipientCountry,
        amount,
        currency,
        transferType,
        transferDate,
        reference,
        status: 'Pending', // Set initial status to Pending
        transactionType: 'debit', // Set transaction type
    });

    // Save the transfer
    await transfer.save();

    console.log('Simulating approval delay...');
    // Simulate approval after 10 seconds
    setTimeout(async () => {
        transfer.status = 'Approved';
        await transfer.save();
        console.log(`International transfer ${transfer._id} approved.`);
    }, 5000);

    console.log('International transfer initiated successfully.');
    res.status(201).json({ message: 'International transfer initiated successfully.', transfer });
});

// @desc    Initiate a bill payment
// @route   POST /api/bills/pay
// @access  Private
const payBill = asyncHandler(async (req, res) => {
    const {
      recipientName,
      recipientAccount,
      recipientBank,
      amount,
      currency,
      transferDate, // Keep transferDate as it is in the model
      reference,
      billType,
    } = req.body;
  
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found.');
    }
  
    const checkingAccount = user.accounts.find((acc) => acc.type === 'Checking Account');
    if (!checkingAccount) {
      res.status(404);
      throw new Error('Checking Account not found.');
    }
  
    if (checkingAccount.balance < amount) {
      res.status(400);
      throw new Error('Insufficient balance.');
    }
  
    checkingAccount.balance -= amount;
    await user.save();
  
    const billPayment = new transferModel({ // Use the transferModel
      senderAccount: checkingAccount.number, // Use senderAccount
      recipientName,
      recipientAccount,
      recipientBank,
      amount,
      currency,
      transferDate, // Use transferDate
      reference,
      status: 'Pending',
      billType,
      transactionType: 'debit', // Set transaction type
    });
  
    await billPayment.save();
  
    // Simulate approval
    setTimeout(async () => {
      billPayment.status = 'Approved';
      await billPayment.save();
      console.log(`Bill payment ${billPayment._id} approved`);
    }, 5000);
  
    res.status(201).json({ message: 'Bill payment initiated', billPayment });
  });

// @desc    Get all transfers for a user (sent and received)
// @route   GET /api/transfers
// @access  Private
const getAllTransfers = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Extract userId from the token
    console.log('Fetching transfers for user:', userId);

    if (!userId) {
        res.status(400);
        throw new Error('User ID is missing from the request.');
    }

    // Fetch the user's accounts
    const user = await UserModel.findById(userId).select('accounts');
    if (!user) {
        res.status(404);
        throw new Error('User not found.');
    }

    // Extract account numbers from the user's accounts
    const accountNumbers = user.accounts.map((account) => account.number);
    console.log("User's account numbers:", accountNumbers);

    // Pagination logic
    const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 transfers per page
    const parsedLimit = parseInt(limit);

    // Query for transactions where the user is either sender or recipient
    const transfers = await transferModel.find({
        $or: [
            { senderAccount: { $in: accountNumbers } }, // Sent transactions
            { recipientAccount: { $in: accountNumbers } }, // Received transactions
        ],
    })
        .sort({ createdAt: -1 }) // Newest first
        .skip((page - 1) * parsedLimit)
        .limit(parsedLimit);

    const totalTransfers = await transferModel.countDocuments({
        $or: [
            { senderAccount: { $in: accountNumbers } },
            { recipientAccount: { $in: accountNumbers } },
        ],
    });

    res.status(200).json({
        transfers,
        totalPages: Math.ceil(totalTransfers / parsedLimit),
        currentPage: parseInt(page),
    });
});

export { localTransfer, internationalTransfer, getAllTransfers, payBill };
