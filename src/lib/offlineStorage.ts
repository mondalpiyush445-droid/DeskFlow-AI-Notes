import { Note, Folder, UserProfile } from '../types';
import { INITIAL_NOTES, INITIAL_FOLDERS } from '../data/initialNotes';

const STORAGE_KEYS = {
  NOTES: 'noirnotes_notes_v1',
  FOLDERS: 'noirnotes_folders_v1',
  USER: 'noirnotes_user_v1',
  PENDING_SYNC: 'noirnotes_pending_sync_v1',
  THEME: 'noirnotes_theme_v1',
  SUPABASE_CONFIG: 'noirnotes_supabase_config_v1',
  APP_NAME: 'noirnotes_app_name_v1',
};

export interface StoredSupabaseConfig {
  url: string;
  anonKey: string;
}

export function getCustomAppName(): string {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.APP_NAME);
    if (data) return data;
  } catch (e) {
    console.error(e);
  }
  return 'DeskFlow AI Notes';
}

export function saveCustomAppName(name: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_NAME, name);
  } catch (e) {
    console.error(e);
  }
}

export function getLocalNotes(): Note[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!data) {
      saveLocalNotes(INITIAL_NOTES);
      return INITIAL_NOTES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to read local notes:', e);
    return INITIAL_NOTES;
  }
}

export function saveLocalNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save local notes:', e);
  }
}

export function getLocalFolders(): Folder[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    if (!data) {
      saveLocalFolders(INITIAL_FOLDERS);
      return INITIAL_FOLDERS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_FOLDERS;
  }
}

export function saveLocalFolders(folders: Folder[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  } catch (e) {
    console.error('Failed to save local folders:', e);
  }
}

export function getLocalUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return null;
}

export function saveLocalUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (e) {
    console.error(e);
  }
}

export function getPendingSyncQueue(): { id: string; action: 'upsert' | 'delete'; timestamp: number }[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function addToSyncQueue(noteId: string, action: 'upsert' | 'delete'): void {
  const queue = getPendingSyncQueue();
  const filtered = queue.filter(item => item.id !== noteId);
  filtered.push({ id: noteId, action, timestamp: Date.now() });
  localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(filtered));
}

export function clearSyncQueue(): void {
  localStorage.removeItem(STORAGE_KEYS.PENDING_SYNC);
}

export function getSavedSupabaseConfig(): StoredSupabaseConfig | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return null;
}

export function saveSupabaseConfig(config: StoredSupabaseConfig | null): void {
  try {
    if (config) {
      localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(config));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SUPABASE_CONFIG);
    }
  } catch (e) {
    console.error(e);
  }
}
