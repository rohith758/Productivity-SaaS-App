import React, { useState } from 'react';
import { X, Plus, CheckSquare, FileText, Sparkles } from 'lucide-react';
import { Project, TaskStatus } from '../types';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onQuickSaveTask: (title: string, project: string) => void;
  onQuickSaveNote: (title: string, content: string) => void;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  projects,
  onQuickSaveTask,
  onQuickSaveNote,
}) => {
  const [tab, setTab] = useState<'task' | 'note'>('task');
  const [title, setTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id || 'proj-1');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (tab === 'task') {
      onQuickSaveTask(title.trim(), selectedProject);
    } else {
      onQuickSaveNote(title.trim(), noteContent.trim() || 'Quick note content...');
    }

    setTitle('');
    setNoteContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header Tabs */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTab('task')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                tab === 'task' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Quick Task</span>
            </button>

            <button
              onClick={() => setTab('note')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                tab === 'note' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Quick Note</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {tab === 'task' ? 'Task Goal / Item' : 'Note Title'}
            </label>
            <input
              type="text"
              placeholder={tab === 'task' ? 'What needs to be done?' : 'Idea or scratchpad title...'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
              autoFocus
              required
            />
          </div>

          {tab === 'task' ? (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Project Category
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Content
              </label>
              <textarea
                placeholder="Write your note content..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none font-mono"
              />
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2 rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2 rounded-xl text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Capture {tab === 'task' ? 'Task' : 'Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
