import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, Globe, DollarSign, Users, BarChart3, ArrowUpRight, 
  Sparkles, CheckCircle2, AlertTriangle, Play, HelpCircle, MapPin
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function MarketAnalysis() {
  const { analysis } = useApp();

  const rawMarket = analysis?.market || analysis?.market_analysis;
  
  // Dynamic parsing based on user's startup idea inputs
  const marketData = rawMarket
    ? {
        tam: rawMarket.market_size?.tam || rawMarket.tam || '$42B',
        sam: rawMarket.market_size?.sam || rawMarket.sam || '$12B',
        som: rawMarket.market_size?.som || rawMarket.som || '$1.5B',
        growth_rate: rawMarket.growth_potential || rawMarket.growth_rate || '18.6% CAGR',
        demographics: rawMarket.target_market?.demographics || rawMarket.demographics || ['Startups (42%)', 'SMEs (28%)', 'Enterprises (18%)', 'Individuals (12%)'],
        psychographics: rawMarket.target_market?.psychographics || rawMarket.psychographics || ['Automation', 'Cloud Computing', 'AI Adoption', 'Remote Work'],
        risks: rawMarket.risks || ['Medium Competition', 'Technology Changes', 'Regulatory Changes', 'Economic Slowdown', 'Customer Acquisition Cost'],
        overall_score: analysis?.score?.overall_score ? Math.round(analysis.score.overall_score * 10) : 91,
        score_label: analysis?.score?.overall_score > 8 ? 'Excellent Market Opportunity' : 'Strong Market Opportunity',
        action: 'Launch MVP within the next 3 months.'
      }
    : {
        tam: '$42B',
        sam: '$12B',
        som: '$1.5B',
        growth_rate: '18.6% CAGR',
        demographics: ['Startups (42%)', 'SMEs (28%)', 'Enterprises (18%)', 'Individuals (12%)'],
        psychographics: ['Automation', 'Cloud Computing', 'AI Adoption', 'Remote Work'],
        risks: ['Medium Competition', 'Technology Changes', 'Regulatory Changes', 'Economic Slowdown', 'Customer Acquisition Cost'],
        overall_score: 91,
        score_label: 'Excellent Market Opportunity',
        action: 'Launch MVP within the next 3 months.'
      };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-10">
      
      {/* 1. Header & Quick Actions */}
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Market Analysis</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Al-powered insights into your startup's market opportunity</p>
        </div>
        <div className="flex gap-2.5">
          <button className="px-4 py-2 bg-purple-50 text-[#6D28FF] hover:bg-[#6D28FF]/10 text-xs font-bold rounded-2xl border border-purple-100 transition">
            Export PDF
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-[#6D28FF] to-[#EC4899] text-white text-xs font-black rounded-2xl transition">
            Pitch Deck
          </button>
        </div>
      </motion.div>

      {/* 2. Top Banner: Market Opportunity Score */}
      <motion.div 
        variants={item} 
        className="relative overflow-hidden rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#EC4899] shadow-xl shadow-purple-500/10"
      >
        <div className="flex items-center gap-6 flex-wrap md:flex-nowrap justify-center md:justify-start">
          {/* Radial score gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center bg-white/10 rounded-full border-4 border-white/20">
            <div className="text-center">
              <span className="text-3xl font-black">{marketData.overall_score}</span>
              <span className="text-xs font-bold block opacity-75">/100</span>
            </div>
          </div>
          
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-extrabold tracking-widest bg-white/15 px-3 py-1 rounded-full border border-white/20">
              Market Opportunity Score
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-1">{marketData.score_label}</h2>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-1">
              <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                ✓ High demand
              </span>
              <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                ✓ Fast-growing industry
              </span>
              <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                ✓ Strong investor interest
              </span>
            </div>
          </div>
        </div>

        {/* Recommended action card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 max-w-xs text-center md:text-left">
          <span className="text-[9px] font-extrabold uppercase tracking-wider opacity-90 block">Recommended Action</span>
          <p className="text-xs font-semibold mt-1 leading-relaxed">{marketData.action}</p>
        </div>
      </motion.div>

      {/* 3. Metrics Cards Row */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Market Value', value: marketData.tam, change: 'Growing rapidly', trend: 'TAM', icon: Globe, bg: 'bg-violet-50 text-violet-600 border-violet-100' },
          { label: 'Industry Growth', value: marketData.growth_rate, change: 'Excellent', trend: 'CAGR', icon: TrendingUp, bg: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
          { label: 'Customer Demand', value: 'Very High', change: 'Trending ↑', trend: 'Demand', icon: Users, bg: 'bg-pink-50 text-pink-600 border-pink-100' },
          { label: 'Competition Level', value: 'Medium', change: 'Opportunity exists', trend: 'Rivals', icon: BarChart3, bg: 'bg-amber-50 text-amber-600 border-amber-100' },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm text-left">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 border ${card.bg}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{card.label}</span>
            <h3 className="text-2xl font-black text-slate-800 mt-1 leading-none">{card.value}</h3>
            <span className="text-[11px] text-slate-500 font-semibold block mt-2">{card.change}</span>
          </div>
        ))}
      </motion.div>

      {/* 4. Demand Trend & Customer Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Demand Chart Box */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-slate-50">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Market Demand & Trend</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400">2020 - 2026</span>
          </div>
          
          <div className="py-6 flex items-end justify-between h-40">
            {/* Simulated bar chart representation of growth */}
            {[35, 45, 52, 68, 75, 92].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-8 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-500" style={{ height: `${h}px` }} />
                <span className="text-[9px] text-slate-400 font-bold">{2020 + i}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-50 text-xs">
            <span className="font-bold text-slate-500">Current Market Adoption</span>
            <span className="font-extrabold text-emerald-600">High Growth Phase</span>
          </div>
        </motion.div>

        {/* Customer Segments Box */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-slate-50">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-pink-600" />
              <span>Customer Segments Breakdown</span>
            </h3>
          </div>

          <div className="space-y-3 py-4">
            {marketData.demographics.map((seg, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-700 font-bold">{seg}</span>
                <span className="text-xs text-purple-600 font-black bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                  Segment {i + 1}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 5. Drivers & Pain Points */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Drivers */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-800 pb-4 border-b border-slate-50 mb-4">Key Market Drivers</h3>
          <div className="grid grid-cols-2 gap-3">
            {marketData.psychographics.map((drv, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Driver 0{i + 1}</span>
                <span className="text-xs font-bold text-slate-800">{drv}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risks */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-800 pb-4 border-b border-slate-50 mb-4">Market Risks & Obstacles</h3>
          <div className="space-y-3">
            {marketData.risks.map((risk, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-rose-50/50 border border-rose-100 rounded-2xl">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold text-slate-700">{risk}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 6. PESTLE Analysis */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-50 mb-4">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>PESTLE Macro-Environment Analysis</span>
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100">
            6 Macro Factors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { tag: 'Political', title: 'P — Political Factors', color: 'border-l-indigo-500', desc: analysis?.pestle?.political || 'Favorable tech tax incentives & startup grants available in target jurisdictions.' },
            { tag: 'Economic', title: 'E — Economic Conditions', color: 'border-l-emerald-500', desc: analysis?.pestle?.economic || 'High demand for cost-reduction & operational efficiency tools amidst economic tightening.' },
            { tag: 'Social', title: 'S — Social Trends', color: 'border-l-pink-500', desc: analysis?.pestle?.social || 'Growing adoption of remote collaboration & automated workflow co-founders.' },
            { tag: 'Technological', title: 'T — Tech Shift', color: 'border-l-purple-500', desc: analysis?.pestle?.technological || 'Rapid advancements in LLM reasoning, retrieval augmented generation, and serverless compute.' },
            { tag: 'Legal', title: 'L — Legal & Compliance', color: 'border-l-amber-500', desc: analysis?.pestle?.legal || 'Strict adherence required for GDPR/CCPA data privacy and AI governance regulations.' },
            { tag: 'Environmental', title: 'E — Environmental Impact', color: 'border-l-teal-500', desc: analysis?.pestle?.environmental || 'Low carbon footprint via cloud serverless hosting and paperless operation.' },
          ].map((item, idx) => (
            <div key={idx} className={`p-4 bg-slate-50 border-l-4 ${item.color} rounded-2xl border border-slate-100 space-y-1.5`}>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{item.title}</span>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
      
    </motion.div>
  );
}