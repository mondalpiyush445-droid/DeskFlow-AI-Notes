import React from 'react';
import { ViewTab, UserProfile } from '../types';

interface TopHeaderProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  user: UserProfile | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSidebar: () => void;
  onOpenSettingsModal?: () => void;
  unreadNotificationsCount?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  user,
  isDarkMode,
  onToggleDarkMode,
  onToggleSidebar,
  onOpenSettingsModal,
  unreadNotificationsCount = 2,
}) => {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-[#121414]/80 dark:bg-[#121414]/50 backdrop-blur-xl border-b border-white/10 dark:border-white/5 px-4 md:px-8 flex items-center justify-between z-40 transition-all duration-300">
      {/* Left: Mobile Toggle & Navigation Tabs */}
      <div className="flex items-center gap-4 md:gap-8">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-[#849495] hover:text-on-surface hover:bg-white/10 lg:hidden"
          title="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <nav className="flex gap-3 md:gap-6 font-mono text-xs md:text-sm items-center">
          <button
            onClick={() => onSelectTab('all')}
            className={`pb-1 transition-colors flex items-center gap-1.5 ${
              currentTab === 'all'
                ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] font-bold'
                : 'text-[#849495] dark:text-[#b9cacb] hover:text-[#00f0ff]'
            }`}
            title="Go to Home Workspace"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Home</span>
          </button>
          <button
            onClick={() => onSelectTab('recent')}
            className={`pb-1 transition-colors ${
              currentTab === 'recent'
                ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] font-bold'
                : 'text-[#849495] dark:text-[#b9cacb] hover:text-[#00f0ff]'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => onSelectTab('shared')}
            className={`pb-1 transition-colors ${
              currentTab === 'shared'
                ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] font-bold'
                : 'text-[#849495] dark:text-[#b9cacb] hover:text-[#00f0ff]'
            }`}
          >
            Shared
          </button>
          <button
            onClick={() => onSelectTab('trash')}
            className={`pb-1 transition-colors ${
              currentTab === 'trash'
                ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] font-bold'
                : 'text-[#849495] dark:text-[#b9cacb] hover:text-[#00f0ff]'
            }`}
          >
            Trash
          </button>
        </nav>
      </div>

      {/* Right: Search bar, Theme Toggle, Notifications, User Profile */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Deep Search Input */}
        <div className="relative group hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#849495] group-focus-within:text-[#00f0ff] transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Deep search notes..."
            className="bg-[#1a1c1c]/60 border border-white/10 focus:border-[#00f0ff] focus:ring-0 w-44 sm:w-56 md:w-64 focus:w-72 pl-9 pr-3 py-1.5 text-xs font-mono text-on-surface placeholder:text-[#849495]/60 rounded-lg transition-all focus:shadow-[0_0_15px_rgba(0,219,233,0.15)]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#849495] hover:text-on-surface text-xs p-1"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg text-[#849495] hover:text-[#00f0ff] hover:bg-white/5 transition-colors"
          title={isDarkMode ? 'Switch to Studio Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => alert('Notifications: All notes are synchronized to local storage.')}
            className="p-2 rounded-lg text-[#849495] hover:text-[#00f0ff] hover:bg-white/5 transition-colors flex items-center justify-center"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            )}
          </button>
        </div>

        {/* User Avatar & Name */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <button
            onClick={onOpenSettingsModal}
            className="flex items-center gap-2 group p-1 rounded-full hover:bg-white/5 transition-all text-left"
            title="Edit Profile & AI Avatar"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 group-hover:border-[#00f0ff] group-hover:ring-2 ring-[#00f0ff]/50 transition-all bg-[#1a1c1c] flex items-center justify-center text-xs font-bold text-[#00f0ff]">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                user?.name?.slice(0, 2).toUpperCase() || 'AI'
              )}
            </div>
            <div className="hidden sm:block">
              <span className="block text-xs font-mono text-on-surface font-bold group-hover:text-[#00f0ff] transition-colors truncate max-w-[100px]">
                {user?.name || 'User'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
