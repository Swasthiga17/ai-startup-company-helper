import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let userMsg = "An unexpected error occurred.";
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        userMsg = "Authentication session expired. Please sign in again.";
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (status === 429) {
        userMsg = "AI service is temporarily rate-limited. Please try again shortly.";
      } else if (status === 503) {
        userMsg = "AI service is temporarily unavailable. Please retry.";
      } else if (status === 422) {
        userMsg = "Invalid input payload parameters. Please check your request.";
      } else if (error.response.data && error.response.data.error) {
        userMsg = error.response.data.error;
      }
    } else if (error.request) {
      userMsg = "Unable to connect to IdeaExecutor. Check your internet connection.";
    }
    error.userFriendlyMessage = userMsg;
    return Promise.reject(error);
  }
);

export async function analyzeStartup(idea) {
  const response = await api.post('/analyze', { idea });
  return response.data;
}

export async function downloadPdf(analysisId) {
  const response = await api.get('/download/pdf', { params: { analysisId }, responseType: 'blob' });
  return response.data;
}

export async function downloadPptx(analysisId) {
  const response = await api.get('/download/pptx', { params: { analysisId }, responseType: 'blob' });
  return response.data;
}

export async function sendChatMessage(message, idea) {
  const response = await api.post('/chat', { message, idea });
  return response.data;
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload-document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function getHistory() {
  const response = await api.get('/history');
  return response.data;
}

export async function getDocuments() {
  const response = await api.get('/documents');
  return response.data;
}

export async function deleteDocument(docId) {
  const response = await api.delete(`/documents/${docId}`);
  return response.data;
}

export async function generateDocument(docType, idea) {
  const response = await api.post('/ai/document/generate', { docType, idea });
  return response.data;
}

export async function getAdminStats() {
  const response = await api.get('/admin/stats');
  return response.data;
}

export async function getExecutionScore(idea, team_skills, budget, timeline) {
  const response = await api.post('/execution-score', { idea, team_skills, budget, timeline });
  return response.data;
}

export async function getWorkspaces() {
  const response = await api.get('/workspaces');
  return response.data;
}

export async function deleteWorkspace(workspaceId) {
  const response = await api.delete(`/workspaces/${workspaceId}`);
  return response.data;
}

export async function getActionItems() {
  const response = await api.get('/action-items');
  return response.data;
}

export async function createActionItem(title, priority = 'HIGH', reason = null) {
  const response = await api.post('/action-items', { title, priority, reason });
  return response.data;
}

export async function updateActionItem(itemId, status, priority = null) {
  const response = await api.patch(`/action-items/${itemId}`, { status, priority });
  return response.data;
}

export async function deleteActionItem(itemId) {
  const response = await api.delete(`/action-items/${itemId}`);
  return response.data;
}

export default api;