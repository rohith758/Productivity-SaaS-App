import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Timer,
  FileText,
  Bot,
  BarChart3,
  Plus,
  Sparkles,
  Zap,
  FolderKanban,
  Search,
  Bell
} from 'lucide-react';
import { ViewMode, Project } from '../types';

interface NavigationProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  projects: Project[];
  activeProjectFilter: string;
  onSelectProjectFilter: (projId: string) => void;
  focusScore: number;
  streakDays: number;
  onOpenQuickCapture: () => void;
  onTriggerBriefing: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onSelectView,
  projects,
  activeProjectFilter,
  onSelectProjectFilter,
  focusScore,
  streakDays,
  onOpenQuickCapture,
  onTriggerBriefing,
}) => {
  const navItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks' as ViewMode, label: 'Tasks & Board', icon: CheckSquare },
    { id: 'planner' as ViewMode, label: 'Time Planner', icon: Calendar },
    { id: 'focus' as ViewMode, label: 'Focus Mode', icon: Timer },
    { id: 'notes' as ViewMode, label: 'Notes & Ideas', icon: FileText },
    { id: 'assistant' as ViewMode, label: 'AI Coach', icon: Bot, badge: 'AI' },
    { id: 'analytics' as ViewMode, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 text-slate-300 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-bold text-lg tracking-wider">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-100 text-base leading-tight tracking-tight">FocusFlow</h1>
              <span className="text-xs text-indigo-400 font-medium tracking-wide">Productivity Suite</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-3">
          <button
            onClick={onOpenQuickCapture}
            className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium py-2.5 px-3.5 rounded-xl shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Capture</span>
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="px-2.5 space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Workspace Projects Section */}
        <div className="mt-6 px-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            <div className="flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
              <span>Projects</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => onSelectProjectFilter('all')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                activeProjectFilter === 'all' ? 'bg-slate-800 text-indigo-300 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>All Workspace Tasks</span>
            </button>
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => onSelectProjectFilter(proj.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                  activeProjectFilter === proj.id ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-2 h-2 rounded-full ${proj.color.split(' ')[0]}`} />
                  <span className="truncate">{proj.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer User Metrics & AI Trigger */}
      <div className="p-3 m-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium text-slate-300">Focus Score</span>
          <span className="font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-md">
            {focusScore}/100
          </span>
        </div>

        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${focusScore}%` }}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>{streakDays} Day Streak</span>
          </div>

          <button
            onClick={onTriggerBriefing}
            title="Generate AI Daily Briefing"
            className="text-xs bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 p-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium">Briefing</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
