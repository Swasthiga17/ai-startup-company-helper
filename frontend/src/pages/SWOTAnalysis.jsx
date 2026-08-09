import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ConfidenceScoreBadge from '../components/ConfidenceScoreBadge';
import ActionItemsChecklist from '../components/ActionItemsChecklist';
import MentorSuggestionsCard from '../components/MentorSuggestionsCard';
import { Target, Zap, Shield, Lightbulb, AlertTriangle, ShieldAlert, Activity } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const demoSWOT = {
  strengths: ['Strong market demand', 'Innovative tech stack', 'Experienced team', 'Scalable infrastructure'],
  weaknesses: ['Limited brand awareness', 'Early stage funding', 'Small initial team', 'Narrow product scope'],
  opportunities: ['Growing market segment', 'Strategic partnerships', 'New geographic markets', 'Adjacent verticals'],
  threats: ['Established competitors', 'Regulatory changes', 'Rapid tech evolution', 'Market saturation'],
};

const sectionStyles = {
  Strengths: { border: 'border-emerald-250', bg: 'rgba(16, 185, 129, 0.03)', dot: 'bg-emerald-500', icon: 'text-emerald-600', text: 'text-emerald-800 bg-[#ECFDF5]' },
  Weaknesses: { border: 'border-rose-250', bg: 'rgba(239, 68, 68, 0.03)', dot: 'bg-red-500', icon: 'text-red-650', text: 'text-red-800 bg-[#FEF2F2]' },
  Opportunities: { border: 'border-blue-250', bg: 'rgba(59, 130, 246, 0.03)', dot: 'bg-blue-500', icon: 'text-blue-600', text: 'text-blue-800 bg-[#EFF6FF]' },
  Threats: { border: 'border-amber-250', bg: 'rgba(245, 158, 11, 0.03)', dot: 'bg-amber-500', icon: 'text-amber-600', text: 'text-amber-800 bg-[#FEF3C7]' },
};

const sectionIcons = {
  Strengths: Zap,
  Weaknesses: AlertTriangle,
  Opportunities: Lightbulb,
  Threats: Shield,
};

export default function SWOTAnalysis() {
  const { analysis } = useApp();
  const swot = analysis?.swot || analysis?.swot_analysis || demoSWOT;
  const risks = analysis?.risk_meter || {
    technical_risk: { level: "Medium", score: 45, color: "amber" },
    market_risk: { level: "High", score: 72, color: "rose" },
    financial_risk: { level: "Low", score: 25, color: "emerald" },
    operational_risk: { level: "Medium", score: 38, color: "amber" },
    legal_risk: { level: "Low", score: 20, color: "emerald" }
  };

  const sections = ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-12">
      {/* Header */}
      <motion.div variants={item} className="rounded-3xl p-6 relative overflow-hidden bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl font-bold text-slate-800">
              SWOT & Visual Risk Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-450 font-medium">Strategic assessment of internal strengths/weaknesses and visual risk progress meters.</p>
        </div>

        <ConfidenceScoreBadge score={91} stars={4.7} sources={["✓ SWOT Matrix Analysis", "✓ Technical Risk Audit", "✓ Regulatory Risk Check"]} />
      </motion.div>

      {/* Visual Risk Meters */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-rose-500" />
          <span>Visual Risk Meter Gauges</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(risks).map(([key, data], idx) => {
            const levelColor = data.level === 'High' ? 'text-rose-600 bg-rose-50 border-rose-200' :
                             data.level === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                             'text-emerald-600 bg-emerald-50 border-emerald-200';
            const barGradient = data.level === 'High' ? 'from-rose-500 to-red-600' :
                                data.level === 'Medium' ? 'from-amber-400 to-amber-500' :
                                'from-emerald-400 to-emerald-500';

            return (
              <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-extrabold uppercase text-slate-400">{key.replace('_', ' ')}</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${levelColor}`}>
                      {data.level}
                    </span>
                  </div>
                  <span className="text-xl font-black text-slate-800 font-mono">{data.score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-3">
                  <div className={`h-full bg-gradient-to-r ${barGradient}`} style={{ width: `${data.score}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((title) => {
          const items = swot[title.toLowerCase()] || [];
          const Icon = sectionIcons[title];
          const styles = sectionStyles[title];
          return (
            <motion.div 
              key={title} 
              variants={item}
              className={`rounded-2xl p-6 border-t-4 bg-white border-x border-b border-slate-100 shadow-sm`}
              style={{
                borderTopColor: styles.icon.includes('emerald') ? 'rgba(16, 185, 129, 0.5)' : 
                               styles.icon.includes('red') ? 'rgba(239, 68, 68, 0.5)' :
                               styles.icon.includes('blue') ? 'rgba(59, 130, 246, 0.5)' :
                               'rgba(245, 158, 11, 0.5)'
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Icon className={`w-5 h-5 ${styles.icon}`} />
                <h3 className="text-base font-extrabold text-slate-800">{title}</h3>
              </div>
              <ul className="space-y-2">
                {items.map((itemText, i) => (
                  <li 
                    key={i} 
                    className={`flex items-center gap-2.5 text-xs font-semibold p-3.5 rounded-xl border border-slate-100/60 ${styles.text}`}
                    style={{
                      background: styles.bg
                    }}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${styles.dot} flex-shrink-0`} />
                    <span>{itemText}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Guidance Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionItemsChecklist items={analysis?.action_items || [
          "Address technical risk by de-risking database query latency",
          "Identify regulatory check requirements for customer data",
          "Formulate strategic fallback plan for high market competition"
        ]} />
        <MentorSuggestionsCard suggestions={analysis?.mentor_suggestions || [
          "Focus early engineering resources on de-risking high market competition.",
          "Keep legal compliance simple initially with standard templates."
        ]} />
      </div>

    </motion.div>
  );
}