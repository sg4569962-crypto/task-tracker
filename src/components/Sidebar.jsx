import { useState } from 'react';

export default function Sidebar({ projects, tasks, activeId, onSelect, onAdd, onDelete }) {
  const [name, setName] = useState('');

  const openCount = (projectId) =>
    tasks.filter((t) => t.status !== 'done' && (projectId === 'all' || t.projectId === projectId)).length;

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const project = await onAdd(name);
    if (project) {
      setName('');
      onSelect(project.id);
    }
  };

  const remove = (project) => {
    if (window.confirm(`Удалить проект «${project.name}» вместе со всеми его задачами?`)) {
      onDelete(project.id);
      if (activeId === project.id) onSelect('all');
    }
  };

  return (
    <aside className="sidebar" aria-label="Проекты">
      <h1 className="brand">Трекер задач</h1>

      <nav>
        <ul className="project-list">
          <li>
            <button
              className="project-btn"
              aria-current={activeId === 'all' ? 'page' : undefined}
              onClick={() => onSelect('all')}
            >
              <span>Все задачи</span>
              <span className="count">{openCount('all')}</span>
            </button>
          </li>
          {projects.map((p) => (
            <li key={p.id} className="project-row">
              <button
                className="project-btn"
                aria-current={activeId === p.id ? 'page' : undefined}
                onClick={() => onSelect(p.id)}
              >
                <span className="project-name">{p.name}</span>
                <span className="count">{openCount(p.id)}</span>
              </button>
              <button className="icon-btn subtle" onClick={() => remove(p)} aria-label={`Удалить проект ${p.name}`}>
                ×
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <form className="add-project" onSubmit={submit}>
        <label htmlFor="new-project" className="visually-hidden">Название нового проекта</label>
        <input
          id="new-project"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Новый проект"
          maxLength={40}
        />
        <button type="submit" className="btn" disabled={!name.trim()}>Добавить</button>
      </form>
    </aside>
  );
}
