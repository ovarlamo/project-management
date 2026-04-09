import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

function sanitize(user) {
  return {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export async function login(email, password) {
  const user = await User.findOne({ email: email.toLowerCase(), isDeleted: false });
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, 'Invalid email or password');

  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

  return { token, user: sanitize(user) };
}

export async function getCurrentUser(userId) {
  const user = await User.findOne({ _id: userId, isDeleted: false });
  if (!user) throw new ApiError(404, 'User not found');
  return sanitize(user);
}
