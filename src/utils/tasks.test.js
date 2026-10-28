import { describe, it, expect } from 'vitest';
import { filterTasks, sortTasks, isOverdue, countByStatus } from './tasks.js';

const tasks = [
  { id: '1', projectId: 'a', title: 'Настроить CI', description: '', status: 'todo', priority: 'high', dueDate: '2026-11-05', createdAt: '2026-10-01T10:00:00Z' },
  { id: '2', projectId: 'a', title: 'Написать README', description: 'со скриншотами', status: 'done', priority: 'low', dueDate: null, createdAt: '2026-10-02T10:00:00Z' },
  { id: '3', projectId: 'b', title: 'Выучить Zod', description: '', status: 'in_progress', priority: 'medium', dueDate: '2026-11-01', createdAt: '2026-10-03T10:00:00Z' },
];

describe('filterTasks', () => {
  it('фильтрует по проекту', () => {
    expect(filterTasks(tasks, { projectId: 'b' }).map((t) => t.id)).toEqual(['3']);
  });

  it('ищет по названию и описанию без учёта регистра', () => {
    expect(filterTasks(tasks, { query: 'СКРИНШОТ' }).map((t) => t.id)).toEqual(['2']);
  });

  it('комбинирует фильтры', () => {
    expect(filterTasks(tasks, { projectId: 'a', status: 'todo', priority: 'high' })).toHaveLength(1);
  });
});

describe('sortTasks', () => {
  it('по сроку: задачи без срока в конце', () => {
    expect(sortTasks(tasks, 'due').map((t) => t.id)).toEqual(['3', '1', '2']);
  });

  it('по приоритету: сначала высокий', () => {
    expect(sortTasks(tasks, 'priority').map((t) => t.id)).toEqual(['1', '3', '2']);
  });

  it('не мутирует исходный массив', () => {
    const before = tasks.map((t) => t.id);
    sortTasks(tasks, 'priority');
    expect(tasks.map((t) => t.id)).toEqual(before);
  });
});

describe('isOverdue', () => {
  const now = new Date(2026, 10, 3); // 3 ноября 2026
  it('просрочена, если срок прошёл и задача не готова', () => {
    expect(isOverdue(tasks[2], now)).toBe(true);
  });
  it('не просрочена, если срок впереди', () => {
    expect(isOverdue(tasks[0], now)).toBe(false);
  });
  it('готовая задача не считается просроченной', () => {
    expect(isOverdue({ ...tasks[2], status: 'done' }, now)).toBe(false);
  });
});

describe('countByStatus', () => {
  it('считает задачи по статусам', () => {
    expect(countByStatus(tasks)).toEqual({ todo: 1, in_progress: 1, done: 1 });
  });
});
