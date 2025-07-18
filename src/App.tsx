import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'

// Layout
import AppLayout from '@/components/layout/AppLayout'

// Pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import OnboardingPage from '@/pages/onboarding/OnboardingPage'
import PricingPage from '@/pages/pricing/PricingPage'
import CheckoutPage from '@/pages/checkout/CheckoutPage'
import DashboardPage from '@/pages/app/DashboardPage'
import AgentBuilderPage from '@/pages/app/AgentBuilderPage'
import KnowledgeBasePage from '@/pages/app/KnowledgeBasePage'
import ConversationsPage from '@/pages/app/ConversationsPage'
import EvaluateAgentPage from '@/pages/app/EvaluateAgentPage'
import SettingsPage from '@/pages/app/SettingsPage'
import SupportPage from '@/pages/app/SupportPage'
import NotFoundPage from '@/pages/NotFoundPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen surface-00">
        <Routes>
          {/* Landing */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Authentication */}
          <Route path="/auth/login" element={<LoginPage />} />
          
          {/* Onboarding */}
          <Route path="/onboarding" element={<Navigate to="/onboarding/step-1" replace />} />
          <Route path="/onboarding/:step" element={<OnboardingPage />} />
          
          {/* Pricing & Checkout - Required after onboarding */}
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          
          {/* App Routes with Layout */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/home" replace />} />
            <Route path="home" element={<DashboardPage />} />
            
            {/* AI Agent Routes */}
            <Route path="ai/agent-builder" element={<AgentBuilderPage />} />
            <Route path="ai/agent-builder/:id/personalise" element={<AgentBuilderPage />} />
            <Route path="ai/knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="ai/conversations" element={<ConversationsPage />} />
            <Route path="ai/evaluate" element={<EvaluateAgentPage />} />
            
            {/* Analytics Routes */}
            <Route path="analytics/reports" element={<DashboardPage />} />
            
            {/* Settings Routes */}
            <Route path="settings/manage-accounts" element={<SettingsPage />} />
            <Route path="settings/users-roles" element={<SettingsPage />} />
            <Route path="settings/billing" element={<SettingsPage />} />
            
            {/* Support Routes */}
            <Route path="support/docs" element={<SupportPage />} />
            <Route path="support/contact" element={<SupportPage />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        
        <Toaster 
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--surface-01))',
              border: '1px solid hsl(var(--surface-stroke))',
              color: 'hsl(var(--text-high))',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App