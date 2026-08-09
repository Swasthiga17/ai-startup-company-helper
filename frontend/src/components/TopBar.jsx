import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, FileText, Presentation, Settings, Bell, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const pageDescriptions = {
  '/onboarding': 'Interactive 3-Step Startup Onboarding Tour',
  '/dashboard': 'Your AI Command Center for Startup Success',
  '/problem-validation': 'Validate your problem statement and target pain points',
  '/value-prop': 'Craft compelling value propositions and core differentiators',
  '/target-customers': 'Identify target user personas and ICPs',
  '/market': 'Market Size, TAM/SAM/SOM & Growth Opportunity',
  '/competitors': 'Competitive Landscape, Moat & Positioning',
  '/swot': 'Strengths, Weaknesses, Opportunities & Threats',
  '/feature-planning': 'Prioritize core MVP features & tech architecture',
  '/business-model': 'Business Model Canvas & Unit Economics',
  '/revenue': 'Revenue Forecast, Pricing & Financial Projections',
  '/pitch-deck': 'Investor Pitch Deck & Slide Generator',
  '/chat': 'AI Mentor Conversation & Real-time Co-founder Advice',
  '/documents': 'Document Management & RAG Knowledge Base',
};

export default function TopBar({ title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { downloadPdf, downloadPptx } = useApp();

  const displayTitle = title || (location.pathname === '/dashboard' || location.pathname === '/' ? 'Executive Summary' : 'AI Analysis Hub');
  const description = pageDescriptions[location.pathname] || 'AI-Powered Startup Acceleration Platform';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-20 flex items-center justify-between px-8 sticky top-0 z-40 border-b border-white/10 text-white shadow-xl overflow-hidden relative"
      style={{
        background: 'linear-gradient(90deg, #1c0235 0%, #310752 40%, #520b5e 75%, #690f63 100%)',
      }}
    >
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-20 bg-pink-500/15 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-20 bg-purple-500/20 blur-2xl pointer-events-none" />

      {/* Left Title section */}
      <div className="flex items-center gap-3.5 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-tight font-sans">
              {displayTitle}
            </h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Socket.IO Live
            </span>
          </div>
          <p className="text-xs text-pink-200/80 font-medium tracking-wide mt-0.5">
            {description}
          </p>
        </div>
      </div>


      {/* Right Action buttons */}
      <div className="flex items-center gap-3 relative z-10">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/input')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#e60067] via-[#f02b7b] to-[#ff4e85] shadow-lg shadow-pink-600/30 border border-white/20 hover:opacity-95 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Analysis</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={downloadPdf || (() => alert('Downloading PDF Report...'))}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 shadow-xs transition cursor-pointer backdrop-blur-md"
        >
          <FileText className="w-4 h-4 text-pink-200" />
          <span>PDF</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={downloadPptx || (() => alert('Downloading Pitch Deck PPTX...'))}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 shadow-xs transition cursor-pointer backdrop-blur-md"
        >
          <Presentation className="w-4 h-4 text-purple-300" />
          <span>Pitch Deck</span>
        </motion.button>

        <div className="h-6 w-px bg-white/15 mx-1" />

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => alert('No new notifications')}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center text-pink-100 bg-white/10 hover:bg-white/20 border border-white/20 transition cursor-pointer backdrop-blur-md"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-pink-400 rounded-full ring-2 ring-[#1c0235]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => alert('Settings panel coming soon')}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-pink-100 bg-white/10 hover:bg-white/20 border border-white/20 transition cursor-pointer backdrop-blur-md"
        >
          <Settings className="w-4.5 h-4.5" />
        </motion.button>
      </div>
    </motion.header>
  );
}
