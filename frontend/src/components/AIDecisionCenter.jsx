import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Lightbulb, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AIDecisionCenter({ decisionData }) {
  const navigate = useNavigate();

  const data = decisionData || {
    high_priority: {
      title: "🔴 High Priority — Differentiation Risk",
      status: "RED",
      why: "Three major competitors already offer similar core features.",
      impact: "High",
      recommended_action: "Conduct 10 customer interviews focused on missing competitive features.",
      expected_outcome: "Validate whether your proposed differentiation actually matters."
    },
    needs_attention: {
      title: "🟡 Needs Attention — Willingness to Pay",
      status: "YELLOW",
      why: "Pricing model requires pilot customer willingness-to-pay verification.",
      impact: "Medium",
      recommended_action: "Run a waitlist pricing survey with 25 target leads.",
      expected_outcome: "Confirm target CAC to LTV ratio and subscription conversion."
    },
    positive_signal: {
      title: "🟢 Positive Signal — Market Demand",
      status: "GREEN",
      why: "TAM/SAM calculations suggest a solid addressable market ($50B).",
      impact: "Positive",
      recommended_action: "Proceed to MVP Phase 1 development.",
      expected_outcome: "Early mover advantage in target demographic."
    },
    ai_recommendation: "Interview 20 potential target customers before building the full MVP.",
    action_cta: "Start Customer Validation"
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm uppercase tracking-wider mb-1">
            <Lightbulb className="w-4 h-4 text-amber-400" /> AI Decision Center 2.0
          </div>
          <h3 className="text-2xl font-bold text-white">Today's Startup Decisions</h3>
        </div>
        <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-medium">
          Proactive Guidance Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* High Priority (Red) */}
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-5 flex flex-col justify-between hover:border-rose-500/50 transition-all space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" /> High Priority
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Impact: {data.high_priority.impact || "High"}
              </span>
            </div>
            <h4 className="text-white font-bold text-base mb-2">{data.high_priority.title}</h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p><strong className="text-slate-400">Why:</strong> {data.high_priority.why || data.high_priority.description}</p>
              {data.high_priority.recommended_action && (
                <p><strong className="text-rose-300">Action:</strong> {data.high_priority.recommended_action}</p>
              )}
              {data.high_priority.expected_outcome && (
                <p className="text-slate-400 italic"><strong>Outcome:</strong> {data.high_priority.expected_outcome}</p>
              )}
            </div>
          </div>
        </div>

        {/* Needs Attention (Yellow) */}
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-5 flex flex-col justify-between hover:border-amber-500/50 transition-all space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Needs Attention
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Impact: {data.needs_attention.impact || "Medium"}
              </span>
            </div>
            <h4 className="text-white font-bold text-base mb-2">{data.needs_attention.title}</h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p><strong className="text-slate-400">Why:</strong> {data.needs_attention.why || data.needs_attention.description}</p>
              {data.needs_attention.recommended_action && (
                <p><strong className="text-amber-300">Action:</strong> {data.needs_attention.recommended_action}</p>
              )}
              {data.needs_attention.expected_outcome && (
                <p className="text-slate-400 italic"><strong>Outcome:</strong> {data.needs_attention.expected_outcome}</p>
              )}
            </div>
          </div>
        </div>

        {/* Positive Signal (Green) */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5 flex flex-col justify-between hover:border-emerald-500/50 transition-all space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" /> Positive Signal
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Impact: {data.positive_signal.impact || "Positive"}
              </span>
            </div>
            <h4 className="text-white font-bold text-base mb-2">{data.positive_signal.title}</h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p><strong className="text-slate-400">Why:</strong> {data.positive_signal.why || data.positive_signal.description}</p>
              {data.positive_signal.recommended_action && (
                <p><strong className="text-emerald-300">Action:</strong> {data.positive_signal.recommended_action}</p>
              )}
              {data.positive_signal.expected_outcome && (
                <p className="text-slate-400 italic"><strong>Outcome:</strong> {data.positive_signal.expected_outcome}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-600/30 rounded-lg text-indigo-400 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">💡 AI Recommendation</div>
            <p className="text-slate-200 text-sm font-medium mt-0.5">{data.ai_recommendation}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/market')}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-all shadow-md shadow-indigo-600/20 whitespace-nowrap cursor-pointer"
        >
          [{data.action_cta} <ArrowRight className="w-3.5 h-3.5" />]
        </button>
      </div>
    </div>
  );
}
