'use client';
import { useTheme } from '../hooks/usehook';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-accent-red text-white dark:bg-white dark:text-red-600 shadow-lg transition duration-300"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
