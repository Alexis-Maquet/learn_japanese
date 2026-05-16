type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: unknown;
}

// File System Access API (Chrome/Edge only)
interface FileSystemWritableFileStream extends WritableStream {
  write(data: string | BufferSource | Blob): Promise<void>;
  close(): Promise<void>;
}
interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}
interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: { description: string; accept: Record<string, string[]> }[];
}
declare function showSaveFilePicker(opts?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;

const STORAGE_KEY = 'app_logs';
const MAX_ENTRIES = 500;
const AUTO_SAVE_INTERVAL_MS = 30_000;
const IS_DEV = import.meta.env.DEV;

let fileHandle: FileSystemFileHandle | null = null;
let autoSaveTimer: ReturnType<typeof setInterval> | null = null;

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

function log(level: LogLevel, context: string, message: string, data?: unknown): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    context,
    message,
    ...(data !== undefined && { data }),
  };

  persist(entry);

  if (IS_DEV) {
    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${context}]`;
    if (level === 'error') console.error(prefix, message, data ?? '');
    else if (level === 'warn') console.warn(prefix, message, data ?? '');
    else console.log(prefix, message, data ?? '');
  }
}

async function writeToFile(): Promise<void> {
  if (!fileHandle) return;
  try {
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(getStoredLogs(), null, 2));
    await writable.close();
  } catch (e) {
    if (IS_DEV) console.warn('[logger] Échec écriture fichier', e);
  }
}

async function startAutoSave(): Promise<boolean> {
  if (!('showSaveFilePicker' in window)) {
    console.warn('[logger] File System Access API non supportée (Chrome/Edge requis)');
    return false;
  }
  try {
    fileHandle = await showSaveFilePicker({
      suggestedName: `learn-japanese-logs-${new Date().toISOString().slice(0, 10)}.json`,
      types: [{ description: 'Fichier de logs JSON', accept: { 'application/json': ['.json'] } }],
    });
  } catch {
    // Annulé par l'utilisateur
    return false;
  }

  await writeToFile();
  autoSaveTimer = setInterval(writeToFile, AUTO_SAVE_INTERVAL_MS);

  window.addEventListener('beforeunload', writeToFile, { once: true });

  return true;
}

function stopAutoSave(): void {
  if (autoSaveTimer !== null) {
    clearInterval(autoSaveTimer);
    autoSaveTimer = null;
  }
  fileHandle = null;
}

function exportLogs(): void {
  const content = JSON.stringify(getStoredLogs(), null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `learn-japanese-logs-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const logger = {
  debug: (context: string, message: string, data?: unknown) => log('debug', context, message, data),
  info: (context: string, message: string, data?: unknown) => log('info', context, message, data),
  warn: (context: string, message: string, data?: unknown) => log('warn', context, message, data),
  error: (context: string, message: string, data?: unknown) => log('error', context, message, data),
  getLogs: getStoredLogs,
  clear: () => localStorage.removeItem(STORAGE_KEY),
  /** Téléchargement manuel (un seul fichier, tous navigateurs) */
  export: exportLogs,
  /** Démarre l'écriture automatique dans un fichier local (Chrome/Edge). Retourne true si activé. */
  startAutoSave,
  /** Arrête l'écriture automatique */
  stopAutoSave,
  /** Indique si l'écriture automatique est active */
  get isAutoSaving(): boolean {
    return autoSaveTimer !== null;
  },
};
