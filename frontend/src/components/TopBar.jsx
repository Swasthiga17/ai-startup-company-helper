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
      initial={{ y: -15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 flex items-center justify-between px-5 sm:px-6 sticky top-0 z-40 border-b border-white/10 text-white shadow-md overflow-hidden relative"
      style={{
        background: 'linear-gradient(90deg, #1c0235 0%, #310752 40%, #520b5e 75%, #690f63 100%)',
      }}
    >
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-1/4 w-80 h-16 bg-pink-500/15 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-48 h-16 bg-purple-500/20 blur-2xl pointer-events-none" />

      {/* Left Title section */}
      <div className="flex items-center gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black text-white tracking-tight font-sans leading-tight">
              {displayTitle}
            </h1>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Socket.IO Live
            </span>
          </div>
          <p className="text-[11px] text-pink-200/80 font-medium tracking-wide mt-0.5 leading-none">
            {description}
          </p>
        </div>
      </div>

      {/* Right Action buttons */}
      <div className="flex items-center gap-2 relative z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/input')}
          className="h-9 flex items-center gap-1.5 px-3.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#e60067] via-[#f02b7b] to-[#ff4e85] shadow-sm shadow-pink-600/20 border border-white/20 hover:opacity-95 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>New Analysis</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={downloadPdf || (() => alert('Downloading PDF Report...'))}
          className="h-9 flex items-center gap-1.5 px-3 rounded-lg text-xs font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 shadow-xs transition cursor-pointer backdrop-blur-md"
        >
          <FileText className="w-3.5 h-3.5 text-pink-200" />
          <span>PDF</span>
        </motion.button>

        <div className="h-5 w-px bg-white/15 mx-0.5" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => alert('No new notifications')}
          className="relative w-9 h-9 rounded-lg flex items-center justify-center text-pink-100 bg-white/10 hover:bg-white/20 border border-white/20 transition cursor-pointer backdrop-blur-md"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-pink-400 rounded-full ring-2 ring-[#1c0235]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/settings')}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-pink-100 bg-white/10 hover:bg-white/20 border border-white/20 transition cursor-pointer backdrop-blur-md"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/settings')}
          className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white/30 shadow-sm cursor-pointer ml-0.5"
          title="Profile & Settings"
        >
          S
        </motion.button>
      </div>
    </motion.header>
  );
}

