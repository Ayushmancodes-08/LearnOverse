export interface ErrorLog {
  timestamp: Date;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;

  log(
    message: string,
    severity: 'info' | 'warning' | 'error' | 'critical' = 'error',
    context?: Record<string, any>,
    stack?: string
  ) {
    const errorLog: ErrorLog = {
      timestamp: new Date(),
      message,
      stack,
      context,
      severity,
    };

    this.logs.push(errorLog);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      const logFn = severity === 'critical' ? console.error : console.warn;
      logFn(`[${severity.toUpperCase()}] ${message}`, context);
    }

    // Send to backend in production
    if (import.meta.env.PROD && severity === 'critical') {
      this.sendToBackend(errorLog);
    }
  }

  private async sendToBackend(errorLog: ErrorLog) {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      await fetch(`${apiUrl}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorLog),
      }).catch(() => {
        // Silently fail if logging endpoint is not available
      });
    } catch (error) {
      // Prevent infinite loops
      console.error('Failed to send error log to backend');
    }
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  getRecentErrors(count: number = 10): ErrorLog[] {
    return this.logs.slice(-count);
  }
}

export const errorLogger = new ErrorLogger();
