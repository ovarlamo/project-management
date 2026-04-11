export const TASK_STATUSES = Object.freeze({
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
});

export const TASK_STATUS_LABELS = Object.freeze({
  [TASK_STATUSES.NEW]: 'Новая',
  [TASK_STATUSES.IN_PROGRESS]: 'В работе',
  [TASK_STATUSES.RESOLVED]: 'Решена',
  [TASK_STATUSES.CLOSED]: 'Закрыта'
});

export const TASK_STATUS_OPTIONS = Object.freeze([
  { value: TASK_STATUSES.NEW, label: TASK_STATUS_LABELS[TASK_STATUSES.NEW] },
  { value: TASK_STATUSES.IN_PROGRESS, label: TASK_STATUS_LABELS[TASK_STATUSES.IN_PROGRESS] },
  { value: TASK_STATUSES.RESOLVED, label: TASK_STATUS_LABELS[TASK_STATUSES.RESOLVED] },
  { value: TASK_STATUSES.CLOSED, label: TASK_STATUS_LABELS[TASK_STATUSES.CLOSED] }
]);

export const ALL_TASKS_STATUS_OPTION = Object.freeze({
  value: '',
  label: 'Все статусы'
});

export const DEFAULT_TASK_STATUS = TASK_STATUSES.NEW;
