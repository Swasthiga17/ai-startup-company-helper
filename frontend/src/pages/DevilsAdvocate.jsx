import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Flame, Lightbulb, RefreshCw, ArrowRight, TrendingUp, Sparkles, HelpCircle } from 'lucide-react';
import { getDevilsAdvocate } from '../services/api';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DevilsAdvocate() {
  const { currentStartup, loadStartups } = useApp();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // P5 fix: ensure startups are loaded on direct navigation
  useEffect(() => {
    if (!currentStartup && loadStartups) {
      loadStartups();
    }
  }, []);

  const loadCritique = async (force = false) => {
    if (!currentStartup?.idea) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getDevilsAdvocate(currentStartup.idea);
      if (res.status === 'success' && res.data) {
        setData(res.data);
      } else {
        throw new Error('Could not retrieve evaluation details.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load stress test. Using offline evaluation rules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStartup?.idea) {
      loadCritique();
    }
  }, [currentStartup]);

  if (!currentStartup) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-left">
        <div className="rounded-3xl p-8 text-center bg-white border border-slate-100 shadow-xl max-w-sm w-full">
          <ShieldAlert className="w-11 h-11 text-rose-500 mx-auto mb-4 animate-bounce" />
          <h3 className="text-sm font-extrabold text-slate-800 mb-2">Devil's Advocate Station</h3>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Please create or select an active startup workspace to begin stress-testing your business idea.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left max-w-5xl mx-auto">
      
      {/* Title Card */}
      <motion.div variants={item} className="rounded-2xl p-6 relative overflow-hidden bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <Flame className="w-6 h-6 text-rose-500" />
            <h2 className="text-xl font-bold text-slate-800">Devil's Advocate & Pivots</h2>
          </div>
          <p className="text-xs text-slate-450 font-semibold max-w-2xl">
            Stress-test your idea through adversarial critique, identify critical vulnerabilities, and explore strategic market pivot directions.
          </p>
        </div>
        <button
          onClick={() => loadCritique(true)}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-black shadow-md flex items-center gap-1.5 hover:brightness-105 active:scale-95 transition disabled:opacity-50 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Re-analyzing...' : 'Trigger Critique'}</span>
        </button>
      </motion.div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-64 skeleton"></div>
            <div className="h-40 skeleton"></div>
          </div>
          <div className="md:col-span-1 h-96 skeleton"></div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!loading && data && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Devil's Advocate Section */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Adversarial Critique Card */}
              <div className="rounded-3xl p-6 bg-white border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-500/5 to-transparent rounded-bl-full pointer-events-none" />
                <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Adversarial Idea Stress-Test</h3>
                </div>

                <div className="space-y-3">
                  {data.critique && data.critique.map((pt, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/20 to-transparent border border-rose-100/30 flex items-start gap-3 shadow-xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                        ☠
                      </div>
                      <p className="text-xs text-slate-650 font-semibold leading-relaxed">{pt}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Suggestions for Moat Building */}
              <div className="rounded-3xl p-6 bg-white border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Strategic Recommendations</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-semibold">
                  {data.suggestions && data.suggestions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-xs">
                      <div className="w-4.5 h-4.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Pivot Recommendation Engine Side Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-3xl p-6 bg-white border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-full min-h-[450px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-500/5 to-transparent rounded-bl-full pointer-events-none" />
                
                <div>
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
                    <Sparkles className="w-4.5 h-4.5 text-teal-600" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Pivot Engine</h3>
                  </div>

                  {data.pivots && data.pivots.map((pivot, i) => (
                    <div key={i} className="space-y-6">
                      
                      {/* Before / Original */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm relative">
                        <span className="absolute -top-2 left-4 px-2 py-0.5 bg-slate-200 text-slate-600 text-[8px] font-black uppercase rounded-full">
                          Original Focus
                        </span>
                        <p className="text-xs font-extrabold text-slate-850 mt-1">{pivot.original_focus}</p>
                        <div className="flex justify-between items-center mt-3 border-t border-slate-100 pt-2 text-[10px] font-bold text-slate-400">
                          <span>Market Score</span>
                          <span className="text-slate-600 font-extrabold">{pivot.original_score}%</span>
                        </div>
                      </div>

                      {/* Direction Arrow */}
                      <div className="flex items-center justify-center text-teal-500">
                        <div className="flex flex-col items-center gap-1">
                          <ArrowRight className="w-5 h-5 rotate-90 text-teal-500 animate-pulse" />
                          <span className="text-[9px] uppercase font-black tracking-widest text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                            Pivot Niche
                          </span>
                        </div>
                      </div>

                      {/* After / Pivoted */}
                      <div className="p-4 rounded-2xl bg-teal-50/30 border border-teal-100 shadow-sm relative">
                        <span className="absolute -top-2 left-4 px-2 py-0.5 bg-teal-600 text-white text-[8px] font-black uppercase rounded-full shadow-sm">
                          Strategic Niche
                        </span>
                        <p className="text-xs font-extrabold text-slate-800 mt-1">{pivot.proposed_pivot}</p>
                        <div className="flex justify-between items-center mt-3 border-t border-teal-100/50 pt-2 text-[10px] font-bold text-slate-550">
                          <span>Pivot Score</span>
                          <span className="text-teal-700 font-black text-xs flex items-center gap-0.5">
                            <TrendingUp className="w-3.5 h-3.5" />
                            {pivot.pivot_score}%
                          </span>
                        </div>
                      </div>

                      {/* Rationale description */}
                      <div className="p-4 rounded-2xl bg-violet-50/20 border border-violet-100/50 text-[11px] font-medium text-slate-650 leading-relaxed">
                        <p className="font-extrabold text-slate-700 uppercase tracking-widest text-[9px] mb-1.5 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-violet-500" />
                          <span>Defensibility Rationale</span>
                        </p>
                        {pivot.reason}
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
