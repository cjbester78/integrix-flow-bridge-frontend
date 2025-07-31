import { SystemLogEntry } from '@/hooks/useSystemLogs';

class SystemErrorLogger {
  private listeners: ((log: SystemLogEntry) => void)[] = [];
  private readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

  constructor() {
    // Listen for unhandled errors
    window.addEventListener('error', (event) => {
      this.logError('System Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', {
        reason: event.reason,
        stack: event.reason?.stack,
      });
    });
  }

  async logError(message: string, details?: any) {
    const logEntry: SystemLogEntry = {
      id: `sys-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      details,
      source: 'system',
      sourceId: 'error-logger',
      sourceName: 'System Error Logger',
    };

    await this.sendLogToBackend(logEntry);
    this.notifyListeners(logEntry);
  }

  async logInfo(message: string, details?: any, source: SystemLogEntry['source'] = 'system', sourceId?: string, sourceName?: string) {
    const logEntry: SystemLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      details,
      source,
      sourceId: sourceId || 'general',
      sourceName: sourceName || 'System',
    };

    await this.sendLogToBackend(logEntry);
    this.notifyListeners(logEntry);
  }

  async logWarning(message: string, details?: any, source: SystemLogEntry['source'] = 'system', sourceId?: string, sourceName?: string) {
    const logEntry: SystemLogEntry = {
      id: `warn-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      details,
      source,
      sourceId: sourceId || 'general',
      sourceName: sourceName || 'System',
    };

    await this.sendLogToBackend(logEntry);
    this.notifyListeners(logEntry);
  }

  private async sendLogToBackend(logEntry: SystemLogEntry): Promise<void> {
    try {
      await fetch(`${this.API_BASE_URL}/system/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      console.error('Failed to send log to backend:', error);
    }
  }

  async getAllLogs(): Promise<SystemLogEntry[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/system/logs`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch logs from backend:', error);
      return [];
    }
  }

  async getFilteredLogs(filters: {
    source?: SystemLogEntry['source'];
    sourceId?: string;
    level?: SystemLogEntry['level'];
    search?: string;
  }): Promise<SystemLogEntry[]> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      
      const endpoint = `${this.API_BASE_URL}/system/logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch filtered logs from backend:', error);
      return [];
    }
  }

  onLogUpdate(callback: (log: SystemLogEntry) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  private notifyListeners(log: SystemLogEntry) {
    this.listeners.forEach(listener => listener(log));
  }
}

export const systemErrorLogger = new SystemErrorLogger();