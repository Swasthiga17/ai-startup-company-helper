import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Sparkles, Trophy, Lightbulb, Compass, Target } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function FeaturePlanning() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-10">
      
      {/* Header */}
      <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Feature Planning</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">MVP feature selection, complexity assessment, and build priorities</p>
      </motion.div>

      {/* Feature matrix */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-800 pb-4 border-b border-slate-50 mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span>High Impact / Low Effort (P0 Priority)</span>
          </h3>
          <ul className="space-y-3">
            {[
              '1-Click database setup connectors.',
              'Automated validation report download endpoints.',
              'Pre-designed landing page layout editor.'
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-800 pb-4 border-b border-slate-50 mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-pink-600" />
            <span>High Impact / High Effort (P1 Priority)</span>
          </h3>
          <ul className="space-y-3">
            {[
              'Collaborative real-time editing rooms.',
              'Detailed compliance scanning pipelines.',
              'Multi-agent business canvas helper chat.'
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

    </motion.div>
  );
}
