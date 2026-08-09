import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Rocket, Compass, Users, Grid, BookOpen, 
  DollarSign, Award, Presentation, Play, 
  Sparkles, ChevronRight, FileText, Bot, 
  ArrowRight, Shield, BarChart2, CheckCircle2,
  Cpu, Layers, Zap, MessageSquare, PieChart,
  Globe, LineChart, Check
} from 'lucide-react';

export default function Marketing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const capabilities = [
    { icon: Bot, title: '8 AI Agents', desc: 'Specialized Market, Risk, Financial & Pitch Deck Agents', color: 'from-purple-500 to-indigo-600' },
    { icon: BarChart2, title: '25+ Insights', desc: 'TAM/SAM/SOM, Unit Economics & Competitor Matrix', color: 'from-pink-500 to-rose-600' },
    { icon: FileText, title: 'PDF & PPT Export', desc: 'One-click investor presentation and business plan export', color: 'from-[#6D28FF] to-purple-600' },
    { icon: Zap, title: 'Under 60 Seconds', desc: 'Complete multi-agent validation pipeline executed instantly', color: 'from-blue-500 to-cyan-500' },
  ];

  const workflowSteps = [
    { title: 'Startup Idea', icon: Sparkles, badge: 'Input' },
    { title: 'AI Analysis', icon: Cpu, badge: 'Engine' },
    { title: 'Market Research', icon: Compass, badge: 'TAM/SAM' },
    { title: 'Competitor Analysis', icon: Users, badge: 'Matrix' },
    { title: 'SWOT Analysis', icon: Grid, badge: 'Risk' },
    { title: 'Revenue Forecast', icon: DollarSign, badge: '5-Year' },
    { title: 'Pitch Deck', icon: Presentation, badge: 'Investor' },
  ];

  const featureCards = [
    {
      title: 'Market Analysis',
      subtitle: 'TAM / SAM / SOM Calculation',
      icon: Compass,
      points: ['Global TAM & SAM market sizing', 'Target customer demographic mapping', 'Growth trajectory & CAGR estimation'],
      gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
      border: 'border-violet-200/60',
      iconColor: 'text-violet-600 bg-violet-100',
    },
    {
      title: 'Competitor Matrix',
      subtitle: 'Positioning & Threat Scan',
      icon: Users,
      points: ['Direct & indirect competitor benchmarking', 'Feature parity & pricing comparison', 'Unfair advantage identification'],
      gradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
      border: 'border-indigo-200/60',
      iconColor: 'text-indigo-600 bg-indigo-100',
    },
    {
      title: 'SWOT Analysis',
      subtitle: 'Strengths & Opportunities',
      icon: Grid,
      points: ['Automated risk matrix generator', 'Market opportunity identification', 'Threat mitigation strategies'],
      gradient: 'from-pink-500/10 via-rose-500/5 to-transparent',
      border: 'border-pink-200/60',
      iconColor: 'text-pink-600 bg-pink-100',
    },
    {
      title: 'Revenue Forecast',
      subtitle: '5-Year Financial Model',
      icon: DollarSign,
      points: ['SaaS & Subscription revenue projections', 'Break-even customer threshold calculation', 'Unit economics & COGS modeling'],
      gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      border: 'border-emerald-200/60',
      iconColor: 'text-emerald-600 bg-emerald-100',
    },
    {
      title: 'Pitch Deck Generator',
      subtitle: 'Investor Ready Outlines',
      icon: Presentation,
      points: ['10-Slide investor deck structure', 'Elevator pitch & executive summary', 'One-click PowerPoint export'],
      gradient: 'from-purple-500/10 via-fuchsia-500/5 to-transparent',
      border: 'border-purple-200/60',
      iconColor: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'AI Advisor Chat',
      subtitle: '24/7 Co-Founder Mentorship',
      icon: MessageSquare,
      points: ['Interactive startup mentor chat', 'RAG document analysis (Upload PDFs)', 'AI Voice Studio & Voice Cloning'],
      gradient: 'from-sky-500/10 via-cyan-500/5 to-transparent',
      border: 'border-sky-200/60',
      iconColor: 'text-sky-600 bg-sky-100',
    },
  ];

  const techBadges = [
    { name: 'Gemini 3.5 AI', role: 'LLM Intelligence' },
    { name: 'LangGraph', role: 'Multi-Agent Orchestration' },
    { name: 'FastAPI', role: 'High-Speed Backend' },
    { name: 'React 18', role: 'Frontend Architecture' },
    { name: 'ChromaDB', role: 'Vector Search & RAG' },
  ];

  const howItWorks = [
    { step: '01', title: 'Submit Idea', desc: 'Share your startup hypothesis, industry, target customer, and problem statement.' },
    { step: '02', title: 'AI Agents Analyze', desc: '8 autonomous AI agents scan real-time market data, competitor pricing, and financial metrics.' },
    { step: '03', title: 'Business Reports', desc: 'Get instant interactive dashboards for BMC, SWOT, Market Sizing, and Revenue Forecasts.' },
    { step: '04', title: 'Investor-Ready Startup', desc: 'Export polished PDF reports and pitch deck presentations ready for angel investors.' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-900 font-sans relative overflow-x-hidden">
      
      {/* Background Soft Purple/Pink Glows & Grid Pattern */}
      <div className="absolute top-[-100px] left-[50%] -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#6D28FF]/15 via-[#EC4899]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-400/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[70%] left-[-10%] w-[500px] h-[500px] rounded-full bg-pink-400/10 blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(109,40,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(109,40,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Navbar */}
      <header className="px-6 md:px-12 py-4 flex items-center justify-between border-b border-purple-100/50 bg-white/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/ideaexecutor_icon.png" alt="IdeaExecutor Logo" className="w-10 h-10 object-contain drop-shadow-md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-xl tracking-tight">IdeaExecutor</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-[#6D28FF] uppercase tracking-wider">AI Co-Founder</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide block">Turn Ideas into Reality with AI</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
          <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#6D28FF] transition-colors">Features</button>
          <button onClick={() => document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#6D28FF] transition-colors">AI Agents</button>
          <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#6D28FF] transition-colors">How It Works</button>
          <button onClick={() => navigate('/pricing')} className="hover:text-[#6D28FF] transition-colors">Pricing</button>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#6D28FF] transition">Login</button>
          <button 
            onClick={() => navigate('/login')} 
            className="px-5 py-2.5 bg-gradient-to-r from-[#6D28FF] to-[#EC4899] hover:opacity-95 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-500/25 active:scale-95 transition flex items-center gap-1.5"
          >
            <span>Start Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-12 pb-16 md:py-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Content */}
        <div className="flex-1 space-y-6 text-left max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-xs font-extrabold text-[#6D28FF] shadow-sm">
            <Sparkles className="w-4 h-4 text-[#6D28FF]" />
            <span>Meet Your Autonomous AI Startup Co-Founder</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black leading-[1.1] text-slate-900 tracking-tight">
            Build, Validate & Launch <br />
            Your Startup with <span className="bg-gradient-to-r from-[#6D28FF] via-[#A855F7] to-[#EC4899] bg-clip-text text-transparent">AI Intelligence</span>
          </h1>

          <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed">
            Validate ideas, analyze competitors, generate business models, forecast revenue, create investor-ready pitch decks, and chat with an AI business advisor—all in one unified platform.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button 
              onClick={() => navigate('/login')} 
              className="px-8 py-4 bg-gradient-to-r from-[#6D28FF] to-[#EC4899] text-white rounded-2xl font-extrabold text-base shadow-xl shadow-purple-500/30 hover:shadow-purple-500/45 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5"
            >
              <span>Validate Your Startup Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/showcase')} 
              className="px-6 py-4 bg-white/90 border border-purple-200 text-slate-700 hover:bg-purple-50/50 rounded-2xl font-bold text-sm transition flex items-center gap-2 shadow-sm"
            >
              <Play className="w-4 h-4 text-[#6D28FF] fill-current" />
              <span>Explore Interactive Demo</span>
            </button>
          </div>

          {/* Micro Guarantee Badges */}
          <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 font-semibold border-t border-purple-100">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Instant 60s AI Report</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Export PDF & PPTX</span>
            </div>
          </div>
        </div>

        {/* Right Dashboard Visual Scene */}
        <div className="flex-1 w-full max-w-xl relative">
          <div className="relative z-10 rounded-3xl p-4 bg-white/80 backdrop-blur-xl border border-purple-200/80 shadow-2xl shadow-purple-500/10 space-y-4">
            
            {/* Header Mockup */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-bold text-slate-500">IdeaExecutor AI Dashboard</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-purple-100 text-[10px] font-black text-[#6D28FF]">LIVE ANALYSIS</span>
            </div>

            {/* Floating Module Badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: '📊 Market Analysis', sub: 'TAM $12.5B | CAGR 18.4%', badge: 'Verified', color: 'bg-violet-50 text-violet-700 border-violet-200' },
                { title: '⚔ Competitor Matrix', sub: '4 Direct | 6 Indirect', badge: 'Scanned', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                { title: '🧩 SWOT Analysis', sub: '91/100 Investability Score', badge: 'High Potential', color: 'bg-pink-50 text-pink-700 border-pink-200' },
                { title: '💰 Revenue Forecast', sub: '$1.8M Year 1 Projections', badge: '5-Yr Model', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                { title: '🎤 Pitch Deck', sub: '10 Investor-Ready Slides', badge: 'PPTX Ready', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                { title: '💬 AI Mentor Chat', sub: '24/7 RAG Knowledge Base', badge: 'Active', color: 'bg-sky-50 text-sky-700 border-sky-200' },
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-2xl border ${item.color} flex flex-col justify-between space-y-1 shadow-sm`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold">{item.title}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/80">{item.badge}</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">{item.sub}</span>
                </motion.div>
              ))}
            </div>

            {/* Mini Visual Chart Bar */}
            <div className="p-3 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                  <Sparkles className="w-5 h-5 text-pink-400 animate-spin" />
                </div>
                <div>
                  <div className="text-xs font-extrabold">Overall Startup Score</div>
                  <div className="text-[10px] text-purple-200">Innovation, Feasibility & Scalability</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400">91/100</span>
                <span className="text-[9px] text-purple-200 block uppercase">Investor Ready</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Platform Capabilities (Replaces Generic Metric Cards) */}
      <section className="px-6 md:px-12 pb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {capabilities.map((cap, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cap.color} flex items-center justify-center text-white shrink-0 shadow-md`}>
                <cap.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{cap.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-snug mt-0.5">{cap.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Powered By Tech Stack */}
      <section className="py-8 px-6 border-y border-purple-100/60 bg-white/50 backdrop-blur-md text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 shrink-0">POWERED BY ADVANCED AI TECH</span>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {techBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#6D28FF]" />
                <span className="text-sm font-extrabold text-slate-700">{badge.name}</span>
                <span className="text-[10px] text-slate-400 font-medium">({badge.role})</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Workflow Section */}
      <section id="workflow" className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#6D28FF] bg-purple-100 px-3.5 py-1 rounded-full border border-purple-200">
            AUTONOMOUS WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How IdeaExecutor's Multi-Agent Engine Works
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            From a raw prompt to a complete 360° investor intelligence package in seconds.
          </p>
        </div>

        {/* Workflow Diagram */}
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-3 overflow-x-auto pb-4">
          {workflowSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm hover:border-[#6D28FF] transition flex flex-col items-center gap-2 min-w-[130px]">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6D28FF] flex items-center justify-center">
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-800">{step.title}</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#6D28FF]">{step.badge}</span>
              </div>
              {idx < workflowSteps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-purple-300 shrink-0 hidden sm:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Core Feature Preview Cards */}
      <section id="features" className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-purple-100">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#EC4899] bg-pink-100 px-3.5 py-1 rounded-full border border-pink-200">
            COMPREHENSIVE MODULES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Build & Scale
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Deep structured business intelligence designed specifically for founders, incubators, and investors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {featureCards.map((f, i) => (
            <div 
              key={i} 
              className={`bg-white rounded-3xl p-7 border ${f.border} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} pointer-events-none`} />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${f.iconColor}`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">Module 0{i + 1}</span>
                </div>
                <h3 className="font-black text-slate-900 text-xl tracking-tight">{f.title}</h3>
                <span className="text-xs font-bold text-[#6D28FF] block mt-0.5">{f.subtitle}</span>

                <ul className="mt-5 space-y-2.5">
                  {f.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => navigate('/input')} 
                className="pt-4 flex items-center gap-1.5 text-xs font-extrabold text-[#6D28FF] hover:text-[#EC4899] transition cursor-pointer bg-transparent border-none"
              >
                <span>Run Analysis</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-purple-100 text-center">
        <div className="max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#6D28FF] bg-purple-100 px-3.5 py-1 rounded-full border border-purple-200">
            SIMPLE 4-STEP PROCESS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How IdeaExecutor Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {howItWorks.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-7 border border-purple-100 shadow-sm relative space-y-3">
              <span className="text-4xl font-black text-purple-200 absolute top-4 right-6">{item.step}</span>
              <h3 className="font-extrabold text-slate-900 text-lg pt-2">{item.title}</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#6D28FF] via-[#A855F7] to-[#EC4899] rounded-3xl p-10 md:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to Build & Validate Your Startup with AI?
          </h2>
          <p className="text-purple-100 text-sm md:text-base font-medium max-w-xl mx-auto">
            Join thousands of founders using IdeaExecutor to generate market insights, financial models, and pitch decks in seconds.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button 
              onClick={() => navigate('/input')} 
              className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-50 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition"
            >
              Get Started Free Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-100 py-10 px-6 text-center text-xs text-slate-500 font-medium bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/ideaexecutor_icon.png" alt="IdeaExecutor Logo" className="w-7 h-7 object-contain drop-shadow-xs" />
            <span className="font-extrabold text-slate-800 text-sm">IdeaExecutor</span>
          </div>
          <p>© 2026 IdeaExecutor. Turn Ideas into Reality with AI. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
