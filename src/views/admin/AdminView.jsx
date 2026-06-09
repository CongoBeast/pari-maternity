import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import PlaceholderPage from '../../components/PlaceholderPage';
import AdminDashboard from './AdminDashboard';
import StaffManagementPage from './StaffManagementPage';
import FacilityManagementPage from './FacilityManagementPage';
import FaultReportsPage from './FaultReportsPage';
import AttendanceManagementPage from './AttendanceManagementPage';
import WardOccupancyPage from './WardOccupancyPage';
import BirthRecordsDashboard from '../birthrecords/BirthRecordsDashboard';
import InventoryManagementPage from './InventoryManagementPage';


export default function AdminView({ user, onLogout }) {
  const [page, setPage] = useState('dashboard');
  const onNavigate = (key) => setPage(key);

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
        return <FacilityManagementPage title="Management" icon="Building2" />;
      case 'patients':
        return <PlaceholderPage title="Patient Records" icon="FolderOpen" />;
      case 'ward':
        return <WardOccupancyPage title="Ward Management" icon="BedDouble" />;
      case 'inventory':
        return <InventoryManagementPage title="Inventory Management" icon="Package" />;
      case 'fault':
        return <FaultReportsPage title="Fault Reports" icon="AlertTriangle" />;
      case 'birth':
        return <BirthRecordsDashboard title="Birth Records" icon="Baby" />;
      case 'attendance':
        return <AttendanceManagementPage title="Attendance Records" icon="ClipboardList" />;
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
