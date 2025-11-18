import { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Loader2, ZoomIn, ZoomOut, Maximize2, RotateCcw, Download } from 'lucide-react';
import './MindmapViewer.css';

interface MindmapViewerProps {
  markdown: string;
  loading?: boolean;
}

// Declare global types for markmap
declare global {
  interface Window {
    markmap?: {
      Transformer: any;
      Markmap: any;
    };
  }
}

export const MindmapViewer = ({ markdown, loading }: MindmapViewerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const markmapRef = useRef<any>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load markmap scripts from CDN
  useEffect(() => {
    if (scriptsLoaded) return;

    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/d3@7'),
      loadScript('https://cdn.jsdelivr.net/npm/markmap-view@0.15.4'),
      loadScript('https://cdn.jsdelivr.net/npm/markmap-lib@0.15.4/dist/browser/index.min.js'),
    ])
      .then(() => setScriptsLoaded(true))
      .catch(() => {
        // Failed to load markmap scripts
      });
  }, [scriptsLoaded]);

  useEffect(() => {
    if (!markdown || !svgRef.current || loading || !scriptsLoaded || !window.markmap) return;

    try {
      const { Transformer, Markmap } = window.markmap;
      const transformer = new Transformer();
      const { root } = transformer.transform(markdown);

      if (!markmapRef.current) {
        markmapRef.current = Markmap.create(svgRef.current, {
          autoFit: true,
          duration: 500,
          color: (node: any) => {
            // Custom color scheme for better visuals
            const colors = [
              '#8b5cf6', // purple
              '#3b82f6', // blue
              '#10b981', // green
              '#f59e0b', // amber
              '#ef4444', // red
              '#ec4899', // pink
            ];
            return colors[node.depth % colors.length];
          },
          paddingX: 12,
          spacingVertical: 10,
          spacingHorizontal: 80,
        });
      }

      markmapRef.current.setData(root);
      markmapRef.current.fit();
    } catch (error) {
      // Error rendering mindmap
    }
  }, [markdown, loading, scriptsLoaded]);

  // Zoom controls
  const handleZoomIn = () => {
    if (markmapRef.current) {
      markmapRef.current.rescale(1.2);
    }
  };

  const handleZoomOut = () => {
    if (markmapRef.current) {
      markmapRef.current.rescale(0.8);
    }
  };

  const handleFit = () => {
    if (markmapRef.current) {
      markmapRef.current.fit();
    }
  };

  const handleReset = () => {
    if (markmapRef.current && markdown) {
      const { Transformer } = window.markmap!;
      const transformer = new Transformer();
      const { root } = transformer.transform(markdown);
      markmapRef.current.setData(root);
      markmapRef.current.fit();
    }
  };

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mindmap.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (loading) {
    return (
      <Card className="flex items-center justify-center h-[600px] bg-secondary/30">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Generating mindmap...</p>
        </div>
      </Card>
    );
  }

  if (!markdown) {
    return (
      <Card className="flex items-center justify-center h-[600px] bg-secondary/30">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No Mindmap Generated</p>
            <p className="text-xs text-muted-foreground mt-1">Upload a document to generate a mindmap</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <Card className="overflow-hidden bg-gradient-to-br from-secondary/20 to-secondary/40 border-2">
        {/* Control Panel */}
        <div className="absolute top-4 right-4 z-10 flex gap-2 bg-background/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            title="Zoom In"
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFit}
            title="Fit to Screen"
            className="h-8 w-8"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            title="Reset View"
            className="h-8 w-8"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <div className="w-px bg-border" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownloadSVG}
            title="Download SVG"
            className="h-8 w-8"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="h-8 w-8"
          >
            <Maximize2 className={`h-4 w-4 ${isFullscreen ? 'text-primary' : ''}`} />
          </Button>
        </div>

        {/* Mindmap Canvas */}
        <div className="relative">
          <svg
            ref={svgRef}
            className={`w-full transition-all ${isFullscreen ? 'h-screen' : 'h-[600px]'}`}
            style={{ 
              background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
              cursor: 'grab'
            }}
          />
          
          {/* Subtle grid overlay for better depth perception */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        {/* Instructions overlay */}
        {!loading && markdown && (
          <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border text-xs text-muted-foreground">
            💡 <span className="font-medium">Tip:</span> Click nodes to expand/collapse • Drag to pan • Scroll to zoom
          </div>
        )}
      </Card>
    </div>
  );
};
