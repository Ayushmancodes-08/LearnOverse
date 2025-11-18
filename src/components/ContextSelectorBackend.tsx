import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useMentisStore } from '@/lib/store';

export const ContextSelectorBackend = () => {
  const { mainDocument, resources, selectedContext, setSelectedContext, resetGeneratedContent } =
    useMentisStore();

  // Build context options
  const contextOptions = [];

  if (mainDocument.name) {
    contextOptions.push({
      id: mainDocument.id,
      label: `📄 ${mainDocument.name}`,
      type: 'main',
    });
  }

  resources.forEach(resource => {
    contextOptions.push({
      id: resource.id,
      label: `📚 ${resource.name}`,
      type: 'resource',
    });
  });

  if (contextOptions.length > 1) {
    contextOptions.push({
      id: 'all',
      label: '🔗 All Combined',
      type: 'combined',
    });
  }

  const handleContextChange = (newContextId: string) => {
    setSelectedContext(newContextId);
    resetGeneratedContent();
  };

  if (contextOptions.length === 0) {
    return (
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-medium">No Documents Loaded</p>
            <p className="text-xs mt-1">Upload a PDF to get started</p>
          </div>
        </div>
      </Card>
    );
  }

  if (contextOptions.length === 1) {
    return (
      <Card className="p-3 bg-blue-50 border-blue-200">
        <p className="text-sm font-medium text-blue-900">{contextOptions[0].label}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Study Context</label>
      <Select value={selectedContext} onValueChange={handleContextChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {contextOptions.map(option => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedContext === 'all' && contextOptions.length > 2 && (
        <Card className="p-2 bg-green-50 border-green-200">
          <p className="text-xs text-green-900">
            ✓ Using all {contextOptions.length - 1} documents
          </p>
        </Card>
      )}
    </div>
  );
};
