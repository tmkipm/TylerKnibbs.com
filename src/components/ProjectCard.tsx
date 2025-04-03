import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Link as LinkIcon } from 'lucide-react'; // Icons for links

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl?: string; // Optional image URL
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string; // e.g., 'Data Analysis', 'Web Development'
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  imageUrl = '/placeholder-image.png', // Default placeholder
  techStack = [],
  githubUrl,
  liveUrl,
  category,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={`Screenshot of ${title}`}
          layout="fill"
          objectFit="cover"
          className="bg-gray-200 dark:bg-gray-700" // Background for placeholder or while loading
        />
         <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
          {category}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{description}</p>

        {techStack.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Technologies Used:</h4>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span key={tech} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {githubUrl && (
            <Link href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="View source code on GitHub">
              <Github className="h-6 w-6" />
            </Link>
          )}
          {liveUrl && (
            <Link href={liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="View live demo">
              <LinkIcon className="h-6 w-6" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 