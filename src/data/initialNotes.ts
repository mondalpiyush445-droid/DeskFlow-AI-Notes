import { Note, Folder } from '../types';

export const INITIAL_FOLDERS: Folder[] = [
  { id: 'f-philosophy', name: 'Philosophy', color: '#00dbe9' },
  { id: 'f-tech', name: 'Cyberpunk & Tech', color: '#7701d0' },
  { id: 'f-reviews', name: 'Weekly Reviews', color: '#00f0ff' },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'The Architecture of Silence',
    content: `Exploration into minimal living spaces and the psychology of quiet environments. The interface between light and void determines the emotional resonance of a room. Notes on sensory deprivation and productivity...

The neon hum was the only thing keeping the silence at bay. In the heart of the sector, where the light of the upper city barely managed to stain the clouds, I sat watching the cursor blink—a steady, rhythmic heartbeat in a world of digital decay.

> "Information wants to be free, but in the Noir city, freedom is just another word for untraceable."

The architecture of the city mirrors the architecture of our thoughts. Layers of history built upon forgotten foundations, illuminated by the transient brilliance of new tech. NoirNotes isn't just a container; it's the lens through which the chaos becomes structured.`,
    excerpt: 'Exploration into minimal living spaces and the psychology of quiet environments. The interface between light and void determines the emotional resonance of a room. Notes on sensory deprivation and productivity...',
    status: 'in-progress',
    isFavorite: true,
    folderId: 'f-philosophy',
    tags: ['Philosophy', 'Architecture'],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    timeAgo: '2h ago',
    wordCount: 482,
    readingTimeMinutes: 3,
    flowLevel: 85,
  },
  {
    id: 'note-2',
    title: 'The Midnight Protocol',
    content: `The neon hum was the only thing keeping the silence at bay. In the heart of the sector, where the light of the upper city barely managed to stain the clouds, I sat watching the cursor blink—a steady, rhythmic heartbeat in a world of digital decay.

I started typing. Not because I had the answers, but because the void demanded a record. The protocol was simple: observe, document, and disappear. But as the glass panels of my interface reflected the flickering primary-cyan glow of the street signs below, I realized the data was changing as I touched it.

> "Information wants to be free, but in the Noir city, freedom is just another word for untraceable."

The architecture of the city mirrors the architecture of our thoughts. Layers of history built upon forgotten foundations, illuminated by the transient brilliance of new tech. NoirNotes isn't just a container; it's the lens through which the chaos becomes structured.

Every keystroke feels heavy, tactile. The glass beneath my fingertips is cool, a sharp contrast to the heat radiating from the processors. I wonder if anyone else is watching these packets traverse the network, or if I'm truly alone in this sanctuary of light and shadow.`,
    excerpt: 'The protocol was simple: observe, document, and disappear. But as the glass panels of my interface reflected the flickering primary-cyan glow...',
    status: 'draft',
    isFavorite: true,
    folderId: 'f-tech',
    tags: ['creative-writing', 'noir-aesthetic'],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    timeAgo: '30m ago',
    wordCount: 482,
    readingTimeMinutes: 3,
    flowLevel: 74,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx_qTpnZvfEgX5DuiE8acz2dz0gjN2QKgI2qUD6jMtDGHl5LtNdQFrm8OGnbBzmaQBiHzSfDfHM9pzH7pnckY6ijk6NrDVxHmK8LI2PshobDmLernYX2jL8n3moikvH-dChjyZYkWZbv7-8QmEjMMsnbM9KS8QUhyWmP6KBAktwXbdeq8b_6pQeHNrbyBSJ5Gg-zICWrXR_GaBnminc9hZ20Vd6QyKmltuaFE0wHejRLGjYr2rdVJuDYGBArWpHqBQoYW8-tjrUns',
  },
  {
    id: 'note-3',
    title: 'Cyberpunk Etymology',
    content: `Tracing the roots of high-tech low-life across various media platforms. Comparing early literary cyberpunk with modern atmospheric digital aesthetic trends.

Key observations:
1. Low-life vs high-tech tension
2. Neon cyan and deep magenta spectral lighting
3. Modular information systems and offline sanctuary nodes`,
    excerpt: 'Tracing the roots of high-tech low-life across various media platforms...',
    status: 'draft',
    isFavorite: false,
    folderId: 'f-tech',
    tags: ['Cyberpunk', 'Research'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    timeAgo: 'Yesterday',
    wordCount: 150,
    readingTimeMinutes: 1,
    flowLevel: 60,
  },
  {
    id: 'note-4',
    title: 'Weekly Review: Oct 12',
    content: `Summary of creative output and blockages encountered during the sprint.

Achievements:
- Refactored offline database sync engine
- Designed high-contrast glassmorphic card themes
- Tested offline fallback state for local writing sessions`,
    excerpt: 'Summary of creative output and blockages encountered during the sprint...',
    status: 'archive',
    isFavorite: false,
    folderId: 'f-reviews',
    tags: ['Review', 'Sprint'],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    timeAgo: '3d ago',
    wordCount: 95,
    readingTimeMinutes: 1,
    flowLevel: 50,
  },
  {
    id: 'note-5',
    title: 'Midnight Musings',
    content: `The creative spark often arrives when the rest of the world is sleeping. Writing in complete darkness with high-contrast typography creates an unparalleled flow state.

- Keep thoughts uncluttered
- Utilize Markdown formatting for immediate structure
- Auto-save every keystroke directly to offline storage`,
    excerpt: 'The creative spark often arrives when the rest of the world is sleeping...',
    status: 'new',
    isFavorite: false,
    tags: ['Musings', 'Flow'],
    createdAt: new Date(Date.now() - 300000).toISOString(),
    updatedAt: new Date(Date.now() - 300000).toISOString(),
    timeAgo: '5m ago',
    wordCount: 88,
    readingTimeMinutes: 1,
    flowLevel: 90,
  },
  {
    id: 'note-6',
    title: 'Project: Neon Bloom',
    content: `Collaborative notes with the UI team regarding the upcoming release. Key goals include 60fps canvas performance, instant offline database sync, and high-contrast accessibility.`,
    excerpt: 'Collaborative notes with the UI team regarding the upcoming release...',
    status: 'shared',
    isFavorite: false,
    tags: ['Design', 'UI'],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    timeAgo: '1h ago',
    wordCount: 112,
    readingTimeMinutes: 1,
    flowLevel: 70,
  },
];
