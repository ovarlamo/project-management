import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';

export async function globalSearch(query, isAdmin) {
  const regex = new RegExp(query, 'i');

  const [projects, tasks, users] = await Promise.all([
    Project.find({ isDeleted: false, $or: [{ name: regex }, { description: regex }] }).limit(15),
    Task.find({ isDeleted: false, $or: [{ title: regex }, { description: regex }] }).limit(15),
    isAdmin ? User.find({ isDeleted: false, $or: [{ email: regex }, { fullName: regex }] }).select('-passwordHash').limit(15) : []
  ]);

  return { projects, tasks, users };
}
