import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Sparkles, Bell, Shield, Palette, AlertTriangle,
  Check, Lock, LogOut, Key, Camera, Sliders, Cpu,
  CheckCircle2, Trash2, Eye, EyeOff, Laptop, Moon, Sun,
  Layers, ChevronRight, HelpCircle
} from 'lucide-react';
import api from '../services/api';

export default function Settings() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Settings saved successfully!');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Profile State
  const [fullName, setFullName] = useState('Swasthiga B S');
  const [email, setEmail] = useState('swasthiga@example.com');
  const [bio, setBio] = useState('AI enthusiast and builder. Passionate about solving real world problems using technology.');

  // AI Preferences State
  const [responseStyle, setResponseStyle] = useState('Detailed');
  const [creativityLevel, setCreativityLevel] = useState(70);
  const [autoGenerateInsights, setAutoGenerateInsights] = useState(true);
  const [showConfidenceScores, setShowConfidenceScores] = useState(true);
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');

  // Notification Toggles
  const [notifications, setNotifications] = useState({
    taskCompleted: true,
    weeklySummary: true,
    productUpdates: false,
    emailNotifications: true,
  });

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Appearance State
  const [theme, setTheme] = useState('light');
  const [compactLayout, setCompactLayout] = useState(true);
  const [sidebarBehavior, setSidebarBehavior] = useState('expanded');

  // Load user data from backend if logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resp = await api.get('/auth/me');
        if (resp.data) {
          if (resp.data.name) setFullName(resp.data.name);
          if (resp.data.email) setEmail(resp.data.email);
        }
      } catch {
        // Retain default demo state
      }
    };
    fetchUser();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    triggerToast('Profile updated successfully!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    triggerToast('Password changed successfully!');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    localStorage.clear();
    navigate('/login');
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'ai-preferences', label: 'AI Preferences', icon: Sparkles },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, isDanger: true },
  ];

  return (
    <div className="min-h-screen text-slate-800 font-sans pb-16">
      {/* Toast Notification */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight text-left">Settings</h1>
        <p className="text-xs text-slate-500 font-medium mt-1 text-left">
          Manage your account, AI preferences, notifications & security
        </p>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
        {/* Sticky Settings Sidebar Navigation */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs sticky top-20 space-y-1">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sec.isDanger
                      ? isActive
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'text-rose-500 hover:bg-rose-50/50'
                      : isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${sec.isDanger ? 'text-rose-500' : isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{sec.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Settings Cards Container */}
        <div className="md:col-span-9 space-y-6">
          {/* ── 1. Profile ── */}
          <div id="profile" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold text-slate-800">Profile</h2>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                  <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-slate-200 shadow-xs flex items-center justify-center text-blue-600 hover:bg-slate-50 cursor-pointer">
                    <Camera className="w-3 h-3" />
                    <input type="file" className="hidden" accept="image/*" onChange={() => triggerToast('Profile picture updated!')} />
                  </label>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{fullName}</div>
                  <div className="text-[11px] text-slate-400">{email}</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-extrabold uppercase">Founder</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* ── 2. AI Preferences ── */}
          <div id="ai-preferences" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h2 className="text-base font-bold text-slate-800">AI Preferences</h2>
              </div>
            </div>

            <div className="space-y-4">
              {/* Response Style */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-800">AI Response Style</div>
                  <div className="text-[11px] text-slate-400">Choose how detailed your AI co-founder answers should be</div>
                </div>
                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {['Concise', 'Balanced', 'Detailed'].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => { setResponseStyle(style); triggerToast(`AI style set to ${style}`); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        responseStyle === style ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Creativity Slider */}
              <div className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs font-bold text-slate-800">AI Creativity</div>
                    <div className="text-[11px] text-slate-400">Balance between strict analytical facts vs innovative brainstorming</div>
                  </div>
                  <span className="text-xs font-extrabold text-blue-600">{creativityLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={creativityLevel}
                  onChange={(e) => setCreativityLevel(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Auto-generate Insights */}
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-800">Auto-generate Insights</div>
                  <div className="text-[11px] text-slate-400">Automatically run background RAG & market sentiment updates</div>
                </div>
                <button
                  type="button"
                  onClick={() => { setAutoGenerateInsights(!autoGenerateInsights); triggerToast('AI preference updated'); }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                    autoGenerateInsights ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'
                  }`}
                >
                  <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
              </div>

              {/* Show Confidence Scores */}
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-800">Show Confidence Scores</div>
                  <div className="text-[11px] text-slate-400">Display agent verification tags (e.g., 94% verified)</div>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowConfidenceScores(!showConfidenceScores); triggerToast('AI preference updated'); }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                    showConfidenceScores ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'
                  }`}
                >
                  <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
              </div>

              {/* AI Model Preference */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <div className="text-xs font-bold text-slate-800">AI Model Preference</div>
                  <div className="text-[11px] text-slate-400">Select default model engine for execution graphs</div>
                </div>
                <select
                  value={aiModel}
                  onChange={(e) => { setAiModel(e.target.value); triggerToast(`Model changed to ${e.target.value}`); }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast & Accurate)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Context)</option>
                  <option value="claude-3.5-sonnet">Claude 3.5 Sonnet (Strategic)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── 3. Notifications ── */}
          <div id="notifications" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-bold text-slate-800">Notifications</h2>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: 'taskCompleted', title: 'AI Task Completed', desc: 'Notify when market research or pitch decks finish generating' },
                { key: 'weeklySummary', title: 'Weekly Startup Summary', desc: 'Receive a weekly health score and milestone digest' },
                { key: 'productUpdates', title: 'Product Updates', desc: 'Get updates on new IdeaExecutor agent features' },
                { key: 'emailNotifications', title: 'Email Notifications', desc: 'Deliver important updates directly to your registered email' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-100/60">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{item.title}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...notifications, [item.key]: !notifications[item.key] };
                      setNotifications(updated);
                      triggerToast('Notification preferences saved');
                    }}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                      notifications[item.key] ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'
                    }`}
                  >
                    <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-md" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── 4. Security ── */}
          <div id="security" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-800">Security</h2>
              </div>
            </div>

            <div className="space-y-4">
              {/* Password */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <div className="text-xs font-bold text-slate-800">Password</div>
                  <div className="text-[11px] text-slate-400">Last changed: Never (Registered with password)</div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-xs"
                >
                  Change Password
                </button>
              </div>

              {/* Active Sessions */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <Laptop className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <span>Chrome on Windows</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-extrabold">Active Now</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Current session — 127.0.0.1</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast('Logged out of all other sessions')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>

          {/* ── 5. Appearance ── */}
          <div id="appearance" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-600" />
                <h2 className="text-base font-bold text-slate-800">Appearance</h2>
              </div>
            </div>

            <div className="space-y-4">
              {/* Theme */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-800">Theme</div>
                  <div className="text-[11px] text-slate-400">Select dashboard theme preference</div>
                </div>
                <div className="flex gap-2">
                  {[
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'system', label: 'System', icon: Laptop },
                  ].map((t) => {
                    const TIcon = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => { setTheme(t.id); triggerToast(`Theme set to ${t.label}`); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          theme === t.id ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <TIcon className="w-3.5 h-3.5" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Compact Layout */}
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-800">Compact Layout</div>
                  <div className="text-[11px] text-slate-400">Use 20-25% more compact cards & sidebar margins</div>
                </div>
                <button
                  type="button"
                  onClick={() => { setCompactLayout(!compactLayout); triggerToast('Layout density updated'); }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                    compactLayout ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'
                  }`}
                >
                  <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
              </div>

              {/* Sidebar Behavior */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-xs font-bold text-slate-800">Sidebar Behavior</div>
                  <div className="text-[11px] text-slate-400">Default state when navigating pages</div>
                </div>
                <select
                  value={sidebarBehavior}
                  onChange={(e) => { setSidebarBehavior(e.target.value); triggerToast('Sidebar preference updated'); }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="expanded">Expanded (Default)</option>
                  <option value="collapsed">Collapsed</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── 6. Danger Zone ── */}
          <div id="danger" className="bg-rose-50/40 rounded-2xl p-6 border border-rose-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-rose-200/60">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h2 className="text-base font-bold text-rose-800">Danger Zone</h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-rose-900">Delete Account</div>
                <div className="text-[11px] text-rose-700/80 mt-0.5">
                  Permanently delete your IdeaExecutor account and all associated data.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition shrink-0 cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Change Password Modal ── */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl max-w-md w-full text-left"
            >
              <h3 className="text-base font-bold text-slate-800 mb-1">Change Password</h3>
              <p className="text-xs text-slate-500 mb-4">Enter your new password details below.</p>

              <form onSubmit={handleChangePassword} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Delete Account Confirmation Modal ── */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl max-w-md w-full text-left space-y-4"
            >
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Account?</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  This action is permanent and cannot be undone. All your saved startup analyses, vectors, and action items will be permanently erased.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
