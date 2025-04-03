import React from 'react';
import Link from 'next/link';
import { Linkedin, Github } from 'lucide-react'; // Import icons

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // TODO: Replace with actual URLs
  const linkedInUrl = "https://linkedin.com/in/yourprofile";
  const githubUrl = "https://github.com/yourprofile";

  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-400 py-8 mt-auto border-t border-gray-700 dark:border-gray-800">
      <div className="container mx-auto px-4 text-center">
        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-4">
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
            aria-label="Tyler Knibbs on LinkedIn"
          >
            <Linkedin className="h-6 w-6" />
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-100 transition-colors"
            aria-label="Tyler Knibbs on GitHub"
          >
            <Github className="h-6 w-6" />
          </a>
          {/* Add other social links as needed */}
        </div>

        {/* Additional Links */}
        <div className="mb-4 space-x-4 text-sm">
          {/* TODO: Uncomment and implement if a privacy policy page is created */}
          {/* <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link> */}
        </div>

        {/* Copyright */}
        <p className="text-sm">
          &copy; {currentYear} Tyler Knibbs. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 