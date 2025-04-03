import BlogPostPreview from '@/components/BlogPostPreview';
import type { Metadata } from 'next';
import { getSortedPostsData } from '@/lib/posts'; // Import the function to get posts

export const metadata: Metadata = {
  title: "Blog - Tyler Knibbs",
  description: "Thoughts and insights from Tyler Knibbs on tech, data, career development, and UK regulations.",
};

export default function BlogPage() {
  const posts = getSortedPostsData(); // Fetch posts using the utility function

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Blog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Sharing insights on technology, data, and career growth.</p>
      </section>

      {/* Blog Post List */}
      <section>
        {posts.length > 0 ? (
          <div className="space-y-8 max-w-3xl mx-auto">
            {posts.map((post) => (
              <BlogPostPreview
                key={post.slug}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
                slug={post.slug}
                tags={post.tags}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No blog posts available yet. Check back soon!</p>
        )}
        {/* Optional: Pagination could go here if many posts */}
      </section>
    </div>
  );
} 