import React, { useState, useMemo } from 'react';
import {
  Pill, Search, LayoutGrid, Table as TableIcon, X, Calendar,
  User, RefreshCw, Clock, Building2, FileText,
} from 'lucide-react';

// ---- Demo prescription data --------------------------------------------------
const PRESCRIPTIONS = [
  {
    id: 'RX-10241', medication: 'Prenatal Multivitamin', strength: '1 tablet',
    dosage: '1 tablet once daily', doctor: 'Dr. Sarah Jenkins', date: 'May 24, 2024',
    status: 'active', refills: 3, duration: '90 days', pharmacy: 'Wellness Wing Pharmacy',
    instructions: 'Take one tablet daily with food, preferably in the morning. Do not exceed the recommended dose.',
  },
  {
    id: 'RX-10238', medication: 'Folic Acid', strength: '400 mcg',
    dosage: '1 tablet once daily', doctor: 'Dr. Sarah Jenkins', date: 'May 24, 2024',
    status: 'active', refills: 5, duration: '120 days', pharmacy: 'Wellness Wing Pharmacy',
    instructions: 'Continue throughout pregnancy to support healthy neural development. Take at the same time each day.',
  },
  {
    id: 'RX-10199', medication: 'Ferrous Sulfate (Iron)', strength: '325 mg',
    dosage: '1 tablet twice daily', doctor: 'Dr. Marcus Klein', date: 'Apr 30, 2024',
    status: 'active', refills: 2, duration: '60 days', pharmacy: 'Ground Floor Pharmacy',
    instructions: 'Take with vitamin C or orange juice to improve absorption. May cause mild stomach upset; take with food if needed.',
  },
  {
    id: 'RX-10150', medication: 'Vitamin D3', strength: '1000 IU',
    dosage: '1 capsule once daily', doctor: 'Dr. Sarah Jenkins', date: 'Apr 12, 2024',
    status: 'active', refills: 4, duration: '90 days', pharmacy: 'Wellness Wing Pharmacy',
    instructions: 'Take with the largest meal of the day for best absorption.',
  },
  {
    id: 'RX-10088', medication: 'Doxylamine / Pyridoxine', strength: '10 mg / 10 mg',
    dosage: '2 tablets at bedtime', doctor: 'Dr. Olivia Adeyemi', date: 'Mar 18, 2024',
    status: 'completed', refills: 0, duration: '30 days', pharmacy: 'Ground Floor Pharmacy',
    instructions: 'Prescribed for first-trimester nausea. Course completed. Resume only if symptoms return after consulting your doctor.',
  },
  {
    id: 'RX-10042', medication: 'Calcium Carbonate', strength: '500 mg',
    dosage: '1 tablet twice daily', doctor: 'Dr. Marcus Klein', date: 'Feb 28, 2024',
    status: 'expired', refills: 0, duration: '30 days', pharmacy: 'Ground Floor Pharmacy',
    instructions: 'Prescription period has ended. Speak with your care team about renewing if calcium supplementation is still needed.',
  },
];

const STATUS_STYLES = {
  active: { label: 'Active', cls: 'pm-badge-success' },
  completed: { label: 'Completed', cls: 'pm-badge-info' },
  expired: { label: 'Expired', bg: 'rgba(108,117,125,0.12)', color: 'var(--pm-text-muted)' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.expired;
  if (s.cls) return <span className={`pm-badge ${s.cls}`}>{s.label}</span>;
  return (
    <span className="pm-badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
  );
}

// ---- Details modal -----------------------------------------------------------
function PrescriptionModal({ rx, onClose }) {
  if (!rx) return null;
  const row = (Icon, label, value) => (
    <div style={{ display: 'flex', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--pm-border)' }}>
      <Icon size={16} style={{ color: 'var(--pm-primary)', flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--pm-text)', fontWeight: 500, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pm-card"
        style={{ maxWidth: 520, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
      >
        <button
          onClick={onClose}
          className="pm-btn pm-btn-ghost pm-btn-sm"
          style={{ position: 'absolute', top: 14, right: 14 }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--pm-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Pill size={20} style={{ color: 'var(--pm-primary)' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--pm-text)' }}>{rx.medication}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{rx.id} · {rx.strength}</div>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}><StatusBadge status={rx.status} /></div>

        {row(Pill, 'Dosage', rx.dosage)}
        {row(User, 'Prescribed By', rx.doctor)}
        {row(Calendar, 'Date Issued', rx.date)}
        {row(Clock, 'Duration', rx.duration)}
        {row(RefreshCw, 'Refills Remaining', rx.refills)}
        {row(Building2, 'Pharmacy', rx.pharmacy)}

        <div style={{ display: 'flex', gap: 12, padding: '14px 0 4px' }}>
          <FileText size={16} style={{ color: 'var(--pm-primary)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Instructions</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--pm-text)', lineHeight: 1.55, marginTop: 4 }}>{rx.instructions}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Card view ---------------------------------------------------------------
function PrescriptionCard({ rx, onOpen }) {
  return (
    <div className="col-12 col-md-6">
      <div
        onClick={() => onOpen(rx)}
        style={{
          border: '1px solid var(--pm-border)', borderRadius: 12, padding: 16, height: '100%',
          background: 'var(--pm-surface-2)', cursor: 'pointer', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--pm-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pill size={18} style={{ color: 'var(--pm-primary)' }} />
          </div>
          <StatusBadge status={rx.status} />
        </div>
        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--pm-text)' }}>{rx.medication}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', marginBottom: 10 }}>{rx.id} · {rx.strength}</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--pm-text)', fontWeight: 500 }}>{rx.dosage}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, fontSize: '0.75rem', color: 'var(--pm-text-muted)' }}>
          <span>{rx.doctor}</span>
          <span>{rx.date}</span>
        </div>
      </div>
    </div>
  );
}

// ---- Table view --------------------------------------------------------------
function PrescriptionTable({ rows, onOpen }) {
  const th = { textAlign: 'left', padding: '10px 12px', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--pm-text-muted)', borderBottom: '1px solid var(--pm-border)', whiteSpace: 'nowrap' };
  const td = { padding: '12px', fontSize: '0.85rem', color: 'var(--pm-text)', borderBottom: '1px solid var(--pm-border)' };
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
        <thead>
          <tr>
            <th style={th}>Medication</th>
            <th style={th}>Dosage</th>
            <th style={th}>Prescribed By</th>
            <th style={th}>Date</th>
            <th style={th}>Status</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((rx) => (
            <tr
              key={rx.id}
              onClick={() => onOpen(rx)}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--pm-surface-2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <td style={td}>
                <div style={{ fontWeight: 600 }}>{rx.medication}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>{rx.id} · {rx.strength}</div>
              </td>
              <td style={td}>{rx.dosage}</td>
              <td style={td}>{rx.doctor}</td>
              <td style={{ ...td, whiteSpace: 'nowrap' }}>{rx.date}</td>
              <td style={td}><StatusBadge status={rx.status} /></td>
              <td style={{ ...td, textAlign: 'right' }}>
                <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={(e) => { e.stopPropagation(); onOpen(rx); }}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---- Page --------------------------------------------------------------------
export default function Prescriptions() {
  const [view, setView] = useState('cards'); // 'cards' | 'table'
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [doctor, setDoctor] = useState('all');
  const [selected, setSelected] = useState(null);

  const doctors = useMemo(
    () => ['all', ...Array.from(new Set(PRESCRIPTIONS.map((p) => p.doctor)))],
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PRESCRIPTIONS.filter((p) => {
      if (status !== 'all' && p.status !== status) return false;
      if (doctor !== 'all' && p.doctor !== doctor) return false;
      if (q && !(`${p.medication} ${p.id}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [search, status, doctor]);

  const selectStyle = {
    padding: '8px 11px', borderRadius: 8, border: '1px solid var(--pm-border)',
    background: 'var(--pm-surface-2)', color: 'var(--pm-text)', fontSize: '0.85rem', outline: 'none',
  };

  return (
    <div>
      <div className="pm-card">
        <div className="pm-section-header">
          <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Pill size={18} style={{ color: 'var(--pm-primary)' }} /> Prescriptions
          </div>
          {/* View toggle */}
          <div style={{ display: 'inline-flex', border: '1px solid var(--pm-border)', borderRadius: 8, overflow: 'hidden' }}>
            <button
              className="pm-btn pm-btn-sm"
              onClick={() => setView('cards')}
              style={{
                borderRadius: 0, border: 'none',
                background: view === 'cards' ? 'var(--pm-primary)' : 'transparent',
                color: view === 'cards' ? '#fff' : 'var(--pm-text-muted)',
              }}
            >
              <LayoutGrid size={15} /> Cards
            </button>
            <button
              className="pm-btn pm-btn-sm"
              onClick={() => setView('table')}
              style={{
                borderRadius: 0, border: 'none',
                background: view === 'table' ? 'var(--pm-primary)' : 'transparent',
                color: view === 'table' ? '#fff' : 'var(--pm-text-muted)',
              }}
            >
              <TableIcon size={15} /> Table
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medication or RX number…"
              style={{ ...selectStyle, width: '100%', paddingLeft: 34 }}
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
          </select>
          <select value={doctor} onChange={(e) => setDoctor(e.target.value)} style={selectStyle}>
            {doctors.map((d) => (
              <option key={d} value={d}>{d === 'all' ? 'All doctors' : d}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--pm-text-muted)' }}>
            <Pill size={28} style={{ opacity: 0.4, marginBottom: 8 }} />
            <div style={{ fontSize: '0.9rem' }}>No prescriptions match your filters.</div>
          </div>
        ) : view === 'cards' ? (
          <div className="row g-3">
            {filtered.map((rx) => (
              <PrescriptionCard key={rx.id} rx={rx} onOpen={setSelected} />
            ))}
          </div>
        ) : (
          <PrescriptionTable rows={filtered} onOpen={setSelected} />
        )}

        <div style={{ marginTop: 14, fontSize: '0.75rem', color: 'var(--pm-text-muted)' }}>
          Showing {filtered.length} of {PRESCRIPTIONS.length} prescriptions
        </div>
      </div>

      <PrescriptionModal rx={selected} onClose={() => setSelected(null)} />
    </div>
  );
}