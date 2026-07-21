import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Note, Folder, UserProfile } from '../types';

interface EditorScreenProps {
  note: Note;
  folders: Folder[];
  onSaveNote: (updatedNote: Note) => void;
  onCloseEditor: () => void;
  onToggleSidebar: () => void;
  user: UserProfile | null;
  syncing?: boolean;
}

export const EditorScreen: React.FC<EditorScreenProps> = ({
  note,
  folders,
  onSaveNote,
  onCloseEditor,
  onToggleSidebar,
  user,
  syncing = false,
}) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [status, setStatus] = useState(note.status);
  const [folderId, setFolderId] = useState(note.folderId || '');
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [imageUrl, setImageUrl] = useState(note.imageUrl || '');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isSavedGlow, setIsSavedGlow] = useState(false);

  // AI Assistant States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiLoadingAction, setAiLoadingAction] = useState<string | null>(null);
  const [aiSummaryResult, setAiSummaryResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showAiPromptInput, setShowAiPromptInput] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');

  // Derived metrics
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const flowLevel = Math.min(100, Math.max(50, Math.round(wordCount * 0.15 + tags.length * 10)));

  // Auto-save debouncer
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSave();
    }, 1200);
    return () => clearTimeout(timer);
  }, [title, content, status, folderId, tags, imageUrl]);

  const handleSave = () => {
    const excerpt = content.slice(0, 150).replace(/[#*`_>]/g, '') + '...';
    const updated: Note = {
      ...note,
      title: title || 'Untitled Note',
      content,
      excerpt,
      status,
      folderId: folderId || undefined,
      tags,
      imageUrl: imageUrl || undefined,
      wordCount,
      readingTimeMinutes,
      flowLevel,
      updatedAt: new Date().toISOString(),
      timeAgo: 'Just now',
    };
    onSaveNote(updated);
    setIsSavedGlow(true);
    setTimeout(() => setIsSavedGlow(false), 1500);
  };

  const handleInsertFormat = (prefix: string, suffix: string = '') => {
    setContent((prev) => `${prev}\n${prefix}sample text${suffix}\n`);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAiProcess = async (
    action: 'summarize' | 'tags' | 'improve' | 'takeaways' | 'draft',
    promptOverride?: string
  ) => {
    try {
      setIsAiLoading(true);
      setAiLoadingAction(action);
      setAiError(null);

      const response = await fetch('/api/ai/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          content,
          title,
          prompt: promptOverride || aiCustomPrompt || title,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to process AI request.');
      }

      const data = await response.json();
      const resultText = data.result;

      if (action === 'summarize') {
        setAiSummaryResult(resultText);
      } else if (action === 'tags') {
        try {
          // Attempt to parse JSON array or extract tags
          let parsedTags: string[] = [];
          if (resultText.trim().startsWith('[')) {
            parsedTags = JSON.parse(resultText);
          } else {
            parsedTags = resultText
              .replace(/[\[\]#"']/g, '')
              .split(/[\n,]+/)
              .map((t: string) => t.trim())
              .filter(Boolean);
          }
          const unique = Array.from(new Set([...tags, ...parsedTags]));
          setTags(unique);
        } catch (e) {
          console.error('Failed to parse AI tags:', e);
        }
      } else if (action === 'improve') {
        setContent(resultText);
      } else if (action === 'takeaways') {
        setContent((prev) => `${prev}\n\n### 📌 AI Key Takeaways & Action Items\n${resultText}`);
      } else if (action === 'draft') {
        setContent(resultText);
        setShowAiPromptInput(false);
        setAiCustomPrompt('');
      }
    } catch (err: any) {
      console.error('AI Error:', err);
      setAiError(err.message || 'An error occurred during AI processing.');
    } finally {
      setIsAiLoading(false);
      setAiLoadingAction(null);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#121414] dark:bg-[#121414] text-on-surface">
      {/* Top Header Toolbar */}
      <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-[#121414]/90 backdrop-blur-xl border-b border-white/10 dark:border-white/5 px-4 md:px-8 flex items-center justify-between z-40">
        <div className="flex items-center gap-3 sm:gap-6 overflow-hidden">
          <button
            onClick={onCloseEditor}
            className="p-1.5 px-3 rounded-lg bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] hover:text-[#00f0ff] border border-[#00f0ff]/30 transition-all flex items-center gap-1.5 text-xs font-mono font-bold"
            title="Return to Home Dashboard"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>Home</span>
          </button>

          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-[#849495] hover:text-[#00f0ff] hover:bg-white/10 lg:hidden"
            title="Toggle Sidebar"
          >
            <span className="material-symbols-outlined text-[20px]">side_navigation</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs font-mono truncate">
            <span className="text-[#849495] capitalize">{status}</span>
            <span className="text-white/20">/</span>
            <span className="text-[#00f0ff] font-bold truncate max-w-[150px] sm:max-w-[250px]">
              {title || 'Untitled.md'}
            </span>
          </div>
        </div>

        {/* Floating Formatting Controls */}
        <div className="hidden md:flex items-center gap-1 glass-panel px-3 py-1.5 rounded-full scale-90 lg:scale-100">
          <button
            onClick={() => handleInsertFormat('**', '**')}
            className="p-1.5 text-[#849495] hover:text-[#00f0ff] transition-colors"
            title="Bold"
          >
            <span className="material-symbols-outlined text-[18px]">format_bold</span>
          </button>
          <button
            onClick={() => handleInsertFormat('*', '*')}
            className="p-1.5 text-[#849495] hover:text-[#00f0ff] transition-colors"
            title="Italic"
          >
            <span className="material-symbols-outlined text-[18px]">format_italic</span>
          </button>
          <button
            onClick={() => handleInsertFormat('- ')}
            className="p-1.5 text-[#849495] hover:text-[#00f0ff] transition-colors"
            title="Bulleted List"
          >
            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
          </button>
          <button
            onClick={() => handleInsertFormat('> ')}
            className="p-1.5 text-[#849495] hover:text-[#00f0ff] transition-colors"
            title="Blockquote"
          >
            <span className="material-symbols-outlined text-[18px]">format_quote</span>
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            onClick={() => handleInsertFormat('[', '](https://)')}
            className="p-1.5 text-[#849495] hover:text-[#00f0ff] transition-colors"
            title="Insert Link"
          >
            <span className="material-symbols-outlined text-[18px]">link</span>
          </button>
          <button
            onClick={() => setShowImageInput(!showImageInput)}
            className={`p-1.5 transition-colors ${showImageInput ? 'text-[#00f0ff]' : 'text-[#849495] hover:text-[#00f0ff]'}`}
            title="Insert Image URL"
          >
            <span className="material-symbols-outlined text-[18px]">image</span>
          </button>
          <button
            onClick={() => handleInsertFormat('```\n', '\n```')}
            className="p-1.5 text-[#849495] hover:text-[#00f0ff] transition-colors"
            title="Code Block"
          >
            <span className="material-symbols-outlined text-[18px]">code</span>
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`p-1.5 transition-colors ${isPreview ? 'text-[#00f0ff] font-bold' : 'text-[#849495] hover:text-[#00f0ff]'}`}
            title={isPreview ? 'Edit Markdown' : 'Preview Mode'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPreview ? 'edit' : 'visibility'}
            </span>
          </button>
        </div>

        {/* Sync & User Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-xs transition-all active:scale-95 ${
              isSavedGlow
                ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_20px_rgba(0,240,255,0.6)] font-bold'
                : 'bg-[#00f0ff]/20 text-[#00f0ff] hover:bg-[#00f0ff]/30 border border-[#00f0ff]/30'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {syncing ? 'sync' : 'cloud_upload'}
            </span>
            <span>{syncing ? 'Syncing...' : isSavedGlow ? 'Saved!' : 'Sync'}</span>
          </button>

          <div className="w-8 h-8 rounded-full border border-white/20 bg-cover bg-center overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#00f0ff]/20 text-[#00f0ff] flex items-center justify-center font-bold text-xs">
                EL
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Editor Canvas Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 pt-24 pb-48">
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title..."
          className="w-full bg-transparent border-none text-3xl sm:text-4xl md:text-5xl font-bold text-[#00f0ff] dark:text-[#dbfcff] placeholder:text-white/20 focus:ring-0 mb-6 p-0 tracking-tight"
        />

        {/* Note Metadata Bar (Status, Folder, Tags) */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {/* Status Select */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="bg-[#1a1c1c]/80 text-[#dcb8ff] border border-white/10 text-xs font-mono py-1 px-3 rounded-full focus:ring-0 focus:border-[#00f0ff]"
          >
            <option value="draft">DRAFT</option>
            <option value="in-progress">IN PROGRESS</option>
            <option value="new">NEW</option>
            <option value="shared">SHARED</option>
            <option value="archive">ARCHIVE</option>
          </select>

          {/* Folder Select */}
          <select
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            className="bg-[#1a1c1c]/80 text-[#849495] dark:text-[#b9cacb] border border-white/10 text-xs font-mono py-1 px-3 rounded-full focus:ring-0 focus:border-[#00f0ff]"
          >
            <option value="">No Folder</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          {/* Session Tag Badge */}
          <span className="px-3 py-1 glass-panel text-xs font-mono text-[#dcb8ff] rounded-full flex items-center gap-1.5 border-[#dcb8ff]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dcb8ff] animate-pulse" />
            ACTIVE_SESSION
          </span>

          {/* Tags */}
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 glass-panel text-xs font-mono text-[#849495] dark:text-[#b9cacb] rounded-full flex items-center gap-1 border-white/5"
            >
              #{tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-red-400 ml-1"
              >
                ×
              </button>
            </span>
          ))}

          {/* Tag Input */}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="+ Add tag (Enter)"
            className="bg-transparent border-0 border-b border-white/10 text-xs font-mono text-[#849495] placeholder:text-white/20 py-1 px-2 focus:ring-0 focus:border-[#00f0ff] w-32"
          />
        </div>
        {/* DeskFlow AI Workspace Assistant Bar */}
        <div className="mb-6 p-3.5 glass-panel rounded-2xl border border-[#00f0ff]/20 bg-gradient-to-r from-[#00f0ff]/5 via-purple-500/5 to-transparent space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00f0ff] text-[20px] animate-pulse">
                auto_awesome
              </span>
              <span className="text-xs font-mono font-bold text-[#00f0ff] uppercase tracking-wider">
                DeskFlow AI Intelligence
              </span>
            </div>
            {isAiLoading && (
              <div className="flex items-center gap-2 text-xs font-mono text-[#dcb8ff]">
                <span className="w-2 h-2 rounded-full bg-[#dcb8ff] animate-ping" />
                <span>Processing {aiLoadingAction}...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              disabled={isAiLoading || !content.trim()}
              onClick={() => handleAiProcess('summarize')}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#00f0ff]/15 border border-white/10 hover:border-[#00f0ff]/40 text-xs font-mono text-on-surface hover:text-[#00f0ff] transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
              title="Summarize current note in 2-3 key sentences"
            >
              <span className="material-symbols-outlined text-[16px] text-[#00f0ff]">
                summarize
              </span>
              <span>AI Summarize</span>
            </button>

            <button
              disabled={isAiLoading || (!content.trim() && !title.trim())}
              onClick={() => handleAiProcess('tags')}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 text-xs font-mono text-on-surface hover:text-[#dcb8ff] transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
              title="Auto-extract and add relevant tags"
            >
              <span className="material-symbols-outlined text-[16px] text-[#dcb8ff]">
                label
              </span>
              <span>AI Auto-Tags</span>
            </button>

            <button
              disabled={isAiLoading || !content.trim()}
              onClick={() => handleAiProcess('improve')}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-xs font-mono text-on-surface hover:text-emerald-300 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
              title="Rewrite and polish into structured Markdown"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-400">
                auto_fix_high
              </span>
              <span>AI Polish Note</span>
            </button>

            <button
              disabled={isAiLoading || !content.trim()}
              onClick={() => handleAiProcess('takeaways')}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/40 text-xs font-mono text-on-surface hover:text-amber-300 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
              title="Extract action items and key takeaways"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-400">
                checklist
              </span>
              <span>AI Key Points</span>
            </button>

            <button
              disabled={isAiLoading}
              onClick={() => setShowAiPromptInput(!showAiPromptInput)}
              className="px-3 py-1.5 rounded-lg bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff] font-bold transition-all flex items-center gap-1.5"
              title="Generate note draft from a custom prompt"
            >
              <span className="material-symbols-outlined text-[16px]">
                electric_bolt
              </span>
              <span>AI Draft Generator</span>
            </button>
          </div>

          {/* AI Custom Prompt Input Row */}
          {showAiPromptInput && (
            <div className="pt-2 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={aiCustomPrompt}
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                placeholder="What topic or draft would you like AI to write? (e.g., Weekly Team Sync Notes)"
                className="flex-1 bg-[#1a1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-on-surface focus:ring-0 focus:border-[#00f0ff]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && aiCustomPrompt.trim()) {
                    handleAiProcess('draft');
                  }
                }}
              />
              <button
                disabled={isAiLoading || !aiCustomPrompt.trim()}
                onClick={() => handleAiProcess('draft')}
                className="px-3.5 py-1.5 rounded-lg bg-[#00f0ff] text-[#00363a] font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 disabled:opacity-40"
              >
                Generate Draft
              </button>
            </div>
          )}

          {/* AI Error Display */}
          {aiError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono flex items-center justify-between">
              <span>⚠️ {aiError}</span>
              <button onClick={() => setAiError(null)} className="hover:text-white">
                ×
              </button>
            </div>
          )}

          {/* AI Summary Card Display */}
          {aiSummaryResult && (
            <div className="p-4 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 space-y-2 relative">
              <div className="flex items-center justify-between text-xs font-mono text-[#00f0ff] font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                  AI Executive Summary
                </span>
                <button
                  onClick={() => setAiSummaryResult(null)}
                  className="text-[#849495] hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
              <p className="text-xs text-on-surface font-sans leading-relaxed">
                {aiSummaryResult}
              </p>
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    setContent((prev) => `> **AI Executive Summary:** ${aiSummaryResult}\n\n${prev}`);
                    setAiSummaryResult(null);
                  }}
                  className="text-[11px] font-mono text-[#00f0ff] hover:underline"
                >
                  + Add Summary to Note Top
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hotlink Image Input Modal/Row */}
        {showImageInput && (
          <div className="mb-6 p-4 glass-panel rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[#00f0ff]">image</span>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL here (e.g. https://...)"
              className="flex-1 bg-transparent border-b border-white/20 text-xs font-mono text-on-surface focus:ring-0 focus:border-[#00f0ff] py-1"
            />
            <button
              onClick={() => setShowImageInput(false)}
              className="px-3 py-1 rounded bg-[#00f0ff]/20 text-[#00f0ff] text-xs font-mono font-bold"
            >
              Apply
            </button>
          </div>
        )}

        {/* Content Body / Markdown View */}
        {isPreview ? (
          <div className="prose prose-invert prose-cyan max-w-none text-base md:text-lg leading-relaxed text-[#e2e2e2] p-4 glass-panel rounded-2xl min-h-[400px]">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing your thoughts in markdown..."
            className="w-full min-h-[450px] bg-transparent border-none text-base sm:text-lg md:text-xl text-[#e2e2e2] placeholder:text-white/20 focus:ring-0 outline-none leading-relaxed resize-none p-0"
          />
        )}

        {/* Image Display Attachment */}
        {imageUrl && (
          <div className="my-8 rounded-2xl overflow-hidden glass-panel border border-white/10 relative h-80 sm:h-96 group">
            <img
              src={imageUrl}
              alt="Attached artwork"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={() => console.warn('Image failed to load')}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#121414] to-transparent flex justify-between items-center">
              <span className="text-xs font-mono text-[#849495]">Attached Media</span>
              <button
                onClick={() => setImageUrl('')}
                className="text-xs text-red-400 hover:underline font-mono"
              >
                Remove Image
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Metadata Side Panel */}
      <div className="fixed right-6 bottom-6 hidden md:flex flex-col gap-3 z-30">
        <div className="glass-panel p-4 rounded-2xl w-60 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-[#00f0ff] uppercase tracking-widest font-bold">
              METADATA
            </span>
            <span className="material-symbols-outlined text-[#00f0ff]/50 text-[18px]">
              analytics
            </span>
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between text-[#849495]">
              <span>Word Count</span>
              <span className="text-on-surface font-bold">{wordCount}</span>
            </div>
            <div className="flex justify-between text-[#849495]">
              <span>Reading Time</span>
              <span className="text-on-surface font-bold">{readingTimeMinutes} min</span>
            </div>
            <div className="flex justify-between text-[#849495]">
              <span>Complexity</span>
              <span className="text-on-surface font-bold">
                {wordCount > 300 ? 'High' : wordCount > 100 ? 'Medium' : 'Light'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl w-60 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-[#dcb8ff] uppercase tracking-widest font-bold">
              ENVIRONMENT
            </span>
            <span className="material-symbols-outlined text-[#dcb8ff]/50 text-[18px]">
              cloud
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#dcb8ff] transition-all duration-500"
                style={{ width: `${flowLevel}%` }}
              />
            </div>
            <span className="text-[#dcb8ff] font-bold">{flowLevel}% Flow</span>
          </div>
        </div>
      </div>
    </div>
  );
};
