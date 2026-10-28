import { PRIORITIES, STATUSES, formatDue, isOverdue } from '../utils/tasks';

export default function TaskItem({ task, projectName, showProject, onStatusChange, onEdit, onDelete }) {
  const done = task.status === 'done';
  const overdue = isOverdue(task);
  const priority = PRIORITIES.find((p) => p.id === task.priority);

  return (
    <li className={`task priority-${task.priority}${done ? ' is-done' : ''}`}>
      <input
        type="checkbox"
        className="task-check"
        checked={done}
        onChange={() => onStatusChange(task.id, done ? 'todo' : 'done')}
        aria-label={done ? `Вернуть в работу: ${task.title}` : `Отметить выполненной: ${task.title}`}
      />

      <div className="task-main">
        <p className="task-title">{task.title}</p>
        {task.description && <p className="task-desc">{task.description}</p>}
        <p className="task-meta">
          {showProject && <span className="chip">{projectName}</span>}
          <span className="priority-label">Приоритет: {priority?.label.toLowerCase()}</span>
        </p>
      </div>

      <div className={`due${overdue ? ' overdue' : ''}`}>
        {formatDue(task.dueDate)}
        {overdue && <span className="overdue-note">просрочено</span>}
      </div>

      <div className="field compact">
        <label htmlFor={`status-${task.id}`} className="visually-hidden">Статус задачи {task.title}</label>
        <select id={`status-${task.id}`} value={task.status} onChange={(e) => onStatusChange(task.id, e.target.value)}>
          {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <div className="task-actions">
        <button className="btn" onClick={() => onEdit(task)}>Изменить</button>
        <button className="icon-btn subtle" onClick={() => onDelete(task)} aria-label={`Удалить задачу ${task.title}`}>×</button>
      </div>
    </li>
  );
}
