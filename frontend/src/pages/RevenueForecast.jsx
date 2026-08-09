import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { DollarSign, TrendingUp, BarChart3, ArrowUpRight } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function RevenueForecast() {
  const { analysis } = useApp();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left">
      {/* Title Card */}
      <motion.div variants={item} className="rounded-2xl p-6 relative overflow-hidden bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-slate-800">
            Revenue Forecast
          </h2>
        </div>
        <p className="text-xs text-slate-450 font-semibold">3-year financial projections and growth metrics</p>
      </motion.div>

      {/* Year-by-year Projections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Year 1 Revenue', value: '$1.2M', growth: '+150%', color: 'text-emerald-600', border: 'border-emerald-100' },
          { label: 'Year 2 Revenue', value: '$4.8M', growth: '+300%', color: 'text-indigo-650', border: 'border-indigo-100' },
          { label: 'Year 3 Revenue', value: '$18.2M', growth: '+280%', color: 'text-purple-650', border: 'border-purple-100' },
        ].map((yr, i) => (
          <div key={i} className={`rounded-2xl p-6 bg-white border border-slate-100 shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">{yr.label}</span>
              <span className="text-xs text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">{yr.growth}</span>
            </div>
            <p className="text-3xl font-black text-slate-800 mb-2">{yr.value}</p>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="text-xs text-slate-450 font-semibold">Projected growth</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <motion.div variants={item} className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-extrabold text-slate-800">Revenue Breakdown</h3>
          </div>
          <div className="space-y-4">
            {[
              { source: 'Subscription', pct: 45, amount: '$540K' },
              { source: 'Enterprise', pct: 30, amount: '$360K' },
              { source: 'API Access', pct: 15, amount: '$180K' },
              { source: 'Consulting', pct: 10, amount: '$120K' },
            ].map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5 font-semibold text-xs">
                  <span className="text-slate-700">{s.source}</span>
                  <span className="text-slate-450">{s.amount} ({s.pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key Financial Metrics */}
        <motion.div variants={item} className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#502AF6]" />
            <h3 className="text-base font-extrabold text-slate-800">Key Financial Metrics</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Gross Margin', value: '78%', color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100/60' },
              { label: 'CAC Payback', value: '6 mo', color: 'text-indigo-650 bg-indigo-50/50 border-indigo-100/60' },
              { label: 'LTV/CAC', value: '5.2x', color: 'text-purple-650 bg-purple-50/50 border-purple-100/60' },
              { label: 'Burn Rate', value: '$85K/mo', color: 'text-pink-650 bg-pink-50/50 border-pink-100/60' },
            ].map((m, i) => (
              <div key={i} className={`p-4 rounded-2xl border shadow-sm ${m.color.split(' ')[1]} ${m.color.split(' ')[2]}`}>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1">{m.label}</p>
                <p className={`text-xl font-extrabold text-slate-800`}>{m.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}