import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, Rocket, Globe,
  Search, BarChart2, Target, Layers, FileText, Code2,
  Bot, Zap, ChevronRight
} from 'lucide-react';
import './BuildSphereOnboarding.css';

/* ─────────────────────────────── DATA ──────────────────────────────── */
const SCREENS = [
  {
    id: 1,
    badge: '✨ Step 01 / 03 — Market Research',
    heading: ['Validate your vision', 'with AI precision.'],
    sub: 'Stop guessing. Run real-time market sentiment analysis, competitor research, and feasibility checks before writing a single line of code.',
    btnLabel: 'Next: Strategy & Planning',
    chips: ['AI Sentiment Analysis', 'Competitor Research', 'Feasibility Check'],
    theme: 'screen1',
  },
  {
    id: 2,
    badge: '✨ Step 02 / 03 — Execution Engine',
    heading: ['Generate roadmaps and', 'financial models in minutes.'],
    sub: 'Turn validated concepts into investor-ready pitch decks, dynamic business model canvases, and automated MVP execution paths.',
    btnLabel: 'Next: Scaling & AI Guidance',
    chips: ['Pitch Deck Generator', 'BMC Builder', 'MVP Planner'],
    theme: 'screen2',
  },
  {
    id: 3,
    badge: '✨ Step 03 / 03 — Continuous Growth',
    heading: ['Scale globally with your', 'AI Co-Founder.'],
    sub: 'Track live analytics, automate key operations, and unlock international growth tools—all inside one integrated business ecosystem.',
    btnLabel: null,
    chips: ['Live Analytics', 'Global Reach', 'AI Co-Founder'],
    theme: 'screen3',
  },
];

/* ─────────────────────────── ORBIT NODE ────────────────────────────── */
function OrbitNode({ angle, delay, children, theme }) {
  const rad = (angle * Math.PI) / 180;
  const r = 148;
  const x = Math.cos(rad) * r;
  const y = Math.sin(rad) * r;
  return (
    <motion.div
      className={`bs-orbit-node bs-orbit-node--${theme}`}
      style={{ left: `calc(50% + ${x}px - 18px)`, top: `calc(50% + ${y}px - 18px)` }}
      animate={{ scale: [1, 1.18, 1], opacity: [0.65, 1, 0.65] }}
      transition={{ duration: 2.8, repeat: Infinity, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────── GLOW SPHERE ───────────────────────────── */
function GlowSphere({ theme }) {
  const nodeIcons = [
    <Search size={13} />, <BarChart2 size={13} />, <Target size={13} />,
    <Globe size={13} />, <Zap size={13} />,
  ];
  return (
    <div className="bs-sphere-wrap">
      <div className={`bs-sphere bs-sphere--${theme}`}>
        <div className="bs-sphere__ring bs-sphere__ring--1" />
        <div className="bs-sphere__ring bs-sphere__ring--2" />
        <div className="bs-sphere__ring bs-sphere__ring--3" />
        <div className="bs-sphere__core">
          <Sparkles size={32} />
        </div>
      </div>
      {nodeIcons.map((icon, i) => (
        <OrbitNode key={i} angle={i * 72} delay={i * 0.4} theme={theme}>
          {icon}
        </OrbitNode>
      ))}
    </div>
  );
}

/* ──────────────────── SCREEN 1 RIGHT PANEL ─────────────────────────── */
function Screen1Right() {
  const [liveVal, setLiveVal] = useState(72);
  useEffect(() => {
    const t = setInterval(() => {
      setLiveVal(v => {
        const n = v + (Math.random() - 0.48) * 4;
        return Math.min(95, Math.max(60, n));
      });
    }, 1800);
    return () => clearInterval(t);
  }, []);

  const bars = [88, 74, 92, 65, 83, 78, 95, 70];

  return (
    <div className="bs-right bs-right--screen1">
      {/* Hero image */}
      <div className="bs-hero-img-wrap">
        <img src="/onboarding-screen1.png" alt="Market Research Visual" className="bs-hero-img" />
        <div className="bs-hero-img-overlay" />
      </div>

      {/* Idea Score Card */}
      <motion.div
        className="bs-overlay bs-card-score"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bs-card-label">💡 Idea Score</div>
        <div className="bs-card-big">88<span>/100</span></div>
        <div className="bs-tag bs-tag--green">High Potential</div>
      </motion.div>

      {/* Market Sentiment Gauge */}
      <motion.div
        className="bs-overlay bs-card-sentiment"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="bs-card-label">📊 Market Sentiment</div>
        <div className="bs-bar-row">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="bs-bar"
              animate={{ scaleY: [0.6, 1, 0.75] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.18 }}
              style={{ '--bh': `${h}%` }}
            />
          ))}
        </div>
        <div className="bs-card-sub">Live Demand · {Math.round(liveVal)}% Growth</div>
      </motion.div>

      {/* Competitor Search Node */}
      <motion.div
        className="bs-overlay bs-card-search"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Search size={16} className="bs-icon-search" />
        <span>Competitor Scan</span>
        <div className="bs-tag bs-tag--purple">12 Analyzed</div>
      </motion.div>
    </div>
  );
}

/* ──────────────────── SCREEN 2 RIGHT PANEL ─────────────────────────── */
function Screen2Right() {
  const chartPts = [30, 55, 45, 78, 65, 95, 82, 110, 98, 135];
  const maxPt = 140;
  const W = 200, H = 80;
  const ptStr = chartPts.map((v, i) =>
    `${(i / (chartPts.length - 1)) * W},${H - (v / maxPt) * H}`
  ).join(' ');
  const fillStr = [
    ...chartPts.map((v, i) => `${(i / (chartPts.length - 1)) * W},${H - (v / maxPt) * H}`),
    `${W},${H}`, `0,${H}`
  ].join(' ');

  return (
    <div className="bs-right bs-right--screen2">
      {/* Hero image */}
      <div className="bs-hero-img-wrap">
        <img src="/onboarding-screen2.png" alt="Execution Engine Visual" className="bs-hero-img" />
        <div className="bs-hero-img-overlay" />
      </div>
      <div className="bs-blueprint-grid" />

      {/* Revenue Chart */}
      <motion.div
        className="bs-overlay bs-card-revenue"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bs-card-label">💰 Revenue Projection</div>
        <svg width={W} height={H} style={{ overflow: 'visible', display: 'block', marginBottom: 6 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={fillStr} fill="url(#revFill)" />
          <polyline
            points={ptStr}
            fill="none"
            stroke="url(#revGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="bs-card-big bs-card-big--sm">+$2.45M</div>
        <div className="bs-card-sub">Projected Growth ↑</div>
      </motion.div>

      {/* Business Model Canvas */}
      <motion.div
        className="bs-overlay bs-card-canvas"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bs-card-label">📋 Business Model Canvas</div>
        {['Value Prop', 'Key Metrics', 'Revenue Streams', 'Cost Structure'].map((t, i) => (
          <motion.div
            key={t}
            className="bs-canvas-row"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.12 }}
          >
            <div className="bs-canvas-dot" />
            <span>{t}</span>
            <div className="bs-canvas-fill" style={{ '--cw': `${[85, 72, 90, 68][i]}%` }} />
          </motion.div>
        ))}
      </motion.div>

      {/* Floating Code Block */}
      <motion.div
        className="bs-orbit-block bs-block-code"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <Code2 size={14} /><span>&lt;/&gt;</span>
      </motion.div>

      {/* Pitch Deck Block */}
      <motion.div
        className="bs-orbit-block bs-block-doc"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      >
        <FileText size={14} /><span>Pitch Deck</span>
      </motion.div>
    </div>
  );
}

/* ──────────────────── SCREEN 3 RIGHT PANEL ─────────────────────────── */
function Screen3Right() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let c = 0;
    const t = setInterval(() => {
      c += 6;
      setCount(Math.min(c, 150));
      if (c >= 150) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, []);

  const suggestions = [
    'Expand to Southeast Asia markets →',
    'Automate onboarding funnel ↗',
    'A/B test pricing tiers 🔬',
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % suggestions.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bs-right bs-right--screen3">
      {/* Hero image */}
      <div className="bs-hero-img-wrap">
        <img src="/onboarding-screen3.png" alt="Launch & Scale Visual" className="bs-hero-img" />
        <div className="bs-hero-img-overlay bs-hero-img-overlay--screen3" />
      </div>

      {/* Global Analytics */}
      <motion.div
        className="bs-overlay bs-card-globe"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bs-card-label"><Globe size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Global Analytics</div>
        <div className="bs-card-big">{count}<span>+</span></div>
        <div className="bs-card-sub">Countries · Live Active Users</div>
        <div className="bs-globe-dots">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="bs-globe-dot"
              style={{ left: `${(i * 37 + 10) % 88}%`, top: `${(i * 53 + 15) % 75}%` }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.4, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Astronaut from the image, add floating animation overlay */}
      <div className="bs-sphere-scene">
        <motion.div
          className="bs-astronaut-float"
          animate={{ y: [0, -14, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🧑‍🚀
        </motion.div>
        <motion.div
          className="bs-astronaut"
          animate={{ y: [0, -14, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🧑‍🚀
        </motion.div>
      </div>

      {/* AI Co-Founder Panel */}
      <motion.div
        className="bs-overlay bs-card-ai"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bs-card-label"><Bot size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> AI Co-Founder</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            className="bs-ai-bubble"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            {suggestions[idx]}
          </motion.div>
        </AnimatePresence>
        <div className="bs-ai-dots">
          {suggestions.map((_, i) => (
            <div key={i} className={`bs-ai-dot ${i === idx ? 'active' : ''}`} />
          ))}
        </div>
      </motion.div>

      {/* Rocket */}
      <motion.div
        className="bs-rocket"
        animate={{ x: [0, 70, 140], y: [0, -40, -90], opacity: [1, 1, 0], scale: [1, 1.2, 0.8] }}
        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2.5 }}
      >
        <Rocket size={22} />
      </motion.div>
    </div>
  );
}

/* ────────────────────── PROGRESS DOTS ──────────────────────────────── */
function ProgressDots({ current }) {
  return (
    <div className="bs-prog-dots">
      {[1, 2, 3].map(i => (
        <div key={i} className={`bs-prog-dot ${i === current ? 'active' : ''}`} />
      ))}
    </div>
  );
}

/* ─────────────────────────── MAIN ──────────────────────────────────── */
const slideVariants = {
  enter: d => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: d => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
};

export default function BuildSphereOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);

  const goNext = () => {
    if (step < 3) {
      setDir(1);
      setStep(s => s + 1);
    } else {
      localStorage.setItem('has_seen_onboarding', 'true');
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/input');
      } else {
        navigate('/register');
      }
    }
  };

  const goSkip = () => {
    localStorage.setItem('has_seen_onboarding', 'true');
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/input');
    } else {
      navigate('/login');
    }
  };

  const screen = SCREENS[step - 1];
  const rightPanels = [<Screen1Right />, <Screen2Right />, <Screen3Right />];

  return (
    <div className="bs-root">
      {/* ── Header ── */}
      <header className="bs-header">
        <div className="bs-logo">
          <img src="/ideaexecutor_icon_white.png" alt="IdeaExecutor Logo" className="w-7 h-7 object-contain drop-shadow-md" />
          <span className="bs-logo-text">IDEAEXECUTOR</span>
        </div>
        <button className="bs-skip" onClick={goSkip}>
          Skip to App <ArrowRight size={14} />
        </button>
      </header>

      {/* ── Body ── */}
      <main className="bs-body">

        {/* LEFT */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={`left-${step}`}
            className={`bs-left bs-left--${screen.theme}`}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.44, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div className="bs-badge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
              {screen.badge}
            </motion.div>

            <motion.h1 className="bs-heading" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
              {screen.heading[0]}<br /><span className="bs-heading-accent">{screen.heading[1]}</span>
            </motion.h1>

            <motion.p className="bs-subtext" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
              {screen.sub}
            </motion.p>

            <motion.div className="bs-chips" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.44 }}>
              {screen.chips.map(c => <span key={c} className="bs-chip">{c}</span>)}
            </motion.div>

            <div className="bs-footer">
              <ProgressDots current={step} />
              <div className="bs-actions">
                {screen.btnLabel ? (
                  <button className="bs-btn-next" onClick={goNext}>
                    {screen.btnLabel} <ChevronRight size={17} />
                  </button>
                ) : (
                  <div className="bs-cta-group">
                    <button className="bs-btn-launch" onClick={goNext}>
                      <Rocket size={17} /> Start Building Free
                    </button>
                    <button className="bs-link-login" onClick={() => navigate('/login')}>
                      Already have an account? Log In
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        </AnimatePresence>

        {/* RIGHT */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={`right-${step}`}
            className="bs-right-wrap"
            custom={dir}
            variants={{
              enter: d => ({ x: d > 0 ? 120 : -120, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: d => ({ x: d > 0 ? -120 : 120, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {rightPanels[step - 1]}
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
}
