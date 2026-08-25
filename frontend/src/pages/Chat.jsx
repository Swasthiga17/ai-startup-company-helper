import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { createActionItem } from '../services/api';
import {
  Send,
  Bot,
  User,
  Loader2,
  Paperclip,
  Globe,
  Image as ImageIcon,
  Trash2,
  ChevronRight,
  Target,
  BarChart3,
  Briefcase,
  TrendingUp,
  ShieldAlert,
  Compass,
  CheckCheck,
  Plus,
  History,
  MessageSquare
} from 'lucide-react';

const DEFAULT_SESSIONS = [
  {
    id: 'session-1',
    title: 'Idea Feasibility Analysis',
    updatedAt: '10:30 AM',
    messages: [
      {
        role: 'assistant',
        content: `Hi Founder! 👋\nI'm your AI Mentor. I can help you validate ideas, analyze markets, build business models, and guide you at every step.\nWhat would you like to discuss today?`,
        timestamp: '10:30 AM'
      },
      {
        role: 'user',
        content: 'I want to know if my startup idea is feasible.',
        timestamp: '10:31 AM'
      },
      {
        role: 'assistant',
        content: 'Great! I\'d be happy to help you validate your idea. 🚀\nPlease share key details about your target audience, problem solved, and traction so I can analyze market size, competition, and risk factors.',
        timestamp: '10:31 AM'
      }
    ]
  },
  {
    id: 'session-2',
    title: 'Competitor Moat & SWOT',
    updatedAt: 'Yesterday',
    messages: [
      {
        role: 'assistant',
        content: 'Welcome back! Let\'s analyze your competitive moats and SWOT profile.',
        timestamp: 'Yesterday 2:15 PM'
      },
      {
        role: 'user',
        content: 'What are the main risks for my SaaS platform?',
        timestamp: 'Yesterday 2:16 PM'
      },
      {
        role: 'assistant',
        content: 'Key risks include customer acquisition costs (CAC) and competitive copying. I recommend building sticky data integrations early.',
        timestamp: 'Yesterday 2:17 PM'
      }
    ]
  },
  {
    id: 'session-3',
    title: 'Financial Projections & TAM',
    updatedAt: 'Aug 2',
    messages: [
      {
        role: 'assistant',
        content: 'Here to help build your 5-year financial model and calculate TAM/SAM/SOM.',
        timestamp: 'Aug 2'
      }
    ]
  }
];

export default function Chat() {
  const { analysis, chat, triggerPushNotification } = useApp();
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('ideaexecutor_chat_sessions');
      return saved ? JSON.parse(saved) : DEFAULT_SESSIONS;
    } catch {
      return DEFAULT_SESSIONS;
    }
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    return sessions[0]?.id || 'session-1';
  });

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const handleAddToActionCenter = async (msgContent) => {
    const cleanText = msgContent.replace(/^[#*-\d.\s]+/, '').trim();
    const taskTitle = cleanText.length > 60 ? cleanText.substring(0, 57) + '...' : cleanText;
    try {
      await createActionItem(taskTitle, 'HIGH', 'Recommended by AI Co-Founder Chat');
      triggerPushNotification?.('Task Added to Action Center', `"${taskTitle}" added to your tasks.`, 'success');
    } catch {
      triggerPushNotification?.('Action Task Created', `Task: ${taskTitle}`, 'info');
    }
  };

  // Active session object
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  // Save sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ideaexecutor_chat_sessions', JSON.stringify(sessions));
    } catch {}
  }, [sessions]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, sending]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || sending) return;

    const userMsg = input.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userMsg, timestamp: timeStr }];

    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? {
              ...s,
              title: s.messages.length <= 1 ? (userMsg.length > 28 ? userMsg.substring(0, 28) + '...' : userMsg) : s.title,
              updatedAt: 'Just now',
              messages: newMessages
            }
          : s
      )
    );

    setSending(true);

    try {
      const reply = await chat(userMsg, analysis?.idea);
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId
            ? {
                ...s,
                updatedAt: 'Just now',
                messages: [...newMessages, { role: 'assistant', content: reply, timestamp: replyTime }]
              }
            : s
        )
      );
    } catch {
      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId
            ? {
                ...s,
                messages: [
                  ...newMessages,
                  {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]
              }
            : s
        )
      );
    } finally {
      setSending(false);
    }
  };

  const handleQuickAction = (actionText) => {
    setInput(actionText);
  };

  const createNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSess = {
      id: newId,
      title: 'New Consultation',
      updatedAt: 'Just now',
      messages: [
        {
          role: 'assistant',
          content: `Hi ${analysis?.user_name || 'Founder'}! 👋\nI'm your AI Mentor. How can I help you execute your vision today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setSessions(prev => [newSess, ...prev]);
    setActiveSessionId(newId);
  };

  const deleteSession = (id, e) => {
    e.stopPropagation();
    if (sessions.length <= 1) return;
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered[0].id);
    }
  };

  const clearCurrentChat = () => {
    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? {
              ...s,
              messages: [
                {
                  role: 'assistant',
                  content: `Hi ${analysis?.user_name || 'Founder'}! 👋\nChat history cleared. What would you like to explore next?`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]
            }
          : s
      )
    );
  };

  const startupIdeaText = analysis?.idea?.problem_statement || analysis?.idea?.startup_name || 'AI Startup & Business Execution Platform';
  const targetAudienceText = analysis?.idea?.target_audience || 'Early-stage founders, SaaS builders, entrepreneurs';

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-left font-sans select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-100/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>AI Mentor Chat</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Get personalized guidance for your startup journey
          </p>
        </div>

        <button
          onClick={createNewSession}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F43F8A] text-white text-xs font-black shadow-md shadow-pink-500/20 hover:opacity-95 transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Chat Session</span>
        </button>
      </div>

      {/* Main 3-column Grid: LEFT (Quick Actions & Capabilities) | CENTER (Main Chat) | RIGHT (Chat History & Context) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Quick Actions & AI Capabilities */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Card 1: Quick Actions */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
              Quick Actions
            </h3>

            <div className="space-y-2">
              {[
                { label: 'Analyze Market Size', icon: Globe, query: 'Analyze the TAM, SAM, and SOM market size for my startup.' },
                { label: 'SWOT Analysis', icon: BarChart3, query: 'Generate a SWOT analysis for my startup concept.' },
                { label: 'Competitor Analysis', icon: Target, query: 'Identify top competitors and key market moats.' },
                { label: 'Business Model Canvas', icon: Briefcase, query: 'Draft a Business Model Canvas and revenue streams.' },
              ].map((btn, idx) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(btn.query)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-purple-50/60 hover:bg-purple-100/70 border border-purple-100 text-purple-900 text-xs font-extrabold transition cursor-pointer text-left shadow-2xs"
                  >
                    <Icon className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="truncate">{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 2: AI Mentor Capabilities */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3.5">
            <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
              AI Mentor Capabilities
            </h3>

            <div className="space-y-2.5 text-xs font-extrabold text-slate-700">
              {[
                { title: 'Idea Validation', icon: Target, color: 'text-emerald-500' },
                { title: 'Market Analysis', icon: BarChart3, color: 'text-purple-500' },
                { title: 'Business Model Design', icon: Briefcase, color: 'text-sky-500' },
                { title: 'Financial Projections', icon: TrendingUp, color: 'text-pink-500' },
                { title: 'Risk Assessment', icon: ShieldAlert, color: 'text-amber-500' },
                { title: 'Go-to-Market Strategy', icon: Compass, color: 'text-violet-500' },
              ].map((cap, idx) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                    onClick={() => handleQuickAction(`Help me with ${cap.title}`)}
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-100/70 flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-3.5 h-3.5 ${cap.color}`} />
                    </div>
                    <span className="truncate">{cap.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: Main Chat Container */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* AI Mentor Card Header */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-100 via-pink-100 to-purple-50 border border-purple-200/80 flex items-center justify-center shadow-xs">
                  <Bot className="w-6 h-6 text-purple-600 animate-pulse" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-900">AI Mentor</h2>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100/80 text-purple-700 uppercase tracking-wider">
                    Your AI Co-founder
                  </span>
                  <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Online
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Session: <span className="font-extrabold text-purple-700">{activeSession?.title}</span>
                </p>
              </div>
            </div>

            <button
              onClick={clearCurrentChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 hover:bg-rose-50 hover:border-rose-200 text-xs font-extrabold text-slate-600 hover:text-rose-600 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Chat</span>
            </button>
          </div>

          {/* Chat Messages Panel */}
          <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-100/90 shadow-inner h-[520px] overflow-y-auto space-y-4">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-purple-100 border-purple-200 text-purple-700'
                        : 'bg-white border-purple-100 text-purple-600'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
                  </div>

                  {/* Message Bubble & Timestamp */}
                  <div className={`max-w-[80%] space-y-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed font-medium ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-purple-100/90 via-pink-100/80 to-purple-100/90 border border-purple-200/70 text-purple-950 shadow-xs'
                          : 'bg-white border border-slate-100 text-slate-800 shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>
                      {msg.actionCta && (
                        <button
                          onClick={() => handleQuickAction(msg.actionCta)}
                          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition cursor-pointer"
                        >
                          <span>[{msg.actionCta}]</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className={`flex items-center gap-2 text-[10px] text-slate-400 font-semibold px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span>{msg.timestamp || '10:30 AM'}</span>
                      {msg.role === 'user' && <CheckCheck className="w-3 h-3 text-purple-500" />}
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => handleAddToActionCenter(msg.content.split('\n')[0] || msg.content)}
                          className="inline-flex items-center gap-1 text-[10px] font-extrabold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200/60 px-2 py-0.5 rounded-lg transition cursor-pointer ml-2"
                          title="Convert recommendation to AI Action Center task"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add to Action Center</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {sending && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 text-xs font-extrabold text-purple-600 bg-white border border-purple-100 px-4 py-2.5 rounded-2xl w-fit shadow-xs"
              >
                <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                <span>AI Mentor is analyzing your prompt...</span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Input Card */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm space-y-2">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              className="w-full px-3 py-2 text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none resize-none font-medium"
            />

            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              {/* Left Attachments & Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickAction('Please analyze my startup idea feasibility.')}
                  className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition cursor-pointer"
                  title="Attach prompt"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAction('Run a web research check on target market trends.')}
                  className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition cursor-pointer"
                  title="Web Search"
                >
                  <Globe className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAction('Suggest a visual pitch deck layout.')}
                  className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition cursor-pointer"
                  title="Media upload"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Right Send Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F43F8A] text-white font-extrabold text-xs shadow-md shadow-pink-500/20 hover:opacity-95 disabled:opacity-40 transition cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Chat History & Conversation Context */}
        <div className="lg:col-span-3 space-y-4">

          {/* CARD 1: Chat Session History Sidebar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-black text-slate-900">Chat History</h3>
              </div>
              <button
                onClick={createNewSession}
                className="text-[11px] font-black text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-100 transition cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {sessions.map((sess) => {
                const isActive = sess.id === activeSessionId;
                return (
                  <div
                    key={sess.id}
                    onClick={() => setActiveSessionId(sess.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                      isActive
                        ? 'bg-purple-50/90 border-purple-200 shadow-xs'
                        : 'bg-slate-50/50 hover:bg-slate-100/70 border-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                      <div className="min-w-0">
                        <p className={`text-xs truncate font-extrabold ${isActive ? 'text-purple-950' : 'text-slate-800'}`}>
                          {sess.title}
                        </p>
                        <span className="text-[10px] font-bold text-slate-400 block">
                          {sess.updatedAt} • {sess.messages.length} msgs
                        </span>
                      </div>
                    </div>

                    {sessions.length > 1 && (
                      <button
                        onClick={(e) => deleteSession(sess.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition"
                        title="Delete thread"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CARD 2: Conversation Context */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">Conversation Context</h3>
              <button
                onClick={() => handleQuickAction('Edit current topic & context')}
                className="text-xs font-extrabold text-purple-600 hover:underline"
              >
                Edit
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Current Topic</span>
                <div className="px-3.5 py-2 rounded-xl bg-purple-50/80 border border-purple-100 text-purple-900 font-extrabold truncate">
                  {activeSession?.title}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Your Idea</span>
                <p className="font-extrabold text-slate-800 line-clamp-2 leading-relaxed">
                  {startupIdeaText}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Target Audience</span>
                <p className="font-extrabold text-slate-700 line-clamp-2 leading-relaxed">
                  {targetAudienceText}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 font-bold">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block">Discussion History</span>
                  <span className="text-xs font-extrabold text-slate-800">{messages.length} messages</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
