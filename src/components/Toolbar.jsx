import { PRIORITIES, SORT_OPTIONS, STATUSES } from '../utils/tasks';

export default function Toolbar({ filters, onChange, onCreate, canCreate }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="toolbar">
      <div className="field grow">
        <label htmlFor="search">Поиск</label>
        <input id="search" type="search" value={filters.query} onChange={set('query')} placeholder="Название или описание" />
      </div>

      <div className="field">
        <label htmlFor="f-status">Статус</label>
        <select id="f-status" value={filters.status} onChange={set('status')}>
          <option value="all">Все</option>
          {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <div className="field">
        <label htmlFor="f-priority">Приоритет</label>
        <select id="f-priority" value={filters.priority} onChange={set('priority')}>
          <option value="all">Любой</option>
          {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      </div>

      <div className="field">
        <label htmlFor="f-sort">Порядок</label>
        <select id="f-sort" value={filters.sort} onChange={set('sort')}>
          {SORT_OPTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <button className="btn primary" onClick={onCreate} disabled={!canCreate} title={canCreate ? undefined : 'Сначала создайте проект'}>
        Новая задача
      </button>
    </div>
  );
}
