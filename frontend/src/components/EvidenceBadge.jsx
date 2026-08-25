import React, { useState } from 'react';
import { CheckCircle2, Calculator, HelpCircle, AlertOctagon, Info } from 'lucide-react';

export default function EvidenceBadge({ level = "VERIFIED", source = "Industry Benchmark Data", confidence = 88.5, snippet = null }) {
  const [showPopover, setShowPopover] = useState(false);

  const configs = {
    VERIFIED: {
      label: "Verified",
      color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30",
      icon: CheckCircle2,
      dot: "bg-emerald-400"
    },
    CALCULATED: {
      label: "Calculated",
      color: "bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30",
      icon: Calculator,
      dot: "bg-blue-400"
    },
    ASSUMPTION: {
      label: "Assumption",
      color: "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30",
      icon: HelpCircle,
      dot: "bg-amber-400"
    },
    UNVERIFIED: {
      label: "Unverified",
      color: "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30",
      icon: AlertOctagon,
      dot: "bg-rose-400"
    }
  };

  const cfg = configs[level.toUpperCase()] || configs.ASSUMPTION;
  const Icon = cfg.icon;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
        onClick={() => setShowPopover(!showPopover)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border transition cursor-pointer ${cfg.color}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
        <Icon className="w-3 h-3" />
        <span>{cfg.label}</span>
      </button>

      {showPopover && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-64 p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-xs space-y-1.5 pointer-events-none">
          <div className="flex items-center justify-between font-bold text-white">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-indigo-400" /> Evidence Basis
            </span>
            <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/30 font-mono">
              {confidence}% Confidence
            </span>
          </div>
          <div className="text-slate-300 text-[11px]">
            <strong className="text-slate-400">Source:</strong> {source}
          </div>
          {snippet && (
            <p className="text-slate-400 text-[10px] italic border-t border-slate-800 pt-1.5">
              "{snippet}"
            </p>
          )}
        </div>
      )}
    </div>
  );
}
