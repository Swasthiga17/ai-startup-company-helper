import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, ListTodo, Trash2 } from 'lucide-react';
import { getActionItems, updateActionItem, deleteActionItem } from '../services/api';

export default function ActionItemsChecklist({ items = [] }) {
  const [dbItems, setDbItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActionItems();
  }, []);

  const fetchActionItems = async () => {
    try {
      setLoading(true);
      const res = await getActionItems();
      if (res && res.items) {
        setDbItems(res.items);
      }
    } catch (err) {
      console.warn("Could not fetch remote action items, using prop items:", err);
    } finally {
      setLoading(false);
    }
  };

  const activeList = dbItems.length > 0 
    ? dbItems 
    : (items.length > 0 ? items.map((it, idx) => typeof it === 'string' ? { id: idx, title: it, status: 'TODO', priority: 'HIGH', category: 'VALIDATION' } : it) : [
        { id: 1, title: "Interview 10 target customers to validate pain points", status: 'TODO', priority: 'HIGH', category: 'VALIDATION' },
        { id: 2, title: "Set up landing page waitlist and hero copy", status: 'TODO', priority: 'HIGH', category: 'PRODUCT' },
        { id: 3, title: "Calculate 12-month CAC payback period", status: 'TODO', priority: 'MEDIUM', category: 'BUSINESS' }
      ]);

  const toggleItemStatus = async (item) => {
    const nextStatus = item.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    
    // Optimistic UI update
    setDbItems(prev => prev.map(it => it.id === item.id ? { ...it, status: nextStatus } : it));

    if (item.id && typeof item.id === 'number' && dbItems.length > 0) {
      try {
        await updateActionItem(item.id, nextStatus);
      } catch (err) {
        console.error("Failed to toggle item status on server:", err);
        fetchActionItems();
      }
    }
  };

  const handleDelete = async (e, itemId) => {
    e.stopPropagation();
    setDbItems(prev => prev.filter(it => it.id !== itemId));

    if (itemId && typeof itemId === 'number' && dbItems.length > 0) {
      try {
        await deleteActionItem(itemId);
      } catch (err) {
        console.error("Failed to delete action item on server:", err);
        fetchActionItems();
      }
    }
  };

  const completedCount = activeList.filter(it => it.status === 'COMPLETED').length;
  const progressPercent = activeList.length > 0 ? Math.round((completedCount / activeList.length) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <ListTodo className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">Recommended Next Steps</h3>
            <p className="text-[10px] text-slate-400 font-bold">Persistent AI-generated checklist for your startup</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-indigo-600 font-mono">{completedCount}/{activeList.length}</span>
          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {activeList.map((item) => {
          const isChecked = item.status === 'COMPLETED';
          return (
            <div 
              key={item.id}
              onClick={() => toggleItemStatus(item)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isChecked 
                  ? 'bg-emerald-50/40 border-emerald-200 text-slate-400 line-through' 
                  : 'bg-slate-50/60 border-slate-100 text-slate-700 hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <div>
                  <span className="text-xs font-bold block">{item.title}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.priority && (
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                        item.priority === 'CRITICAL' || item.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.priority}
                      </span>
                    )}
                    {item.category && (
                      <span className="text-[9px] font-bold uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                        {item.category}
                      </span>
                    )}
                    {item.source_agent && (
                      <span className="text-[9px] font-bold text-slate-400">
                        Source: {item.source_agent}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isChecked && (
                  <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Done
                  </span>
                )}
                {dbItems.length > 0 && (
                  <button 
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
