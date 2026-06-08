import React from 'react';
import {
  Baby, CheckCircle, AlertCircle, AlertTriangle, Archive, UserCog,
  ArrowRight, Download, Shield, Wrench
} from 'lucide-react';

const activity = [
  { icon: Baby,         color: 'var(--pm-primary)', title: 'Received 200 records',          sub: 'from Neonatal Unit-A',              time: '14 minutes ago', type: 'info' },
  { icon: CheckCircle,  color: 'var(--pm-success)', title: 'Approved 150 digital birth certificates', sub: '',                         time: '1 hour ago',     type: 'success' },
  { icon: AlertCircle,  color: 'var(--pm-danger)',  title: 'Sent 50 back for amendment',     sub: 'due to missing signatures',         time: '3 hours ago',    type: 'danger' },
  { icon: UserCog,      color: 'var(--pm-text-muted)', title: 'Profile Update',              sub: 'Security credentials renewed',      time: '5 hours ago',    type: 'neutral' },
  { icon: Archive,      color: 'var(--pm-text-muted)', title: 'Batch Export',                sub: '120 records archived to PDF',       time: '8 hours ago',    type: 'neutral' },
];

const notices = [
  {
    icon: Wrench,
    iconBg: '#e0f2fe',
    iconColor: '#0284c7',
    title: 'System Maintenance: March 15',
    body: 'The birth registration portal will be offline for 2 hours starting at 02:00 AM EST for database optimization. Please ensure all active drafts are saved.',
    time: '2 hours ago',
  },
  {
    icon: Shield,
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
    title: 'Updated Data Privacy Protocols',
    body: 'New HIPAA-compliant encryption standards have been implemented for all neonatal record transfers. Review the updated handbook in the Help Center.',
    time: 'Yesterday',
  },
];

const recentRecords = [
  { id: '#BR-2024-001', parent: 'Eleanor Thompson', dob: 'Mar 08, 2024', status: 'verified' },
  { id: '#BR-2024-002', parent: 'Jameson Wright',   dob: 'Mar 09, 2024', status: 'inprogress' },
  { id: '#BR-2024-003', parent: 'Sia Roberts',      dob: 'Mar 09, 2024', status: 'amendment' },
];

function StatusBadge({ s }) {
  const map = {
    verified:   { cls: 'pm-badge-success', label: 'Verified' },
    inprogress: { cls: 'pm-badge-warning', label: 'In Progress' },
    amendment:  { cls: 'pm-badge-danger',  label: 'Amendment' },
  };
  const { cls, label } = map[s] || { cls: 'pm-badge-neutral', label: s };
  return <span className={`pm-badge ${cls}`}>{label}</span>;
}

export default function BirthRecordsDashboard({ onNavigate }) {
  return (
    <div>
      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="pm-stat-card" style={{ minHeight: 130 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', opacity: 0.75, marginBottom: 8 }}>ALL-TIME BIRTH RECORDS</div>
            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '2.6rem', fontWeight: 700, lineHeight: 1 }}>12,482</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ArrowRight size={13} style={{ transform: 'rotate(-45deg)' }} /> +4.2% from last year
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="pm-stat-card secondary">
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--pm-text-muted)', marginBottom: 8 }}>MONTHLY RECORDS</div>
            <div className="pm-stat-value">342</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--pm-success)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle size={13} /> 98% Verified
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="pm-stat-card secondary" style={{ cursor: 'pointer' }} onClick={() => onNavigate('search')}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--pm-text-muted)', marginBottom: 8 }}>WEEKLY RECORDS</div>
            <div className="pm-stat-value">86</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--pm-danger)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertCircle size={13} /> 12 Pending Action
              </span>
              <ArrowRight size={15} style={{ color: 'var(--pm-primary)' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Platform Notices */}
        <div className="col-12 col-lg-7">
          <div className="pm-card mb-3">
            <div className="pm-section-header">
              <div className="pm-section-title">Platform Notices</div>
              <button className="pm-btn pm-btn-ghost pm-btn-sm">View All</button>
            </div>
            {notices.map((n, i) => (
              <div className="pm-notice-item" key={i}>
                <div className="pm-notice-icon" style={{ background: n.iconBg, color: n.iconColor, width: 40, height: 40, borderRadius: 10 }}>
                  <n.icon size={18} />
                </div>
                <div>
                  <div className="pm-notice-title">{n.title}</div>
                  <div className="pm-notice-sub" style={{ marginTop: 3 }}>{n.body}</div>
                  <div className="pm-notice-time" style={{ marginTop: 6 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Search Results */}
          <div className="pm-card">
            <div className="pm-section-header">
              <div className="pm-section-title">Quick Search Results</div>
              <span className="pm-badge pm-badge-warning">Pending</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="pm-table">
                <thead>
                  <tr>
                    <th>Record ID</th>
                    <th>Parent Name</th>
                    <th>DOB</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecords.map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>{r.id}</td>
                      <td>{r.parent}</td>
                      <td style={{ color: 'var(--pm-text-muted)' }}>{r.dob}</td>
                      <td><StatusBadge s={r.status} /></td>
                      <td>
                        <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => onNavigate('search')}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="pm-btn pm-btn-outline pm-btn-sm w-100 mt-3" onClick={() => onNavigate('search')}>
              Search All Records <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="col-12 col-lg-5">
          <div className="pm-card">
            <div className="pm-section-header">
              <div className="pm-section-title">Recent Activity Log</div>
            </div>
            {activity.map((a, i) => (
              <div className="pm-notice-item" key={i}>
                <div className="pm-notice-icon" style={{ background: `${a.color}18`, color: a.color }}>
                  <a.icon size={15} />
                </div>
                <div>
                  <div className="pm-notice-title">
                    {a.title}{a.sub && <span style={{ fontWeight: 400, color: 'var(--pm-text-muted)' }}> {a.sub}</span>}
                  </div>
                  <div className="pm-notice-time">{a.time}</div>
                </div>
              </div>
            ))}
            <button className="pm-btn pm-btn-ghost pm-btn-sm w-100 mt-3" style={{ justifyContent: 'center' }}>
              <Download size={13} /> Download Full Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
