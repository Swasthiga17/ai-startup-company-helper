import React, { useState, useEffect } from 'react';
import {
  User,
  Bell,
  Shield,
  Bot,
  Lock,
  Trash2,
  Rocket,
  Calendar,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';

const Settings = () => {
  const [userProfile, setUserProfile] = useState({
    name: 'Swasthiga B S',
    email: 'swasthiga@example.com'
  });
  const [saveToast, setSaveToast] = useState(false);

  // Default fallback startups
  const [createdStartups, setCreatedStartups] = useState([
    {
      id: 1,
      name: 'SupportMind AI',
      industry: 'Artificial Intelligence',
      country: 'United States',
      stage: 'Idea Stage',
      score: 80,
      createdAt: '2/9/2026',
      active: true
    },
    {
      id: 2,
      name: 'TeleHealth AI',
      industry: 'Healthcare',
      country: 'United States',
      stage: 'Idea Stage',
      score: 80,
      createdAt: '2/9/2026',
      active: false
    },
    {
      id: 3,
      name: 'SupportMind AI',
      industry: 'Artificial Intelligence',
      country: 'United States',
      stage: 'Idea Stage',
      score: 78,
      createdAt: '26/8/2026',
      active: false
    },
    {
      id: 4,
      name: 'TeleHealth AI',
      industry: 'Healthcare',
      country: 'United States',
      stage: 'Idea Stage',
      score: 76,
      createdAt: '26/8/2026',
      active: false
    }
  ]);

  // Fetch logged in account details & user startups
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const meResp = await api.get('/auth/me');
        if (meResp.data) {
          setUserProfile({
            name: meResp.data.name || 'Swasthiga B S',
            email: meResp.data.email || 'swasthiga@example.com'
          });
        }
      } catch (err) {
        console.log('Using default profile credentials');
      }

      try {
        const histResp = await api.get('/history');
        if (histResp.data && histResp.data.length > 0) {
          const mapped = histResp.data.map((item, idx) => ({
            id: item.id || idx + 1,
            name: item.idea_title || item.startup_name || item.name || `Startup Idea #${idx + 1}`,
            industry: item.industry || 'Technology',
            country: item.country || 'United States',
            stage: item.stage || 'Idea Stage',
            score: item.overall_score || item.score || 80,
            createdAt: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent',
            active: idx === 0
          }));
          setCreatedStartups(mapped);
        }
      } catch (err) {
        console.log('Using default history list');
      }
    };
    fetchAccount();
  }, []);

  const handleSaveChanges = (e) => {
    if (e) e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fff5fa] p-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-3xl p-7 mb-6 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Settings
              </h1>

              <p className="text-slate-500">
                Manage your account, startups and IdeaExecutor preferences
              </p>
            </div>

          </div>

        </div>


        {/* ================= CREATED STARTUPS ================= */}

        <section className="bg-white rounded-3xl p-6 mb-6 shadow-sm">

          <div className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Rocket
                  className="text-purple-600"
                  size={21}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Created Startups
                </h2>

                <p className="text-sm text-slate-500">
                  Startups created in your IdeaExecutor workspace
                </p>
              </div>

            </div>

            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
              {createdStartups.length} Startups
            </span>

          </div>


          {/* Startup Cards */}

          <div className="grid md:grid-cols-2 gap-4">

            {createdStartups.map((startup) => (

              <div
                key={startup.id}
                className={`border rounded-2xl p-5 transition-all hover:shadow-md ${startup.active
                    ? 'border-purple-400 bg-purple-50/40'
                    : 'border-slate-200 bg-white'
                  }`}
              >

                {/* Top */}

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                      🚀
                    </div>

                    <div>

                      <div className="flex items-center gap-2">

                        <h3 className="font-bold text-lg text-slate-900">
                          {startup.name}
                        </h3>

                        {startup.active && (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-bold">
                            ACTIVE
                          </span>
                        )}

                      </div>

                      <p className="text-sm text-slate-500">
                        {startup.industry}
                      </p>

                    </div>

                  </div>

                  <button
                    className="text-slate-400 hover:text-purple-600 transition"
                    title="Open startup"
                  >
                    <ExternalLink size={18} />
                  </button>

                </div>


                {/* Details */}

                <div className="grid grid-cols-2 gap-3 mt-5">

                  <div className="bg-slate-50 rounded-xl p-3">

                    <p className="text-xs text-slate-400">
                      Country
                    </p>

                    <p className="text-sm font-semibold text-slate-700 mt-1">
                      {startup.country}
                    </p>

                  </div>


                  <div className="bg-slate-50 rounded-xl p-3">

                    <p className="text-xs text-slate-400">
                      Stage
                    </p>

                    <p className="text-sm font-semibold text-slate-700 mt-1">
                      {startup.stage}
                    </p>

                  </div>

                </div>


                {/* Bottom */}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">

                  <div className="flex items-center gap-2 text-sm text-slate-500">

                    <Calendar size={15} />

                    {startup.createdAt}

                  </div>


                  <div className="flex items-center gap-2">

                    <div className="w-9 h-9 rounded-full border-4 border-purple-500 flex items-center justify-center">

                      <span className="text-xs font-bold text-slate-700">
                        {startup.score}
                      </span>

                    </div>

                    <div>

                      <p className="text-[10px] text-slate-400">
                        AI SCORE
                      </p>

                      <p className="text-xs font-semibold text-slate-700">
                        Ready for review
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* ================= PROFILE ================= */}

        <section className="bg-white rounded-3xl p-6 mb-5 shadow-sm">

          <div className="flex items-center gap-3 mb-6">

            <User className="text-purple-600" />

            <h2 className="text-xl font-bold">
              Profile
            </h2>

          </div>


          <form onSubmit={handleSaveChanges}>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 font-semibold text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:opacity-95 transition cursor-pointer"
              >
                Save Changes
              </button>

              {saveToast && (
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                  <CheckCircle2 size={18} />
                  <span>Profile updated successfully!</span>
                </div>
              )}
            </div>
          </form>

        </section>


        {/* ================= AI PREFERENCES ================= */}

        <section className="bg-white rounded-3xl p-6 mb-5 shadow-sm">

          <div className="flex items-center gap-3 mb-6">

            <Bot className="text-purple-600" />

            <h2 className="text-xl font-bold">
              AI Preferences
            </h2>

          </div>


          <div className="space-y-5">

            <div className="flex justify-between items-center">

              <div>

                <p className="font-semibold">
                  AI Insights
                </p>

                <p className="text-sm text-slate-500">
                  Automatically generate startup insights
                </p>

              </div>

              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 accent-purple-600"
              />

            </div>


            <div className="flex justify-between items-center">

              <div>

                <p className="font-semibold">
                  Confidence Scores
                </p>

                <p className="text-sm text-slate-500">
                  Show AI confidence levels
                </p>

              </div>

              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 accent-purple-600"
              />

            </div>

          </div>

        </section>


        {/* ================= NOTIFICATIONS ================= */}

        <section className="bg-white rounded-3xl p-6 mb-5 shadow-sm">

          <div className="flex items-center gap-3 mb-6">

            <Bell className="text-purple-600" />

            <h2 className="text-xl font-bold">
              Notifications
            </h2>

          </div>


          <div className="space-y-4">

            <div className="flex justify-between">
              <span>AI task completed</span>

              <input
                type="checkbox"
                defaultChecked
                className="accent-purple-600"
              />
            </div>


            <div className="flex justify-between">
              <span>Startup insights</span>

              <input
                type="checkbox"
                defaultChecked
                className="accent-purple-600"
              />
            </div>


            <div className="flex justify-between">
              <span>Weekly startup report</span>

              <input
                type="checkbox"
                defaultChecked
                className="accent-purple-600"
              />
            </div>

          </div>

        </section>


        {/* ================= SECURITY ================= */}

        <section className="bg-white rounded-3xl p-6 mb-5 shadow-sm">

          <div className="flex items-center gap-3 mb-6">

            <Lock className="text-purple-600" />

            <h2 className="text-xl font-bold">
              Security
            </h2>

          </div>


          <button className="px-5 py-3 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50">
            Change Password
          </button>

        </section>


        {/* ================= DANGER ZONE ================= */}

        <section className="bg-white rounded-3xl p-6 border border-red-200">

          <div className="flex items-center gap-3 mb-4">

            <Trash2 className="text-red-500" />

            <h2 className="text-xl font-bold text-red-600">
              Danger Zone
            </h2>

          </div>


          <p className="text-slate-500 mb-4">
            Permanently delete your IdeaExecutor account and associated data.
          </p>


          <button className="px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold">
            Delete Account
          </button>

        </section>

      </div>

    </div>
  );
};

export default Settings;