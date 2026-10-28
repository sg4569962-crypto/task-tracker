import TaskItem from './TaskItem';

export default function TaskList({ tasks, projects, showProject, hasTasksInScope, onStatusChange, onEdit, onDelete, onCreate, onResetFilters }) {
  if (tasks.length === 0) {
    return (
      <div className="empty">
        {hasTasksInScope ? (
          <>
            <p className="empty-title">Ничего не найдено</p>
            <p>Измените условия поиска или сбросьте фильтры.</p>
            <button className="btn" onClick={onResetFilters}>Сбросить фильтры</button>
          </>
        ) : (
          <>
            <p className="empty-title">Здесь пока нет задач</p>
            <p>Добавьте первую задачу, чтобы начать отслеживать работу.</p>
            <button className="btn primary" onClick={onCreate}>Новая задача</button>
          </>
        )}
      </div>
    );
  }

  const nameOf = (id) => projects.find((p) => p.id === id)?.name ?? 'Без проекта';

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          projectName={nameOf(task.projectId)}
          showProject={showProject}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
