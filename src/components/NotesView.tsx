import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Pin,
  Tag,
  Search,
  Trash2,
  Sparkles,
  Edit3,
  Check
} from 'lucide-react';
import { Note } from '../types';

interface NotesViewProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags || [])));

  const filteredNotes = notes.filter(n => {
    if (selectedTag !== 'all' && (!n.tags || !n.tags.includes(selectedTag))) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateNewNote = () => {
    const newId = `note-${Date.now()}`;
    onAddNote({
      title: 'Untitled Scratchpad Note',
      content: 'Start writing your thoughts, ideas, or action items here...',
      tags: ['quick-capture'],
      pinned: false,
    });
    setActiveNoteId(newId);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Notes & Scratchpad</h2>
            <p className="text-xs text-slate-400">
              Capture meeting thoughts, product briefs, and instant ideas
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/25 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Two-Pane Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Pane (1 col): Note List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 h-[calc(100vh-280px)] flex flex-col">
          {/* Search & Tag Filter */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Notes Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredNotes.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No notes found.</p>
            ) : (
              filteredNotes.map((note) => {
                const isActive = note.id === activeNote?.id;
                return (
                  <button
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer block ${
                      isActive
                        ? 'bg-slate-800 border-indigo-500/60 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-semibold text-slate-200 truncate">{note.title}</h4>
                      {note.pinned && <Pin className="w-3 h-3 text-indigo-400 fill-indigo-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {note.content}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {note.tags?.map((t) => (
                        <span key={t} className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane (2 cols): Note Editor */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 h-[calc(100vh-280px)] flex flex-col">
          {activeNote ? (
            <>
              {/* Note Editor Header */}
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-800">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => onUpdateNote({ ...activeNote, title: e.target.value, updatedAt: new Date().toISOString() })}
                  className="bg-transparent text-lg font-bold text-slate-100 focus:outline-none w-full"
                  placeholder="Note Title"
                />

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onUpdateNote({ ...activeNote, pinned: !activeNote.pinned })}
                    title="Pin Note"
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      activeNote.pinned ? 'bg-indigo-950 border-indigo-700 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Pin className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteNote(activeNote.id)}
                    title="Delete Note"
                    className="p-2 bg-slate-800 border border-slate-700 text-rose-400 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note Content Textarea */}
              <textarea
                value={activeNote.content}
                onChange={(e) => onUpdateNote({ ...activeNote, content: e.target.value, updatedAt: new Date().toISOString() })}
                placeholder="Write your note in Markdown or plain text..."
                className="w-full flex-1 bg-transparent text-sm text-slate-200 leading-relaxed focus:outline-none resize-none font-mono"
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select or create a note to begin editing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
