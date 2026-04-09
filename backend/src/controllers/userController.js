import * as userService from '../services/userService.js';

export async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updatePassword(req, res, next) {
  try {
    await userService.updatePassword(req.params.id, req.body.password);
    res.json({ success: true, data: true });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ success: true, data: true });
  } catch (err) {
    next(err);
  }
}
