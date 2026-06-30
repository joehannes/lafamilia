import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:leading-relaxed prose-p:text-slate-600 prose-strong:text-teal-800 prose-ul:list-disc prose-ul:pl-5 prose-li:text-slate-600 prose-li:leading-relaxed prose-hr:border-slate-200 ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;