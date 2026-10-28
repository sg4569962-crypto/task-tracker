/**
 * Слой данных. Сейчас хранит всё в localStorage, чтобы проект запускался без бэкенда.
 * Каждая функция асинхронная и возвращает то же, что вернёт будущий REST API,
 * поэтому при подключении Node.js достаточно заменить тела функций на fetch('/api/...').
 */
const KEY = 'task-tracker:v1';
const delay = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms));

const offsetDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

function seed() {
  const now = new Date().toISOString();
  const site = { id: crypto.randomUUID(), name: 'Личный сайт' };
  const study = { id: crypto.randomUUID(), name: 'Учёба' };
  const task = (projectId, title, description, status, priority, dueDate) => ({
    id: crypto.randomUUID(), projectId, title, description, status, priority, dueDate, createdAt: now,
  });
  return {
    projects: [site, study],
    tasks: [
      task(site.id, 'Сверстать страницу «Обо мне»', 'Адаптив до 360px, тёмная тема', 'in_progress', 'high', offsetDate(2)),
      task(site.id, 'Подключить форму обратной связи', 'Отправка на почту через Node.js', 'todo', 'medium', offsetDate(6)),
      task(site.id, 'Задеплоить на Vercel', '', 'todo', 'low', null),
      task(study.id, 'Пройти раздел про хуки в React', 'useReducer, useMemo, кастомные хуки', 'done', 'medium', offsetDate(-3)),
      task(study.id, 'Разобраться с JWT и refresh-токенами', '', 'todo', 'high', offsetDate(-1)),
    ],
  };
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* повреждённые данные — начинаем заново */
  }
  const data = seed();
  write(data);
  return data;
}

function write(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* хранилище недоступно — работаем в памяти до перезагрузки */
  }
}

export async function fetchAll() {
  await delay();
  return read();
}

export async function createProject(name) {
  await delay();
  const data = read();
  const project = { id: crypto.randomUUID(), name: name.trim() };
  write({ ...data, projects: [...data.projects, project] });
  return project;
}

export async function removeProject(id) {
  await delay();
  const data = read();
  write({
    projects: data.projects.filter((p) => p.id !== id),
    tasks: data.tasks.filter((t) => t.projectId !== id),
  });
}

export async function createTask(input) {
  await delay();
  const data = read();
  const task = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  write({ ...data, tasks: [task, ...data.tasks] });
  return task;
}

export async function updateTask(id, patch) {
  await delay();
  const data = read();
  let updated = null;
  const tasks = data.tasks.map((t) => (t.id === id ? (updated = { ...t, ...patch }) : t));
  write({ ...data, tasks });
  return updated;
}

export async function removeTask(id) {
  await delay();
  const data = read();
  write({ ...data, tasks: data.tasks.filter((t) => t.id !== id) });
}
