import React from 'react';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  isFeatured?: boolean;
  onSelectNote: (note: Note) => void;
  onToggleFavorite: (e: React.MouseEvent, noteId: string) => void;
  onDeleteNote: (e: React.MouseEvent, noteId: string) => void;
  onRestoreNote?: (e: React.MouseEvent, noteId: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  isFeatured = false,
  onSelectNote,
  onToggleFavorite,
  onDeleteNote,
  onRestoreNote,
}) => {
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-[#7701d0]/20 text-[#dcb8ff] border border-[#7701d0]/30';
      case 'new':
        return 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30';
      case 'shared':
        return 'bg-[#00dbe9]/20 text-[#00dbe9] border border-[#00dbe9]/30';
      case 'archive':
        return 'bg-white/10 text-[#849495] dark:text-[#b9cacb]';
      case 'trash':
        return 'bg-red-500/20 text-red-300 border border-red-500/30';
      default:
        return 'bg-white/10 text-[#849495] dark:text-[#b9cacb]';
    }
  };

  if (isFeatured) {
    return (
      <article
        onClick={() => onSelectNote(note)}
        className="col-span-1 md:col-span-2 group relative rounded-2xl bg-[#1a1c1c]/40 dark:bg-[#1a1c1c]/20 backdrop-blur-md glass-edge p-6 md:p-8 shimmer-hover cursor-pointer transition-all hover:bg-[#1a1c1c]/60 hover:border-[#00f0ff]/30"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 font-mono text-[11px] rounded-full uppercase tracking-widest ${getStatusBadgeStyle(note.status)}`}>
              {note.status.replace('-', ' ')}
            </span>
            {note.folderId && (
              <span className="text-xs text-[#849495] dark:text-[#b9cacb]/60 font-mono">
                • folder
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#849495] font-mono">{note.timeAgo}</span>
            <button
              onClick={(e) => onToggleFavorite(e, note.id)}
              className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${
                note.isFavorite ? 'text-amber-400' : 'text-[#849495] hover:text-[#00f0ff]'
              }`}
              title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {note.isFavorite ? 'star' : 'grade'}
              </span>
            </button>
            <button
              onClick={(e) => onDeleteNote(e, note.id)}
              className="p-1.5 rounded-full hover:bg-red-500/10 text-[#849495] hover:text-red-400 transition-colors"
              title={note.status === 'trash' ? 'Delete Permanently' : 'Move to Trash'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {note.status === 'trash' ? 'delete_forever' : 'delete'}
              </span>
            </button>
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-[#00f0ff] dark:text-[#dbfcff] mb-3 group-hover:translate-x-1 transition-transform">
          {note.title}
        </h3>

        <p className="text-[#849495] dark:text-[#b9cacb]/90 text-sm md:text-base line-clamp-3 mb-6 leading-relaxed">
          {note.excerpt}
        </p>

        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2 flex-wrap">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#00f0ff]/5 border border-[#00f0ff]/10 text-[#00f0ff] text-xs rounded-full font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
          <span className="text-xs text-[#849495] font-mono">
            {note.wordCount} words • {note.readingTimeMinutes} min read
          </span>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => onSelectNote(note)}
      className="group relative rounded-xl bg-[#1a1c1c]/40 dark:bg-[#1a1c1c]/20 backdrop-blur-md glass-edge p-5 md:p-6 shimmer-hover cursor-pointer transition-all hover:bg-[#1a1c1c]/60 hover:border-[#00f0ff]/30 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2.5 py-0.5 font-mono text-[10px] rounded-full uppercase tracking-widest ${getStatusBadgeStyle(note.status)}`}>
            {note.status.replace('-', ' ')}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => onToggleFavorite(e, note.id)}
              className={`p-1 rounded-full hover:bg-white/10 transition-colors ${
                note.isFavorite ? 'text-amber-400' : 'text-[#849495]/60 hover:text-[#00f0ff]'
              }`}
              title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {note.isFavorite ? 'star' : 'grade'}
              </span>
            </button>
            <button
              onClick={(e) => onDeleteNote(e, note.id)}
              className="p-1 rounded-full hover:bg-red-500/10 text-[#849495]/60 hover:text-red-400 transition-colors"
              title={note.status === 'trash' ? 'Delete Permanently' : 'Move to Trash'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {note.status === 'trash' ? 'delete_forever' : 'delete'}
              </span>
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold text-on-surface mb-2 group-hover:text-[#00f0ff] transition-colors line-clamp-1">
          {note.title}
        </h3>

        <p className="text-[#849495] dark:text-[#b9cacb]/80 text-xs md:text-sm line-clamp-2 leading-relaxed mb-4">
          {note.excerpt}
        </p>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#849495]/60 font-mono border-t border-white/5 pt-3">
        <span>Modified {note.timeAgo}</span>
        {note.status === 'trash' && onRestoreNote && (
          <button
            onClick={(e) => onRestoreNote(e, note.id)}
            className="text-[#00f0ff] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">restore</span>
            Restore
          </button>
        )}
      </div>
    </article>
  );
};
