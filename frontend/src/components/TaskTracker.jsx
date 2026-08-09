import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Plus, Trash2, ArrowRight } from 'lucide-react';

export function TaskTracker({ initialTasks = [] }) {
  const defaultTasks = [
    { id: 1, text: 'Interview 10 target customers for problem validation', status: 'done', priority: 'High' },
    { id: 2, text: 'Finalize MVP tech stack selection & architecture', status: 'in-progress', priority: 'High' },
    { id: 3, text: 'Set up Stripe billing gateway & subscription tiers', status: 'todo', priority: 'Medium' },
    { id: 4, text: 'Draft investor 1-pager & cap table breakdown', status: 'todo', priority: 'High' },
    { id: 5, text: 'Launch waitlist landing page & analytics trigger', status: 'in-progress', priority: 'Medium' }
  ];

  const [tasks, setTasks] = useState(initialTasks.length > 0 ? initialTasks : defaultTasks);
  const [newTaskText, setNewTaskText] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTaskText.trim(),
        status: 'todo',
        priority: newPriority
      }
    ]);
    setNewTaskText('');
  };

  const moveStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'todo' ? 'in-progress' : currentStatus === 'in-progress' ? 'done' : 'todo';
    setTasks(tasks.map(t => t.id === id ? { ...t, status: nextStatus } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-amber-500/50 bg-amber-500/10 text-amber-400', icon: Circle },
    { id: 'in-progress', title: 'In Progress', color: 'border-blue-500/50 bg-blue-500/10 text-blue-400', icon: Clock },
    { id: 'done', title: 'Completed', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400', icon: CheckCircle2 }
  ];

  return (
    <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-gray-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">⚡</span>
            AI Startup Execution Task Board
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Track and complete AI-generated milestones for your venture.
          </p>
        </div>

        <form onSubmit={addTask} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add custom task..."
            className="bg-gray-950 border border-gray-800 text-sm text-white px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500 w-full md:w-64"
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            className="bg-gray-950 border border-gray-800 text-xs text-gray-300 px-2 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl text-sm font-medium transition flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id);
          const ColIcon = col.icon;

          return (
            <div key={col.id} className="bg-gray-950/40 rounded-xl border border-gray-800/60 p-4 min-h-[300px]">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800/60 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${col.color} flex items-center gap-1.5`}>
                    <ColIcon className="w-3.5 h-3.5" />
                    {col.title}
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-mono bg-gray-900 px-2 py-0.5 rounded-full border border-gray-800">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {colTasks.map((t) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-gray-900/80 border border-gray-800 hover:border-indigo-500/50 p-3.5 rounded-xl transition shadow-lg group relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${t.status === 'done' ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                          {t.text}
                        </p>
                        <button
                          onClick={() => deleteTask(t.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-800/40 text-xs">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          t.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          t.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {t.priority}
                        </span>

                        <button
                          onClick={() => moveStatus(t.id, t.status)}
                          className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition"
                        >
                          Advance <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-600 border border-dashed border-gray-800/80 rounded-xl">
                    No tasks in {col.title.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default TaskTracker;
