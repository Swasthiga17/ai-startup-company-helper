import React from 'react';
import { createContext, useState, useCallback } from 'react';
import { analyzeStartup, downloadPdf as dlPdf, downloadPptx as dlPptx, sendChatMessage, getHistory, generateDocument, deleteWorkspace } from '../services/api';
import PushToast from '../components/PushToast';
import { sendPushNotification, requestNotificationPermission } from '../utils/pushNotification';




const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startups, setStartups] = useState([]);
  const [currentStartup, setCurrentStartup] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', text: 'AI Reports Generated Successfully', time: 'Just now' },
    { id: 2, type: 'info', text: 'System Analysis Engine v2.0 Online', time: '5 mins ago' },
    { id: 3, type: 'success', text: 'Pitch Deck PDF Document Ready', time: '10 mins ago' },
  ]);

  const loadStartups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getHistory();
      const list = result.data || [];
      const parsed = list.map(item => {
        try {
          return {
            id: item.id,
            idea: item.idea,
            createdAt: item.createdAt,
            ...JSON.parse(item.payload)
          };
        } catch {
          return { id: item.id, idea: item.idea, createdAt: item.createdAt };
        }
      });
      setStartups(parsed);
      if (parsed.length > 0) {
        setCurrentStartup(parsed[0]);
        setAnalysis(parsed[0]);
      }
      return parsed;
    } catch (err) {
      console.error('Failed to load startups:', err);
      setError('Failed to fetch startups list');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectStartup = useCallback((id) => {
    const found = startups.find(s => s.id === id);
    if (found) {
      setCurrentStartup(found);
      setAnalysis(found);
    }
  }, [startups]);

  const analyze = useCallback(async (idea) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeStartup(idea);
      const analysisData = result.data || result;
      if (result.analysisId) {
        analysisData.id = result.analysisId;
      }
      setAnalysis(analysisData);
      
      // Push startup created notification
      setNotifications(prev => [
        { id: Date.now(), type: 'success', text: `Analysis created for ${idea.substring(0, 15)}...`, time: 'Just now' },
        ...prev
      ]);

      await loadStartups();
      return analysisData;
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      const msg = err?.response?.data?.detail || err?.message || 'Analysis failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadStartups]);

  const downloadPdf = useCallback(async () => {
    if (!analysis || !analysis.id) return;
    try {
      const blob = await dlPdf(analysis.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'startup-report.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('PDF download failed');
    }
  }, [analysis]);

  const downloadPptx = useCallback(async () => {
    if (!analysis || !analysis.id) return;
    try {
      const blob = await dlPptx(analysis.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pitch-deck.pptx';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('PPTX download failed');
    }
  }, [analysis]);

  const chat = useCallback(async (message, idea) => {
    setError(null);
    try {
      const result = await sendChatMessage(message, idea);
      return result.reply || 'No response';
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Chat failed';
      setError(msg);
      throw err;
    }
  }, []);

  const generateDoc = useCallback(async (docType, idea) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateDocument(docType, idea);
      return result.content;
    } catch (err) {
      setError('Document generation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const [activeToast, setActiveToast] = useState(null);


  const triggerPushNotification = useCallback((title, message, type = 'success') => {
    // 1. Desktop push notification
    sendPushNotification(title, message);

    // 2. In-app floating toast
    setActiveToast({ title, message, type });
    setTimeout(() => setActiveToast(null), 4000);

    // 3. Add to notifications list
    setNotifications(prev => [
      { id: Date.now(), type, text: `${title}: ${message}`, time: 'Just now' },
      ...prev
    ]);
  }, []);

  const removeStartup = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteWorkspace(id);
      setStartups(prev => {
        const updated = prev.filter(s => s.id !== id);
        if (currentStartup?.id === id) {
          const nextStartup = updated.length > 0 ? updated[0] : null;
          setCurrentStartup(nextStartup);
          setAnalysis(nextStartup);
        }
        return updated;
      });
      triggerPushNotification('Workspace Removed', 'Startup project has been deleted.', 'info');
    } catch (err) {
      console.error('Failed to remove startup:', err);
      setError('Failed to delete workspace');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentStartup, triggerPushNotification]);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return (
    <AppContext.Provider value={{ 
      analysis, 
      loading, 
      error, 
      startups, 
      currentStartup, 
      notifications,
      activeToast,
      triggerPushNotification,
      requestNotificationPermission,
      analyze, 
      downloadPdf, 
      downloadPptx, 
      chat, 
      reset, 
      setError,
      loadStartups,
      selectStartup,
      removeStartup,
      generateDoc
    }}>
      {children}
      <PushToast toast={activeToast} onClose={() => setActiveToast(null)} />
    </AppContext.Provider>
  );
}


export function useApp() {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}