import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Trello, FileText, Calendar, Users, Plus, Trash2,
  ArrowRight, ArrowLeft, CheckCircle, Clock, Play, UserPlus,
  Sparkles, Loader2, StickyNote, Inbox, ClipboardList, Users2
} from 'lucide-react';
import { sendChatMessage, getActionItems, createActionItem, updateActionItem, deleteActionItem } from '../services/api';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

/* --- localStorage helpers --- */
function loadLS(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function saveLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { }
}

/* --- Default seeds --- */
const DEFAULT_TASKS = [
  { id: 1, title: 'Finalize Pricing Strategy', desc: 'Detail tier subscriptions and API usage tiers.', status: 'todo', tag: 'Finance' },
  { id: 2, title: 'Design Landing Page Wireframes', desc: 'Create landing copies and visual blocks layout.', status: 'in-progress', tag: 'Branding' },
  { id: 3, title: 'Draft NDA Template', desc: 'Setup early co-founder nondisclosure document.', status: 'review', tag: 'Legal' },
  { id: 4, title: 'Perform Competitor SWOT Research', desc: 'Scrape market rivals pricing and features.', status: 'completed', tag: 'Validation' }
];

const DEFAULT_NOTES = [
  { id: 1, content: 'B2B outreach: Focus on early incubators in major tech hubs.', date: '12/07/2026', color: 'bg-violet-50 border-violet-100 text-violet-700' },
  { id: 2, content: 'Gemini model fallback: Ensure templates load locally on key expiry.', date: '12/07/2026', color: 'bg-pink-50 border-pink-100 text-pink-700' },
  { id: 3, content: 'Pricing note: Offer standard plans at $29/mo and enterprise on custom call.', date: '13/07/2026', color: 'bg-amber-50 border-amber-100 text-amber-700' }
];

const DEFAULT_MEETINGS = [
  { id: 1, title: 'Kickoff & Role Setup', date: '2026-07-10', summary: 'Defined initial roles. Swasthiga assigned as Lead Builder. Setup core MVP timelines and target SaaS TAM parameters.' }
];

const DEFAULT_MEMBERS = [
  { name: 'Founder (You)', email: 'founder@startup.com', role: 'Co-Founder', status: 'Active' },
  { name: 'AI Startup Genie', email: 'genie@ai.com', role: 'Advisor', status: 'Active' }
];



export default function WorkspaceHub() {
  const { currentStartup, chat } = useApp();
  const [activeTab, setActiveTab] = useState('kanban');
  const [loadingState, setLoadingState] = useState(false);

  /* --- Persisted State --- */
  const [tasks, setTasks] = useState(() => loadLS('wh_tasks', DEFAULT_TASKS));
  const [notes, setNotes] = useState(() => loadLS('wh_notes', DEFAULT_NOTES));
  const [meetings, setMeetings] = useState(() => loadLS('wh_meetings', DEFAULT_MEETINGS));
  const [members, setMembers] = useState(() => loadLS('wh_members', DEFAULT_MEMBERS));

  /* --- Form State --- */
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('General');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteColor, setNewNoteColor] = useState('bg-violet-50 border-violet-100 text-violet-700');
  const [meetTitle, setMeetTitle] = useState('');
  const [meetDate, setMeetDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetNotes, setMeetNotes] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Co-Founder');

  /* --- Fetch Remote Action Items --- */
  useEffect(() => {
    const fetchRemoteTasks = async () => {
      try {
        const res = await getActionItems();
        if (res && res.items && res.items.length > 0) {
          const mappedRemote = res.items.map(it => ({
            id: it.id,
            title: it.title,
            desc: it.description || it.reason || '',
            status: (it.status || 'TODO').toLowerCase().replace('_', '-'),
            tag: it.category || 'General'
          }));
          setTasks(mappedRemote);
        }
      } catch (err) {
        console.warn("Using local storage tasks fallback:", err);
      }
    };
    fetchRemoteTasks();
  }, []);

  /* --- Persist to localStorage on change --- */
  useEffect(() => { saveLS('wh_tasks', tasks); }, [tasks]);
  useEffect(() => { saveLS('wh_notes', notes); }, [notes]);
  useEffect(() => { saveLS('wh_meetings', meetings); }, [meetings]);
  useEffect(() => { saveLS('wh_members', members); }, [members]);

  /* --- Task Handlers --- */
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const title = newTaskTitle.trim();
    const desc = newTaskDesc.trim();
    const tag = newTaskTag;

    const tempId = Date.now();
    setTasks(prev => [...prev, { id: tempId, title, desc, status: 'todo', tag }]);
    setNewTaskTitle(''); setNewTaskDesc(''); setNewTaskTag('General');

    try {
      const res = await createActionItem(title, 'HIGH', desc);
      if (res && res.item) {
        setTasks(prev => prev.map(t => t.id === tempId ? { ...t, id: res.item.id } : t));
      }
    } catch (err) {
      console.warn("Failed to persist task to backend database:", err);
    }
  };

  const moveTask = async (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    if (typeof taskId === 'number' && taskId < 1000000000000) {
      try {
        const dbStatus = newStatus.toUpperCase().replace('-', '_');
        await updateActionItem(taskId, dbStatus);
      } catch (err) {
        console.warn("Failed to update task status on backend database:", err);
      }
    }
  };

  const deleteTask = async (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (typeof taskId === 'number' && taskId < 1000000000000) {
      try {
        await deleteActionItem(taskId);
      } catch (err) {
        console.warn("Failed to delete task on backend database:", err);
      }
    }
  };

  /* --- Note Handlers --- */
  const addNote = (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    setNotes(prev => [{ id: Date.now(), content: newNoteContent, date: new Date().toLocaleDateString(), color: newNoteColor }, ...prev]);
    setNewNoteContent('');
  };

  const deleteNote = (noteId) => setNotes(prev => prev.filter(n => n.id !== noteId));

  /* --- Meeting Handlers (real AI) --- */
  const addMeeting = async (e) => {
    e.preventDefault();
    if (!meetTitle.trim() || !meetNotes.trim()) return;
    setLoadingState(true);
    try {
      const idea = currentStartup?.idea || 'our startup';
      const aiPrompt = `Summarize the following meeting notes from a startup meeting about "${idea}" into concise bullet-point action items and key decisions:\n\n${meetNotes}`;
      let summary;
      try {
        summary = await chat(aiPrompt, idea);
      } catch {
        summary = `Key discussion points: ${meetNotes.slice(0, 200)}...`;
      }
      setMeetings(prev => [{ id: Date.now(), title: meetTitle, date: meetDate, summary }, ...prev]);
      setMeetTitle(''); setMeetNotes('');
    } finally {
      setLoadingState(false);
    }
  };

  /* --- Team Handlers --- */
  const inviteMember = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setMembers(prev => [...prev, { name: inviteEmail.split('@')[0], email: inviteEmail, role: inviteRole, status: 'Pending invite' }]);
    setInviteEmail('');
  };

  const removeMember = (email) => {
    setMembers(prev => prev.filter(m => m.email !== email));
  };

  /* --- Derived startup display --- */
  const startupName = currentStartup?.idea
    ? (currentStartup.idea.length > 40 ? currentStartup.idea.slice(0, 40) + '…' : currentStartup.idea)
    : null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left">

      {/* Title block */}
      <motion.div variants={item} className="rounded-2xl p-6 relative overflow-hidden bg-white border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trello className="w-6 h-6 text-violet-600 animate-pulse" />
            <h2 className="text-xl font-bold text-slate-800">Workspace Hub</h2>
          </div>
          {startupName ? (
            <p className="text-xs text-slate-500 font-semibold">
              Working on: <span className="text-violet-600 font-bold">"{startupName}"</span>
            </p>
          ) : (
            <p className="text-xs text-slate-400 font-semibold">Organize Kanban tasks, sticky notes, meeting summaries, and co-founder roles.</p>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl w-fit shrink-0 flex-wrap">
          {[
            { id: 'kanban', label: 'Kanban Board', icon: Trello },
            { id: 'notes', label: 'Sticky Notes', icon: StickyNote },
            { id: 'meetings', label: 'Meeting Logs', icon: Calendar },
            { id: 'team', label: 'Team Roles', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === tab.id
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">

        {/* ── Kanban Board ── */}
        {activeTab === 'kanban' && (
          <motion.div key="kanban" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

            {/* Add Task Form */}
            <motion.div variants={item} className="rounded-2xl p-5 bg-white border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1">
                <Plus className="w-4 h-4 text-violet-500" />
                <span>Add Task Card</span>
              </h3>
              <form onSubmit={addTask} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1 md:col-span-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Task Title</label>
                  <input
                    type="text" required value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    placeholder="E.g. Setup payment API"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Description</label>
                  <input
                    type="text" value={newTaskDesc}
                    onChange={e => setNewTaskDesc(e.target.value)}
                    placeholder="Short detail description..."
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none bg-slate-50/50"
                  />
                </div>
                <div className="flex gap-2 items-end md:col-span-1">
                  <div className="space-y-1 flex-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Category</label>
                    <select
                      value={newTaskTag} onChange={e => setNewTaskTag(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none bg-slate-50/50"
                    >
                      {['General', 'Finance', 'Branding', 'Legal', 'Validation', 'Product'].map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="px-4 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-black shadow-md hover:brightness-105 active:scale-95 transition cursor-pointer">
                    Add
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Kanban Columns */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { id: 'todo', label: 'To Do', color: 'border-t-slate-400 bg-slate-50/50', dot: 'bg-slate-400' },
                { id: 'in-progress', label: 'In Progress', color: 'border-t-amber-400 bg-amber-50/10', dot: 'bg-amber-400' },
                { id: 'review', label: 'Under Review', color: 'border-t-indigo-400 bg-indigo-50/10', dot: 'bg-indigo-400' },
                { id: 'completed', label: 'Completed', color: 'border-t-emerald-400 bg-emerald-50/10', dot: 'bg-emerald-400' }
              ].map(col => {
                const colTasks = tasks.filter(t => t.status === col.id);
                return (
                  <div key={col.id} className={`rounded-2xl border border-slate-100 border-t-4 p-4 shadow-xs ${col.color} min-h-[300px] flex flex-col`}>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                        <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{col.label}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200/50 text-slate-500 text-[10px] font-black rounded-full">
                        {colTasks.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      {colTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-center opacity-50">
                          <ClipboardList className="w-7 h-7 text-slate-300 mb-2" />
                          <p className="text-[10px] text-slate-400 font-semibold">No tasks here yet</p>
                        </div>
                      ) : colTasks.map(task => (
                        <div key={task.id} className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm space-y-2 text-left relative group">
                          <div className="flex justify-between items-start">
                            <span className="px-1.5 py-0.5 bg-violet-50 text-violet-700 font-black text-[9px] uppercase tracking-wider rounded-md border border-violet-100/50">
                              {task.tag}
                            </span>
                            <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-800">{task.title}</h4>
                          {task.desc && <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">{task.desc}</p>}

                          <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-100 mt-2">
                            {col.id !== 'todo' && (
                              <button
                                title="Move back"
                                onClick={() => moveTask(task.id, col.id === 'in-progress' ? 'todo' : col.id === 'review' ? 'in-progress' : 'review')}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {col.id !== 'completed' && (
                              <button
                                title="Move forward"
                                onClick={() => moveTask(task.id, col.id === 'todo' ? 'in-progress' : col.id === 'in-progress' ? 'review' : 'completed')}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {/* ── Sticky Notes ── */}
        {activeTab === 'notes' && (
          <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <motion.div variants={item} className="rounded-2xl p-5 bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <form onSubmit={addNote} className="flex-1 flex gap-3">
                <input
                  type="text" required value={newNoteContent}
                  onChange={e => setNewNoteContent(e.target.value)}
                  placeholder="Type sticky note reminder here..."
                  className="flex-1 px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none bg-slate-50/50"
                />
                <div className="flex gap-1.5 items-center">
                  {[
                    { color: 'bg-violet-50 border-violet-100 text-violet-700', bg: 'bg-violet-300' },
                    { color: 'bg-pink-50 border-pink-100 text-pink-700', bg: 'bg-pink-300' },
                    { color: 'bg-amber-50 border-amber-100 text-amber-700', bg: 'bg-amber-300' }
                  ].map(toggle => (
                    <button
                      key={toggle.color} type="button"
                      onClick={() => setNewNoteColor(toggle.color)}
                      className={`w-5 h-5 rounded-full ${toggle.bg} border-2 ${newNoteColor === toggle.color ? 'border-slate-800' : 'border-transparent'} transition`}
                    />
                  ))}
                </div>
                <button type="submit" className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-black shadow-md hover:brightness-105 active:scale-95 transition cursor-pointer shrink-0">
                  Post Note
                </button>
              </form>
            </motion.div>

            {notes.length === 0 ? (
              <motion.div variants={item} className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                <StickyNote className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm text-slate-400 font-bold">No sticky notes yet</p>
                <p className="text-xs text-slate-400 mt-1">Post a note above to capture quick ideas</p>
              </motion.div>
            ) : (
              <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {notes.map(note => (
                  <div key={note.id} className={`rounded-2xl p-5 border min-h-[140px] flex flex-col justify-between relative group shadow-sm ${note.color}`}>
                    <button onClick={() => deleteNote(note.id)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 hover:bg-black/5 rounded-lg transition-all text-current/80">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-xs font-bold leading-relaxed pr-5">{note.content}</p>
                    <span className="text-[9px] opacity-75 font-semibold block pt-3 border-t border-current/10 mt-3">{note.date}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── Meeting Logs ── */}
        {activeTab === 'meetings' && (
          <motion.div key="meetings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-1 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4 h-fit">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1 flex items-center gap-1 border-b border-slate-100 pb-2">
                <Calendar className="w-4 h-4 text-violet-500" />
                <span>Log Meeting Minutes</span>
              </h3>
              <form onSubmit={addMeeting} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Meeting Title</label>
                  <input
                    type="text" required value={meetTitle} onChange={e => setMeetTitle(e.target.value)}
                    placeholder="E.g. Strategy Review"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Meeting Date</label>
                  <input
                    type="date" required value={meetDate} onChange={e => setMeetDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Attendees & Discussion Notes</label>
                  <textarea
                    required rows={4} value={meetNotes} onChange={e => setMeetNotes(e.target.value)}
                    placeholder="List attendees, core ideas discussed, and action points here..."
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none bg-slate-50/50"
                  />
                </div>
                <button
                  type="submit" disabled={loadingState}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 hover:brightness-105 active:scale-95 transition disabled:opacity-50 cursor-pointer"
                >
                  {loadingState ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{loadingState ? 'Summarizing with AI…' : 'Summarize with AI'}</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {meetings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center opacity-60">
                  <Calendar className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="text-sm text-slate-400 font-bold">No meetings logged yet</p>
                  <p className="text-xs text-slate-400 mt-1">Log your first meeting on the left and let AI summarize it</p>
                </div>
              ) : meetings.map(meet => (
                <div key={meet.id} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <h4 className="text-sm font-extrabold text-slate-800">{meet.title}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{meet.date}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-violet-50/30 border border-violet-100/50 text-xs font-semibold text-slate-600 leading-relaxed flex gap-2">
                    <Sparkles className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                    <span style={{ whiteSpace: 'pre-wrap' }}>{meet.summary}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Team Members ── */}
        {activeTab === 'team' && (
          <motion.div key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-1 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4 h-fit">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1 flex items-center gap-1 border-b border-slate-100 pb-2">
                <UserPlus className="w-4 h-4 text-violet-500" />
                <span>Invite Co-Founder</span>
              </h3>
              <form onSubmit={inviteMember} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Co-Founder Email</label>
                  <input
                    type="email" required value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                    placeholder="name@startup.com"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Role Title</label>
                  <select
                    value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none bg-slate-50/50"
                  >
                    {['Co-Founder', 'CMO (Marketing)', 'CTO (Engineering)', 'Advisor', 'Investor'].map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="w-full px-4 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-black shadow-md hover:brightness-105 active:scale-95 transition cursor-pointer">
                  Send Invitation
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm">
                <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Startup Team Members</h3>
                  <span className="text-[10px] text-slate-400 font-bold">{members.length} member{members.length !== 1 ? 's' : ''}</span>
                </div>
                {members.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center opacity-60">
                    <Users2 className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="text-sm text-slate-400 font-bold">No team members yet</p>
                    <p className="text-xs text-slate-400 mt-1">Invite your co-founders using the form</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {members.map((member, i) => (
                      <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50/30 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-sm font-bold text-violet-600 shadow-inner">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{member.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 bg-violet-50 text-violet-700 font-black text-[9px] uppercase tracking-wider rounded-full border border-violet-100/50">
                            {member.role}
                          </span>
                          <span className={`text-[10px] font-black ${member.status === 'Active' ? 'text-emerald-600' : 'text-amber-500 animate-pulse'}`}>
                            {member.status}
                          </span>
                          {member.status !== 'Active' && (
                            <button
                              onClick={() => removeMember(member.email)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
