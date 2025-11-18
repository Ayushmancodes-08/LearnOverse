import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MindmapNode {
  id: string;
  title: string;
  children?: MindmapNode[];
  level: number;
}

interface InteractiveMindmapProps {
  markdown: string;
}

export const InteractiveMindmap = ({ markdown }: InteractiveMindmapProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Parse markdown into tree structure
  const nodes = useMemo(() => {
    const lines = markdown.split('\n').filter(line => line.trim());
    const root: MindmapNode[] = [];
    const stack: MindmapNode[] = [];

    lines.forEach((line, index) => {
      const match = line.match(/^(#+)\s+(.+)$/);
      if (!match) return;

      const level = match[1].length;
      const title = match[2].trim();
      const id = `node-${index}`;

      const node: MindmapNode = {
        id,
        title,
        children: [],
        level,
      };

      // Find parent
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        root.push(node);
      } else {
        const parent = stack[stack.length - 1];
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      }

      stack.push(node);
    });

    return root;
  }, [markdown]);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: MindmapNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const paddingLeft = depth * 24;

    return (
      <div key={node.id} className="select-none">
        <div
          className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-primary/10 cursor-pointer transition-colors"
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren ? (
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-primary" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          ) : (
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary/50" />
            </div>
          )}

          <span
            className={`text-sm font-medium transition-colors ${
              depth === 0
                ? 'text-base font-bold text-primary'
                : depth === 1
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground'
            }`}
          >
            {node.title}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l-2 border-primary/20 ml-3">
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6 bg-muted/30 overflow-auto max-h-96">
      <div className="space-y-1">
        {nodes.length === 0 ? (
          <p className="text-muted-foreground text-sm">No mindmap content available</p>
        ) : (
          nodes.map(node => renderNode(node))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-border/50">
        <button
          onClick={() => setExpandedNodes(new Set(nodes.flatMap(n => getAllNodeIds(n))))}
          className="text-xs text-primary hover:underline mr-4"
        >
          Expand All
        </button>
        <button
          onClick={() => setExpandedNodes(new Set())}
          className="text-xs text-primary hover:underline"
        >
          Collapse All
        </button>
      </div>
    </Card>
  );
};

function getAllNodeIds(node: MindmapNode): string[] {
  const ids = [node.id];
  if (node.children) {
    node.children.forEach(child => {
      ids.push(...getAllNodeIds(child));
    });
  }
  return ids;
}
