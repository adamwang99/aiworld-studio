// Lightweight local library: stores processed results on-device (localStorage).
// Keeps the app self-contained ("Siêu nhẹ" — no server, no DB) while letting
// users revisit and re-export past transcripts, subtitles, translations, voice.

export type LibraryKind = 'transcribe' | 'subtitle' | 'translate' | 'voice';

export type LibraryItem = {
  id: string;
  kind: LibraryKind;
  title: string;
  createdAt: number; // epoch ms
  // Stored payload — text-based kinds keep their content for re-download.
  text?: string;
  srt?: string;
  vtt?: string;
  meta?: Record<string, string | number>;
};

const KEY = 'aiworld.library.v1';
const MAX_ITEMS = 200;

export function loadLibrary(): LibraryItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function persist(items: LibraryItem[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

export function addLibraryItem(item: Omit<LibraryItem, 'id' | 'createdAt'>): LibraryItem {
  const full: LibraryItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  };
  const items = loadLibrary();
  items.unshift(full);
  persist(items);
  return full;
}

export function removeLibraryItem(id: string): LibraryItem[] {
  const items = loadLibrary().filter((i) => i.id !== id);
  persist(items);
  return items;
}

export function clearLibrary(): void {
  persist([]);
}
