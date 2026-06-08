import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import PlaceholderPage from '../../components/PlaceholderPage';
import AdminDashboard from './AdminDashboard';
import StaffManagementPage from './StaffManagementPage';

export default function AdminView({ user, onLogout }) {
  const [page, setPage] = useState('dashboard');

  const handleNav = (key) => {
    if (key === '__logout__') return onLogout();
    setPage(key);
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <AdminDashboard user={user} onNavigate={setPage} />;
      case 'staff':
        return <StaffManagementPage title="Staff Management" icon="UserCog" />;
      case 'management':
        return <PlaceholderPage title="Management" icon="Building2" />;
      case 'patients':
        return <PlaceholderPage title="Patient Records" icon="FolderOpen" />;
      case 'ward':
        return <PlaceholderPage title="Ward Management" icon="BedDouble" />;
      case 'inventory':
        return <PlaceholderPage title="Inventory Management" icon="Package" />;
      case 'fault':
        return <PlaceholderPage title="Fault Reports" icon="AlertTriangle" />;
      case 'birth':
        return <PlaceholderPage title="Birth Records" icon="Baby" />;
      case 'attendance':
        return <PlaceholderPage title="Attendance Records" icon="ClipboardList" />;
      case 'myinfo':
        return <PlaceholderPage title="My Information" icon="UserCircle" />;
      case 'help':
        return <PlaceholderPage title="Help Center" icon="HelpCircle" />;
      default:
        return <PlaceholderPage title={page} icon="FileQuestion" />;
    }
  };

  return (
    <AppShell role="admin" user={user} activePage={page} onNavigate={handleNav}>
      {renderPage()}
    </AppShell>
  );
}
