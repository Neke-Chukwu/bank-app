import mongoose from 'mongoose';

const { Schema } = mongoose;

const transferSchema = new Schema(
  {
    senderAccount: { type: String, required: true }, // Account number of the sender
    recipientName: { type: String, required: true },
    recipientAccount: { type: String, required: true },
    recipientBank: { type: String, required: true },
    recipientRouting: { type: String }, // Optional for international transfers
    recipientSwift: { type: String }, // SWIFT/BIC code for international transfers
    recipientIban: { type: String }, // IBAN for international transfers
    recipientCountry: { type: String }, // Country for international transfers
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' }, // Currency for international transfers
    transferType: { type: String, enum: ['Personal', 'Business'], default: 'Personal' },
    transferDate: { type: Date, required: true },
    reference: { type: String },
    status: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' },
    transactionType: {  // Added transactionType
      type: String,
      enum: ['debit', 'credit'],
      required: true, // Make it required
    },
  },
  { timestamps: true }
);

const TransferModel = mongoose.model('Transfer', transferSchema);

export default TransferModel;
