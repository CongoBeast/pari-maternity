import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import PlaceholderPage from '../../components/PlaceholderPage';
import FinanceDashboard from './FinanceDashboard';
import AccountingPage from './AccountingPage';
import FinanceBillingPage from './FinanceBillingPage';
import SuppliersPage from '../admin/SuppliersPage';
import InsuranceClaimsPage from '../admin/InsuranceClaimsPage';

export default function FinanceView({ user, onLogout }) {
  const [page, setPage] = useState('dashboard');

  const handleNav = (key) => {
    if (key === '__logout__') return onLogout();
    setPage(key);
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <FinanceDashboard onNavigate={setPage} />;
      case 'accounting': return <AccountingPage />;
      case 'billing': return <FinanceBillingPage />;
      case 'suppliers': return <SuppliersPage />;
      case 'insurance': return <InsuranceClaimsPage />;
      case 'myinfo': return <PlaceholderPage title="My Information" icon="UserCircle" />;
      case 'help': return <PlaceholderPage title="Help Center" icon="HelpCircle" />;
      default: return <PlaceholderPage title={page} icon="FileQuestion" />;
    }
  };

  return (
    <AppShell role="finance" user={user} activePage={page} onNavigate={handleNav}>
      {renderPage()}
    </AppShell>
  );
}
