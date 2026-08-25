import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Plus, CheckCircle2, XCircle, Clock, Lightbulb, ArrowRight, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function Experiments() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [hypothesis, setHypothesis] = useState('');
  const [task, setTask] = useState('');
  const [successCriteria, setSuccessCriteria] = useState('');

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/experiments');
      if (res.data && res.data.experiments) {
        setExperiments(res.data.experiments);
      }
    } catch (err) {
      console.error("Failed to fetch experiments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExperiment = async (e) => {
    e.preventDefault();
    if (!hypothesis.trim()) return;

    try {
      const res = await api.post('/experiments', {
        hypothesis,
        task,
        success_criteria: successCriteria
      });
      if (res.data && res.data.experiment) {
        setExperiments([res.data.experiment, ...experiments]);
      }
      setHypothesis('');
      setTask('');
      setSuccessCriteria('');
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create experiment:", err);
    }
  };

  const handleUpdateStatus = async (id, status, results, ai_conclusion) => {
    try {
      const res = await api.patch(`/experiments/${id}`, { status, results, ai_conclusion });
      if (res.data && res.data.experiment) {
        setExperiments(experiments.map(e => e.id === id ? res.data.experiment : e));
      }
    } catch (err) {
      console.error("Failed to update experiment:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/experiments/${id}`);
      setExperiments(experiments.filter(e => e.id !== id));
    } catch (err) {
      console.error("Failed to delete experiment:", err);
    }
  };

  const mockDefaultExperiments = [
    {
      id: 'e1',
      hypothesis: 'Students will pay ₹499/month for AI career guidance & resume building.',
      task: 'Interview 20 target college students & run landing page pre-order test.',
      success_criteria: 'At least 30% (6/20) express direct willingness to pay.',
      status: 'VALIDATED',
      results: '17 interviewed: 6 interested, 4 willing to pre-order.',
      ai_conclusion: 'Pricing hypothesis validated with moderate conversion rate. Proceed to tier 1 launch.',
      date: 'Aug 25, 2026'
    },
    {
      id: 'e2',
      hypothesis: 'College placement officers will adopt B2B dashboard for student progress tracking.',
      task: 'Pitch 5 university career counselor departments.',
      success_criteria: 'At least 2 sign pilot agreements.',
      status: 'IN_PROGRESS',
      results: '3 pitched so far, 1 expressed verbal interest.',
      ai_conclusion: 'Ongoing validation required. Strengthen B2B analytics deck.',
      date: 'Aug 22, 2026'
    }
  ];

  const displayExperiments = experiments.length > 0 ? experiments : mockDefaultExperiments;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-widest mb-1">
            <FlaskConical className="w-4 h-4" /> Hypothesis Testing Engine
          </div>
          <h1 className="text-3xl font-extrabold text-white">Startup Experiments Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Validate critical business assumptions before building heavy features or deploying capital.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Experiment
        </button>
      </div>

      {/* Experiment Cards */}
      <div className="space-y-6">
        {displayExperiments.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-md hover:border-slate-700 transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border ${
                  exp.status === 'VALIDATED'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : exp.status === 'INVALIDATED'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {exp.status === 'VALIDATED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {exp.status === 'INVALIDATED' && <XCircle className="w-3.5 h-3.5" />}
                  {exp.status === 'IN_PROGRESS' && <Clock className="w-3.5 h-3.5" />}
                  {exp.status}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{exp.date}</span>
              </div>

              {typeof exp.id === 'number' && (
                <div className="flex items-center gap-2">
                  {exp.status === 'IN_PROGRESS' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(exp.id, 'VALIDATED', 'Validated via customer test', 'Hypothesis supported by field results.')}
                        className="text-xs font-bold bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg hover:bg-emerald-600/50"
                      >
                        Mark Validated
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(exp.id, 'INVALIDATED', 'Invalidated via customer test', 'Hypothesis not supported by target users.')}
                        className="text-xs font-bold bg-rose-600/30 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-lg hover:bg-rose-600/50"
                      >
                        Mark Invalidated
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(exp.id)} className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">💡 Hypothesis</div>
                <p className="text-sm font-semibold text-white">{exp.hypothesis}</p>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">📋 Action Task</div>
                <p className="text-xs text-slate-300 leading-relaxed">{exp.task}</p>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">🎯 Success Criteria</div>
                <p className="text-xs text-slate-300 leading-relaxed">{exp.success_criteria}</p>
              </div>
            </div>

            {(exp.results || exp.ai_conclusion) && (
              <div className="bg-slate-950/70 border border-indigo-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-semibold text-indigo-300">Measured Results & AI Conclusion</div>
                  <p className="text-slate-300 mt-0.5">{exp.results} {exp.ai_conclusion && `— ${exp.ai_conclusion}`}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-xl font-bold text-white">Design Validation Experiment</h3>

            <form onSubmit={handleCreateExperiment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Hypothesis</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Students will pay ₹499/month for AI career guidance"
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Validation Task</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Interview 20 target college students"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Success Criteria</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. At least 30% express direct willingness to pay"
                  value={successCriteria}
                  onChange={(e) => setSuccessCriteria(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
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
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Launch Experiment
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
