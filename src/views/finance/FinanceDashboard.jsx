import React, { useMemo, useState } from 'react';
import {
  DollarSign, TrendingUp, Receipt, Landmark, ShieldCheck, ArrowRight, Eye,
  CircleDollarSign, WalletCards, Banknote, X, CheckCircle2, Building2,
} from 'lucide-react';
import { getFinanceData, invoiceBalance, money } from '../../data/billingStore';

function PaymentModal({ payment, patient, invoice, onClose }) {
  if (!payment) return null;
  const row = (label, value) => <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--pm-border)', fontSize: '0.82rem' }}><span style={{ color: 'var(--pm-text-muted)' }}>{label}</span><strong style={{ textAlign: 'right' }}>{value}</strong></div>;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1060, background: 'rgba(8,15,30,.58)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="pm-card pm-fade-in" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 540, padding: 0, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ padding: 20, borderBottom: '1px solid var(--pm-border)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, display: 'grid', placeItems: 'center', background: '#dcfce7', color: '#16a34a' }}><CheckCircle2 size={20} /></div>
          <div style={{ flex: 1 }}><div className="pm-section-title">Payment {payment.id}</div><div style={{ color: 'var(--pm-text-muted)', fontSize: '0.75rem' }}>Confirmed receipt and allocation details</div></div>
          <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={onClose}><X size={15} /></button>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ textAlign: 'center', padding: '4px 0 16px' }}><div style={{ color: 'var(--pm-text-muted)', fontSize: '0.72rem' }}>AMOUNT RECEIVED</div><div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '2rem', fontWeight: 700, color: 'var(--pm-success)' }}>{money(payment.amount)}</div></div>
          {row('Patient', `${patient?.name || payment.patientId} · ${payment.patientId}`)}
          {row('Invoice', payment.invoiceId)}
          {row('Invoice balance', invoice ? money(invoiceBalance(invoice)) : '—')}
          {row('Method', payment.method)}
          {row('Reference', payment.reference)}
          {row('Date', payment.date)}
          {row('Processed by', payment.receivedBy)}
        </div>
      </div>
    </div>
  );
}

export default function FinanceDashboard({ onNavigate }) {
  const [data] = useState(() => getFinanceData());
  const [selectedPayment, setSelectedPayment] = useState(null);

  const metrics = useMemo(() => {
    const invoiced = data.invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
    const collected = data.invoices.reduce((sum, invoice) => sum + Number(invoice.paid), 0);
    const outstanding = Math.max(0, invoiced - collected);
    const expenses = data.expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const insurerOutstanding = data.invoices.reduce((sum, invoice) => {
      const patient = data.patients.find((p) => p.id === invoice.patientId);
      return sum + (patient?.plan === 'Medical Aid' ? invoiceBalance(invoice) : 0);
    }, 0);
    return { invoiced, collected, outstanding, expenses, insurerOutstanding, collectionRate: invoiced ? (collected / invoiced) * 100 : 0 };
  }, [data]);

  const outstandingAccounts = useMemo(() => data.patients.map((patient) => {
    const invoices = data.invoices.filter((invoice) => invoice.patientId === patient.id);
    const balance = invoices.reduce((sum, invoice) => sum + invoiceBalance(invoice), 0);
    return { patient, balance, invoices: invoices.length };
  }).filter((row) => row.balance > 0).sort((a, b) => b.balance - a.balance), [data]);

  const recentPayments = data.payments.slice(0, 6);
  const weekly = [
    { label: 'Mon', collections: 1680, costs: 980 }, { label: 'Tue', collections: 2140, costs: 1260 },
    { label: 'Wed', collections: 1940, costs: 860 }, { label: 'Thu', collections: 2710, costs: 1420 },
    { label: 'Fri', collections: 2380, costs: 1160 }, { label: 'Sat', collections: 1860, costs: 720 },
  ];
  const maxBar = Math.max(...weekly.flatMap((item) => [item.collections, item.costs]));

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--pm-primary-light)', color: 'var(--pm-primary)', display: 'grid', placeItems: 'center' }}><DollarSign size={23} /></div>
        <div style={{ flex: 1, minWidth: 220 }}><h2 style={{ margin: 0, fontFamily: "'Roboto Condensed', sans-serif", fontSize: '1.35rem' }}>Finance & Revenue Dashboard</h2><div style={{ fontSize: '0.8rem', color: 'var(--pm-text-muted)', marginTop: 3 }}>Collections, receivables, costs and patient account performance</div></div>
        <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={() => onNavigate?.('accounting')}><Landmark size={14} /> Accounting</button>
        <button className="pm-btn pm-btn-primary pm-btn-sm" onClick={() => onNavigate?.('billing')}><Receipt size={14} /> Patient billing</button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl"><div className="pm-stat-card"><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '0.7rem', opacity: .8 }}>TOTAL INVOICED</span><Receipt size={15} /></div><div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", marginTop: 5 }}>{money(metrics.invoiced)}</div><div style={{ fontSize: '0.7rem', opacity: .7, marginTop: 6 }}>{data.invoices.length} active & historical invoices</div></div></div>
        <div className="col-6 col-xl"><div className="pm-stat-card" style={{ background: 'var(--pm-success)' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '0.7rem', opacity: .8 }}>COLLECTED</span><CircleDollarSign size={15} /></div><div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", marginTop: 5 }}>{money(metrics.collected)}</div><div style={{ fontSize: '0.7rem', opacity: .75, marginTop: 6 }}>{metrics.collectionRate.toFixed(1)}% collection rate</div></div></div>
        <div className="col-6 col-xl"><div className="pm-stat-card" style={{ background: 'var(--pm-danger)' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '0.7rem', opacity: .8 }}>RECEIVABLES</span><WalletCards size={15} /></div><div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", marginTop: 5 }}>{money(metrics.outstanding)}</div><div style={{ fontSize: '0.7rem', opacity: .75, marginTop: 6 }}>{outstandingAccounts.length} patient accounts outstanding</div></div></div>
        <div className="col-6 col-xl"><div className="pm-stat-card" style={{ background: 'var(--pm-warning)' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '0.7rem', opacity: .8 }}>OPERATING COSTS</span><Banknote size={15} /></div><div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", marginTop: 5 }}>{money(metrics.expenses)}</div><div style={{ fontSize: '0.7rem', opacity: .75, marginTop: 6 }}>{data.expenses.filter((e) => e.status === 'Pending').length} pending approvals</div></div></div>
        <div className="col-6 col-xl"><div className="pm-stat-card" style={{ background: 'var(--pm-info)' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '0.7rem', opacity: .8 }}>INSURER A/R</span><ShieldCheck size={15} /></div><div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", marginTop: 5 }}>{money(metrics.insurerOutstanding)}</div><div style={{ fontSize: '0.7rem', opacity: .75, marginTop: 6 }}>Medical aid / insurance balances</div></div></div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-7">
          <div className="pm-card h-100">
            <div className="pm-section-header"><div><div className="pm-section-title">Collections vs costs</div><div style={{ fontSize: '0.74rem', color: 'var(--pm-text-muted)' }}>Current operating week · USD</div></div><TrendingUp size={18} style={{ color: 'var(--pm-primary)' }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(42px, 1fr))', gap: 12, alignItems: 'end', minHeight: 230, paddingTop: 12 }}>
              {weekly.map((item) => <div key={item.label} style={{ textAlign: 'center' }}><div style={{ height: 175, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 5 }}><div title={`Collections ${money(item.collections)}`} style={{ width: 14, height: `${Math.max(8, (item.collections / maxBar) * 100)}%`, borderRadius: '5px 5px 2px 2px', background: 'var(--pm-primary)' }} /><div title={`Costs ${money(item.costs)}`} style={{ width: 14, height: `${Math.max(8, (item.costs / maxBar) * 100)}%`, borderRadius: '5px 5px 2px 2px', background: 'var(--pm-primary-muted)' }} /></div><div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', marginTop: 8 }}>{item.label}</div></div>)}
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', fontSize: '0.72rem', color: 'var(--pm-text-muted)', marginTop: 8 }}><span><i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--pm-primary)', marginRight: 5 }} />Collections</span><span><i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--pm-primary-muted)', marginRight: 5 }} />Costs</span></div>
          </div>
        </div>
        <div className="col-12 col-xl-5">
          <div className="pm-card h-100">
            <div className="pm-section-header"><div className="pm-section-title">Highest outstanding accounts</div><button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => onNavigate?.('billing')}>All accounts <ArrowRight size={13} /></button></div>
            {outstandingAccounts.slice(0, 5).map((row) => <div key={row.patient.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 0', borderBottom: '1px solid var(--pm-border)' }}><div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--pm-primary-light)', color: 'var(--pm-primary)', display: 'grid', placeItems: 'center' }}><Building2 size={15} /></div><div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{row.patient.name}</div><div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>{row.patient.accountNo} · {row.invoices} invoice{row.invoices === 1 ? '' : 's'}</div></div><strong style={{ color: 'var(--pm-danger)', fontSize: '0.88rem' }}>{money(row.balance)}</strong></div>)}
          </div>
        </div>
      </div>

      <div className="pm-card">
        <div className="pm-section-header"><div><div className="pm-section-title">Recent payments</div><div style={{ fontSize: '0.74rem', color: 'var(--pm-text-muted)' }}>Click a receipt to inspect allocation and payment method.</div></div><button className="pm-btn pm-btn-outline pm-btn-sm" onClick={() => onNavigate?.('billing')}>Open billing</button></div>
        <div style={{ overflowX: 'auto' }}><table className="pm-table" style={{ minWidth: 720 }}><thead><tr><th>Receipt</th><th>Patient</th><th>Invoice</th><th>Method</th><th>Date</th><th style={{ textAlign: 'right' }}>Amount</th><th></th></tr></thead><tbody>{recentPayments.map((payment) => { const patient = data.patients.find((p) => p.id === payment.patientId); return <tr key={payment.id}><td><strong>{payment.id}</strong></td><td>{patient?.name || payment.patientId}</td><td>{payment.invoiceId}</td><td>{payment.method}</td><td>{payment.date}</td><td style={{ textAlign: 'right', color: 'var(--pm-success)', fontWeight: 700 }}>{money(payment.amount)}</td><td style={{ textAlign: 'right' }}><button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => setSelectedPayment(payment)}><Eye size={13} /> View</button></td></tr>; })}</tbody></table></div>
      </div>

      {selectedPayment && <PaymentModal payment={selectedPayment} patient={data.patients.find((p) => p.id === selectedPayment.patientId)} invoice={data.invoices.find((i) => i.id === selectedPayment.invoiceId)} onClose={() => setSelectedPayment(null)} />}
    </div>
  );
}
