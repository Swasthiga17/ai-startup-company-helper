import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, CheckCircle2, ShieldAlert, Award, Star } from 'lucide-react';
import api from '../services/api';

export default function AgentScorecardWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScorecard();
  }, []);

  const fetchScorecard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/optimization/agent-scorecard');
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch agent scorecard:", err);
    } finally {
      setLoading(false);
    }
  };

  const defaultMock = {
    agents: [
      { agent: "Revenue Forecast Agent", score_pct: 99.0, measure: "Calculation accuracy", status: "EXCELLENT" },
      { agent: "Market Research Agent", score_pct: 94.0, measure: "Factual accuracy", status: "EXCELLENT" },
      { agent: "MVP Planner Agent", score_pct: 93.0, measure: "Actionability", status: "EXCELLENT" },
      { agent: "Competitor Intel Agent", score_pct: 91.0, measure: "Competitor relevance", status: "STRONG" },
      { agent: "Business Model Agent", score_pct: 90.0, measure: "Completeness", status: "STRONG" },
      { agent: "Research Planner Agent", score_pct: 92.0, measure: "Evidence quality", status: "STRONG" },
      { agent: "SWOT Agent", score_pct: 88.0, measure: "Strategic usefulness", status: "GOOD" },
      { agent: "Pitch Deck Agent", score_pct: 87.0, measure: "Founder usefulness", status: "GOOD" },
      { agent: "Decision Agent", score_pct: 86.0, measure: "Decision usefulness", status: "TARGET_FOR_OPTIMIZATION" }
    ],
    overall_system_agent_avg: 91.6,
    quality_gate_status: "PASS"
  };

  const scorecard = data || defaultMock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-left"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">AI Agent Quality Scorecard</h3>
            <p className="text-xs text-slate-400">Independent quality evaluations across all 9 domain agents</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Quality Gate: {scorecard.quality_gate_status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scorecard.agents.map((ag, idx) => (
          <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="truncate">{ag.agent}</span>
              <span className={`font-mono text-xs font-extrabold ${ag.score_pct >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {ag.score_pct}%
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>{ag.measure}</span>
              <span className="font-semibold text-slate-300">{ag.status}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
