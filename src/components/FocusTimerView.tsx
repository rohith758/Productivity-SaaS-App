import React, { useState, useEffect, useRef } from 'react';
import {
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CloudRain,
  Coffee,
  Trees,
  Waves,
  CheckCircle2,
  Zap,
  Sparkles
} from 'lucide-react';
import { Task } from '../types';
import { soundSynth } from '../services/soundSynth';

interface FocusTimerViewProps {
  tasks: Task[];
  initialTaskTitle?: string;
  onLogFocusMinutes: (minutes: number, taskId?: string) => void;
}

export const FocusTimerView: React.FC<FocusTimerViewProps> = ({
  tasks,
  initialTaskTitle,
  onLogFocusMinutes,
}) => {
  const [mode, setMode] = useState<'pomodoro' | 'short_break' | 'long_break'>('pomodoro');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [ambientSound, setAmbientSound] = useState<'off' | 'white_noise' | 'rain' | 'cafe' | 'forest'>('off');
  const [volume, setVolume] = useState(0.3);

  const timerRef = useRef<any>(null);

  // Mode time maps
  const modeTimes = {
    pomodoro: 25,
    short_break: 5,
    long_break: 15,
  };

  const switchMode = (newMode: 'pomodoro' | 'short_break' | 'long_break') => {
    setIsRunning(false);
    setMode(newMode);
    const mins = modeTimes[newMode];
    setDurationMinutes(mins);
    setTimeLeftSeconds(mins * 60);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            soundSynth.playChime();
            soundSynth.stopSound();
            if (mode === 'pomodoro') {
              onLogFocusMinutes(durationMinutes, selectedTaskId || undefined);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode, durationMinutes, selectedTaskId]);

  // Ambient audio trigger
  const toggleAmbientSound = (sound: 'off' | 'white_noise' | 'rain' | 'cafe' | 'forest') => {
    setAmbientSound(sound);
    if (sound === 'off') {
      soundSynth.stopSound();
    } else {
      soundSynth.playSound(sound, volume);
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    soundSynth.setVolume(v);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeftSeconds(durationMinutes * 60);
  };

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSecs = durationMinutes * 60;
  const progressPercent = ((totalSecs - timeLeftSeconds) / totalSecs) * 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            <TimerIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Deep Focus Engine</h2>
            <p className="text-xs text-slate-400">
              科学 Pomodoro 计时器与 Web Audio 神经波环境音
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            {mode === 'pomodoro' ? '🎯 Focus Session' : '☕ Rest Break'}
          </span>
        </div>
      </div>

      {/* Main Timer Display Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-8 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mode Selector Tabs */}
        <div className="inline-flex p-1.5 bg-slate-950 border border-slate-800 rounded-2xl gap-1 relative z-10">
          <button
            onClick={() => switchMode('pomodoro')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mode === 'pomodoro' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pomodoro (25m)
          </button>
          <button
            onClick={() => switchMode('short_break')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mode === 'short_break' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => switchMode('long_break')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mode === 'long_break' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Attached Task Selector */}
        <div className="max-w-md mx-auto relative z-10">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Attach Task to Log Focus Minutes
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">-- General Focus Session --</option>
            {tasks.filter(t => t.status !== 'done').map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        {/* Big Circular Clock */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center z-10">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              className="stroke-slate-800"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              className="stroke-indigo-500 transition-all duration-1000"
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 110}
              strokeDashoffset={2 * Math.PI * 110 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-5xl font-black text-slate-100 tracking-wider">
              {formatTime(timeLeftSeconds)}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-widest mt-2 font-semibold">
              {isRunning ? 'In Flow' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4 relative z-10">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-16 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-all cursor-pointer transform active:scale-95"
          >
            {isRunning ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-0.5" />}
          </button>

          <button
            onClick={resetTimer}
            title="Reset Timer"
            className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Sound Generators */}
        <div className="pt-6 border-t border-slate-800 space-y-4 relative z-10">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Ambient Audio Soundscape</span>
            <span>{ambientSound === 'off' ? 'Muted' : ambientSound.replace('_', ' ')}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              onClick={() => toggleAmbientSound('off')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                ambientSound === 'off' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <VolumeX className="w-4 h-4" />
              <span>Off</span>
            </button>

            <button
              onClick={() => toggleAmbientSound('rain')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                ambientSound === 'rain' ? 'bg-indigo-950 text-indigo-300 border-indigo-700' : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <CloudRain className="w-4 h-4" />
              <span>Rain</span>
            </button>

            <button
              onClick={() => toggleAmbientSound('white_noise')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                ambientSound === 'white_noise' ? 'bg-indigo-950 text-indigo-300 border-indigo-700' : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Waves className="w-4 h-4" />
              <span>Noise</span>
            </button>

            <button
              onClick={() => toggleAmbientSound('cafe')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                ambientSound === 'cafe' ? 'bg-indigo-950 text-indigo-300 border-indigo-700' : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>Cafe</span>
            </button>

            <button
              onClick={() => toggleAmbientSound('forest')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                ambientSound === 'forest' ? 'bg-indigo-950 text-indigo-300 border-indigo-700' : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Trees className="w-4 h-4" />
              <span>Forest</span>
            </button>
          </div>

          {/* Volume Slider */}
          {ambientSound !== 'off' && (
            <div className="flex items-center gap-3 max-w-xs mx-auto pt-2">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
