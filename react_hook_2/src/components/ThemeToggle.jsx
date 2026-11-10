import { useTheme } from '../ThemeContext.jsx';
 
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button type="button" onClick={toggle}>
      {theme === 'dark' ? '☀️ Светлая' : '🌙 Тёмная'}
    </button>
  );
}
