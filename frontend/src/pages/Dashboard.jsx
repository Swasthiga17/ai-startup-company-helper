import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../hooks/useApp';
import { Link } from 'react-router-dom';
import ConfidenceScoreBadge from '../components/ConfidenceScoreBadge';
import ActionItemsChecklist from '../components/ActionItemsChecklist';
import MentorSuggestionsCard from '../components/MentorSuggestionsCard';
import ExportCenter from '../components/ExportCenter';
import StartupHealthScore from '../components/StartupHealthScore';
import AIDecisionCenter from '../components/AIDecisionCenter';
import AICofounderTeam from '../components/AICofounderTeam';
import MorningBrief from '../components/MorningBrief';
import FounderScorecard from '../components/FounderScorecard';
import TaskTracker from '../components/TaskTracker';

import {
  Rocket, Sparkles, Zap, Brain, TrendingUp, Users, Target, Briefcase,
  Map, LineChart, Presentation, Globe, Shield, Cpu, DollarSign, Scale,
  Download, FileDown, ChevronRight, CheckCircle, Clock, Lightbulb,
  Search, Activity, Award, BarChart3, ArrowUpRight, ArrowDownRight,
  Layers, BookOpen, MessageSquare, FileText, Plus, Settings,
  Menu, X, Star, PieChart, Radar as RadarIcon, AlertTriangle, CheckSquare, Square
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
} from 'recharts';

/* ─── Tabs ─── */
const tabs = ['Overview', 'Market Research', 'Competitors', 'SWOT', 'MVP Roadmap', 'Revenue Forecast', 'Pitch Deck'];

const agents = [
  { name: 'Market Agent', status: 'active', icon: Globe, color: 'from-violet-500 to-purple-500' },
  { name: 'Competitor Agent', status: 'active', icon: Users, color: 'from-orange-500 to-red-500' },
  { name: 'SWOT Agent', status: 'active', icon: Target, color: 'from-pink-500 to-rose-500' },
  { name: 'Business Model Agent', status: 'active', icon: Briefcase, color: 'from-indigo-500 to-blue-500' },
  { name: 'MVP Agent', status: 'active', icon: Rocket, color: 'from-amber-500 to-yellow-500' },
  { name: 'Revenue Agent', status: 'active', icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
  { name: 'Pitch Agent', status: 'active', icon: Presentation, color: 'from-fuchsia-500 to-pink-500' },
];

const SLIDE_EMOJIS = ['🎯', '💡', '📊', '🚀', '💰', '⚔️', '👥', '📈', '🤝', '📧'];

/* ─── Animated Number ─── */
function AnimatedNumber({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    if (isNaN(end)) return;
    const duration = 1000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{isNaN(parseFloat(value)) ? value : display.toFixed(1)}{suffix}</span>;
}

/* ─── KPI Card ─── */
function KpiCard({ kpi }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="glass-card p-5 relative overflow-hidden group bg-white border border-slate-100 shadow-sm">
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-sm`}>
            <kpi.icon className="w-5 h-5 text-white" />
          </div>
          <span className={`text-xs font-bold flex items-center gap-0.5 ${kpi.dir === 'up' ? 'text-emerald-650 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100' : 'text-red-650 bg-red-50 px-2 py-0.5 rounded-full border border-red-100'}`}>
            {kpi.dir === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {kpi.trend}
          </span>
        </div>
        <p className="text-2xl font-black text-slate-800 mb-1">
          {String(kpi.value).includes('$') || String(kpi.value).includes('%') || isNaN(parseFloat(kpi.value)) ? kpi.value : <AnimatedNumber value={kpi.value} />}
        </p>
        <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">{kpi.label}</p>
      </div>
    </motion.div>
  );
}

/* ─── Agent Status Bar ─── */
function AgentBar({ running }) {
  return (
    <div className="glass-card p-4 bg-slate-50/50 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Cpu className="w-4 h-4 text-violet-500 animate-pulse" />
        <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">AI Agents Status</span>
        {running && <div className="flex items-center gap-1.5 ml-auto"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /><span className="text-[10px] text-emerald-700 font-extrabold">All Systems Active</span></div>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {agents.map((a, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100 shadow-sm"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${a.status === 'active' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]' : 'bg-slate-350'}`} />
            <span className="text-[10px] text-slate-650 font-bold truncate">{a.name.replace(' Agent', '')}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Tab Button ─── */
function TabBtn({ tab, active, onClick }) {
  return (
    <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
      onClick={() => onClick(tab)}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border border-transparent cursor-pointer ${active ? 'tab-active shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'}`}
    >
      {tab}
    </motion.button>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab({ analysis }) {
  const score = analysis?.score?.overall_score ?? 7.5;
  const health = analysis?.health_score || {
    overall: 83,
    breakdown: { idea: 92, market: 80, competition: 76, business_model: 89, product: 85, marketing: 71, sales: 64, finance: 90 }
  };
  const metrics = analysis?.metrics || {
    mrr: "$12,500", arr: "$150,000", cac: "$185", ltv: "$2,400", burn_rate: "$8,200 / mo", runway: "18 Months", churn_rate: "2.1%", gross_margin: "84%"
  };

  const radarData = [
    { subject: 'Demand', A: Math.round((analysis?.score?.market_potential ?? 8.5) * 10), fullMark: 100 },
    { subject: 'Scalability', A: Math.round((analysis?.score?.innovation_level ?? 7.8) * 10), fullMark: 100 },
    { subject: 'Feasibility', A: Math.round((analysis?.score?.feasibility ?? 7.2) * 10), fullMark: 100 },
    { subject: 'Competition', A: Math.round(100 - (analysis?.score?.risk_factor ?? 3.5) * 10), fullMark: 100 },
    { subject: 'Revenue', A: Math.round((analysis?.score?.overall_score ?? 7.5) * 10), fullMark: 100 },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* AI Co-Founder Morning Brief */}
      <MorningBrief />

      {/* Founder Scorecard */}
      <FounderScorecard />

      {/* AI Decision Center 2.0 */}
      <AIDecisionCenter decisionData={analysis?.decision_center} />

      {/* Startup Health Score 2.0 */}
      <StartupHealthScore healthDetails={analysis?.health_details} overallScore={analysis?.health_score || 78} />

      {/* Virtual AI Co-Founder Team */}
      <AICofounderTeam />

      {/* Real Startup Metrics Bar */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Live Startup Financial & Growth Metrics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'MRR', val: metrics.mrr, col: 'text-indigo-600' },
            { label: 'ARR', val: metrics.arr, col: 'text-purple-600' },
            { label: 'CAC', val: metrics.cac, col: 'text-amber-600' },
            { label: 'LTV', val: metrics.ltv, col: 'text-emerald-600' },
            { label: 'Burn Rate', val: metrics.burn_rate, col: 'text-rose-600' },
            { label: 'Runway', val: metrics.runway, col: 'text-cyan-600' },
            { label: 'Churn', val: metrics.churn_rate, col: 'text-slate-700' },
            { label: 'Margin', val: metrics.gross_margin, col: 'text-blue-600' },
          ].map((m, i) => (
            <div key={i} className="p-3 rounded-2xl bg-slate-50/60 border border-slate-100 text-center">
              <span className="text-[9px] font-extrabold uppercase text-slate-400 block">{m.label}</span>
              <span className={`text-xs font-black font-mono mt-0.5 block ${m.col}`}>{m.val}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Health Score & Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Startup Score */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-violet-500 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Startup Health Score</h3>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                Overall: {health.overall}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {Object.entries(health.breakdown || {}).map(([key, val], idx) => (
                <div key={idx} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-center">
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 block truncate">{key.replace('_', ' ')}</span>
                  <span className="text-xs font-black text-slate-800">{val}%</span>
                </div>
              ))}
            </div>
          </div>
          {analysis?.score?.summary && (
            <p className="text-xs text-slate-500 font-semibold text-center max-w-xs mx-auto">{analysis.score.summary}</p>
          )}
        </motion.div>

        {/* Radar Analysis */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <RadarIcon className="w-5 h-5 text-pink-500 animate-pulse" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">RADAR ANALYSIS</h3>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(99,102,241,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
              <Radar name="Score" dataKey="A" stroke="#502AF6" fill="#502AF6" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Action Items & Mentor Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionItemsChecklist items={analysis?.action_items || [
          "Interview 10 target customers to validate pain severity",
          "Set up landing page waitlist and core messaging",
          "Validate tier 2 pricing with 5 beta users"
        ]} />
        <MentorSuggestionsCard suggestions={analysis?.mentor_suggestions || [
          "Don't build features until 5+ customers express willingness to pay.",
          "Introduce an annual discount (20% off) to increase upfront cash runway."
        ]} />
      </div>

      {/* Export Center */}
      <ExportCenter />

    </div>
  );
}

/* ─── Market Tab ─── */
function MarketTab({ analysis }) {
  const market = analysis?.market?.market_size || analysis?.market || { tam: '$50B', sam: '$15B', som: '$2B' };
  const growth = analysis?.market?.growth_potential || '12.5% CAGR expected';
  const risks = analysis?.market?.risks || [];
  const demographics = analysis?.market?.target_market?.demographics || [];

  return (
    <div className="space-y-4 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'TAM (Total Market)', value: market.tam || market.total || '$50B', desc: 'Global opportunity size' },
          { label: 'SAM (Serviceable Market)', value: market.sam || market.serviceable || '$15B', desc: 'Target segment volume' },
          { label: 'SOM (Obtainable Market)', value: market.som || market.obtainable || '$2B', desc: 'Year 1-3 capture potential' },
        ].map((m, i) => (
          <div key={i} className="glass-card p-5 bg-white border border-slate-100 shadow-sm">
            <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1">{m.label}</p>
            <p className="text-2xl font-black text-slate-800 mb-1">{m.value}</p>
            <p className="text-xs text-slate-400 font-semibold">{m.desc}</p>
          </div>
        ))}
      </div>
      {(growth || demographics.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {growth && (
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Growth Potential</p>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">{growth}</p>
            </div>
          )}
          {risks.length > 0 && (
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Market Risks</p>
              <div className="space-y-1.5">
                {risks.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-100 p-2 rounded-lg">
                    <AlertTriangle className="w-3 h-3 shrink-0" />{r}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Competitor Tab ─── */
function CompetitorTab({ analysis }) {
  const raw = analysis?.competitors?.competitors || analysis?.competitors || [];
  const competitors = Array.isArray(raw) ? raw : [];

  // Fallback if empty
  const displayList = competitors.length > 0 ? competitors : [
    { name: 'Competitor A', market_share: '25%', strengths: ['Brand recognition'], weaknesses: ['Legacy tech'], competitive_advantage: 'Low pricing', threat: 'High' },
    { name: 'Competitor B', market_share: '18%', strengths: ['Low pricing'], weaknesses: ['Poor UX'], competitive_advantage: 'Market presence', threat: 'Medium' },
    { name: 'Competitor C', market_share: '12%', strengths: ['Innovation'], weaknesses: ['Small scale'], competitive_advantage: 'Niche focus', threat: 'Low' },
  ];

  return (
    <div className="glass-card p-6 bg-white border border-slate-100 shadow-sm text-left">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-orange-500" />
        <h3 className="text-base font-extrabold text-slate-800">Competitive Table</h3>
        {competitors.length > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold uppercase ml-1">Live Data</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-4 py-3 font-bold text-slate-450 uppercase tracking-wider">Competitor</th>
              <th className="px-4 py-3 font-bold text-slate-450 uppercase tracking-wider">Market Share</th>
              <th className="px-4 py-3 font-bold text-slate-450 uppercase tracking-wider">Strengths</th>
              <th className="px-4 py-3 font-bold text-slate-450 uppercase tracking-wider">Weaknesses</th>
              <th className="px-4 py-3 font-bold text-slate-450 uppercase tracking-wider">Advantage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {displayList.map((c, i) => (
              <tr key={i} className="hover:bg-slate-50/50">
                <td className="px-4 py-3.5 font-bold text-slate-800">{c.name}</td>
                <td className="px-4 py-3.5 font-semibold text-slate-650">{c.market_share || c.funding || '—'}</td>
                <td className="px-4 py-3.5">
                  {Array.isArray(c.strengths)
                    ? c.strengths.map((s, j) => <span key={j} className="inline-block mr-1 mb-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold">{s}</span>)
                    : <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold">{c.strengths}</span>
                  }
                </td>
                <td className="px-4 py-3.5">
                  {Array.isArray(c.weaknesses)
                    ? c.weaknesses.map((w, j) => <span key={j} className="inline-block mr-1 mb-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100 text-[10px] font-bold">{w}</span>)
                    : <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100 text-[10px] font-bold">{c.weaknesses}</span>
                  }
                </td>
                <td className="px-4 py-3.5 font-semibold text-slate-600">{c.competitive_advantage || c.diff || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── SWOT Tab ─── */
function SwotTab({ analysis }) {
  const swot = analysis?.swot || {
    strengths: ['Strong AI tech stack', 'Experienced team', 'Scalable infrastructure', 'Low costs'],
    weaknesses: ['Limited brand recognition', 'Early stage', 'Small team', 'Narrow scope'],
    opportunities: ['Growing market demand', 'Partnership potential', 'New geographies', 'Adjacent verticals'],
    threats: ['Big competitors', 'Regulation changes', 'Tech shifts', 'Market saturation'],
  };

  return (
    <div className="space-y-2 text-left">
      {analysis?.swot && <div className="flex justify-end mb-1"><span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold uppercase">Live Analysis Data</span></div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'Strengths', items: swot.strengths, icon: Zap, topColor: '#10B981', itemClass: 'text-emerald-700 bg-emerald-50/20 border-emerald-100/60', dot: 'bg-emerald-500' },
          { key: 'Weaknesses', items: swot.weaknesses, icon: ArrowDownRight, topColor: '#EF4444', itemClass: 'text-red-700 bg-red-50/20 border-red-100/60', dot: 'bg-red-500' },
          { key: 'Opportunities', items: swot.opportunities, icon: TrendingUp, topColor: '#3B82F6', itemClass: 'text-blue-700 bg-blue-50/20 border-blue-100/60', dot: 'bg-blue-500' },
          { key: 'Threats', items: swot.threats, icon: Shield, topColor: '#F59E0B', itemClass: 'text-amber-700 bg-amber-50/20 border-amber-100/60', dot: 'bg-amber-500' },
        ].map((sect, i) => (
          <div key={i} className="glass-card p-5 bg-white border-t-4 border-slate-100 shadow-sm" style={{ borderTopColor: sect.topColor }}>
            <div className="flex items-center gap-2 mb-3">
              <sect.icon className="w-4 h-4" style={{ color: sect.topColor }} />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{sect.key}</h4>
            </div>
            <div className="space-y-2">
              {(sect.items || []).map((item, j) => (
                <div key={j} className={`flex items-center gap-2 text-xs font-semibold p-2.5 rounded-xl border ${sect.itemClass}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${sect.dot} shrink-0`} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Business Model Tab ─── */
function BusinessModelTab({ analysis }) {
  const bm = analysis?.business_model || {};
  const revenueStreams = bm.revenue_streams || ['Subscription 45%', 'Enterprise 30%', 'API 15%', 'Consulting 10%'];
  const costStructure = bm.cost_structure || ['Development 35%', 'Marketing 25%', 'Operations 25%', 'Support 15%'];
  const keyMetrics = bm.key_metrics || ['MRR', 'CAC', 'LTV', 'Churn Rate'];

  const segmentsRaw = analysis?.market?.target_market?.demographics || ['Enterprise', 'SMB', 'Consumer'];
  const segments = segmentsRaw.slice(0, 3);
  const segColors = ['bg-violet-500', 'bg-blue-500', 'bg-cyan-500'];
  const segPcts = [40, 35, 25];

  return (
    <div className="space-y-2 text-left">
      {analysis?.business_model && <div className="flex justify-end mb-1"><span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold uppercase">Live Analysis Data</span></div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Segments */}
        <div className="glass-card p-5 bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-violet-500" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Customer Segments</h4>
            </div>
            <div className="space-y-3 mt-3">
              {segments.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-semibold mb-1"><span className="text-slate-650 truncate">{s}</span><span className="text-slate-450">{segPcts[i] || 33}%</span></div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full ${segColors[i]} rounded-full`} style={{ width: `${segPcts[i] || 33}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Streams */}
        <div className="glass-card p-5 bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Revenue Streams</h4>
          </div>
          <div className="space-y-2 mt-2">
            {revenueStreams.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700">
                <span>{typeof r === 'string' ? r.split(' ')[0] : r}</span>
                {typeof r === 'string' && r.includes('%') && (
                  <span className="text-emerald-650 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 text-[10px] font-bold">{r.split(' ').slice(1).join(' ')}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="glass-card p-5 bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Key Metrics</h4>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {keyMetrics.map((m, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">{m}</span>
            ))}
          </div>
          {costStructure.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Cost Structure</p>
              <div className="space-y-1">
                {costStructure.slice(0, 4).map((c, i) => (
                  <div key={i} className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                    {c}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Roadmap Tab ─── */
function RoadmapTab({ analysis }) {
  const phases = analysis?.mvp?.phases || [
    { phase: 'Phase 1', title: 'Discovery', duration: '4 wks', tasks: ['Market Research', 'User Interviews', 'Architecture'] },
    { phase: 'Phase 2', title: 'MVP Build', duration: '12 wks', tasks: ['Core Features', 'UI/UX', 'Backend'] },
    { phase: 'Phase 3', title: 'Beta Launch', duration: '8 wks', tasks: ['User Testing', 'Bug Fixes', 'Optimization'] },
  ];
  const colors = ['from-violet-500 to-purple-500', 'from-blue-500 to-cyan-500', 'from-amber-500 to-yellow-500', 'from-emerald-500 to-teal-500'];

  return (
    <div className="space-y-2 text-left">
      {analysis?.mvp && <div className="flex justify-end mb-1"><span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold uppercase">Live Analysis Data</span></div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {phases.map((phase, i) => (
          <div key={i} className="glass-card p-5 bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center`}>
                    <Map className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{phase.phase}</p>
                    <h4 className="text-xs font-bold text-slate-800">{phase.title}</h4>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{phase.duration}</span>
              </div>
              <div className="space-y-2">
                {(phase.tasks || []).map((task, j) => (
                  <div key={j} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Revenue Tab ─── */
function RevenueTab({ analysis }) {
  const projections = analysis?.revenue?.projections || [
    { year: 'Year 1', revenue: 0.13 },
    { year: 'Year 2', revenue: 0.45 },
    { year: 'Year 3', revenue: 1.2 },
    { year: 'Year 4', revenue: 2.8 },
    { year: 'Year 5', revenue: 6.2 },
  ];

  const chartData = projections.map(p => ({
    name: p.year || p.name,
    revenue: typeof p.revenue === 'number' ? p.revenue : parseFloat(p.revenue) || 0,
    users: p.users || 0,
  }));

  const formatRevenue = (val) => {
    if (val >= 1) return `$${val.toFixed(1)}M`;
    return `$${(val * 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6 text-left">
      {analysis?.revenue && <div className="flex justify-end"><span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold uppercase">Live Analysis Data</span></div>}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {projections.map((yr, i) => (
          <div key={i} className="glass-card p-4 bg-white border border-slate-100 shadow-sm">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{yr.year || yr.name}</p>
            <p className="text-lg font-black text-slate-800">{formatRevenue(typeof yr.revenue === 'number' ? yr.revenue : parseFloat(yr.revenue) || 0)}</p>
            {yr.growth > 0 && <p className="text-[10px] text-emerald-600 font-bold mt-0.5">+{yr.growth}% YoY</p>}
          </div>
        ))}
      </div>
      {chartData.length > 0 && (
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Revenue Growth Trajectory</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#502AF6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#502AF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `$${v}M`} />
              <Tooltip formatter={(v) => [`$${v}M`, 'Revenue']} contentStyle={{ fontSize: 11, fontWeight: 600 }} />
              <Area type="monotone" dataKey="revenue" stroke="#502AF6" fill="url(#revGrad)" strokeWidth={2} dot={{ r: 4, fill: '#502AF6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ─── Pitch Deck Tab ─── */
function PitchDeckTab({ analysis, downloadPptx, downloadPdf }) {
  // Use backend slides if available, otherwise use defaults
  const backendSlides = analysis?.pitch?.slides || [];
  const defaultSlides = [
    { title: 'Problem', content: 'The problem your startup solves' },
    { title: 'Solution', content: 'Your unique value proposition' },
    { title: 'Market', content: 'TAM/SAM/SOM analysis' },
    { title: 'Product', content: 'Key features and demo' },
    { title: 'Business Model', content: 'Revenue streams and pricing' },
    { title: 'Competition', content: 'Competitive landscape' },
    { title: 'Team', content: 'Core team members' },
    { title: 'Financials', content: 'Revenue projections' },
    { title: 'Ask', content: 'Funding requirements' },
    { title: 'Contact', content: 'Get in touch' },
  ];
  const slidesList = backendSlides.length > 0 ? backendSlides : defaultSlides;

  const [previewSlide, setPreviewSlide] = useState(null);

  return (
    <div className="glass-card p-6 bg-white border border-slate-100 shadow-sm text-left">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 mb-1">Investor Slide Deck</h3>
          <p className="text-xs text-slate-400 font-semibold">Your complete pitch deck generated by AI</p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadPdf} className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 rounded-xl transition cursor-pointer">PDF</button>
          <button onClick={downloadPptx} className="px-4 py-2 bg-gradient-to-r from-[#502AF6] to-[#F1358F] text-white text-xs font-bold rounded-xl shadow transition cursor-pointer">PPTX</button>
        </div>
      </div>

      <AnimatePresence>
        {previewSlide !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 relative"
          >
            <button onClick={() => setPreviewSlide(null)} className="absolute top-3 right-3 p-1 hover:bg-slate-200 rounded-lg text-slate-500 transition">
              <X className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Slide {previewSlide + 1}</p>
            <h4 className="text-sm font-extrabold text-slate-800 mb-2">{slidesList[previewSlide]?.title}</h4>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">{slidesList[previewSlide]?.content}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
        {slidesList.map((slide, i) => (
          <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between aspect-video relative group cursor-pointer"
            onClick={() => setPreviewSlide(previewSlide === i ? null : i)}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{SLIDE_EMOJIS[i] || '📋'}</span>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Slide {i + 1}</p>
              <h4 className="text-xs font-bold text-slate-800">{slide.title}</h4>
            </div>
            <div className="absolute inset-0 bg-violet-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] font-black text-violet-600 bg-white px-2 py-1 rounded-lg shadow-sm">Click to preview</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN DASHBOARD EXPORT
   ════════════════════════════════════════ */
export default function Dashboard() {
  const { analysis, loading, error, analyze, downloadPdf, downloadPptx, loadStartups } = useApp();
  const [idea, setIdea] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  const [analyzing, setAnalyzing] = useState(false);
  const [showAgents, setShowAgents] = useState(false);

  useEffect(() => {
    if (!analysis && loadStartups) {
      loadStartups();
    }
  }, [analysis, loadStartups]);

  // Derive live KPIs from analysis data
  const liveKpis = [
    {
      label: 'Startup Score',
      value: analysis?.score?.overall_score ? String(analysis.score.overall_score) : '8.5',
      icon: Brain,
      color: 'from-violet-500 to-purple-500',
      trend: '+12%',
      dir: 'up'
    },
    {
      label: 'Market Opportunity',
      value: analysis?.market?.market_size?.tam || analysis?.market?.tam || '$50B',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
      trend: '+15%',
      dir: 'up'
    },
    {
      label: 'Revenue Potential (Y3)',
      value: (() => {
        const proj = analysis?.revenue?.projections;
        if (proj && proj.length >= 3) {
          const y3 = proj[2]?.revenue;
          if (y3 >= 1) return `$${y3.toFixed(1)}M`;
          if (y3) return `$${(y3 * 1000).toFixed(0)}K`;
        }
        return '$18.2M';
      })(),
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-500',
      trend: '+280%',
      dir: 'up'
    },
    {
      label: 'Funding Readiness',
      value: analysis?.score?.overall_score >= 8 ? 'High' : analysis?.score?.overall_score >= 6 ? 'Medium' : 'Early',
      icon: Award,
      color: 'from-amber-500 to-orange-500',
      trend: '+8%',
      dir: 'up'
    },
  ];

  const handleAnalyze = async () => {
    if (!idea.trim()) return;
    setAnalyzing(true);
    setShowAgents(true);
    try {
      await analyze(idea);
    } catch (e) {
      // handled by context
    }
    setAnalyzing(false);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'Overview': return <OverviewTab analysis={analysis} />;
      case 'Market Research': return <MarketTab analysis={analysis} />;
      case 'Competitors': return <CompetitorTab analysis={analysis} />;
      case 'SWOT': return <SwotTab analysis={analysis} />;
      case 'MVP Roadmap': return <RoadmapTab analysis={analysis} />;
      case 'Revenue Forecast': return <RevenueTab analysis={analysis} />;
      case 'Pitch Deck': return <PitchDeckTab analysis={analysis} downloadPptx={downloadPptx} downloadPdf={downloadPdf} />;
      default: return null;
    }
  };

  if (!analysis) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-left py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto space-y-8">

          {/* Welcome Logo */}
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity }} className="inline-block">
            <div className="relative">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#6366F1] via-[#8B5CF6] to-[#EC4899] flex items-center justify-center shadow-lg shadow-purple-500/20 ring-4 ring-purple-400/20">
                <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
              </div>
              <div className="absolute -top-1 right-2 w-3.5 h-3.5 bg-cyan-400 rounded-full animate-ping" />
            </div>
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">startupGenie</span>
            </h1>
            <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Your AI Startup Genie — Validate, Analyze, and Fund Your Startup Vision</p>
          </div>

          {/* Prompt Input Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl max-w-xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Lightbulb className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={idea}
                  onChange={e => setIdea(e.target.value)}
                  placeholder="Describe your startup idea..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white font-medium"
                  onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={!idea.trim() || analyzing}
                className="bg-gradient-to-r from-[#502AF6] to-[#F1358F] text-white px-6 py-3 rounded-xl text-xs font-bold disabled:opacity-40 flex items-center justify-center gap-1.5 shadow cursor-pointer"
              >
                {analyzing ? <Zap className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>{analyzing ? 'Analyzing...' : 'Analyze Startup'}</span>
              </motion.button>
            </div>
          </div>

          {/* Agent Activity Bar */}
          <AnimatePresence>
            {showAgents && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto">
                <AgentBar running={!analyzing} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sample tags */}
          <div className="flex flex-wrap justify-center gap-2">
            {['AI-Powered Finance Assistant', 'Eco-Logistics Platform', 'Remote Health Monitor'].map((s, i) => (
              <button key={i} onClick={() => setIdea(s)}
                className="text-[10px] font-bold px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-450 hover:text-slate-700 border border-slate-200 shadow-sm transition cursor-pointer"
              >{s}</button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Title widget card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 bg-white border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="relative flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Rocket className="w-5 h-5 text-violet-500 animate-pulse" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">startupGenie</h2>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 font-extrabold uppercase tracking-wider">AI GENIE</span>
            </div>
            <p className="text-xs text-slate-450 font-semibold">Analysis for: <span className="text-slate-800 font-bold">"{analysis.idea?.substring(0, 50)}"</span></p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadPdf}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-xs font-bold text-slate-650 hover:bg-slate-50 rounded-xl transition cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-500" />
              <span>PDF</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadPptx}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#502AF6] to-[#F1358F] text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>PPTX</span>
            </motion.button>
          </div>
        </div>

        {/* KPI Cards — Live Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {liveKpis.map((kpi, i) => <KpiCard key={i} kpi={kpi} />)}
        </div>

        {/* Agent Bar */}
        <AgentBar running />
      </motion.div>

      {/* Navigation tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-thin border-b border-slate-100/50">
        {tabs.map(t => <TabBtn key={t} tab={t} active={activeTab === t} onClick={setActiveTab} />)}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {renderTab()}
        </motion.div>
      </AnimatePresence>

      {/* Execution Task Board */}
      <div className="pt-4">
        <TaskTracker initialTasks={
          (analysis?.todo_list || analysis?.action_items || []).map((item, idx) => ({
            id: idx + 1,
            text: typeof item === 'string' ? item : item.task || 'Milestone Task',
            status: item.completed ? 'done' : idx === 0 ? 'in-progress' : 'todo',
            priority: idx % 2 === 0 ? 'High' : 'Medium'
          }))
        } />
      </div>

    </div>
  );
}