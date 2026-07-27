import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Zap,
  Target,
  Clock,
  HelpCircle
} from 'lucide-react';
import { Task } from '../types';
import { apiSendChat } from '../services/api';

interface AiAssistantViewProps {
  tasks: Task[];
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ tasks }) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Hello Alex! I am your AI Productivity Coach. I can analyze your open tasks, recommend priority strategies, draft team updates, or help you break down complex projects. What would you like to focus on today?`,
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "What are my top 3 priorities today?",
    "I feel overwhelmed - what should I do next?",
    "Draft a quick status update for my team",
    "How can I optimize my focus time blocks?"
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMsg.trim();
    if (!text || loading) return;

    const userMessage = { role: 'user' as const, content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!textToSend) setInputMsg('');
    setLoading(true);

    try {
      const taskContext = tasks.map(t => `- [${t.priority.toUpperCase()}] ${t.title} (${t.status})`).join('\n');
      const res = await apiSendChat(updatedMessages, taskContext);
      setMessages([...updatedMessages, { role: 'assistant', content: res.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...updatedMessages, { role: 'assistant', content: "Sorry, I had trouble processing your request. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>FocusFlow AI Coach</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">
                Gemini 3.6
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Personalized workflow advice, task prioritization, and deep work coaching
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[560px] shadow-xl overflow-hidden">
        {/* Quick Prompts Bar */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-500 uppercase shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Quick Prompts:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              disabled={loading}
              className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-3 py-1 rounded-full shrink-0 transition-colors cursor-pointer disabled:opacity-50"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                <span>Gemini is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask your AI Productivity Coach..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
