import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Sparkles, ArrowRight, ArrowLeft, Check, CheckCircle, 
  ChevronRight, Play, Cpu, Presentation, MessageSquare, Globe, 
  Target, Shield, Award, Landmark, TrendingUp, Lightbulb, Users,
  Layers, Star, Send
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const MOCK_GROWTH_DATA = [
  { month: 'Jan', revenue: 1000 },
  { month: 'Feb', revenue: 2500 },
  { month: 'Mar', revenue: 8000 },
  { month: 'Apr', revenue: 19000 },
  { month: 'May', revenue: 45000 },
  { month: 'Jun', revenue: 92000 }
];

export default function OnboardingShowcase() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const handleNext = () => {
    setCurrentPage(prev => (prev === 5 ? 1 : prev + 1));
  };
  const handlePrev = () => {
    setCurrentPage(prev => (prev === 1 ? 5 : prev - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0728] text-white flex flex-col justify-between overflow-x-hidden font-sans relative">
      {/* Background Aurora Radial Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-[#7C3AED]/20 to-[#EC4899]/10 blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/10 blur-[150px] pointer-events-none" />
      
      {/* Floating particles background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Top Presentation Bar */}
      <header className="px-8 py-4 flex items-center justify-between border-b border-white/5 bg-[#0F0728]/80 backdrop-blur-md z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight block">StartupGenie AI</span>
            <span className="text-[9px] text-purple-400 font-bold tracking-wider -mt-1 block uppercase">Onboarding Showcase</span>
          </div>
        </div>

        {/* Paginations Controls */}
        <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-lg">
          <button onClick={handlePrev} className="p-1 hover:bg-white/10 rounded-full transition text-purple-300">
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(p => (
              <button 
                key={p} 
                onClick={() => setCurrentPage(p)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-350 ${
                  currentPage === p ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] w-6' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <button onClick={handleNext} className="p-1 hover:bg-white/10 rounded-full transition text-purple-300">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-xs font-black rounded-xl shadow-lg shadow-purple-500/10 border border-white/10 hover:brightness-105 transition cursor-pointer"
          >
            Enter Dashboard
          </button>
        </div>
      </header>

      {/* Main Showcase Stage */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        
        {/* Mock Desktop Viewport frame (1440 x 1024 aspect ratio, scaling down to fit max containers) */}
        <div className="w-full max-w-[1360px] aspect-[1440/1024] rounded-3xl bg-[#09031C] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col justify-between">
          
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 bg-[#070214] overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[100px] animate-pulse" />
            <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] rounded-full bg-[#EC4899]/5 blur-[100px]" />
            {/* Fine grids */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.15),rgba(255,255,255,0))]" />
          </div>

          {/* Interactive Screen Display */}
          <AnimatePresence mode="wait">
            {currentPage === 1 && <ScreenHero key="hero" />}
            {currentPage === 2 && <ScreenValidation key="validation" />}
            {currentPage === 3 && <ScreenCoFounder key="cofounder" />}
            {currentPage === 4 && <ScreenJourney key="journey" />}
            {currentPage === 5 && <ScreenCTA key="cta" />}
          </AnimatePresence>

        </div>

      </main>

      {/* Footer Info bar */}
      <footer className="px-8 py-3.5 border-t border-white/5 bg-[#09031A] text-slate-400 text-xs flex justify-between items-center z-20">
        <span>Desktop Mockup Grid: 1440 × 1024 px</span>
        <span className="flex items-center gap-1.5 text-purple-300">
          <Star className="w-3.5 h-3.5 fill-purple-300 text-transparent" />
          <span>Figma Presentation Quality • StartupGenie AI v1.0</span>
        </span>
      </footer>
    </div>
  );
}

/* ----------------------------------------------------
   PAGE 1: HERO SCREEN
   ---------------------------------------------------- */
function ScreenHero() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col justify-between p-8 relative z-10"
    >
      {/* Navbar mockup */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] flex items-center justify-center shadow">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-extrabold text-white text-sm tracking-tight">
            Startup<span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Genie</span>
          </span>
        </div>

        <nav className="flex gap-6 text-[10px] text-white/70 font-semibold uppercase tracking-wider">
          <a className="hover:text-white transition cursor-pointer">Features</a>
          <a className="hover:text-white transition cursor-pointer">Solutions</a>
          <a className="hover:text-white transition cursor-pointer">Resources</a>
          <a className="hover:text-white transition cursor-pointer">Pricing</a>
          <a className="hover:text-white transition cursor-pointer">About</a>
        </nav>

        <div className="flex gap-4 items-center">
          <span className="text-[11px] font-bold text-white/80 cursor-pointer">Log In</span>
          <button className="px-4 py-1.5 bg-white text-slate-900 rounded-lg text-[10px] font-extrabold shadow hover:bg-slate-100 transition cursor-pointer">
            Get Started
          </button>
        </div>
      </div>

      {/* Main hero grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 items-center my-6">
        
        {/* Left Side: Headlines & CTA */}
        <div className="col-span-7 space-y-5 text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-bold uppercase tracking-widest text-purple-300">
              <Star className="w-2.5 h-2.5 text-purple-400" />
              <span>StartupGenie AI • From Idea to Investment.</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Build Your Startup <br />
              with an <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">AI Co-Founder</span>.
            </h1>
            
            <p className="text-xs text-white/60 leading-relaxed font-medium max-w-lg">
              Validate ideas, generate business plans, build your MVP roadmap, prepare investor-ready pitch decks, and launch with confidence—all from one intelligent platform.
            </p>
          </div>

          {/* Core CTA Highlight box */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 max-w-lg">
            <p className="text-xs font-bold text-purple-200">
              "Every Founder Needs a Co-Founder. Yours Happens to Be AI."
            </p>
            
            <div className="flex gap-3">
              <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-[10px] font-black shadow-lg shadow-purple-500/20 hover:brightness-105 transition cursor-pointer flex items-center gap-1">
                <span>🚀 Start Building Free</span>
              </button>
              <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-bold hover:bg-white/10 transition cursor-pointer flex items-center gap-1">
                <span>▶ Watch Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Center SaaS Illustration Preview */}
        <div className="col-span-5 flex items-center justify-center relative h-full min-h-[350px]">
          
          {/* Main glassmorphism card preview dashboard */}
          <div className="w-full max-w-[390px] aspect-[4/3] rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-5 shadow-2xl relative flex flex-col justify-between overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#7C3AED]/20 rounded-full blur-3xl" />
            
            {/* Header elements inside dashboard */}
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[8px] text-purple-300 font-black uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5">
                AI Validation
              </span>
            </div>

            {/* Content mockup: Brain, Lightbulb transforming to rocket */}
            <div className="flex-1 flex items-center justify-center relative">
              
              {/* Outer pulsing glow */}
              <div className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] opacity-20 blur-xl animate-pulse" />

              {/* Floating Brain Graphic */}
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/15 shadow-inner flex items-center justify-center text-2xl z-10 animate-bounce relative">
                🧠
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] p-1 rounded-lg border border-white/20">
                  <Rocket className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Floating mini roadmap cards around it */}
              <div className="absolute top-2 left-4 p-2 rounded-xl border border-white/10 bg-[#09031C]/90 text-[8px] font-bold text-left space-y-1 shadow-md w-24">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Traction</span>
                  <span className="text-emerald-400 font-extrabold">+45%</span>
                </div>
                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-emerald-400 w-3/4" />
                </div>
              </div>

              <div className="absolute bottom-4 right-4 p-2 rounded-xl border border-white/10 bg-[#09031C]/90 text-[8px] font-bold text-left space-y-1 shadow-md w-24">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Moat Score</span>
                  <span className="text-purple-300 font-extrabold">High</span>
                </div>
                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-purple-400 w-4/5" />
                </div>
              </div>
            </div>

            {/* Dashboard Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[8px] font-black uppercase text-purple-300 tracking-wider">
              <span>System active</span>
              <span>StartupGenie AI v2.0</span>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Trusted text */}
      <div className="text-center py-2 text-[10px] text-white/30 uppercase tracking-widest font-black">
        Trusted by ambitious founders worldwide
      </div>

    </motion.div>
  );
}

/* ----------------------------------------------------
   PAGE 2: IDEA VALIDATION SCREEN
   ---------------------------------------------------- */
function ScreenValidation() {
  const cards = [
    { title: 'Market Opportunity', text: 'High market demand. TAM estimated at $50B with 18% CAGR growth indices.', rating: '95%', color: 'border-teal-500/20' },
    { title: 'Competition Matrix', text: 'Low-to-medium entry barriers. Defensible strategy against giant wrappers.', rating: '82%', color: 'border-indigo-500/20' },
    { title: 'Revenue Potential', text: 'High margin subscription packages with custom enterprise API billing tiers.', rating: '90%', color: 'border-purple-500/20' },
    { title: 'Risk Level Analysis', text: 'Managed CAC dependency. Moderate compliance reviews required early on.', rating: 'Low', color: 'border-rose-500/20' },
    { title: 'Customer Demand', text: 'SaaS developers indicate high willingness to pay for customized code.', rating: '92%', color: 'border-[#EC4899]/20' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col justify-between p-8 relative z-10 text-left"
    >
      {/* Screen title */}
      <div>
        <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest block mb-2">Stage 01 Validation</span>
        <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-none">
          Validate Before You Build.
        </h2>
      </div>

      {/* Main Validation Screen contents */}
      <div className="flex-1 grid grid-cols-12 gap-8 items-center my-6">
        
        {/* Left Side: Score Circle dial */}
        <div className="col-span-5 flex flex-col items-center justify-center text-center space-y-4">
          
          <div className="relative w-52 h-52 flex items-center justify-center">
            {/* Outer rotating ring styling */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="10" />
              <circle cx="100" cy="100" r="90" fill="none" stroke="url(#validationGradient2)" strokeWidth="10" strokeDasharray="565" strokeDashoffset="85" strokeLinecap="round" />
              
              <defs>
                <linearGradient id="validationGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="50%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">85%</span>
              <span className="text-[10px] text-purple-300 uppercase font-black tracking-widest mt-1">Validation Score</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl max-w-xs backdrop-blur-md">
            <p className="text-[10px] font-semibold text-purple-200 leading-relaxed">
              "This startup holds high market potential. Key moats lie in integration speed and niche-specific custom AI modeling."
            </p>
          </div>
        </div>

        {/* Right Side: Opportunity Cards */}
        <div className="col-span-7 space-y-3">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-3.5 rounded-2xl border bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md flex items-center justify-between gap-4 transition shadow ${card.color}`}
            >
              <div className="space-y-0.5 text-left">
                <h4 className="text-xs font-black text-white">{card.title}</h4>
                <p className="text-[9.5px] text-white/55 font-semibold leading-relaxed max-w-xl">
                  {card.text}
                </p>
              </div>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-black text-purple-300 shrink-0">
                {card.rating}
              </span>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Bottom Check icons list */}
      <div className="border-t border-white/5 pt-4 flex flex-wrap justify-between items-center gap-4 text-[10px] text-white/60 font-black uppercase tracking-wider">
        <span>✓ Market Research</span>
        <span>✓ SWOT Analysis</span>
        <span>✓ Competitor Analysis</span>
        <span>✓ Business Model</span>
        <span>✓ Revenue Model</span>
        <span>✓ AI Insights</span>
      </div>

    </motion.div>
  );
}

/* ----------------------------------------------------
   PAGE 3: AI CO-FOUNDER SCREEN
   ---------------------------------------------------- */
function ScreenCoFounder() {
  const steps = ['Idea', 'Validation', 'Business Plan', 'MVP', 'Pitch Deck', 'Launch', 'Funding'];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col justify-between p-8 relative z-10 text-left"
    >
      {/* Section Headings */}
      <div>
        <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest block mb-2">Stage 02 Collaboration</span>
        <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-none">
          Your AI Co-Founder Never Sleeps.
        </h2>
      </div>

      {/* Main Container workflow & chat */}
      <div className="flex-1 grid grid-cols-12 gap-8 items-center my-6">
        
        {/* Left Side: Workflow connected line diagram */}
        <div className="col-span-5 flex flex-col justify-center relative pl-4">
          {/* Vertical connected flow */}
          <div className="absolute left-[34px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#7C3AED] via-[#EC4899] to-[#8B5CF6]" />
          
          <div className="space-y-3 relative">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-white/[0.02] border border-white/10 shadow-lg flex items-center justify-center text-xs font-extrabold relative z-15 backdrop-blur-md">
                  {idx === 5 ? '🚀' : idx === 6 ? '💰' : '💡'}
                  <div className="absolute -inset-1 bg-purple-500/10 rounded-2xl blur pointer-events-none" />
                </div>
                
                <div>
                  <h4 className="text-[11px] font-black text-white">{step}</h4>
                  <p className="text-[8px] text-white/40 uppercase tracking-widest font-black leading-none">Phase {idx + 1}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Chat Arena */}
        <div className="col-span-7 h-full flex flex-col justify-center">
          
          <div className="w-full max-w-[460px] rounded-3xl border border-white/10 bg-white/[0.01] backdrop-blur-xl p-5 shadow-2xl space-y-4">
            
            {/* Chat header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] flex items-center justify-center text-sm">
                  🤖
                </span>
                <div>
                  <h4 className="text-xs font-black text-white leading-none">Co-Founder AI</h4>
                  <span className="text-[8px] text-emerald-400 font-extrabold uppercase tracking-widest mt-1 block">Active Now</span>
                </div>
              </div>
            </div>

            {/* Dialogue balloon messages */}
            <div className="space-y-4 min-h-[180px] flex flex-col justify-end">
              
              {/* User Prompt */}
              <div className="flex items-start gap-2.5 max-w-[85%] ml-auto flex-row-reverse text-right">
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs shadow-inner">
                  👤
                </div>
                <div className="p-3.5 rounded-2xl bg-[#7C3AED] text-white text-[11px] font-semibold leading-relaxed rounded-tr-none text-left">
                  "Should I pivot my food delivery startup?"
                </div>
              </div>

              {/* AI Response */}
              <div className="flex items-start gap-2.5 max-w-[90%] mr-auto text-left">
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs shadow-inner">
                  🤖
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-purple-100 text-[11px] font-semibold leading-relaxed rounded-tl-none space-y-2">
                  <p>
                    Let's review the validation metrics. Zomato & Swiggy command 90% share. Customer Acquisition Costs (CAC) in retail averages $22 with low margins.
                  </p>
                  <p className="font-extrabold text-teal-400">
                    💡 Suggested Pivot: Automated B2B corporate office lunches.
                  </p>
                  <p className="text-white/40 text-[9.5px]">
                    This pivots focus into high Average Order Value (AOV) catering accounts, raising market scores by 33%.
                  </p>
                </div>
              </div>

            </div>

            {/* Input placeholder */}
            <div className="pt-2 border-t border-white/5 flex gap-2">
              <div className="flex-1 px-3 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] text-white/30 font-semibold flex items-center">
                Ask Co-Founder AI another question...
              </div>
              <button className="p-2.5 bg-purple-600 rounded-xl text-white">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Strategy bar */}
      <div className="text-center text-[10px] text-white/40 font-black uppercase tracking-widest">
        Full execution tracking and strategic assistance logs
      </div>

    </motion.div>
  );
}

/* ----------------------------------------------------
   PAGE 4: STARTUP JOURNEY SCREEN
   ---------------------------------------------------- */
function ScreenJourney() {
  const steps = [
    { title: 'Idea Stage', desc: 'Core concept formulation and value proposition.' },
    { title: 'Market Research', desc: 'Sizing TAM/SAM/SOM and mapping competitors.' },
    { title: 'MVP Prototype', desc: 'Developing lean functional codebases.' },
    { title: 'Product Launch', desc: 'Releasing to initial private beta users.' },
    { title: 'Launch Readiness', desc: 'Completing legal, pricing and marketing audits.' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col justify-between p-8 relative z-10 text-left"
    >
      {/* Title */}
      <div>
        <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest block mb-2">Stage 03 Venture Scale</span>
        <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-none">
          From Idea to Investment.
        </h2>
      </div>

      {/* Main splits */}
      <div className="flex-1 grid grid-cols-12 gap-8 items-center my-6">
        
        {/* Left Side: Journey Roadmap checklist */}
        <div className="col-span-6 relative pr-6">
          <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#7C3AED] to-[#EC4899]" />
          
          <div className="space-y-4">
            {steps.map((st, i) => (
              <div key={i} className="flex items-start gap-4 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] flex items-center justify-center border border-white/20 text-xs shadow-lg">
                  {i === 4 ? '⚙️' : '✓'}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[11px] font-black text-white">{st.title}</h4>
                  <p className="text-[9.5px] text-white/50 leading-relaxed font-semibold max-w-sm">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Investor Readiness score & rings */}
        <div className="col-span-6 space-y-6">
          
          {/* Dashboard card mockup */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.01] backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#EC4899]/15 rounded-full blur-2xl" />
            
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] text-purple-300 font-black uppercase tracking-wider">Investor Report Card</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider">
                Investment Ready
              </span>
            </div>

            {/* Score Ring Grid */}
            <div className="grid grid-cols-12 gap-4 items-center my-4">
              
              {/* Giant 92% readiness score */}
              <div className="col-span-5 flex flex-col items-center justify-center border-r border-white/5 pr-4">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#7C3AED" strokeWidth="3" strokeDasharray="100" strokeDashoffset="8" strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-xl font-black text-white">92%</span>
                </div>
                <span className="text-[9px] text-purple-300 uppercase font-black tracking-widest mt-2 block">Readiness Score</span>
              </div>

              {/* Progress rings details */}
              <div className="col-span-7 grid grid-cols-2 gap-3 pl-2">
                {[
                  { label: 'Startup Score', val: '88%', color: 'text-violet-400' },
                  { label: 'Business Ready', val: '90%', color: 'text-pink-400' },
                  { label: 'Market Fit Index', val: '95%', color: 'text-emerald-400' },
                  { label: 'Funding Appeal', val: '92%', color: 'text-teal-400' }
                ].map((ring, idx) => (
                  <div key={idx} className="p-2 bg-white/[0.02] border border-white/5 rounded-xl text-left space-y-1">
                    <span className="text-[8px] text-white/40 uppercase tracking-widest font-black block leading-none">{ring.label}</span>
                    <span className={`text-xs font-black ${ring.color}`}>{ring.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time projection chart mockup */}
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-left">
              <span className="text-[8px] text-white/40 uppercase tracking-widest font-black block mb-1">Growth Forecast Model</span>
              <div className="h-14">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_GROWTH_DATA}>
                    <defs>
                      <linearGradient id="journeyGlow2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#journeyGlow2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom note */}
      <div className="text-center text-[10px] text-white/40 font-black uppercase tracking-widest">
        Full investment compliance dashboard previews
      </div>

    </motion.div>
  );
}

/* ----------------------------------------------------
   PAGE 5: FINAL CTA SCREEN
   ---------------------------------------------------- */
function ScreenCTA() {
  const features = [
    { title: 'Idea Validation', icon: Target },
    { title: 'AI Mentor Chat', icon: MessageSquare },
    { title: 'Business Plan Canvas', icon: Layers },
    { title: 'Pitch Deck Generator', icon: Presentation },
    { title: 'Market Research Hub', icon: Globe },
    { title: 'Investor Ready Score', icon: Award }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col justify-between p-8 relative z-10 text-center animate-pulse-slow"
    >
      {/* Spacing alignment */}
      <div className="h-2" />

      {/* Main Central Call to action */}
      <div className="space-y-6 max-w-2xl mx-auto my-auto text-center">
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Onboarding Completed</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-none">
            Ready to Build the <br />
            <span className="bg-gradient-to-r from-[#7C3AED] via-purple-300 to-[#EC4899] bg-clip-text text-transparent">
              Next Big Startup?
            </span>
          </h2>

          <p className="text-xs text-white/60 leading-relaxed font-semibold max-w-lg mx-auto">
            Thousands of founders start with an idea. Successful founders execute with StartupGenie. Get your AI Co-Founder today.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center items-center">
          <button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-xs font-black shadow-xl shadow-purple-500/30 hover:brightness-105 transition cursor-pointer relative group">
            <span className="absolute -inset-1 bg-purple-500/25 rounded-xl blur animate-pulse" />
            <span className="relative">Start Building Free</span>
          </button>
          
          <button className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition cursor-pointer">
            Sign In
          </button>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-3 gap-3 pt-6 max-w-xl mx-auto">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i} 
                className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] backdrop-blur-md text-left flex items-center gap-2.5 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-purple-400">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-white tracking-wide">{feat.title}</span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Footer copyright */}
      <div className="border-t border-white/5 pt-4 text-[10px] text-white/30 uppercase tracking-widest font-black">
        Trusted by ambitious founders worldwide • © 2026 StartupGenie Inc.
      </div>

    </motion.div>
  );
}
