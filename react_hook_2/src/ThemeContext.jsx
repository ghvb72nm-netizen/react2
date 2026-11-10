import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage.js';

 
const ThemeContext = createContext(null);
 
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
 
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
 
  const value = useMemo(
    () => ({
      theme,
      toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    }),
    [theme, setTheme]
    );

 
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
 
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme нужно вызывать внутри ThemeProvider');
  return ctx;
}
