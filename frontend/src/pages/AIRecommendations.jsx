import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Sparkles, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function AIRecommendations() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-10">
      
      {/* Header */}
      <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">AI Recommendations</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Automated growth advice and diagnostic warnings tailored to your startup metrics</p>
      </motion.div>

      {/* Recommendations Cards */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 pb-4 border-b border-slate-50 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
          <span>Strategic AI Action Items</span>
        </h3>
        <div className="space-y-4">
          {[
            { tag: 'Marketing Strategy', action: 'Adopt product-led growth (PLG) tactics to minimize Customer Acquisition Costs (CAC).', impact: 'High Impact' },
            { tag: 'Product Feasibility', action: 'Scope down the first iteration of the platform to a single core feature before coding.', impact: 'Critical' },
            { tag: 'Compliance Check', action: 'Initialize Delaware C-Corp documentation early to facilitate smooth VC fundraising.', impact: 'High' }
          ].map((rec, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-purple-600 font-extrabold uppercase tracking-widest">{rec.tag}</span>
                <p className="text-xs font-bold text-slate-800">{rec.action}</p>
              </div>
              <span className="text-[10px] font-extrabold text-pink-600 bg-pink-50 border border-pink-100 px-3 py-1 rounded-full shrink-0">
                {rec.impact}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
