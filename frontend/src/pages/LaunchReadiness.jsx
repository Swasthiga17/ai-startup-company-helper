import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Square, ShieldCheck, Play, Award, AlertTriangle, Users, Landmark, Clock, CheckCircle } from 'lucide-react';
import { getExecutionScore } from '../services/api';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const checklistData = {
  Validation: [
    { id: 'v1', text: 'Conducted 10+ customer discovery interviews' },
    { id: 'v2', text: 'Created Ideal Customer Profile (ICP) profile sheets' },
    { id: 'v3', text: 'Validated price sensitivity and willingness to pay' },
  ],
  MVP: [
    { id: 'm1', text: 'Finalized core feature specifications sheet' },
    { id: 'm2', text: 'Completed UI wireframes and user flow diagrams' },
    { id: 'm3', text: 'Set up development environments and database schemas' },
    { id: 'm4', text: 'Completed core functional build of MVP' },
  ],
  Landing: [
    { id: 'l1', text: 'Drafted compelling copywriting for landing pages' },
    { id: 'l2', text: 'Built high-fidelity front-page layout' },
    { id: 'l3', text: 'Connected waitlist database or signup funnel' },
    { id: 'l4', text: 'Deployed build online to hosting servers' },
  ],
  Marketing: [
    { id: 'mk1', text: 'Identified primary low-cost user acquisition channels' },
    { id: 'mk2', text: 'Set up Google Analytics / tracking tags' },
    { id: 'mk3', text: 'Designed social media graphics and media assets' },
  ],
  Legal: [
    { id: 'le1', text: 'Drafted privacy policy and terms of service templates' },
    { id: 'le2', text: 'Incorporated company or completed founder contracts' },
    { id: 'le3', text: 'Verified compliance checks and security protocols' },
  ]
};

const totalChecklistItems = Object.values(checklistData).flat().length;

export default function LaunchReadiness() {
  const { currentStartup } = useApp();
  
  // Checklist State
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const stored = localStorage.getItem(`readiness_checklist_${currentStartup?.id || 'default'}`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Simulator/Execution Controls state
  const [budget, setBudget] = useState(50000);
  const [timeline, setTimeline] = useState(6);
  const [skills, setSkills] = useState(['Frontend Developer', 'Backend Developer']);
  const [execScoreData, setExecScoreData] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const availableSkillsList = [
    'CTO / Technical Lead',
    'Frontend Developer',
    'Backend Developer',
    'AI / ML Engineer',
    'UI/UX Designer',
    'Growth Marketer',
    'Legal & Compliance Advisor'
  ];

  // Save checklist state when toggled
  useEffect(() => {
    if (currentStartup?.id) {
      localStorage.setItem(`readiness_checklist_${currentStartup.id}`, JSON.stringify(checkedItems));
    }
  }, [checkedItems, currentStartup]);

  // Load execution score initially
  const runExecScoreCalculation = async () => {
    if (!currentStartup?.idea) return;
    setCalculating(true);
    try {
      const res = await getExecutionScore(currentStartup.idea, skills, budget, timeline);
      if (res.status === 'success' && res.data) {
        setExecScoreData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    if (currentStartup?.idea) {
      runExecScoreCalculation();
    }
  }, [currentStartup]);

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleSkill = (skill) => {
    setSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // Progress Calculations
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const readinessPercent = Math.round((checkedCount / totalChecklistItems) * 100);

  if (!currentStartup) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-left">
        <div className="rounded-3xl p-8 text-center bg-white border border-slate-100 shadow-xl max-w-sm w-full">
          <ShieldCheck className="w-11 h-11 text-teal-500 mx-auto mb-4 animate-pulse" />
          <h3 className="text-sm font-extrabold text-slate-800 mb-2">Launch Readiness Dashboard</h3>
          <p className="text-xs text-slate-450 font-semibold leading-relaxed">
            Select or create a startup workspace to map out your execution capabilities and launch milestone checklists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left max-w-5xl mx-auto">
      
      {/* Title Card */}
      <motion.div variants={item} className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-6 h-6 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-800">Launch Readiness & Execution</h2>
          </div>
          <p className="text-xs text-slate-450 font-semibold max-w-xl">
            Evaluate your team's execution score, examine skill gaps, and mark off structured checklists to ready your startup for release.
          </p>
        </div>

        {/* Dynamic circular progress */}
        <div className="flex items-center gap-3 bg-teal-50/50 border border-teal-150 px-4 py-3 rounded-2xl shrink-0">
          <div className="relative w-11 h-11 flex items-center justify-center text-[11px] font-black text-slate-700">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#F1F5F9" strokeWidth="3" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#0D9488" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - readinessPercent} strokeLinecap="round" />
            </svg>
            <span className="absolute">{readinessPercent}%</span>
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase leading-none">Readiness Index</p>
            <p className="text-xs font-black text-slate-700 mt-1">{checkedCount} / {totalChecklistItems} Checked</p>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Execution score controls left, Milestones right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Execution Score & Skill Gap Panel */}
        <motion.div variants={item} className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl p-6 bg-white border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-violet-500" />
                <span>Execution Probability</span>
              </h3>
              {execScoreData && (
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                  execScoreData.execution_score >= 80 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : execScoreData.execution_score >= 60
                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                      : 'bg-rose-50 text-rose-600 border-rose-100'
                }`}>
                  {execScoreData.execution_score}% Score
                </span>
              )}
            </div>

            {/* Sliders and skills selections */}
            <div className="space-y-4">
              {/* Budget slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                  <span className="flex items-center gap-1"><Landmark className="w-3.5 h-3.5" /> Budget</span>
                  <span className="text-slate-700">${budget.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="500000"
                  step="5000"
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
              </div>

              {/* Timeline Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Dev Timeline</span>
                  <span className="text-slate-700">{timeline} Months</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={timeline}
                  onChange={e => setTimeline(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
              </div>

              {/* Core Team Skills checkboxes */}
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Team Skills Available</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {availableSkillsList.map(skill => {
                    const selected = skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left border text-[11px] font-semibold transition ${
                          selected
                            ? 'bg-violet-50/50 border-violet-200 text-violet-700'
                            : 'bg-slate-50/40 border-slate-100 text-slate-650 hover:bg-slate-50'
                        }`}
                      >
                        <span>{skill}</span>
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                          selected ? 'bg-violet-600 text-white border-transparent' : 'border-slate-300'
                        }`}>
                          {selected && '✓'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={runExecScoreCalculation}
                disabled={calculating}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 hover:brightness-105 active:scale-95 transition disabled:opacity-50 cursor-pointer"
              >
                {calculating ? 'Calculating...' : 'Recalculate Probability'}
                <Play className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Display calculations results */}
            <AnimatePresence mode="wait">
              {execScoreData && (
                <motion.div
                  key="exec-result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="pt-4 border-t border-slate-50 space-y-4 text-xs font-semibold"
                >
                  {/* Skill Gap Block */}
                  <div className="p-4 rounded-2xl bg-amber-50/20 border border-amber-100/40 space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-600">
                      <AlertTriangle className="w-4.5 h-4.5" />
                      <span className="font-extrabold uppercase tracking-wider text-[10px]">Expertise Gap Analysis</span>
                    </div>
                    
                    <p className="text-[11px] text-slate-550 leading-relaxed">{execScoreData.skill_gap_analysis.risk_reason}</p>
                    
                    {execScoreData.skill_gap_analysis.missing_expertise.length > 0 && (
                      <div className="pt-2 border-t border-amber-100/20">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-1">Missing Roles:</span>
                        <div className="flex flex-wrap gap-1">
                          {execScoreData.skill_gap_analysis.missing_expertise.map(role => (
                            <span key={role} className="px-2 py-0.5 bg-amber-55 border border-amber-200 text-amber-700 text-[9px] font-bold rounded">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggestions List */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">VC Recommendations</span>
                    <ul className="space-y-2 text-slate-650 font-medium">
                      {execScoreData.suggestions.map((sug, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                          <span className="text-violet-500 font-extrabold text-[9px] mt-0.5">●</span>
                          <span className="text-[11px] leading-relaxed">{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Column: Launch Checklists */}
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl p-6 bg-white border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <CheckCircle className="w-5 h-5 text-teal-600 animate-pulse" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Actionable Launch Milestones
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(checklistData).map(([category, items]) => {
                const checkedItemsInCategory = items.filter(itm => checkedItems[itm.id]);
                const pct = Math.round((checkedItemsInCategory.length / items.length) * 100);
                
                return (
                  <div key={category} className="p-5 bg-slate-50/40 border border-slate-100 rounded-2xl space-y-3.5">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{category}</span>
                      <span className="text-[10px] font-black text-slate-450 uppercase">{pct}% Done</span>
                    </div>

                    <div className="space-y-2">
                      {items.map(item => {
                        const checked = checkedItems[item.id];
                        return (
                          <button
                            key={item.id}
                            onClick={() => toggleCheck(item.id)}
                            className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition border border-transparent hover:border-slate-100 group"
                          >
                            <span className="shrink-0 mt-0.5 text-slate-400 group-hover:text-teal-600 transition">
                              {checked ? (
                                <CheckSquare className="w-4.5 h-4.5 text-teal-600" />
                              ) : (
                                <Square className="w-4.5 h-4.5" />
                              )}
                            </span>
                            <span className={`text-[11px] font-semibold leading-relaxed ${
                              checked ? 'line-through text-slate-400' : 'text-slate-650'
                            }`}>
                              {item.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
}
