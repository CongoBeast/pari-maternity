import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import PlaceholderPage from '../../components/PlaceholderPage';
import PatientDashboard from './PatientDashboard';

export default function PatientView({ user, onLogout }) {
  const [page, setPage] = useState('dashboard');

  const handleNav = (key) => {
    if (key === '__logout__') return onLogout();
    setPage(key);
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <PatientDashboard user={user} onNavigate={setPage} />;
      case 'prescriptions':
        return <PlaceholderPage title="Prescriptions" icon="Pill" />;
      case 'notifications':
        return <PlaceholderPage title="Notifications" icon="Bell" />;
      case 'history':
        return <PlaceholderPage title="Medical History" icon="History" />;
      case 'scans':
        return <PlaceholderPage title="Scans" icon="ScanLine" />;
      case 'myinfo':
        return <PlaceholderPage title="My Information" icon="UserCircle" />;
      case 'help':
        return <PlaceholderPage title="Help Center" icon="HelpCircle" />;
      default:
        return <PlaceholderPage title={page} icon="FileQuestion" />;
    }
  };

  return (
    <AppShell role="patient" user={user} activePage={page} onNavigate={handleNav}>
      {renderPage()}
    </AppShell>
  );
}
