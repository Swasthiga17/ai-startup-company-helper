import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, ArrowRight, Lightbulb, Target, TrendingUp } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const checkHistory = async () => {
        try {
          const histResp = await fetch(`${import.meta.env.VITE_API_URL || ''}/history`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (histResp.ok) {
            const histData = await histResp.json();
            if (histData.data && histData.data.length > 0) {
              navigate('/dashboard');
              return;
            }
          }
        } catch { }
        navigate('/onboarding');
      };
      checkHistory();
    }
  }, [navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return;

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || ''}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try {
        data = await resp.json();
      } catch { }

      if (!resp.ok) throw new Error(data?.detail || `Login failed (${resp.status})`);

      localStorage.setItem('token', data.access_token);
      navigate('/onboarding');
    } catch (err) {
      setError(err?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F6] via-[#FCE7F3] to-[#FBCFE8] text-slate-800 flex justify-center items-center relative overflow-hidden font-sans p-4 md:p-8 select-none">
      {/* Background Ambient Blur */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-white/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Container Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[960px] bg-white/75 backdrop-blur-2xl rounded-[32px] border border-white/90 shadow-[0_20px_60px_-15px_rgba(255,79,163,0.15)] overflow-hidden flex flex-col md:flex-row p-3 md:p-4 gap-4 relative z-10"
      >
        {/* Left Hero & 3D Illustration Panel */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#FFF5F8]/90 via-[#FDF2F7]/80 to-[#FCE7F3]/90 rounded-[26px] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden border border-white/60">
          {/* Header Text */}
          <div className="z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 rounded-full text-xs font-black text-slate-800 mb-3 shadow-sm border border-purple-100">
              <img src="/ideaexecutor_icon.png" alt="IdeaExecutor Logo" className="w-5 h-5 object-contain" />
              <span>IdeaExecutor</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Build Your <br />
              <span className="text-[#FF4FA3]">Startup </span>
              <span className="text-[#FF4FA3]">With AI</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-2 max-w-[280px] leading-relaxed">
              Your AI Co-founder that helps you validate, plan, and launch your dream startup.
            </p>

            {/* Pill Badges */}
            <div className="flex flex-wrap gap-2 mt-4 z-20">
              <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-pink-100 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#FF4FA3]" />
                <span className="text-[11px] font-bold text-[#FF4FA3]">Validate Idea</span>
              </div>
              <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-sky-100 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-[11px] font-bold text-sky-600">Market Research</span>
              </div>
              <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-purple-100 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-[11px] font-bold text-purple-600">Business Growth</span>
              </div>
            </div>
          </div>

          {/* 3D Illustration */}
          <div className="relative mt-4 flex justify-center items-center z-10">
            <motion.img
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              src="/login_illustration.png"
              alt="Build Startup with AI"
              className="w-full max-w-[280px] object-contain rounded-2xl shadow-md border border-white/60 hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center relative">
          {/* Subtle Ambient Pink Glow */}
          <div className="absolute top-0 right-4 w-44 h-44 bg-[#FF4FA3]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="mb-6 relative z-10">
            <h2 className="text-3xl font-extrabold text-[#FF4FA3] tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Login to your account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4 relative z-10" onSubmit={handleSignIn}>
            <div>
              <label className="text-xs font-bold text-[#FF4FA3] block mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#FF4FA3]/70 absolute left-4 top-3.5" />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/90 border border-slate-100 rounded-full pl-11 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]/30 focus:border-[#FF4FA3] shadow-sm font-medium transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#FF4FA3] block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#FF4FA3]/70 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/90 border border-slate-100 rounded-full pl-11 pr-11 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]/30 focus:border-[#FF4FA3] shadow-sm font-medium transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-[#FF4FA3] transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-right mt-1.5">
                <span
                  onClick={() => alert('Password reset link sent to your email.')}
                  className="text-xs text-[#FF4FA3] hover:underline font-semibold cursor-pointer"
                >
                  Forgot password?
                </span>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#FF4FA3] via-[#FF3B96] to-[#E6006F] text-white text-sm font-bold rounded-full shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 flex items-center justify-center gap-2 cursor-pointer transition mt-2"
            >
              <span>Login</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center ml-1">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-5 relative z-10">
            <div className="border-t border-slate-200/80 w-full" />
            <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase absolute tracking-wider">
              OR CONTINUE WITH
            </span>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => {
              if (window.google?.accounts?.id) {
                alert('Google Sign-In service initialized.');
              } else {
                alert('Google OAuth login demo mode: Sign up or log in using email/password above.');
              }
            }}
            className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-bold rounded-full flex items-center justify-center gap-3 shadow-sm hover:shadow transition cursor-pointer relative z-10"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.2 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer Link */}
          <div className="text-[#64748B] text-center text-xs font-medium pt-5 relative z-10 flex items-center justify-center gap-1.5">
            <span>Don't have an account?</span>
            <span
              onClick={() => navigate('/register')}
              className="text-[#FF4FA3] font-extrabold hover:underline cursor-pointer inline-flex items-center gap-1 uppercase tracking-wider text-[11px]"
            >
              SIGN UP <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
