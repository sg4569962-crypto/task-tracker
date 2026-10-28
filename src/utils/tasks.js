export const STATUSES = [
  { id: 'todo', label: 'К выполнению' },
  { id: 'in_progress', label: 'В работе' },
  { id: 'done', label: 'Готово' },
];

export const PRIORITIES = [
  { id: 'low', label: 'Низкий' },
  { id: 'medium', label: 'Средний' },
  { id: 'high', label: 'Высокий' },
];

const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

export const SORT_OPTIONS = [
  { id: 'due', label: 'По сроку' },
  { id: 'priority', label: 'По приоритету' },
  { id: 'created', label: 'Сначала новые' },
];

/** Парсит строку YYYY-MM-DD как локальную дату (без сдвига часового пояса). */
export function parseDate(value) {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isOverdue(task, now = new Date()) {
  const due = parseDate(task.dueDate);
  if (!due || task.status === 'done') return false;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return due < today;
}

export function formatDue(value) {
  const date = parseDate(value);
  if (!date) return 'Без срока';
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(date);
}

/** Фильтрация: проект, статус, приоритет и поиск по названию и описанию. */
export function filterTasks(tasks, { projectId = 'all', status = 'all', priority = 'all', query = '' } = {}) {
  const q = query.trim().toLowerCase();
  return tasks.filter((t) => {
    if (projectId !== 'all' && t.projectId !== projectId) return false;
    if (status !== 'all' && t.status !== status) return false;
    if (priority !== 'all' && t.priority !== priority) return false;
    if (q && !`${t.title} ${t.description ?? ''}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

/** Сортировка без мутации исходного массива. Задачи без срока уходят в конец. */
export function sortTasks(tasks, sortBy = 'due') {
  const copy = [...tasks];
  if (sortBy === 'priority') {
    return copy.sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);
  }
  if (sortBy === 'created') {
    return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return copy.sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });
}

export function countByStatus(tasks) {
  return tasks.reduce(
    (acc, t) => ({ ...acc, [t.status]: (acc[t.status] ?? 0) + 1 }),
    { todo: 0, in_progress: 0, done: 0 }
  );
}
