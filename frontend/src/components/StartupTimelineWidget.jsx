import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, AlertTriangle, TrendingDown, TrendingUp, Lightbulb, CheckCircle2, ShieldAlert } from 'lucide-react';
import api from '../services/api';

export default function StartupTimelineWidget() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const res = await api.get('/timeline');
      if (res.data && res.data.events) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error("Failed to fetch timeline events:", err);
    } finally {
      setLoading(false);
    }
  };

  const defaultMockTimeline = [
    {
      id: 't1',
      event_type: 'COMPETITOR_ALERT',
      title: 'Competitor X launched AI feature similar to your MVP',
      description: 'AI analyzed competitive overlap. Threat impact: HIGH.',
      impact_level: 'HIGH',
      health_delta: -4,
      date: 'Aug 25, 2026'
    },
    {
      id: 't2',
      event_type: 'RECOMMENDATION_CREATED',
      title: 'AI Co-Founder created priority recommendation',
      description: 'Focus today: Validate willingness to pay before expanding MVP scope.',
      impact_level: 'MEDIUM',
      health_delta: 0,
      date: 'Aug 24, 2026'
    },
    {
      id: 't3',
      event_type: 'EXPERIMENT_APPROVED',
      title: 'Founder approved ₹499 pricing validation experiment',
      description: 'Target: 20 customer interviews. Success criteria: ≥ 30% pre-order rate.',
      impact_level: 'POSITIVE',
      health_delta: +2,
      date: 'Aug 22, 2026'
    }
  ];

  const displayEvents = events.length > 0 ? events : defaultMockTimeline;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-left"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Startup Intelligence Timeline</h3>
            <p className="text-xs text-slate-400">Chronological history of market alerts, health shifts, and decisions</p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-slate-950 px-2.5 py-1 rounded-full text-purple-300 border border-slate-800">
          Live Audit Log
        </span>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
        {displayEvents.map((ev) => (
          <div key={ev.id} className="relative group">
            {/* Timeline Dot */}
            <span className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
              ev.impact_level === 'HIGH' ? 'bg-rose-500' :
              ev.impact_level === 'POSITIVE' ? 'bg-emerald-500' : 'bg-amber-500'
            }`} />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{ev.date}</span>
                {ev.health_delta !== 0 && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    ev.health_delta > 0
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {ev.health_delta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    Health: {ev.health_delta > 0 ? `+${ev.health_delta}` : ev.health_delta} pts
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                {ev.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {ev.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
