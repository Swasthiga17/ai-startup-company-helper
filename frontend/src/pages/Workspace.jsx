import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ArrowRight, Plus, Trash2, AlertTriangle, Loader2 } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Workspace() {
  const navigate = useNavigate();
  const { startups, currentStartup, loadStartups, selectStartup, removeStartup } = useApp();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadStartups();
  }, [loadStartups]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeStartup(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left relative">
      
      {/* Header title */}
      <motion.div variants={item} className="rounded-2xl p-6 relative overflow-hidden bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-6 h-6 text-violet-600" />
            <h2 className="text-xl font-bold text-slate-800">My Startups</h2>
          </div>
          <p className="text-xs text-slate-450 font-semibold">Manage multiple startup projects and toggle active workspaces.</p>
        </div>
        <button 
          onClick={() => navigate('/input')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-black shadow-md flex items-center gap-1.5 hover:brightness-105 active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Startup</span>
        </button>
      </motion.div>

      {/* Grid listing */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {startups.map((s) => {
          const isActive = currentStartup?.id === s.id;
          const overallScore = s.score?.overall_score ? Math.round(s.score.overall_score * 10) : 80;
          return (
            <div 
              key={s.id} 
              className={`rounded-2xl p-6 bg-white border shadow-sm transition-all relative flex flex-col justify-between ${
                isActive ? 'border-violet-500 ring-2 ring-violet-500/10' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm font-bold shadow-inner">
                    🚀
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 leading-tight">
                      {s.idea ? s.idea.split('.')[0].replace('Startup Name: ', '') : 'Unnamed Project'}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Draft'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isActive && (
                    <span className="px-2 py-0.5 bg-violet-50 border border-violet-100 text-violet-600 font-black rounded-full text-[9px] uppercase tracking-wider">
                      Active workspace
                    </span>
                  )}
                  <button
                    onClick={() => setDeleteTarget(s)}
                    title="Delete workspace"
                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed my-3">
                {s.idea || 'No description available.'}
              </p>

              {/* Startup Score Ring & Actions */}
              <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-2">
                <div className="flex items-center gap-2">
                  {/* Small progress circle */}
                  <div className="relative w-9 h-9 flex items-center justify-center text-[10px] font-black text-slate-700">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#8B5CF6" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - overallScore} strokeLinecap="round" />
                    </svg>
                    <span className="absolute">{overallScore}</span>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase leading-none">AI Score</p>
                    <p className="text-[11px] font-extrabold text-slate-700 mt-0.5">Ready for review</p>
                  </div>
                </div>

                {!isActive ? (
                  <button 
                    onClick={() => selectStartup(s.id)}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-violet-50 hover:text-violet-600 text-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition active:scale-95"
                  >
                    <span>Activate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 rounded-lg bg-violet-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition hover:bg-violet-700 active:scale-95 shadow-sm"
                  >
                    <span>Enter Dashboard</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty state card */}
        <div 
          onClick={() => navigate('/input')}
          className="rounded-2xl p-6 border border-dashed border-slate-200 hover:border-slate-350 cursor-pointer flex flex-col justify-center items-center text-center bg-slate-50/50 hover:bg-slate-50 transition-all min-h-[180px]"
        >
          <div className="w-12 h-12 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-500 mb-3 shadow-inner">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Add Another Startup</h3>
          <p className="text-[11px] text-slate-450 mt-1 max-w-xs font-semibold">Run your second startup idea through our parallel multi-agent AI consultant team.</p>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-extrabold text-slate-800">Delete Startup Workspace?</h3>
                <p className="text-xs text-slate-500 font-medium">
                  This will permanently delete <span className="font-bold text-slate-700">"{deleteTarget.idea?.slice(0, 30)}..."</span> and all generated AI analysis data.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
