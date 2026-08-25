import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, AlertTriangle, Lightbulb, ArrowRight, ExternalLink, FlaskConical } from 'lucide-react';
import EvidenceBadge from './EvidenceBadge';
import { useNavigate } from 'react-router-dom';

export default function AnalysisResultCard({
  title = "Market Opportunity Analysis",
  score = 82,
  confidence = 87,
  keyFinding = "Strong market demand exists ($50B TAM), but customer willingness-to-pay remains unvalidated.",
  evidenceList = [
    { claim: "TAM estimated at $50B", level: "CALCULATED", source: "Calculation Engine", confidence: 95 },
    { claim: "Key incumbents identified", level: "VERIFIED", source: "Public Registries", confidence: 92 },
    { claim: "Target pain severity", level: "ASSUMPTION", source: "Founder Thesis", confidence: 75 }
  ],
  risks = [
    "High competition from established incumbents",
    "Subscription pricing not yet validated with paying pilots"
  ],
  recommendation = {
    action: "Interview 20 target customers to validate ₹499/mo subscription model.",
    priority: "HIGH",
    cta: "Create Experiment"
  }
}) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 text-left"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Evidence Analysis
          </span>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Score</div>
            <div className="text-base font-black text-emerald-400">{score}/100</div>
          </div>
          <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Confidence</div>
            <div className="text-base font-black text-indigo-400">{confidence}%</div>
          </div>
        </div>
      </div>

      {/* Key Finding */}
      <div className="bg-slate-950/70 border border-indigo-500/20 rounded-2xl p-4 space-y-1">
        <div className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider">💡 Key Finding</div>
        <p className="text-sm font-semibold text-white leading-relaxed">{keyFinding}</p>
      </div>

      {/* Evidence Sources */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">🧾 Supporting Evidence</div>
        <div className="space-y-2">
          {evidenceList.map((ev, idx) => (
            <div key={idx} className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-200 font-medium truncate">{ev.claim}</span>
              <EvidenceBadge level={ev.level} source={ev.source} confidence={ev.confidence} />
            </div>
          ))}
        </div>
      </div>

      {/* Key Risks */}
      {risks.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Key Execution Risks
          </div>
          <ul className="space-y-1 text-xs text-slate-300">
            {risks.map((r, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Recommendation & Action CTA */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" /> Top Recommendation
          </div>
          <p className="text-xs text-slate-200 mt-1 font-medium">{recommendation.action}</p>
        </div>

        <button
          onClick={() => navigate('/experiments')}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer flex-shrink-0"
        >
          <FlaskConical className="w-4 h-4" />
          <span>{recommendation.cta}</span>
        </button>
      </div>
    </motion.div>
  );
}
