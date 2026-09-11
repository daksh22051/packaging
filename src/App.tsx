import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layout
import { AppLayout } from './components/layout/AppLayout';

// Public & Onboarding Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';

// Authenticated Application Pages
import { DashboardPage } from './pages/DashboardPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { MaterialDetailPage } from './pages/MaterialDetailPage';
import { AddMaterialPage } from './pages/AddMaterialPage';
import { MyMaterialsPage } from './pages/MyMaterialsPage';
import { SmartMatchesPage } from './pages/SmartMatchesPage';
import { MatchDetailPage } from './pages/MatchDetailPage';
import { LogisticsPage } from './pages/LogisticsPage';
import { ImpactPage } from './pages/ImpactPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { OpportunityMapPage } from './pages/OpportunityMapPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { TransactionDetailPage } from './pages/TransactionDetailPage';
import { CompanyProfilePage } from './pages/CompanyProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication & Conversion Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Authenticated Application Workspace (Framed by AppLayout) */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/:id" element={<MaterialDetailPage />} />
            <Route path="/materials" element={<MyMaterialsPage />} />
            <Route path="/my-materials" element={<MyMaterialsPage />} />
            <Route path="/materials/new" element={<AddMaterialPage />} />
            <Route path="/matches" element={<SmartMatchesPage />} />
            <Route path="/matches/:id" element={<MatchDetailPage />} />
            <Route path="/logistics" element={<LogisticsPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/opportunity-map" element={<OpportunityMapPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transactions/:id" element={<TransactionDetailPage />} />
            <Route path="/companies/:id" element={<CompanyProfilePage />} />
            <Route path="/company/:id" element={<CompanyProfilePage />} />
            <Route path="/profile" element={<CompanyProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
