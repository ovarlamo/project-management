import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { ApiError } from '../utils/apiError.js';

export async function listTasks({ projectId, status }) {
  const query = { isDeleted: false };
  if (projectId) query.projectId = projectId;
  if (status) query.status = status;

  return Task.find(query)
    .populate('projectId', 'name status')
    .populate('authorId', 'fullName email')
    .populate('assigneeId', 'fullName email')
    .sort({ updatedAt: -1 });
}

export async function createTask(payload, authorId) {
  const project = await Project.findOne({ _id: payload.projectId, isDeleted: false });
  if (!project) throw new ApiError(404, 'Project not found');

  return Task.create({
    ...payload,
    authorId,
    parentTaskId: payload.parentTaskId || null
  });
}

export async function updateTask(id, payload) {
  const task = await Task.findOne({ _id: id, isDeleted: false });
  if (!task) throw new ApiError(404, 'Task not found');

  Object.keys(payload).forEach((key) => {
    if (payload[key] !== undefined) task[key] = payload[key];
  });

  await task.save();
  return task;
}

export async function addComment(id, authorId, text) {
  const task = await Task.findOne({ _id: id, isDeleted: false });
  if (!task) throw new ApiError(404, 'Task not found');

  task.comments.push({ authorId, text, createdAt: new Date() });
  await task.save();
  return task;
}

export async function deleteTask(id) {
  const task = await Task.findOne({ _id: id, isDeleted: false });
  if (!task) throw new ApiError(404, 'Task not found');
  task.isDeleted = true;
  await task.save();
}
