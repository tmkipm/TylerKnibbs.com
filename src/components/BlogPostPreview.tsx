import React from 'react';
import Link from 'next/link';
import { Calendar, Tag } from 'lucide-react';

interface BlogPostPreviewProps {
  title: string;
  date: string;
  excerpt: string;
  slug: string; // For linking to the full post
  tags?: string[];
}

const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({
  title,
  date,
  excerpt,
  slug,
  tags = [],
}) => {
  return (
    <article className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-2xl font-semibold mb-2">
        <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {title}
        </Link>
      </h2>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 space-x-4">
        <span className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" /> {date}
        </span>
        {tags.length > 0 && (
          <span className="flex items-center">
            <Tag className="h-4 w-4 mr-1" /> {tags.join(', ')}
          </span>
        )}
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{excerpt}</p>
      <Link href={`/blog/${slug}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
        Read more →
      </Link>
    </article>
  );
};

export default BlogPostPreview; 