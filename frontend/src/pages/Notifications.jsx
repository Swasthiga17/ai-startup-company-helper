import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, Info, AlertTriangle, Trash2 } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Notifications() {
  const { notifications, triggerPushNotification, requestNotificationPermission } = useApp();


  const getAlertStyle = (type) => {
    switch (type) {
      case 'success':
        return { icon: CheckCircle2, color: 'text-emerald-650', bg: 'bg-emerald-50/50 border-emerald-100' };
      case 'info':
        return { icon: Info, color: 'text-blue-650', bg: 'bg-blue-50/50 border-blue-100' };
      case 'warning':
        return { icon: AlertTriangle, color: 'text-amber-650', bg: 'bg-amber-50/50 border-amber-100' };
      default:
        return { icon: Zap, color: 'text-slate-650', bg: 'bg-slate-50 border-slate-100' };
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-left">
      
      {/* Title Card */}
      <motion.div variants={item} className="rounded-2xl p-6 relative overflow-hidden bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-pink-600" />
            <h2 className="text-xl font-bold text-slate-800">Push & System Notifications</h2>
          </div>
          <p className="text-xs text-slate-450 font-semibold">Real-time alerts, report statuses, and desktop push notifications.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              const granted = await requestNotificationPermission();
              if (granted) {
                triggerPushNotification('Push Notifications Active 🔔', 'Desktop & In-App Push alerts are now enabled!', 'success');
              } else {
                alert('Notification permission denied by browser.');
              }
            }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-xs font-extrabold rounded-xl shadow transition"
          >
            Enable Desktop Push
          </button>
          <button
            onClick={() => triggerPushNotification('AI Execution Alert 🚀', 'Pitch Deck & Financial Model ready for download.', 'info')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Test Push
          </button>
        </div>
      </motion.div>


      {/* Notifications list */}
      <motion.div variants={item} className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((n) => {
            const config = getAlertStyle(n.type);
            const Icon = config.icon;
            return (
              <div 
                key={n.id} 
                className={`rounded-2xl p-4 border flex items-start gap-3.5 transition-all shadow-xs bg-white ${config.bg}`}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
                  <Icon className={`w-4.5 h-4.5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 leading-snug">{n.text}</p>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">{n.time}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl p-8 border border-slate-100 bg-white shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto shadow-inner">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-855">Inbox Empty</h4>
            <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto">No alerts or analysis run events logged.</p>
          </div>
        )}
      </motion.div>

    </motion.div>
  );
}
