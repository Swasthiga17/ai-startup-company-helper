import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Copy, Check, Palette, Globe, Flame, 
  Lightbulb, Compass, Award 
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function BrandCreation() {
  const { analysis } = useApp();
  const [copiedText, setCopiedText] = useState(null);

  const brand = analysis?.brand || {
    company_names: ["NovaStart", "ApexPulse", "LaunchFlow", "BuildScale"],
    taglines: [
      "Unleash the power of modern innovation.",
      "The future of automation starts here.",
      "Scale faster with intelligence."
    ],
    mission: "To democratize and streamline operations using cutting edge AI technology.",
    vision: "To be the leading global platform powering the next generation of scalable tools.",
    brand_voice: "Professional, authoritative, yet approachable and highly innovative.",
    colors: ["#4F46E5", "#06B6D4", "#1E293B", "#F59E0B"],
    logo_ideas: [
      "A stylized geometric symbol combining a rocket and a cloud node.",
      "An abstract infinity loop merging into a spark / star icon.",
      "Minimalist clean wordmark with a glowing accent dot on the letter 'i'."
    ],
    domain_suggestions: ["getnovastart.com", "joinapex.io", "launchflow.ai", "buildscale.co"]
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-12">
      
      {/* Header */}
      <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Brand Creation & Identity</h1>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">AI-generated naming, mission, vision, logo concepts, and visual design assets.</p>
        </div>
      </motion.div>

      {/* Recommended Company Names */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Generated Startup Names</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {brand.company_names?.map((name, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-200 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-500 tracking-wider">Option {idx + 1}</span>
                <p className="text-xl font-black text-slate-800 group-hover:text-indigo-600 mt-1">{name}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(name, `name-${idx}`)}
                className="mt-4 text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 self-start"
              >
                {copiedText === `name-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText === `name-${idx}` ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Domain Suggestions & Taglines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Domain Suggestions */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-500" />
              <span>Domain Name Ideas</span>
            </h2>
            <div className="space-y-3">
              {brand.domain_suggestions?.map((domain, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                  <span className="font-mono text-xs font-bold text-slate-700">{domain}</span>
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Available Idea
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Taglines */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Catchy Taglines</span>
            </h2>
            <div className="space-y-3">
              {brand.taglines?.map((tagline, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-700 italic">"{tagline}"</p>
                  <button 
                    onClick={() => copyToClipboard(tagline, `tagline-${idx}`)}
                    className="text-slate-400 hover:text-indigo-600 shrink-0"
                  >
                    {copiedText === `tagline-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Brand Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={item} className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-5 h-5 opacity-80" />
            <h3 className="text-xs uppercase font-extrabold tracking-wider opacity-80">Brand Mission</h3>
          </div>
          <p className="text-base font-bold leading-relaxed">{brand.mission}</p>
        </motion.div>

        <motion.div variants={item} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-cyan-400">Brand Vision</h3>
          </div>
          <p className="text-base font-bold leading-relaxed">{brand.vision}</p>
        </motion.div>
      </div>

      {/* Visual Identity: Color Palette & Logo Ideas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Colors */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600" />
            <span>Recommended Brand Palette</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {brand.colors?.map((col, idx) => {
              const hex = col.split(' ')[0];
              return (
                <div key={idx} className="p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                  <div 
                    className="w-full h-12 rounded-xl mb-2 shadow-inner border border-slate-200" 
                    style={{ backgroundColor: hex }} 
                  />
                  <span className="text-xs font-mono font-bold text-slate-700">{hex}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Logo Ideas */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Logo Design Concepts</span>
          </h2>
          <div className="space-y-3">
            {brand.logo_ideas?.map((idea, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs font-medium text-slate-700 mt-0.5">{idea}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
