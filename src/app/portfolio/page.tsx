'use client'; // Need client-side state for modal

import React, { useState } from 'react';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal'; // Import the modal component

// Placeholder project data - replace with actual project details
interface Project {
  title: string;
  description: string;
  longDescription?: string; // Added for modal
  imageUrl?: string;
  techStack?: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
}

const projects: Project[] = [
  {
    title: "Sales Analytics Dashboard",
    description: "An interactive Power BI dashboard providing insights into sales performance, trends, and key metrics.",
    longDescription: "An interactive Power BI dashboard providing deep insights into sales performance, trends, key metrics, and regional breakdowns. Designed for executive use.",
    imageUrl: "/images/sales-dashboard.png", // Example path
    techStack: ["Power BI", "SQL", "Data Modeling", "DAX"],
    category: "Data Analysis",
    liveUrl: "#", // Link to live dashboard if public
  },
  {
    title: "Personal Portfolio Website",
    description: "This responsive website built with Next.js and Tailwind CSS to showcase my skills and projects.",
    longDescription: "This responsive website built with Next.js, TypeScript, and Tailwind CSS to showcase my skills and projects. Features include dark mode, blog integration (Markdown), and responsive design.",
    imageUrl: "/images/portfolio-website.png", // Example path
    techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    category: "Web Development",
    githubUrl: "https://github.com/yourprofile/tmk-website", // Link to repo
  },
  {
    title: "Customer Segmentation Analysis",
    description: "Performed clustering analysis on customer data using Python to identify distinct market segments.",
    longDescription: "Performed clustering analysis (K-Means) on customer transaction data using Python (Pandas, Scikit-learn) to identify distinct market segments for targeted marketing campaigns. Visualized results using Matplotlib/Seaborn.",
    imageUrl: "/images/customer-segmentation.png", // Example path
    techStack: ["Python", "Pandas", "Scikit-learn", "Jupyter", "Matplotlib"],
    category: "Data Analysis",
    githubUrl: "#", // Link to analysis/report repo
  },
  // Add more projects as needed
];

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openModal = (project: Project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Portfolio</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">A selection of my work across different domains.</p>
      </section>

      {/* Project Grid */}
      <section>
        {/* Filters Placeholder */}
        {/* <div className="mb-8 text-center"> */}
        {/*   <button className="px-4 py-2 mr-2 bg-blue-500 text-white rounded">All</button> */}
        {/*   <button className="px-4 py-2 mr-2 bg-gray-200 dark:bg-gray-700 rounded">Data Projects</button> */}
        {/*   <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Web Dev</button> */}
        {/* </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} onClick={() => openModal(project)} className="cursor-pointer h-full">
              <ProjectCard
                title={project.title}
                description={project.description}
                imageUrl={project.imageUrl}
                techStack={project.techStack}
                category={project.category}
                githubUrl={project.githubUrl}
                liveUrl={project.liveUrl}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Project Modal */} 
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={closeModal} />
      )}
    </div>
  );
} 