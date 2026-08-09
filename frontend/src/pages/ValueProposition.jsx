import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Sparkles, Heart, Zap, Shield, Flame } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function ValueProposition() {
  const { analysis } = useApp();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-10">
      
      {/* Header */}
      <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Value Proposition</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Unique value anchors, pain relievers, and product gain creators</p>
      </motion.div>

      {/* 3 Core Value Pillars */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Pain Relievers', desc: 'Eliminates repetitive manual workflows and drops operations overhead by 30%.', icon: Flame, bg: 'bg-rose-50 border-rose-100 text-rose-600' },
          { title: 'Gain Creators', desc: 'Allows teams to launch product MVPs 3x faster with real-time AI-guided outlines.', icon: Zap, bg: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
          { title: 'Customer Jobs', desc: 'Handles market analytics, automated risk checking, and slide structures in one place.', icon: Sparkles, bg: 'bg-pink-50 border-pink-100 text-pink-600' }
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.bg}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-base">{card.title}</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">{card.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quantitative Benefits */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 pb-4 border-b border-slate-50 mb-4">Core Value Statement</h3>
        <p className="text-sm font-extrabold text-slate-700 leading-relaxed max-w-2xl">
          IdeaExecutor empowers early-stage founders to bypass expensive consulting fees by generating investor-ready documentation, financial models, and SWOT profiles instantly.
        </p>
      </motion.div>

    </motion.div>
  );
}
