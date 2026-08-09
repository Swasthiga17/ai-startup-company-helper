import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  Users2, UserPlus, Briefcase, Calendar, DollarSign, 
  CheckCircle2, Layers, Award, Sparkles 
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function HiringPlan() {
  const { analysis } = useApp();

  const hiring = analysis?.hiring || {
    first_hires: [
      {
        role: "Lead Full-Stack Engineer",
        skills: "React 18, FastAPI / Python, PostgreSQL, System Architecture",
        timeline: "Month 1 - 2",
        salary_estimate: "$90,000 - $120,000 / yr"
      },
      {
        role: "Growth Marketing Manager",
        skills: "SEO, Content Strategy, Performance Ads, Funnel Optimization",
        timeline: "Month 3",
        salary_estimate: "$70,000 - $90,000 / yr"
      },
      {
        role: "Customer Success & Support Specialist",
        skills: "Onboarding, Technical Documentation, User Retention",
        timeline: "Month 5",
        salary_estimate: "$50,000 - $65,000 / yr"
      }
    ],
    team_structure: "Lean founder-led team transitioning to functional department heads (Engineering, Growth, Operations) post-seed funding round."
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-12">
      
      {/* Header */}
      <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Hiring Plan & Team Scaling</h1>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">Strategic recruitment timeline, skill requirements, compensation benchmarks, and org structure.</p>
        </div>
      </motion.div>

      {/* Team Structure Strategy */}
      <motion.div variants={item} className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 opacity-90" />
          <h2 className="text-xs uppercase font-extrabold tracking-wider opacity-90">Organizational Scaling Strategy</h2>
        </div>
        <p className="text-sm font-bold leading-relaxed">{hiring.team_structure}</p>
      </motion.div>

      {/* First Key Hires */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-6 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-blue-600" />
          <span>Priority Initial Roles</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hiring.first_hires?.map((hire, idx) => (
            <div key={idx} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase">
                    Priority {idx + 1}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>{hire.timeline}</span>
                  </div>
                </div>

                <h3 className="text-base font-black text-slate-800 mb-2">{hire.role}</h3>
                
                <div className="mb-4">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Required Skillset</span>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">{hire.skills}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Est. Salary</span>
                <span className="text-xs font-mono font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {hire.salary_estimate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recruitment Best Practices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Hiring Playbook & Equity</span>
          </h3>
          <ul className="space-y-3 text-xs text-slate-600 font-medium">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span>Offer 0.5% - 2.0% equity with a standard 4-year vesting schedule and 1-year cliff for core early engineering hires.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span>Prioritize generalist problem solvers with experience in high-velocity startup environments.</span>
            </li>
          </ul>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Culture & Remote Onboarding</span>
          </h3>
          <ul className="space-y-3 text-xs text-slate-600 font-medium">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <span>Maintain asynchronous communication workflows using Slack, Notion, and GitHub.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <span>Establish weekly sprint demos to align team milestones and maintain high execution speed.</span>
            </li>
          </ul>
        </motion.div>
      </div>

    </motion.div>
  );
}
