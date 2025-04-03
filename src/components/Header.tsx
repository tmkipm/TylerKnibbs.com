'use client'; // Add this directive for client-side hooks

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { Menu } from 'lucide-react'; // Import icons

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // Get current path

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/blog', label: 'Blog' },
    { href: '/chess', label: 'Chess Game' },
    { href: '/resume', label: 'Resume/CV' },
    { href: '/contact', label: 'Contact' },
  ];

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-gray-800 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo/Brand Name */}
        <Link href="/" className="text-xl font-bold hover:text-gray-300">
          Tyler Knibbs
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <nav className="flex space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hover:text-gray-300 ${isActive ? 'font-semibold border-b-2 border-blue-500' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            className="flex items-center px-3 py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
             <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-gray-700`}>
        <nav className="px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
             const isActive = pathname === link.href;
             return (
               <Link
                 key={link.href}
                 href={link.href}
                 className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-600 ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300'}`}
               >
                 {link.label}
               </Link>
             );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header; 