import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { FileText, Cpu, CheckCircle2, Copy, Sparkles, Loader } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const docTypes = [
  { id: 'business_plan', name: 'Full Business Plan', desc: 'Detailed business outline and strategy blueprint' },
  { id: 'executive_summary', name: 'Executive Summary', desc: '1-page high-impact pitch summary' },
  { id: 'one_pager', name: 'Investor One Pager', desc: 'Short investment teaser sheet' },
  { id: 'investor_email', name: 'Investor Email Pitch', desc: 'Concise intro to pitch VCs via email' },
  { id: 'cold_email', name: 'Cold Outreach Pitch', desc: 'Outreach template for potential partners' },
  { id: 'linkedin_pitch', name: 'LinkedIn Pitch Template', desc: 'Under 300 character connection invite' },
  { id: 'elevator_pitch', name: 'Elevator Pitch', desc: '30-second spoken pitch format' },
];

export default function DocumentGenerator() {
  const { currentStartup, generateDoc } = useApp();
  
  const [selectedType, setSelectedType] = useState('business_plan');
  const [docContent, setDocContent] = useState('');
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!currentStartup) return;
    setLoadingDoc(true);
    setDocContent('');
    try {
      const idea = currentStartup.idea;
      const res = await generateDoc(selectedType, idea);
      setDocContent(res);
    } catch (e) {
      console.error(e);
      setDocContent('Failed to generate document. Please try again.');
    } finally {
      setLoadingDoc(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(docContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left">
      
      {/* Title Card */}
      <motion.div variants={item} className="rounded-2xl p-6 relative overflow-hidden bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-6 h-6 text-indigo-650" />
          <h2 className="text-xl font-bold text-slate-800">AI Document Generator</h2>
        </div>
        <p className="text-xs text-slate-450 font-semibold">Generate investment teasers, plans, and cold outreach pitch emails dynamically with AI.</p>
      </motion.div>

      {/* Main panel layout */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Type selector */}
        <div className="space-y-3 lg:col-span-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block px-1">Select Document Type</span>
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {docTypes.map((doc) => (
              <div 
                key={doc.id}
                onClick={() => setSelectedType(doc.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedType === doc.id 
                    ? 'border-indigo-500 bg-indigo-50/40 shadow-sm' 
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <span className="text-xs font-bold text-slate-800 block">{doc.name}</span>
                <span className="text-[9px] text-slate-450 mt-1 block font-semibold leading-normal">{doc.desc}</span>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loadingDoc || !currentStartup}
            className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-[#502AF6] to-[#F1358F] text-white text-xs font-black shadow-md hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loadingDoc ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Generate Document</span>
          </button>
        </div>

        {/* Output Area */}
        <div className="lg:col-span-2 flex flex-col justify-between rounded-2xl border border-slate-100 bg-white shadow-sm p-6 min-h-[380px]">
          {loadingDoc ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-indigo-100 blur-xl animate-pulse" />
                <div className="absolute w-16 h-16 rounded-full bg-gradient-to-tr from-[#502AF6] to-[#F1358F] animate-spin opacity-80" />
                <div className="absolute w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-indigo-500 animate-pulse" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-855">AI Drafting in Progress...</h4>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold max-w-xs mx-auto">Gemini is compiling your business variables and writing outline sections.</p>
              </div>
            </div>
          ) : docContent ? (
            <div className="flex flex-col justify-between flex-1 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generated Output</span>
                <button 
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-650 text-[10px] font-bold flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer active:scale-95 transition"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-650" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Clipboard</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                readOnly
                value={docContent}
                className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-semibold text-slate-700 leading-relaxed font-mono resize-none focus:outline-none min-h-[300px]"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Ready to Draft</h4>
              <p className="text-xs text-slate-450 font-semibold max-w-xs leading-relaxed">
                {!currentStartup 
                  ? 'Please select or create a startup project workspace first to enable document creation.' 
                  : 'Select a document type on the left and click Generate to start drafting.'}
              </p>
            </div>
          )}
        </div>

      </motion.div>

    </motion.div>
  );
}
