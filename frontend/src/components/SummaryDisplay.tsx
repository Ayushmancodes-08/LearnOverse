import { memo, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { downloadSummary } from '@/lib/summary-utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

interface SummaryDisplayProps {
  summary: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

// Custom markdown component mappings for styling
const markdownComponents = {
  h1: ({ children, ...props }: any) => (
    <h1 className="text-2xl font-bold mb-4 mt-6 text-foreground first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-xl font-semibold mb-3 mt-5 text-foreground" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-lg font-medium mb-2 mt-4 text-foreground" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 className="text-base font-medium mb-2 mt-3 text-foreground" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: any) => (
    <p className="mb-3 text-foreground leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside mb-3 space-y-1 ml-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside mb-3 space-y-1 ml-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-foreground leading-relaxed" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-bold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic text-foreground" {...props}>
      {children}
    </em>
  ),
  code: ({ children, ...props }: any) => (
    <code className="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }: any) => (
    <pre className="bg-secondary p-3 rounded-md mb-3 overflow-x-auto" {...props}>
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-primary pl-4 italic my-3 text-muted-foreground" {...props}>
      {children}
    </blockquote>
  ),
  a: ({ children, ...props }: any) => (
    <a className="text-primary hover:underline" {...props}>
      {children}
    </a>
  ),
  hr: ({ ...props }: any) => (
    <hr className="my-4 border-border" {...props} />
  ),
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto mb-3">
      <table className="min-w-full border-collapse border border-border" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead className="bg-secondary" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: any) => (
    <tbody {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }: any) => (
    <tr className="border-b border-border" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: any) => (
    <th className="px-4 py-2 text-left font-semibold text-foreground" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="px-4 py-2 text-foreground" {...props}>
      {children}
    </td>
  ),
};

// Memoize the component to prevent unnecessary re-renders
const SummaryDisplayComponent = ({
  summary,
  loading,
  error,
  onRetry,
}: SummaryDisplayProps) => {
  // Memoize download handler to prevent recreation on every render
  const handleDownload = useMemo(() => 
    (format: 'txt' | 'md' | 'html') => {
      downloadSummary(summary, format);
    },
    [summary]
  );

  // Memoize markdown plugins array to prevent recreation
  const remarkPlugins = useMemo(() => [remarkGfm], []);
  const rehypePlugins = useMemo(() => [rehypeSanitize], []);

  // Loading state
  if (loading) {
    return (
      <Card className="flex items-center justify-center h-[600px] bg-secondary/30">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Generating summary...</p>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="flex items-center justify-center h-[600px] bg-secondary/30">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Failed to Generate Summary</p>
            <p className="text-xs text-muted-foreground mb-4">{error}</p>
            <Button onClick={onRetry} variant="default" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Summary display with markdown rendering
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-foreground">Document Summary</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleDownload('txt')}>
              Plain Text (.txt)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('md')}>
              Markdown (.md)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('html')}>
              HTML (.html)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Card className="p-6 bg-secondary/30 max-h-[600px] overflow-y-auto">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
            components={markdownComponents}
          >
            {summary}
          </ReactMarkdown>
        </div>
      </Card>
    </div>
  );
};

// Export memoized component
export const SummaryDisplay = memo(SummaryDisplayComponent);
SummaryDisplay.displayName = 'SummaryDisplay';
