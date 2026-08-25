import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Search, Eye, BarChart3, Briefcase, Wrench, DollarSign, Rocket, Mic } from 'lucide-react';

export default function AICofounderTeam() {
  const navigate = useNavigate();

  const team = [
    { name: "Strategy AI", icon: Brain, emoji: "🧠", role: "Business strategy & positioning", path: "/analysis" },
    { name: "Market AI", icon: Search, emoji: "🔎", role: "Market research & validation", path: "/market" },
    { name: "Competitor AI", icon: Eye, emoji: "🕵️", role: "Competitor intelligence", path: "/competitors" },
    { name: "SWOT AI", icon: BarChart3, emoji: "📊", role: "Risk & opportunity analysis", path: "/swot" },
    { name: "Business AI", icon: Briefcase, emoji: "💼", role: "Business model & pricing", path: "/business" },
    { name: "Product AI", icon: Wrench, emoji: "🛠️", role: "MVP & product roadmap", path: "/roadmap" },
    { name: "Finance AI", icon: DollarSign, emoji: "💰", role: "Revenue & financial scenarios", path: "/revenue" },
    { name: "Growth AI", icon: Rocket, emoji: "🚀", role: "Customer acquisition & scaling", path: "/marketing" },
    { name: "Investor AI", icon: Mic, emoji: "🎤", role: "Pitch deck & investor prep", path: "/pitchdeck" }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            Virtual Founding Team
          </div>
          <h3 className="text-2xl font-bold text-white">Your AI Co-Founder Suite</h3>
        </div>
        <div className="text-xs text-slate-400 max-w-xs text-right hidden sm:block">
          "I don't have to build the startup alone. I have an AI founding team."
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {team.map((member, idx) => (
          <div
            key={idx}
            onClick={() => navigate(member.path)}
            className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group flex items-start gap-3"
          >
            <div className="text-2xl bg-slate-900 p-2 rounded-lg border border-slate-800 group-hover:scale-105 transition-transform">
              {member.emoji}
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm group-hover:text-indigo-300 transition-colors">
                {member.name}
              </h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
