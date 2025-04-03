'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
// Let TypeScript infer props from the provider itself

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false);
  
  // useEffect only runs on the client, so we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
    // Log to debug when ThemeProvider mounts
    console.log('ThemeProvider mounted with props:', props);
  }, [props]);

  // During server-side rendering and first mount, return children as-is
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
} 