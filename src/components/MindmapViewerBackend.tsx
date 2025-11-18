import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { APIClient } from '@/lib/api-client';
import { useMentisStore } from '@/lib/store';
import { InteractiveMindmap } from './InteractiveMindmap';

export const MindmapViewerBackend = () => {
  const [mindmap, setMindmap] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cached, setCached] = useState(false);
  const { toast } = useToast();
  const { mainDocument } = useMentisStore();

  const handleGenerateMindmap = async () => {
    if (!mainDocument.text) {
      toast({
        title: 'No Document',
        description: 'Please upload a PDF first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await APIClient.generateMindmap(mainDocument.text, mainDocument.id);
      setMindmap(response.markdown);
      setCached(response.cached);

      toast({
        title: 'Success!',
        description: response.cached ? 'Mindmap loaded from cache' : 'Mindmap generated successfully',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate mindmap';
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
        <p className="text-muted-foreground">Upload a PDF to generate a mindmap</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleGenerateMindmap} disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Mindmap
            </>
          )}
        </Button>
      </div>

      {cached && (
        <Card className="p-2 bg-blue-50 border-blue-200">
          <p className="text-xs text-blue-900">📦 Loaded from cache</p>
        </Card>
      )}

      {mindmap && <InteractiveMindmap markdown={mindmap} />}
    </div>
  );
};
