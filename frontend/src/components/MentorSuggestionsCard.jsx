import React from 'react';
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

export default function MentorSuggestionsCard({ suggestions = [] }) {
  const defaults = [
    "Position as the high-speed modern alternative to legacy tools.",
    "Don't build features until 5+ customers express willingness to pay.",
    "Introduce an annual discount (20% off) to boost upfront cash reserves."
  ];

  const list = suggestions.length > 0 ? suggestions : defaults;

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-indigo-500/10 rounded-3xl p-6 border border-amber-200/50 shadow-sm text-left">
      <div className="flex items-center gap-2 mb-3">
        <span className="p-2 bg-amber-100 text-amber-600 rounded-xl">
          <Lightbulb className="w-4 h-4" />
        </span>
        <div>
          <h3 className="text-xs uppercase font-extrabold tracking-wider text-amber-800">AI Co-founder Recommendations</h3>
          <p className="text-[10px] text-slate-500 font-semibold">Based on your specific startup model & market landscape</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {list.map((rec, idx) => (
          <div key={idx} className="p-3.5 rounded-2xl bg-white/90 border border-amber-100 shadow-2xs flex items-start gap-3">
            <ArrowRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-slate-700 leading-relaxed">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
