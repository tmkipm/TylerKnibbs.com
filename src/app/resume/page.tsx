import { Download, Briefcase, GraduationCap, Wrench, UserCircle, Star, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Resume/CV - Tyler Knibbs",
  description: "View the professional resume/CV of Tyler Knibbs, detailing work experience, education, and skills.",
};

export default function ResumePage() {
  // CV Data
  const cvData = {
    name: "Tyler Knibbs",
    title: "Developer & Data Analyst",
    location: "London, GB",
    phone: "07748 106 8170",
    email: "Tknibbs31@gmail.com",
    linkedin: "", // Add LinkedIn URL here
    summary: "Experienced Data Analyst and Developer specializing in SQL, Power BI, Python, and Azure, with a strong track record in data migrations, analytics automation, and strategic decision-making support. Skilled in agile environments, I excel in translating complex technical challenges into clear insights. My expertise includes data analytics, data engineering, databases, education, cloud migrations, and implementing secure data solutions in highly regulated industries. Currently open to new opportunities and actively engaged in professional development through personal projects.",
    skills: {
      "Data Analysis & BI Tools": ["Power BI (Advanced)", "SSRS", "Excel", "Power Apps"],
      "Programming Languages": ["SQL (Mastery: MS SQL, SQL Server)", "Python (Data Analysis)", "PHP", "R (Basic)", "Swift (Learning)"],
      "Cloud Technologies": ["Azure (Full migration experience)", "AWS Fundamentals"],
      "Frameworks & Platforms": [".NET Framework", "ServiceNow", "Power Apps"],
      "Security & Compliance": ["Data Security", "Privacy Standards (Legal sector experience)"],
      "Web Development": ["UI/UX Principles", "Frontend & Backend Development"]
    },
    experience: [
      {
        title: "Developer for Data Services",
        company: "Stratagem IPM",
        dates: "Mar 2023 – Dec 2024",
        location: "", // Add location if available
        points: [
          "Led creation of advanced Power BI dashboards to deliver business-critical insights for executive decision-making within intellectual property law.",
          "Supported infrastructure transition from on-premises SQL Server to Azure Cloud, including data migration, cloud architecture, and process modernization.",
          "Improved operational efficiency through automation of financial and performance reports, significantly reducing manual overhead.",
          "Ensured rigorous compliance with security, data protection, and privacy standards required in the legal sector.",
          "Led redevelopment of the company website (UI/UX, backend architecture [.NET], cybersecurity)."
        ]
      },
      {
        title: "Junior Developer for Data Services",
        company: "Stratagem IPM",
        dates: "Aug 2021 – Mar 2023",
        location: "", // Add location if available
        points: [
          "Developed a PHP-based data integrity checking tool, automating manual processes and saving 100+ hours annually.",
          "Transitioned firm-wide reporting from SSRS to Power BI, enhancing visualization and operational decision-making capabilities.",
          "Automated monthly financial reporting, cutting manual effort by 16 hours/month/employee.",
          "Delivered client-specific reporting solutions and technical support, significantly improving client satisfaction and operational efficiency."
        ]
      },
      {
        title: "Data & IT Apprenticeship Instructor (Freelance, Part-Time)",
        company: "Contract Work",
        dates: "Apr 2024 – Feb 2025",
        location: "", // Add location if available
        points: [
          "Delivered training and mentoring for Level 4 IT and Data Analytics apprentices, covering SQL, Python, data visualization, cloud computing fundamentals, and professional best practices.",
          "Developed curriculum, delivered structured lectures, assessed practical projects, and provided direct career mentorship."
        ]
      },
      {
        title: "Customer Service and Logistics",
        company: "Various Companies",
        dates: "2014 – 2021",
        location: "", // Add location if available
        points: [
          "Developed strong interpersonal, communication, and client-relationship management skills through customer-facing and logistical roles."
        ]
      }
    ],
    education: [
      {
        degree: "BSc Computer Science",
        institution: "UEA",
        year: "2021",
        location: "Norwich, UK" // Assumed location
      },
      {
        degree: "Level 3 Extended Diploma in IT",
        institution: "Havering Sixth Form",
        year: "2017"
      },
      {
        degree: "11 GCSEs (A–C)",
        institution: "Gaynes",
        year: "2012"
      }
    ],
    certifications: [
      {
        name: "Power BI Data Analyst Specialization",
        issuer: "Microsoft",
        year: "2024"
      },
      {
        name: "AWS Fundamentals Specialization",
        issuer: "Amazon Web Services",
        year: "2024"
      },
      {
        name: "Trade Mark Support Professional",
        issuer: "CITMA",
        year: "2022"
      }
    ],
    courses: [
      { name: "Migrating to the AWS Cloud", issuer: "Amazon Web Services", grade: "95.78%" },
      { name: "AWS Cloud Technical Essentials", issuer: "Amazon Web Services", grade: "100%" },
      { name: "Architecting Solutions on AWS", issuer: "Amazon Web Services", grade: "97.14%" },
      { name: "Databases and SQL for Data Science with Python", issuer: "IBM", grade: "92.62%" , notes: "With Honors" },
      { name: "Introduction to Relational Databases (RDBMS)", issuer: "IBM", grade: "84.90%" },
      { name: "Deploy and Maintain Power BI Assets and Capstone project", issuer: "Microsoft", grade: "93%" },
      { name: "Introduction to Data Engineering", issuer: "IBM", grade: "93.20%" },
      { name: "Python for Data Science, AI & Development", issuer: "IBM", grade: "84.66%" },
      { name: "Hands-on Introduction to Linux Commands and Shell Scripting", issuer: "IBM", grade: "97%" },
      { name: "Microsoft PL-300 Exam Preparation and Practice", issuer: "Microsoft", grade: "86%" },
      { name: "Preparing Data for Analysis with Microsoft Excel", issuer: "Microsoft", grade: "87.33%" },
      { name: "Extract, Transform and Load Data in Power BI", issuer: "Microsoft", grade: "83.66%" },
      { name: "Harnessing the Power of Data with Power BI", issuer: "Microsoft", grade: "82.50%" },
      { name: "Data Modeling in Power BI", issuer: "Microsoft", grade: "92.66%" },
      { name: "Creative Designing in Power BI", issuer: "Microsoft", grade: "84%" },
      { name: "Data Science Math Skills", issuer: "Duke University", grade: "98.07%" },
      { name: "Foundations: Data, Data, Everywhere", issuer: "Google", grade: "94.12%" },
      { name: "Data Analysis and Visualization with Power BI", issuer: "Microsoft", grade: "88.33%" },
    ],
    resumePdfPath: "/Tyler_Knibbs_CV.pdf" // <-- UPDATE THIS PATH if different
  };

  return (
    <div className="space-y-12">
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-1 text-gray-900 dark:text-white">Resume / CV</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">My professional background and skills.</p>
        </div>
        <a
          href={cvData.resumePdfPath}
          download
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300 shadow whitespace-nowrap"
        >
          <Download className="h-5 w-5 mr-2" /> Download Resume
        </a>
      </section>

      {/* Professional Summary */}
      <section>
        <h2 className="text-3xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
           <UserCircle className="h-6 w-6 mr-3 text-gray-500" /> Professional Summary
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
          {cvData.summary}
        </p>
      </section>

      {/* Work Experience */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 flex items-center text-gray-800 dark:text-gray-200">
          <Briefcase className="h-6 w-6 mr-3 text-blue-500" /> Work Experience
        </h2>
        <div className="space-y-8">
          {cvData.experience.map((job, index) => (
            <div key={index} className={`border-l-4 ${index === 0 ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'} pl-6 py-2`}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{job.title}</h3>
              <p className="text-md font-medium text-gray-700 dark:text-gray-300">{job.company}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {job.dates} {job.location && `| ${job.location}`}
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                {job.points.map((point, i) => <li key={i}>{point}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 flex items-center text-gray-800 dark:text-gray-200">
          <GraduationCap className="h-6 w-6 mr-3 text-green-500" /> Education
        </h2>
        <div className="space-y-4">
           {cvData.education.map((edu, index) => (
             <div key={index} className={`border-l-4 ${index === 0 ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'} pl-6 py-2`}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
              <p className="text-md font-medium text-gray-700 dark:text-gray-300">{edu.institution}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {edu.year} {edu.location && `| ${edu.location}`}
              </p>
            </div>
           ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 flex items-center text-gray-800 dark:text-gray-200">
          <Wrench className="h-6 w-6 mr-3 text-purple-500" /> Technical Skills
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {Object.entries(cvData.skills).map(([category, skillsList]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600 pb-1">{category}</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 mt-2">
                {skillsList.map((skill, i) => <li key={i}>{skill}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 flex items-center text-gray-800 dark:text-gray-200">
          <Star className="h-6 w-6 mr-3 text-yellow-500" /> Certifications
        </h2>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
          {cvData.certifications.map((cert, index) => (
            <li key={index}>
              <span className="font-semibold">{cert.name}</span> - {cert.issuer} ({cert.year})
            </li>
          ))}
        </ul>
      </section>

      {/* Completed Courses & Training */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 flex items-center text-gray-800 dark:text-gray-200">
          <BookOpen className="h-6 w-6 mr-3 text-teal-500" /> Completed Courses & Training
        </h2>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
          {cvData.courses.map((course, index) => (
            <li key={index}>
              <span className="font-semibold">{course.name}</span> - {course.issuer}
              {course.grade && <span className="text-sm text-gray-500 dark:text-gray-300 ml-2">(Grade: {course.grade})</span>}
              {course.notes && <span className="text-sm text-blue-500 dark:text-blue-400 ml-2 font-medium">({course.notes})</span>}
            </li>
          ))}
        </ul>
      </section>

       <div className="text-center mt-12">
         <a
           href={cvData.resumePdfPath}
           download
           className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300 shadow"
         >
           <Download className="h-5 w-5 mr-2" /> Download Full Resume (PDF)
         </a>
       </div>
    </div>
  );
} 