import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Gauge, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function safeNum(val, fallback) {
  const num = Number(val);
  return isNaN(num) ? fallback : num;
}

function GaugeMeter({ value = 7.5, max = 10 }) {
  const numericVal = safeNum(value, 7.5);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (numericVal / max) * circumference;
  const percentage = (numericVal / max) * 100;

  return (
    <div className="relative w-64 h-64 mx-auto shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(99, 102, 241, 0.05)" strokeWidth="12" />
        <circle cx="100" cy="100" r={radius} fill="none" stroke="url(#gaugeGradient)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} className="gauge-ring" />
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#502AF6" /><stop offset="100%" stopColor="#F1358F" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-slate-800">{numericVal.toFixed(1)}</span>
        <span className="text-xs text-slate-400 font-bold">out of {max}</span>
        <span className="text-xs text-violet-650 mt-1 font-bold">{percentage.toFixed(0)}% Score</span>
      </div>
    </div>
  );
}

export default function Impact() {
  const { analysis } = useApp();
  
  const scoreObj = typeof analysis?.score === 'object' && analysis?.score !== null ? analysis.score : null;
  const score = scoreObj 
    ? (scoreObj.overall_score || 7.5) 
    : (typeof analysis?.score === 'number' ? analysis.score : 7.5);

  if (!analysis) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-left">
        <div className="rounded-3xl p-8 text-center bg-white border border-slate-100 shadow-xl max-w-sm w-full"
        >
          <Gauge className="w-11 h-11 text-purple-500 mx-auto mb-4" />
          <h3 className="text-sm font-extrabold text-slate-800 mb-2">Score & Impact Analysis</h3>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">Submit your startup idea to see the impact analysis.</p>
        </div>
      </div>
    );
  }

  const factors = [
    { label: 'Market Potential', value: safeNum(scoreObj?.market_potential || 8.5, 8.5), icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Innovation Level', value: safeNum(scoreObj?.innovation_level || 7.8, 7.8), icon: Gauge, color: 'text-purple-650' },
    { label: 'Feasibility', value: safeNum(scoreObj?.feasibility || 7.2, 7.2), icon: CheckCircle, color: 'text-indigo-650' },
    { label: 'Risk Factor', value: safeNum(scoreObj?.risk_factor || 3.5, 3.5), icon: AlertTriangle, color: 'text-amber-600', invert: true },
  ];

  const strengthsList = (analysis?.swot?.strengths && Array.isArray(analysis.swot.strengths) && analysis.swot.strengths.length > 0)
    ? analysis.swot.strengths
    : ['Strong market demand identified', 'Low initial capital requirement', 'Scalable technology stack', 'Clear revenue model'];
    
  const risksList = (analysis?.swot?.threats && Array.isArray(analysis.swot.threats) && analysis.swot.threats.length > 0)
    ? analysis.swot.threats
    : (analysis?.swot?.weaknesses && Array.isArray(analysis.swot.weaknesses) && analysis.swot.weaknesses.length > 0)
      ? analysis.swot.weaknesses
      : ['Market saturation in target segment', 'Regulatory compliance requirements', 'Talent acquisition challenges', 'Customer acquisition cost'];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl mx-auto text-left">
      
      {/* Title Card & Gauge */}
      <motion.div variants={item} className="rounded-3xl p-8 bg-white border border-slate-100 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-bold text-slate-800">Startup Score</h2>
            </div>
            <p className="text-xs text-slate-450 leading-relaxed font-semibold mb-6">Comprehensive viability assessment based on market analysis, competitive landscape, and business model strength.</p>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Viability', val: 'High', color: 'text-emerald-600' },
                { label: 'Growth', val: 'Strong', color: 'text-indigo-650' },
                { label: 'Innovation', val: '8.5/10', color: 'text-purple-650' },
                { label: 'Market Fit', val: 'Good', color: 'text-blue-600' },
              ].map((s, i) => (
                <div key={i} className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 shadow-sm"
                >
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.label}</p>
                  <p className={`text-xs font-bold ${s.color}`}>{s.val}</p>
                </div>
              ))}
            </div>
          </div>
          <GaugeMeter value={score} />
        </div>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div variants={item} className="rounded-3xl p-6 bg-white border border-slate-100 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-800 mb-4">Score Breakdown</h3>
        <div className="space-y-4.5">
          {factors.map((factor, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between font-semibold text-xs">
                <div className="flex items-center gap-2">
                  <factor.icon className={`w-4 h-4 ${factor.color}`} />
                  <span className="text-slate-700">{factor.label}</span>
                </div>
                <span className={`font-bold ${factor.color}`}>
                  {factor.invert ? factor.value.toFixed(1) + '/10 (Lower is better)' : factor.value.toFixed(1) + '/10'}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <motion.div initial={{ width: 0 }}
                  animate={{ width: factor.invert ? `${(1 - factor.value / 10) * 100}%` : `${factor.value * 10}%` }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Strengths & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Strengths */}
        <motion.div variants={item} className="rounded-3xl p-6 bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-extrabold text-slate-800">Key Strengths</h3>
          </div>
          <ul className="space-y-3">
            {strengthsList.map((s, i) => (
              <li key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Risk Factors */}
        <motion.div variants={item} className="rounded-3xl p-6 bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-extrabold text-slate-800">Risk Factors</h3>
          </div>
          <ul className="space-y-3">
            {risksList.map((s, i) => (
              <li key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}