import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import {
  ArrowRight, Briefcase, Code, Cpu, Database, FileText,
  GanttChartSquare, Rss // Keep Rss if blog feed is planned, otherwise remove
} from 'lucide-react';

export default function Home() {

  // TODO: Replace placeholders below
  const headshotPath = "/images/placeholder-headshot.png"; // Path to headshot in public/images/
  const prevCompanyName = "[Previous Company Name]";
  const prevCompanyDuty = "[Brief duty/achievement e.g., analyzed customer trends]";
  const techStack = ["Python", "React", "Next.js", "SQL", "Azure", "Power BI", "AWS"]; // Add/remove tech

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="text-center pt-16 pb-20 md:pt-24 md:pb-28 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          {/* Headshot */}
          <Image
            src={headshotPath} // TODO: Update path
            alt="Tyler Knibbs Headshot"
            width={128} // 128px
            height={128} // 128px
            className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white dark:border-gray-700 shadow-lg bg-gray-200 dark:bg-gray-600"
            priority // Load image early
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-white">
            Tyler Knibbs
          </h1>
          <p className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-semibold mb-4">
            Data Analyst & Full-Stack Developer
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Bridging data analysis, engineering, and web development with a deep understanding of UK data regulations.
          </p>
          <Link
            href="/portfolio"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 transition duration-300 shadow-md transform hover:scale-105"
          >
            View My Work <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Core Strengths Overview */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Core Strengths</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <GanttChartSquare className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Data Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">Extracting insights and driving decisions with data.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <Database className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Data Engineering</h3>
            <p className="text-gray-600 dark:text-gray-400">Building robust data pipelines and infrastructure.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <Code className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Web Development</h3>
            <p className="text-gray-600 dark:text-gray-400">Creating responsive and user-friendly web applications.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <Cpu className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">UK Regulatory Knowledge</h3>
            <p className="text-gray-600 dark:text-gray-400">Navigating data protection and tech regulations.</p>
          </div>
        </div>
      </section>

      {/* Recent Roles/Experience Snapshot */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">Recent Experience</h2>
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Currently a <span className="font-semibold">Developer for Data Services</span> at <span className="font-semibold text-blue-600 dark:text-blue-400">Stratagem IPM</span>, focusing on developing web applications and data solutions in the intellectual property domain. Previously worked as a <span className="font-semibold">Data Analyst</span> at <span className="font-semibold italic">{prevCompanyName}</span>, where I focused on {prevCompanyDuty}.
          </p>
          {/* TODO: Consider adding a link to the full Resume page here */}
          {/* <div className="mt-4 text-right"> */}
          {/*  <Link href="/resume" className="text-blue-600 dark:text-blue-400 hover:underline">View Full Resume →</Link> */}
          {/* </div> */}
        </div>
      </section>

      {/* Top Technical Tools */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">Tech Stack</h2>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 max-w-3xl mx-auto">
          {/* TODO: Replace with actual logos if desired, otherwise keep as text badges */}
          {techStack.map((tech) => (
             <span key={tech} className="text-gray-700 dark:text-gray-300 font-medium text-sm border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-700 whitespace-nowrap">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Call to Action Panel */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900 dark:text-white">Interested in my work?</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto">
            Have a project in mind or want to discuss an opportunity? Feel free to browse my portfolio or get in touch.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 transition duration-300 w-full sm:w-auto shadow transform hover:scale-105"
            >
              <Briefcase className="mr-2 h-5 w-5" /> View Portfolio
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white text-lg font-medium rounded-md hover:bg-gray-700 transition duration-300 w-full sm:w-auto shadow transform hover:scale-105"
            >
              <FileText className="mr-2 h-5 w-5" /> Contact Me
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
