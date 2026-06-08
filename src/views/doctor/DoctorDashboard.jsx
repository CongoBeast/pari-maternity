import React from 'react';
import {
  Users, Pill, Calendar, ArrowRight, AlertCircle, Clock, CheckCircle, Info, Siren
} from 'lucide-react';

const theatre = [
  { time: '08:30 AM', patient: 'Elena Gilbert',    proc: 'C-Section (Planned)',  room: 'Room 402',   status: 'confirmed' },
  { time: '11:00 AM', patient: 'Serena Williams',  proc: 'Induction',            room: 'Room 105',   status: 'pending' },
  { time: '02:15 PM', patient: 'Nora West-Allen',  proc: 'Post-partum Exam',     room: 'Theatre 2',  status: 'scheduled' },
  { time: '04:45 PM', patient: 'Wanda Maximoff',   proc: 'Cerclage Procedure',   room: 'Theatre 1',  status: 'preop' },
];

const notices = [
  { icon: AlertCircle, color: 'var(--pm-danger)', title: 'Staff Meeting: Emergency Protocols', sub: 'Starts in 30 mins · Conference Hall' },
  { icon: Clock,       color: 'var(--pm-warning)', title: 'System Maintenance Tonight',        sub: 'Maternal OS down 2AM – 4AM' },
  { icon: Info,        color: 'var(--pm-info)',    title: 'New Lab Requisition Guidelines',    sub: 'Updated document in Help Center' },
];

function statusBadge(s) {
  const map = {
    confirmed: 'pm-badge-success',
    pending:   'pm-badge-warning',
    scheduled: 'pm-badge-info',
    preop:     'pm-badge-neutral',
  };
  const labels = { confirmed: 'Confirmed', pending: 'Pending Prep', scheduled: 'Scheduled', preop: 'Pre-op' };
  return <span className={`pm-badge ${map[s] || 'pm-badge-neutral'}`}>{labels[s] || s}</span>;
}

export default function DoctorDashboard({ user, onNavigate }) {
  return (
    <div>
      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <div className="pm-stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('patients')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Users size={20} style={{ opacity: 0.8 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, opacity: 0.85, background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 20 }}>+12%</span>
            </div>
            <div className="pm-card-title" style={{ color: 'rgba(255,255,255,0.7)' }}>Active Patients</div>
            <div className="pm-stat-value" style={{ color: '#fff', fontSize: '2.4rem' }}>42</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: 4 }}>Go to Full Page →</div>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="pm-stat-card secondary" style={{ cursor: 'pointer' }} onClick={() => onNavigate('prescriptions')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Pill size={20} style={{ color: 'var(--pm-primary)', opacity: 0.8 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--pm-text-muted)', background: 'var(--pm-surface-2)', padding: '2px 8px', borderRadius: 20, border: '1px solid var(--pm-border)' }}>Stable</span>
            </div>
            <div className="pm-card-title">Prescriptions Today</div>
            <div className="pm-stat-value">18</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 4 }}>Go to Full Page →</div>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="pm-stat-card secondary" style={{ border: '1px solid var(--pm-danger)', cursor: 'pointer' }} onClick={() => onNavigate('theatre')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Calendar size={20} style={{ color: 'var(--pm-primary)', opacity: 0.8 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--pm-danger)', background: '#fee2e2', padding: '2px 8px', borderRadius: 20 }}>! Urgent</span>
            </div>
            <div className="pm-card-title">Theatre Bookings</div>
            <div className="pm-stat-value">06</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 4 }}>Go to Full Page →</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Theatre Schedule */}
        <div className="col-12 col-lg-7">
          <div className="pm-card">
            <div className="pm-section-header">
              <div>
                <div className="pm-section-title">Theatre Scheduling</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>Operations scheduled for Tuesday, Oct 24</div>
              </div>
              <button className="pm-btn pm-btn-primary pm-btn-sm" onClick={() => onNavigate('theatre')}>
                Go to Full Page <ArrowRight size={13} />
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="pm-table">
                <thead>
                  <tr>
                    <th>TIME</th>
                    <th>PATIENT</th>
                    <th>PROCEDURE</th>
                    <th>THEATRE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {theatre.map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{row.time}</td>
                      <td>{row.patient}</td>
                      <td style={{ color: 'var(--pm-text-muted)' }}>{row.proc}</td>
                      <td style={{ color: 'var(--pm-text-muted)' }}>{row.room}</td>
                      <td>{statusBadge(row.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-12 col-lg-5 d-flex flex-column gap-3">
          {/* Recent Notices */}
          <div className="pm-card">
            <div className="pm-section-header">
              <div className="pm-section-title">Recent Notices</div>
              <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => onNavigate('dashboard')}>
                View All
              </button>
            </div>
            {notices.map((n, i) => (
              <div className="pm-notice-item" key={i}>
                <div className="pm-notice-icon" style={{ background: `${n.color}18`, color: n.color }}>
                  <n.icon size={16} />
                </div>
                <div>
                  <div className="pm-notice-title">{n.title}</div>
                  <div className="pm-notice-sub">{n.sub}</div>
                </div>
              </div>
            ))}
            <button className="pm-btn pm-btn-outline w-100 mt-3 pm-btn-sm" onClick={() => onNavigate('dashboard')}>
              Go to Full Page
            </button>
          </div>

          {/* Shift Overview */}
          <div className="pm-card" style={{ background: 'var(--pm-primary)', color: '#fff' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', opacity: 0.7, marginBottom: 12 }}>SHIFT OVERVIEW</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' }}>
                {user?.name?.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{user?.name}</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.75 }}>On Call: 08:00 – 20:00</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>4</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Procedures Left</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>7</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Lab Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
