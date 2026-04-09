import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';

const select = '-passwordHash';

export async function listUsers() {
  return User.find({ isDeleted: false }).select(select).sort({ createdAt: -1 });
}

export async function createUser(payload) {
  const exists = await User.findOne({ email: payload.email.toLowerCase() });
  if (exists && !exists.isDeleted) throw new ApiError(409, 'User already exists');

  const passwordHash = await bcrypt.hash(payload.password, 10);

  if (exists && exists.isDeleted) {
    exists.email = payload.email.toLowerCase();
    exists.fullName = payload.fullName;
    exists.passwordHash = passwordHash;
    exists.isAdmin = Boolean(payload.isAdmin);
    exists.isDeleted = false;
    await exists.save();
    return User.findById(exists._id).select(select);
  }

  const user = await User.create({
    email: payload.email.toLowerCase(),
    fullName: payload.fullName,
    passwordHash,
    isAdmin: Boolean(payload.isAdmin)
  });

  return User.findById(user._id).select(select);
}

export async function updateUser(id, payload) {
  const user = await User.findOne({ _id: id, isDeleted: false });
  if (!user) throw new ApiError(404, 'User not found');

  user.fullName = payload.fullName ?? user.fullName;
  if (typeof payload.isAdmin === 'boolean') user.isAdmin = payload.isAdmin;
  await user.save();
  return User.findById(id).select(select);
}

export async function updatePassword(id, password) {
  const user = await User.findOne({ _id: id, isDeleted: false });
  if (!user) throw new ApiError(404, 'User not found');
  user.passwordHash = await bcrypt.hash(password, 10);
  await user.save();
}

export async function deleteUser(id) {
  const user = await User.findOne({ _id: id, isDeleted: false });
  if (!user) throw new ApiError(404, 'User not found');
  user.isDeleted = true;
  await user.save();
}
