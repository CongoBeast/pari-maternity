import React, { useState, useMemo } from 'react';
import {
  ScanLine, Calendar, Clock, Plus, X, User, Stethoscope,
  MapPin, FileText, Ruler, ClipboardList, CheckCircle2,
} from 'lucide-react';

// ---- Demo scan data ----------------------------------------------------------
const INITIAL_SCANS = [
  {
    id: 'SC-3088', type: 'Detailed Morphology Scan', modality: 'Ultrasound',
    week: 20, date: 'May 12, 2024', time: '02:15 PM', status: 'completed',
    location: 'Imaging Center · Ground Floor',
    attending: { name: 'Dr. Priya Nair', role: 'Sonographer' },
    reviewedBy: { name: 'Dr. Sarah Jenkins', role: 'Obstetrician' },
    readings: [
      { label: 'Biparietal Diameter (BPD)', value: '48 mm' },
      { label: 'Head Circumference (HC)', value: '176 mm' },
      { label: 'Abdominal Circumference (AC)', value: '152 mm' },
      { label: 'Femur Length (FL)', value: '33 mm' },
      { label: 'Estimated Fetal Weight (EFW)', value: '320 g' },
      { label: 'Fetal Heart Rate', value: '152 bpm' },
    ],
    findings:
      'All major organ systems visualised and appear structurally normal. Four-chamber cardiac view symmetrical with regular rhythm. Placenta posterior, clear of the cervical os. Amniotic fluid volume within normal limits. Growth measurements consistent with 20 weeks gestation.',
    impression: 'Normal mid-trimester anatomy scan. No anomalies detected.',
  },
  {
    id: 'SC-2954', type: 'First Trimester Screening (NT)', modality: 'Ultrasound',
    week: 12, date: 'Mar 04, 2024', time: '10:00 AM', status: 'completed',
    location: 'Imaging Center · Ground Floor',
    attending: { name: 'Dr. Marcus Klein', role: 'Maternal-Fetal Specialist' },
    reviewedBy: { name: 'Dr. Sarah Jenkins', role: 'Obstetrician' },
    readings: [
      { label: 'Crown-Rump Length (CRL)', value: '58 mm' },
      { label: 'Nuchal Translucency (NT)', value: '1.4 mm' },
      { label: 'Fetal Heart Rate', value: '161 bpm' },
      { label: 'Nasal Bone', value: 'Present' },
    ],
    findings:
      'Single viable intrauterine pregnancy. Nuchal translucency measurement within normal range, low risk on combined screening. Nasal bone present. Crown-rump length consistent with dates.',
    impression: 'Low-risk first trimester screen. Dating confirmed at 12 weeks.',
  },
  {
    id: 'SC-2810', type: 'Dating & Viability Scan', modality: 'Ultrasound',
    week: 8, date: 'Jan 22, 2024', time: '09:45 AM', status: 'completed',
    location: 'Imaging Center · Ground Floor',
    attending: { name: 'Dr. Priya Nair', role: 'Sonographer' },
    reviewedBy: { name: 'Dr. Sarah Jenkins', role: 'Obstetrician' },
    readings: [
      { label: 'Crown-Rump Length (CRL)', value: '16 mm' },
      { label: 'Fetal Heart Rate', value: '168 bpm' },
      { label: 'Gestational Sac', value: 'Normal' },
    ],
    findings:
      'Single intrauterine gestational sac with a viable embryo. Cardiac activity present. Estimated gestational age 8 weeks, estimated due date October 12.',
    impression: 'Viable single pregnancy confirmed. EDD Oct 12.',
  },
];

const UPCOMING_SCANS = [
  {
    id: 'SC-3201', type: 'Fetal Growth Scan', modality: 'Ultrasound',
    week: 28, date: 'Jul 18, 2024', time: '11:30 AM', status: 'scheduled',
    location: 'Imaging Center · Ground Floor',
    attending: { name: 'Dr. Priya Nair', role: 'Sonographer' },
    prep: 'No special preparation required. Please arrive 10 minutes early to check in.',
  },
];

const SCAN_TYPES = [
  'Fetal Growth Scan',
  'Detailed Morphology Scan',
  'Doppler Flow Study',
  'Cervical Length Scan',
  'Biophysical Profile (BPP)',
  'Other',
];

// ---- Reusable bits -----------------------------------------------------------
function PersonRow({ icon: Icon, label, person }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--pm-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} style={{ color: 'var(--pm-primary)' }} />
      </div>
      <div>
        <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
        <div style={{ fontSize: '0.88rem', color: 'var(--pm-text)', fontWeight: 600 }}>{person.name}</div>
        <div style={{ fontSize: '0.76rem', color: 'var(--pm-text-muted)' }}>{person.role}</div>
      </div>
    </div>
  );
}

// ---- Details modal -----------------------------------------------------------
function ScanModal({ scan, onClose }) {
  if (!scan) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pm-card"
        style={{ maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
      >
        <button onClick={onClose} className="pm-btn pm-btn-ghost pm-btn-sm" style={{ position: 'absolute', top: 14, right: 14 }} aria-label="Close">
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--pm-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ScanLine size={20} style={{ color: 'var(--pm-primary)' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--pm-text)' }}>{scan.type}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{scan.id} · {scan.modality} · Week {scan.week}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 18, fontSize: '0.8rem', color: 'var(--pm-text-muted)' }}>
          <Calendar size={14} /> {scan.date}
          <Clock size={14} style={{ marginLeft: 6 }} /> {scan.time}
          <MapPin size={14} style={{ marginLeft: 6 }} /> {scan.location}
        </div>

        {/* Readings table */}
        {scan.readings && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontWeight: 700, color: 'var(--pm-text)', marginBottom: 8 }}>
              <Ruler size={15} style={{ color: 'var(--pm-primary)' }} /> Measurements & Readings
            </div>
            <div style={{ border: '1px solid var(--pm-border)', borderRadius: 10, overflow: 'hidden', marginBottom: 18 }}>
              {scan.readings.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '9px 12px', fontSize: '0.85rem',
                  background: i % 2 ? 'var(--pm-surface-2)' : 'transparent',
                }}>
                  <span style={{ color: 'var(--pm-text-muted)' }}>{r.label}</span>
                  <span style={{ color: 'var(--pm-text)', fontWeight: 600 }}>{r.value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Findings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontWeight: 700, color: 'var(--pm-text)', marginBottom: 6 }}>
          <FileText size={15} style={{ color: 'var(--pm-primary)' }} /> Findings & Notes
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--pm-text)', lineHeight: 1.6, marginBottom: 14 }}>{scan.findings}</p>

        {scan.impression && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: 12, borderRadius: 10, background: 'var(--pm-primary-light)', marginBottom: 18 }}>
            <CheckCircle2 size={16} style={{ color: 'var(--pm-primary)', flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--pm-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Impression</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--pm-text)', marginTop: 2 }}>{scan.impression}</div>
            </div>
          </div>
        )}

        {/* Attending personnel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontWeight: 700, color: 'var(--pm-text)', marginBottom: 12 }}>
          <Stethoscope size={15} style={{ color: 'var(--pm-primary)' }} /> Attending Personnel
        </div>
        <div className="row g-3">
          <div className="col-12 col-sm-6"><PersonRow icon={User} label="Performed By" person={scan.attending} /></div>
          {scan.reviewedBy && (
            <div className="col-12 col-sm-6"><PersonRow icon={Stethoscope} label="Reviewed By" person={scan.reviewedBy} /></div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Schedule-scan modal -----------------------------------------------------
function ScheduleModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ type: SCAN_TYPES[0], date: '', time: '', location: 'Imaging Center · Ground Floor', notes: '' });
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const canSave = form.date && form.time;

  const inputStyle = { width: '100%', padding: '9px 11px', borderRadius: 8, border: '1px solid var(--pm-border)', background: 'var(--pm-surface-2)', color: 'var(--pm-text)', fontSize: '0.88rem', outline: 'none' };
  const labelStyle = { fontSize: '0.72rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 5, display: 'block' };

  const submit = () => {
    if (!canSave) return;
    onAdd({
      id: `SC-${Math.floor(3300 + Math.random() * 700)}`,
      type: form.type, modality: 'Ultrasound', week: null,
      date: form.date, time: form.time, status: 'scheduled',
      location: form.location,
      attending: { name: 'To be assigned', role: 'Imaging team' },
      prep: form.notes || 'No special preparation required. Please arrive 10 minutes early to check in.',
    });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} className="pm-card" style={{ maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} className="pm-btn pm-btn-ghost pm-btn-sm" style={{ position: 'absolute', top: 14, right: 14 }} aria-label="Close">
          <X size={16} />
        </button>
        <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <Plus size={17} style={{ color: 'var(--pm-primary)' }} /> Schedule a Scan
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Scan Type</label>
          <select name="type" value={form.type} onChange={onChange} style={inputStyle}>
            {SCAN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="row g-2" style={{ marginBottom: 14 }}>
          <div className="col-6">
            <label style={labelStyle}>Date</label>
            <input type="date" name="date" value={form.date} onChange={onChange} style={inputStyle} />
          </div>
          <div className="col-6">
            <label style={labelStyle}>Time</label>
            <input type="time" name="time" value={form.time} onChange={onChange} style={inputStyle} />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Location</label>
          <input name="location" value={form.location} onChange={onChange} style={inputStyle} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Notes / Reason (optional)</label>
          <textarea name="notes" value={form.notes} onChange={onChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="pm-btn pm-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="pm-btn pm-btn-primary" onClick={submit} disabled={!canSave} style={{ opacity: canSave ? 1 : 0.5 }}>
            <Calendar size={15} /> Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Page --------------------------------------------------------------------
export default function Scans() {
  const [scans] = useState(INITIAL_SCANS);
  const [upcoming, setUpcoming] = useState(UPCOMING_SCANS);
  const [selected, setSelected] = useState(null);
  const [scheduling, setScheduling] = useState(false);

  const addUpcoming = (scan) => setUpcoming((prev) => [scan, ...prev]);

  const completedSorted = useMemo(() => scans, [scans]);

  return (
    <div>
      {/* Header */}
      <div className="pm-card mb-3">
        <div className="pm-section-header" style={{ marginBottom: 0 }}>
          <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ScanLine size={18} style={{ color: 'var(--pm-primary)' }} /> Scans & Imaging
          </div>
          <button className="pm-btn pm-btn-primary" onClick={() => setScheduling(true)}>
            <Plus size={15} /> Schedule Scan
          </button>
        </div>
      </div>

      {/* Upcoming scans */}
      <div className="pm-card mb-3">
        <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Calendar size={16} style={{ color: 'var(--pm-primary)' }} /> Upcoming Scans
        </div>
        {upcoming.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: 'var(--pm-text-muted)', padding: '8px 0' }}>
            No scans scheduled. Use “Schedule Scan” to book one.
          </div>
        ) : (
          <div className="row g-3">
            {upcoming.map((scan) => (
              <div className="col-12 col-md-6" key={scan.id}>
                <div style={{ border: '1px dashed var(--pm-primary)', borderRadius: 12, padding: 16, height: '100%', background: 'var(--pm-primary-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span className="pm-badge pm-badge-info">Scheduled</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>{scan.id}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--pm-text)' }}>{scan.type}</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: 'var(--pm-primary)', fontWeight: 600, marginTop: 8 }}>
                    <span><Calendar size={13} style={{ marginRight: 4 }} />{scan.date}</span>
                    <span><Clock size={13} style={{ marginRight: 4 }} />{scan.time}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', marginTop: 6 }}>
                    <MapPin size={12} style={{ marginRight: 4 }} />{scan.location}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={13} /> {scan.attending.name} · {scan.attending.role}
                  </div>
                  {scan.prep && (
                    <div style={{ fontSize: '0.76rem', color: 'var(--pm-text-muted)', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--pm-border)', display: 'flex', gap: 6 }}>
                      <ClipboardList size={13} style={{ flexShrink: 0, marginTop: 1 }} /> {scan.prep}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scan history */}
      <div className="pm-card">
        <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <ScanLine size={16} style={{ color: 'var(--pm-primary)' }} /> Scan History
        </div>
        <div className="row g-3">
          {completedSorted.map((scan) => (
            <div className="col-12 col-md-6" key={scan.id}>
              <div
                onClick={() => setSelected(scan)}
                style={{ border: '1px solid var(--pm-border)', borderRadius: 12, padding: 16, height: '100%', background: 'var(--pm-surface-2)', cursor: 'pointer', transition: 'transform 0.12s ease, box-shadow 0.12s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--pm-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ScanLine size={18} style={{ color: 'var(--pm-primary)' }} />
                  </div>
                  <span className="pm-badge pm-badge-success">Completed</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--pm-text)' }}>{scan.type}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', marginBottom: 8 }}>{scan.modality} · Week {scan.week}</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--pm-text-muted)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {scan.findings}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--pm-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--pm-text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <User size={12} /> {scan.attending.name}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--pm-primary)', fontWeight: 600 }}>{scan.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ScanModal scan={selected} onClose={() => setSelected(null)} />
      {scheduling && <ScheduleModal onClose={() => setScheduling(false)} onAdd={addUpcoming} />}
    </div>
  );
}