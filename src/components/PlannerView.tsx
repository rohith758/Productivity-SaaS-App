import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Plus,
  CheckCircle2,
  Play,
  Zap,
  Trash2,
  CalendarCheck
} from 'lucide-react';
import { TimeBlock, Task } from '../types';
import { apiGetSmartSchedule } from '../services/api';

interface PlannerViewProps {
  timeBlocks: TimeBlock[];
  tasks: Task[];
  onAddTimeBlock: (block: Omit<TimeBlock, 'id'>) => void;
  onDeleteTimeBlock: (id: string) => void;
  onToggleTimeBlockComplete: (id: string) => void;
  onStartFocusSession: (taskTitle: string) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  timeBlocks,
  tasks,
  onAddTimeBlock,
  onDeleteTimeBlock,
  onToggleTimeBlockComplete,
  onStartFocusSession,
}) => {
  const [selectedTaskForBlock, setSelectedTaskForBlock] = useState<string>('');
  const [newTitle, setNewTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState<'work' | 'meeting' | 'focus' | 'break'>('focus');
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  const hours = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const titleToUse = newTitle.trim() || (tasks.find(t => t.id === selectedTaskForBlock)?.title || 'Scheduled Block');
    onAddTimeBlock({
      taskId: selectedTaskForBlock || undefined,
      title: titleToUse,
      startTime,
      endTime,
      category,
      completed: false,
    });
    setNewTitle('');
    setSelectedTaskForBlock('');
  };

  const handleAutoSchedule = async () => {
    setLoadingSchedule(true);
    try {
      const res = await apiGetSmartSchedule(tasks);
      if (res && res.schedule) {
        res.schedule.forEach((item: any, idx: number) => {
          const times = item.timeSlot ? item.timeSlot.split(' - ') : ['10:00', '11:00'];
          onAddTimeBlock({
            taskId: item.taskId,
            title: item.taskTitle,
            startTime: times[0] || `10:${idx}0`,
            endTime: times[1] || `11:${idx}0`,
            category: 'focus',
            completed: false,
          });
        });
      }
    } catch (err) {
      console.error('Failed to auto schedule:', err);
    } finally {
      setLoadingSchedule(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Time-Blocking Calendar</h2>
            <p className="text-xs text-slate-400">
              Structure your daily focus blocks to eliminate decision fatigue
            </p>
          </div>
        </div>

        <button
          onClick={handleAutoSchedule}
          disabled={loadingSchedule}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${loadingSchedule ? 'animate-spin' : ''}`} />
          <span>{loadingSchedule ? 'Optimizing Schedule...' : 'AI Auto-Schedule Day'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 col): Time Block Creator Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm h-fit">
          <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Add Focus Block</span>
          </h3>

          <form onSubmit={handleManualAdd} className="space-y-3.5">
            {/* Select Task option */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Attach Task (Optional)
              </label>
              <select
                value={selectedTaskForBlock}
                onChange={(e) => {
                  setSelectedTaskForBlock(e.target.value);
                  const found = tasks.find(t => t.id === e.target.value);
                  if (found) setNewTitle(found.title);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">-- Custom Block / Select Task --</option>
                {tasks.filter(t => t.status !== 'done').map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Block Title
              </label>
              <input
                type="text"
                placeholder="e.g. Deep Work: System Architecture"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Time Pickers */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="focus">Deep Focus (High Output)</option>
                <option value="work">Standard Work</option>
                <option value="meeting">Sync / Meeting</option>
                <option value="break">Rest / Buffer</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Schedule</span>
            </button>
          </form>
        </div>

        {/* Right Column (2 cols): Daily Timeline Display */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Today's Time Block Timeline</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{timeBlocks.length} Scheduled</span>
          </div>

          <div className="space-y-3">
            {timeBlocks.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs italic">
                No time blocks scheduled yet. Click "AI Auto-Schedule Day" or create one on the left.
              </div>
            ) : (
              timeBlocks.map((block) => (
                <div
                  key={block.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                    block.completed
                      ? 'bg-slate-950/60 border-slate-800 opacity-60'
                      : block.category === 'focus'
                      ? 'bg-indigo-950/30 border-indigo-800/60'
                      : 'bg-slate-800/40 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleTimeBlockComplete(block.id)}
                      className={`cursor-pointer transition-colors ${
                        block.completed ? 'text-emerald-400' : 'text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-400">
                          {block.startTime} - {block.endTime}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          block.category === 'focus' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {block.category}
                        </span>
                      </div>
                      <p className={`text-xs font-semibold text-slate-200 mt-1 ${block.completed ? 'line-through text-slate-500' : ''}`}>
                        {block.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!block.completed && (
                      <button
                        onClick={() => onStartFocusSession(block.title)}
                        title="Start timer for this block"
                        className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteTimeBlock(block.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
