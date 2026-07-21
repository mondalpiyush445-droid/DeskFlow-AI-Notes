import React from 'react';
import { ViewTab, Folder, SyncStatus, UserProfile } from '../types';

interface SidebarProps {
  appName?: string;
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  folders: Folder[];
  selectedFolderId?: string;
  onSelectFolder: (folderId: string) => void;
  onOpenNewFolderModal: () => void;
  onOpenSettingsModal: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  syncStatus: SyncStatus;
  user?: UserProfile | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  appName = 'DeskFlow AI Notes',
  currentTab,
  onSelectTab,
  folders,
  selectedFolderId,
  onSelectFolder,
  onOpenNewFolderModal,
  onOpenSettingsModal,
  isOpen,
  onToggleOpen,
  syncStatus,
  user,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggleOpen}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#1a1c1c]/80 dark:bg-[#1a1c1c]/60 backdrop-blur-[40px] border-r border-white/10 dark:border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.3)] flex flex-col py-6 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#00f0ff] dark:text-[#dbfcff] tracking-tighter truncate max-w-[170px]">
              {appName}
            </h1>
            <p className="text-[11px] font-mono text-[#849495] dark:text-[#b9cacb]/60 uppercase tracking-widest">
              Flow State Active
            </p>
          </div>

          <button
            onClick={onToggleOpen}
            className="p-1 rounded-lg hover:bg-white/10 text-on-surface lg:hidden"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
          <button
            onClick={() => {
              onSelectTab('all');
              if (window.innerWidth < 1024) onToggleOpen();
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'all' && !selectedFolderId
                ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-l-2 border-[#00f0ff] font-bold'
                : 'text-[#849495] dark:text-[#b9cacb] hover:text-on-surface hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">sticky_note_2</span>
            <span>All Notes</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('favorites');
              if (window.innerWidth < 1024) onToggleOpen();
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'favorites'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-l-2 border-[#00f0ff] font-bold'
                : 'text-[#849495] dark:text-[#b9cacb] hover:text-on-surface hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">grade</span>
            <span>Favorites</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('archive');
              if (window.innerWidth < 1024) onToggleOpen();
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'archive'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-l-2 border-[#00f0ff] font-bold'
                : 'text-[#849495] dark:text-[#b9cacb] hover:text-on-surface hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">archive</span>
            <span>Archive</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('drafts');
              if (window.innerWidth < 1024) onToggleOpen();
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'drafts'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-l-2 border-[#00f0ff] font-bold'
                : 'text-[#849495] dark:text-[#b9cacb] hover:text-on-surface hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
            <span>Drafts</span>
          </button>

          <button
            onClick={() => {
              onOpenSettingsModal();
              if (window.innerWidth < 1024) onToggleOpen();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#849495] dark:text-[#b9cacb] hover:text-on-surface hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </button>

          {/* Folders Section */}
          <div className="pt-6 pb-2 px-4 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#849495]/70">
            <span>Folders</span>
            <button
              onClick={onOpenNewFolderModal}
              className="hover:text-[#00f0ff] p-0.5 rounded transition-colors"
              title="Create New Folder"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>

          <div className="space-y-0.5">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => {
                  onSelectFolder(folder.id);
                  if (window.innerWidth < 1024) onToggleOpen();
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedFolderId === folder.id
                    ? 'bg-[#00f0ff]/10 text-[#00f0ff] font-bold'
                    : 'text-[#849495] dark:text-[#b9cacb] hover:text-on-surface hover:bg-white/5'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: folder.color || '#00dbe9' }}
                />
                <span className="truncate flex-1 text-left">{folder.name}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 px-2">
            <button
              onClick={onOpenNewFolderModal}
              className="w-full py-2.5 px-3 border border-[#00f0ff]/20 bg-[#00f0ff]/5 hover:bg-[#00f0ff]/10 text-[#00f0ff] font-mono text-xs rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">create_new_folder</span>
              <span>New Folder</span>
            </button>
          </div>
        </nav>

        {/* Footer Actions & Offline Badge */}
        <div className="px-3 border-t border-white/10 dark:border-white/5 pt-4 space-y-2">
          {/* Connectivity Status Indicator */}
          <div className="px-3 py-1.5 rounded-lg bg-black/20 text-[11px] font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  syncStatus.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-[#849495] dark:text-[#b9cacb]">
                {syncStatus.isOnline ? 'Online Sync' : 'Offline Mode'}
              </span>
            </div>
            {syncStatus.pendingSyncCount > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">
                {syncStatus.pendingSyncCount} pending
              </span>
            )}
          </div>

          {/* User Profile Card */}
          {user && (
            <button
              onClick={onOpenSettingsModal}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#00f0ff]/30 transition-all text-left group"
              title="Edit Profile & AI Avatar"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 group-hover:border-[#00f0ff] shrink-0 bg-[#1a1c1c] flex items-center justify-center text-xs font-bold text-[#00f0ff]">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-mono text-on-surface font-bold group-hover:text-[#00f0ff] transition-colors truncate">
                  {user.name}
                </span>
                <span className="block text-[10px] font-mono text-[#849495] truncate">
                  AI Creator
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#849495] group-hover:text-[#00f0ff]">
                edit
              </span>
            </button>
          )}

          <button
            onClick={onOpenSettingsModal}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs text-[#849495] dark:text-[#b9cacb] hover:text-on-surface hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span>Settings & Backup</span>
          </button>
        </div>
      </aside>
    </>
  );
};
