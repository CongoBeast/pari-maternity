import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';

import LoginPage        from './pages/LoginPage';
import DoctorView       from './views/doctor/DoctorView';
import AdminView        from './views/admin/AdminView';
import PatientView      from './views/patient/PatientView';
import BirthRecordsView from './views/birthrecords/BirthRecordsView';
import FinanceView from './views/finance/FinanceView';

const SESSION_KEY = 'pm-session';

/**
 * App — top-level router.
 * Manages authentication state only.
 * All role-specific routing is handled by each *View component.
 */
export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const handleLogin = (u) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  if (!user) return <LoginPage onLogin={handleLogin} />;

  switch (user.role) {
    case 'doctor':
      return <DoctorView user={user} onLogout={handleLogout} />;
    case 'admin':
      return <AdminView user={user} onLogout={handleLogout} />;
    case 'patient':
      return <PatientView user={user} onLogout={handleLogout} />;
    case 'birthRecord':
      return <BirthRecordsView user={user} onLogout={handleLogout} />;
    case 'finance':
      return <FinanceView user={user} onLogout={handleLogout} />;
    default:
      return <LoginPage onLogin={handleLogin} />;
  }
}
