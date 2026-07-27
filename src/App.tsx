import React, { useState, useEffect } from 'react';
import {
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_TIMEBLOCKS,
  INITIAL_NOTES,
  INITIAL_STATS
} from './data/initialData';
import {
  Task,
  Project,
  TimeBlock,
  Note,
  UserStats,
  ViewMode,
  TaskStatus
} from './types';

import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { TasksView } from './components/TasksView';
import { PlannerView } from './components/PlannerView';
import { FocusTimerView } from './components/FocusTimerView';
import { NotesView } from './components/NotesView';
import { AiAssistantView } from './components/AiAssistantView';
import { AnalyticsView } from './components/AnalyticsView';

import { TaskModal } from './components/TaskModal';
import { QuickCaptureModal } from './components/QuickCaptureModal';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [activeProjectFilter, setActiveProjectFilter] = useState<string>('all');

  // Core App State with LocalStorage Persistence
  const [projects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('focusflow_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('focusflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(() => {
    const saved = localStorage.getItem('focusflow_timeblocks');
    return saved ? JSON.parse(saved) : INITIAL_TIMEBLOCKS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('focusflow_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('focusflow_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [modalInitialStatus, setModalInitialStatus] = useState<TaskStatus>('todo');

  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [focusTaskTitle, setFocusTaskTitle] = useState<string>('');

  // LocalStorage Sync Effects
  useEffect(() => {
    localStorage.setItem('focusflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('focusflow_timeblocks', JSON.stringify(timeBlocks));
  }, [timeBlocks]);

  useEffect(() => {
    localStorage.setItem('focusflow_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('focusflow_stats', JSON.stringify(stats));
  }, [stats]);

  // Handler: Toggle Task Status
  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const isDone = t.status === 'done';
          const newStatus: TaskStatus = isDone ? 'todo' : 'done';
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'done' ? new executionTime() : undefined,
          };
        }
        return t;
      })
    );
  };

  const executionTime = () => new Date().toISOString();

  // Handler: Update Task Status Directly
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  // Handler: Save Task (Add or Edit)
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'> & { id?: string }) => {
    if (taskData.id) {
      // Edit
      setTasks(prev =>
        prev.map(t =>
          t.id === taskData.id
            ? {
                ...t,
                ...taskData,
              }
            : t
        )
      );
    } else {
      // Create
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [newTask, ...prev]);
    }
  };

  // Handler: Delete Task
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Handler: Trigger AI Deconstruction
  const handleDeconstructWithAi = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  // Handler: Add TimeBlock
  const handleAddTimeBlock = (newBlock: Omit<TimeBlock, 'id'>) => {
    const block: TimeBlock = {
      ...newBlock,
      id: `tb-${Date.now()}`,
    };
    setTimeBlocks(prev => [...prev, block]);
  };

  const handleDeleteTimeBlock = (id: string) => {
    setTimeBlocks(prev => prev.filter(tb => tb.id !== id));
  };

  const handleToggleTimeBlockComplete = (id: string) => {
    setTimeBlocks(prev =>
      prev.map(tb => (tb.id === id ? { ...tb, completed: !tb.completed } : tb))
    );
  };

  // Handler: Log Focus Session Minutes
  const handleLogFocusMinutes = (minutes: number, taskId?: string) => {
    setStats(prev => ({
      ...prev,
      totalFocusMinutes: prev.totalFocusMinutes + minutes,
      focusScore: Math.min(100, prev.focusScore + 2),
    }));

    if (taskId) {
      setTasks(prev =>
        prev.map(t =>
          t.id === taskId
            ? { ...t, actualMinutesSpent: (t.actualMinutesSpent || 0) + minutes }
            : t
        )
      );
    }
  };

  // Handler: Notes
  const handleAddNote = (newNote: Omit<Note, 'id' | 'updatedAt'>) => {
    const note: Note = {
      ...newNote,
      id: `note-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [note, ...prev]);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(n => (n.id === updatedNote.id ? updatedNote : n)));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Handler: Quick Capture
  const handleQuickSaveTask = (title: string, project: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      status: 'todo',
      priority: 'medium',
      project,
      subtasks: [],
      estimatedMinutes: 30,
      actualMinutesSpent: 0,
      tags: ['quick-capture'],
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleQuickSaveNote = (title: string, content: string) => {
    handleAddNote({
      title,
      content,
      tags: ['quick-capture'],
      pinned: false,
    });
  };

  const handleOpenNewTaskModal = (initialStatus?: TaskStatus) => {
    setTaskToEdit(null);
    setModalInitialStatus(initialStatus || 'todo');
    setIsTaskModalOpen(true);
  };

  const handleStartFocusOnTask = (taskId?: string) => {
    if (taskId) {
      const found = tasks.find(t => t.id === taskId);
      if (found) setFocusTaskTitle(found.title);
    }
    setCurrentView('focus');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Navigation
        currentView={currentView}
        onSelectView={setCurrentView}
        projects={projects}
        activeProjectFilter={activeProjectFilter}
        onSelectProjectFilter={setActiveProjectFilter}
        focusScore={stats.focusScore}
        streakDays={stats.streakDays}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        onTriggerBriefing={() => setCurrentView('dashboard')}
      />

      {/* Main Workspace View Container */}
      <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
        {currentView === 'dashboard' && (
          <DashboardView
            tasks={tasks}
            projects={projects}
            timeBlocks={timeBlocks}
            stats={stats}
            onToggleTaskStatus={handleToggleTaskStatus}
            onNavigateToView={setCurrentView}
            onOpenNewTaskModal={handleOpenNewTaskModal}
            onStartFocusOnTask={handleStartFocusOnTask}
          />
        )}

        {currentView === 'tasks' && (
          <TasksView
            tasks={tasks}
            projects={projects}
            activeProjectFilter={activeProjectFilter}
            onSelectProjectFilter={setActiveProjectFilter}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onDeleteTask={handleDeleteTask}
            onEditTask={(task) => {
              setTaskToEdit(task);
              setIsTaskModalOpen(true);
            }}
            onOpenNewTaskModal={handleOpenNewTaskModal}
            onDeconstructWithAi={handleDeconstructWithAi}
          />
        )}

        {currentView === 'planner' && (
          <PlannerView
            timeBlocks={timeBlocks}
            tasks={tasks}
            onAddTimeBlock={handleAddTimeBlock}
            onDeleteTimeBlock={handleDeleteTimeBlock}
            onToggleTimeBlockComplete={handleToggleTimeBlockComplete}
            onStartFocusSession={(title) => {
              setFocusTaskTitle(title);
              setCurrentView('focus');
            }}
          />
        )}

        {currentView === 'focus' && (
          <FocusTimerView
            tasks={tasks}
            initialTaskTitle={focusTaskTitle}
            onLogFocusMinutes={handleLogFocusMinutes}
          />
        )}

        {currentView === 'notes' && (
          <NotesView
            notes={notes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {currentView === 'assistant' && (
          <AiAssistantView tasks={tasks} />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView stats={stats} tasks={tasks} />
        )}
      </main>

      {/* Task Creation & Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
        projects={projects}
        initialStatus={modalInitialStatus}
        onSaveTask={handleSaveTask}
      />

      {/* Quick Capture Overlay Modal */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        projects={projects}
        onQuickSaveTask={handleQuickSaveTask}
        onQuickSaveNote={handleQuickSaveNote}
      />
    </div>
  );
}
