import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon, Plus, Siren, X, ArrowRight, Clock,
  AlertCircle, Info, CheckCircle, Activity, Stethoscope, Users,
  ChevronLeft, ChevronRight, MapPin, Search
} from 'lucide-react';

/* =================================================================
   TheatreScheduling — Doctor role
   Drop-in page. Uses existing pm-* classes + inline styles only,
   so it needs no new CSS (same convention as DoctorDashboard).
   ================================================================= */

/* ---------------------------- mock data --------------------------- */
const initialSchedule = [
  { time: '08:30 AM', patientId: 'MAT-1042', patient: 'Elena Gilbert',   proc: 'C-Section (Planned)', theatre: 'Theatre 1', team: ['Dr. Sarah Chen', 'Dr. Raj Patel', 'N. Owens', 'N. Bello'], status: 'inprogress', emergency: false },
  { time: '10:15 AM', patientId: 'MAT-0916', patient: 'Maya Hansen',     proc: 'Uterine Rupture Repair', theatre: 'Theatre 2', team: ['Dr. Adaeze Eze', 'Dr. Tom Hardy', 'N. Quinn'], status: 'emergency', emergency: true },
  { time: '11:00 AM', patientId: 'MAT-1098', patient: 'Serena Williams', proc: 'Induction',           theatre: 'Room 105',  team: ['Dr. Raj Patel', 'N. Owens'], status: 'pending', emergency: false },
  { time: '01:30 PM', patientId: 'MAT-1130', patient: 'Nora West-Allen', proc: 'Post-partum Exam',    theatre: 'Theatre 3', team: ['Dr. Sarah Chen', 'N. Bello'], status: 'confirmed', emergency: false },
  { time: '04:45 PM', patientId: 'MAT-1187', patient: 'Wanda Maximoff',  proc: 'Cerclage Procedure',  theatre: 'Theatre 1', team: ['Dr. Adaeze Eze', 'Dr. Raj Patel', 'N. Quinn', 'N. Owens', 'N. Bello'], status: 'preop', emergency: false },
];

const recentOps = [
  { date: 'Oct 23', patientId: 'MAT-0991', proc: 'C-Section (Planned)', theatre: 'Theatre 1', surgeon: 'Dr. Sarah Chen',  duration: '52 min', outcome: 'Successful' },
  { date: 'Oct 23', patientId: 'MAT-0987', proc: 'D&C',                 theatre: 'Theatre 2', surgeon: 'Dr. Raj Patel',   duration: '38 min', outcome: 'Successful' },
  { date: 'Oct 22', patientId: 'MAT-0974', proc: 'Emergency C-Section', theatre: 'Theatre 1', surgeon: 'Dr. Adaeze Eze',  duration: '47 min', outcome: 'Successful' },
  { date: 'Oct 22', patientId: 'MAT-0969', proc: 'Myomectomy',          theatre: 'Theatre 3', surgeon: 'Dr. Sarah Chen',  duration: '1h 24m', outcome: 'Complication' },
  { date: 'Oct 21', patientId: 'MAT-0958', proc: 'Cerclage Procedure',  theatre: 'Theatre 2', surgeon: 'Dr. Raj Patel',   duration: '41 min', outcome: 'Successful' },
];

const fullHistory = [
  ...recentOps,
  { date: 'Oct 21', patientId: 'MAT-0951', proc: 'Induction',          theatre: 'Room 105',  surgeon: 'Dr. Adaeze Eze', duration: '2h 10m', outcome: 'Successful' },
  { date: 'Oct 20', patientId: 'MAT-0944', proc: 'C-Section (Planned)',theatre: 'Theatre 1', surgeon: 'Dr. Sarah Chen', duration: '55 min', outcome: 'Successful' },
  { date: 'Oct 20', patientId: 'MAT-0938', proc: 'Emergency C-Section',theatre: 'Theatre 2', surgeon: 'Dr. Raj Patel',  duration: '44 min', outcome: 'Successful' },
  { date: 'Oct 19', patientId: 'MAT-0929', proc: 'D&C',                theatre: 'Theatre 3', surgeon: 'Dr. Adaeze Eze', duration: '36 min', outcome: 'Successful' },
  { date: 'Oct 19', patientId: 'MAT-0921', proc: 'Post-partum Exam',   theatre: 'Theatre 1', surgeon: 'Dr. Sarah Chen', duration: '22 min', outcome: 'Successful' },
  { date: 'Oct 18', patientId: 'MAT-0914', proc: 'Cerclage Procedure', theatre: 'Theatre 2', surgeon: 'Dr. Raj Patel',  duration: '49 min', outcome: 'Complication' },
  { date: 'Oct 18', patientId: 'MAT-0908', proc: 'Myomectomy',         theatre: 'Theatre 3', surgeon: 'Dr. Adaeze Eze', duration: '1h 31m', outcome: 'Successful' },
];

const orNotices = [
  { icon: Siren,       color: 'var(--pm-danger)',  title: 'Theatre 1 — Deep Clean Required',      sub: 'Post-emergency sterilization · ETA 45 min' },
  { icon: AlertCircle, color: 'var(--pm-warning)', title: 'Anesthesia Machine #2 — Maintenance',  sub: 'Theatre 2 · Backup unit in use' },
  { icon: Info,        color: 'var(--pm-info)',    title: 'New Sterile Field Protocol',           sub: 'Effective today · See Help Center' },
  { icon: CheckCircle, color: '#16a34a',           title: 'Theatre 3 — Ready',                    sub: 'Fully stocked & sterilized' },
];

const THEATRES   = ['Theatre 1', 'Theatre 2', 'Theatre 3', 'Room 105', 'Room 402'];
const PROCEDURES = ['C-Section (Planned)', 'Emergency C-Section', 'Induction', 'Cerclage Procedure', 'Post-partum Exam', 'D&C', 'Myomectomy', 'Uterine Rupture Repair', 'Other'];
const SURGEONS   = ['Dr. Sarah Chen', 'Dr. Raj Patel', 'Dr. Adaeze Eze', 'Dr. Tom Hardy'];

/* ---------------------------- helpers ----------------------------- */
function timeToMinutes(t) {
  // "08:30 AM" -> minutes since midnight
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(t.trim());
  if (!m) return 0;
  let h = parseInt(m[1], 10) % 12;
  if (/pm/i.test(m[3])) h += 12;
  return h * 60 + parseInt(m[2], 10);
}

function to12h(value) {
  // "14:45" -> "02:45 PM"
  if (!value) return '';
  const [hh, mm] = value.split(':').map(Number);
  const ap = hh >= 12 ? 'PM' : 'AM';
  const h12 = ((hh + 11) % 12) + 1;
  return `${String(h12).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${ap}`;
}

function initials(name = '') {
  const parts = name.replace(/\b(Dr|Prof|Mr|Mrs|Ms|N)\.?\b/gi, '').trim().split(/\s+/).filter(Boolean);
  let ini = parts.map(p => p[0]).join('').slice(0, 2).toUpperCase();
  if (ini.length < 2 && parts[0]) ini = parts[0].slice(0, 2).toUpperCase();
  return ini || '–';
}

/* --------------------------- sub-pieces --------------------------- */
function StatusBadge({ status }) {
  const map = {
    confirmed:  'pm-badge-success',
    pending:    'pm-badge-warning',
    scheduled:  'pm-badge-info',
    preop:      'pm-badge-neutral',
    inprogress: 'pm-badge-info',
    emergency:  'pm-badge-danger',
  };
  const labels = {
    confirmed: 'Confirmed', pending: 'Pending Prep', scheduled: 'Scheduled',
    preop: 'Pre-op', inprogress: 'In Progress', emergency: 'Emergency',
  };
  return <span className={`pm-badge ${map[status] || 'pm-badge-neutral'}`}>{labels[status] || status}</span>;
}

function TeamAvatars({ team = [] }) {
  const shown = team.slice(0, 3);
  const extra = team.length - shown.length;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }} title={team.join(', ')}>
      {shown.map((m, i) => (
        <div
          key={i}
          style={{
            width: 28, height: 28, borderRadius: '50%',
            background: i === 0 ? 'var(--pm-primary)' : 'var(--pm-surface-2)',
            color: i === 0 ? '#fff' : 'var(--pm-text-muted)',
            border: '2px solid var(--pm-surface, #fff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.64rem', fontWeight: 700,
            marginLeft: i === 0 ? 0 : -8, zIndex: 10 - i,
          }}
        >
          {initials(m)}
        </div>
      ))}
      {extra > 0 && (
        <div
          style={{
            width: 28, height: 28, borderRadius: '50%', background: 'var(--pm-surface-2)',
            color: 'var(--pm-text-muted)', border: '2px solid var(--pm-surface, #fff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.6rem', fontWeight: 700, marginLeft: -8,
          }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

/* operation counts seeded across the month (day-of-month -> {count, emergency}) */
const monthOps = {
  3: { count: 4 }, 6: { count: 5 }, 9: { count: 3, emergency: true }, 12: { count: 6 },
  15: { count: 4 }, 18: { count: 5, emergency: true }, 21: { count: 3 }, 23: { count: 6 },
  24: { count: 6, emergency: true }, 27: { count: 4 }, 29: { count: 2 },
};

function MiniCalendar({ selected, onSelect }) {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });

  const first = new Date(view.y, view.m, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const label = first.toLocaleString('default', { month: 'long', year: 'numeric' });
  const isCurrentMonth = view.y === today.getFullYear() && view.m === today.getMonth();

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const move = (delta) => {
    const nm = view.m + delta;
    setView({ y: view.y + Math.floor(nm / 12), m: ((nm % 12) + 12) % 12 });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => move(-1)} aria-label="Previous month">
          <ChevronLeft size={16} />
        </button>
        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{label}</div>
        <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => move(1)} aria-label="Next month">
          <ChevronRight size={16} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: '0.66rem', fontWeight: 700, color: 'var(--pm-text-muted)', padding: '4px 0' }}>
            {d}
          </div>
        ))}

        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const ops = isCurrentMonth ? monthOps[d] : null;
          const isToday = isCurrentMonth && d === today.getDate();
          const isSel = selected === d;
          return (
            <button
              key={i}
              onClick={() => onSelect(isSel ? null : d)}
              style={{
                position: 'relative', aspectRatio: '1 / 1', minHeight: 38,
                border: isToday ? '2px solid var(--pm-primary)' : '1px solid var(--pm-border)',
                background: isSel ? 'var(--pm-primary)' : (ops ? 'var(--pm-surface-2)' : 'transparent'),
                color: isSel ? '#fff' : 'var(--pm-text)',
                borderRadius: 10, cursor: 'pointer', fontSize: '0.8rem',
                fontWeight: isToday || ops ? 700 : 500,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                transition: 'background 0.12s',
              }}
            >
              <span>{d}</span>
              {ops && (
                <span
                  style={{
                    fontSize: '0.58rem', lineHeight: 1, padding: '1px 5px', borderRadius: 8, fontWeight: 700,
                    background: isSel ? 'rgba(255,255,255,0.25)' : (ops.emergency ? 'var(--pm-danger)' : 'var(--pm-primary)'),
                    color: '#fff',
                  }}
                >
                  {ops.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: '0.72rem', color: 'var(--pm-text-muted)', flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--pm-primary)' }} /> Scheduled ops
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--pm-danger)' }} /> Includes emergency
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, border: '2px solid var(--pm-primary)' }} /> Today
        </span>
      </div>

      {selected && monthOps[selected] && isCurrentMonth && (
        <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--pm-surface-2)', borderRadius: 10, fontSize: '0.8rem' }}>
          <strong>{monthOps[selected].count} operations</strong> scheduled on {label.split(' ')[0]} {selected}
          {monthOps[selected].emergency && (
            <span className="pm-badge pm-badge-danger" style={{ marginLeft: 8 }}>Emergency on roster</span>
          )}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- modals ----------------------------- */
const labelStyle = { display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--pm-text-muted)', marginBottom: 5 };
const fieldStyle = {
  width: '100%', padding: '9px 11px', borderRadius: 9, border: '1px solid var(--pm-border)',
  background: 'var(--pm-surface, #fff)', color: 'var(--pm-text)', fontSize: '0.85rem', outline: 'none',
};

function Field({ label, required, children, span = 6 }) {
  return (
    <div className={`col-12 col-sm-${span}`} style={{ marginBottom: 14 }}>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: 'var(--pm-danger)' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function ModalShell({ title, subtitle, accent, icon: Icon, onClose, children, footer }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 1000,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5vh 16px', overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pm-card"
        style={{ width: '100%', maxWidth: 720, padding: 0, overflow: 'hidden', margin: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px', borderBottom: '1px solid var(--pm-border)', background: accent ? `${accent}10` : 'transparent' }}>
          {Icon && (
            <div style={{ width: 38, height: 38, borderRadius: 10, background: accent || 'var(--pm-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: accent || 'var(--pm-text)' }}>{title}</div>
            {subtitle && <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{subtitle}</div>}
          </div>
          <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div style={{ padding: '20px 22px' }}>{children}</div>
        {footer && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 22px', borderTop: '1px solid var(--pm-border)', background: 'var(--pm-surface-2)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingModal({ open, emergency, onClose, onSubmit }) {
  const getBlankForm = () => ({
    patientId: '', patient: '', proc: PROCEDURES[0], date: new Date().toISOString().slice(0, 10),
    time: '', duration: '60', theatre: THEATRES[0], priority: emergency ? 'Emergency' : 'Routine',
    surgeon: SURGEONS[0], anesthetist: '', nurses: '', notes: '',
  });
  
  const [form, setForm] = useState(getBlankForm());

  React.useEffect(() => {
    if (open) setForm(getBlankForm());
  }, [open, emergency]); // emergency is now a proper dependency

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.patientId && form.patient && form.time && form.proc && form.theatre;
  const isEmergency = form.priority === 'Emergency';

  const submit = () => {
    if (!valid) return;
    const team = [form.surgeon, form.anesthetist, ...form.nurses.split(',').map((s) => s.trim())].filter(Boolean);
    const today = new Date().toISOString().slice(0, 10);
    onSubmit({
      time: to12h(form.time),
      patientId: form.patientId.toUpperCase(),
      patient: form.patient,
      proc: form.proc,
      theatre: form.theatre,
      team,
      status: isEmergency ? 'emergency' : 'confirmed',
      emergency: isEmergency,
      forToday: form.date === today,
    });
  };

  const accent = isEmergency ? 'var(--pm-danger)' : null;

  return (
    <ModalShell
      title={isEmergency ? 'Emergency Theatre Booking' : 'Book Theatre Session'}
      subtitle={isEmergency ? 'Prioritised — added to the top of today’s list' : 'Schedule an operating room session'}
      accent={accent}
      icon={isEmergency ? Siren : CalendarIcon}
      onClose={onClose}
      footer={
        <>
          <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={onClose}>Cancel</button>
          <button
            className={`pm-btn pm-btn-sm ${isEmergency ? 'pm-btn-danger' : 'pm-btn-primary'}`}
            disabled={!valid}
            style={{ opacity: valid ? 1 : 0.55 }}
            onClick={submit}
          >
            {isEmergency ? <Siren size={14} /> : <CheckCircle size={14} />} 
            {isEmergency ? 'Add Emergency Case' : 'Confirm Booking'}
          </button>
        </>
      }
    >
      {/* rest of your JSX remains the same */}
      {isEmergency && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--pm-danger)10', border: '1px solid var(--pm-danger)', color: 'var(--pm-danger)', padding: '10px 12px', borderRadius: 10, marginBottom: 16, fontSize: '0.8rem' }}>
          <Siren size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>This case will be flagged as an <strong>emergency</strong> and pushed to the front of today’s schedule. Notify the on-call team.</span>
        </div>
      )}

      <div className="row" style={{ marginInline: 0 }}>
        {/* all your Field components remain exactly the same */}
        <Field label="Patient ID" required span={6}>
          <input style={fieldStyle} placeholder="MAT-0000" value={form.patientId} onChange={set('patientId')} />
        </Field>
        {/* ... rest of your fields ... */}
      </div>
    </ModalShell>
  );
}

function HistoryModal({ open, onClose, rows }) {
  const [q, setQ] = useState('');
  if (!open) return null;
  const filtered = rows.filter((r) =>
    [r.patientId, r.proc, r.theatre, r.surgeon].join(' ').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <ModalShell title="Theatre Operation History" subtitle={`${rows.length} recorded operations`} icon={Activity} onClose={onClose}>
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <Search size={15} style={{ position: 'absolute', left: 11, top: 10, color: 'var(--pm-text-muted)' }} />
        <input
          style={{ ...fieldStyle, paddingLeft: 32 }}
          placeholder="Search by patient ID, procedure, surgeon or theatre…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div style={{ maxHeight: '52vh', overflowY: 'auto' }}>
        <table className="pm-table">
          <thead>
            <tr>
              <th>DATE</th><th>PATIENT ID</th><th>PROCEDURE</th><th>THEATRE</th><th>SURGEON</th><th>DURATION</th><th>OUTCOME</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i}>
                <td style={{ whiteSpace: 'nowrap' }}>{r.date}</td>
                <td style={{ fontWeight: 600 }}>{r.patientId}</td>
                <td>{r.proc}</td>
                <td style={{ color: 'var(--pm-text-muted)' }}>{r.theatre}</td>
                <td style={{ color: 'var(--pm-text-muted)' }}>{r.surgeon}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{r.duration}</td>
                <td>
                  <span className={`pm-badge ${r.outcome === 'Successful' ? 'pm-badge-success' : 'pm-badge-warning'}`}>{r.outcome}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--pm-text-muted)', padding: 24 }}>No matching operations.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </ModalShell>
  );
}

/* ----------------------------- page ------------------------------- */
export default function TheatreScheduling({ user, onNavigate }) {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingEmergency, setBookingEmergency] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const emergencyCount = schedule.filter((s) => s.emergency).length;
  const activeTheatres = useMemo(() => new Set(schedule.map((s) => s.theatre)).size, [schedule]);
  const teamOnDuty = useMemo(() => new Set(schedule.flatMap((s) => s.team)).size, [schedule]);

  const openBooking = (em = false) => { setBookingEmergency(em); setBookingOpen(true); };

  const handleAdd = (entry) => {
    const { forToday, ...row } = entry;
    setBookingOpen(false);
    if (!forToday) return; // future bookings go to the calendar, not today's list
    setSchedule((prev) => [...prev, row].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)));
  };

  return (
    <div>
      {/* page header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0 }}>Theatre Scheduling</h1>
          <div style={{ fontSize: '0.82rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>
            Operating room roster & bookings · Tuesday, Oct 24
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="pm-btn pm-btn-danger pm-btn-sm" style={{ background: 'var(--pm-danger)', borderColor: 'var(--pm-danger)', color: '#fff' }} onClick={() => openBooking(true)}>
            <Siren size={15} /> Add Emergency Case
          </button>
          <button className="pm-btn pm-btn-primary pm-btn-sm" onClick={() => openBooking(false)}>
            <Plus size={15} /> Book Theatre Session
          </button>
        </div>
      </div>

      {/* stat cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-sm-3">
          <div className="pm-stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <CalendarIcon size={20} style={{ opacity: 0.8 }} />
            </div>
            <div className="pm-card-title" style={{ color: 'rgba(255,255,255,0.7)' }}>Today’s Operations</div>
            <div className="pm-stat-value" style={{ color: '#fff', fontSize: '2.2rem' }}>{String(schedule.length).padStart(2, '0')}</div>
          </div>
        </div>
        <div className="col-6 col-sm-3">
          <div className="pm-stat-card secondary" style={{ border: '1px solid var(--pm-danger)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Siren size={20} style={{ color: 'var(--pm-danger)', opacity: 0.85 }} />
              {emergencyCount > 0 && (
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--pm-danger)', background: '#fee2e2', padding: '2px 8px', borderRadius: 20 }}>! Live</span>
              )}
            </div>
            <div className="pm-card-title">Emergency Cases</div>
            <div className="pm-stat-value" style={{ color: 'var(--pm-danger)' }}>{String(emergencyCount).padStart(2, '0')}</div>
          </div>
        </div>
        <div className="col-6 col-sm-3">
          <div className="pm-stat-card secondary">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <MapPin size={20} style={{ color: 'var(--pm-primary)', opacity: 0.8 }} />
            </div>
            <div className="pm-card-title">Theatres In Use</div>
            <div className="pm-stat-value">{activeTheatres}<span style={{ fontSize: '1rem', color: 'var(--pm-text-muted)' }}> / 5</span></div>
          </div>
        </div>
        <div className="col-6 col-sm-3">
          <div className="pm-stat-card secondary">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Stethoscope size={20} style={{ color: 'var(--pm-primary)', opacity: 0.8 }} />
            </div>
            <div className="pm-card-title">Team On Duty</div>
            <div className="pm-stat-value">{teamOnDuty}</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* LEFT: today's schedule + calendar */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-3">
          {/* today's schedule */}
          <div className="pm-card">
            <div className="pm-section-header">
              <div>
                <div className="pm-section-title">Today’s Schedule</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>Patient ID · time · assigned theatre team</div>
              </div>
              <button className="pm-btn pm-btn-primary pm-btn-sm" onClick={() => openBooking(false)}>
                <Plus size={13} /> New Booking
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="pm-table">
                <thead>
                  <tr>
                    <th>TIME</th><th>PATIENT ID</th><th>PATIENT</th><th>PROCEDURE</th><th>THEATRE</th><th>TEAM</th><th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row, i) => (
                    <tr key={i} style={row.emergency ? { background: 'color-mix(in srgb, var(--pm-danger) 6%, transparent)' } : undefined}>
                      <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {row.emergency && <Siren size={13} style={{ color: 'var(--pm-danger)', marginRight: 5, verticalAlign: '-2px' }} />}
                        {row.time}
                      </td>
                      <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{row.patientId}</td>
                      <td>{row.patient}</td>
                      <td style={{ color: 'var(--pm-text-muted)' }}>{row.proc}</td>
                      <td style={{ color: 'var(--pm-text-muted)', whiteSpace: 'nowrap' }}>{row.theatre}</td>
                      <td><TeamAvatars team={row.team} /></td>
                      <td><StatusBadge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* calendar */}
          <div className="pm-card">
            <div className="pm-section-header">
              <div className="pm-section-title">Monthly Theatre Calendar</div>
              <span style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>Numbers = operations booked</span>
            </div>
            <MiniCalendar selected={selectedDay} onSelect={setSelectedDay} />
          </div>
        </div>

        {/* RIGHT: notices + recent operations */}
        <div className="col-12 col-lg-4 d-flex flex-column gap-3">
          {/* OR notices */}
          <div className="pm-card">
            <div className="pm-section-header">
              <div className="pm-section-title">Operating Room Notices</div>
              <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => onNavigate && onNavigate('help')}>View All</button>
            </div>
            {orNotices.map((n, i) => (
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
          </div>

          {/* recent operations */}
          <div className="pm-card">
            <div className="pm-section-header">
              <div>
                <div className="pm-section-title">Recent Operations</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>Last 5 completed cases</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {recentOps.map((op, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < recentOps.length - 1 ? '1px solid var(--pm-border)' : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: op.outcome === 'Successful' ? '#16a34a18' : 'var(--pm-warning)18', color: op.outcome === 'Successful' ? '#16a34a' : 'var(--pm-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {op.outcome === 'Successful' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{op.proc}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--pm-text-muted)' }}>
                      {op.patientId} · {op.theatre} · {op.surgeon}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 600 }}>{op.date}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={11} /> {op.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="pm-btn pm-btn-outline w-100 mt-3 pm-btn-sm" onClick={() => setHistoryOpen(true)}>
              View Full History <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* modals */}
      <BookingModal open={bookingOpen} emergency={bookingEmergency} onClose={() => setBookingOpen(false)} onSubmit={handleAdd} />
      <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} rows={fullHistory} />
    </div>
  );
}