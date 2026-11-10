export function tasksReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, action.task];
    case 'toggle':
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case 'remove':
      return state.filter((t) => t.id !== action.id);
    case 'clearDone':
      return state.filter((t) => !t.done);
    case 'clearAll':
      return [];
    case 'addMany':
      return [
        ...state,
        ...Array.from({ length: action.count }, (_, i) => ({
          id: Date.now() + i,
          text: 'Тестовая задача ' + (state.length + i + 1),
          done: false,
        })),
      ];
    default:
      return state;
  }
}
