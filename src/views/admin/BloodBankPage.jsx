import React, { useState, useMemo } from 'react';
import {
  Droplet, Droplets, ArrowDownToLine, ArrowUpFromLine, ClipboardList,
  AlertTriangle, Plus, TrendingDown, Hospital, User, Clock
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Data — replace with API data when wired to the backend             */
/* ------------------------------------------------------------------ */

// What is in storage right now (units on hand vs. target capacity)
const inventory = [
  { type: 'O-',  units: 6,  capacity: 40 },
  { type: 'O+',  units: 24, capacity: 60 },
  { type: 'A+',  units: 38, capacity: 60 },
  { type: 'A-',  units: 9,  capacity: 30 },
  { type: 'B+',  units: 18, capacity: 40 },
  { type: 'B-',  units: 4,  capacity: 20 },
  { type: 'AB+', units: 12, capacity: 25 },
  { type: 'AB-', units: 3,  capacity: 15 },
];

// Open + recently actioned requests for blood
const requests = [
  { id: 'REQ-2041', patient: 'Tariro Moyo',     ward: 'Delivery Wing B', type: 'O-',  units: 4, urgency: 'Emergency', by: 'Dr. M. Msipa',   when: 'Today 09:42', status: 'Pending',   reason: 'Postpartum haemorrhage' },
  { id: 'REQ-2040', patient: 'Linda Chikore',   ward: 'Theatre 2',       type: 'A+',  units: 2, urgency: 'Urgent',    by: 'Dr. J. Mugaga',  when: 'Today 08:15', status: 'Approved',  reason: 'Emergency C-section' },
  { id: 'REQ-2039', patient: 'Grace Ndlovu',    ward: 'Post-Natal 3',    type: 'B+',  units: 1, urgency: 'Routine',   by: 'Nurse Sibanda',  when: 'Today 07:50', status: 'Fulfilled', reason: 'Anaemia correction' },
  { id: 'REQ-2038', patient: 'Faith Banda',     ward: 'Delivery Wing A', type: 'O+',  units: 3, urgency: 'Urgent',    by: 'Dr. M. Msipa',   when: 'Yest. 22:10', status: 'Fulfilled', reason: 'Antepartum bleed' },
  { id: 'REQ-2037', patient: 'Chipo Dube',      ward: 'NICU',            type: 'AB-', units: 1, urgency: 'Emergency', by: 'Dr. E. Gandawa', when: 'Yest. 19:30', status: 'Rejected',  reason: 'Stock unavailable' },
];

// Units that have left the bank and where they went
const disbursements = [
  { ref: 'DSB-0912', date: 'Today 08:30',  type: 'A+',  units: 2, ward: 'Theatre 2',       patient: 'Linda Chikore', by: 'Dr. J. Mugaga' },
  { ref: 'DSB-0911', date: 'Today 07:55',  type: 'B+',  units: 1, ward: 'Post-Natal 3',    patient: 'Grace Ndlovu',  by: 'Nurse Sibanda' },
  { ref: 'DSB-0910', date: 'Yest. 22:20',  type: 'O+',  units: 3, ward: 'Delivery Wing A', patient: 'Faith Banda',   by: 'Dr. M. Msipa' },
  { ref: 'DSB-0909', date: 'Yest. 16:05',  type: 'O-',  units: 2, ward: 'Theatre 1',       patient: 'Ruvarashe Phiri', by: 'Dr. M. Msipa' },
  { ref: 'DSB-0908', date: 'Yest. 11:40',  type: 'A-',  units: 1, ward: 'Post-Natal 1',    patient: 'Nyasha Tembo',  by: 'Nurse Charamba' },
];

// Units coming in — donations and supplier deliveries
const intake = [
  { ref: 'IN-3320', date: 'Today 06:15',  type: 'O+',  units: 8, source: 'National Blood Service', kind: 'Supplier',    expiry: '2026-07-28' },
  { ref: 'IN-3319', date: 'Yest. 15:00',  type: 'A+',  units: 5, source: 'Mobile Drive – Avondale', kind: 'Voluntary',   expiry: '2026-07-30' },
  { ref: 'IN-3318', date: 'Yest. 10:20',  type: 'O-',  units: 2, source: 'T. Moyo (family)',        kind: 'Replacement', expiry: '2026-07-31' },
  { ref: 'IN-3317', date: '21 Jun 14:10', type: 'B+',  units: 4, source: 'National Blood Service',  kind: 'Supplier',    expiry: '2026-07-25' },
  { ref: 'IN-3316', date: '21 Jun 09:00', type: 'AB+', units: 3, source: 'Mobile Drive – Avondale', kind: 'Voluntary',   expiry: '2026-07-29' },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const stockStatus = (pct) => {
  if (pct < 15)  return { label: 'CRITICAL', badgeClass: 'pm-badge-danger',  color: 'var(--pm-danger)' };
  if (pct < 35)  return { label: 'LOW',      badgeClass: 'pm-badge-warning', color: 'var(--pm-warning, #f59e0b)' };
  return { label: 'HEALTHY', badgeClass: 'pm-badge-success', color: 'var(--pm-success)' };
};

const requestBadge = {
  Pending:   'pm-badge-warning',
  Approved:  'pm-badge-info',
  Fulfilled: 'pm-badge-success',
  Rejected:  'pm-badge-danger',
};

const urgencyBadge = {
  Emergency: 'pm-badge-danger',
  Urgent:    'pm-badge-warning',
  Routine:   'pm-badge-neutral',
};

// Light table styling so it reads cleanly even without a dedicated pm-table class
const th = {
  textAlign: 'left', fontSize: '0.66rem', fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.05em', color: 'var(--pm-text-muted)', padding: '8px 10px',
  borderBottom: '1px solid rgba(0,0,0,0.08)', whiteSpace: 'nowrap',
};
const td = {
  fontSize: '0.8rem', color: 'var(--pm-text)', padding: '10px',
  borderBottom: '1px solid rgba(0,0,0,0.05)', verticalAlign: 'middle',
};

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function BloodBankPage({ title = 'Blood Bank Management' }) {
  const [statusFilter, setStatusFilter] = useState('All');

  // Derived figures for the stat cards
  const totalUnits   = inventory.reduce((s, b) => s + b.units, 0);
  const criticalTypes = inventory.filter(b => (b.units / b.capacity) * 100 < 15).length;
  const pendingReqs  = requests.filter(r => r.status === 'Pending').length;
  const disbursed7d  = disbursements.reduce((s, d) => s + d.units, 0);
  const received7d   = intake.reduce((s, i) => s + i.units, 0);

  const stats = [
    { label: 'Total Units in Stock', value: totalUnits, icon: Droplets,       sub: 'across 8 blood groups',  highlight: false },
    { label: 'Critical Groups',      value: criticalTypes, icon: AlertTriangle, sub: 'below safe threshold',  highlight: criticalTypes > 0 },
    { label: 'Pending Requests',     value: pendingReqs, icon: ClipboardList,  sub: 'awaiting action',        highlight: false },
    { label: 'Units Disbursed (7d)', value: disbursed7d, icon: ArrowUpFromLine, sub: 'issued to wards',       highlight: false },
    { label: 'Units Received (7d)',  value: received7d, icon: ArrowDownToLine, sub: 'donations & supply',     highlight: false },
  ];

  const filteredRequests = useMemo(
    () => statusFilter === 'All' ? requests : requests.filter(r => r.status === statusFilter),
    [statusFilter]
  );

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--pm-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Droplet size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontWeight: 700 }}>{title}</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)' }}>Stock, requests, disbursements &amp; supply</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="pm-btn pm-btn-outline pm-btn-sm">
            <Plus size={13} /> Record Intake
          </button>
          <button className="pm-btn pm-btn-primary pm-btn-sm" style={{ background: 'var(--pm-danger)' }}>
            <Plus size={13} /> New Request
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div className="col-6 col-md-4 col-xl" key={i}>
              <div className="pm-stat-card" style={s.highlight ? { background: 'var(--pm-danger)' } : {}}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Icon size={16} style={{ opacity: 0.7 }} />
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.75, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.65, marginTop: 6 }}>{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock by blood group */}
      <div className="pm-card mb-3">
        <div className="pm-section-header">
          <div className="pm-section-title">Stock by Blood Group</div>
          <span className="pm-badge pm-badge-info">Live</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginBottom: 14 }}>
          What is in storage and how much is left against safe-stock targets
        </div>
        <div className="row g-3">
          {inventory.map((b, i) => {
            const pct = Math.round((b.units / b.capacity) * 100);
            const st = stockStatus(pct);
            return (
              <div className="col-6 col-md-4 col-xl-3" key={i}>
                <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 14, height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Droplet size={16} style={{ color: st.color }} />
                      <span style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif" }}>{b.type}</span>
                    </div>
                    <span className={`pm-badge ${st.badgeClass}`} style={{ fontSize: '0.6rem' }}>{st.label}</span>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1 }}>
                    {b.units}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--pm-text-muted)' }}> / {b.capacity} units</span>
                  </div>
                  <div className="pm-progress mt-2">
                    <div className="pm-progress-fill" style={{ width: `${pct}%`, background: st.color }} />
                  </div>
                  {pct < 35 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', color: st.color, marginTop: 6 }}>
                      <TrendingDown size={12} /> Reorder recommended
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blood requests */}
      <div className="pm-card mb-3">
        <div className="pm-section-header">
          <div className="pm-section-title">Blood Requests</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'Pending', 'Approved', 'Fulfilled', 'Rejected'].map(s => (
              <button
                key={s}
                className={`pm-btn pm-btn-sm ${statusFilter === s ? 'pm-btn-primary' : 'pm-btn-ghost'}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginBottom: 8 }}>
          Who requested, for which patient, when, and current status
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr>
                <th style={th}>Request</th>
                <th style={th}>Patient</th>
                <th style={th}>Ward / Reason</th>
                <th style={th}>Group</th>
                <th style={th}>Units</th>
                <th style={th}>Urgency</th>
                <th style={th}>Requested By</th>
                <th style={th}>When</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...td, fontWeight: 600 }}>{r.id}</td>
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <User size={13} style={{ color: 'var(--pm-text-muted)' }} />{r.patient}
                    </div>
                  </td>
                  <td style={td}>
                    <div style={{ fontWeight: 600 }}>{r.ward}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>{r.reason}</div>
                  </td>
                  <td style={{ ...td, fontWeight: 700 }}>{r.type}</td>
                  <td style={td}>{r.units}</td>
                  <td style={td}><span className={`pm-badge ${urgencyBadge[r.urgency]}`}>{r.urgency}</span></td>
                  <td style={td}>{r.by}</td>
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--pm-text-muted)', fontSize: '0.72rem' }}>
                      <Clock size={12} />{r.when}
                    </div>
                  </td>
                  <td style={td}><span className={`pm-badge ${requestBadge[r.status]}`}>{r.status}</span></td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr><td style={{ ...td, textAlign: 'center', color: 'var(--pm-text-muted)' }} colSpan={9}>No requests with this status.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row g-3">
        {/* Disbursement log */}
        <div className="col-12 col-xl-6">
          <div className="pm-card h-100">
            <div className="pm-section-header">
              <div className="pm-section-title">Disbursement Log</div>
              <span className="pm-badge pm-badge-neutral">Units out</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginBottom: 8 }}>
              Issued units and where they went
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 460 }}>
                <thead>
                  <tr>
                    <th style={th}>Ref</th>
                    <th style={th}>Group</th>
                    <th style={th}>Units</th>
                    <th style={th}>Destination</th>
                    <th style={th}>Issued By</th>
                    <th style={th}>When</th>
                  </tr>
                </thead>
                <tbody>
                  {disbursements.map((d, i) => (
                    <tr key={i}>
                      <td style={{ ...td, fontWeight: 600 }}>{d.ref}</td>
                      <td style={{ ...td, fontWeight: 700 }}>{d.type}</td>
                      <td style={td}>{d.units}</td>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Hospital size={13} style={{ color: 'var(--pm-text-muted)' }} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{d.ward}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>{d.patient}</div>
                          </div>
                        </div>
                      </td>
                      <td style={td}>{d.by}</td>
                      <td style={{ ...td, color: 'var(--pm-text-muted)', fontSize: '0.72rem' }}>{d.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Intake / supplies log */}
        <div className="col-12 col-xl-6">
          <div className="pm-card h-100">
            <div className="pm-section-header">
              <div className="pm-section-title">Intake &amp; Supplies</div>
              <span className="pm-badge pm-badge-success">Units in</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginBottom: 8 }}>
              Donations and supplier deliveries received
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 460 }}>
                <thead>
                  <tr>
                    <th style={th}>Ref</th>
                    <th style={th}>Group</th>
                    <th style={th}>Units</th>
                    <th style={th}>Source</th>
                    <th style={th}>Type</th>
                    <th style={th}>Expiry</th>
                    <th style={th}>When</th>
                  </tr>
                </thead>
                <tbody>
                  {intake.map((it, i) => (
                    <tr key={i}>
                      <td style={{ ...td, fontWeight: 600 }}>{it.ref}</td>
                      <td style={{ ...td, fontWeight: 700 }}>{it.type}</td>
                      <td style={{ ...td, color: 'var(--pm-success)', fontWeight: 600 }}>+{it.units}</td>
                      <td style={td}>{it.source}</td>
                      <td style={td}><span className="pm-badge pm-badge-info" style={{ fontSize: '0.6rem' }}>{it.kind}</span></td>
                      <td style={{ ...td, fontSize: '0.72rem' }}>{it.expiry}</td>
                      <td style={{ ...td, color: 'var(--pm-text-muted)', fontSize: '0.72rem' }}>{it.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}