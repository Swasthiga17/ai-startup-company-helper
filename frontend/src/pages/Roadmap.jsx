import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ConfidenceScoreBadge from '../components/ConfidenceScoreBadge';
import ActionItemsChecklist from '../components/ActionItemsChecklist';
import MentorSuggestionsCard from '../components/MentorSuggestionsCard';
import { Map, CheckCircle, Circle, Clock, Flag, Sparkles, Calendar } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const demoRoadmap = {
  phases: [
    { phase: 'Phase 1', title: 'Discovery & Planning', duration: '4 weeks', status: 'completed', tasks: ['Market research', 'User interviews', 'Technical architecture'] },
    { phase: 'Phase 2', title: 'MVP Development', duration: '12 weeks', status: 'in-progress', tasks: ['Core features', 'UI/UX design', 'Backend setup'] },
    { phase: 'Phase 3', title: 'Beta Launch', duration: '8 weeks', status: 'upcoming', tasks: ['User testing', 'Bug fixes', 'Performance optimization'] },
    { phase: 'Phase 4', title: 'Scale & Growth', duration: 'Ongoing', status: 'upcoming', tasks: ['Marketing', 'Feature expansion', 'Team growth'] },
  ],
};

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'rgba(16, 185, 129, 0.15)' },
  'in-progress': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'rgba(245, 158, 11, 0.15)' },
  upcoming: { icon: Circle, color: 'text-slate-400', bg: 'bg-slate-100', border: 'rgba(100, 116, 139, 0.08)' },
};

export default function Roadmap() {
  const { analysis } = useApp();
  const rawRoadmap = analysis?.mvp || analysis?.roadmap || demoRoadmap;
  const phases = Array.isArray(rawRoadmap) ? rawRoadmap : (rawRoadmap?.phases || demoRoadmap.phases);
  const weeklyTimeline = analysis?.timeline_roadmap || [
    { period: "Week 1", phase: "Idea Validation", milestone: "Customer interviews & value prop definition", status: "Completed" },
    { period: "Week 2", phase: "Problem Fit", milestone: "Landing page waitlist & feature prioritization", status: "In Progress" },
    { period: "Week 3", phase: "UI & Architecture", milestone: "Vite/React frontend & FastAPI backend setup", status: "Upcoming" },
    { period: "Week 4", phase: "Prototype Build", milestone: "Core AI agent workflow integration", status: "Upcoming" },
    { period: "Month 2", phase: "Beta Launch", milestone: "Private beta with 50 active founders", status: "Upcoming" },
    { period: "Month 3", phase: "Revenue Goal", milestone: "Paid subscriptions & $5k MRR target", status: "Upcoming" }
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-12">
      {/* Title Card */}
      <motion.div variants={item} className="rounded-3xl p-6 relative overflow-hidden bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Map className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-800">
              MVP Roadmap & Visual AI Timeline
            </h2>
          </div>
          <p className="text-xs text-slate-450 font-semibold">Step-by-step weekly milestone timeline and feature phase breakdown.</p>
        </div>

        <ConfidenceScoreBadge score={94} stars={4.9} sources={["✓ Agile Sprint Plan", "✓ TechCrunch MVP Benchmark", "✓ Lean Startup Framework"]} />
      </motion.div>

      {/* Visual Week-by-Week Timeline */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>Execution Milestone Timeline</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {weeklyTimeline.map((item, idx) => {
            const isDone = item.status === 'Completed';
            const isInProg = item.status === 'In Progress';
            return (
              <div 
                key={idx} 
                className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDone ? 'bg-emerald-50/50 border-emerald-200' :
                  isInProg ? 'bg-amber-50/50 border-amber-200 ring-2 ring-amber-400/20' :
                  'bg-slate-50/50 border-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-indigo-600 font-mono">{item.period}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      isDone ? 'bg-emerald-100 text-emerald-700' :
                      isInProg ? 'bg-amber-100 text-amber-700 animate-pulse' :
                      'bg-slate-200 text-slate-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-800 mb-1">{item.phase}</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.milestone}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Timeline Milestone Phases */}
      <motion.div variants={item} className="space-y-4">
        {phases.map((phase, i) => {
          const config = statusConfig[phase.status] || statusConfig.upcoming;
          const StatusIcon = config.icon;
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
                    style={{ background: config.bg === 'bg-slate-100' ? '#F1F5F9' : config.bg === 'bg-emerald-50' ? '#ECFDF5' : '#FEF3C7', borderColor: config.border }}
                  >
                    <StatusIcon className={`w-6 h-6 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">{phase.phase}</p>
                    <h3 className="text-base font-extrabold text-slate-800">{phase.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-450 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{phase.duration}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(phase.tasks || []).map((task, j) => (
                  <div key={j} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                    <div className={`w-1.5 h-1.5 rounded-full ${phase.status === 'completed' ? 'bg-emerald-500' : phase.status === 'in-progress' ? 'bg-amber-500 animate-pulse' : 'bg-slate-450'}`} />
                    <span className="text-xs text-slate-700 font-semibold">{task}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Key Milestones */}
      <motion.div variants={item} className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Flag className="w-5 h-5 text-pink-500" />
          <h3 className="text-base font-extrabold text-slate-800">Key Milestones</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { milestone: 'MVP Complete', date: 'Q2 2026', progress: 75 },
            { milestone: 'Beta Launch', date: 'Q3 2026', progress: 40 },
            { milestone: 'First 1000 Users', date: 'Q4 2026', progress: 20 },
            { milestone: 'Series A Ready', date: 'Q2 2027', progress: 5 },
          ].map((m, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{m.date}</span>
                <span className="text-xs text-violet-600 font-bold">{m.progress}%</span>
              </div>
              <p className="text-xs font-bold text-slate-850 mb-2">{m.milestone}</p>
              <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${m.progress}%` }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Guidance Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionItemsChecklist items={analysis?.action_items || [
          "Set up CI/CD pipeline on GitHub Actions",
          "Build responsive Vite dashboard skeleton",
          "Deploy staging backend on AWS/Vercel"
        ]} />
        <MentorSuggestionsCard suggestions={analysis?.mentor_suggestions || [
          "Keep the MVP scope tight; ship the core value loop first.",
          "De-risk vector search latency early by testing ChromaDB queries."
        ]} />
      </div>

    </motion.div>
  );
}