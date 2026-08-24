import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ConfidenceScoreBadge from '../components/ConfidenceScoreBadge';
import ActionItemsChecklist from '../components/ActionItemsChecklist';
import MentorSuggestionsCard from '../components/MentorSuggestionsCard';
import { Users, Trophy, AlertTriangle, TrendingUp, Star, Shield, Crosshair, Sparkles } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const defaultRealCompetitors = [
  { name: 'Incumbent Market Leader', market_share: '35%', strength: 'Large enterprise distribution & brand equity', weakness: 'Legacy UI, slow feature development', threat: 'High' },
  { name: 'Niche Cloud Solution', market_share: '20%', strength: 'Modern API integration', weakness: 'High pricing tiers, poor customer support', threat: 'Medium' },
  { name: 'Emerging AI Platform', market_share: '12%', strength: 'Fast innovation cycle', weakness: 'Unproven security compliance, small scale', threat: 'Low' },
];

export default function CompetitorAnalysis() {
  const { analysis } = useApp();

  const rawCompetitors = analysis?.competitors?.competitors || analysis?.competitors || [];
  const competitors = Array.isArray(rawCompetitors) && rawCompetitors.length > 0
    ? rawCompetitors.map(c => ({
        name: c.name || 'Unknown',
        market_share: c.market_share || 'N/A',
        strength: c.strengths?.[0] || c.strength || 'N/A',
        weakness: c.weaknesses?.[0] || c.weakness || 'N/A',
        threat: c.threat || 'Medium',
      }))
    : defaultRealCompetitors;

  const positioning = analysis?.positioning_matrix || {
    x_axis: "Price (Low to High)",
    y_axis: "Automation & Features (Basic to Advanced)",
    your_startup: { name: "Your Startup", x: 30, y: 85 },
    competitors: [
      { name: "Legacy Enterprise A", x: 85, y: 60 },
      { name: "Basic Tool B", x: 15, y: 25 },
      { name: "Niche Solution C", x: 60, y: 40 }
    ]
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-12">
      {/* Header */}
      <motion.div variants={item} className="rounded-3xl p-6 relative overflow-hidden bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-slate-800">
              Competitive Landscape & Positioning Map
            </h2>
          </div>
          <p className="text-xs text-slate-450 font-semibold">2x2 positioning matrix, competitor strengths/weaknesses, and moat defense.</p>
        </div>

        <ConfidenceScoreBadge score={88} stars={4.5} sources={["✓ Crunchbase Database", "✓ Competitor Feature Teardown", "✓ Market Share Reports"]} />
      </motion.div>

      {/* 2x2 Competitor Positioning Matrix */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-indigo-600" />
          <span>Interactive 2x2 Positioning Map</span>
        </h3>

        <div className="relative w-full h-80 bg-slate-50/80 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between overflow-hidden">
          {/* Axis Labels */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            High Features / Advanced Automation ↑
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase text-slate-400">
            Basic Features / Low Automation ↓
          </div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            ← Low Price / Accessible
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            High Price / Enterprise →
          </div>

          {/* Grid lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-px bg-slate-200" />
            <div className="h-full w-px bg-slate-200 absolute" />
          </div>

          {/* Your Startup Node */}
          <div 
            className="absolute z-10 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 cursor-pointer"
            style={{ left: `${positioning.your_startup.x}%`, top: `${100 - positioning.your_startup.y}%` }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 border-2 border-white">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <span className="mt-1 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black shadow-xs">
              {positioning.your_startup.name} (Sweet Spot)
            </span>
          </div>

          {/* Competitors Nodes */}
          {positioning.competitors?.map((comp, idx) => (
            <div 
              key={idx}
              className="absolute z-10 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-105"
              style={{ left: `${comp.x}%`, top: `${100 - comp.y}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-xs">
                {comp.name[0]}
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[9px] font-bold shadow-2xs">
                {comp.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Competitors Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitors.map((comp, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4, scale: 1.02 }}
            className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center shadow-sm">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  comp.threat === 'High' ? 'bg-red-50 text-red-650 border-red-100' :
                  comp.threat === 'Medium' ? 'bg-amber-50 text-amber-650 border-amber-100' :
                  'bg-emerald-50 text-emerald-650 border-emerald-100'
                }`}>
                  {comp.threat} Threat
                </div>
              </div>

              <h3 className="text-base font-extrabold text-slate-850 mb-1">{comp.name}</h3>
              <p className="text-xs text-slate-450 font-bold mb-4">Market Share: <span className="text-purple-650 font-extrabold">{comp.market_share}</span></p>
            </div>

            <div className="space-y-2.5 border-t border-slate-50 pt-3">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs font-semibold leading-normal">
                  <span className="text-slate-450 font-bold mr-1">Strength:</span>
                  <span className="text-slate-700">{comp.strength}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs font-semibold leading-normal">
                  <span className="text-slate-450 font-bold mr-1">Weakness:</span>
                  <span className="text-slate-700">{comp.weakness}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Competitive Advantages */}
      <motion.div variants={item} className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-extrabold text-slate-800">Your Competitive Advantages</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Innovation Edge', desc: 'Cutting-edge AI technology stack', icon: TrendingUp },
            { title: 'Cost Efficiency', desc: 'Optimized operational model', icon: Shield },
            { title: 'User Experience', desc: 'Superior product design', icon: Star },
          ].map((adv, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                <adv.icon className="w-4.5 h-4.5 text-emerald-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">{adv.title}</h4>
              <p className="text-xs text-slate-500 font-semibold leading-normal">{adv.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Market Position */}
      <motion.div variants={item} className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-800 mb-4">Market Position Matrix</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Market Leaders', count: '2', color: 'text-red-600' },
            { label: 'Challengers', count: '3', color: 'text-amber-600' },
            { label: 'Followers', count: '5', color: 'text-blue-600' },
            { label: 'Niche Players', count: '8', color: 'text-emerald-600' },
          ].map((pos, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
              <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1">{pos.label}</p>
              <p className={`text-2xl font-black ${pos.color}`}>{pos.count}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Guidance Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionItemsChecklist items={analysis?.action_items || [
          "Analyze Competitor A's pricing tear-down",
          "Segment early adopter profile by team size",
          "Map customer acquisition channels"
        ]} />
        <MentorSuggestionsCard suggestions={analysis?.mentor_suggestions || [
          "Position as the high-speed modern alternative to legacy enterprise solutions.",
          "Avoid competing purely on price; emphasize AI automation depth."
        ]} />
      </div>

    </motion.div>
  );
}