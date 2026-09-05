import React,{useState} from 'react';
import AppShell from '../../components/AppShell';
import FinanceDashboard from './FinanceDashboard';
import AccountingPage from './AccountingPage';
export default function FinanceView({user,onLogout}){const [page,setPage]=useState('dashboard'); const nav=k=>k==='__logout__'?onLogout():setPage(k); return <AppShell role="finance" user={user} activePage={page} onNavigate={nav}>{page==='dashboard'?<FinanceDashboard/>:<AccountingPage/>}</AppShell>}
