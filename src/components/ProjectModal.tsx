import React from 'react';
import Image from 'next/image';
import { Github, Link as LinkIcon, X } from 'lucide-react';
import Link from 'next/link';

// Reuse the Project interface if defined elsewhere, or redefine/import
interface Project {
  title: string;
  description: string;
  longDescription?: string;
  imageUrl?: string;
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  // Prevent clicks inside the modal content from closing it
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose} // Close when clicking the backdrop
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative transform transition-transform duration-300 scale-95 animate-modal-enter"
        onClick={handleContentClick}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
          aria-label="Close project details modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Modal Header */}
        <h2 id="project-modal-title" className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white pr-8">
          {project.title}
        </h2>
        <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium px-3 py-1 rounded-full mb-4">
          {project.category}
        </span>

        {/* Optional Image */}
        {project.imageUrl && project.imageUrl !== '/placeholder-image.png' && (
          <div className="relative h-64 w-full mb-6 rounded overflow-hidden border dark:border-gray-700">
            <Image
              src={project.imageUrl}
              alt={`Screenshot of ${project.title}`}
              layout="fill"
              objectFit="cover"
              className="bg-gray-200 dark:bg-gray-700"
            />
          </div>
        )}

        {/* Long Description */}
        <div className="prose dark:prose-invert max-w-none mb-6">
          <p>{project.longDescription || project.description}</p>
        </div>

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Technologies Used:</h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2.5 py-1 rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {(project.githubUrl || project.liveUrl) && (
          <div className="mt-auto flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {project.githubUrl && (
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors">
                <Github className="h-5 w-5 mr-2" /> View Code
              </Link>
            )}
            {project.liveUrl && project.liveUrl !== '#' && (
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                <LinkIcon className="h-5 w-5 mr-2" /> Live Demo
              </Link>
            )}
          </div>
        )}
      </div>
      
      {/* Add keyframes for modal enter animation */}
      <style jsx global>{`
        @keyframes modal-enter {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-modal-enter {
          animation: modal-enter 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProjectModal; 