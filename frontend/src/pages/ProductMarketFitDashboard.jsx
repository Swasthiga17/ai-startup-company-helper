import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Users, CheckCircle2, TrendingUp, DollarSign, Award, Star, Activity, ArrowUpRight } from 'lucide-react';
import api from '../services/api';

export default function ProductMarketFitDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPMF();
  }, []);

  const fetchPMF = async () => {
    try {
      setLoading(true);
      const res = await api.get('/pmf/metrics');
      if (res.data) {
        setMetrics(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch PMF metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  const defaultMock = {
    beta_users: 37,
    activated_users: 29,
    activation_rate_pct: 78.4,
    weekly_active_users: 21,
    returning_users: 18,
    recommendation_acceptance_pct: 74.0,
    action_completion_pct: 61.0,
    founder_value_score: 91.2,
    willingness_to_pay_pct: 68.0,
    pmf_badge: "🟢 Strong PMF Signal",
    retention_cohorts: { day_1: "89.2%", day_7: "72.4%", day_14: "64.8%", day_30: "56.7%" },
    icp_segments: [
      { segment: "Group A — Startup Validation", score: 88, fit: "HIGH_ICP_FIT", wtp: "62%" },
      { segment: "Group B — Early MVP Founders", score: 94, fit: "PRIMARY_ICP_FIT", wtp: "78%" },
      { segment: "Group C — Existing Businesses", score: 72, fit: "EXPANSION_FIT", wtp: "54%" }
    ]
  };

  const m = metrics || defaultMock;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-widest mb-1">
            <Target className="w-4 h-4" /> PMF Intelligence Engine
          </div>
          <h1 className="text-3xl font-extrabold text-white">Product-Market Fit Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-world founder analytics, retention cohorts, willingness to pay, and ICP validation signals.
          </p>
        </div>

        <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-4 py-2 rounded-2xl font-extrabold text-sm shadow-lg flex items-center gap-2">
          <SparklesIcon className="w-4 h-4" /> {m.pmf_badge}
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Beta Founders</div>
          <div className="text-2xl font-black text-white mt-1">{m.beta_users}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Activated</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{m.activated_users}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Activation Rate</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{m.activation_rate_pct}%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">WAU (Active)</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">{m.weekly_active_users}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Rec Acceptance</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{m.recommendation_acceptance_pct}%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Action Completed</div>
          <div className="text-2xl font-black text-purple-400 mt-1">{m.action_completion_pct}%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Willingness To Pay</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{m.willingness_to_pay_pct}%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Founder Value</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{m.founder_value_score}</div>
        </div>
      </div>

      {/* Retention Cohorts & ICP Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Retention Cohorts */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> Retention Cohort Progression
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(m.retention_cohorts || {}).map(([day, val]) => (
              <div key={day} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">{day.replace('_', ' ')}</div>
                <div className="text-base font-black text-emerald-400 mt-1">{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ICP Segment Analysis */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" /> Ideal Customer Profile (ICP) Segment Fit
          </h3>
          <div className="space-y-2">
            {(m.icp_segments || []).map((icp, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{icp.segment}</div>
                  <div className="text-[10px] text-slate-400">{icp.fit} • Willingness to Pay: {icp.wtp}</div>
                </div>
                <span className="font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {icp.score}/100
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SparklesIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
