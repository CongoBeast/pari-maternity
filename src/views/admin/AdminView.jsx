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
import PatientRecordsPage from './PatientRecordsPage';
import DispensaryManagementPage from './DispensaryManagementPage';
import BloodBankPage from './BloodBankPage';
import SuppliersPage from './SuppliersPage';
import InsuranceClaimsPage from './InsuranceClaimsPage';
import BillingManagementPage from './BillingManagementPage';
import EmergencyManagementPage from './EmergencyManagementPage';
import MedicalAssetsPage from './MedicalAssetsPage';
import QueueManagementPage from './QueueManagementPage';


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
        return <PatientRecordsPage title="Patient Records" icon="FolderOpen" />;
      case 'ward':
        return <WardOccupancyPage title="Ward Management" icon="BedDouble" />;
      case 'dispensary':
        return <DispensaryManagementPage title="Dispensary Management" icon="BedDouble" />;
      case 'inventory':
        return <InventoryManagementPage title="Inventory Management" icon="Package" />;
      case 'blood':
        return <BloodBankPage title="Blood Bank Management" icon="Droplet" />;
      case 'fault':
        return <FaultReportsPage title="Fault Reports" icon="AlertTriangle" />;
      case 'birth':
        return <BirthRecordsDashboard title="Birth Records" icon="Baby" onNavigate={setPage} />;
      case 'suppliers':
        return <SuppliersPage title="Manage Suppliers" icon="Van"/>;
      case 'insurance':
        return <InsuranceClaimsPage title="Insurance Management" icon="WalletCards"/>;
      case 'billing': return <BillingManagementPage />;
      case 'emergency': return <EmergencyManagementPage />;
      case 'assets': return <MedicalAssetsPage />;
      case 'queue': return <QueueManagementPage />;
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