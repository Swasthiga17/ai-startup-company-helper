import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Settings as SettingsIcon, Users, Shield, CreditCard, Bell,
  Layers, Edit3, Check, Camera, Globe, Clock, HelpCircle,
  Building, HardDrive, FileText, Upload, TrendingUp, ChevronDown,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Profile Form State (Defaults match screenshot)
  const [profile, setProfile] = useState({
    fullName: 'Swasthiga B S',
    email: 'swasthiga@example.com',
    role: 'Founder',
    company: 'Startup Pilot Idea',
    bio: 'AI enthusiast and builder. Passionate about solving real world problems using technology.',
    avatarLetter: 'S'
  });

  // Preferences State (Matches screenshot)
  const [preferences, setPreferences] = useState({
    language: 'English',
    timezone: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
    currency: 'INR (₹) Indian Rupee',
    workspace: 'Startup Pilot Idea'
  });

  // Load real user details if logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resp = await api.get('/auth/me');
        if (resp.data) {
          setProfile(prev => ({
            ...prev,
            fullName: resp.data.name || prev.fullName,
            email: resp.data.email || prev.email,
            avatarLetter: (resp.data.name || 'S').charAt(0).toUpperCase()
          }));
        }
      } catch {
        // Fallback to initial values from screenshot
      }
    };
    fetchUser();
  }, []);

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const tabs = [
    { id: 'Profile', label: 'Profile', icon: User },
    { id: 'Preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'Workspace', label: 'Workspace', icon: Users },
    { id: 'Security', label: 'Security', icon: Shield },
    { id: 'Billing', label: 'Billing', icon: CreditCard },
    { id: 'Notifications', label: 'Notifications', icon: Bell },
    { id: 'Integrations', label: 'Integrations', icon: Layers },
  ];

  return (
    <div className="space-y-6 text-left max-w-[1400px] mx-auto pb-12">
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
            <span>Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sub-Navigation Tabs ── */}
      <div className="border-b border-slate-200/80 -mt-2">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto scrollbar-none py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-purple-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/40 rounded-lg'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Main Content Grid ── */}
      {activeTab === 'Profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 cols): Profile Info & Preferences */}
          <div className="lg:col-span-8 space-y-6">
            {/* Profile Information Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex items-start justify-between mb-6 pb-2">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">
                    Profile Information
                  </h2>
                  <p className="text-xs text-slate-450 font-medium mt-0.5">
                    Update your personal information and profile details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      handleSaveProfile();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-purple-200 text-purple-600 text-xs font-bold hover:bg-purple-50 transition cursor-pointer shadow-xs"
                >
                  {isEditing ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>

              {/* Avatar + Inputs Form */}
              <form onSubmit={handleSaveProfile}>
                <div className="flex flex-col sm:flex-row items-start gap-6 mb-5">
                  {/* Big Circular Avatar with Camera badge */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-full bg-[#6D28D9] text-white flex items-center justify-center font-black text-3xl shadow-md select-none">
                      {profile.avatarLetter}
                    </div>
                    <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-purple-600 hover:bg-slate-50 cursor-pointer transition">
                      <Camera className="w-3.5 h-3.5" />
                      <input type="file" className="hidden" accept="image/*" onChange={() => alert('Profile photo updated')} />
                    </label>
                  </div>

                  {/* 2-Column Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="w-full bg-slate-50/70 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition disabled:bg-slate-50/50 disabled:text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        disabled={!isEditing}
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full bg-slate-50/70 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition disabled:bg-slate-50/50 disabled:text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                        Role
                      </label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={profile.role}
                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                        className="w-full bg-slate-50/70 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition disabled:bg-slate-50/50 disabled:text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        className="w-full bg-slate-50/70 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition disabled:bg-slate-50/50 disabled:text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio (Full Width) */}
                <div className="pt-1">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    disabled={!isEditing}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition disabled:bg-slate-50/50 disabled:text-slate-700 leading-relaxed resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Preferences Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-100 shadow-sm">
              <div className="mb-5 pb-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">
                  Preferences
                </h2>
                <p className="text-xs text-slate-450 font-medium mt-0.5">
                  Manage your account preferences.
                </p>
              </div>

              <div className="space-y-3">
                {/* 1. Language */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl hover:bg-slate-50/80 transition gap-3 border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100/60">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Language</div>
                      <div className="text-[11px] text-slate-450">Choose your preferred language</div>
                    </div>
                  </div>
                  <div className="relative min-w-[200px]">
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      className="w-full appearance-none bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Japanese">Japanese</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Timezone */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl hover:bg-slate-50/80 transition gap-3 border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100/60">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Timezone</div>
                      <div className="text-[11px] text-slate-450">Select your timezone</div>
                    </div>
                  </div>
                  <div className="relative min-w-[260px]">
                    <select
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                      className="w-full appearance-none bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer truncate"
                    >
                      <option value="(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                      <option value="(GMT+00:00) UTC / London">(GMT+00:00) UTC / London</option>
                      <option value="(GMT-05:00) Eastern Time (US & Canada)">(GMT-05:00) Eastern Time (US & Canada)</option>
                      <option value="(GMT-08:00) Pacific Time (US & Canada)">(GMT-08:00) Pacific Time (US & Canada)</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Default Currency */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl hover:bg-slate-50/80 transition gap-3 border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100/60">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Default Currency</div>
                      <div className="text-[11px] text-slate-450">Choose your default currency</div>
                    </div>
                  </div>
                  <div className="relative min-w-[200px]">
                    <select
                      value={preferences.currency}
                      onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                      className="w-full appearance-none bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
                    >
                      <option value="INR (₹) Indian Rupee">INR (₹) Indian Rupee</option>
                      <option value="USD ($) US Dollar">USD ($) US Dollar</option>
                      <option value="EUR (€) Euro">EUR (€) Euro</option>
                      <option value="GBP (£) British Pound">GBP (£) British Pound</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* 4. Default Workspace */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl hover:bg-slate-50/80 transition gap-3 border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100/60">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Default Workspace</div>
                      <div className="text-[11px] text-slate-450">Choose your default workspace</div>
                    </div>
                  </div>
                  <div className="relative min-w-[200px]">
                    <select
                      value={preferences.workspace}
                      onChange={(e) => setPreferences({ ...preferences, workspace: e.target.value })}
                      className="w-full appearance-none bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
                    >
                      <option value="Startup Pilot Idea">Startup Pilot Idea</option>
                      <option value="FinTech Discovery Lab">FinTech Discovery Lab</option>
                      <option value="SaaS AI Co-founder">SaaS AI Co-founder</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Account Summary, Storage Usage, Recent Activity */}
          <div className="lg:col-span-4 space-y-6">
            {/* Account Summary Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-1">
                <User className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-extrabold text-slate-800">Account Summary</h3>
              </div>

              <div className="space-y-3.5">
                {/* Account Type */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>Account Type</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 font-bold text-[11px]">
                    Founder
                  </span>
                </div>

                {/* Member Since */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Member Since</span>
                  </div>
                  <span className="font-bold text-slate-800">Aug 12, 2026</span>
                </div>

                {/* Workspace */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Workspace</span>
                  </div>
                  <span className="font-bold text-slate-800 truncate max-w-[140px]">Startup Pilot Idea</span>
                </div>

                {/* Plan */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span>Plan</span>
                  </div>
                  <span className="font-bold text-slate-800">Free Plan</span>
                </div>
              </div>
            </div>

            {/* Storage Usage Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-extrabold text-slate-800">Storage Usage</h3>
                </div>
                <span className="text-[11px] font-medium text-slate-400">2.4 GB of 10 GB used</span>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-2.5 my-3">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex-1">
                  <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600" style={{ width: '24%' }} />
                </div>
                <span className="text-xs font-bold text-slate-700 shrink-0">24%</span>
              </div>

              <button
                type="button"
                onClick={() => alert('Storage management: You have 7.6 GB remaining.')}
                className="w-full mt-2 py-2 rounded-xl border border-purple-200 text-purple-600 font-bold text-xs hover:bg-purple-50 transition cursor-pointer text-center"
              >
                Manage Storage
              </button>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-1">
                <Clock className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-extrabold text-slate-800">Recent Activity</h3>
              </div>

              <div className="space-y-3.5">
                {/* 1. Market analysis */}
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/60">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-700 truncate">Market analysis completed</span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">2 hours ago</span>
                </div>

                {/* 2. Document uploaded */}
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100/60">
                      <Upload className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-700 truncate">Document uploaded <span className="text-slate-400 block sm:inline text-[10px]">AI_Market_Report.pdf</span></span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">5 hours ago</span>
                </div>

                {/* 3. Revenue forecast */}
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100/60">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-700 truncate">Revenue forecast generated</span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">1 day ago</span>
                </div>

                {/* 4. Profile updated */}
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/60">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-700 truncate">Profile updated</span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Security Tab Content ── */}
      {activeTab === 'Security' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-3xl space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">Security & Authentication</h2>
            <p className="text-xs text-slate-450 font-medium mt-0.5">Manage your password, login sessions and multi-factor security.</p>
          </div>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">New Password</label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <button
              onClick={() => alert('Password updated')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </div>
      )}

      {/* ── Workspace Tab Content ── */}
      {activeTab === 'Workspace' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-3xl space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">Workspace Management</h2>
            <p className="text-xs text-slate-450 font-medium mt-0.5">Manage team members, roles and shared startup assets.</p>
          </div>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">S</div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{profile.fullName} (You)</div>
                  <div className="text-[10px] text-slate-450">{profile.email}</div>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full">Owner / Founder</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Billing Tab Content ── */}
      {activeTab === 'Billing' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">Billing & Plans</h2>
              <p className="text-xs text-slate-450 font-medium mt-0.5">Manage your subscription, invoices and payment methods.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              Active: Free Plan
            </span>
          </div>
        </div>
      )}

      {/* ── Notifications Tab Content ── */}
      {activeTab === 'Notifications' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-3xl space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">Notification Channels</h2>
            <p className="text-xs text-slate-450 font-medium mt-0.5">Control how and when IdeaExecutor notifies you.</p>
          </div>
          <div className="space-y-3 pt-2">
            {['Morning AI Founder Brief', 'Competitor & Market Alerts', 'Roadmap Milestone Reminders'].map((title, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                <div className="text-xs font-bold text-slate-800">{title}</div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded cursor-pointer" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Integrations Tab Content ── */}
      {activeTab === 'Integrations' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-3xl space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">Connected Integrations</h2>
            <p className="text-xs text-slate-450 font-medium mt-0.5">Connect external platforms to sync market data and documents.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {['Google Drive', 'GitHub', 'Slack', 'Notion'].map((name, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800">{name}</div>
                <button onClick={() => alert(`Connected to ${name}`)} className="px-3 py-1 rounded-lg border border-purple-200 text-purple-600 text-xs font-bold hover:bg-purple-50 cursor-pointer">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div>© 2026 IdeaExecutor. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <span className="hover:text-purple-600 cursor-pointer transition">Privacy Policy</span>
          <span className="hover:text-purple-600 cursor-pointer transition">Terms of Service</span>
          <span className="hover:text-purple-600 cursor-pointer transition">Help Center</span>
        </div>
      </footer>
    </div>
  );
}
