import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { APIClient } from '@/lib/api-client';
import { useMentisStore } from '@/lib/store';
import ReactMarkdown from 'react-markdown';

export const SummaryGeneratorBackend = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cached, setCached] = useState(false);
  const [style, setStyle] = useState('Conceptual');
  const [depth, setDepth] = useState('Intermediate');
  const [length, setLength] = useState('Medium');
  const { toast } = useToast();
  const { mainDocument } = useMentisStore();

  const handleGenerateSummary = async () => {
    if (!mainDocument.text) {
      toast({
        title: 'No Document',
        description: 'Please upload a PDF first',
        variant: 'destructive',
      });
      return;
    }

    if (mainDocument.text.length < 100) {
      toast({
        title: 'Document Too Short',
        description: `Document has only ${mainDocument.text.length} characters. Please upload a longer document.`,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      console.log(`Generating summary for document: ${mainDocument.name} (${mainDocument.text.length} chars)`);
      
      const response = await APIClient.generateSummary(
        mainDocument.text,
        style,
        depth,
        length,
        mainDocument.id
      );
      setSummary(response.summary);
      setCached(response.cached);

      toast({
        title: 'Success!',
        description: response.cached ? 'Summary loaded from cache' : 'Summary generated successfully',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate summary';
      console.error('Summary generation error:', errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mainDocument.text) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Upload a PDF to generate a summary</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Options */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-sm font-medium block mb-2">Style</label>
          <Select value={style} onValueChange={setStyle} disabled={loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Conceptual">Conceptual</SelectItem>
              <SelectItem value="Mathematical">Mathematical</SelectItem>
              <SelectItem value="Coding">Coding</SelectItem>
              <SelectItem value="Bullet Points">Bullet Points</SelectItem>
              <SelectItem value="Paragraph-wise">Paragraph-wise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Depth</label>
          <Select value={depth} onValueChange={setDepth} disabled={loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Friendly">Friendly</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Length</label>
          <Select value={length} onValueChange={setLength} disabled={loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Short">Short</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Long">Long</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleGenerateSummary} disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Summary
          </>
        )}
      </Button>

      {cached && (
        <Card className="p-2 bg-blue-50 border-blue-200">
          <p className="text-xs text-blue-900">📦 Loaded from cache</p>
        </Card>
      )}

      {/* Summary Display */}
      {summary && (
        <Card className="p-6 bg-muted/30 overflow-auto max-h-96">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-2 mb-1" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1" {...props} />,
                li: ({ node, ...props }) => <li className="text-sm" {...props} />,
                p: ({ node, ...props }) => <p className="text-sm mb-2" {...props} />,
                code: ({ node, ...props }) => (
                  <code className="bg-muted px-2 py-1 rounded text-xs" {...props} />
                ),
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        </Card>
      )}
    </div>
  );
};
