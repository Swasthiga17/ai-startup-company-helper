import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, TrendingUp, Percent, ShieldCheck, Cpu, CreditCard, Activity } from 'lucide-react';
import api from '../services/api';

export default function BusinessIntelligenceDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBIData();
  }, []);

  const fetchBIData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/billing/dashboard');
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch BI Dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const defaultMock = {
    saas_metrics: {
      total_users: 1250,
      active_users: 680,
      paid_users: 120,
      conversion_rate_pct: 9.6,
      mrr: "₹1,49,860.00",
      arr: "₹17,98,320.00",
      churn_rate_pct: 1.8,
      ai_cost_per_user: "₹14.20",
      gross_margin: "91.5%",
      founder_value_score: 91.2
    },
    unit_economics: {
      arpu: "₹999.00",
      avg_tokens_per_user: 120000,
      ai_cost_per_user: "₹8.50",
      gross_margin_pct: "91.5%",
      is_profitable: true
    }
  };

  const bi = data || defaultMock;
  const s = bi.saas_metrics;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-widest mb-1">
            <DollarSign className="w-4 h-4" /> Commercial Intelligence Engine
          </div>
          <h1 className="text-3xl font-extrabold text-white">Business Intelligence Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            SaaS MRR revenue metrics, free-to-paid conversion rates, unit economics, and AI cost margins.
          </p>
        </div>

        <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-4 py-2 rounded-2xl font-extrabold text-sm shadow-lg flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Profitable SaaS Margin ({s.gross_margin})
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Users</div>
          <div className="text-2xl font-black text-white mt-1">{s.total_users}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Active Users</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">{s.active_users}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Paid Users</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{s.paid_users}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Conversion</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{s.conversion_rate_pct}%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">MRR</div>
          <div className="text-xl font-black text-emerald-400 mt-1">{s.mrr}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Churn Rate</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{s.churn_rate_pct}%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">AI Cost/User</div>
          <div className="text-xl font-black text-slate-300 mt-1">{s.ai_cost_per_user}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Gross Margin</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{s.gross_margin}</div>
        </div>
      </div>

      {/* Unit Economics & Commercial Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Unit Economics */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" /> AI Unit Economics & Margins
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Pro Tier ARPU</span>
              <span className="font-bold text-white">{bi.unit_economics.arpu}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Avg Tokens / Active User</span>
              <span className="font-bold text-white">{bi.unit_economics.avg_tokens_per_user.toLocaleString()} tokens</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">AI Inference Cost / User</span>
              <span className="font-bold text-emerald-400">{bi.unit_economics.ai_cost_per_user}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-300 font-bold">Gross Margin %</span>
              <span className="font-extrabold text-emerald-400">{bi.unit_economics.gross_margin_pct}</span>
            </div>
          </div>
        </div>

        {/* Commercial Subscription Tiers */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-400" /> Active Commercial Tiers
          </h3>
          <div className="space-y-2">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <div className="font-bold text-white">Free Tier</div>
                <div className="text-[10px] text-slate-400">3 analyses/mo • 1 startup workspace</div>
              </div>
              <span className="font-bold text-slate-300">₹0 / mo</span>
            </div>
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 p-3 rounded-2xl border border-indigo-500/40 flex justify-between items-center text-xs">
              <div>
                <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                  Pro Tier <span className="bg-indigo-500 text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase">Popular</span>
                </div>
                <div className="text-[10px] text-slate-300">50 analyses/mo • 5 startups • Evidence & Decision Center</div>
              </div>
              <span className="font-extrabold text-emerald-400">₹999 / mo</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <div className="font-bold text-white">Founder Premium Tier</div>
                <div className="text-[10px] text-slate-400">500 analyses/mo • Continuous Monitoring • Live Market Watch</div>
              </div>
              <span className="font-bold text-emerald-400">₹2,499 / mo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
