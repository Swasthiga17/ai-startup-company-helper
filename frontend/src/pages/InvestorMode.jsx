import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ConfidenceScoreBadge from '../components/ConfidenceScoreBadge';
import ActionItemsChecklist from '../components/ActionItemsChecklist';
import MentorSuggestionsCard from '../components/MentorSuggestionsCard';
import ExportCenter from '../components/ExportCenter';
import { 
  Award, Presentation, FileText, DollarSign, Users, 
  PieChart, Copy, Check, Sparkles, TrendingUp 
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function InvestorMode() {
  const { analysis } = useApp();
  const [activeTab, setActiveTab] = useState('one_pager');
  const [copiedKey, setCopiedKey] = useState(null);

  const investor = analysis?.investor_suite || {
    elevator_pitch: "IdeaExecutor is the intelligent co-founder operating system that automates market research, financial forecasting, brand creation, and sales strategies for founders in minutes.",
    one_pager: "IdeaExecutor empowers early-stage founders by replacing $50k+ consulting bills with autonomous AI agents that generate investor-ready pitch decks, revenue forecasts, and GTM playbooks.",
    cap_table: [
      { shareholder: "Founding Team", equity: "80.0%", shares: "8,000,000" },
      { shareholder: "Option Pool (Unallocated)", equity: "10.0%", shares: "1,000,000" },
      { shareholder: "Angel / SAFEs", equity: "10.0%", shares: "1,000,000" }
    ],
    funding_ask: "$500,000 SAFE at $5M Post-Money Valuation Cap",
    use_of_funds: [
      { category: "Engineering & Product Development", percentage: "50%" },
      { category: "Growth & Customer Acquisition", percentage: "30%" },
      { category: "Legal & Operations", percentage: "20%" }
    ]
  };

  const pitchDeck = analysis?.pitch?.slides || [
    { title: "Problem", content: "Manual startup planning takes 6+ months and costs $50k+ in advisory fees." },
    { title: "Solution", content: "Autonomous AI co-founder engine generating complete operating plans in minutes." },
    { title: "Market", content: "TAM: $50B global startup advisory & software market." },
    { title: "Ask", content: "$500,000 SAFE for 18-month runway and $1M ARR." }
  ];

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-12">
      
      {/* Header */}
      <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Investor Mode & Funding Suite</h1>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">Unified investor assets: Elevator Pitch, One-Pager, Pitch Deck, Cap Table, and Funding Ask.</p>
        </div>

        <ConfidenceScoreBadge score={95} stars={4.9} sources={["✓ YC Pitch Deck Standards", "✓ Sequoia Investment Framework", "✓ AngelList SAFE Templates"]} />
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
        {[
          { id: 'one_pager', label: 'One-Pager & Pitch', icon: FileText },
          { id: 'deck', label: 'Pitch Deck Slides', icon: Presentation },
          { id: 'cap_table', label: 'Cap Table & Ask', icon: PieChart },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-white text-indigo-600 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'one_pager' && (
        <div className="space-y-6">
          <motion.div variants={item} className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-extrabold tracking-widest bg-white/20 px-3 py-1 rounded-full">
                30-Second Elevator Pitch
              </span>
              <button 
                onClick={() => copyToClipboard(investor.elevator_pitch, 'elevator')}
                className="text-xs font-bold text-white/80 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'elevator' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'elevator' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-base font-bold leading-relaxed">{investor.elevator_pitch}</p>
          </motion.div>

          <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Executive One-Pager Summary</span>
              </h2>
              <button 
                onClick={() => copyToClipboard(investor.one_pager, 'onepager')}
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
              >
                {copiedKey === 'onepager' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'onepager' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{investor.one_pager}</p>
          </motion.div>
        </div>
      )}

      {activeTab === 'deck' && (
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pitchDeck.map((slide, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-indigo-500">Slide 0{idx + 1}</span>
                <h3 className="text-sm font-black text-slate-800 mt-1">{slide.title}</h3>
                <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">{slide.content}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'cap_table' && (
        <div className="space-y-6">
          <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600" />
              <span>Cap Table Structure</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px]">
                    <th className="pb-2">Shareholder</th>
                    <th className="pb-2">Equity %</th>
                    <th className="pb-2">Shares</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {investor.cap_table?.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-bold">{row.shareholder}</td>
                      <td className="py-3 font-mono font-bold text-indigo-600">{row.equity}</td>
                      <td className="py-3 font-mono">{row.shares}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={item} className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-md">
              <span className="text-[10px] font-extrabold uppercase text-cyan-400">Funding Ask</span>
              <p className="text-lg font-black mt-2">{investor.funding_ask}</p>
            </motion.div>

            <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">Use of Funds Breakdown</h3>
              <div className="space-y-2">
                {investor.use_of_funds?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-xs font-bold text-slate-700">{item.category}</span>
                    <span className="text-xs font-mono font-black text-indigo-600">{item.percentage}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Guidance & Export */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MentorSuggestionsCard suggestions={[
          "Keep investor elevator pitch under 30 seconds.",
          "Show strong traction metrics before opening seed round."
        ]} />
        <ExportCenter />
      </div>

    </motion.div>
  );
}
