import React, { useState } from 'react';
import { ThumbsUp, Smile, Meh, ThumbsDown, Check, Send } from 'lucide-react';
import api from '../services/api';

export default function RecommendationFeedbackWidget({ recommendationTitle = "Validate willingness to pay" }) {
  const [rating, setRating] = useState(null);
  const [acted, setActed] = useState('YES');
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const ratings = [
    { key: 'VERY_USEFUL', label: 'Very useful', icon: ThumbsUp, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
    { key: 'USEFUL', label: 'Useful', icon: Smile, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
    { key: 'PARTIALLY_USEFUL', label: 'Partially useful', icon: Meh, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
    { key: 'NOT_USEFUL', label: 'Not useful', icon: ThumbsDown, color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;

    try {
      await api.post('/feedback', {
        recommendation_title: recommendationTitle,
        rating: rating,
        acted_status: acted,
        feedback_text: feedbackText
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit recommendation feedback:", err);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 text-xs text-emerald-300 flex items-center justify-center gap-2">
        <Check className="w-4 h-4 text-emerald-400" />
        <span>Feedback recorded! Thank you for helping train IdeaExecutor AI.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs text-left">
      <div className="font-extrabold text-slate-300 uppercase tracking-wider">
        💬 Was this recommendation useful to your startup?
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ratings.map((r) => {
          const Icon = r.icon;
          const isSelected = rating === r.key;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => setRating(r.key)}
              className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                isSelected
                  ? r.color + ' ring-2 ring-indigo-500'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[11px]">{r.label}</span>
            </button>
          );
        })}
      </div>

      {rating && (
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Did you act on this recommendation?</label>
            <div className="flex items-center gap-2">
              {['YES', 'PARTIALLY', 'NO'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setActed(st)}
                  className={`px-3 py-1 rounded-lg border text-[11px] font-bold cursor-pointer ${
                    acted === st
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'YES' ? 'Yes' : st === 'PARTIALLY' ? 'Partially' : 'No'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="What was wrong or missing? (Optional)"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Feedback</span>
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
