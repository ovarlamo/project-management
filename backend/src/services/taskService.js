import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { ApiError } from '../utils/apiError.js';

export async function listTasks({ projectId, status }) {
  // Базовый фильтр реализует soft-delete политику:
  // скрываем удаленные записи, но сохраняем их в БД для аудита/восстановления.
  const query = { isDeleted: false };
  // Динамически добавляем необязательные критерии фильтрации.
  if (projectId) query.projectId = projectId;
  if (status) query.status = status;

  return Task.find(query)
    // populate обогащает задачу данными связанных сущностей,
    // чтобы фронтенду не требовались дополнительные запросы.
    .populate('projectId', 'name status')
    .populate('authorId', 'fullName email')
    .populate('assigneeId', 'fullName email')
    // Новые/обновленные задачи показываем первыми для лучшего UX.
    .sort({ updatedAt: -1 });
}

export async function createTask(payload, authorId) {
  // Защита ссылочной целостности на уровне бизнес-логики:
  // нельзя создать задачу в несуществующем/удаленном проекте.
  const project = await Project.findOne({ _id: payload.projectId, isDeleted: false });
  if (!project) throw new ApiError(404, 'Project not found');

  return Task.create({
    ...payload,
    // Автор всегда берется из аутентифицированного контекста.
    authorId,
    // Нормализуем отсутствие родительской задачи к null
    // (это проще для запросов, чем undefined).
    parentTaskId: payload.parentTaskId || null
  });
}

export async function updateTask(id, payload) {
  // Ищем только "живые" задачи (не soft-deleted).
  const task = await Task.findOne({ _id: id, isDeleted: false });
  if (!task) throw new ApiError(404, 'Task not found');

  // Частичное обновление: изменяем только поля, которые реально переданы.
  // Это защищает от непреднамеренного затирания значений undefined.
  Object.keys(payload).forEach((key) => {
    if (payload[key] !== undefined) task[key] = payload[key];
  });

  // save запускает валидацию схемы Mongoose и middleware модели.
  await task.save();
  return task;
}

export async function addComment(id, authorId, text) {
  const task = await Task.findOne({ _id: id, isDeleted: false });
  if (!task) throw new ApiError(404, 'Task not found');

  // Комментарии храним как embedded-документы в задаче:
  // удобно получать карточку задачи сразу с историей обсуждения.
  task.comments.push({ authorId, text, createdAt: new Date() });
  await task.save();
  return task;
}

export async function deleteTask(id) {
  const task = await Task.findOne({ _id: id, isDeleted: false });
  if (!task) throw new ApiError(404, 'Task not found');
  // Soft-delete вместо hard-delete:
  // сохраняем историю и возможность восстановить данные.
  task.isDeleted = true;
  await task.save();
}
