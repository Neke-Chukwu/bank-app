import mongoose from 'mongoose';

const { Schema } = mongoose;

const cardSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cardType: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{16}$/, // 16-digit card number
    },
    cardHolderName: {
      type: String,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
      match: /^\d{3}$/, // 3-digit CVV
    },
    expiryDate: {
      type: String,
      required: true,
      match: /^(0[1-9]|1[0-2])\/\d{2}$/, // MM/YY format
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Unique index to ensure one card per type per user
cardSchema.index({ userId: 1, cardType: 1 }, { unique: true });

const CardModel = mongoose.model('Card', cardSchema);

export default CardModel;