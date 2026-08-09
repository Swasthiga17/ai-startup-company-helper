import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, Cpu, Send, RotateCcw, Award, CheckCircle, HelpCircle, AlertCircle, Loader2, Sparkles, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { sendSimulatorChat, evaluateSimulator, evaluateScenario } from '../services/api';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const investorPersonas = [
  { id: 'yc', name: 'Michael Seibel (YC)', emoji: '🎯', desc: 'Direct, metrics-focused. Cares about customer interviews, weekly growth, and execution speed.' },
  { id: 'sequoia', name: 'Sequoia Partner', emoji: '🌲', desc: 'Focussed on multi-billion dollar markets, defensibility, and building multi-decade moats.' },
  { id: 'angel', name: 'Naval (Angel)', emoji: '🧘‍♂️', desc: 'Cares about founder-market fit, product leverage, compound interest, and origin stories.' },
  { id: 'cvc', name: 'CVC Director', emoji: '🏢', desc: 'Risk-averse corporate VC. Asks about compliance, integration, SOC2 security, and corporate cycles.' }
];

const customerPersonas = [
  { id: 'busy_professional', name: 'Sarah (Corporate PM)', emoji: '👩‍💼', desc: 'Impatient, budget-conscious. Hates wasting time. Wants fast onboarding and Slack integration.' },
  { id: 'enterprise_buyer', name: 'David (VP of IT)', emoji: '👨‍💻', desc: 'Skeptical, security-focused. Cares about data privacy, compliance policies, SSO, and enterprise ROI.' },
  { id: 'tech_enthusiast', name: 'Alex (Dev Lead)', emoji: '🚀', desc: 'Loves APIs, custom tooling, and performant tech stacks. Despises sales talk and bloated software.' },
  { id: 'small_business', name: 'John (Restaurant Owner)', emoji: '🍕', desc: 'Operates on razor-thin margins. Cares about direct traffic, simple setup, and immediate cost savings.' }
];

export default function Simulators() {
  const { currentStartup, loadStartups } = useApp();
  const [simType, setSimType] = useState('investor');
  const [selectedPersona, setSelectedPersona] = useState('yc');
  const [chatLog, setChatLog] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Evaluation States
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  
  const chatEndRef = useRef(null);

  // P5 fix: load startups on direct navigation
  useEffect(() => {
    if (!currentStartup && loadStartups) {
      loadStartups();
    }
  }, []);

  useEffect(() => {
    // Reset chat when switching types or personas
    setChatLog([]);
    setEvalResult(null);
    const personas = simType === 'investor' ? investorPersonas : customerPersonas;
    setSelectedPersona(personas[0].id);
  }, [simType]);

  useEffect(() => {
    setChatLog([]);
    setEvalResult(null);
  }, [selectedPersona]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || !currentStartup?.idea) return;

    const userMessage = { role: 'user', content: inputVal };
    setChatLog(prev => [...prev, userMessage]);
    setInputVal('');
    setLoading(true);

    try {
      const history = chatLog.map(msg => ({ role: msg.role, content: msg.content }));
      const res = await sendSimulatorChat(currentStartup.idea, simType, selectedPersona, inputVal, history);
      
      const assistantMessage = { role: 'assistant', content: res.reply || 'No response.' };
      setChatLog(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setChatLog(prev => [...prev, { role: 'assistant', content: 'Connection timeout. Please retry.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (chatLog.length < 2 || !currentStartup?.idea) return;
    setEvalLoading(true);
    try {
      const history = chatLog.map(msg => ({ role: msg.role, content: msg.content }));
      const res = await evaluateSimulator(currentStartup.idea, simType, selectedPersona, history);
      if (res.status === 'success' && res.data) {
        setEvalResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvalLoading(false);
    }
  };

  const handleReset = () => {
    setChatLog([]);
    setEvalResult(null);
  };

  const activePersonaObj = [...investorPersonas, ...customerPersonas].find(p => p.id === selectedPersona) || investorPersonas[0];

  if (!currentStartup) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-left">
        <div className="rounded-3xl p-8 text-center bg-white border border-slate-100 shadow-xl max-w-sm w-full">
          <MessageSquare className="w-11 h-11 text-indigo-500 mx-auto mb-4 animate-pulse" />
          <h3 className="text-sm font-extrabold text-slate-800 mb-2">Roleplay Simulation Arena</h3>
          <p className="text-xs text-slate-450 font-semibold leading-relaxed">
            Please choose or define a startup workspace first before entering simulated investor pitches or customer discovery conversations.
          </p>
        </div>
      </div>
    );
  }

  const activePersonasList = simType === 'investor' ? investorPersonas : customerPersonas;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left max-w-6xl mx-auto">
      
      {/* Title Card and Tab selection */}
      <motion.div variants={item} className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-6 h-6 text-indigo-650" />
            <h2 className="text-xl font-bold text-slate-800">Founder Simulators</h2>
          </div>
          <p className="text-xs text-slate-450 font-semibold">
            Roleplay pitches and discovery interviews with simulated investor committees and customer targets.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl w-fit shrink-0 self-start lg:self-auto">
          {[
            { id: 'investor', label: 'Investor Simulator', icon: Award },
            { id: 'customer', label: 'Customer Discovery Sim', icon: Users },
            { id: 'scenario', label: 'What-If Scenario Simulator', icon: Sparkles },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSimType(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                simType === tab.id
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Split Layout: Personas selection left, chat log right */}
      {/* Scenario Simulator View */}
      {simType === 'scenario' ? (
        <div className="space-y-6">
          <ScenarioSimulatorWidget />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Personas Lists */}
        <motion.div variants={item} className="lg:col-span-1 space-y-4">
          <div className="rounded-3xl p-5 bg-white border border-slate-100 shadow-sm space-y-3.5">
            <span className="text-[10px] text-slate-450 font-black uppercase tracking-wider block border-b border-slate-50 pb-1.5">
              Select Profile
            </span>
            <div className="space-y-2">
              {activePersonasList.map(persona => {
                const active = selectedPersona === persona.id;
                return (
                  <button
                    key={persona.id}
                    onClick={() => setSelectedPersona(persona.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer hover:shadow-xs ${
                      active
                        ? 'border-indigo-500 bg-indigo-50/20 text-indigo-900 font-bold'
                        : 'border-slate-50 bg-slate-50/30 text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{persona.emoji}</span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-extrabold leading-none">{persona.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1 line-clamp-2">
                        {persona.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Columns: Chat Log & Evaluation Panel */}
        <motion.div variants={item} className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Chat Window: Takes 2 cols in md */}
          <div className="md:col-span-2 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between overflow-hidden h-[520px]">
            {/* Header info */}
            <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                <span className="text-lg">{activePersonaObj.emoji}</span>
                <span>Roleplay with {activePersonaObj.name}</span>
              </div>
              
              <button
                onClick={handleReset}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition cursor-pointer"
                title="Reset conversation log"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Log bubbles */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[380px] scrollbar-thin">
              {chatLog.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="w-10 h-10 bg-indigo-50 border border-indigo-150 rounded-full flex items-center justify-center text-indigo-500">
                    <MessageSquare className="w-5 h-5 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-800">Start the Conversation</h4>
                  <p className="text-[10px] text-slate-400 font-semibold max-w-xs leading-relaxed">
                    Say hello or pitch your idea to {activePersonaObj.name}! Start with your hook.
                  </p>
                </div>
              )}

              {chatLog.map((msg, i) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-inner shrink-0 ${
                      isUser ? 'bg-indigo-100 text-indigo-650' : 'bg-slate-100 text-slate-750 border border-slate-200'
                    }`}>
                      {isUser ? '👤' : activePersonaObj.emoji}
                    </div>
                    
                    <div className={`p-3.5 rounded-2xl border text-xs font-semibold leading-relaxed shadow-xs text-left ${
                      isUser 
                        ? 'bg-indigo-600 border-transparent text-white rounded-tr-none' 
                        : 'bg-slate-50 border-slate-100 text-slate-650 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                );
              })}

              {loading && (
                <div className="flex items-start gap-2.5 mr-auto max-w-[85%] text-left">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs border border-slate-200 shrink-0">
                    {activePersonaObj.emoji}
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 rounded-tl-none flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input field footer */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-50 bg-slate-50/10 flex gap-2 items-center">
              <input
                type="text"
                required
                disabled={loading}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder={`Pitch or ask ${activePersonaObj.name}...`}
                className="flex-1 px-4 py-2.5 text-xs border border-slate-250 rounded-xl focus:border-indigo-400 focus:outline-none bg-white shadow-inner"
              />
              <button
                type="submit"
                disabled={loading || !inputVal.trim()}
                className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md hover:brightness-105 active:scale-95 transition disabled:opacity-40 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Strategic Review Card: Takes 1 col in md */}
          <div className="md:col-span-1 rounded-3xl p-5 bg-white border border-slate-100 shadow-sm flex flex-col justify-between h-[520px]">
            <div className="space-y-4">
              <span className="text-[10px] text-slate-450 font-black uppercase tracking-wider block border-b border-slate-50 pb-1.5">
                Evaluation Center
              </span>

              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                Log at least 2 exchanges with the simulated persona, then request a VC review to analyze strengths, weaknesses, and key actions.
              </p>

              <button
                onClick={handleEvaluate}
                disabled={chatLog.length < 2 || evalLoading}
                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-650 text-xs font-black shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
              >
                {evalLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5 text-indigo-500" />}
                <span>{evalLoading ? 'Reviewing...' : 'Get VC Evaluation'}</span>
              </button>

              <AnimatePresence mode="wait">
                {evalResult && (
                  <motion.div
                    key="review-data"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4 text-xs font-semibold max-h-[300px] overflow-y-auto pr-1 scrollbar-thin"
                  >
                    {/* Pitch score index */}
                    <div className="flex justify-between items-center bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/30">
                      <span className="text-[9px] uppercase font-black text-indigo-650">Pitch Grade</span>
                      <span className="text-indigo-700 font-black text-sm">{evalResult.score}%</span>
                    </div>

                    {/* Strengths */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span>Strengths</span>
                      </span>
                      <ul className="space-y-1 text-slate-650 text-[10px] font-medium list-disc list-inside">
                        {evalResult.strengths && evalResult.strengths.map((str, i) => <li key={i}>{str}</li>)}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block flex items-center gap-0.5">
                        <AlertCircle className="w-3 h-3 text-rose-500" />
                        <span>Vulnerabilities</span>
                      </span>
                      <ul className="space-y-1 text-slate-650 text-[10px] font-medium list-disc list-inside">
                        {evalResult.weaknesses && evalResult.weaknesses.map((wk, i) => <li key={i}>{wk}</li>)}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block flex items-center gap-0.5">
                        <HelpCircle className="w-3 h-3 text-amber-500" />
                        <span>Actions Needed</span>
                      </span>
                      <ul className="space-y-1 text-slate-650 text-[10px] font-medium list-disc list-inside">
                        {evalResult.recommendations && evalResult.recommendations.map((rc, i) => <li key={i}>{rc}</li>)}
                      </ul>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="text-[9px] text-slate-400 text-center font-bold uppercase py-2 border-t border-slate-50 bg-slate-50/20 -mx-5 -mb-5 rounded-b-3xl">
              AI Panel Committee Evaluator
            </div>
          </div>

        </motion.div>

      </div>
      )}

    </motion.div>
  );
}

function ScenarioSimulatorWidget() {
  const { currentStartup } = useApp();
  const [priceChange, setPriceChange] = useState(20);
  const [newHires, setNewHires] = useState(2);
  const [loading, setLoading] = useState(false);
  const [evalResult, setEvalResult] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      runScenarioEval();
    }, 400);
    return () => clearTimeout(timer);
  }, [priceChange, newHires, currentStartup]);

  const runScenarioEval = async () => {
    const ideaText = currentStartup?.idea || "AI Startup Operating System";
    try {
      setLoading(true);
      const res = await evaluateScenario(ideaText, {
        price_change_percent: priceChange,
        new_engineers_count: newHires,
        cac_change_percent: Math.round(priceChange * 0.5),
        expenses_change_percent: Math.round(newHires * 5)
      });
      if (res && res.data) {
        setEvalResult(res.data);
      }
    } catch (err) {
      console.error("Scenario evaluation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const metrics = evalResult?.metrics || [
    { name: "Monthly Revenue (MRR)", baseline: 10000, scenario: 12000, delta: 2000, percentage_change: 20, impact: "POSITIVE" },
    { name: "CAC ($)", baseline: 250, scenario: 275, delta: 25, percentage_change: 10, impact: "NEGATIVE" },
    { name: "Runway (Months)", baseline: 18, scenario: 14.5, delta: -3.5, percentage_change: -19.4, impact: "NEGATIVE" },
    { name: "Dev Velocity (Index)", baseline: 100, scenario: 140, delta: 40, percentage_change: 40, impact: "POSITIVE" }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Interactive "What-If" Decision Simulator</span>
          </h3>
          {loading && <div className="flex items-center gap-1 text-xs text-indigo-600 font-bold"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Recalculating...</div>}
        </div>
        <p className="text-xs text-slate-500 font-semibold mb-6">Adjust strategic variables to execute deterministic Python math modeling for revenue, runway, CAC, and velocity deltas.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          
          {/* Slider 1: Pricing Adjustment */}
          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800">Price Adjustment</span>
              <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg ${priceChange >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {priceChange > 0 ? `+${priceChange}%` : `${priceChange}%`}
              </span>
            </div>
            <input 
              type="range" 
              min="-50" 
              max="100" 
              value={priceChange} 
              onChange={(e) => setPriceChange(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Slider 2: Engineering Hires */}
          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800">Add Engineers</span>
              <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600">
                +{newHires} Developers
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10" 
              value={newHires} 
              onChange={(e) => setNewHires(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

        </div>

        {/* Deterministic Metrics Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          {metrics.slice(0, 4).map((m, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 truncate">{m.name}</span>
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                  m.impact === 'POSITIVE' ? 'bg-emerald-100 text-emerald-700' : (m.impact === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700')
                }`}>
                  {m.impact}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-sm font-black text-slate-800 font-mono">{m.scenario}</span>
                <span className={`text-xs font-bold font-mono flex items-center ${m.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {m.delta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {m.percentage_change}%
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block">Baseline: {m.baseline}</span>
            </div>
          ))}
        </div>

        {/* AI Explanation Box */}
        {evalResult?.ai_explanation && (
          <div className="mt-6 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-700 font-extrabold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Scenario Explanation</span>
            </div>
            <p className="font-medium text-slate-600 leading-relaxed">{evalResult.ai_explanation}</p>
          </div>
        )}

      </div>
    </div>
  );
}

