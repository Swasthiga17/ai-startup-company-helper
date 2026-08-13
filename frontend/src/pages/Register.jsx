import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Building, Globe, Briefcase, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [startupName, setStartupName] = useState('');
  const [country, setCountry] = useState('United States');
  const [stage, setStage] = useState('Idea Stage');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const handleGoogleSuccess = async (tokenResponse) => {
    setError('');
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || ''}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: tokenResponse.access_token }),
      });
      let data = {};
      try { data = await resp.json(); } catch {}
      if (!resp.ok) throw new Error(data?.detail || 'Google registration failed on backend');

      localStorage.setItem('token', data.access_token);
      navigate('/onboarding');
    } catch (err) {
      setError(err?.message || 'Google authentication failed');
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('Google sign-in was cancelled or failed.'),
  });

  const triggerGoogleLogin = () => {
    if (!googleClientId) {
      setError('Google Login Client ID is missing. Please set VITE_GOOGLE_CLIENT_ID in your environment.');
      return;
    }
    loginWithGoogle();
  };

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
        } catch {}
        navigate('/input');
      };
      checkHistory();
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agree) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || ''}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password, startupName, country, stage }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.detail || 'Registration failed');

      localStorage.setItem('token', data.access_token);
      navigate('/onboarding');
    } catch (err) {
      setError(err?.message || 'Registration failed');
    }
  };

  const featurePills = [
    'Idea Validation',
    'Market Research',
    'Business Model',
    'Pitch Deck',
    'AI Co-founder',
    'Revenue Forecast'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F6] via-[#FCE7F3] to-[#FBCFE8] text-slate-800 flex justify-center items-center relative overflow-hidden font-sans p-4 md:p-8 select-none py-10">
      {/* Ambient Glows */}
      <div className="absolute top-10 left-10 w-[450px] h-[450px] bg-pink-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-purple-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Container Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[1080px] bg-white/75 backdrop-blur-2xl rounded-[32px] border border-white/90 shadow-[0_20px_60px_-15px_rgba(255,79,163,0.18)] overflow-hidden flex flex-col lg:flex-row p-3 md:p-4 gap-4 relative z-10"
      >
        {/* LEFT PANEL (45%) */}
        <div className="w-full lg:w-[45%] bg-gradient-to-br from-[#FFF5F8]/95 via-[#FDF2F7]/85 to-[#FCE7F3]/95 rounded-[26px] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden border border-white/60">
          {/* Header Text */}
          <div className="z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 rounded-full text-xs font-black text-slate-800 mb-3 shadow-sm border border-purple-100">
              <img src="/ideaexecutor_icon.png" alt="IdeaExecutor Logo" className="w-5 h-5 object-contain" />
              <span>IdeaExecutor</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Create Your <br />
              <span className="text-[#FF4FA3]">Startup Journey</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-2 max-w-[300px] leading-relaxed">
              Join thousands of entrepreneurs using AI to validate ideas, build business models, analyze competitors, create pitch decks, and launch successful startups.
            </p>
          </div>

          {/* Floating Checkmark Badges */}
          <div className="grid grid-cols-2 gap-2 my-4 z-20">
            {featurePills.map((pill, idx) => (
              <motion.div
                key={pill}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.4 }}
                className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-sm border border-sky-100/80 flex items-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4FA3] shrink-0" />
                <span className="text-[11px] font-bold text-slate-700">{pill}</span>
              </motion.div>
            ))}
          </div>

          {/* 3D Illustration */}
          <div className="relative mt-2 flex justify-center items-center z-10">
            <motion.img
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              src="/register_illustration.png"
              alt="Create Your Startup Journey"
              className="w-full max-w-[300px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* RIGHT PANEL (55%) */}
        <div className="w-full lg:w-[55%] p-6 md:p-8 flex flex-col justify-center relative">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-4 w-44 h-44 bg-[#FF4FA3]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="mb-5 relative z-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#FF4FA3] tracking-tight">
              Create Your Account ✨
            </h2>
            <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">
              Let's build your startup together.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form className="space-y-3 relative z-10" onSubmit={handleRegister}>
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-[#FF4FA3] block mb-1">
                👤 Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#FF4FA3]/70 absolute left-4 top-3" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/90 border border-slate-100 rounded-full pl-11 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]/30 focus:border-[#FF4FA3] shadow-sm font-medium transition"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-bold text-[#FF4FA3] block mb-1">
                📧 Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#FF4FA3]/70 absolute left-4 top-3" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/90 border border-slate-100 rounded-full pl-11 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]/30 focus:border-[#FF4FA3] shadow-sm font-medium transition"
                  required
                />
              </div>
            </div>

            {/* Passwords (2 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#FF4FA3] block mb-1">
                  🔒 Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#FF4FA3]/70 absolute left-4 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/90 border border-slate-100 rounded-full pl-11 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]/30 focus:border-[#FF4FA3] shadow-sm font-medium transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-[#FF4FA3] transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#FF4FA3] block mb-1">
                  🔒 Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#FF4FA3]/70 absolute left-4 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/90 border border-slate-100 rounded-full pl-11 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]/30 focus:border-[#FF4FA3] shadow-sm font-medium transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-[#FF4FA3] transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Startup Name & Country & Stage (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-[#FF4FA3] block mb-1">
                  🏢 Startup Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#FF4FA3]/70 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Optional"
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    className="w-full bg-white/90 border border-slate-100 rounded-full pl-10 pr-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]/30 focus:border-[#FF4FA3] shadow-sm font-medium transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#FF4FA3] block mb-1">
                  🌍 Country
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-[#FF4FA3]/70 absolute left-3.5 top-3" />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-white/90 border border-slate-100 rounded-full pl-10 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]/30 focus:border-[#FF4FA3] shadow-sm font-medium transition appearance-none cursor-pointer"
                  >
                    <option value="United States">United States</option>
                    <option value="India">India</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#FF4FA3] block mb-1">
                  💼 Startup Stage
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#FF4FA3]/70 absolute left-3.5 top-3" />
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full bg-white/90 border border-slate-100 rounded-full pl-10 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]/30 focus:border-[#FF4FA3] shadow-sm font-medium transition appearance-none cursor-pointer"
                  >
                    <option value="Idea Stage">Idea Stage</option>
                    <option value="Validation">Validation</option>
                    <option value="MVP">MVP</option>
                    <option value="Beta">Beta</option>
                    <option value="Growth">Growth</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="accent-[#FF4FA3] w-4 h-4 cursor-pointer rounded"
              />
              <label htmlFor="terms" className="text-xs text-slate-500 font-medium cursor-pointer">
                I agree to the <span className="text-[#FF4FA3] font-bold hover:underline">Terms & Conditions</span>
              </label>
            </div>

            {/* Large Pink Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#FF4FA3] via-[#FF3B96] to-[#E6006F] text-white text-sm font-bold rounded-full shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 flex items-center justify-center gap-2 cursor-pointer transition mt-3"
            >
              <span>Create Account</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center ml-1">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4 relative z-10">
            <div className="border-t border-slate-200/80 w-full" />
            <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase absolute tracking-wider">
              OR CONTINUE WITH
            </span>
          </div>

          {/* Social Buttons (Google, GitHub, Microsoft) */}
          <div className="grid grid-cols-3 gap-2.5 relative z-10">
            <button
              type="button"
              onClick={triggerGoogleLogin}
              className="py-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-bold rounded-full flex items-center justify-center gap-2 shadow-sm hover:shadow transition cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.2 8.9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => alert('GitHub authentication login configured.')}
              className="py-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-bold rounded-full flex items-center justify-center gap-2 shadow-sm hover:shadow transition cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current text-slate-800" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Microsoft authentication login configured.')}
              className="py-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-bold rounded-full flex items-center justify-center gap-2 shadow-sm hover:shadow transition cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              <span>Microsoft</span>
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-slate-500 text-center text-xs font-medium pt-4 relative z-10 flex items-center justify-center gap-1.5">
            <span>Already have an account?</span>
            <span
              onClick={() => navigate('/login')}
              className="text-[#FF4FA3] font-extrabold hover:underline cursor-pointer inline-flex items-center gap-1 uppercase tracking-wider text-[11px]"
            >
              Sign In <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
