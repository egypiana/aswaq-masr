interface SEOContentProps {
  content: string;
}

export default function SEOContent({ content }: SEOContentProps) {
  return (
    <article
      className="mt-10 prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-h2:text-lg prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-base prose-h3:font-bold prose-p:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
