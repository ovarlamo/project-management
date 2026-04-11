import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { ApiError } from '../utils/apiError.js';
import { DEFAULT_PROJECT_STATUS } from '../constants/projectStatus.js';
import { TASK_STATUSES } from '../constants/taskStatus.js';

export async function listProjects(status = DEFAULT_PROJECT_STATUS) {
  const query = { isDeleted: false };
  if (status) query.status = status;
  return Project.find(query).sort({ updatedAt: -1 });
}

export async function createProject(payload) {
  return Project.create({
    name: payload.name,
    description: payload.description || '',
    status: payload.status || DEFAULT_PROJECT_STATUS
  });
}

export async function updateProject(id, payload) {
  const project = await Project.findOne({ _id: id, isDeleted: false });
  if (!project) throw new ApiError(404, 'Project not found');
  if (payload.name !== undefined) project.name = payload.name;
  if (payload.description !== undefined) project.description = payload.description;
  if (payload.status !== undefined) project.status = payload.status;
  await project.save();
  return project;
}

export async function deleteProject(id) {
  const project = await Project.findOne({ _id: id, isDeleted: false });
  if (!project) throw new ApiError(404, 'Project not found');

  const activeTasks = await Task.countDocuments({ projectId: id, isDeleted: false, status: { $ne: TASK_STATUSES.CLOSED } });
  if (activeTasks > 0) throw new ApiError(400, 'Project has active tasks and cannot be deleted');

  project.isDeleted = true;
  await project.save();
}
