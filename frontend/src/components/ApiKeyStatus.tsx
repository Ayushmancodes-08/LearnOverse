import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { apiKeyManager } from '@/lib/api-key-manager';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

export const ApiKeyStatus = () => {
  const [status, setStatus] = useState(apiKeyManager.getStatus());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Update status every 5 seconds
    const interval = setInterval(() => {
      setStatus(apiKeyManager.getStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (status.available === 0) return 'destructive';
    if (status.available < status.total / 2) return 'warning';
    return 'success';
  };

  const getStatusIcon = () => {
    if (status.available === 0) return <AlertCircle className="w-4 h-4" />;
    if (status.available < status.total / 2) return <Activity className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <Card 
      className="p-3 bg-secondary/50 border-border cursor-pointer hover:bg-secondary/70 transition-all"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-foreground">API Keys</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={getStatusColor() as any} className="text-xs">
            {status.available}/{status.total}
          </Badge>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Available:</span>
            <span className="text-foreground font-medium">{status.available}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Blocked:</span>
            <span className="text-destructive font-medium">{status.blocked}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Total:</span>
            <span className="text-foreground font-medium">{status.total}</span>
          </div>
          
          {status.blocked > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Blocked keys will auto-recover after cooldown period
            </p>
          )}
        </div>
      )}
    </Card>
  );
};
