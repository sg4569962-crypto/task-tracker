import { useCallback, useEffect, useState } from 'react';
import * as api from '../api';

/** Вся работа с данными в одном месте: загрузка, создание, обновление, удаление. */
export function useTracker() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .fetchAll()
      .then((data) => {
        if (cancelled) return;
        setProjects(data.projects);
        setTasks(data.tasks);
      })
      .catch(() => !cancelled && setError('Не удалось загрузить данные. Обновите страницу.'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const guard = useCallback(async (action, message) => {
    try {
      setError(null);
      return await action();
    } catch {
      setError(message);
      return null;
    }
  }, []);

  const addTask = (input) =>
    guard(async () => {
      const task = await api.createTask(input);
      setTasks((prev) => [task, ...prev]);
    }, 'Не удалось создать задачу. Попробуйте ещё раз.');

  const editTask = (id, patch) =>
    guard(async () => {
      const updated = await api.updateTask(id, patch);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }, 'Не удалось сохранить изменения.');

  const deleteTask = (id) =>
    guard(async () => {
      await api.removeTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }, 'Не удалось удалить задачу.');

  const addProject = (name) =>
    guard(async () => {
      const project = await api.createProject(name);
      setProjects((prev) => [...prev, project]);
      return project;
    }, 'Не удалось создать проект.');

  const deleteProject = (id) =>
    guard(async () => {
      await api.removeProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setTasks((prev) => prev.filter((t) => t.projectId !== id));
    }, 'Не удалось удалить проект.');

  return { projects, tasks, loading, error, addTask, editTask, deleteTask, addProject, deleteProject };
}
