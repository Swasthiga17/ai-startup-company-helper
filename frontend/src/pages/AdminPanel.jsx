import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Cpu, FileText, Activity } from 'lucide-react';
import { getAdminStats } from '../services/api';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AdminPanel() {
  const [data, setData] = useState({
    stats: { total_users: 0, total_analyses: 0, total_documents: 0 },
    users: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        if (res.status === 'success') {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Registered Users', value: loading ? '...' : String(data.stats.total_users), icon: Users, color: 'text-violet-600 bg-violet-50 border-violet-100' },
    { label: 'Reports Generated', value: loading ? '...' : String(data.stats.total_analyses), icon: FileText, color: 'text-pink-600 bg-pink-50 border-pink-100' },
    { label: 'Knowledge Base Uploads', value: loading ? '...' : String(data.stats.total_documents), icon: Cpu, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
    { label: 'Active Sessions', value: 'Online', icon: Activity, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left">
      
      {/* Title Card */}
      <motion.div variants={item} className="rounded-2xl p-6 relative overflow-hidden bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-6 h-6 text-slate-800" />
          <h2 className="text-xl font-bold text-slate-800">Admin Control Panel</h2>
        </div>
        <p className="text-xs text-slate-450 font-semibold">Diagnostic dashboard and API resource monitoring console.</p>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-2xl p-5 bg-white border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-xl font-black text-slate-800">{stat.value}</h3>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${stat.color}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Diagnostic Logs & User List Mock */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User list */}
        <div className="lg:col-span-2 rounded-2xl p-6 bg-white border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
            <Users className="w-5 h-5 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recent Registrations</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-650 font-semibold text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                  <th className="py-2.5">User</th>
                  <th className="py-2.5">Email</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.users.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-2.5 text-slate-800">{u.name}</td>
                    <td className="py-2.5 font-mono text-[11px]">{u.email}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        u.status === 'Starter' ? 'bg-slate-100 text-slate-500' : 'bg-violet-50 text-violet-700 border border-violet-100'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagnostic Logs */}
        <div className="lg:col-span-1 rounded-2xl p-6 bg-white border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
            <Activity className="w-5 h-5 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Live System Logs</h3>
          </div>
          
          <div className="font-mono text-[10px] text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 leading-relaxed max-h-[220px] overflow-y-auto">
            <p className="text-emerald-600 font-bold">[INFO] 23:00:15 - Express database sync OK</p>
            <p className="text-slate-600">[REQ] 23:01:04 - POST /analyze successful (200)</p>
            <p className="text-slate-600">[REQ] 23:01:42 - GET /download/pdf successful (200)</p>
            <p className="text-indigo-600 font-bold">[AI] 23:02:11 - Gemini-2.5-pro document response compiled</p>
            <p className="text-slate-600">[REQ] 23:02:15 - POST /chat completed (200)</p>
          </div>
        </div>

      </motion.div>

    </motion.div>
  );
}
