import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  Layers, DollarSign, Settings, Users, 
  HelpCircle, Sparkles, Shield
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function BusinessModel() {
  const { analysis } = useApp();

  const rawModel = analysis?.business_model || {};
  const revenueStreams = rawModel.revenue_streams || ['SaaS Subscription Tier', 'Enterprise Custom Licensing', 'Usage-Based API Calls'];
  const costStructure = rawModel.cost_structure || ['GPU cloud compute & hosting', 'Engineering & product maintenance', 'Marketing & sales pipeline'];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-10">
      
      {/* Header */}
      <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Business Model</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Cost structures, key metrics, and scalable delivery pipelines</p>
      </motion.div>

      {/* Canvas Grid Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue streams */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 pb-4 border-b border-slate-50 mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Revenue Streams</span>
            </h3>
            <div className="space-y-2">
              {revenueStreams.map((stream, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2 text-xs font-bold text-slate-700">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{stream}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Cost Structure */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 pb-4 border-b border-slate-50 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#6D28FF]" />
              <span>Cost Structure</span>
            </h3>
            <div className="space-y-2">
              {costStructure.map((cost, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2 text-xs font-bold text-slate-700">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>{cost}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}