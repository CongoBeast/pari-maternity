import React from 'react';
import {
  BedDouble, Wrench, Megaphone, Users, ArrowRight, Baby, Activity
} from 'lucide-react';

const occupancy = [
  { label: 'Delivery Rooms',     pct: 88, occupied: '14/16', badge: 'HIGH',     badgeClass: 'pm-badge-warning' },
  { label: 'Nurseries',          pct: 62, occupied: '25/40', badge: '98% Verified', badgeClass: 'pm-badge-success' },
  { label: 'Post-Natal Care',    pct: 45, occupied: '18/40', badge: 'Stable Flow',  badgeClass: 'pm-badge-info' },
  { label: 'Recovery Rooms',     pct: 20, occupied: '4/20',  badge: 'Low Demand',   badgeClass: 'pm-badge-neutral' },
  { label: 'Baby Incubators',    pct: 95, occupied: '19/20', badge: 'CRITICAL',     badgeClass: 'pm-badge-danger' },
];

const maintenance = [
  { title: 'AC Unit – Delivery Wing B', sub: 'Reported 2h ago by Nurse Charamba' },
  { title: 'Emergency Lighting Test',   sub: 'Scheduled for 14:00 PM' },
];

const staffNotices = [
  { title: 'New Pediatric Protocols',  sub: 'Effective from next Monday' },
  { title: 'Employee of the Month',    sub: 'Dr. Elena Gandawa – Neonatology' },
];

const floor = [
  { floor: '1F', label: 'Delivery & Emergency', person: 'Dr. Makomborero Msipa',     role: 'Lead Surgeon' },
  { floor: '2F', label: 'Neonatal Care (NICU)',  person: 'Dr. James Mugaga',   role: 'Neonatologist' },
  { floor: '3F', label: 'Post-Natal Wards',      person: 'Head Nurse Sibanda',  role: 'Ward Manager' },
  { floor: '4F', label: 'Admin & Pharmacy',      person: 'Sarah Matiwaza',      role: 'Ops Director' },
];

export default function AdminDashboard({ onNavigate }) {
  return (
    <div>
      {/* Occupancy stat cards */}
      <div className="row g-3 mb-4">
        {occupancy.map((item, i) => (
          <div className="col-6 col-md-4 col-xl" key={i}>
            <div className="pm-stat-card" style={item.pct >= 90 ? { background: 'var(--pm-danger)' } : {}}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <BedDouble size={16} style={{ opacity: 0.7 }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'rgba(255,255,255,0.18)', padding: '1px 7px', borderRadius: 20 }}>{item.badge}</span>
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.75, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1 }}>{item.pct}%</div>
              <div className="pm-progress mt-2"><div className="pm-progress-fill" style={{ width: `${item.pct}%` }} /></div>
              <div style={{ fontSize: '0.7rem', opacity: 0.65, marginTop: 5 }}>{item.occupied} occupied</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* Maintenance */}
        <div className="col-12 col-md-6 col-xl-4">
          <div className="pm-card h-100">
            <div className="pm-section-header">
              <div className="pm-section-title">Maintenance</div>
              <button className="pm-btn pm-btn-primary pm-btn-sm">
                <ArrowRight size={12} /> Publish
              </button>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginBottom: 14 }}>Pending technical reports</div>
            {maintenance.map((m, i) => (
              <div className="pm-notice-item" key={i}>
                <div className="pm-notice-icon">
                  <Wrench size={15} />
                </div>
                <div>
                  <div className="pm-notice-title">{m.title}</div>
                  <div className="pm-notice-time">{m.sub}</div>
                </div>
              </div>
            ))}
            <button className="pm-btn pm-btn-ghost pm-btn-sm w-100 mt-3" onClick={() => onNavigate('fault')}>
              View All Fault Reports
            </button>
          </div>
        </div>

        {/* Staff Notices */}
        <div className="col-12 col-md-6 col-xl-4">
          <div className="pm-card h-100">
            <div className="pm-section-header">
              <div className="pm-section-title">Staff Notices</div>
              <button className="pm-btn pm-btn-primary pm-btn-sm" style={{ background: 'var(--pm-success)' }}>
                <Megaphone size={12} /> Publish
              </button>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginBottom: 14 }}>Global announcements</div>
            {staffNotices.map((n, i) => (
              <div className="pm-notice-item" key={i}>
                <div className="pm-notice-icon">
                  <Users size={15} />
                </div>
                <div>
                  <div className="pm-notice-title">{n.title}</div>
                  <div className="pm-notice-time">{n.sub}</div>
                </div>
              </div>
            ))}
            <button className="pm-btn pm-btn-ghost pm-btn-sm w-100 mt-3" onClick={() => onNavigate('staff')}>
              View Staff
            </button>
          </div>
        </div>

        {/* Floor Schedule */}
        <div className="col-12 col-xl-4">
          <div className="pm-card h-100">
            <div className="pm-section-header">
              <div className="pm-section-title">Floor Schedule</div>
              <span className="pm-badge pm-badge-info">Today</span>
            </div>
            {floor.map((f, i) => (
              <div className="pm-floor-item" key={i}>
                <div className="pm-floor-badge">{f.floor}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pm-text)' }}>{f.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--pm-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: 'var(--pm-primary)' }}>
                      {f.person.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{f.person}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button className="pm-btn pm-btn-outline pm-btn-sm w-100 mt-3" onClick={() => onNavigate('staff')}>
              View Full Roster
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
