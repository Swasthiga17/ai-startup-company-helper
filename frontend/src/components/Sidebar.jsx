import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Home,
  Bot,
  Lightbulb,
  Globe,
  Briefcase,
  Wrench,
  Target,
  BookOpen,
  FileText,
  Presentation,
  ChevronDown,
  ChevronRight,
  Plus,
  LogOut,
  Settings,
  HelpCircle,
  User,
  MessageSquare,
  Sun,
  Sparkles,
  Users,
  BarChart3,
  ShieldAlert,
  DollarSign,
  Zap,
  Tag,
  LineChart,
  Rocket,
  CheckSquare,
  FlaskConical,
  Activity,
  Compass,
  Cpu,
  Flame,
  Award,
  CheckCircle2
} from 'lucide-react';

const workflowSections = [
  {
    id: 'overview',
    title: 'Overview',
    icon: Home,
    path: '/dashboard',
    isSingle: true
  },
  {
    id: 'ai-cofounder',
    title: 'AI Co-Founder',
    icon: Bot,
    items: [
      { label: 'AI Mentor Chat', path: '/chat', icon: MessageSquare },
      { label: 'Recommendations', path: '/ai-recommendations', icon: Sparkles },
      { label: 'AI Founding Team', path: '/workspace', icon: Users }
    ]
  },
  {
    id: 'startup',
    title: 'Startup',
    icon: Lightbulb,
    items: [
      { label: 'Idea Validation', path: '/problem-validation', icon: CheckCircle2 },
      { label: 'Value Proposition', path: '/value-prop', icon: Sparkles },
      { label: 'Customer Personas', path: '/target-customers', icon: Users },
      { label: 'Startup Health', path: '/launch-readiness', icon: Activity },
      { label: 'Edit Idea & Parameters', path: '/input', icon: Lightbulb }
    ]
  },
  {
    id: 'intelligence',
    title: 'Intelligence',
    icon: Globe,
    items: [
      { label: 'Market Research', path: '/market', icon: Globe },
      { label: 'Competitor Analysis', path: '/competitors', icon: BarChart3 },
      { label: 'SWOT Analysis', path: '/swot', icon: Target },
      { label: 'Market Watch', path: '/workspace-hub', icon: Compass }
    ]
  },
  {
    id: 'strategy',
    title: 'Strategy',
    icon: Briefcase,
    items: [
      { label: 'Business Model', path: '/business-model', icon: Briefcase },
      { label: 'Revenue Strategy', path: '/revenue-model', icon: DollarSign },
      { label: 'Pricing Plans', path: '/pricing', icon: Tag },
      { label: 'Financial Forecast', path: '/revenue', icon: LineChart },
      { label: 'Growth Strategy', path: '/growth-advisor', icon: Zap },
      { label: 'What-If Simulator', path: '/devils-advocate', icon: ShieldAlert }
    ]
  },
  {
    id: 'build',
    title: 'Build',
    icon: Wrench,
    items: [
      { label: 'MVP Roadmap', path: '/roadmap', icon: Rocket },
      { label: 'Action Items', path: '/workspace-hub', icon: CheckSquare },
      { label: 'Feature Planning', path: '/feature-planning', icon: Activity },
      { label: 'Tech Stack', path: '/tech-stack', icon: Cpu },
      { label: 'Execution Score', path: '/impact', icon: Award }
    ]
  },
  {
    id: 'decisions',
    title: 'Decisions',
    icon: Target,
    items: [
      { label: 'Decision Log', path: '/decisions', icon: FileText },
      { label: 'Experiments', path: '/experiments', icon: FlaskConical }
    ]
  },
  {
    id: 'knowledge',
    title: 'Knowledge',
    icon: BookOpen,
    items: [
      { label: 'Document Generator', path: '/document-generator', icon: FileText },
      { label: 'Documents & RAG', path: '/documents', icon: BookOpen }
    ]
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: Presentation,
    items: [
      { label: 'Executive Report', path: '/dashboard', icon: FileText },
      { label: 'Pitch Deck', path: '/pitch-deck', icon: Presentation }
    ]
  }
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();

  const displayName = user?.name || user?.email?.split('@')[0] || 'My Account';
  const displayEmail = user?.email || 'Logged In';
  const initial = (displayName.trim()[0] || 'U').toUpperCase();

  const [openSections, setOpenSections] = useState({
    'ai-cofounder': false,
    'startup': false,
    'intelligence': false,
    'strategy': false,
    'build': false,
    'decisions': false,
    'knowledge': false,
    'reports': false,
  });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed left-0 top-0 h-screen w-[260px] flex flex-col z-50 overflow-hidden text-white shadow-2xl select-none"
      style={{
        background: 'linear-gradient(180deg, #120326 0%, #240742 40%, #3d0954 75%, #520b5e 100%)',
      }}
    >
      {/* Decorative Glow Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      {/* Header / Brand */}
      <div className="relative z-10 px-3.5 py-3 flex items-center justify-between border-b border-white/10">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <img
            src="/ideaexecutor_icon_white.png"
            alt="IdeaExecutor Logo"
            className="w-7 h-7 object-contain rounded-lg shadow-md border border-white/20 bg-white/10 p-1 backdrop-blur-sm"
          />
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white font-sans flex items-center gap-1 leading-tight">
              IdeaExecutor
            </h1>
            <p className="text-[9px] text-pink-200/90 font-bold tracking-wider uppercase leading-none">
              AI Startup Co-Founder
            </p>
          </div>
        </motion.div>
      </div>

      {/* Workflow Navigation */}
      <nav className="relative z-10 flex-1 px-2.5 py-2.5 space-y-1.5 overflow-y-auto scrollbar-thin">
        {workflowSections.map((section) => {
          const Icon = section.icon;
          const isOverview = section.isSingle;
          const isOverviewActive = location.pathname === section.path || (section.path === '/dashboard' && location.pathname === '/');
          const hasActiveChild = section.items?.some((item) => location.pathname === item.path);
          const isSectionActive = isOverview ? isOverviewActive : hasActiveChild;
          const isOpen = openSections[section.id];

          return (
            <div key={section.id} className="space-y-1">
              {/* Unified Module Box Title */}
              <button
                onClick={isOverview ? () => navigate(section.path) : () => toggleSection(section.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                  isSectionActive
                    ? 'bg-gradient-to-r from-pink-600/35 via-purple-600/40 to-indigo-600/30 text-white border-pink-500/50 shadow-sm shadow-pink-500/15'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border-white/[0.07] hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    isSectionActive ? 'bg-pink-500/25 text-pink-300' : 'bg-white/5 text-purple-300'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{section.title}</span>
                </div>

                {!isOverview && (
                  <div className="ml-1 text-slate-400 shrink-0">
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 transition-transform" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 transition-transform" />
                    )}
                  </div>
                )}
              </button>

              {/* Collapsible Submenu */}
              {!isOverview && (
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden pl-3 pr-1 py-0.5 space-y-0.5"
                    >
                      {section.items.map((sub) => {
                        const SubIcon = sub.icon;
                        const active = location.pathname === sub.path;
                        return (
                          <button
                            key={sub.label + sub.path}
                            onClick={() => navigate(sub.path)}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                              active
                                ? 'bg-gradient-to-r from-pink-600/80 to-purple-600/80 text-white font-bold shadow-xs'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <SubIcon className={`w-3 h-3 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{sub.label}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </nav>

      {/* Action CTA Button */}
      <div className="px-2.5 py-1.5 relative z-10">
        <button
          onClick={() => navigate('/input')}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-pink-600/20 hover:opacity-95 transition cursor-pointer border border-white/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Idea Analysis</span>
        </button>
      </div>

      {/* Footer Profile & Utility Links */}
      <div className="relative z-10 p-2.5 bg-slate-950/70 backdrop-blur-sm border-t border-white/10 space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => navigate('/settings')}
            className={`flex items-center gap-1.5 text-[11px] transition cursor-pointer ${
              location.pathname === '/settings' ? 'text-purple-400 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-white transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </button>
        </div>

        <div
          className="flex items-center justify-between pt-1.5 border-t border-white/10 px-1 cursor-pointer group"
          onClick={() => navigate('/settings')}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-extrabold text-[11px] text-white shadow-xs shrink-0">
              {initial}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white leading-tight group-hover:text-purple-300 transition truncate">
                {displayName}
              </div>
              <div className="text-[9px] text-slate-400 leading-none truncate">
                {displayEmail}
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="p-1 text-slate-400 hover:text-rose-400 transition shrink-0 ml-1"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
