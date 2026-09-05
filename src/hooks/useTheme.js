import { useState, useEffect, useCallback } from 'react';
import { ROLE_THEMES } from '../config/themes';

export function useTheme(role) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem(`pm-dark-${role}`);
    return stored ? JSON.parse(stored) : false;
  });

  const applyTheme = useCallback((dark, roleName) => {
    const theme = ROLE_THEMES[roleName] || ROLE_THEMES.admin;
    if (!theme) return;
    const palette = dark ? theme.dark : theme.light;
    const root = document.documentElement;
    Object.entries(palette).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
    root.setAttribute('data-pm-role', roleName);
    root.setAttribute('data-pm-mode', dark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (role) {
      applyTheme(isDark, role);
      localStorage.setItem(`pm-dark-${role}`, JSON.stringify(isDark));
    }
  }, [isDark, role, applyTheme]);

  const toggle = () => setIsDark(d => !d);

  return { isDark, toggle };
}
