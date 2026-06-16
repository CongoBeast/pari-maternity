import React, { useState, useMemo, useRef } from 'react';
import {
  Baby, Search, X, Plus, ChevronLeft, ArrowRight, Clock, Send,
  BadgeCheck, FileCheck, Copy, Check, Printer, Edit2,
  FileText, AlertTriangle, Info, ChevronRight
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRATION WORKFLOW CONFIG
// pending → submitted (to Registrar General) → registered (code issued) → collected
// ─────────────────────────────────────────────────────────────────────────────

const STATUS = {
  pending:    { key: 'pending',    label: 'Pending Confirmation', short: 'Pending',    color: '#d97706', light: '#fef3c7', icon: Clock,        desc: 'Details captured at the hospital — awaiting confirmation before submission.' },
  submitted:  { key: 'submitted',  label: 'Submitted to Registrar', short: 'Submitted', color: '#2563eb', light: '#dbeafe', icon: Send,        desc: 'Sent to the Registrar General. Awaiting acknowledgement and booking code.' },
  registered: { key: 'registered', label: 'Registered — Code Issued', short: 'Registered', color: '#16a34a', light: '#dcfce7', icon: BadgeCheck, desc: 'Acknowledged by the Registrar General. Booking code issued to the family.' },
  collected:  { key: 'collected',  label: 'Certificate Collected', short: 'Collected', color: '#0d9488', light: '#f0fdfa', icon: FileCheck,    desc: 'Birth certificate collected by the family using the booking code.' },
};

const STATUS_ORDER = ['pending', 'submitted', 'registered', 'collected'];

const SEX = {
  male:   { label: 'Male',   color: '#2563eb', light: '#dbeafe' },
  female: { label: 'Female', color: '#db2777', light: '#fce7f3' },
};

const DELIVERY_TYPES = [
  'Normal Vaginal Delivery (NVD)',
  'Lower Segment Caesarean (LSCS)',
  'Assisted — Vacuum',
  'Assisted — Forceps',
  'VBAC',
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA — Parirenyatwa Group of Hospitals · Maternity Unit
// ─────────────────────────────────────────────────────────────────────────────

const SEED_RECORDS = [
  {
    id: 'BR-2024-0153', status: 'pending',
    baby: { given: '', surname: 'Choto', sex: 'male', dob: '14 Oct 2024', time: '08:25', weight: '3.1 kg', gestation: '38 weeks', delivery: 'Normal Vaginal Delivery (NVD)', place: 'Delivery Room 1, First Floor', apgar: '9/10' },
    mother: { name: 'Rumbidzai Choto', nationalId: '63-782214-K-09', age: 27, phone: '+263 77 410 2231', address: '14 Seke Road, Chitungwiza' },
    father: { name: 'Anesu Choto', nationalId: '63-551209-T-22' },
    attendant: 'Sr. Agnes Musabayana', recordedBy: 'Records Clerk · STF-016', recordedOn: '14 Oct 2024 09:02',
    bookingCode: null, submittedOn: null, registeredOn: null, collectedOn: null,
  },
  {
    id: 'BR-2024-0152', status: 'pending',
    baby: { given: '', surname: 'Mukwena', sex: 'male', dob: '14 Oct 2024', time: '06:10', weight: '3.6 kg', gestation: '39 weeks', delivery: 'Lower Segment Caesarean (LSCS)', place: 'Operation Room 1, First Floor', apgar: '8/10' },
    mother: { name: 'Grace Mukwena', nationalId: '63-339087-F-41', age: 31, phone: '+263 71 220 4419', address: 'House 8, Avondale West, Harare' },
    father: { name: 'Tafadzwa Mukwena', nationalId: '63-118923-G-15' },
    attendant: 'Dr. Chipo Chigudu', recordedBy: 'Records Clerk · STF-017', recordedOn: '14 Oct 2024 06:48',
    bookingCode: null, submittedOn: null, registeredOn: null, collectedOn: null,
  },
  {
    id: 'BR-2024-0151', status: 'pending',
    baby: { given: '', surname: 'Nyoni', sex: 'female', dob: '14 Oct 2024', time: '03:42', weight: '2.9 kg', gestation: '37 weeks', delivery: 'Normal Vaginal Delivery (NVD)', place: 'Delivery Room 4, First Floor', apgar: '7/10' },
    mother: { name: 'Priscilla Nyoni', nationalId: '63-902145-H-30', age: 24, phone: '+263 78 551 9920', address: '22 Glen Norah B, Harare' },
    father: { name: '', nationalId: '' },
    attendant: 'Sr. Memory Murewa', recordedBy: 'Records Clerk · STF-016', recordedOn: '14 Oct 2024 04:15',
    bookingCode: null, submittedOn: null, registeredOn: null, collectedOn: null,
  },
  {
    id: 'BR-2024-0150', status: 'submitted',
    baby: { given: 'Tinotenda', surname: 'Zimuto', sex: 'male', dob: '13 Oct 2024', time: '14:08', weight: '3.4 kg', gestation: '40 weeks', delivery: 'Normal Vaginal Delivery (NVD)', place: 'Delivery Room 2, First Floor', apgar: '9/10' },
    mother: { name: 'Farai Zimuto', nationalId: '63-447120-J-18', age: 29, phone: '+263 77 332 1180', address: '5 Greendale Avenue, Harare' },
    father: { name: 'Brian Zimuto', nationalId: '63-220981-A-04' },
    attendant: 'Sr. Agnes Musabayana', recordedBy: 'Records Clerk · STF-017', recordedOn: '13 Oct 2024 15:01',
    bookingCode: null, submittedOn: '13 Oct 2024 16:20', registeredOn: null, collectedOn: null,
  },
  {
    id: 'BR-2024-0149', status: 'submitted',
    baby: { given: 'Ruvarashe', surname: 'Hove', sex: 'female', dob: '13 Oct 2024', time: '09:55', weight: '3.2 kg', gestation: '39 weeks', delivery: 'Assisted — Vacuum', place: 'Delivery Room 5, First Floor', apgar: '8/10' },
    mother: { name: 'Rudo Hove', nationalId: '63-651230-B-27', age: 33, phone: '+263 71 990 4412', address: '11 Borrowdale Road, Harare' },
    father: { name: 'Simba Hove', nationalId: '63-330122-C-19' },
    attendant: 'Dr. Tendai Mutombwa', recordedBy: 'Records Clerk · STF-016', recordedOn: '13 Oct 2024 10:30',
    bookingCode: null, submittedOn: '13 Oct 2024 11:45', registeredOn: null, collectedOn: null,
  },
  {
    id: 'BR-2024-0147', status: 'submitted',
    baby: { given: '', surname: 'Mupfuro', sex: 'female', dob: '12 Oct 2024', time: '22:31', weight: '2.7 kg', gestation: '36 weeks', delivery: 'Normal Vaginal Delivery (NVD)', place: 'Delivery Room 6, First Floor', apgar: '8/10' },
    mother: { name: 'Loveness Mupfuro', nationalId: '63-771044-D-52', age: 22, phone: '+263 78 220 7781', address: 'House 47, Kuwadzana 3, Harare' },
    father: { name: 'Kudakwashe Mupfuro', nationalId: '63-500219-E-31' },
    attendant: 'Sr. Memory Murewa', recordedBy: 'Records Clerk · STF-017', recordedOn: '12 Oct 2024 23:10',
    bookingCode: null, submittedOn: '13 Oct 2024 08:05', registeredOn: null, collectedOn: null,
  },
  {
    id: 'BR-2024-0146', status: 'registered',
    baby: { given: 'Tadiwanashe', surname: 'Gomo', sex: 'female', dob: '11 Oct 2024', time: '07:14', weight: '3.5 kg', gestation: '40 weeks', delivery: 'Normal Vaginal Delivery (NVD)', place: 'Delivery Room 1, First Floor', apgar: '9/10' },
    mother: { name: 'Leticia Gomo', nationalId: '63-410338-F-44', age: 28, phone: '+263 77 118 2240', address: '9 Msasa Park, Harare' },
    father: { name: 'Munashe Gomo', nationalId: '63-228190-G-12' },
    attendant: 'Sr. Agnes Musabayana', recordedBy: 'Records Clerk · STF-016', recordedOn: '11 Oct 2024 08:00',
    bookingCode: 'RGZ/BC/2024/004461', submittedOn: '11 Oct 2024 09:30', registeredOn: '11 Oct 2024 15:42', collectedOn: null,
  },
  {
    id: 'BR-2024-0145', status: 'registered',
    baby: { given: 'Kupakwashe', surname: 'Dziva', sex: 'male', dob: '11 Oct 2024', time: '02:48', weight: '3.8 kg', gestation: '41 weeks', delivery: 'Lower Segment Caesarean (LSCS)', place: 'Operation Room 2, First Floor', apgar: '9/10' },
    mother: { name: 'Sandra Dziva', nationalId: '63-559021-H-08', age: 35, phone: '+263 71 442 9981', address: '3 Mount Pleasant Drive, Harare' },
    father: { name: 'Tinashe Dziva', nationalId: '63-310984-J-25' },
    attendant: 'Dr. Chipo Chigudu', recordedBy: 'Records Clerk · STF-017', recordedOn: '11 Oct 2024 03:30',
    bookingCode: 'RGZ/BC/2024/004458', submittedOn: '11 Oct 2024 06:10', registeredOn: '11 Oct 2024 13:05', collectedOn: null,
  },
  {
    id: 'BR-2024-0144', status: 'registered',
    baby: { given: 'Anodiwa', surname: 'Sithole', sex: 'female', dob: '10 Oct 2024', time: '18:20', weight: '3.0 kg', gestation: '38 weeks', delivery: 'Normal Vaginal Delivery (NVD)', place: 'Delivery Room 3, First Floor', apgar: '8/10' },
    mother: { name: 'Beatrice Sithole', nationalId: '63-620117-K-39', age: 26, phone: '+263 78 331 5520', address: '18 Highfield Road, Harare' },
    father: { name: 'Walter Sithole', nationalId: '63-409221-L-17' },
    attendant: 'Sr. Memory Murewa', recordedBy: 'Records Clerk · STF-016', recordedOn: '10 Oct 2024 19:00',
    bookingCode: 'RGZ/BC/2024/004455', submittedOn: '10 Oct 2024 20:15', registeredOn: '11 Oct 2024 10:40', collectedOn: null,
  },
  {
    id: 'BR-2024-0143', status: 'registered',
    baby: { given: 'Nyasha', surname: 'Muyambo', sex: 'female', dob: '10 Oct 2024', time: '11:02', weight: '3.3 kg', gestation: '39 weeks', delivery: 'Normal Vaginal Delivery (NVD)', place: 'Delivery Room 2, First Floor', apgar: '9/10' },
    mother: { name: 'Esther Muyambo', nationalId: '63-338902-M-21', age: 30, phone: '+263 77 552 1140', address: '7 Eastlea, Harare' },
    father: { name: 'Farai Muyambo', nationalId: '63-220119-N-06' },
    attendant: 'Sr. Agnes Musabayana', recordedBy: 'Records Clerk · STF-017', recordedOn: '10 Oct 2024 11:45',
    bookingCode: 'RGZ/BC/2024/004452', submittedOn: '10 Oct 2024 13:00', registeredOn: '10 Oct 2024 16:55', collectedOn: null,
  },
  {
    id: 'BR-2024-0142', status: 'registered',
    baby: { given: 'Tendai', surname: 'Mhuri', sex: 'male', dob: '10 Oct 2024', time: '04:37', weight: '3.7 kg', gestation: '40 weeks', delivery: 'Normal Vaginal Delivery (NVD)', place: 'Delivery Room 6, First Floor', apgar: '9/10' },
    mother: { name: 'Kudzai Mhuri', nationalId: '63-771203-P-13', age: 25, phone: '+263 71 220 8890', address: 'House 22, Budiriro 2, Harare' },
    father: { name: 'Tatenda Mhuri', nationalId: '63-500981-Q-34' },
    attendant: 'Dr. Tendai Mutombwa', recordedBy: 'Records Clerk · STF-016', recordedOn: '10 Oct 2024 05:20',
    bookingCode: 'RGZ/BC/2024/004449', submittedOn: '10 Oct 2024 07:00', registeredOn: '10 Oct 2024 14:10', collectedOn: null,
  },
  {
    id: 'BR-2024-0140', status: 'registered',
    baby: { given: 'Rutendo', surname: 'Banda', sex: 'female', dob: '09 Oct 2024', time: '13:50', weight: '2.6 kg', gestation: '35 weeks', delivery: 'Assisted — Forceps', place: 'Delivery Room 3, First Floor', apgar: '7/10' },
    mother: { name: 'Sasha Banda', nationalId: '63-449021-R-28', age: 23, phone: '+263 78 119 4420', address: '4 Waterfalls, Harare' },
    father: { name: 'Lloyd Banda', nationalId: '63-330118-S-11' },
    attendant: 'Sr. Memory Murewa', recordedBy: 'Records Clerk · STF-017', recordedOn: '09 Oct 2024 14:30',
    bookingCode: 'RGZ/BC/2024/004440', submittedOn: '09 Oct 2024 16:00', registeredOn: '10 Oct 2024 09:20', collectedOn: null,
  },
  {
    id: 'BR-2024-0138', status: 'collected',
    baby: { given: 'Farai', surname: 'Moyo', sex: 'male', dob: '08 Oct 2024', time: '08:11', weight: '3.4 kg', gestation: '39 weeks', delivery: 'Normal Vaginal Delivery (NVD)', place: 'Delivery Room 1, First Floor', apgar: '9/10' },
    mother: { name: 'Memory Moyo', nationalId: '63-551200-T-49', age: 32, phone: '+263 77 442 1190', address: '12 Hatfield, Harare' },
    father: { name: 'Edmore Moyo', nationalId: '63-228091-U-23' },
    attendant: 'Sr. Agnes Musabayana', recordedBy: 'Records Clerk · STF-016', recordedOn: '08 Oct 2024 09:00',
    bookingCode: 'RGZ/BC/2024/004431', submittedOn: '08 Oct 2024 10:30', registeredOn: '08 Oct 2024 15:00', collectedOn: '11 Oct 2024 10:15',
  },
  {
    id: 'BR-2024-0135', status: 'collected',
    baby: { given: 'Chiedza', surname: 'Ncube', sex: 'female', dob: '07 Oct 2024', time: '20:44', weight: '2.4 kg', gestation: '37 weeks', delivery: 'Normal Vaginal Delivery (NVD)', place: 'Delivery Room 5, First Floor', apgar: '8/10' },
    mother: { name: 'Vimbai Ncube', nationalId: '63-620934-V-15', age: 29, phone: '+263 71 552 9980', address: '6 Marlborough, Harare' },
    father: { name: 'Brighton Ncube', nationalId: '63-409120-W-37' },
    attendant: 'Dr. Chipo Chigudu', recordedBy: 'Records Clerk · STF-017', recordedOn: '07 Oct 2024 21:20',
    bookingCode: 'RGZ/BC/2024/004419', submittedOn: '08 Oct 2024 08:00', registeredOn: '08 Oct 2024 12:30', collectedOn: '10 Oct 2024 14:40',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function babyName(b) {
  if (b.given && b.given.trim()) return `Baby ${b.given} ${b.surname}`;
  return `Baby ${b.sex === 'female' ? 'Girl' : 'Boy'} ${b.surname}`;
}

function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) { /* fall through */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  } catch (e) { return false; }
}

function nowStamp() {
  const d = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.pending;
  const Icon = s.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: '0.68rem', fontWeight: 700, color: s.color,
      background: s.light, border: `1px solid ${s.color}40`,
      borderRadius: 20, padding: '3px 9px', whiteSpace: 'nowrap',
    }}>
      <Icon size={11} strokeWidth={2.5} /> {s.short}
    </span>
  );
}

function SexTag({ sex }) {
  const s = SEX[sex] || SEX.male;
  return (
    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: s.color, background: s.light, border: `1px solid ${s.color}40`, borderRadius: 20, padding: '2px 9px' }}>
      {s.label}
    </span>
  );
}

function BabyIcon({ sex, size = 38 }) {
  const s = SEX[sex] || SEX.male;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: s.color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: `2px solid ${s.light}`,
    }}>
      <Baby size={size > 36 ? 19 : 16} strokeWidth={2.2} />
    </div>
  );
}

function InfoGrid({ rows }) {
  return (
    <div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--pm-border)' : 'none', alignItems: 'flex-start' }}>
          <span style={{ width: 150, flexShrink: 0, fontSize: '0.77rem', color: 'var(--pm-text-muted)', fontWeight: 500, paddingTop: 1 }}>{r.label}</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.4 }}>{r.value || '—'}</span>
        </div>
      ))}
    </div>
  );
}

function CopyButton({ value, variant = 'inline' }) {
  const [copied, setCopied] = useState(false);
  const onCopy = (e) => {
    e.stopPropagation();
    if (copyText(value)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };
  if (variant === 'inline') {
    return (
      <button onClick={onCopy} title="Copy booking code" style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer',
        border: '1px solid var(--pm-border)', borderRadius: 6, padding: '2px 7px',
        background: copied ? '#dcfce7' : 'var(--pm-surface-2)', color: copied ? '#16a34a' : 'var(--pm-text)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.72rem', fontWeight: 700,
      }}>
        {value}
        {copied ? <Check size={12} /> : <Copy size={12} style={{ opacity: 0.6 }} />}
      </button>
    );
  }
  // large variant
  return (
    <button onClick={onCopy} className="pm-btn pm-btn-sm" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: copied ? '#dcfce7' : '#fff', color: copied ? '#16a34a' : '#16a34a',
      border: `1px solid ${copied ? '#16a34a' : '#bbf7d0'}`, fontSize: '0.78rem', fontWeight: 700,
    }}>
      {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy code</>}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CLICKABLE STAT CARD
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ label, sub, value, color, icon: Icon, active, onClick }) {
  return (
    <div onClick={onClick} className="pm-card" style={{
      padding: '12px 14px', cursor: 'pointer', flex: 1, minWidth: 140,
      borderLeft: `3px solid ${color}`,
      border: active ? `1.5px solid ${color}` : undefined,
      borderLeftWidth: 3, transition: 'all 0.15s ease',
      boxShadow: active ? `0 0 0 3px ${color}1f` : undefined,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Icon size={18} style={{ color }} strokeWidth={2.4} />
        {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />}
      </div>
      <div style={{ fontSize: '1.7rem', fontWeight: 900, color, lineHeight: 1, marginTop: 8 }}>{value}</div>
      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--pm-text)', marginTop: 2 }}>{label}</div>
      <div style={{ fontSize: '0.66rem', color: 'var(--pm-text-muted)', marginTop: 1 }}>{sub}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKFLOW STEPPER
// ─────────────────────────────────────────────────────────────────────────────

function WorkflowStepper({ record }) {
  const currentIdx = STATUS_ORDER.indexOf(record.status);
  const stamps = {
    pending: record.recordedOn,
    submitted: record.submittedOn,
    registered: record.registeredOn,
    collected: record.collectedOn,
  };
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      {STATUS_ORDER.map((key, i) => {
        const cfg = STATUS[key];
        const Icon = cfg.icon;
        const done = i <= currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <React.Fragment key={key}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', width: 96 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: done ? cfg.color : 'var(--pm-surface-2)',
                border: `2px solid ${done ? cfg.color : 'var(--pm-border)'}`,
                color: done ? '#fff' : 'var(--pm-text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isCurrent ? `0 0 0 4px ${cfg.color}22` : 'none',
              }}>
                <Icon size={17} strokeWidth={2.4} />
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: done ? cfg.color : 'var(--pm-text-muted)', textAlign: 'center', marginTop: 6, lineHeight: 1.2 }}>{cfg.short}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--pm-text-muted)', textAlign: 'center', marginTop: 2, minHeight: 14 }}>{done && stamps[key] ? stamps[key] : ''}</div>
            </div>
            {i < STATUS_ORDER.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < currentIdx ? STATUS[key].color : 'var(--pm-border)', marginTop: 18, minWidth: 16 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD RECORD MODAL
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  given: '', surname: '', sex: 'male', dob: '', time: '', weight: '', gestation: '',
  delivery: DELIVERY_TYPES[0], place: '', apgar: '',
  motherName: '', motherId: '', motherAge: '', motherPhone: '', motherAddress: '',
  fatherName: '', fatherId: '', attendant: '',
};

function Field({ label, required, children, full }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--pm-text-muted)', marginBottom: 4 }}>
        {label}{required && <span style={{ color: 'var(--pm-danger)' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '7px 10px', border: '1px solid var(--pm-border)', borderRadius: 7,
  background: 'var(--pm-surface-2)', fontSize: '0.83rem', color: 'var(--pm-text)', outline: 'none', boxSizing: 'border-box',
};

function AddRecordModal({ onClose, onSave }) {
  const [f, setF] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));

  const submit = () => {
    if (!f.surname.trim() || !f.dob.trim() || !f.motherName.trim() || !f.motherId.trim()) {
      setError('Please complete the required fields: baby surname, date of birth, mother\u2019s name and national ID.');
      return;
    }
    onSave(f);
  };

  const In = (k, props = {}) => (
    <input style={inputStyle} value={f[k]} onChange={e => set(k, e.target.value)} {...props} />
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 20, overflowY: 'auto' }}>
      <div className="pm-card" style={{ maxWidth: 720, width: '100%', padding: 0, marginTop: 24, marginBottom: 24, maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--pm-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Baby size={20} style={{ color: '#db2777' }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>New Birth Record</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--pm-text-muted)' }}>Capture the birth, then confirm to submit to the Registrar General</div>
            </div>
          </div>
          <button onClick={onClose} className="pm-btn pm-btn-ghost pm-btn-sm" style={{ padding: 6 }}><X size={18} /></button>
        </div>

        {/* Modal body */}
        <div style={{ padding: '18px 20px', overflowY: 'auto' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: '9px 12px', marginBottom: 16 }}>
              <AlertTriangle size={15} style={{ color: '#dc2626', marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 600 }}>{error}</span>
            </div>
          )}

          {/* Baby section */}
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Baby Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
            <Field label="Given name (if named)">{In('given', { placeholder: 'e.g. Tadiwa' })}</Field>
            <Field label="Surname" required>{In('surname', { placeholder: 'e.g. Moyo' })}</Field>
            <Field label="Sex" required>
              <select style={inputStyle} value={f.sex} onChange={e => set('sex', e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </Field>
            <Field label="APGAR score">{In('apgar', { placeholder: 'e.g. 9/10' })}</Field>
            <Field label="Date of birth" required>{In('dob', { placeholder: 'e.g. 14 Oct 2024' })}</Field>
            <Field label="Time of birth">{In('time', { placeholder: 'e.g. 08:25' })}</Field>
            <Field label="Birth weight">{In('weight', { placeholder: 'e.g. 3.4 kg' })}</Field>
            <Field label="Gestation">{In('gestation', { placeholder: 'e.g. 39 weeks' })}</Field>
            <Field label="Delivery type">
              <select style={inputStyle} value={f.delivery} onChange={e => set('delivery', e.target.value)}>
                {DELIVERY_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Place of birth">{In('place', { placeholder: 'e.g. Delivery Room 3, First Floor' })}</Field>
          </div>

          {/* Mother section */}
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Mother</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
            <Field label="Full name" required>{In('motherName', { placeholder: 'e.g. Grace Moyo' })}</Field>
            <Field label="National ID" required>{In('motherId', { placeholder: 'e.g. 63-123456-A-78' })}</Field>
            <Field label="Age">{In('motherAge', { placeholder: 'e.g. 29' })}</Field>
            <Field label="Phone">{In('motherPhone', { placeholder: '+263 ...' })}</Field>
            <Field label="Home address" full>{In('motherAddress', { placeholder: 'e.g. 9 Msasa Park, Harare' })}</Field>
          </div>

          {/* Father + attendant */}
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Father & Attendant</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <Field label="Father full name">{In('fatherName', { placeholder: 'Optional' })}</Field>
            <Field label="Father national ID">{In('fatherId', { placeholder: 'Optional' })}</Field>
            <Field label="Attending midwife / doctor" full>{In('attendant', { placeholder: 'e.g. Sr. Agnes Musabayana' })}</Field>
          </div>
        </div>

        {/* Modal footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '14px 20px', borderTop: '1px solid var(--pm-border)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>Saved as <strong>Pending Confirmation</strong> until submitted.</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={onClose}>Cancel</button>
            <button className="pm-btn pm-btn-primary pm-btn-sm" onClick={submit} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={14} /> Save Birth Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECORD DETAIL
// ─────────────────────────────────────────────────────────────────────────────

function RecordDetail({ record, onBack, onSubmit, onAcknowledge, onCollect }) {
  const s = STATUS[record.status];
  const sex = SEX[record.baby.sex] || SEX.male;

  return (
    <div>
      <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={onBack} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <ChevronLeft size={16} /> Back to Birth Records
      </button>

      {/* Header card */}
      <div className="pm-card" style={{ marginBottom: 16, padding: '18px 20px', borderLeft: `4px solid ${sex.color}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap' }}>
          <BabyIcon sex={record.baby.sex} size={58} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{babyName(record.baby)}</span>
              <SexTag sex={record.baby.sex} />
              <StatusBadge status={record.status} />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--pm-text-muted)', marginBottom: 6 }}>
              Born {record.baby.dob}{record.baby.time ? ` at ${record.baby.time}` : ''} · {record.baby.place}
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>
              <span>🪪 {record.id}</span>
              <span>⚖️ {record.baby.weight}</span>
              <span>🤱 {record.mother.name}</span>
            </div>
          </div>
          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
            {record.status === 'pending' && (
              <button className="pm-btn pm-btn-primary pm-btn-sm" onClick={() => onSubmit(record.id)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Send size={13} /> Confirm &amp; Submit to Registrar
              </button>
            )}
            {record.status === 'submitted' && (
              <button className="pm-btn pm-btn-sm" onClick={() => onAcknowledge(record.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                <BadgeCheck size={13} /> Record Registrar Acknowledgement
              </button>
            )}
            {record.status === 'registered' && (
              <button className="pm-btn pm-btn-sm" onClick={() => onCollect(record.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' }}>
                <FileCheck size={13} /> Mark Certificate Collected
              </button>
            )}
            <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Printer size={13} /> Print
            </button>
            {record.status === 'pending' && (
              <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Edit2 size={13} /> Edit
              </button>
            )}
          </div>
        </div>

        {/* Status note */}
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--pm-border)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <Info size={14} style={{ color: s.color, marginTop: 1, flexShrink: 0 }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--pm-text-muted)' }}>{s.desc}</span>
        </div>
      </div>

      {/* Booking code banner — registered / collected */}
      {(record.status === 'registered' || record.status === 'collected') && record.bookingCode && (
        <div className="pm-card" style={{ marginBottom: 16, padding: '16px 20px', background: 'linear-gradient(90deg, #f0fdf4, var(--pm-card-bg, #fff))', borderLeft: '4px solid #16a34a' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BadgeCheck size={22} style={{ color: '#16a34a' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Birth Certificate Booking Code</div>
                <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontWeight: 800, fontSize: '1.3rem', color: '#15803d', marginTop: 2 }}>{record.bookingCode}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>
                  Issued by the Registrar General {record.registeredOn ? `on ${record.registeredOn}` : ''}. The family presents this code to collect the certificate.
                </div>
              </div>
            </div>
            <CopyButton value={record.bookingCode} variant="large" />
          </div>
        </div>
      )}

      {/* Awaiting banner — submitted */}
      {record.status === 'submitted' && (
        <div className="pm-card" style={{ marginBottom: 16, padding: '14px 18px', borderLeft: '4px solid #2563eb', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Send size={18} style={{ color: '#2563eb' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Awaiting Registrar General</div>
            <div style={{ fontSize: '0.76rem', color: 'var(--pm-text-muted)' }}>Submitted {record.submittedOn}. A booking code is issued once the Registrar acknowledges this record.</div>
          </div>
        </div>
      )}

      {/* Workflow stepper */}
      <div className="pm-card" style={{ marginBottom: 16, padding: '18px 20px', overflowX: 'auto' }}>
        <div className="pm-section-title" style={{ marginBottom: 16 }}>Registration Progress</div>
        <WorkflowStepper record={record} />
      </div>

      {/* Detail grids */}
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="pm-card">
            <div className="pm-section-title" style={{ marginBottom: 12 }}>Baby Details</div>
            <InfoGrid rows={[
              { label: 'Name', value: babyName(record.baby) },
              { label: 'Sex', value: <SexTag sex={record.baby.sex} /> },
              { label: 'Date & Time', value: `${record.baby.dob}${record.baby.time ? ` · ${record.baby.time}` : ''}` },
              { label: 'Birth Weight', value: record.baby.weight },
              { label: 'Gestation', value: record.baby.gestation },
              { label: 'APGAR Score', value: record.baby.apgar },
            ]} />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="pm-card">
            <div className="pm-section-title" style={{ marginBottom: 12 }}>Delivery & Attendant</div>
            <InfoGrid rows={[
              { label: 'Delivery Type', value: record.baby.delivery },
              { label: 'Place of Birth', value: record.baby.place },
              { label: 'Attended By', value: record.attendant },
              { label: 'Recorded By', value: record.recordedBy },
              { label: 'Recorded On', value: record.recordedOn },
            ]} />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="pm-card">
            <div className="pm-section-title" style={{ marginBottom: 12 }}>Mother</div>
            <InfoGrid rows={[
              { label: 'Full Name', value: record.mother.name },
              { label: 'National ID', value: record.mother.nationalId },
              { label: 'Age', value: record.mother.age ? `${record.mother.age} years` : '—' },
              { label: 'Phone', value: record.mother.phone },
              { label: 'Home Address', value: record.mother.address },
            ]} />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="pm-card">
            <div className="pm-section-title" style={{ marginBottom: 12 }}>Father</div>
            <InfoGrid rows={[
              { label: 'Full Name', value: record.father.name || 'Not recorded' },
              { label: 'National ID', value: record.father.nationalId || 'Not recorded' },
            ]} />
            <div className="pm-section-title" style={{ marginBottom: 12, marginTop: 18 }}>Registrar General</div>
            <InfoGrid rows={[
              { label: 'Submitted On', value: record.submittedOn },
              { label: 'Registered On', value: record.registeredOn },
              { label: 'Booking Code', value: record.bookingCode ? <CopyButton value={record.bookingCode} /> : 'Not yet issued' },
              { label: 'Collected On', value: record.collectedOn },
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function BirthRecordsDashboard({ user = null } = {}) {
  const [records, setRecords] = useState(SEED_RECORDS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sexFilter, setSexFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const codeSeq = useRef(4470); // next Registrar General booking sequence

  const counts = useMemo(() => ({
    all: records.length,
    pending: records.filter(r => r.status === 'pending').length,
    submitted: records.filter(r => r.status === 'submitted').length,
    registered: records.filter(r => r.status === 'registered').length,
    collected: records.filter(r => r.status === 'collected').length,
  }), [records]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return records.filter(r => {
      const hay = `${babyName(r.baby)} ${r.id} ${r.mother.name} ${r.bookingCode || ''}`.toLowerCase();
      return hay.includes(q)
        && (statusFilter === 'all' || r.status === statusFilter)
        && (sexFilter === 'all' || r.baby.sex === sexFilter)
        && (deliveryFilter === 'all' || r.baby.delivery === deliveryFilter);
    });
  }, [records, search, statusFilter, sexFilter, deliveryFilter]);

  const selected = records.find(r => r.id === selectedId) || null;
  const filtersActive = search || statusFilter !== 'all' || sexFilter !== 'all' || deliveryFilter !== 'all';

  function handleSubmit(id) {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'submitted', submittedOn: nowStamp() } : r));
  }
  function handleAcknowledge(id) {
    const code = `RGZ/BC/2024/${String(codeSeq.current++).padStart(6, '0')}`;
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'registered', registeredOn: nowStamp(), bookingCode: code } : r));
  }
  function handleCollect(id) {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'collected', collectedOn: nowStamp() } : r));
  }
  function handleSave(form) {
    const nextNum = Math.max(...records.map(r => parseInt(r.id.split('-')[2], 10))) + 1;
    const newRec = {
      id: `BR-2024-${String(nextNum).padStart(4, '0')}`, status: 'pending',
      baby: {
        given: form.given.trim(), surname: form.surname.trim(), sex: form.sex,
        dob: form.dob.trim(), time: form.time.trim(), weight: form.weight.trim() || '—',
        gestation: form.gestation.trim() || '—', delivery: form.delivery,
        place: form.place.trim() || '—', apgar: form.apgar.trim() || '—',
      },
      mother: {
        name: form.motherName.trim(), nationalId: form.motherId.trim(),
        age: form.motherAge.trim(), phone: form.motherPhone.trim() || '—', address: form.motherAddress.trim() || '—',
      },
      father: { name: form.fatherName.trim(), nationalId: form.fatherId.trim() },
      attendant: form.attendant.trim() || '—', recordedBy: `Records Clerk · ${user?.id || 'STF-016'}`, recordedOn: nowStamp(),
      bookingCode: null, submittedOn: null, registeredOn: null, collectedOn: null,
    };
    setRecords(prev => [newRec, ...prev]);
    setShowAdd(false);
    setSelectedId(newRec.id);
  }

  if (selected) {
    return (
      <RecordDetail
        record={selected}
        onBack={() => setSelectedId(null)}
        onSubmit={handleSubmit}
        onAcknowledge={handleAcknowledge}
        onCollect={handleCollect}
      />
    );
  }

  const STAT_CARDS = [
    { key: 'all',        label: 'Total Records', sub: 'all births on file',     value: counts.all,        color: '#6366f1', icon: FileText },
    { key: 'pending',    label: 'Pending',       sub: 'awaiting confirmation',  value: counts.pending,    color: '#d97706', icon: Clock },
    { key: 'submitted',  label: 'Submitted',     sub: 'awaiting Registrar',     value: counts.submitted,  color: '#2563eb', icon: Send },
    { key: 'registered', label: 'Registered',    sub: 'booking code issued',    value: counts.registered, color: '#16a34a', icon: BadgeCheck },
    { key: 'collected',  label: 'Collected',     sub: 'certificate collected',  value: counts.collected,  color: '#0d9488', icon: FileCheck },
  ];

  return (
    <div>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Birth Records</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>
            {records.length} births on record · Parirenyatwa Group of Hospitals — Maternity Unit · Registrar General submissions
          </div>
        </div>
        <button className="pm-btn pm-btn-primary pm-btn-sm" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={14} /> Add Birth Record
        </button>
      </div>

      {/* STAT CARDS — click to filter by status */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {STAT_CARDS.map(c => (
          <StatCard
            key={c.key}
            label={c.label} sub={c.sub} value={c.value} color={c.color} icon={c.icon}
            active={statusFilter === c.key}
            onClick={() => setStatusFilter(prev => prev === c.key ? 'all' : c.key)}
          />
        ))}
      </div>

      {/* WORKFLOW EXPLAINER */}
      <div className="pm-card" style={{ padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>How it works</span>
        {STATUS_ORDER.map((key, i) => {
          const cfg = STATUS[key]; const Icon = cfg.icon;
          return (
            <React.Fragment key={key}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.76rem', fontWeight: 600, color: cfg.color }}>
                <Icon size={14} strokeWidth={2.4} /> {cfg.label}
              </span>
              {i < STATUS_ORDER.length - 1 && <ChevronRight size={14} style={{ color: 'var(--pm-text-muted)' }} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* LIST CARD */}
      <div className="pm-card">
        {/* Search + filters */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)' }} />
            <input
              type="text" placeholder="Search by baby name, record ID, mother, or booking code…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--pm-border)', borderRadius: 8, background: 'var(--pm-surface-2)', fontSize: '0.85rem', outline: 'none', color: 'var(--pm-text)', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Sex filter */}
            <div style={{ display: 'flex', gap: 4 }}>
              {[{ k: 'all', l: 'All' }, { k: 'male', l: 'Male' }, { k: 'female', l: 'Female' }].map(o => (
                <button key={o.k} onClick={() => setSexFilter(o.k)}
                  className={`pm-btn pm-btn-sm ${sexFilter === o.k ? 'pm-btn-primary' : 'pm-btn-ghost'}`}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                  {o.l}
                </button>
              ))}
            </div>
            {/* Delivery filter */}
            <select value={deliveryFilter} onChange={e => setDeliveryFilter(e.target.value)} style={{
              padding: '5px 10px', border: '1px solid var(--pm-border)', borderRadius: 6,
              background: 'var(--pm-surface-2)', fontSize: '0.78rem', color: 'var(--pm-text)', cursor: 'pointer',
            }}>
              <option value="all">All delivery types</option>
              {DELIVERY_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {filtersActive && (
              <button className="pm-btn pm-btn-ghost pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}
                onClick={() => { setSearch(''); setStatusFilter('all'); setSexFilter('all'); setDeliveryFilter('all'); }}>
                <X size={12} /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginBottom: 8 }}>
          Showing {filtered.length} of {records.length} birth records
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="pm-table">
            <thead>
              <tr>
                <th>BABY</th><th>RECORD ID</th><th>SEX</th><th>DATE OF BIRTH</th>
                <th>MOTHER</th><th>STATUS / BOOKING CODE</th><th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--pm-text-muted)' }}>
                    <Search size={28} style={{ opacity: 0.2, display: 'block', margin: '0 auto 8px' }} />
                    No birth records match your search
                  </td>
                </tr>
              ) : filtered.map(r => (
                <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedId(r.id)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <BabyIcon sex={r.baby.sex} size={34} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{babyName(r.baby)}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>{r.baby.weight} · {r.baby.delivery.split('(')[0].trim()}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--pm-text-muted)', whiteSpace: 'nowrap' }}>{r.id}</td>
                  <td><SexTag sex={r.baby.sex} /></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--pm-text-muted)', whiteSpace: 'nowrap' }}>{r.baby.dob}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--pm-text-muted)', maxWidth: 150 }}>{r.mother.name}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-start' }}>
                      <StatusBadge status={r.status} />
                      {r.bookingCode && <CopyButton value={r.bookingCode} />}
                    </div>
                  </td>
                  <td>
                    <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={e => { e.stopPropagation(); setSelectedId(r.id); }} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}>
                      View <ArrowRight size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MODAL */}
      {showAdd && <AddRecordModal onClose={() => setShowAdd(false)} onSave={handleSave} />}
    </div>
  );
}