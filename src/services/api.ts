import { Task } from '../types';

export async function apiDeconstructTask(taskTitle: string, description?: string, projectContext?: string) {
  const res = await fetch('/api/ai/deconstruct-task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskTitle, description, projectContext }),
  });
  if (!res.ok) {
    throw new Error('Failed to deconstruct task');
  }
  return await res.json();
}

export async function apiGetDailyBriefing(tasks: Task[], userName?: string) {
  const date = new Date().toISOString().split('T')[0];
  const res = await fetch('/api/ai/daily-briefing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tasks, date, userName }),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch daily briefing');
  }
  return await res.json();
}

export async function apiGetSmartSchedule(tasks: Task[]) {
  const res = await fetch('/api/ai/smart-schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tasks, startHour: 9, endHour: 17 }),
  });
  if (!res.ok) {
    throw new Error('Failed to generate smart schedule');
  }
  return await res.json();
}

export async function apiSendChat(messages: Array<{ role: 'user' | 'assistant'; content: string }>, taskContext?: string) {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, taskContext }),
  });
  if (!res.ok) {
    throw new Error('Failed to send message');
  }
  return await res.json();
}
