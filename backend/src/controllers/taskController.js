import * as taskService from '../services/taskService.js';

export async function listTasks(req, res, next) {
  try {
    const tasks = await taskService.listTasks(req.query);
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const task = await taskService.createTask(req.body, req.user.id);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function addComment(req, res, next) {
  try {
    const task = await taskService.addComment(req.params.id, req.user.id, req.body.text);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    await taskService.deleteTask(req.params.id);
    res.json({ success: true, data: true });
  } catch (err) {
    next(err);
  }
}
