import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, Sparkles, Lock, Mail, Eye, EyeOff, User, Bot, FileText, Folder, 
  ArrowRight, Grid, Maximize2, Minimize2, ZoomIn, ZoomOut, Check, CheckCircle2, 
  ChevronRight, Plus, RefreshCw, Moon, Sun, Info, Download, ExternalLink, 
  HelpCircle, Layers, TrendingUp, Users, DollarSign, Award, Send, Trash2, 
  Settings, Bell, Search, Play, BookOpen, Compass, LayoutDashboard, Cpu, 
  Presentation, MessageSquare
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Mock Data
const MOCK_REVENUE_DATA = [
  { year: 'Yr 1', revenue: 150000, profit: 30000 },
  { year: 'Yr 2', revenue: 450000, profit: 120000 },
  { year: 'Yr 3', revenue: 1200000, profit: 450000 },
  { year: 'Yr 4', revenue: 2800000, profit: 1100000 },
  { year: 'Yr 5', revenue: 5500000, profit: 2400000 },
];

const MOCK_RADAR_DATA = [
  { subject: 'Market Size', A: 120, B: 110, fullMark: 150 },
  { subject: 'Competitors', A: 98, B: 130, fullMark: 150 },
  { subject: 'Product Fit', A: 86, B: 130, fullMark: 150 },
  { subject: 'Financials', A: 99, B: 100, fullMark: 150 },
  { subject: 'Team Score', A: 85, B: 90, fullMark: 150 },
  { subject: 'Scalability', A: 110, B: 120, fullMark: 150 },
];

const MOCK_HISTORICAL_DATA = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 52 },
  { month: 'Mar', value: 68 },
  { month: 'Apr', value: 72 },
  { month: 'May', value: 85 },
  { month: 'Jun', value: 92 },
];

const MOCK_COMPETITORS = [
  { name: 'IdeaExecutor', featureA: 'Yes', featureB: '8 Agents', featureC: 'SQLite/Postgres', price: 'Free / $29' },
  { name: 'Competitor Alpha', featureA: 'Yes', featureB: 'Single Chat', featureC: 'Postgres Only', price: '$49/mo' },
  { name: 'Competitor Beta', featureA: 'No', featureB: 'Static Templates', featureC: 'None', price: 'Free' },
];

export default function FigmaShowcase() {
  const [viewMode, setViewMode] = useState('canvas'); // 'canvas', 'single'
  const [activeFrame, setActiveFrame] = useState('07 Dashboard');
  const [zoomLevel, setZoomLevel] = useState(0.6); // Default fit-like scale
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTheme, setActiveTheme] = useState('dark');

  // Interactive prototype mock states
  const [wizardStep, setWizardStep] = useState(1);
  const [activeTab, setActiveTab] = useState('TAM');
  const [selectedSlide, setSelectedSlide] = useState(1);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello Alex! I am your IdeaExecutor assistant. What startup idea are we validating today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [agentProgress, setAgentProgress] = useState({
    market: 100, competitor: 100, swot: 80, model: 40, mvp: 10, revenue: 0, score: 0, pitch: 0
  });

  const canvasRef = useRef(null);

  // 30 screens description catalog
  const SCREENS = [
    { id: '01 Splash', title: 'Splash Screen', type: 'mobile', category: 'Onboarding & Auth', desc: 'High-tech animated landing splash screen.' },
    { id: '02 Onboarding-1', title: 'Onboarding - Welcome', type: 'mobile', category: 'Onboarding & Auth', desc: 'Introduction to AI-powered co-founding.' },
    { id: '03 Onboarding-2', title: 'Onboarding - Agents', type: 'mobile', category: 'Onboarding & Auth', desc: 'Explanation of multi-agent validation team.' },
    { id: '04 Onboarding-3', title: 'Onboarding - Reports', type: 'mobile', category: 'Onboarding & Auth', desc: 'Overview of exportable pitch decks & PDF reports.' },
    { id: '05 Login', title: 'Sign In Page', type: 'mobile', category: 'Onboarding & Auth', desc: 'Founder access screen with social auth links.' },
    { id: '06 Register', title: 'Register Page', type: 'mobile', category: 'Onboarding & Auth', desc: 'Signup portal for new accounts.' },
    { id: '07 Dashboard', title: 'Central Dashboard', type: 'desktop', category: 'Core Workspace', desc: 'Overview of workspace health, metrics & reports.' },
    { id: '08 Workspace', title: 'Startup Workspace', type: 'desktop', category: 'Core Workspace', desc: 'Overview grid of all started projects and logs.' },
    { id: '09 New Startup', title: 'New Startup Wizard', type: 'desktop', category: 'Core Workspace', desc: 'Step-by-step startup questionnaire flow.' },
    { id: '10 AI Loading', title: 'AI Validation Pipeline', type: 'desktop', category: 'Agentic Analysis', desc: 'Active processing state of 8 background agents.' },
    { id: '11 Results Overview', title: 'Executive Summary', type: 'desktop', category: 'Agentic Analysis', desc: 'Synthesis score, overall report overview and highlights.' },
    { id: '12 Market Research', title: 'Market Analysis', type: 'desktop', category: 'Agentic Analysis', desc: 'TAM, SAM, SOM calculations and trends charts.' },
    { id: '13 Competitors', title: 'Competitor Mapping', type: 'desktop', category: 'Agentic Analysis', desc: 'Comparison matrices and competitor quadrant maps.' },
    { id: '14 SWOT', title: 'SWOT Grid', type: 'desktop', category: 'Agentic Analysis', desc: 'Four quadrant analysis matrix.' },
    { id: '15 Business Model', title: 'Business Model Canvas', type: 'desktop', category: 'Agentic Analysis', desc: 'Lean Business Model sectors overview.' },
    { id: '16 Revenue Forecast', title: 'Revenue Forecasts', type: 'desktop', category: 'Agentic Analysis', desc: '5-year financial area/profit projections.' },
    { id: '17 MVP Roadmap', title: 'MVP Timeline', type: 'desktop', category: 'Agentic Analysis', desc: 'Product rollout phases, features and epics.' },
    { id: '18 Startup Score', title: 'Startup Score Matrix', type: 'desktop', category: 'Agentic Analysis', desc: 'Radar assessment of 6 critical startup dimensions.' },
    { id: '19 Investor Readiness', title: 'Investor Checklists', type: 'desktop', category: 'Agentic Analysis', desc: 'Investor qualification checks and scorecards.' },
    { id: '20 AI Suggestions', title: 'Actionable Advice', type: 'desktop', category: 'Agentic Analysis', desc: 'Growth recommendations & risk mitigations.' },
    { id: '21 Chat', title: 'IdeaExecutor AI Chat', type: 'desktop', category: 'Core Workspace', desc: 'Interactive conversational chat workspace.' },
    { id: '22 Reports', title: 'Reports Hub', type: 'desktop', category: 'Reports & Collaboration', desc: 'Export interface for generated analyses.' },
    { id: '23 PDF Viewer', title: 'Interactive PDF Preview', type: 'desktop', category: 'Reports & Collaboration', desc: 'Preview and print controls for PDF briefs.' },
    { id: '24 PPT Viewer', title: 'Pitch Deck Viewer', type: 'desktop', category: 'Reports & Collaboration', desc: 'Interactive slide deck reviewer.' },
    { id: '25 Business Plan', title: 'Full Business Plan', type: 'desktop', category: 'Reports & Collaboration', desc: 'Formatted multi-section textual document viewer.' },
    { id: '26 History', title: 'Workspace History', type: 'desktop', category: 'Core Workspace', desc: 'Chronological timeline of past validations.' },
    { id: '27 Notifications', title: 'Notifications Center', type: 'desktop', category: 'Core Workspace', desc: 'Agent completions and system messages panel.' },
    { id: '28 Profile', title: 'Founder Profile', type: 'desktop', category: 'Settings & Account', desc: 'Founder data, team management & avatars.' },
    { id: '29 Settings', title: 'System Settings', type: 'desktop', category: 'Settings & Account', desc: 'API keys setup (Gemini, database connections).' },
    { id: '30 Pricing', title: 'Pricing Plans', type: 'desktop', category: 'Settings & Account', desc: 'Standard, Premium and Enterprise plans overview.' }
  ];

  // Search filter
  const filteredScreens = SCREENS.filter(
    s => s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
         s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mouse Drag Canvas Pan Logic
  const handleMouseDown = (e) => {
    if (viewMode !== 'canvas') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || viewMode !== 'canvas') return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom helpers
  const zoomIn = () => setZoomLevel(prev => Math.min(2.0, prev + 0.1));
  const zoomOut = () => setZoomLevel(prev => Math.max(0.2, prev - 0.1));
  const resetZoom = () => {
    setZoomLevel(0.6);
    setPanOffset({ x: 0, y: 0 });
  };

  const focusOnFrame = (frameId) => {
    setActiveFrame(frameId);
    setViewMode('single');
  };

  // Send message mock
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'ai', 
        text: 'Based on our competitive matrix, incorporating a hybrid RAG workflow with vector database scaling will lower API cost by 42%. Let me write a roadmap entry for that.' 
      }]);
    }, 1000);
  };

  // Render individual screen contents inside the artboards
  const renderScreenMockup = (id) => {
    switch (id) {
      case '01 Splash':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#090b16] via-[#10142e] to-[#04050a] flex flex-col justify-between items-center p-8 text-center relative overflow-hidden select-none">
            <div className="absolute inset-0 bg-grid-bg opacity-5" />
            <div className="absolute top-20 w-48 h-48 bg-violet-650/10 rounded-full blur-3xl" />
            <div className="flex-1 flex flex-col justify-center items-center relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#502AF6] to-[#F1358F] flex items-center justify-center shadow-lg shadow-violet-650/20 mb-6 animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">IdeaExecutor</h2>
              <span className="text-[10px] text-violet-400 font-bold uppercase tracking-widest mt-2 block">Your AI Co-Founder</span>
            </div>
            <div className="space-y-3 pb-8 z-10 w-full">
              <div className="w-2/3 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-600 to-pink-500 rounded-full w-2/3 animate-pulse" />
              </div>
              <span className="text-[10px] text-slate-500 font-bold block">Initializing Agents...</span>
            </div>
          </div>
        );

      case '02 Onboarding-1':
        return (
          <div className="w-full h-full bg-[#0a0d1e] flex flex-col justify-between p-8 text-center select-none">
            <div className="flex justify-end"><span className="text-[11px] text-slate-550 font-bold cursor-pointer">Skip</span></div>
            <div className="flex-1 flex flex-col justify-center items-center space-y-6">
              <div className="w-28 h-28 rounded-full bg-violet-950/40 border border-violet-800/30 flex items-center justify-center shadow-2xl">
                <Rocket className="w-12 h-12 text-violet-500" />
              </div>
              <div className="space-y-2.5">
                <h3 className="text-xl font-black text-white leading-tight">Turn Ideas into Reality</h3>
                <p className="text-xs text-slate-400 leading-relaxed px-2">Submit your raw startup concepts and let our agentic intelligence validate and plan your business model.</p>
              </div>
            </div>
            <div className="flex items-center justify-between pb-2">
              <div className="flex gap-1.5">
                <span className="w-5 h-1.5 rounded-full bg-violet-600" />
                <span className="w-2 h-1.5 rounded-full bg-slate-800" />
                <span className="w-2 h-1.5 rounded-full bg-slate-800" />
              </div>
              <button className="w-9 h-9 rounded-full bg-gradient-to-r from-[#502AF6] to-[#F1358F] flex items-center justify-center text-white font-bold hover:brightness-110">➔</button>
            </div>
          </div>
        );

      case '03 Onboarding-2':
        return (
          <div className="w-full h-full bg-[#0a0d1e] flex flex-col justify-between p-8 text-center select-none">
            <div className="flex justify-end"><span className="text-[11px] text-slate-550 font-bold cursor-pointer">Skip</span></div>
            <div className="flex-1 flex flex-col justify-center items-center space-y-5">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-650/20 z-10">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                {[...Array(6)].map((_, i) => {
                  const angle = (i * 360) / 6;
                  const x = Math.cos((angle * Math.PI) / 180) * 44;
                  const y = Math.sin((angle * Math.PI) / 180) * 44;
                  return (
                    <div 
                      key={i} 
                      className="absolute w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px]"
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                    >
                      {['📊', '💡', '🎯', '💰', '📈', '📋'][i]}
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2.5">
                <h3 className="text-xl font-black text-white leading-tight">8 Agent Experts</h3>
                <p className="text-xs text-slate-400 leading-relaxed px-2">Work with specialized AI agents who perform market research, SWOT analysis, roadmap planning, and investor readiness.</p>
              </div>
            </div>
            <div className="flex items-center justify-between pb-2">
              <div className="flex gap-1.5">
                <span className="w-2 h-1.5 rounded-full bg-slate-800" />
                <span className="w-5 h-1.5 rounded-full bg-violet-600" />
                <span className="w-2 h-1.5 rounded-full bg-slate-800" />
              </div>
              <button className="w-9 h-9 rounded-full bg-gradient-to-r from-[#502AF6] to-[#F1358F] flex items-center justify-center text-white font-bold hover:brightness-110">➔</button>
            </div>
          </div>
        );

      case '04 Onboarding-3':
        return (
          <div className="w-full h-full bg-[#0a0d1e] flex flex-col justify-between p-8 text-center select-none">
            <div className="flex justify-end"><span className="text-[11px] text-slate-550 font-bold cursor-pointer">Skip</span></div>
            <div className="flex-1 flex flex-col justify-center items-center space-y-6">
              <div className="w-28 h-28 bg-[#131730] border border-violet-900/20 rounded-2xl flex items-center justify-center shadow-inner relative p-4">
                <div className="w-14 h-16 bg-white border border-slate-200 rounded shadow-md p-1.5 flex flex-col justify-between text-left">
                  <span className="block font-black text-violet-600 text-[9px] leading-none">PITCH</span>
                  <span className="block h-0.5 bg-slate-100 rounded w-full" />
                  <span className="block h-0.5 bg-slate-100 rounded w-3/4" />
                  <span className="block text-[6px] text-slate-400">Slides PDF</span>
                </div>
              </div>
              <div className="space-y-2.5">
                <h3 className="text-xl font-black text-white leading-tight">Export Investor Briefs</h3>
                <p className="text-xs text-slate-400 leading-relaxed px-2">Download polished PDF research documents and PPTX presentation slides to show VC pitch events.</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full py-2.5 bg-gradient-to-r from-[#502AF6] to-[#F1358F] text-white rounded-xl text-xs font-bold hover:brightness-110 shadow-md">
                Get Started
              </button>
            </div>
          </div>
        );

      case '05 Login':
        return (
          <div className="w-full h-full bg-[#080b18] p-8 text-left flex flex-col justify-between select-none">
            <div className="space-y-4">
              <span className="text-xs font-black text-violet-400">IdeaExecutor</span>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Welcome Back</h3>
                <p className="text-[10px] text-slate-500 font-semibold">Sign in to manage your startup plans</p>
              </div>
              <div className="space-y-3 pt-2 text-[10px] font-bold text-slate-400">
                <div className="space-y-1">
                  <label>Email Address</label>
                  <input type="email" placeholder="alex@startup.io" readOnly className="w-full bg-[#11152d] border border-slate-800 rounded-lg px-3 py-2 text-white text-[10px] focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label>Password</label>
                  <input type="password" value="••••••••••" readOnly className="w-full bg-[#11152d] border border-slate-800 rounded-lg px-3 py-2 text-slate-500 text-[10px] focus:outline-none" />
                </div>
              </div>
              <button className="w-full py-2.5 bg-gradient-to-r from-[#502AF6] to-[#F1358F] text-white rounded-lg text-[10px] font-black shadow-md mt-2">
                Login
              </button>
            </div>
            <p className="text-[9px] text-slate-500 text-center">New founder? <span className="text-pink-500 font-bold hover:underline cursor-pointer">Register</span></p>
          </div>
        );

      case '06 Register':
        return (
          <div className="w-full h-full bg-[#080b18] p-8 text-left flex flex-col justify-between select-none">
            <div className="space-y-3">
              <span className="text-xs font-black text-violet-400">IdeaExecutor</span>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">Create Account</h3>
                <p className="text-[9px] text-slate-500 font-semibold">Join thousands of founders using IdeaExecutor</p>
              </div>
              <div className="space-y-2.5 pt-1 text-[9px] font-bold text-slate-400">
                <div className="space-y-1">
                  <label>Full Name</label>
                  <input type="text" placeholder="Alex Johnson" readOnly className="w-full bg-[#11152d] border border-slate-800 rounded-lg px-3 py-1.5 text-white text-[9px] focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label>Email Address</label>
                  <input type="email" placeholder="alex@startup.io" readOnly className="w-full bg-[#11152d] border border-slate-800 rounded-lg px-3 py-1.5 text-white text-[9px] focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label>Create Password</label>
                  <input type="password" value="••••••••••" readOnly className="w-full bg-[#11152d] border border-slate-800 rounded-lg px-3 py-1.5 text-slate-500 text-[9px] focus:outline-none" />
                </div>
              </div>
              <button className="w-full py-2 bg-gradient-to-r from-[#502AF6] to-[#F1358F] text-white rounded-lg text-[9px] font-black shadow-md mt-1">
                Register
              </button>
            </div>
            <p className="text-[9px] text-slate-500 text-center">Already registered? <span className="text-pink-500 font-bold hover:underline cursor-pointer">Login</span></p>
          </div>
        );

      case '07 Dashboard':
        return (
          <div className="w-full h-full bg-[#090b16] text-left flex">
            {/* Sidebar Mock */}
            <div className="w-1/5 bg-[#0d1024] border-r border-slate-850 p-4 flex flex-col justify-between select-none">
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span className="font-extrabold text-[10px] text-white">IdeaExecutor</span>
                </div>
                <div className="space-y-1.5 text-[9px] font-bold text-slate-450">
                  <div className="px-2.5 py-1.5 rounded bg-violet-600/10 text-violet-400 flex items-center gap-1.5"><LayoutDashboard className="w-3.5 h-3.5" /> Dashboard</div>
                  <div className="px-2.5 py-1.5 flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> Workspace</div>
                  <div className="px-2.5 py-1.5 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> AI Chat</div>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-slate-800/80 pt-3">
                <div className="w-6 h-6 rounded-full bg-violet-650 flex items-center justify-center text-[10px] text-white">AJ</div>
                <span className="text-[9px] text-white font-extrabold">Alex J.</span>
              </div>
            </div>
            {/* Main Area */}
            <div className="w-4/5 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
              <div className="flex justify-between items-center select-none">
                <div>
                  <h3 className="text-sm font-black text-white">Startup Dashboard</h3>
                  <p className="text-[9px] text-slate-500 font-semibold">Active Project: EduAI Platform</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-[8px] font-bold rounded-full border border-green-500/20">Ready for VCs</span>
                  <span className="px-2.5 py-1 bg-violet-600 text-white text-[8px] font-extrabold rounded-lg">New Startup +</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#0d1024] rounded-xl border border-slate-850">
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Startup Score</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-black text-white">88</span>
                    <span className="text-[9px] text-slate-500">/ 100</span>
                  </div>
                </div>
                <div className="p-3 bg-[#0d1024] rounded-xl border border-slate-850">
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Market TAM</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-black text-violet-400">$128.5B</span>
                  </div>
                </div>
                <div className="p-3 bg-[#0d1024] rounded-xl border border-slate-850">
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Validation Stage</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-black text-pink-400">Complete</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#0c0e1e] rounded-xl p-3 border border-slate-850 flex-1 min-h-[120px]">
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Workspace Health History</span>
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={MOCK_HISTORICAL_DATA}>
                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="url(#colorVal)" />
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case '08 Workspace':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="flex justify-between items-center select-none">
              <div>
                <h3 className="text-sm font-black text-white">Your Startups</h3>
                <p className="text-[9px] text-slate-500">Manage multiple projects concurrently</p>
              </div>
              <input type="text" placeholder="Search startups..." readOnly className="bg-[#0f1228] border border-slate-800 rounded-lg px-2.5 py-1 text-[9px] text-white w-32 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4 flex-1">
              {[
                { name: 'EduAI Platform', desc: 'AI assistant for university compliance and workflows.', score: '88', status: 'Completed', agents: '8/8' },
                { name: 'FinSmart Advisor', desc: 'Agentic automated invoice bookkeeping and validation.', score: '62', status: 'Draft', agents: '3/8' },
              ].map((p, idx) => (
                <div key={idx} className="p-4 bg-[#0d1024] rounded-2xl border border-slate-850 flex flex-col justify-between space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-white">{p.name}</h4>
                      <p className="text-[9px] text-slate-500 mt-1 leading-snug">{p.desc}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-violet-600/10 text-violet-400 text-[8px] font-bold rounded">{p.score} pts</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-800/80 pt-2 text-[8px] text-slate-400">
                    <span>Agents active: <span className="text-white font-bold">{p.agents}</span></span>
                    <span className={`px-1.5 py-0.5 rounded font-bold ${p.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-2 bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-xl text-[9px] font-extrabold flex items-center justify-center gap-1 mt-2">
              <Plus className="w-3.5 h-3.5" /> Start New Workspace
            </button>
          </div>
        );

      case '09 New Startup':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div>
              <span className="text-[8px] text-slate-500 font-extrabold uppercase tracking-wider block">Step {wizardStep} of 4</span>
              <h3 className="text-sm font-black text-white mt-1">Submit Startup Idea</h3>
              <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">Provide details of your product problem and target persona.</p>
            </div>
            <div className="p-4 bg-[#0d1024] rounded-2xl border border-slate-850 flex-1 flex flex-col justify-center space-y-3">
              {wizardStep === 1 && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Startup Name</label>
                    <input type="text" defaultValue="EduAI Platform" className="w-full bg-[#0b0c16] border border-slate-800 rounded-lg px-3 py-2 text-[10px] text-white focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Industry Sector</label>
                    <select className="w-full bg-[#0b0c16] border border-slate-800 rounded-lg px-2.5 py-2 text-[10px] text-white focus:outline-none">
                      <option>EdTech Sector</option>
                      <option>Fintech Sector</option>
                      <option>HealthTech Sector</option>
                    </select>
                  </div>
                </div>
              )}
              {wizardStep > 1 && (
                <div className="space-y-2 text-center py-4">
                  <Cpu className="w-8 h-8 text-violet-500 mx-auto animate-pulse" />
                  <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">Collecting market segmentation constraints...</p>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center select-none pt-2">
              <button onClick={() => setWizardStep(prev => Math.max(1, prev - 1))} className="px-3 py-1.5 bg-slate-855 hover:bg-slate-800 text-[9px] rounded text-slate-400 font-bold">Back</button>
              <button onClick={() => setWizardStep(prev => (prev < 4 ? prev + 1 : 1))} className="px-4 py-1.5 bg-violet-600 text-[9px] text-white rounded-lg font-black hover:bg-violet-750">Next Step</button>
            </div>
          </div>
        );

      case '10 AI Loading':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="text-center space-y-2 pt-2">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-violet-500 flex items-center justify-center mx-auto animate-spin">
                <Cpu className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-sm font-black text-white">AI Validation Pipeline</h3>
              <p className="text-[9px] text-slate-500">8 agents analyzing "EduAI Platform" in parallel...</p>
            </div>
            <div className="space-y-2 flex-1 pt-2">
              {[
                { name: 'Market Research Agent', status: 'Crawling TAM statistics...', percent: 100, active: false },
                { name: 'Competitor Analysis Agent', status: 'Mapping competitor matrices...', percent: 100, active: false },
                { name: 'SWOT Analysis Agent', status: 'Determining product threat thresholds...', percent: 80, active: true },
                { name: 'Business Model Agent', status: 'Pending SWOT inputs...', percent: 40, active: false },
              ].map((a, idx) => (
                <div key={idx} className="p-2.5 bg-[#0d1024] rounded-xl border border-slate-855 space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] font-bold">
                    <span className="text-white">{a.name}</span>
                    <span className={a.active ? "text-violet-400 animate-pulse" : "text-green-400"}>{a.percent}%</span>
                  </div>
                  <div className="h-1 bg-[#0b0c16] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-600 to-pink-500 rounded-full" style={{ width: `${a.percent}%` }} />
                  </div>
                  <p className="text-[7.5px] text-slate-500 leading-none">{a.status}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case '11 Results Overview':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="flex justify-between items-center select-none">
              <div>
                <h3 className="text-sm font-black text-white">Validation Results</h3>
                <p className="text-[9px] text-slate-500 font-semibold">EduAI Platform Analysis Synthesis</p>
              </div>
              <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[8px] font-extrabold border border-green-500/20 rounded">88% Viable</span>
            </div>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="p-4 bg-[#0d1024] rounded-2xl border border-slate-855 flex flex-col justify-between">
                <div>
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Executive Summary</span>
                  <p className="text-[9px] text-slate-350 leading-relaxed mt-2">
                    EduAI Platform addresses a key workload pain point in Higher Education compliance workflows. The target segment has a high willingness to pay due to strict regulatory filing deadlines. However, customer acquisition cost (CAC) will require a strong direct-sales pilot workflow to establish credibility.
                  </p>
                </div>
                <div className="flex gap-2 pt-2 text-[8px] text-violet-400 font-bold">
                  <span>TAM: $128.5B</span>
                  <span>•</span>
                  <span>Monetization: SaaS</span>
                </div>
              </div>
              <div className="p-4 bg-[#0d1024] rounded-2xl border border-slate-855 space-y-3">
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Key Recommendations</span>
                {[
                  { title: 'Focus on Beachhead', desc: 'Target small private universities first.' },
                  { title: 'Leverage Hybrid RAG', desc: 'Reduces database hosting costs by 40%.' },
                  { title: 'Prepare compliance proof', desc: 'Direct response to SWOT competitor threat.' }
                ].map((r, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-violet-500 font-bold text-xs mt-0.5">•</span>
                    <div>
                      <h4 className="text-[9px] font-extrabold text-white leading-tight">{r.title}</h4>
                      <p className="text-[8px] text-slate-500 mt-0.5">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case '12 Market Research':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="flex justify-between items-center select-none">
              <div>
                <h3 className="text-sm font-black text-white">Market Sizing Analysis</h3>
                <p className="text-[9px] text-slate-500 font-semibold">Addressable market estimates for EduAI</p>
              </div>
              <div className="flex gap-1 bg-[#0c0e20] p-0.5 rounded border border-slate-850">
                {['TAM', 'SAM', 'SOM'].map(t => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`px-2 py-0.5 rounded text-[8px] font-bold ${activeTab === t ? 'bg-violet-600 text-white' : 'text-slate-500'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'TAM (Total)', val: '$128.5B', active: activeTab === 'TAM' },
                { label: 'SAM (Service)', val: '$32.2B', active: activeTab === 'SAM' },
                { label: 'SOM (Obtainable)', val: '$4.8B', active: activeTab === 'SOM' },
              ].map((m, idx) => (
                <div key={idx} className={`p-3 rounded-xl border transition ${m.active ? 'bg-violet-950/20 border-violet-800' : 'bg-[#0d1024] border-slate-855'}`}>
                  <span className="text-[8.5px] text-slate-550 font-bold uppercase tracking-wider block">{m.label}</span>
                  <p className="text-sm font-black text-white mt-1">{m.val}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#0c0e1e] rounded-xl p-3 border border-slate-855 flex-1 min-h-[110px]">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Year-over-Year Growth Projection</span>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={MOCK_HISTORICAL_DATA}>
                  <Area type="monotone" dataKey="value" stroke="#db2777" fill="#db2777" fillOpacity={0.05} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case '13 Competitors':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div>
              <h3 className="text-sm font-black text-white">Competitive Intelligence</h3>
              <p className="text-[9px] text-slate-500 font-semibold">Feature comparison table mapping key competitors</p>
            </div>
            <div className="bg-[#0d1024] rounded-2xl border border-slate-850 overflow-hidden flex-1">
              <table className="w-full border-collapse text-left text-[9.5px]">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-[#121634]/60 text-slate-400 font-bold">
                    <th className="p-3">Company</th>
                    <th className="p-3">AI Agents</th>
                    <th className="p-3">Data Backend</th>
                    <th className="p-3">Price Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  {MOCK_COMPETITORS.map((c, idx) => (
                    <tr key={idx} className="hover:bg-[#121634]/20 transition">
                      <td className="p-3 font-bold text-white">{c.name}</td>
                      <td className="p-3">{c.featureB}</td>
                      <td className="p-3">{c.featureC}</td>
                      <td className="p-3">{c.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case '14 SWOT':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div>
              <h3 className="text-sm font-black text-white">SWOT Matrix</h3>
              <p className="text-[9px] text-slate-500 font-semibold">SWOT Agent compilation for EduAI Platform</p>
            </div>
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="p-3.5 bg-green-950/10 border border-green-900/20 rounded-xl space-y-1">
                <span className="text-[8.5px] font-black text-green-400 uppercase tracking-widest block">Strengths</span>
                <p className="text-[8px] text-slate-350 leading-relaxed">Proprietary hybrid RAG integration lowers execution API costs; active compliance checking templates built-in.</p>
              </div>
              <div className="p-3.5 bg-red-950/10 border border-red-900/20 rounded-xl space-y-1">
                <span className="text-[8.5px] font-black text-red-400 uppercase tracking-widest block">Weaknesses</span>
                <p className="text-[8px] text-slate-350 leading-relaxed">No brand presence in the university sector yet; long B2B procurement decision loops.</p>
              </div>
              <div className="p-3.5 bg-blue-950/10 border border-blue-900/20 rounded-xl space-y-1">
                <span className="text-[8.5px] font-black text-blue-400 uppercase tracking-widest block">Opportunities</span>
                <p className="text-[8px] text-slate-350 leading-relaxed">Expand into regional compliance workflows; integration with legacy ERP software engines.</p>
              </div>
              <div className="p-3.5 bg-amber-950/10 border border-amber-900/20 rounded-xl space-y-1">
                <span className="text-[8.5px] font-black text-amber-400 uppercase tracking-widest block">Threats</span>
                <p className="text-[8px] text-slate-350 leading-relaxed">Large ERP providers building default AI extensions; state regulations changing data hosting policies.</p>
              </div>
            </div>
          </div>
        );

      case '15 Business Model':
        return (
          <div className="w-full h-full bg-[#090b16] p-5 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div>
              <h3 className="text-sm font-black text-white">Business Model Canvas</h3>
              <p className="text-[9px] text-slate-500">Value prop and customer monetization overview</p>
            </div>
            <div className="grid grid-cols-5 gap-2 flex-1 text-[8px] text-slate-300">
              <div className="p-2 bg-[#0d1024] rounded-lg border border-slate-855 flex flex-col justify-between">
                <span className="font-extrabold text-violet-400 block mb-1">Key Partners</span>
                <span>• Universities<br/>• IT Vendors</span>
              </div>
              <div className="col-span-2 grid grid-rows-2 gap-2">
                <div className="p-2 bg-[#0d1024] rounded-lg border border-slate-855">
                  <span className="font-extrabold text-violet-400 block mb-1">Key Activities</span>
                  <span>RAG data ingestion; compliance checking.</span>
                </div>
                <div className="p-2 bg-[#0d1024] rounded-lg border border-slate-855">
                  <span className="font-extrabold text-violet-400 block mb-1">Key Resources</span>
                  <span>Vector index data models.</span>
                </div>
              </div>
              <div className="p-2 bg-[#0d1024] rounded-lg border border-slate-855 flex flex-col justify-between">
                <span className="font-extrabold text-violet-400 block mb-1">Value Props</span>
                <span>Lower compliance filing cost by 40%.</span>
              </div>
              <div className="p-2 bg-[#0d1024] rounded-lg border border-slate-855 flex flex-col justify-between">
                <span className="font-extrabold text-violet-400 block mb-1">Customer Segments</span>
                <span>• Higher Ed admins<br/>• Compliance auditors</span>
              </div>
            </div>
          </div>
        );

      case '16 Revenue Forecast':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div>
              <h3 className="text-sm font-black text-white">Financial Projections</h3>
              <p className="text-[9px] text-slate-500">5-year revenue and profit margins curve</p>
            </div>
            <div className="bg-[#0c0e1e] rounded-xl p-3 border border-slate-855 flex-1 min-h-[140px]">
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={MOCK_REVENUE_DATA}>
                  <XAxis dataKey="year" stroke="#475569" fontSize={8} />
                  <YAxis stroke="#475569" fontSize={8} />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" fill="#db2777" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case '17 MVP Roadmap':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div>
              <h3 className="text-sm font-black text-white">MVP Product Roadmap</h3>
              <p className="text-[9px] text-slate-500 font-semibold">Phased launch timeline for EduAI Platform</p>
            </div>
            <div className="space-y-3 flex-1 pt-1">
              {[
                { phase: 'Phase 1: Core Engine (M1-M3)', tasks: 'Setup Vector index; upload initial compliance doc databases.' },
                { phase: 'Phase 2: pilot launch (M4-M6)', tasks: 'Partner with 2 pilot colleges; benchmark automated feedback precision.' },
                { phase: 'Phase 3: scaling sales (M7-M12)', tasks: 'Integrate direct email marketing automation; publish case studies.' }
              ].map((p, idx) => (
                <div key={idx} className="p-3 bg-[#0d1024] rounded-xl border border-slate-855">
                  <span className="text-[9px] font-black text-violet-400 block">{p.phase}</span>
                  <p className="text-[8px] text-slate-400 mt-1 leading-snug">{p.tasks}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case '18 Startup Score':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="flex justify-between items-center select-none">
              <div>
                <h3 className="text-sm font-black text-white">Startup Score Radar</h3>
                <p className="text-[9px] text-slate-500 font-semibold">Overall feasibility dimensions rating</p>
              </div>
              <span className="text-lg font-black text-violet-400">88/100</span>
            </div>
            <div className="flex-1 min-h-[140px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="90%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_RADAR_DATA}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" stroke="#475569" fontSize={8} />
                  <Radar name="Score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case '19 Investor Readiness':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="flex justify-between items-center select-none">
              <div>
                <h3 className="text-sm font-black text-white">Investor Qualification</h3>
                <p className="text-[9px] text-slate-500">VC checkups for pre-seed validation</p>
              </div>
              <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[8px] font-extrabold border border-green-500/20 rounded">Investment Ready</span>
            </div>
            <div className="space-y-2 flex-1 pt-2 text-[9px] text-slate-355">
              {[
                { title: 'TAM validation verified', active: true },
                { title: 'SWOT vulnerabilities mapped', active: true },
                { title: 'Financial projection model formulated', active: true },
                { title: 'Legal data compliance checklist', active: false }
              ].map((c, idx) => (
                <div key={idx} className="p-2.5 bg-[#0d1024] rounded-xl border border-slate-855 flex justify-between items-center">
                  <span>{c.title}</span>
                  {c.active ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case '20 AI Suggestions':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div>
              <h3 className="text-sm font-black text-white">AI Mentor Actions</h3>
              <p className="text-[9px] text-slate-500 font-semibold">Actionable advice compiled by Score Agent</p>
            </div>
            <div className="space-y-3 flex-1 pt-1">
              {[
                { hack: 'Procurement hack', desc: 'Provide a free sandbox trial integration model for regional schools to bypass board approval limits.' },
                { hack: 'Security leverage', desc: 'Secure SOC-2 compliance badges immediately; this offsets weakness #2 in B2B reviews.' },
                { hack: 'TAM expansions', desc: 'Target vocational educational centers which have smaller compliance teams.' }
              ].map((s, idx) => (
                <div key={idx} className="p-3 bg-[#0d1024] border border-slate-855 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-violet-400" /> <span className="text-[9.5px] font-black text-white">{s.hack}</span></div>
                  <p className="text-[8px] text-slate-450 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case '21 Chat':
        return (
          <div className="w-full h-full bg-[#090b16] p-4 text-left flex flex-col justify-between select-none">
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 my-2 min-h-[140px] h-[160px]">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`p-2.5 rounded-xl text-[9px] leading-relaxed max-w-[85%] ${m.sender === 'user' ? 'bg-violet-600 text-white ml-auto' : 'bg-[#0d1024] border border-slate-855 text-slate-300'}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2 bg-[#0f1228] p-1.5 rounded-xl border border-slate-855 shrink-0">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-transparent px-2.5 text-[9px] text-white focus:outline-none" />
              <button className="px-3.5 py-1.5 bg-violet-600 rounded-lg text-white text-[8px] font-bold">Send</button>
            </form>
          </div>
        );

      case '22 Reports':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div>
              <h3 className="text-sm font-black text-white">Generated Briefs</h3>
              <p className="text-[9px] text-slate-500 font-semibold">Download formatted intelligence assets</p>
            </div>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {[
                { name: 'Executive validation.pdf', size: '2.4 MB', type: 'PDF' },
                { name: 'pitch_slides_deck.pptx', size: '8.1 MB', type: 'PPTX' },
                { name: 'swot_matrix_detail.xlsx', size: '1.2 MB', type: 'XLSX' },
                { name: 'business_brief.pdf', size: '1.5 MB', type: 'PDF' },
              ].map((r, idx) => (
                <div key={idx} className="p-3 bg-[#0d1024] rounded-xl border border-slate-855 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-violet-500" />
                    <div>
                      <h4 className="text-[9px] font-black text-white truncate max-w-[110px]">{r.name}</h4>
                      <span className="text-[7.5px] text-slate-500 block">{r.size} • {r.type}</span>
                    </div>
                  </div>
                  <Download className="w-3.5 h-3.5 text-slate-400 hover:text-white cursor-pointer" />
                </div>
              ))}
            </div>
          </div>
        );

      case '23 PDF Viewer':
        return (
          <div className="w-full h-full bg-[#090b16] p-3 text-left flex flex-col justify-between select-none">
            <div className="flex justify-between items-center bg-[#0d1024] border border-slate-855 p-2 rounded-lg text-[8px] text-slate-400">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-violet-500" />
                <span>EduAI Executive Report.pdf</span>
              </div>
              <div className="flex gap-2">
                <span>Page 1/4</span>
                <span className="hover:text-white cursor-pointer">Print</span>
              </div>
            </div>
            <div className="flex-1 bg-[#131732]/40 rounded-lg border border-dashed border-slate-800/80 p-4 my-2 overflow-y-auto space-y-3">
              <div className="text-center space-y-1 border-b border-slate-800/80 pb-2">
                <h4 className="text-[10px] font-black text-white uppercase">EduAI Platform Validation Report</h4>
                <p className="text-[7px] text-slate-500">Prepared by IdeaExecutor Analyst Agents</p>
              </div>
              <div className="space-y-1.5 text-[7px] text-slate-400 leading-relaxed">
                <h5 className="font-extrabold text-white uppercase">1. Introduction & Market Sizing</h5>
                <p>Total Addressable Market size (TAM) is estimated at $128.5 Billion. Growth rates average 12.4% YoY.</p>
                <h5 className="font-extrabold text-white uppercase mt-2">2. Competitor Quadrant</h5>
                <p>Direct competitors lack integrated vector RAG models. Pricing structures average $49/mo per administrator seat.</p>
              </div>
            </div>
          </div>
        );

      case '24 PPT Viewer':
        return (
          <div className="w-full h-full bg-[#090b16] p-3 text-left flex flex-col justify-between select-none">
            <div className="flex justify-between items-center bg-[#0d1024] border border-slate-855 p-2 rounded-lg text-[8px] text-slate-400">
              <span>EduAI_PitchDeck.pptx</span>
              <div className="flex gap-1.5">
                <button onClick={() => setSelectedSlide(prev => Math.max(1, prev - 1))} className="px-1.5 py-0.5 bg-slate-855 rounded">Prev</button>
                <span>Slide {selectedSlide}/3</span>
                <button onClick={() => setSelectedSlide(prev => Math.min(3, prev + 1))} className="px-1.5 py-0.5 bg-slate-855 rounded">Next</button>
              </div>
            </div>
            <div className="flex-1 bg-[#0b0c16] rounded-xl border border-slate-800 p-6 my-2 aspect-video flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl" />
              {selectedSlide === 1 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-white leading-tight">EduAI Platform</h4>
                  <p className="text-[8px] text-slate-400">Validate compliance and university workflows using multi-agent intelligence</p>
                </div>
              )}
              {selectedSlide === 2 && (
                <div className="space-y-2">
                  <span className="text-[6.5px] text-pink-500 font-bold uppercase tracking-wider block">The Market Opportunity</span>
                  <h4 className="text-xs font-black text-white leading-tight">$128.5 Billion Total TAM</h4>
                  <p className="text-[7.5px] text-slate-400 leading-relaxed">High demand driven by federal accreditation deadlines and regulatory reports filing cost reduction.</p>
                </div>
              )}
              {selectedSlide === 3 && (
                <div className="space-y-2">
                  <span className="text-[6.5px] text-violet-400 font-bold uppercase tracking-wider block">Startup Scorecard</span>
                  <h4 className="text-xs font-black text-white leading-tight">88 / 100 Overall Validation Score</h4>
                  <p className="text-[7.5px] text-slate-400">High Product-market fit; high technology readiness index score.</p>
                </div>
              )}
              <span className="text-[6px] text-slate-600 block">IdeaExecutor Pitch slide {selectedSlide}</span>
            </div>
          </div>
        );

      case '25 Business Plan':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div>
              <h3 className="text-sm font-black text-white">Full Business Plan</h3>
              <p className="text-[9px] text-slate-500">Detailed text document structured framework</p>
            </div>
            <div className="p-4 bg-[#0d1024] rounded-2xl border border-slate-855 flex-1 overflow-y-auto text-[8.5px] text-slate-350 space-y-3">
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-white text-[10.5px]">Section 1: Executive Summary</h4>
                <p className="leading-relaxed">EduAI Platform is a Software-as-a-Service model designed for administrative university compliance filing. The product automates validation audits, reducing standard university ingestion and verification costs by 40%.</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-white text-[10.5px]">Section 2: Customer Personas</h4>
                <p className="leading-relaxed">Primary targets: Compliance officers at private higher education academies. Average willingness to pay: $2,500/year subscription.</p>
              </div>
            </div>
          </div>
        );

      case '26 History':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="flex justify-between items-center select-none">
              <div>
                <h3 className="text-sm font-black text-white">Validation Log</h3>
                <p className="text-[9px] text-slate-500">History of your previous validation runs</p>
              </div>
              <button className="px-2.5 py-1 bg-slate-855 text-slate-400 text-[8px] rounded hover:text-white font-bold flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Clear History</button>
            </div>
            <div className="space-y-2 flex-1 pt-1">
              {[
                { name: 'EduAI Platform', desc: 'EdTech - Compliance filing audits', score: '88', date: 'Jul 04, 2026' },
                { name: 'FinSmart Bookkeeper', desc: 'Fintech - Invoice RAG matching', score: '62', date: 'Jul 02, 2026' },
                { name: 'GreenEnergy App', desc: 'Energy - Solar grid optimization', score: '76', date: 'Jun 28, 2026' },
              ].map((h, idx) => (
                <div key={idx} className="p-3 bg-[#0d1024] rounded-xl border border-slate-855 flex justify-between items-center">
                  <div>
                    <h4 className="text-[9.5px] font-black text-white">{h.name}</h4>
                    <span className="text-[7.5px] text-slate-550 block mt-0.5">{h.desc}</span>
                  </div>
                  <div className="text-right text-[8px] text-slate-450 space-y-1">
                    <span className="font-bold text-violet-400 block">{h.score} Score</span>
                    <span className="block">{h.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case '27 Notifications':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div>
              <h3 className="text-sm font-black text-white">Notifications</h3>
              <p className="text-[9px] text-slate-500">Real-time validation updates</p>
            </div>
            <div className="space-y-2.5 flex-1 pt-1">
              {[
                { text: 'Market Research Agent finished crawling Higher Ed datasets successfully.', date: '3m ago', unread: true },
                { text: 'New co-founder invitation received from Alex J.', date: '1h ago', unread: false },
                { text: 'SWOT Analysis report for EduAI Platform exported in PDF format.', date: '2h ago', unread: false },
              ].map((n, idx) => (
                <div key={idx} className={`p-3 rounded-xl border flex items-start gap-2.5 ${n.unread ? 'bg-violet-950/10 border-violet-800/40' : 'bg-[#0d1024] border-slate-855'}`}>
                  {n.unread ? (
                    <span className="w-2 h-2 rounded-full bg-violet-500 mt-1 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700 mt-1 shrink-0" />
                  )}
                  <div className="flex-1 space-y-1">
                    <p className="text-[8.5px] text-slate-300 leading-snug">{n.text}</p>
                    <span className="text-[7px] text-slate-550 block">{n.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case '28 Profile':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="flex justify-between items-center select-none">
              <div>
                <h3 className="text-sm font-black text-white">Founder Profile</h3>
                <p className="text-[9px] text-slate-500 font-semibold">Manage account details and roles</p>
              </div>
              <span className="px-2 py-0.5 bg-violet-600 text-white text-[8px] font-extrabold rounded">Pro Member</span>
            </div>
            <div className="p-4 bg-[#0d1024] rounded-2xl border border-slate-855 flex-1 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-violet-100 border-2 border-violet-550 flex items-center justify-center text-2xl shadow-inner">
                👨
              </div>
              <div className="space-y-1 text-[9px] text-slate-400 font-bold">
                <span className="text-white font-black text-xs block">Alex Johnson</span>
                <span className="block mt-0.5">Role: Primary Founder</span>
                <span className="block">Email: alex@startup.io</span>
                <span className="block text-[8px] text-slate-500 font-semibold uppercase tracking-wider mt-1.5">Joined: Jul 04, 2026</span>
              </div>
            </div>
          </div>
        );

      case '29 Settings':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div>
              <h3 className="text-sm font-black text-white">System Configuration</h3>
              <p className="text-[9px] text-slate-500 font-semibold">Manage API keys and developer connections</p>
            </div>
            <div className="space-y-3.5 flex-1 pt-1 text-[8.5px] font-bold text-slate-450">
              <div className="space-y-1">
                <label className="text-[7.5px] text-slate-500 font-black uppercase tracking-wider">Google Gemini API Key</label>
                <input type="password" value="••••••••••••••••••••••••" readOnly className="w-full bg-[#0b0c16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-650 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[7.5px] text-slate-500 font-black uppercase tracking-wider">Chroma Vector Database URL</label>
                <input type="text" value="http://localhost:8000/chromadb" readOnly className="w-full bg-[#0b0c16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-450 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[7.5px] text-slate-500 font-black uppercase tracking-wider">SQLAlchemy Dialect Backend</label>
                <input type="text" value="sqlite:///./startup.db (Local File)" readOnly className="w-full bg-[#0b0c16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-450 focus:outline-none" />
              </div>
            </div>
          </div>
        );

      case '30 Pricing':
        return (
          <div className="w-full h-full bg-[#090b16] p-6 text-left flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="text-center space-y-1 select-none">
              <h3 className="text-sm font-black text-white">Pricing Plans</h3>
              <p className="text-[9px] text-slate-500 font-semibold">Scale co-founding intelligence as you grow</p>
            </div>
            <div className="grid grid-cols-3 gap-2.5 flex-1">
              {[
                { name: 'Standard', price: 'Free', desc: '1 active project', active: false },
                { name: 'Pro Member', price: '$29/mo', desc: 'Unlimited workspaces', active: true },
                { name: 'Enterprise', price: 'Custom', desc: 'Custom database integrations', active: false },
              ].map((plan, idx) => (
                <div key={idx} className={`p-3 rounded-xl border flex flex-col justify-between text-center ${plan.active ? 'bg-violet-950/20 border-violet-800/80 shadow-md shadow-violet-650/5' : 'bg-[#0d1024] border-slate-855'}`}>
                  <div>
                    <span className="text-[8px] text-slate-500 font-bold block">{plan.name}</span>
                    <span className="text-sm font-black text-white block mt-1">{plan.price}</span>
                    <span className="text-[7px] text-slate-400 block mt-1 leading-snug">{plan.desc}</span>
                  </div>
                  <button className={`w-full py-1.5 rounded text-[8px] font-bold mt-2 ${plan.active ? 'bg-violet-600 text-white' : 'bg-slate-850 text-slate-400'}`}>Select</button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Autoscroll/pan to artboard on sidebar click
  const handleSidebarClick = (frameId) => {
    setActiveFrame(frameId);
    if (viewMode === 'canvas') {
      const index = SCREENS.findIndex(s => s.id === frameId);
      if (index !== -1) {
        const columns = 5;
        const row = Math.floor(index / columns);
        const col = index % columns;
        
        // Approximate coordinates in canvas coordinate system
        const cardWidth = 320;
        const cardHeight = 320;
        const gapX = 48;
        const gapY = 64;
        
        const targetX = -(col * (cardWidth + gapX)) * zoomLevel + 200;
        const targetY = -(row * (cardHeight + gapY)) * zoomLevel + 100;
        
        setPanOffset({ x: targetX, y: targetY });
      }
    }
  };

  return (
    <div className="h-screen bg-[#070913] text-slate-100 font-sans flex flex-col overflow-hidden select-none">
      
      {/* Top Figma Style Navigation Bar */}
      <header className="h-14 bg-[#0c0e18] border-b border-slate-800 px-6 flex items-center justify-between z-20 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow shadow-violet-500/20">
            <Rocket className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
              <span>IdeaExecutor Interactive Canvas</span>
              <span className="px-2 py-0.5 rounded bg-violet-600/20 text-violet-400 text-[9px] font-semibold border border-violet-500/10">30 Artboards</span>
            </h1>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-48 hidden sm:block">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
          <input 
            type="text" 
            placeholder="Find artboard..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#12162a] border border-slate-850 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700" 
          />
        </div>

        {/* View mode & Zoom controls */}
        <div className="flex items-center gap-3">
          <div className="flex bg-[#12162a] p-1 rounded-xl border border-slate-850">
            <button 
              onClick={() => setViewMode('canvas')}
              className={`px-3 py-1 text-[11px] font-extrabold rounded-lg flex items-center gap-1.5 transition ${
                viewMode === 'canvas' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Canvas</span>
            </button>
            <button 
              onClick={() => setViewMode('single')}
              className={`px-3 py-1 text-[11px] font-extrabold rounded-lg flex items-center gap-1.5 transition ${
                viewMode === 'single' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Focus Mode</span>
            </button>
          </div>

          <div className="flex items-center bg-[#12162a] rounded-xl border border-slate-850 select-none">
            <button onClick={zoomOut} className="p-2 text-slate-400 hover:text-white" title="Zoom Out"><ZoomOut className="w-3.5 h-3.5" /></button>
            <span className="text-[10px] font-bold text-slate-300 w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
            <button onClick={zoomIn} className="p-2 text-slate-400 hover:text-white" title="Zoom In"><ZoomIn className="w-3.5 h-3.5" /></button>
            <button onClick={resetZoom} className="p-2 text-slate-500 border-l border-slate-850 hover:text-white text-[9px] font-bold" title="Reset Zoom">Fit</button>
          </div>
        </div>
      </header>

      {/* Main Board Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Navigator Sidebar Panel */}
        <aside className="w-64 bg-[#0a0c18] border-r border-slate-855 flex flex-col justify-between shrink-0 select-none">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b border-slate-855 shrink-0">
              <span className="text-[9.5px] uppercase font-black text-slate-500 tracking-wider">Workspace Pages</span>
              <p className="text-[8px] text-slate-600 mt-1 leading-snug">Click an item to focus the canvas camera onto that frame.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-4">
              {['Onboarding & Auth', 'Core Workspace', 'Agentic Analysis', 'Reports & Collaboration', 'Settings & Account'].map(category => {
                const categoryScreens = filteredScreens.filter(s => s.category === category);
                if (categoryScreens.length === 0) return null;
                return (
                  <div key={category} className="space-y-1">
                    <span className="text-[8px] font-black text-violet-400/80 uppercase tracking-widest px-2 block">{category}</span>
                    <div className="space-y-0.5">
                      {categoryScreens.map(frame => (
                        <div 
                          key={frame.id}
                          onClick={() => handleSidebarClick(frame.id)}
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-[10.5px] font-bold flex items-center justify-between cursor-pointer transition ${
                            activeFrame === frame.id ? 'bg-violet-650/15 text-white border border-violet-855/50' : 'text-slate-455 hover:bg-[#121630]/30 hover:text-slate-350'
                          }`}
                        >
                          <span className="truncate">{frame.id}. {frame.title}</span>
                          <span className="text-[7.5px] px-1 bg-slate-800 rounded text-slate-500 uppercase shrink-0 font-semibold">{frame.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-3 bg-[#080911] border-t border-slate-855/50 text-slate-500 text-[8px] text-center font-bold">
            Navigate with mouse drag and zoom controls
          </div>
        </aside>

        {/* Interactive Workspace Canvas */}
        <main 
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex-1 relative overflow-hidden bg-[#070913] ${viewMode === 'canvas' ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
          {/* Real Figma Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

          {viewMode === 'canvas' ? (
            /* --- CANVAS VIEW (PAN/DRAG & SCALE GRID VIEW) --- */
            <div 
              className="absolute left-12 top-12 transition-transform duration-100 ease-out origin-top-left"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`
              }}
            >
              <div className="grid grid-cols-5 gap-x-12 gap-y-16 p-4">
                {SCREENS.map((frame) => {
                  const isActive = activeFrame === frame.id;
                  const isMobile = frame.type === 'mobile';
                  
                  return (
                    <div 
                      key={frame.id} 
                      className={`flex flex-col space-y-2.5 transition ${
                        searchTerm && !frame.id.toLowerCase().includes(searchTerm.toLowerCase()) && !frame.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 'opacity-25' : ''
                      }`}
                    >
                      {/* Frame Header */}
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{frame.id} • {frame.title}</span>
                        <button 
                          onClick={() => focusOnFrame(frame.id)}
                          className="p-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-450 hover:text-white"
                          title="Focus Frame"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Artboard Frame Box with responsive scaling */}
                      <div 
                        onClick={() => setActiveFrame(frame.id)}
                        className={`rounded-3xl border-2 shadow-2xl overflow-hidden cursor-pointer bg-[#090b16] relative transition-all duration-300 ${
                          isActive ? 'border-violet-500 shadow-violet-550/10 -translate-y-1' : 'border-slate-800 hover:border-slate-655'
                        }`}
                        style={{
                          width: isMobile ? '320px' : '480px',
                          height: '320px'
                        }}
                      >
                        {renderScreenMockup(frame.id)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* --- SINGLE ARTBOARD FOCUS VIEW (EXPANDED DETAIL SCREEN) --- */
            <div className="h-full flex items-center justify-center p-8 overflow-y-auto">
              <div className="w-full max-w-4xl bg-[#090b16]/90 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 shadow-2xl backdrop-blur-md relative">
                
                {/* Close Focus View Button */}
                <button 
                  onClick={() => setViewMode('canvas')} 
                  className="absolute right-4 top-4 p-2 bg-slate-855 hover:bg-slate-800 rounded-lg text-slate-450 hover:text-white"
                  title="Close Focus Mode"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>

                {/* Left Detail Description Column */}
                <div className="w-full sm:w-1/3 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="px-2 py-0.5 rounded bg-violet-600/10 text-violet-400 border border-violet-500/10 text-[9px] font-black uppercase tracking-wider">{SCREENS.find(s => s.id === activeFrame)?.category}</span>
                    <h2 className="text-xl font-black text-white">{activeFrame}. {SCREENS.find(s => s.id === activeFrame)?.title}</h2>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">{SCREENS.find(s => s.id === activeFrame)?.desc}</p>
                  </div>

                  <div className="space-y-2 text-[9px] text-slate-550 border-t border-slate-850/60 pt-4">
                    <div className="flex justify-between font-bold"><span>Screen Type:</span> <span className="uppercase text-white">{SCREENS.find(s => s.id === activeFrame)?.type}</span></div>
                    <div className="flex justify-between font-bold"><span>Active Theme:</span> <span className="uppercase text-white">{activeTheme}</span></div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const idx = SCREENS.findIndex(s => s.id === activeFrame);
                        if (idx > 0) setActiveFrame(SCREENS[idx - 1].id);
                      }}
                      className="flex-1 py-2 bg-slate-855 hover:bg-slate-800 text-[10px] font-extrabold rounded-xl"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => {
                        const idx = SCREENS.findIndex(s => s.id === activeFrame);
                        if (idx < SCREENS.length - 1) setActiveFrame(SCREENS[idx + 1].id);
                      }}
                      className="flex-1 py-2 bg-slate-855 hover:bg-slate-800 text-[10px] font-extrabold rounded-xl"
                    >
                      Next
                    </button>
                  </div>
                </div>

                {/* Right Interactive Mockup Container */}
                <div className="flex-1 flex justify-center items-center">
                  <div 
                    className="rounded-3xl border border-slate-800 bg-[#090b16] shadow-2xl overflow-hidden relative shrink-0 transition-all duration-350"
                    style={{
                      width: SCREENS.find(s => s.id === activeFrame)?.type === 'mobile' ? '320px' : '540px',
                      height: '380px'
                    }}
                  >
                    {renderScreenMockup(activeFrame)}
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}
