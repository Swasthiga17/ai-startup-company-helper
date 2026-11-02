import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, KeyRound, Check, X } from 'lucide-react';
import { confirmPasswordReset } from '../services/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Extract token from query parameters (supports both BrowserRouter and HashRouter)
  useEffect(() => {
    let extracted = '';
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      extracted = params.get('token') || '';
    }
    if (!extracted && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      const params = new URLSearchParams(hashQuery);
      extracted = params.get('token') || '';
    }
    setToken(extracted);
    if (!extracted) {
      setError('Missing or invalid password reset token. Please request a new link.');
    }
  }, []);

  // Validation rules
  const checks = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    digit: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*()_\-=[\]{}|;:,.<>?/~`]/.test(newPassword),
    match: newPassword.length > 0 && newPassword === confirmPassword,
  };

  const isFormValid = checks.length && checks.upper && checks.lower && checks.digit && checks.special && checks.match;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Password reset token is missing. Please request a new reset link.');
      return;
    }

    if (!isFormValid) {
      setError('Please satisfy all password security requirements.');
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(token, newPassword);
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || err.userFriendlyMessage || 'Failed to reset password. The link may have expired.';
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

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-[32px] border border-white/90 shadow-[0_20px_60px_-15px_rgba(255,79,163,0.18)] p-6 md:p-8 relative z-10"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 rounded-full text-xs font-black text-slate-800 shadow-sm border border-purple-100">
            <img src="/ideaexecutor_icon.png" alt="IdeaExecutor Logo" className="w-4 h-4 object-contain" />
            <span>IdeaExecutor</span>
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-850 tracking-tight">Set New Password</h2>
        <p className="text-xs text-slate-500 font-medium mt-1 mb-6 leading-relaxed">
          Create a strong, unique password to secure your IdeaExecutor co-founder account.
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200/80 text-rose-600 text-xs font-semibold flex items-start gap-2.5 shadow-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div className="flex-1">
              <span>{error}</span>
              {(error.includes('expired') || error.includes('Invalid') || error.includes('missing')) && (
                <div className="mt-2">
                  <Link to="/forgot-password" className="text-xs font-bold text-[#FF4FA3] hover:underline">
                    Request a new reset link →
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-medium space-y-4 shadow-sm text-left"
          >
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Password Successfully Updated!</span>
            </div>
            <p className="leading-relaxed">
              Your password has been securely changed. You can now log into your IdeaExecutor cofounder workspace.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl shadow-md text-xs flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-white/90 border border-slate-200/90 focus:border-[#FF4FA3] focus:ring-4 focus:ring-pink-100/50 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-[#FF4FA3] transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/90 border border-slate-200/90 focus:border-[#FF4FA3] focus:ring-4 focus:ring-pink-100/50 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition shadow-sm"
                />
              </div>
            </div>

            {/* Password Requirement Checklist */}
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-1.5 text-[11px]">
              <span className="font-bold text-slate-600 block text-[10px] uppercase tracking-wider mb-1">
                Password Requirements
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <div className={`flex items-center gap-1.5 font-medium ${checks.length ? 'text-emerald-650' : 'text-slate-450'}`}>
                  {checks.length ? <Check className="w-3.5 h-3.5 text-emerald-550" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span>8+ characters</span>
                </div>
                <div className={`flex items-center gap-1.5 font-medium ${checks.upper ? 'text-emerald-650' : 'text-slate-450'}`}>
                  {checks.upper ? <Check className="w-3.5 h-3.5 text-emerald-550" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Uppercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 font-medium ${checks.lower ? 'text-emerald-650' : 'text-slate-450'}`}>
                  {checks.lower ? <Check className="w-3.5 h-3.5 text-emerald-550" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Lowercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 font-medium ${checks.digit ? 'text-emerald-650' : 'text-slate-450'}`}>
                  {checks.digit ? <Check className="w-3.5 h-3.5 text-emerald-550" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Number (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 font-medium ${checks.special ? 'text-emerald-650' : 'text-slate-450'}`}>
                  {checks.special ? <Check className="w-3.5 h-3.5 text-emerald-550" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Special character</span>
                </div>
                <div className={`flex items-center gap-1.5 font-medium ${checks.match ? 'text-emerald-650' : 'text-slate-450'}`}>
                  {checks.match ? <Check className="w-3.5 h-3.5 text-emerald-550" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Passwords match</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full py-3.5 bg-gradient-to-r from-[#FF4FA3] via-[#FF3B96] to-[#E6006F] hover:from-[#FF3B96] hover:to-[#D10065] text-white text-xs font-bold rounded-2xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/35 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-slate-500 hover:text-[#FF4FA3] font-semibold transition">
                Back to <span className="text-[#FF4FA3] font-bold underline">Login</span>
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
