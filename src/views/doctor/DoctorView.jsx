import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import PlaceholderPage from '../../components/PlaceholderPage';
import TheatreScheduling from './TheatreScheduling';
import PrescriptionsPage from './PrescriptionsPage';
import DoctorLabTests from './DoctorLabTests';
import DoctorMyInfo from './DoctorMyInfo';
import DoctorAttendance from './DoctorAttendance';
import DoctorDashboard from './DoctorDashboard';
import PatientsPage from './PatientsPage';

/**
 * DoctorView — master router for the doctor role.
 * To add a new page: import it and add a case below.
 */
export default function DoctorView({ user, onLogout }) {
  const [page, setPage] = useState('dashboard');

  const handleNav = (key) => {
    if (key === '__logout__') return onLogout();
    setPage(key);
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DoctorDashboard user={user} onNavigate={setPage} />;
      case 'theatre':
        return <TheatreScheduling title="Theatre Scheduling" icon="Calendar" />;
      case 'patients':
        return <PatientsPage title="Patients" icon="Users" />;
      case 'labtests':
        return <DoctorLabTests title="Lab Tests" icon="FlaskConical" />;
      case 'prescriptions':
        return <PrescriptionsPage title="Prescription Records" icon="Pill" />;
      case 'attendance':
        return <DoctorAttendance title="Attendance Records" icon="ClipboardList" />;
      case 'myinfo':
        return <DoctorMyInfo title="My Information" icon="UserCircle" />;
      case 'help':
        return <PlaceholderPage title="Help Center" icon="HelpCircle" />;
      default:
        return <PlaceholderPage title={page} icon="FileQuestion" />;
    }
  };

  return (
    <AppShell role="doctor" user={user} activePage={page} onNavigate={handleNav}>
      {renderPage()}
    </AppShell>
  );
}
