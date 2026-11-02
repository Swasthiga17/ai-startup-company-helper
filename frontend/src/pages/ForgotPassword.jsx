import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { requestPasswordReset } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      // In case of rate limiting (429) or connection error
      const msg = err.response?.data?.error || err.response?.data?.detail || err.userFriendlyMessage || 'Unable to submit request. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F6] via-[#FCE7F3] to-[#FBCFE8] text-slate-800 flex justify-center items-center relative overflow-hidden font-sans p-4 md:p-8 select-none">
      {/* Background Ambient Blur */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-white/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-[32px] border border-white/90 shadow-[0_20px_60px_-15px_rgba(255,79,163,0.18)] p-6 md:p-8 relative z-10"
      >
        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            to="/login"
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-600 hover:text-[#FF4FA3] transition border border-pink-100 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 rounded-full text-xs font-black text-slate-800 shadow-sm border border-purple-100">
            <img src="/ideaexecutor_icon.png" alt="IdeaExecutor Logo" className="w-4 h-4 object-contain" />
            <span>IdeaExecutor</span>
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-850 tracking-tight">Forgot Password?</h2>
        <p className="text-xs text-slate-500 font-medium mt-1 mb-6 leading-relaxed">
          Enter your registered email address and we'll send you secure instructions to reset your password.
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200/80 text-rose-600 text-xs font-semibold flex items-start gap-2.5 shadow-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </motion.div>
        )}

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-medium space-y-3 shadow-sm text-left"
          >
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Recovery Link Dispatched</span>
            </div>
            <p className="leading-relaxed">
              If an account with that email exists, password reset instructions have been sent. Please check your inbox and spam folder.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4FA3] hover:underline"
              >
                <span>Return to Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@startup.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/90 border border-slate-200/90 focus:border-[#FF4FA3] focus:ring-4 focus:ring-pink-100/50 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#FF4FA3] via-[#FF3B96] to-[#E6006F] hover:from-[#FF3B96] hover:to-[#D10065] text-white text-xs font-bold rounded-2xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/35 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-slate-500 hover:text-[#FF4FA3] font-semibold transition">
                Remember your password? <span className="text-[#FF4FA3] font-bold underline">Log In</span>
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
