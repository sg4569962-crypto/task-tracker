import { useEffect, useRef, useState } from 'react';
import { PRIORITIES, STATUSES } from '../utils/tasks';

/** Форма в нативном <dialog>: фокус, Esc и затемнение работают без доп. библиотек. */
export default function TaskForm({ task, projects, defaultProjectId, onSubmit, onClose }) {
  const dialogRef = useRef(null);
  const isEdit = Boolean(task?.id);

  const [values, setValues] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    projectId: task?.projectId ?? defaultProjectId,
    status: task?.status ?? 'todo',
    priority: task?.priority ?? 'medium',
    dueDate: task?.dueDate ?? '',
  });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const titleError = touched && !values.title.trim() ? 'Введите название задачи' : null;

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!values.title.trim()) return;
    onSubmit({ ...values, title: values.title.trim(), description: values.description.trim(), dueDate: values.dueDate || null });
  };

  return (
    <dialog ref={dialogRef} className="dialog" onClose={onClose} aria-labelledby="task-form-title">
      <form onSubmit={submit} noValidate>
        <h2 id="task-form-title">{isEdit ? 'Изменить задачу' : 'Новая задача'}</h2>

        <div className="field">
          <label htmlFor="t-title">Название</label>
          <input id="t-title" value={values.title} onChange={set('title')} maxLength={120} autoFocus
            aria-invalid={Boolean(titleError)} aria-describedby={titleError ? 't-title-error' : undefined} />
          {titleError && <p id="t-title-error" className="error">{titleError}</p>}
        </div>

        <div className="field">
          <label htmlFor="t-desc">Описание</label>
          <textarea id="t-desc" rows={3} value={values.description} onChange={set('description')} maxLength={500} />
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="t-project">Проект</label>
            <select id="t-project" value={values.projectId} onChange={set('projectId')}>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="t-due">Срок</label>
            <input id="t-due" type="date" value={values.dueDate} onChange={set('dueDate')} />
          </div>
          <div className="field">
            <label htmlFor="t-status">Статус</label>
            <select id="t-status" value={values.status} onChange={set('status')}>
              {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="t-priority">Приоритет</label>
            <select id="t-priority" value={values.priority} onChange={set('priority')}>
              {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
        </div>

        <div className="dialog-actions">
          <button type="button" className="btn" onClick={() => dialogRef.current?.close()}>Отмена</button>
          <button type="submit" className="btn primary">{isEdit ? 'Сохранить изменения' : 'Создать задачу'}</button>
        </div>
      </form>
    </dialog>
  );
}
