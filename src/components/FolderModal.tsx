import React, { useState } from 'react';
import { Folder } from '../types';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folder: Folder) => void;
}

const COLOR_OPTIONS = ['#00dbe9', '#7701d0', '#00f0ff', '#dcb8ff', '#ffb4ab', '#7df4ff'];

export const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  onCreateFolder,
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newFolder: Folder = {
      id: 'f-' + Date.now(),
      name: name.trim(),
      color: selectedColor,
    };

    onCreateFolder(newFolder);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="glass-card w-full max-w-md p-6 rounded-2xl relative animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#00f0ff] dark:text-[#dbfcff]">
            Create New Folder
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#849495] hover:text-on-surface hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-[#849495] uppercase tracking-wider mb-2">
              Folder Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Creative Projects, Research..."
              className="w-full bg-[#1a1c1c]/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm font-mono text-on-surface focus:ring-0 focus:border-[#00f0ff]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#849495] uppercase tracking-wider mb-2">
              Accent Color
            </label>
            <div className="flex gap-3">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    selectedColor === color ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-white/10 text-xs font-mono font-bold text-[#849495] hover:text-on-surface hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-[#00f0ff] text-[#00363a] text-xs font-mono font-bold uppercase tracking-wider neon-glow hover:brightness-110 transition-all"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
