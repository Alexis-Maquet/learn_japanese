type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: unknown;
}

const STORAGE_KEY = 'app_logs';
const MAX_ENTRIES = 500;
const IS_DEV = import.meta.env.DEV;

function getStoredLogs(): LogEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function persist(entry: LogEntry): void {
  const logs = getStoredLogs();
  logs.push(entry);
  if (logs.length > MAX_ENTRIES) logs.splice(0, logs.length - MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {
    // localStorage plein — pas de log perdu en mémoire, juste pas persisté
  }
}

// JSON.stringify(new Error('x')) donne {} : on garde le nom, le message et la pile
function serializeData(data: unknown): unknown {
  if (data instanceof Error) return { name: data.name, message: data.message, stack: data.stack };
  return data;
}

function log(level: LogLevel, context: string, message: string, data?: unknown): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    context,
    message,
    ...(data !== undefined && { data: serializeData(data) }),
  };

  // Le niveau debug n'est pas conservé en production : il remplirait le localStorage pour rien
  if (level !== 'debug' || IS_DEV) persist(entry);

  if (IS_DEV) {
    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${context}]`;
    if (level === 'error') console.error(prefix, message, data ?? '');
    else if (level === 'warn') console.warn(prefix, message, data ?? '');
    else console.log(prefix, message, data ?? '');
  }
}

export const logger = {
  debug: (context: string, message: string, data?: unknown) => log('debug', context, message, data),
  info: (context: string, message: string, data?: unknown) => log('info', context, message, data),
  warn: (context: string, message: string, data?: unknown) => log('warn', context, message, data),
  error: (context: string, message: string, data?: unknown) => log('error', context, message, data),
  getLogs: getStoredLogs,
  clear: () => localStorage.removeItem(STORAGE_KEY),
};
