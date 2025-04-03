import { getPostData, getAllPostSlugs, PostData } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc'; // Import server component version
import { Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

interface Props {
  params: { slug: string };
}

// Generate metadata dynamically
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const postData = await getPostData(params.slug);
    return {
      title: `${postData.title} - Blog | Tyler Knibbs`,
      description: postData.excerpt,
    };
  } catch (error) {
    // Handle case where post is not found during metadata generation
    return {
      title: "Post Not Found - Blog | Tyler Knibbs",
      description: "The requested blog post could not be found.",
    };
  }
}

// Generate static paths for all posts at build time
export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.map(p => ({ slug: p.params.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  let postData: PostData & { content: string };

  try {
    postData = await getPostData(params.slug);
  } catch (error) {
    // If post doesn't exist (e.g., slug is wrong), show 404
    notFound();
  }

  // Format date nicely (optional)
  const formattedDate = new Date(postData.date).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <article className="prose prose-lg dark:prose-invert max-w-none mx-auto">
      {/* Post Header */}
      <header className="mb-8 border-b dark:border-gray-700 pb-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 !mt-0">
          {postData.title}
        </h1>
        <div className="flex flex-wrap items-center text-base text-gray-500 dark:text-gray-400 space-x-4">
          <span className="flex items-center whitespace-nowrap">
            <Calendar className="h-4 w-4 mr-1.5" /> {formattedDate}
          </span>
          {postData.tags && postData.tags.length > 0 && (
            <div className="flex items-center space-x-2 flex-wrap">
              <Tag className="h-4 w-4 flex-shrink-0" />
              {postData.tags.map(tag => (
                <span key={tag} className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Post Content */}
      <div className="prose prose-blue dark:prose-invert max-w-none 
                     prose-headings:font-semibold dark:prose-headings:text-white
                     prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline
                     prose-strong:font-semibold
                     prose-code:before:content-none prose-code:after:content-none prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
                     prose-blockquote:border-l-blue-500 prose-blockquote:pl-4 prose-blockquote:italic
                     prose-ul:list-disc prose-ol:list-decimal prose-li:my-1">
         {/* Render MDX content */}
         <MDXRemote source={postData.content} />
      </div>

       {/* Back to Blog link */}
       <div className="mt-12 pt-6 border-t dark:border-gray-700">
         <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">
           ← Back to Blog List
         </Link>
       </div>

    </article>
  );
} 