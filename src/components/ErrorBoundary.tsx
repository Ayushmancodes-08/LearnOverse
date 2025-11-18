import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-8 bg-red-50 border-red-200">
          <div className="flex gap-4">
            <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-red-900 mb-2">Something went wrong</h2>
              <p className="text-sm text-red-800 mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <Button onClick={this.handleReset} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
