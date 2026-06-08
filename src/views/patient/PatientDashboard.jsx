import React from 'react';
import { Heart, Weight, Calendar, FlaskConical, Megaphone, ArrowRight, BookOpen } from 'lucide-react';

const appointments = [
  {
    title: 'Routine Prenatal Checkup',
    doctor: 'Dr. Sarah Jenkins',
    room: 'Room 402',
    date: 'May 24, 2024',
    time: '09:30 AM',
    status: 'upcoming',
  },
  {
    title: 'Detailed Morphology Scan',
    doctor: 'Imaging Center',
    room: 'Ground Floor',
    date: 'May 12, 2024',
    time: '02:15 PM',
    status: 'completed',
  },
];

const notifications = [
  { text: 'New Maternity Yoga Classes starting this Monday in the Wellness Wing.', time: '2 hours ago', type: 'info' },
  { text: 'Scheduled Maintenance: Patient portal will be offline for 30 mins tonight at 12 AM.', time: 'Yesterday', type: 'system' },
];

const readings = [
  { title: 'Optimal Nutrition for the 2nd Trimester', duration: '4 min read', icon: '🥗' },
  { title: 'Improving Sleep Quality During Pregnancy', duration: '6 min read', icon: '😴' },
];

export default function PatientDashboard({ user, onNavigate }) {
  const week = 24;
  const progress = (week / 40) * 100;

  return (
    <div>
      <div className="row g-3 mb-4">
        {/* Pregnancy status hero */}
        <div className="col-12 col-lg-7">
          <div className="pm-card" style={{
            background: 'linear-gradient(135deg, var(--pm-primary) 0%, var(--pm-primary-dark) 100%)',
            color: '#fff',
            minHeight: 200,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ position: 'absolute', right: 20, bottom: -40, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.75, background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: 20 }}>CURRENT STATUS</span>
            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '3rem', fontWeight: 700, margin: '8px 0 4px', lineHeight: 1 }}>
              Week {week}
            </div>
            <div style={{ fontSize: '1rem', opacity: 0.85, marginBottom: 24 }}>Second Trimester • Developing Nicely</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', opacity: 0.7, marginBottom: 8 }}>
              <span>Conception</span><span>Trimester 2</span><span>Due Date: Oct 12</span>
            </div>
            <div className="pm-progress">
              <div className="pm-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Right stat cards */}
        <div className="col-12 col-lg-5 d-flex flex-column gap-3">
          <div className="pm-card" style={{ background: 'var(--pm-primary)', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Heart size={20} style={{ opacity: 0.8 }} />
              <span style={{ fontSize: '0.78rem', opacity: 0.8 }}>Baby's Heartbeat</span>
            </div>
            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '2.4rem', fontWeight: 700, margin: '6px 0 2px' }}>145 BPM</div>
            <div style={{ fontSize: '0.72rem', opacity: 0.65 }}>Last checked 2 hours ago</div>
          </div>
          <div className="pm-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <Weight size={18} style={{ color: 'var(--pm-text-muted)' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>Weight Gain</span>
            </div>
            <div className="pm-stat-value" style={{ color: 'var(--pm-primary)' }}>+5.2 kg</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-success)', marginTop: 4 }}>✓ Within healthy range</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Appointments */}
        <div className="col-12 col-lg-7">
          <div className="pm-card mb-3">
            <div className="pm-section-header">
              <div className="pm-section-title">Recent Appointments</div>
              <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => onNavigate('history')}>
                View Schedule
              </button>
            </div>
            <div className="row g-3">
              {appointments.map((appt, i) => (
                <div className="col-12 col-sm-6" key={i}>
                  <div style={{ border: '1px solid var(--pm-border)', borderRadius: 10, padding: 16, height: '100%', background: 'var(--pm-surface-2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <Calendar size={20} style={{ color: 'var(--pm-primary)', opacity: 0.7 }} />
                      <span className={`pm-badge ${appt.status === 'upcoming' ? 'pm-badge-info' : 'pm-badge-success'}`}>
                        {appt.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--pm-text)', marginBottom: 4 }}>{appt.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{appt.doctor} · {appt.room}</div>
                    <div style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--pm-primary)', fontWeight: 600 }}>
                      {appt.date}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)' }}>{appt.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hospital notifications */}
          <div className="pm-card">
            <div className="pm-section-title" style={{ marginBottom: 14 }}>Hospital-wide Notifications</div>
            {notifications.map((n, i) => (
              <div className="pm-notice-item" key={i}>
                <div className="pm-notice-icon" style={n.type === 'system' ? { background: 'var(--pm-surface-2)', color: 'var(--pm-text-muted)' } : {}}>
                  <Megaphone size={14} />
                </div>
                <div>
                  <div className="pm-notice-sub" style={{ color: 'var(--pm-text)', fontSize: '0.85rem' }}>{n.text}</div>
                  <div className="pm-notice-time">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="col-12 col-lg-5 d-flex flex-column gap-3">
          {/* Recommended Readings */}
          <div className="pm-card">
            <div className="pm-section-header">
              <div className="pm-section-title">Recommended Readings</div>
              <BookOpen size={16} style={{ color: 'var(--pm-primary)' }} />
            </div>
            {readings.map((r, i) => (
              <div className="pm-notice-item" key={i} style={{ cursor: 'pointer' }}>
                <div style={{ width: 42, height: 42, borderRadius: 8, background: 'var(--pm-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                  {r.icon}
                </div>
                <div>
                  <div className="pm-notice-title">{r.title}</div>
                  <div className="pm-notice-time">{r.duration}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Care Team */}
          <div className="pm-card" style={{ background: 'var(--pm-primary-dark)', color: '#fff' }}>
            <div style={{ fontSize: '0.78rem', opacity: 0.75, marginBottom: 4 }}>Care Team</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: 14 }}>Quick access to your specialists</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              {['SJ', 'MK', 'OA'].map((init, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: `rgba(255,255,255,${0.15 + i * 0.05})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700, marginLeft: i > 0 ? -8 : 0,
                  border: '2px solid rgba(255,255,255,0.2)',
                }}>
                  {init}
                </div>
              ))}
              <div style={{ marginLeft: 4, fontSize: '0.78rem', opacity: 0.75 }}>+2 more</div>
            </div>
            <button className="pm-btn pm-btn-primary w-100" style={{ justifyContent: 'center' }}>
              Message Care Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
