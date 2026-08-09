import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, CheckCircle2, HelpCircle, 
  TrendingUp, Play, ShieldAlert, Cpu
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function ProblemValidation() {
  const { analysis } = useApp();

  const rawProblem = analysis?.problem_validation || {};
  const problemPoints = rawProblem.pain_points || [
    'Critical inefficiencies in standard operations.',
    'High onboarding friction and customer drop-offs.',
    'Lack of centralized diagnostic automation tools.',
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-10">
      
      {/* Header */}
      <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Problem Validation</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Deep-dive validation metrics for your targeted problem hypothesis</p>
      </motion.div>

      {/* Validation Score Banner */}
      <motion.div 
        variants={item} 
        className="rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-[#6D28FF] to-[#EC4899] shadow-xl shadow-purple-500/10"
      >
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 flex items-center justify-center bg-white/10 rounded-full border-4 border-white/20">
            <span className="text-2xl font-black">94%</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-extrabold tracking-widest bg-white/15 px-3 py-1 rounded-full border border-white/20">
              Problem Intensity Score
            </span>
            <h2 className="text-xl font-black tracking-tight mt-1">Validated Pain Point</h2>
            <p className="text-xs opacity-95">Highly painful for current active users with low alternative solutions.</p>
          </div>
        </div>
      </motion.div>

      {/* Core Pain Points */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 pb-4 border-b border-slate-50 mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-pink-600" />
          <span>Core User Pain Points</span>
        </h3>
        <div className="space-y-3">
          {problemPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold shrink-0">
                0{i + 1}
              </span>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed mt-0.5">{point}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Alternatives Analysis */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-800 mb-4">Urgency & Frequency</h3>
          <ul className="space-y-3 text-xs text-slate-600 font-semibold">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6D28FF]" />
              <span>Occurs multiple times daily during operational tasks.</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6D28FF]" />
              <span>Direct correlation with business revenue drop-offs.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-800 mb-4">Existing Alternatives</h3>
          <ul className="space-y-3 text-xs text-slate-600 font-semibold">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              <span>Manual tracking via spreadsheets (Error-prone).</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              <span>Generic, non-specialized project managers.</span>
            </li>
          </ul>
        </div>
      </motion.div>

    </motion.div>
  );
}
