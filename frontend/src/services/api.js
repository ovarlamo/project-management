const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  // Унифицированная точка для всех HTTP-запросов приложения.
  // Централизация уменьшает дублирование и упрощает изменение протокола.
  const response = await fetch(`${API_URL}${path}`, {
    // По умолчанию работаем с JSON API.
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    // include обязателен, чтобы браузер отправлял cookie с JWT на backend.
    credentials: 'include',
    ...options
  });

  // Даже при не-JSON ответе не падаем на парсинге:
  // это делает обработку сетевых ошибок устойчивее.
  const payload = await response.json().catch(() => ({}));

  // Считаем ошибкой как транспортные статусы 4xx/5xx,
  // так и бизнес-ошибки в формате { success: false }.
  if (!response.ok || payload.success === false) {
    throw new Error(payload?.error?.message || 'Request failed');
  }

  // Возвращаем только data-часть контракта API, чтобы компоненты
  // работали с доменными данными, а не с HTTP-оберткой.
  return payload.data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' })
};
