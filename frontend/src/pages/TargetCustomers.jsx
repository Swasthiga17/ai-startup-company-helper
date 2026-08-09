import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  Users, UserCheck, Compass, Heart, 
  MapPin, Star, Sparkles
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function TargetCustomers() {
  const { analysis } = useApp();

  const rawMarket = analysis?.market || {};
  const segments = rawMarket.target_market?.demographics || ['Startups (42%)', 'SMEs (28%)', 'Enterprises (18%)'];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-10">
      
      {/* Header */}
      <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Target Customers</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Detailed customer personas and targeted buying behavior segments</p>
      </motion.div>

      {/* Persona card */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {segments.map((seg, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">{seg}</h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Segment {i + 1}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                High-priority demographic target requiring automated, low-touch setup pipelines.
              </p>
            </div>
            <div className="border-t border-slate-100 pt-4 mt-6 flex gap-2">
              <span className="text-[10px] font-bold bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full text-slate-600">
                Primary Target
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Targeted Buying Behaviors */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 pb-4 border-b border-slate-50 mb-4 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-purple-600" />
          <span>Behavioral Characteristics & Goals</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Buying Triggers</h4>
            <ul className="space-y-2 text-xs text-slate-600 font-semibold">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span>Inefficient current software stack limits growth.</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span>Urgent need to cut down overhead operation costs.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Core Expectations</h4>
            <ul className="space-y-2 text-xs text-slate-600 font-semibold">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                <span>1-Click integrations with existing toolsets.</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                <span>Fast onboarding time-to-value under 15 minutes.</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
