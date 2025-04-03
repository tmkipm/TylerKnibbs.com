'use client'; // For using React state and form handling

import React, { useState } from 'react';
import { Mail, Linkedin, Github, Send } from 'lucide-react';
import Link from 'next/link';

// Note: Metadata is handled in src/app/contact/metadata.ts

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(''); // For showing submission status

  // --- TODO: Replace with actual URLs and Email --- 
  const contactEmail = "Tknibbs31@example.com"; // Using example.com domain for safety
  const linkedInUrl = "https://linkedin.com/in/yourprofile";
  const githubUrl = "https://github.com/yourprofile";
  // --- End of TODO --- 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Message sent successfully! Thank you.');
        setFormData({ name: '', email: '', message: '' }); // Clear form
      } else {
        const errorData = await response.json();
        setStatus(`Failed to send message: ${errorData.message || 'Please try again later.'}`);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus('Failed to send message. Please check your connection or try again later.');
    }
  };

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Contact Me</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Get in touch via the form below or through direct channels.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white bg-white dark:bg-opacity-10 transition duration-200"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white bg-white dark:bg-opacity-10 transition duration-200"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white bg-white dark:bg-opacity-10 transition duration-200"
                placeholder="Your message here..."
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                disabled={status === 'Sending...'}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300 shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5 mr-2" /> {status === 'Sending...' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
            {status && (
              <p className={`mt-4 text-sm ${status.includes('Failed') ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                {status}
              </p>
            )}
          </form>
        </section>

        {/* Direct Contact Info */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Direct Contact</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <Mail className="h-6 w-6 mr-3 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                 {/* Using mailto link with placeholder */}
                <a href={`mailto:${contactEmail}`} className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                  {contactEmail}
                </a>
              </div>
            </div>
            <div className="flex items-start">
              <Linkedin className="h-6 w-6 mr-3 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">LinkedIn</h3>
                <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                  {linkedInUrl}
                </a>
              </div>
            </div>
            <div className="flex items-start">
              <Github className="h-6 w-6 mr-3 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">GitHub</h3>
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                  {githubUrl}
                </a>
              </div>
            </div>
          </div>
          {/* Optional: Location */}
          {/* <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">Based in: London, UK</p>
          </div> */}
        </section>
      </div>
    </div>
  );
} 