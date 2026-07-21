export type NoteStatus = 'in-progress' | 'draft' | 'archive' | 'new' | 'shared' | 'trash';

export interface Note {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: NoteStatus;
  isFavorite: boolean;
  folderId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  timeAgo: string;
  wordCount: number;
  readingTimeMinutes: number;
  flowLevel: number;
  imageUrl?: string;
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
  count?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  focusTimeHours: number;
}

export type ViewTab = 'all' | 'favorites' | 'archive' | 'drafts' | 'recent' | 'shared' | 'trash' | 'folder';

export interface SyncStatus {
  isOnline: boolean;
  pendingSyncCount: number;
  lastSyncedAt?: string;
}
