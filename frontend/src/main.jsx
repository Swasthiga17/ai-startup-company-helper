import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function Root() {
  // Always wrap with GoogleOAuthProvider (using dummy ID if env var missing)
  // to prevent useGoogleLogin in Login.jsx / Register.jsx from crashing React.
  const clientId = googleClientId || 'missing-client-id.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <HashRouter>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </HashRouter>
    </GoogleOAuthProvider>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
