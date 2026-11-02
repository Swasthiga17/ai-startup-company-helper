import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, RefreshCw, XCircle } from 'lucide-react';
import { getSubscription, createCheckoutSession, cancelSubscription } from '../services/api';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

const plans = [
  {
    id: 'FREE',
    name: 'Starter Plan',
    price: '₹0',
    usdPrice: '$0',
    desc: 'Perfect for validating your first startup idea.',
    features: [
      '1 Active Startup Workspace',
      '3 Monthly Deep AI Analyses',
      'Basic SWOT & Business Canvas',
      'PDF Export Reports',
      'Community mentor chat access'
    ],
    color: 'border-slate-200 bg-white hover:border-slate-300'
  },
  {
    id: 'PRO',
    name: 'Pro Co-Founder',
    price: '₹999',
    usdPrice: '$49',
    desc: 'For active founders accelerating to product-market fit.',
    features: [
      '5 Active Startup Workspaces',
      '50 Monthly Deep AI Analyses',
      'Complete 8 Parallel AI Agents',
      'Pitch Deck PPTX & Executive PDF',
      'Real-Time Market Watch & RAG Search',
      'Priority Mentor Response Speed'
    ],
    color: 'border-pink-400 bg-white ring-2 ring-pink-500/15 shadow-md scale-[1.02]',
    badge: 'Most Popular'
  },
  {
    id: 'FOUNDER',
    name: 'Founder Suite',
    price: '₹2,499',
    usdPrice: '$149',
    desc: 'For venture studios, serial founders, and funded teams.',
    features: [
      '100 Startup Workspaces',
      '500 Monthly Deep AI Analyses',
      'Dedicated Custom Vector Models',
      'White-labeled Investor PPTX Deck',
      'Devils Advocate Pivot Simulation',
      '24/7 Priority Support & Advisor'
    ],
    color: 'border-purple-300 bg-white hover:border-purple-400'
  }
];

export default function Pricing() {
  const [subscription, setSubscription] = useState({ plan_id: 'FREE', status: 'ACTIVE' });
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState(null);

  // Fetch subscription status & check query params
  useEffect(() => {
    const fetchSub = async () => {
      try {
        const data = await getSubscription();
        if (data) {
          setSubscription(data);
        }
      } catch (err) {
        console.error('Failed to load subscription:', err);
      }
    };
    fetchSub();

    // Check status in URL params (supports query strings or hash router query)
    const search = window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
    const params = new URLSearchParams(search);
    const statusParam = params.get('status');
    const sessionId = params.get('session_id');

    if (statusParam === 'success' || (sessionId && statusParam !== 'cancelled')) {
      setBanner({
        type: 'success',
        title: 'Checkout Completed!',
        message: 'Your payment session was received. Note: Paid features activate securely once the provider webhook confirms the transaction.'
      });
    } else if (statusParam === 'cancelled') {
      setBanner({
        type: 'warning',
        title: 'Checkout Cancelled',
        message: 'No charges were incurred. Your account remains on its current plan.'
      });
    } else if (statusParam === 'mock_checkout') {
      setBanner({
        type: 'info',
        title: 'Development Checkout Mode',
        message: 'Running in safe test mode. Use automated webhooks or billing configuration to activate test subscriptions.'
      });
    }
  }, []);

  const handleUpgrade = async (planId) => {
    if (planId === subscription.plan_id && subscription.status === 'ACTIVE') return;
    setLoadingPlan(planId);
    setError('');

    try {
      const res = await createCheckoutSession(planId);
      if (res && res.checkout_url) {
        window.location.href = res.checkout_url;
      } else {
        setError('Checkout session URL was not returned by the server.');
      }
    } catch (err) {
      const msg = err.response?.data?.detail || err.userFriendlyMessage || 'Unable to initiate checkout session.';
      setError(msg);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your active subscription? You will retain access until the end of the billing period.')) {
      return;
    }
    setCancelling(true);
    setError('');

    try {
      await cancelSubscription();
      setSubscription((prev) => ({ ...prev, status: 'CANCELLED' }));
      setBanner({
        type: 'info',
        title: 'Subscription Cancelled',
        message: 'Your subscription has been marked as cancelled. You can reactivate anytime.'
      });
    } catch (err) {
      setError('Failed to cancel subscription. Please contact support.');
    } finally {
      setCancelling(false);
    }
  };

  const currentPlanId = (subscription.plan_id || 'FREE').toUpperCase();
  const isPaidActive = currentPlanId !== 'FREE' && subscription.status === 'ACTIVE';

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left max-w-6xl mx-auto">
      
      {/* Title & Status Card */}
      <motion.div variants={item} className="rounded-3xl p-6 bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-5 h-5 text-[#FF4FA3]" />
            <h2 className="text-xl font-black text-slate-800">Workspace Plans & Billing</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Choose the execution pace that aligns with your fundraising targets and co-founder needs.
          </p>
        </div>

        {/* Current status pill */}
        <div className="flex items-center gap-3 bg-pink-50/70 border border-pink-100/80 px-4 py-2.5 rounded-2xl shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-xs">
            <span className="text-slate-500 font-medium">Current Plan: </span>
            <span className="font-black text-slate-800">{currentPlanId}</span>
            <span className="text-[11px] text-slate-400 font-semibold ml-1.5">({subscription.status})</span>
          </div>
        </div>
      </motion.div>

      {/* Status Banners */}
      {banner && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border text-xs flex items-start gap-3 shadow-sm ${
            banner.type === 'success'
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
              : banner.type === 'warning'
              ? 'bg-amber-50/90 border-amber-200 text-amber-800'
              : 'bg-indigo-50/90 border-indigo-200 text-indigo-800'
          }`}
        >
          {banner.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : banner.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="font-bold">{banner.title}</div>
            <div className="mt-0.5 leading-relaxed">{banner.message}</div>
          </div>
          <button
            onClick={() => setBanner(null)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 shadow-sm"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Plan Cards Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {plans.map((p) => {
          const isCurrent = currentPlanId === p.id;
          const isCurrentActive = isCurrent && subscription.status === 'ACTIVE';

          return (
            <div
              key={p.id}
              className={`rounded-3xl p-6 border shadow-sm flex flex-col justify-between relative transition-all min-h-[480px] ${p.color}`}
            >
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-gradient-to-r from-[#FF4FA3] to-[#E6006F] text-white font-black rounded-full text-[10px] uppercase tracking-wider shadow-sm">
                  {p.badge}
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-black text-slate-850 leading-tight">{p.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">{p.desc}</p>
                </div>

                <div className="py-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-850">{p.price}</span>
                  <span className="text-xs text-slate-400 font-bold">/ month</span>
                </div>

                {/* Features list */}
                <ul className="space-y-2.5 pt-2 border-t border-slate-100">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-650 font-medium leading-snug">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                {isCurrentActive ? (
                  <div className="w-full py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Current Active Plan</span>
                  </div>
                ) : p.id === 'FREE' ? (
                  <div className="w-full py-3 rounded-2xl bg-slate-100 text-slate-400 text-xs font-bold text-center">
                    Default Free Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgrade(p.id)}
                    disabled={loadingPlan === p.id}
                    className={`w-full py-3.5 rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      p.badge
                        ? 'bg-gradient-to-r from-[#FF4FA3] via-[#FF3B96] to-[#E6006F] hover:from-[#FF3B96] hover:to-[#D10065] text-white shadow-pink-500/25'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    } disabled:opacity-60`}
                  >
                    {loadingPlan === p.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Upgrade to {p.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Subscription Management Footer (for paid users) */}
      {isPaidActive && (
        <motion.div variants={item} className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
          <div className="text-xs text-slate-600">
            <span className="font-bold text-slate-800">Manage Subscription: </span>
            <span>You have an active {currentPlanId} plan. You can cancel at any time.</span>
          </div>

          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl cursor-pointer transition disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
          </button>
        </motion.div>
      )}

    </motion.div>
  );
}
