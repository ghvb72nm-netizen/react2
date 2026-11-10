import {
  useCallback, useDeferredValue, useEffect, useMemo,
  useReducer, useRef, useState, useTransition,
} from 'react';
import { tasksReducer } from './tasksReducer.js';
import { useOnlineStatus } from './hooks/useOnlineStatus.js';
import { AddTaskForm } from './components/AddTaskForm.jsx';
import { SearchBox } from './components/SearchBox.jsx';
import { TaskList } from './components/TaskList.jsx';
import { ThemeToggle } from './components/ThemeToggle.jsx';
import './App.css';
 
const FILTERS = [
  ['all', 'Все'],
  ['active', 'Активные'],
  ['done', 'Готовые'],
];
 
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem('tasks')) ?? [];
  } catch {
    return [];
  }
}
 
export default function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, [], loadTasks);
  const online = useOnlineStatus();
 
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
 
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isPending, startTabTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);
  const searchRef = useRef(null);
 
  const handleAdd = useCallback((text) => {
    dispatch({ type: 'add', task: { id: Date.now(), text, done: false } });
  }, []);
  const handleToggle = useCallback((id) => dispatch({ type: 'toggle', id }), []);
  const handleRemove = useCallback((id) => dispatch({ type: 'remove', id }), []);
 
  const visibleTasks = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return tasks.filter((t) => {
      const byFilter = filter === 'all' || (filter === 'done' ? t.done : !t.done);
      return byFilter && t.text.toLowerCase().includes(q);
    });
  }, [tasks, deferredQuery, filter]);
 
  const doneCount = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);
 
  return (
    <div className="app">
      <header>
        <h1>Менеджер задач</h1>
        <ThemeToggle />
      </header>
 
      <p className="muted">{online ? '🟢 Онлайн' : '🔴 Нет сети'}</p>
 
      <AddTaskForm onAdd={handleAdd} />
 
      <div className="row">
        <SearchBox ref={searchRef} value={query} onChange={setQuery} />
        <button type="button" onClick={() => searchRef.current.clear()}>Сбросить</button>
      </div>
 
      <div className="tabs">
        {FILTERS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={filter === key ? 'active' : ''}
            onClick={() => startTabTransition(() => setFilter(key))}
          >
            {label}
          </button>
        ))}
      </div>
 
      <p className="muted">Всего: {tasks.length}, выполнено: {doneCount}</p>
 
      <div className={isPending ? 'dim' : ''}>
        <TaskList tasks={visibleTasks} onToggle={handleToggle} onRemove={handleRemove} />
      </div>
 
      <div className="actions">
        <button type="button" onClick={() => dispatch({ type: 'clearDone' })}>Удалить выполненные</button>
        <button type="button" onClick={() => dispatch({ type: 'addMany', count: 2000 })}>+2000 тестовых</button>
        <button type="button" onClick={() => dispatch({ type: 'clearAll' })}>Удалить все</button>
      </div>
    </div>
  );
}


