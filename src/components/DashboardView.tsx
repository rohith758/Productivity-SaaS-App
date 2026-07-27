import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Play,
  Zap,
  TrendingUp,
  AlertCircle,
  Plus,
  Target,
  ListTodo,
  CalendarCheck
} from 'lucide-react';
import { Task, TimeBlock, UserStats, ViewMode, Project } from '../types';
import { apiGetDailyBriefing } from '../services/api';

interface DashboardViewProps {
  tasks: Task[];
  projects: Project[];
  timeBlocks: TimeBlock[];
  stats: UserStats;
  onToggleTaskStatus: (taskId: string) => void;
  onNavigateToView: (view: ViewMode) => void;
  onOpenNewTaskModal: (status?: string) => void;
  onStartFocusOnTask: (taskId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  projects,
  timeBlocks,
  stats,
  onToggleTaskStatus,
  onNavigateToView,
  onOpenNewTaskModal,
  onStartFocusOnTask,
}) => {
  const [briefing, setBriefing] = useState<{
    greeting: string;
    topPriorities: string[];
    focusAdvice: string;
    estimatedHours: number;
  } | null>(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);

  const fetchBriefing = async () => {
    setLoadingBriefing(true);
    try {
      const res = await apiGetDailyBriefing(tasks, 'Alex');
      setBriefing(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBriefing(false);
    }
  };

  // Task filtering for matrix
  const highPriorityDoFirst = tasks.filter(t => t.priority === 'high' && t.status !== 'done');
  const mediumPrioritySchedule = tasks.filter(t => t.priority === 'medium' && t.status !== 'done');
  const doneTodayCount = tasks.filter(t => t.status === 'done').length;
  const inProgressTask = tasks.find(t => t.status === 'in_progress') || tasks.find(t => t.status === 'todo');

  const getProjectName = (projId: string) => {
    const found = projects.find(p => p.id === projId);
    return found ? found.name : 'General';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Header & AI Briefing Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Daily Briefing
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight">
              {briefing?.greeting || "Good day, Alex! Ready for a high-focus session?"}
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              {briefing?.focusAdvice || "Focus on finalizing your API Gateway auth middleware before diving into design reviews."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchBriefing}
              disabled={loadingBriefing}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-indigo-400 ${loadingBriefing ? 'animate-spin' : ''}`} />
              <span>{loadingBriefing ? 'Analyzing Workflow...' : 'Refresh AI Briefing'}</span>
            </button>
            <button
              onClick={() => onStartFocusOnTask(inProgressTask?.id)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Focus Session</span>
            </button>
          </div>
        </div>

        {/* Top 3 Priorities pills if available */}
        {briefing?.topPriorities && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Priorities:</span>
            {briefing.topPriorities.map((item, idx) => (
              <span key={idx} className="text-xs bg-slate-800 text-slate-200 px-3 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1.5 font-medium">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-medium text-slate-400">Focus Score</span>
            <div className="text-2xl font-bold text-slate-100 mt-1 flex items-baseline gap-1">
              {stats.focusScore}
              <span className="text-xs font-normal text-emerald-400">/100</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +4 points this week
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-medium text-slate-400">Tasks Completed Today</span>
            <div className="text-2xl font-bold text-slate-100 mt-1">
              {doneTodayCount}
              <span className="text-xs font-normal text-slate-400"> / {tasks.length} Total</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Keep momentum going
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-medium text-slate-400">Deep Focus Hours</span>
            <div className="text-2xl font-bold text-slate-100 mt-1">
              {(stats.totalFocusMinutes / 60).toFixed(1)}
              <span className="text-xs font-normal text-slate-400"> hrs</span>
            </div>
            <span className="text-[11px] text-indigo-400 font-medium flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" /> 2.5 hrs logged today
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-medium text-slate-400">Active Streak</span>
            <div className="text-2xl font-bold text-slate-100 mt-1">
              {stats.streakDays}
              <span className="text-xs font-normal text-slate-400"> Days</span>
            </div>
            <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1 mt-1">
              <Zap className="w-3 h-3 fill-amber-400" /> Best personal streak
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Eisenhower Priorities & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): High Priority / Focus Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Task Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-slate-100 text-base">Eisenhower Priority Focus</h3>
              </div>
              <button
                onClick={() => onNavigateToView('tasks')}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Full Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Do First (High Priority) */}
              <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-300">Do First (High Impact)</span>
                  </div>
                  <span className="text-xs bg-rose-900/40 text-rose-300 px-2 py-0.5 rounded-full font-semibold">
                    {highPriorityDoFirst.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {highPriorityDoFirst.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">No urgent tasks pending!</p>
                  ) : (
                    highPriorityDoFirst.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg flex items-start gap-2.5 group hover:border-slate-700 transition-all"
                      >
                        <button
                          onClick={() => onToggleTaskStatus(task.id)}
                          className="mt-0.5 shrink-0 text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-200 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                            <span className="text-indigo-400 font-medium">{getProjectName(task.project)}</span>
                            <span>•</span>
                            <span>{task.estimatedMinutes}m</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Schedule (Medium Priority) */}
              <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Schedule (Medium Priority)</span>
                  </div>
                  <span className="text-xs bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                    {mediumPrioritySchedule.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {mediumPrioritySchedule.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">No scheduled medium priority tasks.</p>
                  ) : (
                    mediumPrioritySchedule.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg flex items-start gap-2.5 group hover:border-slate-700 transition-all"
                      >
                        <button
                          onClick={() => onToggleTaskStatus(task.id)}
                          className="mt-0.5 shrink-0 text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-200 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                            <span className="text-violet-400 font-medium">{getProjectName(task.project)}</span>
                            <span>•</span>
                            <span>{task.estimatedMinutes}m</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Active Task Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <ListTodo className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-100">Need to capture a new goal?</h4>
                <p className="text-xs text-slate-400">Add tasks directly or use AI task deconstruction</p>
              </div>
            </div>
            <button
              onClick={() => onOpenNewTaskModal('todo')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Right Column (1 col): Today's Schedule & Pomodoro Launcher */}
        <div className="space-y-6">
          {/* Today's Schedule Time Blocks */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <h3 className="font-semibold text-slate-100 text-sm">Today's Time Blocks</h3>
              </div>
              <button
                onClick={() => onNavigateToView('planner')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                Planner
              </button>
            </div>

            <div className="space-y-2.5">
              {timeBlocks.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2 text-center">No time blocks scheduled for today.</p>
              ) : (
                timeBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      block.completed
                        ? 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-70'
                        : block.category === 'focus'
                        ? 'bg-indigo-950/30 border-indigo-800/60 text-slate-200'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-[11px] text-indigo-400 font-semibold block">{block.startTime} - {block.endTime}</span>
                      <span className={`font-medium line-clamp-1 ${block.completed ? 'line-through' : ''}`}>{block.title}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                      block.category === 'focus' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {block.category}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Focus Mode Launcher */}
          <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-2xl p-5 shadow-sm text-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h4 className="font-semibold text-slate-100 text-sm">Deep Focus Mode</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Launch a 25-minute Pomodoro timer with background ambient soundscapes (Rain, White Noise, Cafe) to enter flow state.
            </p>
            <button
              onClick={() => onNavigateToView('focus')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-700/60 font-medium py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-indigo-300" />
              <span>Open Focus Timer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
