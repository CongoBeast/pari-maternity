import PatientAccountPage from './PatientAccountPage';
import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import PlaceholderPage from '../../components/PlaceholderPage';
import PatientDashboard from './PatientDashboard';
import Prescriptions from './Prescriptions';
import PatientInfo from './PatientInfo';
import Scans from './Scans';
import PatientHistory from './PatientHistory';
import PatientNotifications from './PatientNofitications';

export default function PatientView({ user, onLogout }) {
  const [page, setPage] = useState('dashboard');

  const handleNav = (key) => {
    if (key === '__logout__') return onLogout();
    setPage(key);
  };

  const renderPage = () => {
    switch (page) {
      case 'account': return <PatientAccountPage />;
      case 'dashboard':
        return <PatientDashboard user={user} onNavigate={setPage} />;
      case 'prescriptions':
        return <Prescriptions title="Prescriptions" icon="Pill" />;
      case 'notifications':
        return <PatientNotifications title="Notifications" icon="Bell" />;
      case 'history':
        return <PatientHistory title="Medical History" icon="History" />;
      case 'scans':
        return <Scans title="Scans" icon="ScanLine" />;
      case 'myinfo':
        return <PatientInfo title="My Information" icon="UserCircle" />;
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
