import * as taskService from '../services/taskService.js';

export async function listTasks(req, res, next) {
  try {
    // Контроллер выступает тонким HTTP-слоем:
    // принимает query-параметры и делегирует бизнес-логику сервису.
    const tasks = await taskService.listTasks(req.query);
    res.json({ success: true, data: tasks });
  } catch (err) {
    // Любые ошибки передаем в глобальный errorHandler.
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    // req.user.id приходит из middleware аутентификации и фиксирует автора задачи.
    const task = await taskService.createTask(req.body, req.user.id);
    // 201 Created — корректный код для успешного создания ресурса.
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    // ID берется из URL-параметра /tasks/:id, payload — из тела запроса.
    const task = await taskService.updateTask(req.params.id, req.body);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function addComment(req, res, next) {
  try {
    // Комментарий всегда привязываем к текущему пользователю (authorId),
    // а не доверяем ID из клиентского запроса.
    const task = await taskService.addComment(req.params.id, req.user.id, req.body.text);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    // В сервисе выполняется soft-delete: физически запись не удаляется из БД.
    await taskService.deleteTask(req.params.id);
    res.json({ success: true, data: true });
  } catch (err) {
    next(err);
  }
}
