import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Calendar, CheckCircle, ShieldAlert, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function Decisions() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newCategory, setNewCategory] = useState('STRATEGY');
  const [newImpact, setNewImpact] = useState('HIGH');

  useEffect(() => {
    fetchDecisions();
  }, []);

  const fetchDecisions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/decisions');
      if (res.data && res.data.decisions) {
        setDecisions(res.data.decisions);
      }
    } catch (err) {
      console.error("Failed to fetch decisions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDecision = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await api.post('/decisions', {
        title: newTitle,
        reason: newReason,
        category: newCategory,
        impact: newImpact
      });
      if (res.data && res.data.decision) {
        setDecisions([res.data.decision, ...decisions]);
      }
      setNewTitle('');
      setNewReason('');
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create decision:", err);
    }
  };

  const handleDeleteDecision = async (id) => {
    try {
      await api.delete(`/decisions/${id}`);
      setDecisions(decisions.filter(d => d.id !== id));
    } catch (err) {
      console.error("Failed to delete decision:", err);
    }
  };

  const mockDefaultDecisions = [
    { id: 'm1', title: '🎯 Focus customer segment on college students & early professionals', reason: 'Highest pain severity and early-adopter referral potential.', date: 'Aug 25, 2026', category: 'STRATEGY', impact: 'HIGH' },
    { id: 'm2', title: '💰 Selected ₹499/month subscription pricing model', reason: 'Verified via 15 target audience customer willingness-to-pay interviews.', date: 'Aug 23, 2026', category: 'PRICING', impact: 'MEDIUM' },
    { id: 'm3', title: '🛠️ Reduced initial MVP scope to core AI roadmap generator', reason: 'Faster time-to-market and lower technical validation complexity.', date: 'Aug 20, 2026', category: 'PRODUCT', impact: 'HIGH' }
  ];

  const displayDecisions = decisions.length > 0 ? decisions : mockDefaultDecisions;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-widest mb-1">
            <Target className="w-4 h-4" /> Founder Intelligence Ledger
          </div>
          <h1 className="text-3xl font-extrabold text-white">Founder Decision Log</h1>
          <p className="text-slate-400 text-sm mt-1">
            A chronological timeline of strategic choices, pricing tests, and product direction decisions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Record New Decision
        </button>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {displayDecisions.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-md hover:border-slate-700 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-md uppercase">
                  {item.category}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {item.date}
                </span>
                <span className="text-xs text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Impact: {item.impact}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              {item.reason && (
                <p className="text-slate-300 text-xs leading-relaxed">
                  <strong className="text-slate-400">Reason / Rationale:</strong> {item.reason}
                </p>
              )}
            </div>

            {typeof item.id === 'number' && (
              <button
                onClick={() => handleDeleteDecision(item.id)}
                className="text-slate-500 hover:text-rose-400 p-2 rounded-lg transition"
                title="Delete decision entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-xl font-bold text-white">Record Founder Decision</h3>

            <form onSubmit={handleCreateDecision} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Decision Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Focus early target customer on college students"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Rationale / Reason</label>
                <textarea
                  rows={3}
                  placeholder="Explain why this decision was made..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="STRATEGY">Strategy</option>
                    <option value="PRICING">Pricing</option>
                    <option value="PRODUCT">Product Scope</option>
                    <option value="MARKETING">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Impact Level</label>
                  <select
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Save Decision Log
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
