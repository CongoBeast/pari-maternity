import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import PlaceholderPage from '../../components/PlaceholderPage';
import BirthRecordsDashboard from './BirthRecordsDashboard';
import BirthRecordsInfo from './BirthRecordsInfo';
import SearchRecords from './SearchRecords';
import Notifications from './Notifications';

export default function BirthRecordsView({ user, onLogout }) {
  const [page, setPage] = useState('dashboard');

  const handleNav = (key) => {
    if (key === '__logout__') return onLogout();
    setPage(key);
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <BirthRecordsDashboard user={user} onNavigate={setPage} />;
      case 'search':
        return <SearchRecords title="Search Records" icon="Search" />;
      case 'notifications':
        return <Notifications title="Notifications" icon="Bell" />;
      case 'myinfo':
        return <BirthRecordsInfo title="My Information" icon="UserCircle" />;
      case 'help':
        return <PlaceholderPage title="Help Center" icon="HelpCircle" />;
      default:
        return <PlaceholderPage title={page} icon="FileQuestion" />;
    }
  };

  return (
    <AppShell role="birthRecord" user={user} activePage={page} onNavigate={handleNav}>
      {renderPage()}
    </AppShell>
  );
}
