import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket, Brain, Target, TrendingUp, AlertTriangle, CheckCircle2,
  Clock, ArrowRight, ShieldAlert, Sparkles, Activity, Layers,
  ChevronRight, RefreshCw, CheckSquare, Plus, Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StartupCommandCenter() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingTask, setAddingTask] = useState(false);

  const [recommendations, setRecommendations] = useState([]);
  const [approvingId, setApprovingId] = useState(null);

  const fetchCommandCenter = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || ''}/startup/command-center`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
      const json = await resp.json();
      setData(json);

      // Fetch pending AI Recommendations
      const recResp = await fetch(`${import.meta.env.VITE_API_URL || ''}/startup/intelligence/recommendations`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (recResp.ok) {
        const recJson = await recResp.json();
        setRecommendations(recJson.recommendations || []);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load command center');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandCenter();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setAddingTask(true);
    const token = localStorage.getItem('token');
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || ''}/startup/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ title: newTaskTitle, priority: 'HIGH' })
      });
      if (resp.ok) {
        setNewTaskTitle('');
        fetchCommandCenter();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingTask(false);
    }
  };

  const handleApproveRec = async (recId) => {
    setApprovingId(recId);
    const token = localStorage.getItem('token');
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || ''}/startup/intelligence/recommendations/${recId}/approve`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (resp.ok) {
        fetchCommandCenter();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectRec = async (recId) => {
    setApprovingId(recId);
    const token = localStorage.getItem('token');
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || ''}/startup/intelligence/recommendations/${recId}/reject`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (resp.ok) {
        fetchCommandCenter();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 text-[#FF4FA3] animate-spin mb-4" />
        <p className="text-sm font-extrabold text-slate-600">Initializing Startup Operating System...</p>
      </div>
    );
  }

  const healthScore = data?.health_score || 78;
  const scores = data?.scores || { market: 82, product: 74, revenue: 69, competition: 81, execution: 88 };
  const priorities = data?.priorities || [];
  const goals = data?.goals || [];
  const signals = data?.signals || [];
  const briefing = data?.ai_co_founder_briefing || {};

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto p-2 md:p-6 font-sans">
      {/* Header & Greeting Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4FA3]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-pink-300 backdrop-blur-md mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Startup OS v2.0 • Powered by LangGraph AI</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {data?.greeting || 'Good morning 👋'}
            </h1>
            <p className="text-slate-300 text-xs md:text-sm font-medium mt-1 max-w-xl">
              Here is your continuous daily startup briefing, dynamic health index, and proactive agent execution matrix.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/chat')}
              className="px-5 py-3 bg-gradient-to-r from-[#FF4FA3] to-[#E6006F] text-white font-bold rounded-2xl text-xs shadow-lg shadow-pink-500/30 flex items-center gap-2 cursor-pointer"
            >
              <Brain className="w-4 h-4" />
              <span>Talk to AI Co-Founder</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/30 rounded-3xl p-5 md:p-6 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF4FA3] to-purple-600 flex items-center justify-center shrink-0 shadow-md">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-[#FF4FA3] uppercase tracking-wider mb-1">
              AI Co-Founder Recommendation Today
            </h3>
            <p className="text-xs md:text-sm text-slate-800 font-semibold leading-relaxed">
              "{briefing.recommendation}"
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <button
            onClick={() => navigate('/chat')}
            className="w-full md:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-sm transition cursor-pointer"
          >
            Discuss Strategy with AI
          </button>
        </div>
      </div>

      {/* Startup Health Score & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Health Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Startup Health Index</span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-full border border-emerald-200">
                🟢 Good Standing
              </span>
            </div>

            <div className="flex items-baseline gap-3 my-2">
              <span className="text-6xl font-black text-slate-900">{healthScore}</span>
              <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 mb-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#FF4FA3] via-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { label: 'Market', val: scores.market, col: 'text-violet-600' },
              { label: 'Product', val: scores.product, col: 'text-sky-600' },
              { label: 'Revenue', val: scores.revenue, col: 'text-emerald-600' },
              { label: 'Competition', val: scores.competition, col: 'text-amber-600' },
              { label: 'Execution', val: scores.execution, col: 'text-pink-600' },
            ].map((s, i) => (
              <div key={i} className="p-2.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-center">
                <span className="text-[9px] font-black uppercase text-slate-400 block">{s.label}</span>
                <span className={`text-sm font-black ${s.col}`}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Progress (Cascading OKRs) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#FF4FA3]" />
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Cascading Goals (OKRs)</h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400">{goals.length} Active</span>
          </div>

          <div className="space-y-3.5 my-auto">
            {goals.map((g) => (
              <div key={g.id} className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100/80">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-800 truncate">{g.title}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${g.status === 'ON_TRACK' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                    {g.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-indigo-600 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/roadmap')}
            className="mt-4 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl transition border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Roadmap & Roadmap Goals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Signals & Proactive Alerts */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Proactive Signals</h3>
            </div>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Needs Attention
            </span>
          </div>

          <div className="space-y-3 my-auto">
            {signals.map((sig) => (
              <div key={sig.id} className="p-3 bg-rose-50/40 border border-rose-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${sig.severity === 'HIGH' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                  <span className="text-xs font-extrabold text-slate-800">{sig.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-tight">{sig.message}</p>
                {sig.recommendation && (
                  <p className="text-[10px] text-[#FF4FA3] font-bold mt-1.5">💡 {sig.recommendation}</p>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Pending AI Recommendations Section (Human-in-the-Loop) */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-slate-900/90 p-6 md:p-8 rounded-3xl border border-purple-500/30 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">AI Co-Founder Action Recommendations</h2>
              <p className="text-xs text-purple-200/80 font-medium">Review and approve AI proposals to convert them into executable tasks.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                      {rec.agent_name}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {rec.confidence_score}% Confidence
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white mb-1">{rec.title}</h3>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed mb-2">{rec.description}</p>
                  {rec.rationale && (
                    <p className="text-[11px] text-pink-300 font-semibold bg-pink-500/10 p-2 rounded-xl border border-pink-500/20 mb-3">
                      💡 {rec.rationale}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleApproveRec(rec.id)}
                    disabled={approvingId === rec.id}
                    className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Task</span>
                  </button>
                  <button
                    onClick={() => handleRejectRec(rec.id)}
                    disabled={approvingId === rec.id}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Tasks Board */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[#FF4FA3]" />
              <span>Startup Action Tasks</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Tasks recommended by AI managers linked directly to your company goals.
            </p>
          </div>

          {/* Create Task Form */}
          <form onSubmit={handleCreateTask} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Add new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]/30"
            />
            <button
              type="submit"
              disabled={addingTask}
              className="px-4 py-2 bg-[#FF4FA3] hover:bg-[#E6006F] text-white text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {priorities.map((task) => (
            <motion.div
              key={task.id}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-2xl border transition-all ${task.status === 'COMPLETED' ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 shadow-sm'
                }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <button
                  onClick={() => handleToggleTaskStatus(task.id, task.status)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer ${task.status === 'COMPLETED' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white hover:border-[#FF4FA3]'
                    }`}
                >
                  {task.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <span className={`text-xs font-bold flex-1 ${task.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {task.title}
                </span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${task.severity === 'HIGH' ? 'bg-rose-50 text-rose-600' : 'bg-sky-50 text-sky-600'
                  }`}>
                  {task.severity || 'MEDIUM'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
