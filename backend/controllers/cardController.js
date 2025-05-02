import asyncHandler from 'express-async-handler';
import CardModel from '../models/cardModel.js';
import UserModel from '../models/UserModel.js';

// Utility to generate a mock 16-digit card number (passes Luhn algorithm)
const generateCardNumber = () => {
  const prefix = Math.random() < 0.5 ? '4' : '5'; // Visa (4) or Mastercard (5)
  let number = prefix;
  for (let i = 1; i < 15; i++) {
    number += Math.floor(Math.random() * 10);
  }
  // Calculate Luhn checksum
  let sum = 0;
  let isEven = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  const checksum = (10 - (sum % 10)) % 10;
  return number + checksum;
};

// Utility to generate a 3-digit CVV
const generateCVV = () => {
  return Math.floor(100 + Math.random() * 900).toString();
};

// Utility to generate expiry date (5 years from now)
const generateExpiryDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 5);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${month}/${year}`;
};

// Generate a credit or debit card
const generateCard = asyncHandler(async (req, res) => {
  const { cardType } = req.body; // 'credit' or 'debit'

  if (!['credit', 'debit'].includes(cardType)) {
    res.status(400);
    throw new Error('Invalid card type. Must be "credit" or "debit".');
  }

  const user = await UserModel.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  // Check if user already has a card of this type
  const existingCard = await CardModel.findOne({ userId: user._id, cardType });
  if (existingCard) {
    res.status(400);
    throw new Error(`User already has a ${cardType} card.`);
  }

  const card = new CardModel({
    userId: user._id,
    cardType,
    cardNumber: generateCardNumber(),
    cardHolderName: user.username.toUpperCase(),
    cvv: generateCVV(),
    expiryDate: generateExpiryDate(),
  });

  await card.save();

  res.status(201).json({
    message: `${cardType.charAt(0).toUpperCase() + cardType.slice(1)} card generated successfully`,
    card: {
      _id: card._id,
      cardType: card.cardType,
      cardNumber: card.cardNumber,
      cardHolderName: card.cardHolderName,
        cvv: card.cvv, 
      expiryDate: card.expiryDate,
      status: card.status,
    },
  });
});

// Delete a card
const deleteCard = asyncHandler(async (req, res) => {
  const { cardId } = req.params;

  const card = await CardModel.findById(cardId);
  if (!card) {
    res.status(404);
    throw new Error('Card not found.');
  }

  if (card.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this card.');
  }

  await card.deleteOne();

  res.status(200).json({
    message: `${card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)} card deleted successfully`,
  });
});

const getCardDetails = asyncHandler(async (req, res) => {
    const { cardId } = req.params;
  
    const card = await CardModel.findById(cardId);
    if (!card) {
      res.status(404);
      throw new Error('Card not found.');
    }
  
    if (card.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view this card.');
    }
  
    res.status(200).json({
      _id: card._id,
      cardType: card.cardType,
      cardNumber: card.cardNumber, // Full card number
      cardHolderName: card.cardHolderName,
      expiryDate: card.expiryDate,
      cvv: card.cvv, // Include CVV
      status: card.status,
    });
});

  // Get all cards for a user
const getCards = asyncHandler(async (req, res) => {
    const cards = await CardModel.find({ userId: req.user._id });
    res.status(200).json({
      cards: cards.map((card) => ({
        _id: card._id,
        cardType: card.cardType,
        cardNumber: card.cardNumber, // Full card number
        cvv: card.cvv, // Include CVV
        cardHolderName: card.cardHolderName,
        expiryDate: card.expiryDate,
        status: card.status,
      })),
    });
});






export { generateCard, deleteCard, getCardDetails, getCards };
