import React, { useState, useEffect, useMemo } from 'react';
import {
  Note,
  Folder,
  UserProfile,
  ViewTab,
  SyncStatus,
} from './types';
import {
  getLocalNotes,
  saveLocalNotes,
  getLocalFolders,
  saveLocalFolders,
  getLocalUser,
  saveLocalUser,
} from './lib/offlineStorage';

import { BackgroundShader } from './components/BackgroundShader';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { BentoGrid } from './components/BentoGrid';
import { EditorScreen } from './components/EditorScreen';
import { FolderModal } from './components/FolderModal';
import { SettingsModal } from './components/SettingsModal';

const DEFAULT_USER: UserProfile = {
  id: 'local_user_1',
  name: 'Local Creator',
  email: 'creator@workspace.local',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  focusTimeHours: 12.5,
};

export default function App() {
  // User Profile State (Default active local user)
  const [user, setUser] = useState<UserProfile>(() => getLocalUser() || DEFAULT_USER);

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    saveLocalUser(updatedUser);
  };

  // App Title / Name
  const appName = 'DeskFlow AI Notes';

  // Theme & Visual State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('noirnotes_theme_v1');
    return saved !== null ? saved === 'dark' : true;
  });
  const [lowPowerMode, setLowPowerMode] = useState<boolean>(false);

  // App State
  const [notes, setNotes] = useState<Note[]>(() => getLocalNotes());
  const [folders, setFolders] = useState<Folder[]>(() => getLocalFolders());
  const [currentTab, setCurrentTab] = useState<ViewTab>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  // UI Modals & Drawer
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync / Offline State
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    pendingSyncCount: 0,
  });

  // Save default local user on boot
  useEffect(() => {
    if (!getLocalUser()) {
      saveLocalUser(DEFAULT_USER);
    }
  }, []);

  // Apply dark class to <html> element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('noirnotes_theme_v1', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('noirnotes_theme_v1', 'light');
    }
  }, [isDarkMode]);

  // Handle Online / Offline Events
  useEffect(() => {
    const handleOnline = () => setSyncStatus({ isOnline: true, pendingSyncCount: 0 });
    const handleOffline = () => setSyncStatus({ isOnline: false, pendingSyncCount: 0 });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Note Actions (Create, Edit, Delete, Restore, Favorite)
  const handleSaveNote = (updatedNote: Note) => {
    const updatedList = notes.some((n) => n.id === updatedNote.id)
      ? notes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
      : [updatedNote, ...notes];

    setNotes(updatedList);
    saveLocalNotes(updatedList);
  };

  const handleCreateNewNote = () => {
    const newNote: Note = {
      id: 'note_' + Date.now(),
      title: 'Untitled Note',
      content: '',
      excerpt: 'Empty draft note...',
      status: 'draft',
      isFavorite: false,
      folderId: selectedFolderId,
      tags: ['draft'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeAgo: 'Just now',
      wordCount: 0,
      readingTimeMinutes: 1,
      flowLevel: 70,
    };

    handleSaveNote(newNote);
    setActiveNote(newNote);
  };

  const handleToggleFavorite = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    const updated = notes.map((n) => {
      if (n.id === noteId) {
        return { ...n, isFavorite: !n.isFavorite };
      }
      return n;
    });
    setNotes(updated);
    saveLocalNotes(updated);
  };

  const handleDeleteNote = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    const target = notes.find((n) => n.id === noteId);
    if (!target) return;

    if (target.status === 'trash') {
      // Permanent deletion
      const filtered = notes.filter((n) => n.id !== noteId);
      setNotes(filtered);
      saveLocalNotes(filtered);
    } else {
      // Move to trash
      const updated = notes.map((n) =>
        n.id === noteId ? { ...n, status: 'trash' as const } : n
      );
      setNotes(updated);
      saveLocalNotes(updated);
    }
  };

  const handleRestoreNote = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    const updated = notes.map((n) =>
      n.id === noteId ? { ...n, status: 'draft' as const } : n
    );
    setNotes(updated);
    saveLocalNotes(updated);
  };

  // Folder Actions
  const handleCreateFolder = (newFolder: Folder) => {
    const updated = [...folders, newFolder];
    setFolders(updated);
    saveLocalFolders(updated);
  };

  // Backup Import/Export
  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${appName.toLowerCase().replace(/\s+/g, '_')}_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (importedNotes: Note[]) => {
    setNotes(importedNotes);
    saveLocalNotes(importedNotes);
  };

  // Filtered Notes computation
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // 1. Folder filter
      if (selectedFolderId && note.folderId !== selectedFolderId) {
        return false;
      }

      // 2. Tab filter
      if (currentTab === 'favorites' && !note.isFavorite) return false;
      if (currentTab === 'archive' && note.status !== 'archive') return false;
      if (currentTab === 'drafts' && note.status !== 'draft') return false;
      if (currentTab === 'shared' && note.status !== 'shared') return false;
      if (currentTab === 'trash') {
        if (note.status !== 'trash') return false;
      } else {
        if (note.status === 'trash') return false;
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = note.title.toLowerCase().includes(q);
        const inContent = note.content.toLowerCase().includes(q);
        const inTags = note.tags.some((t) => t.toLowerCase().includes(q));
        return inTitle || inContent || inTags;
      }

      return true;
    });
  }, [notes, currentTab, selectedFolderId, searchQuery]);

  // RENDER: Immersive Editor if active note selected
  if (activeNote) {
    return (
      <>
        <BackgroundShader isDarkMode={isDarkMode} lowPowerMode={lowPowerMode} />
        <EditorScreen
          note={activeNote}
          folders={folders}
          onSaveNote={(updated) => {
            setActiveNote(updated);
            handleSaveNote(updated);
          }}
          onCloseEditor={() => setActiveNote(null)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          user={user}
          syncing={false}
        />
      </>
    );
  }

  // RENDER: Main Dashboard
  return (
    <div className="relative min-h-screen bg-[#121414] dark:bg-[#121414] text-on-surface overflow-x-hidden selection:bg-[#00f0ff]/30">
      {/* Background Shader Canvas */}
      <BackgroundShader isDarkMode={isDarkMode} lowPowerMode={lowPowerMode} />

      {/* Sidebar Navigation */}
      <Sidebar
        appName={appName}
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSelectedFolderId(undefined);
        }}
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={(folderId) => {
          setSelectedFolderId(folderId);
          setCurrentTab('folder');
        }}
        onOpenNewFolderModal={() => setIsFolderModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        syncStatus={syncStatus}
        user={user}
      />

      {/* Main Content Area */}
      <main className="lg:ml-64 relative z-10 min-h-screen transition-all duration-300">
        {/* Top Header */}
        <TopHeader
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setSelectedFolderId(undefined);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          user={user}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        />

        {/* Bento Grid Canvas */}
        <BentoGrid
          notes={filteredNotes}
          user={user}
          currentTab={currentTab}
          onSelectNote={(note) => setActiveNote(note)}
          onToggleFavorite={handleToggleFavorite}
          onDeleteNote={handleDeleteNote}
          onRestoreNote={handleRestoreNote}
          onCreateNewNote={handleCreateNewNote}
        />
      </main>

      {/* Modals */}
      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        notes={notes}
        user={user}
        onUpdateUser={handleUpdateUser}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        lowPowerMode={lowPowerMode}
        onToggleLowPowerMode={() => setLowPowerMode(!lowPowerMode)}
      />
    </div>
  );
}
