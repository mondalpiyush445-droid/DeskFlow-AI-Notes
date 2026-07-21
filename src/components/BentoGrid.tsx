import React from 'react';
import { Note, UserProfile, ViewTab } from '../types';
import { NoteCard } from './NoteCard';

interface BentoGridProps {
  notes: Note[];
  user: UserProfile | null;
  currentTab: ViewTab;
  onSelectNote: (note: Note) => void;
  onToggleFavorite: (e: React.MouseEvent, noteId: string) => void;
  onDeleteNote: (e: React.MouseEvent, noteId: string) => void;
  onRestoreNote: (e: React.MouseEvent, noteId: string) => void;
  onCreateNewNote: () => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  notes,
  user,
  currentTab,
  onSelectNote,
  onToggleFavorite,
  onDeleteNote,
  onRestoreNote,
  onCreateNewNote,
}) => {
  const draftsCount = notes.filter((n) => n.status === 'draft').length;

  const getSectionTitle = () => {
    switch (currentTab) {
      case 'favorites':
        return 'Favorite Notes';
      case 'archive':
        return 'Archived Notes';
      case 'drafts':
        return 'Drafts in Progress';
      case 'shared':
        return 'Shared Collaborations';
      case 'trash':
        return 'Trash Bin';
      default:
        return 'Recent Workspace Notes';
    }
  };

  return (
    <div className="pt-20 lg:pt-24 px-4 sm:px-8 md:px-12 pb-28 max-w-[1280px] mx-auto min-h-screen">
      {/* Hero Header */}
      <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Elias'}.
          </h2>
          <p className="text-[#849495] dark:text-[#b9cacb] text-base md:text-lg">
            You have {draftsCount} {draftsCount === 1 ? 'draft' : 'drafts'} waiting for your focus.
          </p>
        </div>

        <button
          onClick={onCreateNewNote}
          className="self-start md:self-auto px-5 py-3 rounded-xl bg-[#00f0ff] text-[#00363a] font-bold text-sm flex items-center gap-2 neon-glow hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Create Note</span>
        </button>
      </div>

      {/* Grid Title */}
      <div className="mb-4 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#849495]">
        <span>{getSectionTitle()} ({notes.length})</span>
      </div>

      {/* Bento Grid */}
      {notes.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center my-8">
          <span className="material-symbols-outlined text-4xl text-[#00f0ff]/40 mb-3">
            sticky_note_2
          </span>
          <h3 className="text-lg font-bold text-on-surface mb-1">No notes found</h3>
          <p className="text-sm text-[#849495] mb-6">
            There are no notes matching your current filter. Create a new note to start writing!
          </p>
          <button
            onClick={onCreateNewNote}
            className="px-4 py-2.5 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-bold text-xs uppercase tracking-wider hover:bg-[#00f0ff]/20 transition-all"
          >
            + Create First Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, idx) => (
            <NoteCard
              key={note.id}
              note={note}
              isFeatured={idx === 0 && currentTab === 'all' && notes.length > 2}
              onSelectNote={onSelectNote}
              onToggleFavorite={onToggleFavorite}
              onDeleteNote={onDeleteNote}
              onRestoreNote={onRestoreNote}
            />
          ))}
        </div>
      )}

      {/* Focus Stats Section (Asymmetric Element) */}
      <section className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 glass-edge rounded-xl p-6 bg-[#00f0ff]/5 flex flex-col justify-center">
          <p className="text-[#849495] dark:text-[#b9cacb]/80 text-xs font-mono uppercase tracking-widest mb-1">
            Focus Time
          </p>
          <h4 className="text-3xl font-bold text-[#00f0ff] dark:text-[#dbfcff]">
            {user?.focusTimeHours || 12.4}h
          </h4>
          <p className="text-xs text-[#849495] font-mono mt-1">This week</p>
        </div>

        <div className="md:col-span-3 glass-edge rounded-xl p-6 bg-[#1a1c1c]/30 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-on-surface mb-1">Upcoming Milestone</h4>
            <p className="text-sm text-[#849495] dark:text-[#b9cacb]">
              Finish "Architecture of Silence" final draft
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-4 border-[#00f0ff]/20 border-t-[#00f0ff] flex items-center justify-center font-bold text-xs text-[#00f0ff]">
              80%
            </div>
          </div>
        </div>
      </section>

      {/* Floating Neon Plus Button */}
      <button
        onClick={onCreateNewNote}
        className="fixed bottom-8 right-8 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#00f0ff] text-[#00363a] neon-glow flex items-center justify-center group hover:scale-110 active:scale-95 transition-all z-40 shadow-2xl"
        title="Create New Note"
      >
        <span className="material-symbols-outlined text-[32px] group-hover:rotate-90 transition-transform">
          add
        </span>
      </button>
    </div>
  );
};
