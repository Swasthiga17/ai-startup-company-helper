import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Sparkles, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function PushToast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: CheckCircle2,
    warning: AlertTriangle,
    info: Info,
    default: Sparkles
  };

  const colors = {
    success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300',
    warning: 'bg-amber-950/90 border-amber-500/50 text-amber-300',
    info: 'bg-blue-950/90 border-blue-500/50 text-blue-300',
    default: 'bg-purple-950/90 border-purple-500/50 text-pink-300'
  };

  const IconComp = icons[toast.type] || icons.default;
  const colorClass = colors[toast.type] || colors.default;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`fixed top-5 right-5 z-50 max-w-sm w-full p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${colorClass} flex items-start gap-3.5`}
      >
        <div className="p-2 rounded-xl bg-white/10 shrink-0">
          <IconComp className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-black tracking-wide uppercase flex items-center justify-between">
            <span>{toast.title || 'Push Notification'}</span>
            <span className="text-[10px] opacity-60 font-mono">Just now</span>
          </h4>
          <p className="text-xs font-semibold mt-1 opacity-90 leading-snug">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition text-current opacity-70 hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
