import React from 'react';
import { Sun, AlertCircle, AlertTriangle, CheckCircle2, Lightbulb, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MorningBrief({ briefData }) {
  const navigate = useNavigate();

  const brief = briefData || {
    greeting: "Good morning, Founder. Here's what matters for your startup today.",
    priority: {
      tag: "RED",
      label: "🔴 High Priority",
      title: "MVP Validation & Customer Interviews",
      description: "Focus area: 'Interview 10 target customers' required to confirm product-market fit."
    },
    risk: {
      tag: "YELLOW",
      label: "🟡 Risk Factor",
      title: "Competitor Activity Increasing",
      description: "Two competing products launched similar feature capabilities this week."
    },
    opportunity: {
      tag: "GREEN",
      label: "🟢 Growth Opportunity",
      title: "Target Segment Expansion",
      description: "Search interest in AI career guidance increased by 18% month-over-month."
    },
    recommendation: "Interview 5 potential target customers before expanding MVP features.",
    action_cta: "Start Interview Plan"
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between pb-2.5 border-b border-indigo-500/20 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
            <Sun className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest leading-tight">AI Co-Founder Morning Brief</div>
            <h3 className="text-base font-bold text-white leading-tight mt-0.5">{brief.greeting}</h3>
          </div>
        </div>
        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2.5 py-0.5 rounded-full font-medium">
          Daily Intelligence
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        {/* Priority */}
        <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-3">
          <div className="text-rose-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
            {brief.priority.label}
          </div>
          <div className="text-white font-bold text-xs mb-0.5">{brief.priority.title}</div>
          <p className="text-slate-300 text-[11px] leading-relaxed">{brief.priority.description}</p>
        </div>

        {/* Risk */}
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3">
          <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            {brief.risk.label}
          </div>
          <div className="text-white font-bold text-sm mb-1">{brief.risk.title}</div>
          <p className="text-slate-300 text-xs leading-relaxed">{brief.risk.description}</p>
        </div>

        {/* Opportunity */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            {brief.opportunity.label}
          </div>
          <div className="text-white font-bold text-sm mb-1">{brief.opportunity.title}</div>
          <p className="text-slate-300 text-xs leading-relaxed">{brief.opportunity.description}</p>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="bg-slate-950/60 border border-indigo-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
          <Lightbulb className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span><strong>Today's Focus:</strong> {brief.recommendation}</span>
        </div>
        <button
          onClick={() => navigate('/experiments')}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-md cursor-pointer whitespace-nowrap"
        >
          [{brief.action_cta} <ArrowRight className="w-3.5 h-3.5" />]
        </button>
      </div>
    </div>
  );
}
