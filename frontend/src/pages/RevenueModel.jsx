import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, CreditCard, Percent, Layers, 
  ArrowUpRight, ArrowDownRight, DollarSign
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function RevenueModel() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-10">
      
      {/* Header */}
      <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Revenue Model</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Pricing tiers, usage commissions, and transaction monetization loops</p>
      </motion.div>

      {/* Pricing Models Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'SaaS Subscription', price: '$49/mo', desc: 'Flat monthly seat subscription for scaling startup teams.', icon: CreditCard, color: 'text-violet-650 bg-violet-50 border-violet-100' },
          { title: 'Usage Commission', price: '2.5% cut', desc: 'Transaction volume commission on payments processed through the platform.', icon: Percent, color: 'text-pink-650 bg-pink-50 border-pink-100' },
          { title: 'Enterprise Licensing', price: 'Custom', desc: 'Custom private cloud licenses and SLA compliance contracts.', icon: Layers, color: 'text-sky-650 bg-sky-50 border-sky-100' }
        ].map((tier, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${tier.color}`}>
                <tier.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">{tier.title}</h3>
                <span className="text-xl font-black text-slate-800 block mt-1">{tier.price}</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">{tier.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* CAC & LTV Assumptions */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 pb-4 border-b border-slate-50 mb-4">Unit Economics Assumptions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Customer Lifetime Value', value: '$2,400' },
            { label: 'Customer Acquisition Cost', value: '$350' },
            { label: 'LTV : CAC Ratio', value: '6.8x' },
            { label: 'Payback Period', value: '7 Months' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">{item.label}</span>
              <span className="text-base font-black text-slate-850">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
