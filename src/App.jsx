import React from 'react';
import { Loader2 } from 'lucide-react';
import { ToastProvider } from './context/ToastContext';
import { HqAuthProvider, useHqAuth } from './context/HqAuthContext';
import { HqProvider, useHq } from './context/HqContext';
import HqLayout from './components/layout/HqLayout';
import HqLoginScreen from './components/screens/HqLoginScreen';
import OverviewScreen from './components/screens/OverviewScreen';
import FranchisesScreen from './components/screens/FranchisesScreen';
import ProductsScreen from './components/screens/ProductsScreen';
import CertificatesScreen from './components/screens/CertificatesScreen';
import RequestsScreen from './components/screens/RequestsScreen';
import AuditsScreen from './components/screens/AuditsScreen';

function HqRouter() {
  const { activeScreen } = useHq();

  switch (activeScreen) {
    case 'FRANCHISEE_LIST':
    case 'STORE_LIST':
      return <FranchisesScreen />;
    case 'AUDIT_LIST':
      return <AuditsScreen mode="ALL" />;
    case 'PASSED_AUDITS':
      return <AuditsScreen mode="PASSED" />;
    case 'FAILED_AUDITS':
      return <AuditsScreen mode="FAILED" />;
    case 'PRODUCT_LIST':
      return <ProductsScreen />;
    case 'CERTIFICATES':
      return <CertificatesScreen />;
    case 'FRANCHISEE_REQUESTS':
      return <RequestsScreen initialFilter="FRANCHISE" />;
    case 'STORE_REQUESTS':
      return <RequestsScreen initialFilter="STORE" />;
    case 'PRODUCT_REQUESTS':
      return <RequestsScreen initialFilter="PRODUCT" />;
    case 'DASHBOARD':
    default:
      return <OverviewScreen />;
  }
}

function AuthenticatedApp() {
  const { hqUser, isCheckingAuth } = useHqAuth();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-7 h-7 text-[#c8102e] animate-spin" />
        <p className="text-xs font-semibold text-stone-400">Verifying KFC Headquarters session...</p>
      </div>
    );
  }

  if (!hqUser) {
    return <HqLoginScreen />;
  }

  return (
    <HqProvider>
      <HqLayout>
        <HqRouter />
      </HqLayout>
    </HqProvider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <HqAuthProvider>
        <AuthenticatedApp />
      </HqAuthProvider>
    </ToastProvider>
  );
}
