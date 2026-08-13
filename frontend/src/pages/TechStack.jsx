import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Cpu, Layout, Server, Database, Key, Cloud,
  Bot, CreditCard, Terminal, CheckCircle
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function TechStack() {
  const { analysis } = useApp();

  const tech = analysis?.tech_stack || {
    frontend: ["React 18", "Vite", "Tailwind CSS", "Framer Motion"],
    backend: ["FastAPI", "Python 3.10", "Uvicorn"],
    database: ["PostgreSQL", "ChromaDB (Vector Search)", "Redis"],
    auth: ["JWT (JSON Web Tokens)", "Google OAuth 2.0"],
    cloud: ["AWS (ECS & S3)", "Vercel"],
    ai: ["Google Gemini Pro API", "LangGraph", "LangChain"],
    apis: ["Stripe (Payments)", "SendGrid (Emails)"],
    devops: ["Docker", "GitHub Actions (CI/CD)"]
  };

  const categories = [
    { title: "Frontend Architecture", icon: Layout, color: "text-blue-600", bg: "bg-blue-50", items: tech.frontend },
    { title: "Backend API Framework", icon: Server, color: "text-emerald-600", bg: "bg-emerald-50", items: tech.backend },
    { title: "Database & Vector Store", icon: Database, color: "text-purple-600", bg: "bg-purple-50", items: tech.database },
    { title: "Authentication & Security", icon: Key, color: "text-amber-600", bg: "bg-amber-50", items: tech.auth },
    { title: "Cloud & Hosting Infrastructure", icon: Cloud, color: "text-cyan-600", bg: "bg-cyan-50", items: tech.cloud },
    { title: "AI Models & Multi-Agent Orchestration", icon: Bot, color: "text-indigo-600", bg: "bg-indigo-50", items: tech.ai },
    { title: "Third-Party APIs & Services", icon: CreditCard, color: "text-pink-600", bg: "bg-pink-50", items: tech.apis },
    { title: "DevOps & CI/CD Pipelines", icon: Terminal, color: "text-slate-700", bg: "bg-slate-100", items: tech.devops }
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-12">

      {/* Header */}
      <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Cpu className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Technology Stack & Architecture</h1>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">Recommended technical stack tailored for scalability, performance, and rapid execution.</p>
        </div>
      </motion.div>

      {/* Tech Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => {
          const IconComp = cat.icon;
          return (
            <motion.div
              key={idx}
              variants={item}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`p-2.5 rounded-2xl ${cat.bg} ${cat.color}`}>
                    <IconComp className="w-5 h-5" />
                  </span>
                  <h2 className="text-xs font-black text-slate-800 tracking-tight leading-tight">{cat.title}</h2>
                </div>

                <div className="space-y-2">
                  {cat.items?.map((tool, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 bg-slate-50/60">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-xs font-bold text-slate-700">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Database Schema Generator & API Planner */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* SQL Schema Generator */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-extrabold flex items-center gap-2 text-indigo-400">
              <Database className="w-4 h-4" />
              <span>Automated Database Schema (PostgreSQL)</span>
            </h3>
            <button
              onClick={() => navigator.clipboard?.writeText(analysis?.db_schema?.sql || '')}
              className="text-[10px] font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/40 transition"
            >
              Copy SQL
            </button>
          </div>

          <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-2xl overflow-x-auto border border-slate-800/80 leading-relaxed max-h-72">
            {analysis?.db_schema?.sql || `-- Database Schema for Startup Platform
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE startups (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  idea_summary TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analyses (
  id SERIAL PRIMARY KEY,
  startup_id INT REFERENCES startups(id),
  payload JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
          </pre>
        </div>

        {/* API Planner */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <h3 className="text-sm font-extrabold flex items-center gap-2 text-slate-800">
              <Terminal className="w-4 h-4 text-purple-600" />
              <span>API Endpoint Specification</span>
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full border border-purple-100">
              REST / FastAPI
            </span>
          </div>

          <div className="space-y-3">
            {(analysis?.api_planner || [
              { method: 'POST', endpoint: '/api/v1/auth/login', description: 'Authenticate user & issue JWT token' },
              { method: 'POST', endpoint: '/api/v1/analyze', description: 'Run multi-agent AI execution pipeline' },
              { method: 'GET', endpoint: '/api/v1/workspaces', description: 'Retrieve active founder startup projects' }
            ]).map((api, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${api.method === 'POST' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {api.method}
                  </span>
                  <code className="text-xs font-mono font-bold text-slate-800">{api.endpoint}</code>
                </div>
                <span className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{api.description}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}

