import React, { useState } from 'react';
import {
  History, Calendar, ScanLine, Pill, Users, CheckCircle2,
  Clock, XCircle, ChevronRight,
} from 'lucide-react';

// ---- Mock history data -------------------------------------------------
// In production these would come from the patient's records via props/API.

const appointmentHistory = [
  { title: 'Routine Prenatal Checkup', with: 'Dr. Sarah Jenkins', date: 'May 24, 2024', status: 'upcoming' },
  { title: 'Glucose Tolerance Test', with: 'Dr. Sarah Jenkins', date: 'May 18, 2024', status: 'completed' },
  { title: 'Detailed Morphology Scan Review', with: 'Dr. Sarah Jenkins', date: 'May 13, 2024', status: 'completed' },
  { title: 'Routine Prenatal Checkup', with: 'Dr. Sarah Jenkins', date: 'Apr 26, 2024', status: 'completed' },
  { title: 'First Trimester Screening', with: 'Dr. Michael Kwan', date: 'Mar 02, 2024', status: 'completed' },
  { title: 'Initial Confirmation Visit', with: 'Dr. Sarah Jenkins', date: 'Jan 15, 2024', status: 'completed' },
];

const scanHistory = [
  { title: 'Detailed Morphology Scan', date: 'May 12, 2024', result: 'Normal development', icon: '🩻' },
  { title: 'Nuchal Translucency Scan', date: 'Mar 02, 2024', result: 'Low risk', icon: '🩻' },
  { title: 'Dating Ultrasound', date: 'Jan 15, 2024', result: 'Confirmed 7 weeks', icon: '🩻' },
];

const prescriptionHistory = [
  { name: 'Prenatal Multivitamin', prescribedBy: 'Dr. Sarah Jenkins', date: 'Jan 15, 2024', status: 'active' },
  { name: 'Iron Supplement (Ferrous Sulfate)', prescribedBy: 'Dr. Sarah Jenkins', date: 'Apr 26, 2024', status: 'active' },
  { name: 'Folic Acid 5mg', prescribedBy: 'Dr. Sarah Jenkins', date: 'Jan 15, 2024', status: 'completed' },
];

const visitorHistory = [
  { name: 'David Moyo', relation: 'Spouse', date: 'May 12, 2024', time: '02:00 PM – 03:30 PM' },
  { name: 'Grace Moyo', relation: 'Mother', date: 'Apr 26, 2024', time: '10:00 AM – 11:00 AM' },
  { name: 'David Moyo', relation: 'Spouse', date: 'Mar 02, 2024', time: '09:00 AM – 10:15 AM' },
];

// ---- Small shared bits --------------------------------------------------

function StatusBadge({ status }) {
  const map = {
    upcoming: { cls: 'pm-badge-info', icon: Clock, label: 'Upcoming' },
    completed: { cls: 'pm-badge-success', icon: CheckCircle2, label: 'Completed' },
    active: { cls: 'pm-badge-success', icon: CheckCircle2, label: 'Active' },
    cancelled: { cls: 'pm-badge-danger', icon: XCircle, label: 'Cancelled' },
  };
  const { cls, icon: Icon, label } = map[status] || map.completed;
  return (
    <span className={`pm-badge ${cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <Icon size={11} /> {label}
    </span>
  );
}

function SectionCard({ icon: Icon, title, count, children, action }) {
  return (
    <div className="pm-card mb-3">
      <div className="pm-section-header">
        <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={17} style={{ color: 'var(--pm-primary)' }} /> {title}
          <span style={{
            fontSize: '0.7rem', color: 'var(--pm-text-muted)', fontWeight: 500,
            background: 'var(--pm-surface-2)', borderRadius: 20, padding: '1px 8px',
          }}>
            {count}
          </span>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// Compact single-line-ish history row
function HistoryRow({ leading, title, subtitle, trailing, badge }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
      borderBottom: '1px solid var(--pm-border)',
    }}>
      {leading}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '0.85rem', fontWeight: 600, color: 'var(--pm-text)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {title}
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--pm-text-muted)' }}>{subtitle}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '0.74rem', color: 'var(--pm-text-muted)', marginBottom: 4 }}>{trailing}</div>
        {badge}
      </div>
    </div>
  );
}

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'scans', label: 'Scans' },
  { key: 'prescriptions', label: 'Prescriptions' },
  { key: 'visitors', label: 'Visitors' },
];

export default function PatientHistory({ user }) {
  const [tab, setTab] = useState('all');
  const [apptLimit, setApptLimit] = useState(4);

  const totalRecords =
    appointmentHistory.length + scanHistory.length + prescriptionHistory.length + visitorHistory.length;

  const showAppointments = tab === 'all' || tab === 'appointments';
  const showScans = tab === 'all' || tab === 'scans';
  const showPrescriptions = tab === 'all' || tab === 'prescriptions';
  const showVisitors = tab === 'all' || tab === 'visitors';

  const visibleAppointments = tab === 'appointments' ? appointmentHistory : appointmentHistory.slice(0, apptLimit);

  return (
    <div>
      {/* Header */}
      <div className="pm-card mb-3" style={{
        background: 'linear-gradient(135deg, var(--pm-primary) 0%, var(--pm-primary-dark) 100%)',
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <History size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.1 }}>
              Maternity Ward History
            </div>
            <div style={{ fontSize: '0.82rem', opacity: 0.85, marginTop: 2 }}>
              {totalRecords} records on file · Updated continuously through your care journey
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 2 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="pm-btn pm-btn-sm"
            style={{
              flexShrink: 0,
              background: tab === t.key ? 'var(--pm-primary)' : 'var(--pm-surface-2)',
              color: tab === t.key ? '#fff' : 'var(--pm-text-muted)',
              border: tab === t.key ? 'none' : '1px solid var(--pm-border)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="row g-3">
        <div className={tab === 'all' ? 'col-12 col-lg-7' : 'col-12'}>
          {/* Appointments */}
          {showAppointments && (
            <SectionCard
              icon={Calendar}
              title="Appointments"
              count={appointmentHistory.length}
              action={tab === 'all' && appointmentHistory.length > apptLimit ? (
                <button
                  className="pm-btn pm-btn-ghost pm-btn-sm"
                  onClick={() => setApptLimit(appointmentHistory.length)}
                >
                  View All <ChevronRight size={13} />
                </button>
              ) : null}
            >
              {visibleAppointments.map((a, i) => (
                <HistoryRow
                  key={i}
                  title={a.title}
                  subtitle={a.with}
                  trailing={a.date}
                  badge={<StatusBadge status={a.status} />}
                />
              ))}
            </SectionCard>
          )}

          {/* Scans */}
          {showScans && (
            <SectionCard icon={ScanLine} title="Scans Attended" count={scanHistory.length}>
              {scanHistory.map((s, i) => (
                <HistoryRow
                  key={i}
                  leading={<span style={{ fontSize: '1.1rem' }}>{s.icon}</span>}
                  title={s.title}
                  subtitle={s.result}
                  trailing={s.date}
                />
              ))}
            </SectionCard>
          )}
        </div>

        <div className={tab === 'all' ? 'col-12 col-lg-5' : 'col-12'}>
          {/* Prescriptions */}
          {showPrescriptions && (
            <SectionCard icon={Pill} title="Prescriptions" count={prescriptionHistory.length}>
              {prescriptionHistory.map((p, i) => (
                <HistoryRow
                  key={i}
                  title={p.name}
                  subtitle={`${p.prescribedBy} · ${p.date}`}
                  badge={<StatusBadge status={p.status} />}
                />
              ))}
            </SectionCard>
          )}

          {/* Visitors */}
          {showVisitors && (
            <SectionCard icon={Users} title="Visitor Log" count={visitorHistory.length}>
              {visitorHistory.map((v, i) => (
                <HistoryRow
                  key={i}
                  leading={
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--pm-primary-light)', color: 'var(--pm-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.68rem', fontWeight: 700,
                    }}>
                      {v.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                    </div>
                  }
                  title={v.name}
                  subtitle={`${v.relation} · ${v.time}`}
                  trailing={v.date}
                />
              ))}
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}