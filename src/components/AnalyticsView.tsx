import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  Target
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { UserStats, Task } from '../types';

interface AnalyticsViewProps {
  stats: UserStats;
  tasks: Task[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats, tasks }) => {
  // Mock weekly focus velocity data
  const weeklyFocusData = [
    { day: 'Mon', focusHours: 3.5, completedTasks: 5 },
    { day: 'Tue', focusHours: 4.2, completedTasks: 6 },
    { day: 'Wed', focusHours: 5.0, completedTasks: 8 },
    { day: 'Thu', focusHours: 3.8, completedTasks: 4 },
    { day: 'Fri', focusHours: 4.5, completedTasks: 7 },
    { day: 'Sat', focusHours: 2.0, completedTasks: 3 },
    { day: 'Sun', focusHours: 1.5, completedTasks: 2 },
  ];

  // Priority distribution
  const highCount = tasks.filter(t => t.priority === 'high').length;
  const medCount = tasks.filter(t => t.priority === 'medium').length;
  const lowCount = tasks.filter(t => t.priority === 'low').length;

  const priorityData = [
    { name: 'High (P1)', value: highCount || 1, color: '#f43f5e' },
    { name: 'Medium (P2)', value: medCount || 1, color: '#f59e0b' },
    { name: 'Low (P3)', value: lowCount || 1, color: '#64748b' },
  ];

  const totalTasks = tasks.length || 1;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Productivity Analytics & Velocity</h2>
            <p className="text-xs text-slate-400">
              Track focus trends, task completion rates, and deep work output
            </p>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400">Focus Score Index</span>
          <div className="text-2xl font-bold text-slate-100 mt-1 flex items-baseline gap-1">
            {stats.focusScore} <span className="text-xs font-normal text-emerald-400">/100</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> Top 5% productivity cohort
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400">Task Completion Rate</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {completionRate}%
          </div>
          <span className="text-[11px] text-indigo-400 font-medium flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> {completedTasks} completed / {totalTasks} total
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400">Total Focus Time</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {(stats.totalFocusMinutes / 60).toFixed(1)} <span className="text-xs font-normal text-slate-400">Hours</span>
          </div>
          <span className="text-[11px] text-violet-400 font-medium flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> Goal: {(stats.weeklyGoalMinutes / 60).toFixed(0)} hrs/wk
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400">Focus Streak</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {stats.streakDays} <span className="text-xs font-normal text-slate-400">Days</span>
          </div>
          <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1 mt-1">
            <Zap className="w-3 h-3 fill-amber-400" /> Active daily streak
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Daily Focus Hours Area Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-100 text-sm">Weekly Focus Hours & Velocity</h3>
            <span className="text-xs text-indigo-400 font-mono">This Week</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyFocusData}>
                <defs>
                  <linearGradient id="focusColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="focusHours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#focusColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column (1 col): Priority Distribution Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-slate-100 text-sm">Tasks by Priority</h3>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {priorityData.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span>{p.name}</span>
                </div>
                <span className="font-mono font-bold">{p.value} tasks</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
