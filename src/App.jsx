import { useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { useTracker } from './hooks/useTracker';
import { STATUSES, countByStatus, filterTasks, isOverdue, sortTasks } from './utils/tasks';

const DEFAULT_FILTERS = { query: '', status: 'all', priority: 'all', sort: 'due' };

export default function App() {
  const { projects, tasks, loading, error, addTask, editTask, deleteTask, addProject, deleteProject } = useTracker();
  const [activeId, setActiveId] = useState('all');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [editing, setEditing] = useState(null); // null — форма закрыта, {} — новая, task — редактирование

  const scoped = useMemo(() => filterTasks(tasks, { projectId: activeId }), [tasks, activeId]);
  const visible = useMemo(
    () => sortTasks(filterTasks(scoped, filters), filters.sort),
    [scoped, filters]
  );
  const counts = useMemo(() => countByStatus(scoped), [scoped]);
  const overdueCount = useMemo(() => scoped.filter((t) => isOverdue(t)).length, [scoped]);

  const activeProject = projects.find((p) => p.id === activeId);
  const defaultProjectId = activeProject?.id ?? projects[0]?.id ?? '';

  const handleSubmit = async (values) => {
    if (editing?.id) await editTask(editing.id, values);
    else await addTask(values);
    setEditing(null);
  };

  const handleDelete = (task) => {
    if (window.confirm(`Удалить задачу «${task.title}»?`)) deleteTask(task.id);
  };

  return (
    <div className="layout">
      <Sidebar
        projects={projects}
        tasks={tasks}
        activeId={activeId}
        onSelect={setActiveId}
        onAdd={addProject}
        onDelete={deleteProject}
      />

      <main className="content">
        <header className="content-head">
          <h2>{activeProject?.name ?? 'Все задачи'}</h2>
          <ul className="summary" aria-label="Сводка по статусам">
            {STATUSES.map((s) => (
              <li key={s.id}>{s.label}: <strong>{counts[s.id]}</strong></li>
            ))}
            {overdueCount > 0 && <li className="overdue">Просрочено: <strong>{overdueCount}</strong></li>}
          </ul>
        </header>

        {error && <p role="alert" className="banner">{error}</p>}

        <Toolbar
          filters={filters}
          onChange={setFilters}
          onCreate={() => setEditing({})}
          canCreate={projects.length > 0}
        />

        {loading ? (
          <p className="status-text" role="status">Загружаем задачи…</p>
        ) : (
          <TaskList
            tasks={visible}
            projects={projects}
            showProject={activeId === 'all'}
            hasTasksInScope={scoped.length > 0}
            onStatusChange={(id, status) => editTask(id, { status })}
            onEdit={setEditing}
            onDelete={handleDelete}
            onCreate={() => setEditing({})}
            onResetFilters={() => setFilters(DEFAULT_FILTERS)}
          />
        )}
      </main>

      {editing && (
        <TaskForm
          key={editing.id ?? 'new'}
          task={editing}
          projects={projects}
          defaultProjectId={defaultProjectId}
          onSubmit={handleSubmit}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
