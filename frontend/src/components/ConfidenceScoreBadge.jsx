import React, { useState } from 'react';
import { Star, CheckCircle, ShieldCheck, ChevronDown, BookOpen, AlertTriangle } from 'lucide-react';

export default function ConfidenceScoreBadge({ 
  score = 90, 
  stars = 4.7, 
  status = "SUPPORTED",
  sources = ["Market reports", "Competitor data", "Industry benchmarks"],
  why = []
}) {
  const [showSources, setShowSources] = useState(false);

  const displaySources = Array.isArray(sources) && sources.length > 0 
    ? sources 
    : ["No external document evidence attached"];

  const calculatedStars = stars || (score ? (score / 20).toFixed(1) : 4.5);

  const getStatusColor = (st) => {
    switch (st) {
      case 'VERIFIED':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'SUPPORTED':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      case 'PARTIALLY_SUPPORTED':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'UNSUPPORTED':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div 
        onClick={() => setShowSources(!showSources)}
        className="cursor-pointer group flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all shadow-2xs"
      >
        {/* Star Rating */}
        <div className="flex items-center gap-0.5 text-amber-500">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-black text-slate-700 ml-1">{calculatedStars}</span>
        </div>

        <span className="w-1 h-1 rounded-full bg-slate-300" />

        {/* Confidence Percentage */}
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-xs font-black text-emerald-700">{score}% Confidence</span>
        </div>

        {/* Verification Status Tag */}
        {status && (
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${getStatusColor(status)} uppercase tracking-wider`}>
            {status}
          </span>
        )}

        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showSources ? 'rotate-180' : ''}`} />
      </div>

      {/* Sources Dropdown */}
      {showSources && (
        <div className="absolute right-0 mt-2 w-72 p-3 bg-white rounded-2xl border border-slate-100 shadow-xl z-30 text-left animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Verification Sources</span>
            </div>
            <span className="text-[10px] font-extrabold text-slate-400">{score}% Score</span>
          </div>

          <div className="space-y-1.5 mb-2">
            {displaySources.map((src, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-600">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="truncate">{typeof src === 'string' ? src : JSON.stringify(src)}</span>
              </div>
            ))}
          </div>

          {why && why.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <span className="text-[9px] uppercase font-black tracking-wider text-slate-400">Score Rationale</span>
              {why.map((w, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                  <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
