import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  Compass, Share2, Target, BarChart2, 
  ArrowRight, CheckCircle2
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function GoToMarket() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-10">
      
      {/* Header */}
      <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Go-To-Market (GTM)</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Growth channels, marketing budget, and beta distribution strategy</p>
      </motion.div>

      {/* GTM channels */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Cold Outbound Email', desc: 'Direct outreach targeting verified B2B startups and founders in niche spaces.', icon: Compass, color: 'text-violet-600 bg-violet-50 border-violet-100' },
          { title: 'Developer Communities', desc: 'Active advocacy on platforms like HackerNews, GitHub, and ProductHunt.', icon: Share2, color: 'text-pink-600 bg-pink-50 border-pink-100' },
          { title: 'Paid SEM Campaigns', desc: 'Targeted Google Ads focusing on key search phrases (e.g. startup generator).', icon: Target, color: 'text-sky-600 bg-sky-50 border-sky-100' }
        ].map((chan, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${chan.color}`}>
                <chan.icon className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-base">{chan.title}</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">{chan.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Launch timeline checklist */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 pb-4 border-b border-slate-50 mb-4">GTM Execution Timeline</h3>
        <div className="space-y-3">
          {[
            { phase: 'Month 1', tasks: 'Set up automated email pipelines, publish 3 open source boilerplates.' },
            { phase: 'Month 2', tasks: 'Launch private beta to top 50 developer influencers, refine on feedback.' },
            { phase: 'Month 3', tasks: 'ProductHunt and HackerNews public launching campaign with discount.' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-xs font-black text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full shrink-0">
                {item.phase}
              </span>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed mt-1">{item.tasks}</p>
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
