export type Priority = 'high' | 'medium' | 'low';

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  project: string;
  subtasks: Subtask[];
  estimatedMinutes: number;
  actualMinutesSpent: number;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  iconName: string;
  description?: string;
}

export interface TimeBlock {
  id: string;
  taskId?: string;
  title: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  category: 'work' | 'meeting' | 'focus' | 'break';
  completed: boolean;
}

export interface FocusSession {
  id: string;
  date: string;
  durationMinutes: number;
  mode: 'pomodoro' | 'short_break' | 'long_break';
  taskId?: string;
  taskTitle?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  updatedAt: string;
}

export interface UserStats {
  focusScore: number;
  streakDays: number;
  totalFocusMinutes: number;
  completedTasksCount: number;
  weeklyGoalMinutes: number;
}

export interface FilterState {
  search: string;
  project: string;
  priority: string;
  status: string;
  tag: string;
}

export type ViewMode = 
  | 'dashboard' 
  | 'tasks' 
  | 'planner' 
  | 'focus' 
  | 'notes' 
  | 'assistant' 
  | 'analytics';
