
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Briefcase,
  Map,
  LineChart,
  Presentation,
  Home,
  MessageSquare,
  FileText,
  Zap,
  ChevronRight,
  Sparkles,
  Mic,
  LogOut,
  Trello,
  Flame,
  CheckCircle,
  CheckCircle2,
  DollarSign,
  Compass,
  Tag,
  ShieldAlert,
  Users2,
  Play,
  Award,
  Globe,
  Shield,
  Cpu,
  Plus
} from 'lucide-react';

const groups = [
  {
    title: 'EXECUTIVE',
    links: [
      { path: '/dashboard', icon: Home, label: 'Dashboard Overview' },
      { path: '/onboarding', icon: Compass, label: 'Product Onboarding' },
    ]
  },
  {
    title: 'DISCOVERY',
    links: [
      { path: '/problem-validation', icon: CheckCircle, label: 'Idea Validation' },
      { path: '/value-prop', icon: Sparkles, label: 'Problem Fit & Value Prop' },
      { path: '/target-customers', icon: Users, label: 'Customer Personas' },
    ]
  },
  {
    title: 'MARKET & RISK',
    links: [
      { path: '/market', icon: Globe, label: 'Market Research' },
      { path: '/competitors', icon: BarChart3, label: 'Competitor Analysis' },
      { path: '/swot', icon: Target, label: 'SWOT & Risk Analysis' },
    ]
  },
  {
    title: 'PRODUCT',
    links: [
      { path: '/feature-planning', icon: Trello, label: 'Feature Planning' },
      { path: '/tech-stack', icon: Cpu, label: 'Technology Stack' },
      { path: '/roadmap', icon: Map, label: 'MVP Roadmap' },
    ]
  },
  {
    title: 'BUSINESS & FINANCE',
    links: [
      { path: '/business-model', icon: Briefcase, label: 'Business Model' },
      { path: '/revenue-model', icon: DollarSign, label: 'Revenue Strategy' },
      { path: '/pricing', icon: Tag, label: 'Pricing Plans' },
      { path: '/revenue', icon: LineChart, label: 'Financial Projections' },
    ]
  },
  {
    title: 'BRAND & GROWTH',
    links: [
      { path: '/brand-creation', icon: Flame, label: 'Brand Creation' },
      { path: '/gtm', icon: Compass, label: 'Marketing Strategy' },
      { path: '/sales-strategy', icon: TrendingUp, label: 'Sales Strategy' },
      { path: '/growth-advisor', icon: Zap, label: 'Growth Advisor' },
    ]
  },
  {
    title: 'OPERATIONS',
    links: [
      { path: '/hiring-plan', icon: Users2, label: 'Hiring Plan' },
      { path: '/legal', icon: Shield, label: 'Legal Guidance' },
      { path: '/devils-advocate', icon: ShieldAlert, label: "Devil's Advocate" },
    ]
  },
  {
    title: 'LAUNCH & INVESTOR',
    links: [
      { path: '/launch-readiness', icon: CheckCircle2, label: 'KPI Dashboard' },
      { path: '/investor-mode', icon: Award, label: 'Investor Mode' },
      { path: '/pitch-deck', icon: Presentation, label: 'Pitch Deck' },
      { path: '/document-generator', icon: FileText, label: 'Document Generator' },
    ]
  },
  {
    title: 'AI CO-FOUNDER',
    links: [
      { path: '/chat', icon: MessageSquare, label: 'AI Mentor Chat' },
      { path: '/workspace-hub', icon: CheckCircle2, label: 'AI Action Center' },
      { path: '/documents', icon: FileText, label: 'Documents & RAG' },
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 120, damping: 18 },
  },
};

// Robot Mascot Component
function RobotMascot() {
  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E9D5FF" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </radialGradient>
        </defs>
        {/* Antenna */}
        <line x1="50" y1="18" x2="50" y2="8" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="6" r="4" fill="#38BDF8" className="animate-pulse" />

        {/* Body Base */}
        <ellipse cx="50" cy="78" rx="26" ry="16" fill="url(#botGrad)" />

        {/* Head */}
        <rect x="22" y="18" width="56" height="46" rx="20" fill="url(#headGrad)" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Screen/Face */}
        <rect x="28" y="24" width="44" height="34" rx="14" fill="#1E1B4B" />

        {/* Eyes */}
        <ellipse cx="40" cy="40" rx="5" ry="6" fill="url(#eyeGlow)" />
        <ellipse cx="60" cy="40" rx="5" ry="6" fill="url(#eyeGlow)" />
        <circle cx="42" cy="38" r="1.5" fill="#FFFFFF" />
        <circle cx="62" cy="38" r="1.5" fill="#FFFFFF" />

        {/* Cute Smile */}
        <path d="M 44 48 Q 50 53 56 48" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />

        {/* Headphones / Ears */}
        <rect x="16" y="30" width="8" height="22" rx="4" fill="#EC4899" />
        <rect x="76" y="30" width="8" height="22" rx="4" fill="#EC4899" />
      </svg>
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed left-0 top-0 h-screen w-80 flex flex-col z-50 overflow-hidden text-white shadow-2xl select-none"
      style={{
        background: 'linear-gradient(180deg, #1c0235 0%, #310752 40%, #520b5e 75%, #690f63 100%)',
      }}
    >
      {/* Decorative Organic Wave & Glow Background Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Ambient Glows */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-pink-600/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-10 w-60 h-60 bg-magenta-500/20 rounded-full blur-2xl" />

        {/* Decorative Wave Graphics at Bottom */}
        <svg className="absolute bottom-0 left-0 w-full h-80 opacity-30" viewBox="0 0 320 400" fill="none">
          <path d="M-20 400 C 100 360, 150 280, 340 320 L 340 400 Z" fill="url(#waveGrad1)" />
          <path d="M-20 400 C 80 310, 220 370, 340 260 L 340 400 Z" fill="url(#waveGrad2)" />
          <defs>
            <linearGradient id="waveGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D946EF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Tiny Sparkle Accents */}
        <Sparkles className="absolute top-1/2 left-4 w-3 h-3 text-purple-300/30" />
        <Sparkles className="absolute bottom-44 right-8 w-3.5 h-3.5 text-pink-200/40" />
      </div>

      {/* Header / Brand */}
      <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/10">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img src="/ideaexecutor_icon_white.png" alt="IdeaExecutor Logo" className="w-11 h-11 object-contain drop-shadow-lg" />
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white font-sans flex items-center gap-1.5">
              IdeaExecutor
            </h1>
            <p className="text-[10px] text-pink-200 font-extrabold tracking-wider uppercase">
              Turn Ideas into Reality with AI
            </p>
          </div>
        </motion.div>
      </div>

      {/* Navigation list */}
      <motion.nav
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex-1 px-4 py-3 space-y-6 overflow-y-auto scrollbar-thin"
      >
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-2">
            <span className="text-sm text-pink-200/90 font-black uppercase tracking-widest px-4 block select-none mb-3 mt-1">
              {group.title}
            </span>
            {group.links.map(({ path, icon: Icon, label }) => {
              const active = location.pathname === path || (path === '/dashboard' && location.pathname === '/');
              return (
                <motion.button
                  key={path}
                  variants={itemVariants}
                  whileHover={{ x: 3, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center justify-between px-4.5 py-4 rounded-xl text-base font-black transition-all duration-200 relative group cursor-pointer ${active
                    ? 'bg-gradient-to-r from-[#e60067] via-[#ee2b7b] to-[#ff4e85] text-white shadow-lg shadow-pink-600/35'
                    : 'text-pink-100/90 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon className={`w-6 h-6 transition-colors ${active ? 'text-white' : 'text-pink-200 group-hover:text-white'}`} />
                    <span className="text-left text-base font-black tracking-wide">{label}</span>
                  </div>
                  {active && (
                    <ChevronRight className="w-5 h-5 text-white/90" />
                  )}
                </motion.button>
              );
            })}
          </div>
        ))}
      </motion.nav>

      {/* Bottom section */}
      <div className="relative z-10 p-4 space-y-3.5 bg-black/20 backdrop-blur-xs border-t border-white/10">
        {/* New Idea Analysis button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/input')}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-gradient-to-r from-[#e60067] via-[#f02b7b] to-[#ff4e85] text-white font-black text-lg shadow-xl shadow-pink-600/40 hover:opacity-95 transition-all cursor-pointer border border-white/20"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
          <span>New Idea Analysis</span>
        </motion.button>

        {/* Logout button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          className="w-full flex items-center gap-4 px-4.5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-black text-lg transition-all cursor-pointer"
        >
          <LogOut className="w-6 h-6 stroke-[2.5]" />
          <span>Logout</span>
        </motion.button>
      </div>
    </motion.aside>
  );
}
