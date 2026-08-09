import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Scale, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function LegalChecklist() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-10">
      
      {/* Header */}
      <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Legal Checklist</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Regulatory compliance tracker, intellectual property rules, and corporate structures</p>
      </motion.div>

      {/* Checklist items */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 pb-4 border-b border-slate-50 mb-4 flex items-center gap-2">
          <Scale className="w-4 h-4 text-purple-600" />
          <span>Launch Compliance Checklist</span>
        </h3>
        <div className="space-y-3">
          {[
            { title: 'Company Incorporation', desc: 'Incorporate as a Delaware C-Corp for optimal scaling and equity distribution layout.', status: 'Pending' },
            { title: 'Intellectual Property Assignment', desc: 'Secure proprietary technology transfer agreements from all initial engineers.', status: 'Pending' },
            { title: 'Data Privacy Policy Compliance', desc: 'Establish complete GDPR and HIPAA compliant data vaults and audit structures.', status: 'Pending' }
          ].map((task, i) => (
            <div key={i} className="flex items-start justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-4">
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-slate-800 block">{task.title}</span>
                <p className="text-xs text-slate-505 font-medium leading-relaxed">{task.desc}</p>
              </div>
              <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full shrink-0">
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
