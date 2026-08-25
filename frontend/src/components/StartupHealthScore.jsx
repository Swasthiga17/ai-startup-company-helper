import React from 'react';
import { Activity, TrendingUp, AlertTriangle, ShieldCheck, Zap, Layers, ArrowUpRight, Award, ShieldAlert } from 'lucide-react';

export default function StartupHealthScore({ healthDetails, overallScore = 78 }) {
  const details = healthDetails || {
    overall_score: overallScore,
    score_delta: 17,
    score_history: [
      { date: "Aug 18", score: 61 },
      { date: "Aug 20", score: 67 },
      { date: "Aug 22", score: 72 },
      { date: "Aug 25", score: overallScore }
    ],
    dimensions: {
      market_demand: 84,
      competition: 71,
      business_model: 76,
      product_readiness: 68,
      revenue_potential: 82,
      execution: 73
    },
    biggest_improvement: { name: "Market Demand", delta: "+18" },
    biggest_risk: { name: "Product Readiness", score: 61 },
    diagnosis: "Your startup is promising with an overall health score of 78/100, but product differentiation is currently your primary focus area for improvement."
  };

  const dimensions = [
    { label: "Market Demand", score: details.dimensions.market_demand, icon: TrendingUp, color: "from-blue-500 to-indigo-500" },
    { label: "Competition", score: details.dimensions.competition, icon: ShieldCheck, color: "from-emerald-500 to-teal-500" },
    { label: "Business Model", score: details.dimensions.business_model, icon: Layers, color: "from-purple-500 to-violet-500" },
    { label: "Product Readiness", score: details.dimensions.product_readiness, icon: Zap, color: "from-amber-500 to-orange-500" },
    { label: "Revenue Potential", score: details.dimensions.revenue_potential, icon: Activity, color: "from-cyan-500 to-blue-500" },
    { label: "Execution", score: details.dimensions.execution, icon: AlertTriangle, color: "from-rose-500 to-pink-500" }
  ];

  const scoreHistory = details.score_history || [
    { date: "Aug 18", score: 61 },
    { date: "Aug 20", score: 67 },
    { date: "Aug 22", score: 72 },
    { date: "Aug 25", score: details.overall_score }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" /> Startup Health Score 2.0
          </div>
          <h3 className="text-2xl font-bold text-white">Overall Startup Viability</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">{details.diagnosis}</p>
        </div>

        {/* Score & Delta Badge */}
        <div className="flex items-center gap-4">
          {/* History Pill Timeline */}
          <div className="hidden sm:flex flex-col items-end gap-1.5 bg-slate-950/80 border border-slate-800 px-3.5 py-2.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Health Trend</span>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
              {scoreHistory.map((item, idx) => (
                <React.Fragment key={idx}>
                  <span className={idx === scoreHistory.length - 1 ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}>
                    {item.score}
                  </span>
                  {idx < scoreHistory.length - 1 && <span className="text-slate-600">→</span>}
                </React.Fragment>
              ))}
              <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-sans font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +17 pts
              </span>
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center bg-slate-950 border border-indigo-500/30 rounded-2xl p-4 min-w-[130px] text-center shadow-lg shadow-indigo-500/10">
            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              {details.overall_score}<span className="text-xl font-normal text-slate-500">/100</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-400 mt-1 uppercase tracking-wide flex items-center gap-1">
              Promising (+17 pts)
            </div>
          </div>
        </div>
      </div>

      {/* Highlights: Biggest Improvement vs Biggest Risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Biggest Improvement</div>
              <div className="text-white font-bold text-sm mt-0.5">
                {details.biggest_improvement?.name || "Market Demand"}: <span className="text-emerald-400 font-extrabold">{details.biggest_improvement?.delta || "+18"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Biggest Risk</div>
              <div className="text-white font-bold text-sm mt-0.5">
                {details.biggest_risk?.name || "Product Readiness"}: <span className="text-amber-400 font-extrabold">{details.biggest_risk?.score || 61}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Dimension Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dimensions.map((dim, idx) => (
          <div key={idx} className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <dim.icon className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-200">{dim.label}</span>
              </div>
              <span className="text-sm font-bold text-slate-300">{dim.score}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${dim.color} transition-all duration-1000`}
                style={{ width: `${dim.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
