import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  Compass, Zap, TestTube, Users, MessageSquare, 
  DollarSign, ArrowUpRight, Sparkles, CheckCircle2 
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function GrowthAdvisor() {
  const { analysis } = useApp();

  const growth = analysis?.growth || {
    growth_hacks: [
      "Viral Loop: Reward users with free credits or extended features for referring other founders.",
      "Side Project Marketing: Launch a free mini-tool related to the niche on Product Hunt to drive organic traffic."
    ],
    ab_testing: [
      "Test pricing page layout: Compare package-first grid layout against usage-based slider calculator.",
      "Test Landing Hero Copy: Differentiate direct ROI statement ('Save $5k/mo') vs. feature statement ('AI Co-founder')."
    ],
    partnerships: [
      "Co-marketing with local startup incubators and software accelerators.",
      "Integrate directly with popular industry Slack channels or platform marketplaces."
    ],
    feedback_loops: [
      "Automate NPS surveys 14 days after signup.",
      "Schedule short 15-minute product interviews with active churned users."
    ],
    revenue_optimization: [
      "Introduce an annual plan with a 20% discount to boost upfront cash reserves.",
      "Offer cross-sell premium add-ons like dedicated support channels or custom API endpoints."
    ]
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-12">
      
      {/* Header */}
      <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Growth Advisor & Virality Playbook</h1>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">Data-driven growth hacks, A/B testing roadmaps, strategic partnerships, and monetization optimization.</p>
        </div>
      </motion.div>

      {/* Growth Hacks & Virality */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>High-Impact Growth Hacks</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {growth.growth_hacks?.map((hack, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start gap-3">
              <span className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                <Sparkles className="w-4 h-4" />
              </span>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">{hack}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* A/B Testing & Revenue Optimization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* A/B Experiments */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
            <TestTube className="w-4 h-4 text-cyan-600" />
            <span>Priority A/B Tests</span>
          </h2>
          <div className="space-y-3">
            {growth.ab_testing?.map((test, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 text-xs font-black flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">{test}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Optimization */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Monetization & Upsell Strategy</span>
          </h2>
          <div className="space-y-3">
            {growth.revenue_optimization?.map((rev, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-slate-700 leading-relaxed">{rev}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Partnerships & Feedback Loops */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Partnerships */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Strategic Partnerships</span>
          </h2>
          <div className="space-y-3">
            {growth.partnerships?.map((part, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center gap-3">
                <ArrowUpRight className="w-4 h-4 text-indigo-600 shrink-0" />
                <p className="text-xs font-semibold text-slate-700">{part}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feedback Loops */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-pink-600" />
            <span>Feedback Loop Automation</span>
          </h2>
          <div className="space-y-3">
            {growth.feedback_loops?.map((fb, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                <p className="text-xs font-semibold text-slate-700">{fb}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
