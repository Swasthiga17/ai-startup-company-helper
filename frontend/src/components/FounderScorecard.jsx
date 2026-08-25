import React from 'react';
import { Award, Zap, CheckSquare, Rocket, Presentation } from 'lucide-react';

export default function FounderScorecard({ scorecardData }) {
  const data = scorecardData || {
    startup_health: 78,
    execution_score: 71,
    validation_score: 64,
    mvp_readiness: 68,
    investor_readiness: 52,
    summary: "Execution speed is solid; focus on converting customer interviews into validated pricing experiments."
  };

  const metrics = [
    { label: "Startup Health", score: data.startup_health, icon: Award, color: "from-indigo-500 to-purple-500" },
    { label: "Execution Score", score: data.execution_score, icon: CheckSquare, color: "from-blue-500 to-cyan-500" },
    { label: "Validation Score", score: data.validation_score, icon: Zap, color: "from-emerald-500 to-teal-500" },
    { label: "MVP Readiness", score: data.mvp_readiness, icon: Rocket, color: "from-amber-500 to-orange-500" },
    { label: "Investor Readiness", score: data.investor_readiness, icon: Presentation, color: "from-rose-500 to-pink-500" }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-0.5">
            Startup Execution Metrics
          </div>
          <h3 className="text-xl font-bold text-white">Founder Scorecard</h3>
        </div>
        <div className="text-xs text-slate-400 max-w-sm text-right hidden sm:block">
          {data.summary}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-center hover:border-slate-700 transition">
            <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-medium mb-2">
              <m.icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </div>
            <div className="text-3xl font-extrabold text-white mb-2">
              {m.score}<span className="text-sm font-normal text-slate-500">/100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${m.color}`} style={{ width: `${m.score}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
