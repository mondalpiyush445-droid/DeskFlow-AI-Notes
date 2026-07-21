import React, { useState, useEffect } from 'react';
import { Note, UserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onExportBackup: () => void;
  onImportBackup: (importedNotes: Note[]) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  lowPowerMode: boolean;
  onToggleLowPowerMode: () => void;
}

const PRESET_AI_AVATARS = [
  {
    id: 'cyber',
    name: 'Cyber Spark',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'quantum',
    name: 'Quantum AI',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'zen',
    name: 'Zen Mind',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'neon',
    name: 'Neon Core',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'synth',
    name: 'Synth Matrix',
    url: 'https://images.unsplash.com/photo-1614680376593-902f749f7041?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'aura',
    name: 'Aura Pulse',
    url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=200&auto=format&fit=crop&q=80',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  notes,
  user,
  onUpdateUser,
  onExportBackup,
  onImportBackup,
  isDarkMode,
  onToggleDarkMode,
  lowPowerMode,
  onToggleLowPowerMode,
}) => {
  const [userNameInput, setUserNameInput] = useState(user.name);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(user.avatarUrl || PRESET_AI_AVATARS[0].url);
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    if (user) {
      setUserNameInput(user.name);
      setSelectedAvatarUrl(user.avatarUrl || PRESET_AI_AVATARS[0].url);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNameInput.trim()) return;

    const updatedUser: UserProfile = {
      ...user,
      name: userNameInput.trim(),
      avatarUrl: customAvatarInput.trim() || selectedAvatarUrl,
    };

    onUpdateUser(updatedUser);
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      onClose();
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportBackup(parsed);
          alert(`Successfully imported ${parsed.length} notes!`);
        }
      } catch (err) {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="glass-card w-full max-w-2xl p-6 md:p-8 rounded-2xl relative my-8 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-[#00f0ff] dark:text-[#dbfcff]">
              System Settings
            </h3>
            <p className="text-xs font-mono text-[#849495] dark:text-[#b9cacb]">
              Configure Local Storage, Theme Preferences, and Data Backup
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] font-mono text-xs font-bold border border-[#00f0ff]/30 transition-all flex items-center gap-1.5"
              title="Return to Home Workspace"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Go Home</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#849495] hover:text-on-surface hover:bg-white/10"
              title="Close Settings"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* User Profile & AI Avatar Customization */}
          <section className="glass-panel p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">account_circle</span>
                User Profile & AI Avatar
              </h4>
              <span className="text-[11px] font-mono text-[#849495]">
                Custom identity & AI Persona
              </span>
            </div>

            {saveSuccessMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                User profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#849495] mb-1">
                  User Display Name
                </label>
                <input
                  type="text"
                  value={userNameInput}
                  onChange={(e) => setUserNameInput(e.target.value)}
                  placeholder="Enter your display name..."
                  className="w-full bg-[#1a1c1c]/80 border border-white/10 rounded-lg px-3.5 py-2 text-xs font-mono text-on-surface focus:ring-0 focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#849495] mb-2">
                  Select AI Avatar Persona
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PRESET_AI_AVATARS.map((avatar) => {
                    const isSelected = selectedAvatarUrl === avatar.url && !customAvatarInput.trim();
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => {
                          setSelectedAvatarUrl(avatar.url);
                          setCustomAvatarInput('');
                        }}
                        className={`relative rounded-xl overflow-hidden border transition-all p-1 group flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'border-[#00f0ff] bg-[#00f0ff]/10 ring-2 ring-[#00f0ff]/40 scale-105'
                            : 'border-white/10 bg-black/20 hover:border-white/30'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                          <img
                            src={avatar.url}
                            alt={avatar.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <span className="text-[10px] font-mono text-[#849495] group-hover:text-on-surface truncate w-full text-center">
                          {avatar.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#849495] mb-1">
                  Or Custom AI Avatar Image URL
                </label>
                <input
                  type="text"
                  value={customAvatarInput}
                  onChange={(e) => setCustomAvatarInput(e.target.value)}
                  placeholder="https://images.unsplash.com/... or custom image URL"
                  className="w-full bg-[#1a1c1c]/80 border border-white/10 rounded-lg px-3.5 py-2 text-xs font-mono text-on-surface focus:ring-0 focus:border-[#00f0ff]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#00f0ff] text-[#00363a] font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  Save Profile
                </button>
              </div>
            </form>
          </section>
          {/* Local Storage & Zero-Cost Persistence Info */}
          <section className="glass-panel p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-bold">
                Local Database Storage
              </span>
              <span className="text-xs font-mono text-emerald-400">
                ● Active (Free & Unlimited)
              </span>
            </div>

            <p className="text-xs text-[#849495] dark:text-[#b9cacb] leading-relaxed">
              All your notes are saved directly on your device in your browser's persistent database. No external paid databases, no server quotas, and zero costs!
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                <span className="text-[#849495] block text-[10px]">TOTAL SAVED NOTES</span>
                <span className="text-on-surface font-bold text-sm">{notes.length} notes</span>
              </div>
              <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                <span className="text-[#849495] block text-[10px]">STORAGE COST</span>
                <span className="text-emerald-400 font-bold text-sm">$0.00 / Free Forever</span>
              </div>
            </div>
          </section>

          {/* Theme & Performance */}
          <section className="space-y-3 border-t border-white/10 pt-4">
            <h4 className="text-sm font-bold text-on-surface uppercase font-mono tracking-wider">
              Theme & Visual Engine
            </h4>

            <div className="flex items-center justify-between p-3 glass-panel rounded-xl">
              <div>
                <span className="text-xs font-bold text-on-surface block">Theme Mode</span>
                <span className="text-[11px] text-[#849495]">
                  Toggle between Cinematic Noir and Studio Light
                </span>
              </div>
              <button
                onClick={onToggleDarkMode}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isDarkMode ? 'light_mode' : 'dark_mode'}
                </span>
                <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 glass-panel rounded-xl">
              <div>
                <span className="text-xs font-bold text-on-surface block">
                  Shader Low Power Mode
                </span>
                <span className="text-[11px] text-[#849495]">
                  Disable ambient WebGL canvas animation to conserve GPU/battery
                </span>
              </div>
              <button
                onClick={onToggleLowPowerMode}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  lowPowerMode
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-white/10 hover:bg-white/20 text-on-surface'
                }`}
              >
                {lowPowerMode ? 'Enabled (Low GPU)' : 'Disabled (60fps)'}
              </button>
            </div>
          </section>

          {/* Data Backup & Import */}
          <section className="space-y-3 border-t border-white/10 pt-4">
            <h4 className="text-sm font-bold text-on-surface uppercase font-mono tracking-wider">
              Data Backup & Portability
            </h4>

            <div className="flex gap-3">
              <button
                onClick={onExportBackup}
                className="flex-1 py-2.5 px-3 rounded-lg border border-white/10 hover:bg-white/5 font-mono text-xs text-[#00f0ff] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export Notes JSON Backup</span>
              </button>

              <label className="flex-1 py-2.5 px-3 rounded-lg border border-white/10 hover:bg-white/5 font-mono text-xs text-[#dcb8ff] flex items-center justify-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">upload</span>
                <span>Import JSON Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
