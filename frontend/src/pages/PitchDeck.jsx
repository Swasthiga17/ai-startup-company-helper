import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Presentation, Download, Eye, Share2, FileText, Image, Video, Loader2 } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const defaultSlides = [
  { title: 'Problem', desc: 'The problem your startup solves', icon: '🎯' },
  { title: 'Solution', desc: 'Your unique value proposition', icon: '💡' },
  { title: 'Market', desc: 'TAM/SAM/SOM analysis', icon: '📊' },
  { title: 'Product', desc: 'Key features and demo', icon: '🚀' },
  { title: 'Business Model', desc: 'Revenue streams and pricing', icon: '💰' },
  { title: 'Competition', desc: 'Competitive landscape', icon: '⚔️' },
  { title: 'Team', desc: 'Core team members', icon: '👥' },
  { title: 'Financials', desc: 'Revenue projections', icon: '📈' },
  { title: 'Ask', desc: 'Funding requirements', icon: '🤝' },
  { title: 'Contact', desc: 'Get in touch', icon: '📧' },
];

export default function PitchDeck() {
  const { analysis, downloadPptx, downloadPdf } = useApp();
  const [downloadingPpt, setDownloadingPpt] = useState(false);
  const [downloadingPdfState, setDownloadingPdfState] = useState(false);

  const handleDownloadPptx = async () => {
    setDownloadingPpt(true);
    try {
      await downloadPptx();
    } finally {
      setDownloadingPpt(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdfState(true);
    try {
      await downloadPdf();
    } finally {
      setDownloadingPdfState(false);
    }
  };

  const slides = analysis?.pitch?.slides || defaultSlides;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left">
      {/* Header */}
      <motion.div variants={item} className="rounded-2xl p-6 relative overflow-hidden bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Presentation className="w-6 h-6 text-fuchsia-500" />
              <h2 className="text-xl font-bold text-slate-800">
                Pitch Deck Presentation
              </h2>
            </div>
            <p className="text-xs text-slate-450 font-semibold">Investor-ready presentation slides & executive report export</p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadPdf}
              disabled={downloadingPdfState}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {downloadingPdfState ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 text-violet-600" />}
              <span>Download PDF</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadPptx}
              disabled={downloadingPpt}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#502AF6] to-[#F1358F] text-white text-xs font-bold shadow-md shadow-violet-500/20 hover:brightness-105 transition-all cursor-pointer disabled:opacity-50"
            >
              {downloadingPpt ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Download PPTX</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Slides Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {slides.map((slide, i) => (
          <motion.div key={i} whileHover={{ y: -4, scale: 1.02 }}
            className="rounded-2xl p-4 bg-white border border-slate-100 shadow-sm cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="aspect-video rounded-xl flex items-center justify-center mb-3 relative overflow-hidden bg-slate-50 border border-slate-150 p-3 text-center">
                <span className="text-3xl mb-1">{slide.icon || '📌'}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                      <Eye className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Slide {i + 1}</p>
                <h4 className="text-sm font-extrabold text-slate-800 leading-tight">{slide.title}</h4>
                {slide.content && (
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed mt-1">
                    {slide.content}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Slides', value: `${slides.length} Slides`, icon: FileText, color: 'text-purple-600 bg-purple-50' },
          { label: 'Est. Duration', value: '15 min', icon: Video, color: 'text-indigo-650 bg-indigo-50' },
          { label: 'Export Options', value: 'PPTX & PDF', icon: Image, color: 'text-emerald-600 bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl p-4 bg-white border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
                style={{ background: stat.color.includes('purple') ? '#F5F3FF' : stat.color.includes('indigo') ? '#EEF2FF' : '#ECFDF5' }}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-base font-extrabold text-slate-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}