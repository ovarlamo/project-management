import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
