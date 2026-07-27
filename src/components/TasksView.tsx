import React, { useState } from 'react';
import {
  CheckSquare,
  LayoutGrid,
  List,
  Sparkles,
  Plus,
  Search,
  Filter,
  Tag,
  Clock,
  CheckCircle2,
  MoreVertical,
  Trash2,
  Edit2,
  ChevronRight,
  Grid2X2
} from 'lucide-react';
import { Task, TaskStatus, Priority, Project, FilterState } from '../types';

interface TasksViewProps {
  tasks: Task[];
  projects: Project[];
  activeProjectFilter: string;
  onSelectProjectFilter: (projId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onOpenNewTaskModal: (initialStatus?: TaskStatus) => void;
  onDeconstructWithAi: (task: Task) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  projects,
  activeProjectFilter,
  onSelectProjectFilter,
  onUpdateTaskStatus,
  onDeleteTask,
  onEditTask,
  onOpenNewTaskModal,
  onDeconstructWithAi,
}) => {
  const [layoutMode, setLayoutMode] = useState<'board' | 'list' | 'matrix'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Extract all unique tags
  const allTags = Array.from(new Set(tasks.flatMap(t => t.tags || [])));

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    if (activeProjectFilter !== 'all' && task.project !== activeProjectFilter) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    if (selectedTag !== 'all' && (!task.tags || !task.tags.includes(selectedTag))) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = (task.description || '').toLowerCase().includes(q);
      const matchTag = task.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  const columns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'backlog', label: 'Backlog', color: 'border-slate-700 text-slate-400' },
    { id: 'todo', label: 'To Do', color: 'border-indigo-700 text-indigo-400' },
    { id: 'in_progress', label: 'In Progress', color: 'border-amber-600 text-amber-400' },
    { id: 'review', label: 'In Review', color: 'border-violet-600 text-violet-400' },
    { id: 'done', label: 'Completed', color: 'border-emerald-600 text-emerald-400' },
  ];

  const getProjectInfo = (projId: string) => {
    return projects.find(p => p.id === projId) || { name: 'General', color: 'bg-slate-700 text-slate-200 border-slate-600' };
  };

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'high':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">P1 HIGH</span>;
      case 'medium':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">P2 MED</span>;
      case 'low':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600">P3 LOW</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Controls & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Tasks & Projects</h2>
            <p className="text-xs text-slate-400">
              Showing {filteredTasks.length} of {tasks.length} total tasks
            </p>
          </div>
        </div>

        {/* View Layout Switcher & Action Button */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setLayoutMode('board')}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                layoutMode === 'board' ? 'bg-slate-800 text-indigo-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                layoutMode === 'list' ? 'bg-slate-800 text-indigo-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setLayoutMode('matrix')}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                layoutMode === 'matrix' ? 'bg-slate-800 text-indigo-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid2X2 className="w-4 h-4" />
              <span className="hidden sm:inline">Matrix</span>
            </button>
          </div>

          <button
            onClick={() => onOpenNewTaskModal('todo')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[240px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search tasks, descriptions, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Project Dropdown */}
          <select
            value={activeProjectFilter}
            onChange={(e) => onSelectProjectFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Priority Dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority (P1)</option>
            <option value="medium">Medium Priority (P2)</option>
            <option value="low">Low Priority (P3)</option>
          </select>

          {/* Tags Dropdown */}
          {allTags.length > 0 && (
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>#{tag}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* --- KANBAN BOARD VIEW --- */}
      {layoutMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex flex-col h-[calc(100vh-280px)] min-w-[240px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full border ${col.color}`} />
                    <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">{col.label}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Tasks Scrollable Area */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {colTasks.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-xl text-xs text-slate-600">
                      No tasks
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const proj = getProjectInfo(task.project);
                      const completedSubtasks = (task.subtasks || []).filter(s => s.completed).length;
                      const totalSubtasks = (task.subtasks || []).length;

                      return (
                        <div
                          key={task.id}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-sm hover:border-slate-700 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${proj.color}`}>
                              {proj.name}
                            </span>
                            {getPriorityBadge(task.priority)}
                          </div>

                          <h4 className="text-xs font-semibold text-slate-200 line-clamp-2 group-hover:text-indigo-300 transition-colors leading-snug">
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Subtasks Progress Bar if any */}
                          {totalSubtasks > 0 && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                                <span>Checklist</span>
                                <span>{completedSubtasks}/{totalSubtasks}</span>
                              </div>
                              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                <div
                                  className="bg-indigo-500 h-full rounded-full"
                                  style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Footer Info & Actions */}
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{task.estimatedMinutes}m</span>
                            </div>

                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => onDeconstructWithAi(task)}
                                title="Deconstruct task with Gemini AI"
                                className="p-1 hover:bg-slate-800 text-indigo-400 rounded-md transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => onEditTask(task)}
                                title="Edit task"
                                className="p-1 hover:bg-slate-800 text-slate-300 rounded-md transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => onDeleteTask(task.id)}
                                title="Delete task"
                                className="p-1 hover:bg-slate-800 text-rose-400 rounded-md transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Status Shift Dropdown */}
                              <select
                                value={task.status}
                                onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                                className="bg-slate-950 border border-slate-800 rounded text-[10px] px-1 py-0.5 text-slate-300 cursor-pointer ml-1"
                              >
                                <option value="backlog">Backlog</option>
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="review">Review</option>
                                <option value="done">Done</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <button
                  onClick={() => onOpenNewTaskModal(col.id)}
                  className="mt-2 w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add {col.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* --- LIST VIEW --- */}
      {layoutMode === 'list' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 overflow-hidden shadow-sm">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No tasks match your current filters.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const proj = getProjectInfo(task.project);
              return (
                <div
                  key={task.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors group"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() =>
                        onUpdateTaskStatus(
                          task.id,
                          task.status === 'done' ? 'todo' : 'done'
                        )
                      }
                      className={`mt-0.5 shrink-0 cursor-pointer transition-colors ${
                        task.status === 'done' ? 'text-emerald-400' : 'text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${proj.color}`}>
                          {proj.name}
                        </span>
                        {getPriorityBadge(task.priority)}
                        <span className="text-[10px] uppercase font-semibold text-indigo-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className={`text-sm font-semibold text-slate-200 ${task.status === 'done' ? 'line-through text-slate-500' : ''}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right text-xs text-slate-400 font-mono">
                      <span>{task.estimatedMinutes} mins</span>
                    </div>

                    <button
                      onClick={() => onDeconstructWithAi(task)}
                      className="px-2.5 py-1.5 bg-indigo-950 border border-indigo-800 text-indigo-300 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-indigo-900 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>AI Break down</span>
                    </button>

                    <button
                      onClick={() => onEditTask(task)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* --- EISENHOWER MATRIX QUAD VIEW --- */}
      {layoutMode === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quad 1: High Priority / Urgent */}
          <div className="bg-slate-900 border border-rose-900/40 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-xs uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Quad 1: Do First (High Impact)
              </h3>
            </div>
            <div className="space-y-2">
              {filteredTasks.filter(t => t.priority === 'high' && t.status !== 'done').map(task => (
                <div key={task.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-medium text-slate-200">
                  {task.title}
                </div>
              ))}
            </div>
          </div>

          {/* Quad 2: High Priority / Strategic */}
          <div className="bg-slate-900 border border-indigo-900/40 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                Quad 2: Schedule (Strategic / Deep Work)
              </h3>
            </div>
            <div className="space-y-2">
              {filteredTasks.filter(t => t.priority === 'medium' && t.status !== 'done').map(task => (
                <div key={task.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-medium text-slate-200">
                  {task.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
