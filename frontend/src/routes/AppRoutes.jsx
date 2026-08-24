import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from '../components/SplashScreen';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import InputPage from '../pages/InputPage';
import Impact from '../pages/Impact';
import MarketAnalysis from '../pages/MarketAnalysis';
import CompetitorAnalysis from '../pages/CompetitorAnalysis';
import SWOTAnalysis from '../pages/SWOTAnalysis';
import BusinessModel from '../pages/BusinessModel';
import ProblemValidation from '../pages/ProblemValidation';
import TargetCustomers from '../pages/TargetCustomers';
import ValueProposition from '../pages/ValueProposition';
import RevenueModel from '../pages/RevenueModel';
import FeaturePlanning from '../pages/FeaturePlanning';
import GoToMarket from '../pages/GoToMarket';
import LegalChecklist from '../pages/LegalChecklist';
import AIRecommendations from '../pages/AIRecommendations';
import Roadmap from '../pages/Roadmap';
import RevenueForecast from '../pages/RevenueForecast';
import PitchDeck from '../pages/PitchDeck';
import Chat from '../pages/Chat';
import Documents from '../pages/Documents';
import Login from '../pages/Login';
import Register from '../pages/Register';
import OnboardingShowcase from '../pages/OnboardingShowcase';
import BuildSphereOnboarding from '../pages/BuildSphereOnboarding';
import Marketing from '../pages/Marketing';

// Premium pages & New Pilot Features
import Workspace from '../pages/Workspace';
import WorkspaceHub from '../pages/WorkspaceHub';
import Pricing from '../pages/Pricing';
import Notifications from '../pages/Notifications';
import AdminPanel from '../pages/AdminPanel';
import LaunchReadiness from '../pages/LaunchReadiness';
import InvestorReadiness from '../pages/InvestorReadiness';
import InvestorMode from '../pages/InvestorMode';
import DevilsAdvocate from '../pages/DevilsAdvocate';
import DocumentGenerator from '../pages/DocumentGenerator';
import BrandCreation from '../pages/BrandCreation';
import SalesStrategy from '../pages/SalesStrategy';
import HiringPlan from '../pages/HiringPlan';
import TechStack from '../pages/TechStack';
import GrowthAdvisor from '../pages/GrowthAdvisor';

const titles = {
  '/dashboard': 'Executive Summary',
  '/problem-validation': 'Problem Validation',
  '/target-customers': 'Target Customers',
  '/value-prop': 'Value Proposition',
  '/revenue-model': 'Revenue Model',
  '/feature-planning': 'Feature Planning',
  '/gtm': 'Go-to-Market',
  '/legal': 'Legal Checklist',
  '/ai-recommendations': 'AI Recommendations',
  '/impact': 'Score & Impact',
  '/market': 'Market Analysis',
  '/competitors': 'Competitor Analysis',
  '/swot': 'SWOT Analysis',
  '/business-model': 'Business Model Canvas',
  '/roadmap': 'MVP Roadmap',
  '/revenue': 'Revenue Forecast',
  '/pitch-deck': 'Pitch Deck',
  '/chat': 'AI Mentor Chat',
  '/documents': 'Document Upload',
  '/workspace-hub': 'Workspace Hub',
  '/devils-advocate': "Devil's Advocate & Pivots",
  '/launch-readiness': 'Launch Readiness Dashboard',
  '/investor-readiness': 'Investor Readiness Score',
  '/investor-mode': 'Investor Mode & Funding Suite',
  '/brand-creation': 'Brand Creation & Identity',
  '/sales-strategy': 'Sales Strategy & Outreach',
  '/hiring-plan': 'Hiring Plan & Team',
  '/tech-stack': 'Technology Stack',
  '/growth-advisor': 'Growth Advisor & Virality',
  '/document-generator': 'Document Generator',
};

function ProtectedRoute({ children }) {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
  return token ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Routes>
      <Route path="/" element={<Marketing />} />
      <Route path="/onboarding" element={<BuildSphereOnboarding />} />
      <Route path="/showcase" element={<OnboardingShowcase />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/input" element={<ProtectedRoute><InputPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout title={titles['/dashboard']}><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/impact" element={<ProtectedRoute><Layout title={titles['/impact']}><Impact /></Layout></ProtectedRoute>} />
      <Route path="/market" element={<ProtectedRoute><Layout title={titles['/market']}><MarketAnalysis /></Layout></ProtectedRoute>} />
      <Route path="/problem-validation" element={<ProtectedRoute><Layout title={titles['/problem-validation']}><ProblemValidation /></Layout></ProtectedRoute>} />
      <Route path="/target-customers" element={<ProtectedRoute><Layout title={titles['/target-customers']}><TargetCustomers /></Layout></ProtectedRoute>} />
      <Route path="/competitors" element={<ProtectedRoute><Layout title={titles['/competitors']}><CompetitorAnalysis /></Layout></ProtectedRoute>} />
      <Route path="/value-prop" element={<ProtectedRoute><Layout title={titles['/value-prop']}><ValueProposition /></Layout></ProtectedRoute>} />
      <Route path="/business-model" element={<ProtectedRoute><Layout title="Business Model"><BusinessModel /></Layout></ProtectedRoute>} />
      <Route path="/revenue-model" element={<ProtectedRoute><Layout title={titles['/revenue-model']}><RevenueModel /></Layout></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><Layout title={titles['/roadmap']}><Roadmap /></Layout></ProtectedRoute>} />
      <Route path="/feature-planning" element={<ProtectedRoute><Layout title={titles['/feature-planning']}><FeaturePlanning /></Layout></ProtectedRoute>} />
      <Route path="/gtm" element={<ProtectedRoute><Layout title={titles['/gtm']}><GoToMarket /></Layout></ProtectedRoute>} />
      <Route path="/revenue" element={<ProtectedRoute><Layout title={titles['/revenue']}><RevenueForecast /></Layout></ProtectedRoute>} />
      <Route path="/pitch-deck" element={<ProtectedRoute><Layout title={titles['/pitch-deck']}><PitchDeck /></Layout></ProtectedRoute>} />
      <Route path="/legal" element={<ProtectedRoute><Layout title={titles['/legal']}><LegalChecklist /></Layout></ProtectedRoute>} />
      <Route path="/swot" element={<ProtectedRoute><Layout title={titles['/swot']}><SWOTAnalysis /></Layout></ProtectedRoute>} />
      <Route path="/ai-recommendations" element={<ProtectedRoute><Layout title={titles['/ai-recommendations']}><AIRecommendations /></Layout></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><Layout title={titles['/documents']}><Documents /></Layout></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Layout title={titles['/chat']}><Chat /></Layout></ProtectedRoute>} />

      {/* New 25 Pilot Feature Routes */}
      <Route path="/brand-creation" element={<ProtectedRoute><Layout title={titles['/brand-creation']}><BrandCreation /></Layout></ProtectedRoute>} />
      <Route path="/sales-strategy" element={<ProtectedRoute><Layout title={titles['/sales-strategy']}><SalesStrategy /></Layout></ProtectedRoute>} />
      <Route path="/hiring-plan" element={<ProtectedRoute><Layout title={titles['/hiring-plan']}><HiringPlan /></Layout></ProtectedRoute>} />
      <Route path="/tech-stack" element={<ProtectedRoute><Layout title={titles['/tech-stack']}><TechStack /></Layout></ProtectedRoute>} />
      <Route path="/growth-advisor" element={<ProtectedRoute><Layout title={titles['/growth-advisor']}><GrowthAdvisor /></Layout></ProtectedRoute>} />
      <Route path="/document-generator" element={<ProtectedRoute><Layout title={titles['/document-generator']}><DocumentGenerator /></Layout></ProtectedRoute>} />
      <Route path="/investor-mode" element={<ProtectedRoute><Layout title={titles['/investor-mode']}><InvestorMode /></Layout></ProtectedRoute>} />

      {/* Premium Route bindings */}
      <Route path="/workspace" element={<ProtectedRoute><Layout title="Workspace"><Workspace /></Layout></ProtectedRoute>} />
      <Route path="/workspace-hub" element={<ProtectedRoute><Layout title={titles['/workspace-hub']}><WorkspaceHub /></Layout></ProtectedRoute>} />
      <Route path="/investor-readiness" element={<ProtectedRoute><Layout title={titles['/investor-readiness']}><InvestorReadiness /></Layout></ProtectedRoute>} />
      <Route path="/pricing" element={<ProtectedRoute><Layout title="Pricing Plans"><Pricing /></Layout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Layout title="Notifications"><Notifications /></Layout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Layout title="Admin Panel"><AdminPanel /></Layout></ProtectedRoute>} />
      <Route path="/launch-readiness" element={<ProtectedRoute><Layout title={titles['/launch-readiness']}><LaunchReadiness /></Layout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
  );
}
