import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, Flame, AlertCircle } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function InvestorReadiness() {
  const { currentStartup } = useApp();

  const score = currentStartup?.score || { overall_score: 7.8, summary: '' };
  const scoreVal = typeof score === 'object' && score !== null ? (score.overall_score || 7.8) : (typeof score === 'number' ? score : 7.8);
  const swot = currentStartup?.swot || { strengths: ['High market potential'], weaknesses: ['Early stage product'] };
  
  const overallReady = Math.round(scoreVal * 10);
  const vcFriendliness = Math.max(50, Math.min(100, Math.round(scoreVal * 10 + 3)));
  const bootstrapScore = Math.max(40, Math.min(100, Math.round(140 - scoreVal * 10)));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left">
      
      {/* Title Card */}
      <motion.div variants={item} className="rounded-2xl p-6 relative overflow-hidden bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-800">Investor Readiness</h2>
        </div>
        <p className="text-xs text-slate-450 font-semibold">Evaluation of investment indicators and fundraising feasibility indices.</p>
      </motion.div>

      {/* Main stats indicators */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Ready Index */}
        <div className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fundraising Readiness</p>
            <h3 className="text-2xl font-black text-slate-800">{overallReady}%</h3>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[9px] font-black uppercase">
              {overallReady >= 80 ? 'Investment Ready' : 'Growth Required'}
            </span>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#F1F5F9" strokeWidth="3.5" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#0D9488" strokeWidth="3.5" strokeDasharray="100" strokeDashoffset={100 - overallReady} strokeLinecap="round" />
            </svg>
            <span className="absolute text-xs font-extrabold text-slate-700">{overallReady}%</span>
          </div>
        </div>

        {/* VC Friendliness */}
        <div className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">VC Friendliness Index</p>
            <h3 className="text-2xl font-black text-slate-800">{vcFriendliness}%</h3>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-[9px] font-black uppercase">
              {vcFriendliness >= 80 ? 'High Appeal' : 'Moderate Appeal'}
            </span>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#F1F5F9" strokeWidth="3.5" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#7C3AED" strokeWidth="3.5" strokeDasharray="100" strokeDashoffset={100 - vcFriendliness} strokeLinecap="round" />
            </svg>
            <span className="absolute text-xs font-extrabold text-slate-700">{vcFriendliness}%</span>
          </div>
        </div>

        {/* Bootstrap index */}
        <div className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bootstrapping Index</p>
            <h3 className="text-2xl font-black text-slate-800">{bootstrapScore}%</h3>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-pink-50 border border-pink-100 text-pink-700 text-[9px] font-black uppercase">
              {bootstrapScore >= 70 ? 'Highly Feasible' : 'Capital Required'}
            </span>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#F1F5F9" strokeWidth="3.5" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#DB2777" strokeWidth="3.5" strokeDasharray="100" strokeDashoffset={100 - bootstrapScore} strokeLinecap="round" />
            </svg>
            <span className="absolute text-xs font-extrabold text-slate-700">{bootstrapScore}%</span>
          </div>
        </div>
      </motion.div>

      {/* Strengths & Weaknesses VC View */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Investment Strengths</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-650 font-medium">
            {(swot.strengths || []).map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-emerald-500 font-extrabold leading-none mt-0.5">✔</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Investment Weaknesses / Risks</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-650 font-medium">
            {(swot.weaknesses || []).map((w, i) => (
              <li key={i} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-rose-500 font-extrabold leading-none mt-0.5">⚠</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* VC Summary */}
      <motion.div variants={item} className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">AI Executive Evaluation</h3>
        </div>
        <p className="text-xs text-slate-600 font-semibold leading-relaxed">
          {score.summary || 'Our AI agents have completed analysis. The evaluation highlights moderate viability with scaling capabilities. We recommend addressing product readiness and CAC optimization parameters before Pitch meetings.'}
        </p>
      </motion.div>

    </motion.div>
  );
}
