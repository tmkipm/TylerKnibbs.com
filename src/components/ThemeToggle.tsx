'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Only render the toggle on the client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    console.log('ThemeToggle mounted');
    console.log('Initial theme:', theme);
    console.log('Initial resolvedTheme:', resolvedTheme);
  }, [theme, resolvedTheme]);

  const toggleTheme = () => {
    console.log('Toggle clicked');
    console.log('Current theme:', theme);
    console.log('Current resolvedTheme:', resolvedTheme);
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    console.log('Setting theme to:', newTheme);
    setTheme(newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
      aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-gray-300" />
      )}
    </button>
  );
} 