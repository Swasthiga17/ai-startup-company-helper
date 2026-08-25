import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, Sparkles, CheckCircle2, Play, Calendar, Cpu } from 'lucide-react';
import api from '../services/api';

export default function FounderOSBriefWidget() {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrief();
  }, []);

  const fetchBrief = async () => {
    try {
      setLoading(true);
      const res = await api.get('/founder-os/weekly-brief');
      if (res.data) {
        setBrief(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch Weekly Founder Brief:", err);
    } finally {
      setLoading(false);
    }
  };

  const defaultMock = {
    period: "Week 34, 2026",
    signals: {
      critical: [{ category: "🔴 Critical", title: "Competitor Launch Alert", detail: "Competitor X launched a feature similar to your planned MVP." }],
      important: [{ category: "🟠 Important", title: "Pricing Conversion Risk", detail: "Your current pricing may reduce conversion at target segment." }],
      opportunity: [{ category: "🟢 Opportunity", title: "Strong Validation Signals", detail: "Three customer segments show stronger validation signals." }]
    },
    recommended_actions: [
      { title: "Interview 5 target customers", risk_level: "🟢 LOW_RISK", requires_approval: false, action_cta: "Execute Task" },
      { title: "Run pricing experiment", risk_level: "🟡 MEDIUM_RISK", requires_approval: true, action_cta: "Approve Pricing Experiment" },
      { title: "Adjust MVP Feature Priorities", risk_level: "🟡 MEDIUM_RISK", requires_approval: true, action_cta: "Approve Roadmap Update" }
    ],
    weekly_calendar: [
      { day: "Mon", focus: "Customer Interviews" },
      { day: "Tue", focus: "Competitor Analysis" },
      { day: "Wed", focus: "MVP Iteration" },
      { day: "Thu", focus: "Pricing Experiment" },
      { day: "Fri", focus: "KPI Review" }
    ]
  };

  const b = brief || defaultMock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 text-left"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">AI Chief of Staff — Weekly Founder Brief</h3>
            <p className="text-xs text-slate-400">Autonomous Startup OS Executive Intelligence ({b.period})</p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Autonomous Loop Active
        </span>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {(b.signals?.critical || []).map((s, i) => (
          <div key={i} className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-3 space-y-1">
            <div className="font-extrabold text-rose-300">{s.category}: {s.title}</div>
            <div className="text-[11px] text-slate-300">{s.detail}</div>
          </div>
        ))}
        {(b.signals?.important || []).map((s, i) => (
          <div key={i} className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-3 space-y-1">
            <div className="font-extrabold text-amber-300">{s.category}: {s.title}</div>
            <div className="text-[11px] text-slate-300">{s.detail}</div>
          </div>
        ))}
        {(b.signals?.opportunity || []).map((s, i) => (
          <div key={i} className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3 space-y-1">
            <div className="font-extrabold text-emerald-300">{s.category}: {s.title}</div>
            <div className="text-[11px] text-slate-300">{s.detail}</div>
          </div>
        ))}
      </div>

      {/* Recommended Actions */}
      <div className="space-y-2">
        <div className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">🎯 Prioritized Actions & Safety Controls</div>
        <div className="space-y-2">
          {(b.recommended_actions || []).map((act, idx) => (
            <div key={idx} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  act.risk_level.includes('LOW')
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {act.risk_level.replace('_RISK', '')}
                </span>
                <span className="font-bold text-white">{act.title}</span>
              </div>

              <button className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition">
                <Play className="w-3 h-3 fill-current" /> {act.action_cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
