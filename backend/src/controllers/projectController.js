import * as projectService from '../services/projectService.js';
import { DEFAULT_PROJECT_STATUS } from '../constants/projectStatus.js';

export async function listProjects(req, res, next) {
  try {
    const status = req.query.status ?? DEFAULT_PROJECT_STATUS;
    const projects = await projectService.listProjects(status);
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
}

export async function createProject(req, res, next) {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    await projectService.deleteProject(req.params.id);
    res.json({ success: true, data: true });
  } catch (err) {
    next(err);
  }
}
