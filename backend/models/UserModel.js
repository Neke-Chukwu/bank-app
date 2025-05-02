import mongoose from 'mongoose';

const { Schema } = mongoose;

const accountSchema = new Schema({
  type: { type: String, required: true }, // e.g., "Checking Account", "Savings Account"
  number: { type: String, required: true, unique: true }, // Account number
  balance: { type: Number, default: 0 }, // Account balance
});

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
    },
    password: { type: String, required: true },
    phone: {
      type: String,
      match: /^[0-9]{10,15}$/, // Example: Only allow 10-15 digits
      required: false, // Set to `true` if the phone number is mandatory
    },
    accountNumber: { type: String, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    accounts: [accountSchema], // Array of accounts
    profileImage: { type: String, default: 'https://via.placeholder.com/150' }, // Profile picture URL
    idDocument: { type: String, default: null }, // URL or path to the uploaded ID document
    status:{ type: Boolean, default: true }, // true for active, false for suspended
    lastLogin: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

const UserModel = mongoose.model('User', userSchema);

export default UserModel;