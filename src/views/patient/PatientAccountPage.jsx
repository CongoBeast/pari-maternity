import React, { useMemo, useState } from 'react';
import {
  CreditCard, Receipt, WalletCards, UserCircle, FileText, X, Eye, Search,
  CheckCircle2, CircleDollarSign, Pill, FlaskConical, ScanLine, Stethoscope,
  Building2, AlertCircle, Printer, ShieldCheck, Banknote, Smartphone, Landmark,
} from 'lucide-react';
import {
  DEFAULT_PATIENT_ID, PAYMENT_METHODS, getFinanceData, invoiceBalance, money,
  patientBalance, recordPayment,
} from '../../data/billingStore';

const CATEGORY_ICON = {
  Medication: Pill,
  Laboratory: FlaskConical,
  Imaging: ScanLine,
  Consultation: Stethoscope,
  Emergency: AlertCircle,
  Facility: Building2,
  Admission: Building2,
  Surgery: Stethoscope,
  Payment: CircleDollarSign,
};

const modalBackdrop = {
  position: 'fixed', inset: 0, zIndex: 1060, background: 'rgba(8, 15, 30, 0.58)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
};

function ModalShell({ title, subtitle, icon: Icon = FileText, onClose, children, footer, wide = false }) {
  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div className="pm-card pm-fade-in" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: wide ? 820 : 560, maxHeight: '92vh', overflowY: 'auto', padding: 0 }}>
        <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--pm-border)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--pm-primary-light)', color: 'var(--pm-primary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Icon size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="pm-section-title">{title}</div>
            {subtitle && <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>{subtitle}</div>}
          </div>
          <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        <div style={{ padding: 22 }}>{children}</div>
        {footer && <div style={{ padding: '14px 22px', borderTop: '1px solid var(--pm-border)', display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>{footer}</div>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cls = status === 'Paid' ? 'pm-badge-success' : status === 'Overdue' ? 'pm-badge-danger' : status === 'Partial' ? 'pm-badge-info' : 'pm-badge-warning';
  return <span className={`pm-badge ${cls}`}>{status}</span>;
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 0.7fr) 1fr', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--pm-border)' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '0.84rem', color: 'var(--pm-text)', fontWeight: 500, wordBreak: 'break-word' }}>{value || '—'}</div>
    </div>
  );
}

function InvoiceModal({ invoice, patient, onClose, onCheckout }) {
  if (!invoice) return null;
  const balance = invoiceBalance(invoice);
  return (
    <ModalShell
      title={`Invoice ${invoice.id}`}
      subtitle={`${patient?.name || invoice.patientId} · ${invoice.visit}`}
      icon={Receipt}
      onClose={onClose}
      wide
      footer={
        <>
          <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={() => window.print()}><Printer size={14} /> Print invoice</button>
          {balance > 0 && <button className="pm-btn pm-btn-primary pm-btn-sm" onClick={() => onCheckout(invoice)}><CreditCard size={14} /> Pay {money(balance)}</button>}
        </>
      }
    >
      <div className="row g-3 mb-3">
        <div className="col-6 col-md-3"><div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>ISSUED</div><strong style={{ fontSize: '0.86rem' }}>{invoice.date}</strong></div>
        <div className="col-6 col-md-3"><div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>DUE DATE</div><strong style={{ fontSize: '0.86rem' }}>{invoice.dueDate}</strong></div>
        <div className="col-6 col-md-3"><div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>STATUS</div><div style={{ marginTop: 3 }}><StatusBadge status={invoice.status} /></div></div>
        <div className="col-6 col-md-3"><div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>CLINICIAN</div><strong style={{ fontSize: '0.86rem' }}>{invoice.clinician}</strong></div>
      </div>
      <div style={{ overflowX: 'auto', border: '1px solid var(--pm-border)', borderRadius: 10 }}>
        <table className="pm-table" style={{ minWidth: 620 }}>
          <thead><tr><th>Item</th><th>Category</th><th>Qty</th><th style={{ textAlign: 'right' }}>Unit price</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
          <tbody>
            {invoice.lines.map((line) => (
              <tr key={line.id}>
                <td style={{ fontWeight: 600 }}>{line.description}</td><td>{line.category}</td><td>{line.qty}</td>
                <td style={{ textAlign: 'right' }}>{money(line.unitPrice)}</td><td style={{ textAlign: 'right', fontWeight: 700 }}>{money(line.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ maxWidth: 360, marginLeft: 'auto', marginTop: 16 }}>
        <InfoRow label="Invoice total" value={money(invoice.total)} />
        <InfoRow label="Paid to date" value={money(invoice.paid)} />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingTop: 12, fontSize: '1rem' }}>
          <strong>Amount due</strong><strong style={{ color: balance > 0 ? 'var(--pm-danger)' : 'var(--pm-success)' }}>{money(balance)}</strong>
        </div>
      </div>
    </ModalShell>
  );
}

function AccountModal({ patient, onClose }) {
  return (
    <ModalShell title="Account Information" subtitle="Patient billing profile and medical aid details" icon={UserCircle} onClose={onClose}>
      <InfoRow label="Patient" value={patient.name} />
      <InfoRow label="Patient ID" value={patient.id} />
      <InfoRow label="Account number" value={patient.accountNo} />
      <InfoRow label="National ID" value={patient.nationalId} />
      <InfoRow label="Date of birth" value={patient.dob} />
      <InfoRow label="Phone" value={patient.phone} />
      <InfoRow label="Email" value={patient.email} />
      <InfoRow label="Address" value={patient.address} />
      <InfoRow label="Billing plan" value={patient.plan} />
      <InfoRow label="Medical aid" value={patient.medicalAid} />
      <InfoRow label="Member number" value={patient.memberNo} />
    </ModalShell>
  );
}

function TransactionModal({ item, onClose }) {
  if (!item) return null;
  const Icon = CATEGORY_ICON[item.category] || Receipt;
  return (
    <ModalShell title={item.title} subtitle={item.reference} icon={Icon} onClose={onClose}>
      <InfoRow label="Date" value={item.date} />
      <InfoRow label="Type" value={item.kind} />
      <InfoRow label="Category" value={item.category} />
      <InfoRow label="Invoice" value={item.invoiceId} />
      <InfoRow label="Description" value={item.description} />
      {item.method && <InfoRow label="Payment method" value={item.method} />}
      {item.receivedBy && <InfoRow label="Processed by" value={item.receivedBy} />}
      <div style={{ marginTop: 18, padding: 16, borderRadius: 10, background: item.kind === 'Payment' ? 'rgba(22,163,74,0.08)' : 'var(--pm-surface-2)', border: '1px solid var(--pm-border)' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.kind === 'Payment' ? 'Amount paid' : 'Charge amount'}</div>
        <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: item.kind === 'Payment' ? 'var(--pm-success)' : 'var(--pm-text)', marginTop: 4 }}>
          {item.kind === 'Payment' ? '− ' : ''}{money(item.amount)}
        </div>
      </div>
    </ModalShell>
  );
}

function CheckoutModal({ invoice, patient, onClose, onPaid }) {
  const balance = invoiceBalance(invoice);
  const [amount, setAmount] = useState(String(balance.toFixed(2)));
  const [method, setMethod] = useState('EcoCash — USD');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  const MethodIcon = method.includes('EcoCash') || method.includes('OneMoney') ? Smartphone : method.includes('Bank') || method.includes('ZIPIT') ? Landmark : method.includes('Cash') ? Banknote : method.includes('Medical') ? ShieldCheck : CreditCard;

  const pay = () => {
    setError('');
    try {
      const current = getFinanceData();
      const result = recordPayment(current, {
        invoiceId: invoice.id,
        amount: Number(amount),
        method,
        reference: reference.trim(),
        receivedBy: 'Patient Portal',
      });
      onPaid(result);
    } catch (err) {
      setError(err.message || 'Payment could not be recorded.');
    }
  };

  return (
    <ModalShell
      title="Checkout"
      subtitle={`${invoice.id} · Outstanding ${money(balance)}`}
      icon={CreditCard}
      onClose={onClose}
      footer={
        <>
          <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={onClose}>Cancel</button>
          <button className="pm-btn pm-btn-primary pm-btn-sm" onClick={pay}><CheckCircle2 size={14} /> Confirm payment</button>
        </>
      }
    >
      <div style={{ padding: 14, borderRadius: 10, background: 'var(--pm-primary-light)', border: '1px solid var(--pm-border)', marginBottom: 18 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)' }}>Paying as</div>
        <div style={{ fontWeight: 700, marginTop: 2 }}>{patient.name}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{patient.accountNo}</div>
      </div>
      {error && <div style={{ padding: '10px 12px', borderRadius: 8, background: '#fee2e2', color: '#dc2626', fontSize: '0.8rem', marginBottom: 14 }}>{error}</div>}
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 6 }}>Amount (USD settlement value)</label>
      <input type="number" min="0.01" max={balance} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--pm-border)', borderRadius: 9, background: 'var(--pm-surface-2)', color: 'var(--pm-text)', marginBottom: 14 }} />
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 6 }}>Payment method</label>
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <MethodIcon size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--pm-primary)' }} />
        <select value={method} onChange={(e) => setMethod(e.target.value)} style={{ width: '100%', padding: '10px 12px 10px 38px', border: '1px solid var(--pm-border)', borderRadius: 9, background: 'var(--pm-surface-2)', color: 'var(--pm-text)' }}>
          {PAYMENT_METHODS.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 6 }}>Reference / transaction code <span style={{ color: 'var(--pm-text-muted)', fontWeight: 400 }}>(optional)</span></label>
      <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="EcoCash, POS, ZIPIT or authorisation reference" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--pm-border)', borderRadius: 9, background: 'var(--pm-surface-2)', color: 'var(--pm-text)' }} />
      {method.includes('ZiG') && <div style={{ fontSize: '0.74rem', color: 'var(--pm-text-muted)', marginTop: 10 }}>ZiG payments are receipted against the hospital cashier's configured daily settlement rate.</div>}
    </ModalShell>
  );
}

function ReceiptModal({ result, onClose }) {
  if (!result) return null;
  return (
    <ModalShell title="Payment Successful" subtitle={`Receipt ${result.payment.id}`} icon={CheckCircle2} onClose={onClose} footer={<button className="pm-btn pm-btn-primary pm-btn-sm" onClick={onClose}>Done</button>}>
      <div style={{ textAlign: 'center', padding: '8px 0 18px' }}>
        <div style={{ width: 58, height: 58, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}><CheckCircle2 size={28} /></div>
        <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '2rem', fontWeight: 700 }}>{money(result.payment.amount)}</div>
        <div style={{ color: 'var(--pm-text-muted)', fontSize: '0.82rem' }}>Payment recorded against {result.invoice.id}</div>
      </div>
      <InfoRow label="Method" value={result.payment.method} />
      <InfoRow label="Reference" value={result.payment.reference} />
      <InfoRow label="Processed by" value={result.payment.receivedBy} />
      <InfoRow label="Remaining balance" value={money(invoiceBalance(result.invoice))} />
    </ModalShell>
  );
}

export default function PatientAccountPage() {
  const [data, setData] = useState(() => getFinanceData());
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [checkoutInvoice, setCheckoutInvoice] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const patient = data.patients.find((item) => item.id === DEFAULT_PATIENT_ID) || data.patients[0];
  const summary = patientBalance(data, patient.id);
  const invoices = [...summary.invoices].sort((a, b) => b.date.localeCompare(a.date));
  const outstandingInvoices = invoices.filter((invoice) => invoiceBalance(invoice) > 0);

  const ledger = useMemo(() => {
    const charges = invoices.flatMap((invoice) => invoice.lines.map((line) => ({
      id: `${invoice.id}-${line.id}`, kind: 'Charge', category: line.category, title: line.description,
      description: `${invoice.visit} · ${invoice.clinician}`, reference: line.id, invoiceId: invoice.id,
      date: invoice.date, amount: line.amount,
    })));
    const payments = data.payments.filter((payment) => payment.patientId === patient.id).map((payment) => ({
      id: payment.id, kind: 'Payment', category: 'Payment', title: `Payment via ${payment.method}`,
      description: `Payment received for ${payment.invoiceId}`, reference: payment.reference, invoiceId: payment.invoiceId,
      date: payment.date, amount: payment.amount, method: payment.method, receivedBy: payment.receivedBy,
    }));
    return [...charges, ...payments].sort((a, b) => b.date.localeCompare(a.date));
  }, [data.payments, invoices, patient.id]);

  const categories = ['All', 'Medication', 'Consultation', 'Laboratory', 'Imaging', 'Emergency', 'Facility', 'Payment'];
  const filteredLedger = ledger.filter((item) => {
    const q = query.toLowerCase().trim();
    const matchesQuery = !q || `${item.title} ${item.reference} ${item.invoiceId} ${item.category}`.toLowerCase().includes(q);
    const matchesFilter = filter === 'All' || item.category === filter;
    return matchesQuery && matchesFilter;
  });

  const handlePaid = (result) => {
    setData(result.data);
    setCheckoutInvoice(null);
    setSelectedInvoice(null);
    setReceipt(result);
  };

  return (
    <div>
      <div className="pm-page-header" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <CreditCard size={30} style={{ color: 'var(--pm-primary)' }} />
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontFamily: "'Roboto Condensed', sans-serif", fontSize: '1.35rem' }}>My Account & Checkout</h2>
          <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: 'var(--pm-text-muted)' }}>Invoices, payments, medical charges and account balance</p>
        </div>
        <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={() => setAccountOpen(true)}><UserCircle size={14} /> Account details</button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3"><div className="pm-stat-card"><div style={{ fontSize: '0.72rem', opacity: 0.78 }}>TOTAL BILLED</div><div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '2rem', fontWeight: 700, marginTop: 5 }}>{money(summary.billed)}</div><div style={{ fontSize: '0.72rem', opacity: 0.72, marginTop: 6 }}>{invoices.length} invoices on account</div></div></div>
        <div className="col-12 col-md-6 col-xl-3"><div className="pm-stat-card" style={{ background: 'var(--pm-success)' }}><div style={{ fontSize: '0.72rem', opacity: 0.82 }}>PAID TO DATE</div><div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '2rem', fontWeight: 700, marginTop: 5 }}>{money(summary.paid)}</div><div style={{ fontSize: '0.72rem', opacity: 0.75, marginTop: 6 }}>{data.payments.filter((p) => p.patientId === patient.id).length} confirmed payments</div></div></div>
        <div className="col-12 col-md-6 col-xl-3"><div className="pm-stat-card" style={{ background: summary.outstanding > 0 ? 'var(--pm-danger)' : 'var(--pm-success)' }}><div style={{ fontSize: '0.72rem', opacity: 0.82 }}>AMOUNT DUE</div><div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '2rem', fontWeight: 700, marginTop: 5 }}>{money(summary.outstanding)}</div><div style={{ fontSize: '0.72rem', opacity: 0.75, marginTop: 6 }}>{outstandingInvoices.length} invoice{outstandingInvoices.length === 1 ? '' : 's'} with balance</div></div></div>
        <div className="col-12 col-md-6 col-xl-3"><div className="pm-card h-100"><div className="pm-card-title">Account</div><div style={{ fontWeight: 700, fontSize: '1rem' }}>{patient.accountNo}</div><div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', marginTop: 4 }}>{patient.medicalAid} · {patient.plan}</div><button className="pm-btn pm-btn-primary pm-btn-sm w-100 mt-3" disabled={!outstandingInvoices.length} onClick={() => outstandingInvoices[0] && setCheckoutInvoice(outstandingInvoices[0])}><CreditCard size={14} /> Pay account</button></div></div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-7">
          <div className="pm-card h-100">
            <div className="pm-section-header"><div><div className="pm-section-title">Invoices</div><div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)' }}>Open any invoice to see every service, medication and payment position.</div></div><Receipt size={18} style={{ color: 'var(--pm-primary)' }} /></div>
            <div style={{ overflowX: 'auto' }}>
              <table className="pm-table" style={{ minWidth: 650 }}>
                <thead><tr><th>Invoice</th><th>Visit</th><th>Status</th><th style={{ textAlign: 'right' }}>Total</th><th style={{ textAlign: 'right' }}>Paid</th><th style={{ textAlign: 'right' }}>Due</th><th></th></tr></thead>
                <tbody>{invoices.map((invoice) => <tr key={invoice.id}><td><strong>{invoice.id}</strong><div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>{invoice.date}</div></td><td>{invoice.visit}</td><td><StatusBadge status={invoice.status} /></td><td style={{ textAlign: 'right' }}>{money(invoice.total)}</td><td style={{ textAlign: 'right', color: 'var(--pm-success)', fontWeight: 600 }}>{money(invoice.paid)}</td><td style={{ textAlign: 'right', color: invoiceBalance(invoice) > 0 ? 'var(--pm-danger)' : 'var(--pm-text-muted)', fontWeight: 700 }}>{money(invoiceBalance(invoice))}</td><td style={{ textAlign: 'right' }}><button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => setSelectedInvoice(invoice)}><Eye size={13} /> View</button></td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-5">
          <div className="pm-card h-100">
            <div className="pm-section-header"><div className="pm-section-title">Outstanding balances</div><WalletCards size={18} style={{ color: 'var(--pm-primary)' }} /></div>
            {outstandingInvoices.length ? outstandingInvoices.map((invoice) => (
              <div key={invoice.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--pm-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><div><strong style={{ fontSize: '0.88rem' }}>{invoice.visit}</strong><div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>{invoice.id} · due {invoice.dueDate}</div></div><strong style={{ color: 'var(--pm-danger)' }}>{money(invoiceBalance(invoice))}</strong></div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}><button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => setSelectedInvoice(invoice)}><Eye size={13} /> Invoice</button><button className="pm-btn pm-btn-primary pm-btn-sm" onClick={() => setCheckoutInvoice(invoice)}><CreditCard size={13} /> Checkout</button></div>
              </div>
            )) : <div style={{ padding: 28, textAlign: 'center', color: 'var(--pm-text-muted)' }}><CheckCircle2 size={28} style={{ color: 'var(--pm-success)', marginBottom: 8 }} /><div>Your account is fully paid.</div></div>}
          </div>
        </div>
      </div>

      <div className="pm-card">
        <div className="pm-section-header" style={{ gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div><div className="pm-section-title">Transaction history</div><div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)' }}>Item-level ledger including medication, diagnostics, services and payments.</div></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}><Search size={14} style={{ position: 'absolute', left: 10, top: 9, color: 'var(--pm-text-muted)' }} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transactions" style={{ padding: '7px 10px 7px 31px', border: '1px solid var(--pm-border)', borderRadius: 8, background: 'var(--pm-surface-2)', color: 'var(--pm-text)', fontSize: '0.8rem' }} /></div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '7px 10px', border: '1px solid var(--pm-border)', borderRadius: 8, background: 'var(--pm-surface-2)', color: 'var(--pm-text)', fontSize: '0.8rem' }}>{categories.map((category) => <option key={category}>{category}</option>)}</select>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="pm-table" style={{ minWidth: 760 }}>
            <thead><tr><th>Date</th><th>Transaction</th><th>Category</th><th>Invoice</th><th style={{ textAlign: 'right' }}>Amount</th><th></th></tr></thead>
            <tbody>{filteredLedger.map((item) => {
              const Icon = CATEGORY_ICON[item.category] || FileText;
              return <tr key={item.id}><td style={{ whiteSpace: 'nowrap' }}>{item.date}</td><td><div style={{ display: 'flex', gap: 9, alignItems: 'center' }}><div style={{ width: 32, height: 32, borderRadius: 8, background: item.kind === 'Payment' ? '#dcfce7' : 'var(--pm-primary-light)', color: item.kind === 'Payment' ? '#16a34a' : 'var(--pm-primary)', display: 'grid', placeItems: 'center' }}><Icon size={14} /></div><div><strong style={{ fontSize: '0.83rem' }}>{item.title}</strong><div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>{item.reference}</div></div></div></td><td>{item.category}</td><td>{item.invoiceId}</td><td style={{ textAlign: 'right', fontWeight: 700, color: item.kind === 'Payment' ? 'var(--pm-success)' : 'var(--pm-text)' }}>{item.kind === 'Payment' ? '− ' : ''}{money(item.amount)}</td><td style={{ textAlign: 'right' }}><button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => setSelectedTransaction(item)}><Eye size={13} /> Details</button></td></tr>;
            })}</tbody>
          </table>
        </div>
      </div>

      {selectedInvoice && <InvoiceModal invoice={selectedInvoice} patient={patient} onClose={() => setSelectedInvoice(null)} onCheckout={(invoice) => { setSelectedInvoice(null); setCheckoutInvoice(invoice); }} />}
      {checkoutInvoice && <CheckoutModal invoice={checkoutInvoice} patient={patient} onClose={() => setCheckoutInvoice(null)} onPaid={handlePaid} />}
      {accountOpen && <AccountModal patient={patient} onClose={() => setAccountOpen(false)} />}
      {selectedTransaction && <TransactionModal item={selectedTransaction} onClose={() => setSelectedTransaction(null)} />}
      {receipt && <ReceiptModal result={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
}
