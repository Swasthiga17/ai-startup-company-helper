import { motion } from 'framer-motion';
import { Sparkles, Check, Rocket } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const plans = [
  {
    name: 'Starter Plan',
    price: '$0',
    desc: 'Perfect for validating your first startup idea.',
    features: ['1 Active Startup Workspace', 'Basic SWOT & Business Canvas', 'Market research demographics summary', 'PDF Export Reports', 'Community mentor access'],
    color: 'border-slate-100 bg-white hover:border-slate-200'
  },
  {
    name: 'Pro Plan',
    price: '$49',
    desc: 'For professional founders raising capital.',
    features: ['Unlimited Startups Workspaces', 'Complete 8 Parallel Agents runs', 'Investor readiness ratings index', 'AI strategic GTM recommendations', 'AI Document Generator templates', 'PPTX Pitch Deck export', 'Priority mentor chat replies'],
    color: 'border-violet-500 bg-white ring-2 ring-violet-500/10 shadow-md scale-[1.02]',
    badge: 'Popular Choice'
  },
  {
    name: 'Enterprise Plan',
    price: 'Custom',
    desc: 'For incubators, accelerators, and VC teams.',
    features: ['All Pro features included', 'Collaborative workspaces access', 'White-labeled PDF/PPTX layouts', 'Dedicated custom vector database models', 'Custom API credentials link', 'Dedicated customer advisor support'],
    color: 'border-slate-100 bg-white hover:border-slate-200'
  }
];

export default function Pricing() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left">
      
      {/* Title Card */}
      <motion.div variants={item} className="rounded-2xl p-6 relative overflow-hidden bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-violet-650" />
          <h2 className="text-xl font-bold text-slate-800">Pricing Plans</h2>
        </div>
        <p className="text-xs text-slate-450 font-semibold">Select the plan that fits your execution pace and fundraising targets.</p>
      </motion.div>

      {/* Plans boxes */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {plans.map((p, i) => (
          <div 
            key={i} 
            className={`rounded-3xl p-6 border shadow-sm flex flex-col justify-between relative transition-all min-h-[460px] ${p.color}`}
          >
            {p.badge && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-violet-600 to-pink-500 text-white font-extrabold rounded-full text-[10px] uppercase tracking-wider shadow-sm">
                {p.badge}
              </span>
            )}
            
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 leading-tight">{p.name}</h3>
                <p className="text-[11px] text-slate-450 mt-1.5 font-semibold leading-relaxed">{p.desc}</p>
              </div>

              <div className="py-2">
                <span className="text-3xl font-black text-slate-800">{p.price}</span>
                {p.price !== 'Custom' && <span className="text-xs text-slate-400 font-bold"> / month</span>}
              </div>

              {/* Features list */}
              <ul className="space-y-2 pt-2 border-t border-slate-50">
                {p.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-650 font-semibold leading-snug">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              className={`w-full py-3 rounded-2xl text-xs font-black shadow transition-all cursor-pointer active:scale-98 mt-6 ${
                p.badge 
                  ? 'bg-gradient-to-r from-[#502AF6] to-[#F1358F] text-white hover:brightness-105' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-650 border border-slate-150'
              }`}
            >
              {p.price === 'Custom' ? 'Contact VC Sales' : 'Upgrade Workspace'}
            </button>
          </div>
        ))}
      </motion.div>

    </motion.div>
  );
}
