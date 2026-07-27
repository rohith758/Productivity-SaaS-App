import { Task, Project, TimeBlock, Note, UserStats } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  { id: 'proj-1', name: 'Product Launch v2.0', color: 'bg-indigo-500 text-indigo-100 border-indigo-600', iconName: 'Rocket', description: 'Q3 Major release tasks' },
  { id: 'proj-2', name: 'Design System Polish', color: 'bg-violet-500 text-violet-100 border-violet-600', iconName: 'Palette', description: 'Component library & tokens' },
  { id: 'proj-3', name: 'Marketing & Growth', color: 'bg-emerald-500 text-emerald-100 border-emerald-600', iconName: 'TrendingUp', description: 'Outreach & content schedule' },
  { id: 'proj-4', name: 'Personal & Health', color: 'bg-amber-500 text-amber-100 border-amber-600', iconName: 'User', description: 'Habits and personal goals' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-101',
    title: 'Finalize API Gateway authentication middleware',
    description: 'Implement JWT validation and rate-limiting headers for production endpoints.',
    status: 'in_progress',
    priority: 'high',
    project: 'proj-1',
    estimatedMinutes: 60,
    actualMinutesSpent: 25,
    dueDate: new Date().toISOString().split('T')[0],
    tags: ['backend', 'security'],
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-1', title: 'Write JWT token verify function', completed: true, estimatedMinutes: 15 },
      { id: 'sub-2', title: 'Add Redis rate limit wrapper', completed: false, estimatedMinutes: 30 },
      { id: 'sub-3', title: 'Unit test auth failure cases', completed: false, estimatedMinutes: 15 }
    ]
  },
  {
    id: 'task-102',
    title: 'Audit accessibility (WCAG AA) on dashboard components',
    description: 'Check color contrast ratios, screen reader labels, and keyboard tab navigation.',
    status: 'todo',
    priority: 'high',
    project: 'proj-2',
    estimatedMinutes: 45,
    actualMinutesSpent: 0,
    dueDate: new Date().toISOString().split('T')[0],
    tags: ['ui', 'a11y'],
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-4', title: 'Run Lighthouse accessibility audit', completed: false },
      { id: 'sub-5', title: 'Fix contrast on muted text labels', completed: false },
      { id: 'sub-6', title: 'Ensure focus rings visible on buttons', completed: false }
    ]
  },
  {
    id: 'task-103',
    title: 'Draft Product Hunt launch campaign copy',
    description: 'Write engaging tagline, maker comment, and screenshot captions for launch day.',
    status: 'review',
    priority: 'medium',
    project: 'proj-3',
    estimatedMinutes: 40,
    actualMinutesSpent: 40,
    dueDate: new Date().toISOString().split('T')[0],
    tags: ['copywriting', 'launch'],
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-7', title: 'Draft main tagline alternatives', completed: true },
      { id: 'sub-8', title: 'Prepare maker comment storytelling', completed: true }
    ]
  },
  {
    id: 'task-104',
    title: 'Complete 30-min morning cardiovascular workout',
    description: 'Brisk outdoor run or rowing session to start the focus day strong.',
    status: 'done',
    priority: 'medium',
    project: 'proj-4',
    estimatedMinutes: 30,
    actualMinutesSpent: 30,
    dueDate: new Date().toISOString().split('T')[0],
    tags: ['fitness', 'health'],
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-9', title: 'Hydrate & stretch', completed: true },
      { id: 'sub-10', title: '30 min cardio run', completed: true }
    ]
  },
  {
    id: 'task-105',
    title: 'Refactor database connection pool settings',
    description: 'Prevent connection timeout spikes under high concurrent user load.',
    status: 'backlog',
    priority: 'low',
    project: 'proj-1',
    estimatedMinutes: 90,
    actualMinutesSpent: 0,
    dueDate: '',
    tags: ['database', 'performance'],
    createdAt: new Date().toISOString(),
    subtasks: []
  },
  {
    id: 'task-106',
    title: 'Design dark theme color tokens in Figma',
    description: 'Establish dark surface elevations, muted border colors, and status accents.',
    status: 'todo',
    priority: 'medium',
    project: 'proj-2',
    estimatedMinutes: 50,
    actualMinutesSpent: 10,
    dueDate: new Date().toISOString().split('T')[0],
    tags: ['figma', 'design'],
    createdAt: new Date().toISOString(),
    subtasks: []
  }
];

export const INITIAL_TIMEBLOCKS: TimeBlock[] = [
  { id: 'tb-1', taskId: 'task-104', title: 'Morning Fitness & Mindfulness', startTime: '08:00', endTime: '09:00', category: 'break', completed: true },
  { id: 'tb-2', taskId: 'task-101', title: 'Deep Work: API Auth Middleware', startTime: '09:15', endTime: '10:45', category: 'focus', completed: false },
  { id: 'tb-3', title: 'Team Sync & Daily Standup', startTime: '11:00', endTime: '11:30', category: 'meeting', completed: false },
  { id: 'tb-4', taskId: 'task-102', title: 'Design System & Accessibility Audit', startTime: '13:00', endTime: '14:30', category: 'work', completed: false },
  { id: 'tb-5', taskId: 'task-103', title: 'Launch Copywriting & Review', startTime: '15:00', endTime: '16:00', category: 'work', completed: false }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Q3 Product Roadmap Priorities',
    content: `# Key Milestones\n- **July 30**: Backend Security Hardening\n- **August 15**: Public Beta Release\n- **September 1**: Full Product Hunt & Press Launch\n\n### Strategic Pillars\n1. Speed & Snappiness\n2. AI-driven task automation\n3. Uncompromising privacy`,
    tags: ['strategy', 'roadmap'],
    pinned: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'note-2',
    title: 'Focus Principles & Daily Rituals',
    content: `- Start day with top 1 MIT (Most Important Task)\n- Never check communications before completing first 45-min focus block\n- Limit daily active work to max 5 core tasks`,
    tags: ['productivity', 'habits'],
    pinned: false,
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_STATS: UserStats = {
  focusScore: 88,
  streakDays: 6,
  totalFocusMinutes: 1420,
  completedTasksCount: 24,
  weeklyGoalMinutes: 1200
};
