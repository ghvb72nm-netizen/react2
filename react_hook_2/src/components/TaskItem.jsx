import { memo } from 'react';
 
export const TaskItem = memo(function TaskItem({ task, onToggle, onRemove }) {
  return (
    <li className={task.done ? 'done' : ''}>
      <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
      <span>{task.text}</span>
      <button type="button" aria-label="Удалить" onClick={() => onRemove(task.id)}>×</button>
    </li>
  );
});
