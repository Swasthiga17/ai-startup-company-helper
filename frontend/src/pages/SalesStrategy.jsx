import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, Mail, MessageSquare, Magnet, GitMerge, 
  Copy, Check, Send, Target, ChevronRight 
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function SalesStrategy() {
  const { analysis } = useApp();
  const [copiedKey, setCopiedKey] = useState(null);

  const sales = analysis?.sales || {
    sales_funnel: [
      "Awareness: Content marketing & social outreach highlighting core operational bottlenecks.",
      "Interest: Live product demos & downloadable ROI benchmark guides.",
      "Decision: 14-day full feature trial or personalized executive call.",
      "Action: Contract closing with automated onboarding playbooks."
    ],
    outreach_emails: [
      {
        subject: "Streamlining your operational workflow with AI",
        body: "Hi {{first_name}},\n\nI noticed you manage operations at {{company}}. Teams in your space often struggle with manual pipeline bottlenecks and high customer friction.\n\nWe built a platform that automates these manual workflows, helping teams save up to 15 hours per week.\n\nWould you be open to a 10-minute demo next Tuesday?\n\nBest regards,\n[Your Name]"
      }
    ],
    cold_messages: [
      "Hi [Name], loved your recent post on industry scaling! We built something to automate the exact bottleneck you mentioned. Would love to connect and share notes."
    ],
    lead_magnets: [
      "Ultimate Industry Benchmark & Efficiency Guide (PDF)",
      "Free Time & Cost Savings ROI Calculator Tool"
    ],
    crm_workflow: [
      "Lead Captured -> Auto-send welcome resources -> Trigger manual LinkedIn connect -> Book discovery call -> Demo -> Follow-up proposal -> Close."
    ]
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left pb-12">
      
      {/* Header */}
      <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Sales Strategy & Outreach</h1>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">Multi-stage sales funnel, cold email copy, lead magnets, and CRM lead progression.</p>
        </div>
      </motion.div>

      {/* Sales Funnel */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600" />
          <span>Sales Funnel Architecture</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {sales.sales_funnel?.map((step, idx) => {
            const parts = step.split(':');
            const stageName = parts[0] || `Stage ${idx + 1}`;
            const description = parts[1] || step;

            return (
              <div key={idx} className="relative p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                      Step 0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-800">{stageName}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">{description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Cold Email Outreach Templates */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
          <Mail className="w-4 h-4 text-emerald-600" />
          <span>Ready-to-Use Outbound Email Templates</span>
        </h2>
        <div className="space-y-4">
          {sales.outreach_emails?.map((email, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Subject</span>
                  <p className="text-xs font-bold text-slate-800">{email.subject}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(`Subject: ${email.subject}\n\n${email.body}`, `email-${idx}`)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-200 flex items-center gap-1.5 transition-all shadow-xs"
                >
                  {copiedKey === `email-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === `email-${idx}` ? 'Copied' : 'Copy Template'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-slate-600 whitespace-pre-wrap leading-relaxed">
                {email.body}
              </pre>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Social Messages & Lead Magnets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Cold Social Messages */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-600" />
              <span>LinkedIn / DM Messages</span>
            </h2>
            <div className="space-y-3">
              {sales.cold_messages?.map((msg, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">{msg}</p>
                  <button 
                    onClick={() => copyToClipboard(msg, `dm-${idx}`)}
                    className="text-slate-400 hover:text-indigo-600 shrink-0"
                  >
                    {copiedKey === `dm-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Lead Magnets */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
              <Magnet className="w-4 h-4 text-pink-600" />
              <span>Lead Magnet Concepts</span>
            </h2>
            <div className="space-y-3">
              {sales.lead_magnets?.map((magnet, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center gap-3">
                  <span className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                    <Send className="w-4 h-4" />
                  </span>
                  <p className="text-xs font-bold text-slate-800">{magnet}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* CRM Workflow */}
      <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-purple-600" />
          <span>Recommended CRM Pipeline</span>
        </h2>
        <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 font-mono text-xs text-indigo-700 font-semibold leading-relaxed">
          {sales.crm_workflow?.map((wf, idx) => (
            <div key={idx}>{wf}</div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
