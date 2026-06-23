import React, { useState, useRef, useEffect } from 'react';
import {
  Pill, Search, Plus, X, AlertTriangle, CheckCircle, Clock,
  RefreshCw, User, Calendar, FileText, ChevronDown, Siren,
  Package, ArrowRight, Filter, Hash
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PATIENT_DIRECTORY = [
  { id: 'P-1042', name: 'Tendai Moyo',        age: 29, ward: 'Antenatal Ward A', weeks: 36, condition: 'Gestational Hypertension' },
  { id: 'P-1055', name: 'Chipo Zvobgo',       age: 34, ward: 'Delivery Suite',   weeks: 40, condition: 'Term Labour' },
  { id: 'P-1067', name: 'Rudo Mafuka',        age: 27, ward: 'Postnatal Ward B', weeks: 38, condition: 'Post C-Section' },
  { id: 'P-1089', name: 'Tariro Gumbo',       age: 31, ward: 'Antenatal Ward B', weeks: 22, condition: 'Cervical Incompetence' },
  { id: 'P-1103', name: 'Rutendo Sibanda',    age: 33, ward: 'Antenatal Ward A', weeks: 28, condition: 'GDM' },
  { id: 'P-1118', name: 'Nyasha Mhondoro',    age: 30, ward: 'Postnatal Ward A', weeks: 39, condition: 'Normal Delivery' },
  { id: 'P-1134', name: 'Kudzai Murefu',      age: 36, ward: 'High Risk Unit',   weeks: 32, condition: 'Preeclampsia' },
];

const MEDICINE_CATALOGUE = [
  { name: 'Ferrous Sulphate 200mg',     category: 'Supplement',    unit: 'Tablets', shortage: false },
  { name: 'Folic Acid 5mg',             category: 'Supplement',    unit: 'Tablets', shortage: false },
  { name: 'Labetalol 100mg',            category: 'Antihypertensive', unit: 'Tablets', shortage: true },
  { name: 'Nifedipine 10mg',            category: 'Antihypertensive', unit: 'Capsules', shortage: false },
  { name: 'Methyldopa 250mg',           category: 'Antihypertensive', unit: 'Tablets', shortage: false },
  { name: 'Metformin 500mg',            category: 'Antidiabetic',  unit: 'Tablets', shortage: false },
  { name: 'Insulin Aspart (NovoRapid)', category: 'Antidiabetic',  unit: 'Units',   shortage: true },
  { name: 'Magnesium Sulphate 50%',     category: 'Anticonvulsant',unit: 'mL (IV)', shortage: false },
  { name: 'Oxytocin 10 IU',            category: 'Uterotonic',    unit: 'Amp',     shortage: false },
  { name: 'Misoprostol 200mcg',         category: 'Uterotonic',    unit: 'Tablets', shortage: false },
  { name: 'Amoxicillin 500mg',          category: 'Antibiotic',    unit: 'Capsules', shortage: false },
  { name: 'Clindamycin 300mg',          category: 'Antibiotic',    unit: 'Capsules', shortage: true },
  { name: 'Ondansetron 4mg',            category: 'Antiemetic',    unit: 'Tablets', shortage: false },
  { name: 'Progesterone 200mg',         category: 'Hormone',       unit: 'Capsules', shortage: false },
  { name: 'Dexamethasone 6mg',          category: 'Corticosteroid',unit: 'Amp (IM)',  shortage: false },
  { name: 'Heparin 5000 IU',            category: 'Anticoagulant', unit: 'Amp',     shortage: false },
  { name: 'Paracetamol 500mg',          category: 'Analgesic',     unit: 'Tablets', shortage: false },
  { name: 'Tramadol 50mg',              category: 'Analgesic',     unit: 'Capsules', shortage: false },
];

const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'As needed (PRN)', 'Stat dose', 'Weekly'];
const DURATIONS   = ['3 days', '5 days', '7 days', '10 days', '14 days', '1 month', '3 months', 'Until delivery', 'Until review'];
const ROUTES      = ['Oral', 'IV', 'IM', 'SC', 'Topical', 'Vaginal', 'Rectal'];

const today = new Date();
const fmtDate = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

const INITIAL_PRESCRIPTIONS = [
  {
    id: 'RX-8801', patientId: 'P-1042', patientName: 'Elena Gilbert',   ward: 'Antenatal Ward A',
    medicine: 'Ferrous Sulphate 200mg', dose: '200mg', freq: 'Once daily', route: 'Oral',
    duration: '1 month', issued: true, issuedDate: fmtDate(addDays(today, -10)),
    expiryDate: fmtDate(addDays(today, 20)), expired: false,
    notes: 'Take after meals to reduce GI upset.', prescribedDate: fmtDate(addDays(today, -10)),
  },
  {
    id: 'RX-8802', patientId: 'P-1042', patientName: 'Elena Gilbert',   ward: 'Antenatal Ward A',
    medicine: 'Labetalol 100mg', dose: '100mg', freq: 'Twice daily', route: 'Oral',
    duration: '14 days', issued: true, issuedDate: fmtDate(addDays(today, -5)),
    expiryDate: fmtDate(addDays(today, 9)), expired: false,
    notes: 'Monitor BP 4-hourly. Hold if HR < 60.', prescribedDate: fmtDate(addDays(today, -5)),
  },
  {
    id: 'RX-8803', patientId: 'P-1055', patientName: 'Serena Williams', ward: 'Delivery Suite',
    medicine: 'Oxytocin 10 IU', dose: '10 IU', freq: 'Stat dose', route: 'IV',
    duration: 'Until delivery', issued: false, issuedDate: null,
    expiryDate: fmtDate(addDays(today, 1)), expired: false,
    notes: 'Induction protocol — follow oxytocin infusion chart.', prescribedDate: fmtDate(today),
  },
  {
    id: 'RX-8804', patientId: 'P-1067', patientName: 'Nora West-Allen', ward: 'Postnatal Ward B',
    medicine: 'Paracetamol 500mg', dose: '1g (2 tabs)', freq: 'Every 6 hours', route: 'Oral',
    duration: '5 days', issued: true, issuedDate: fmtDate(addDays(today, -6)),
    expiryDate: fmtDate(addDays(today, -1)), expired: true,
    notes: 'Post-op analgesia. Max 4g/day.', prescribedDate: fmtDate(addDays(today, -6)),
  },
  {
    id: 'RX-8805', patientId: 'P-1089', patientName: 'Wanda Maximoff',  ward: 'Antenatal Ward B',
    medicine: 'Progesterone 200mg', dose: '200mg', freq: 'Once daily', route: 'Vaginal',
    duration: '3 months', issued: true, issuedDate: fmtDate(addDays(today, -14)),
    expiryDate: fmtDate(addDays(today, 76)), expired: false,
    notes: 'Insert at night. Continue until 32 weeks.', prescribedDate: fmtDate(addDays(today, -14)),
  },
  {
    id: 'RX-8806', patientId: 'P-1103', patientName: 'Diana Prince',    ward: 'Antenatal Ward A',
    medicine: 'Metformin 500mg', dose: '500mg', freq: 'Twice daily', route: 'Oral',
    duration: 'Until delivery', issued: true, issuedDate: fmtDate(addDays(today, -21)),
    expiryDate: fmtDate(addDays(today, 70)), expired: false,
    notes: 'GDM management. Review HbA1c in 6 weeks.', prescribedDate: fmtDate(addDays(today, -21)),
  },
  {
    id: 'RX-8807', patientId: 'P-1134', patientName: 'Carol Danvers',   ward: 'High Risk Unit',
    medicine: 'Magnesium Sulphate 50%', dose: '4g loading', freq: 'Stat dose', route: 'IV',
    duration: '24 hours', issued: true, issuedDate: fmtDate(addDays(today, -2)),
    expiryDate: fmtDate(addDays(today, -1)), expired: true,
    notes: 'Eclampsia prophylaxis. Monitor reflexes & urine output.', prescribedDate: fmtDate(addDays(today, -2)),
  },
];

const DISPENSARY_NOTICES = [
  { id: 1, medicine: 'Labetalol 100mg',            severity: 'critical', message: 'Stock critically low — 48 units remaining. Reorder submitted.', icon: Siren },
  { id: 2, medicine: 'Insulin Aspart (NovoRapid)', severity: 'critical', message: 'Out of stock until Thursday. Use Insulin Lispro as alternative.', icon: Siren },
  { id: 3, medicine: 'Clindamycin 300mg',           severity: 'warning', message: 'Stock running low — 12 units. Restocking in 2–3 days.', icon: AlertTriangle },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ issued, expired }) {
  if (expired)  return <span className="pm-badge pm-badge-neutral" style={{ background: '#f1f5f9', color: '#64748b' }}>Expired</span>;
  if (issued)   return <span className="pm-badge pm-badge-success">Issued</span>;
  return              <span className="pm-badge pm-badge-warning">Pending</span>;
}

function ShortageTag({ medicine }) {
  const med = MEDICINE_CATALOGUE.find(m => m.name === medicine);
  if (!med?.shortage) return null;
  return (
    <span style={{
      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
      background: '#fef2f2', color: 'var(--pm-danger)',
      border: '1px solid #fecaca', borderRadius: 4, padding: '1px 6px',
    }}>⚠ SHORTAGE</span>
  );
}

// ─── New Prescription Modal ───────────────────────────────────────────────────

function NewPrescriptionModal({ onClose, onSave }) {
  const [patientQuery, setPatientQuery]   = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medQuery, setMedQuery]           = useState('');
  const [medResults, setMedResults]       = useState([]);
  const [selectedMed, setSelectedMed]     = useState(null);
  const [form, setForm] = useState({
    dose: '', freq: '', route: 'Oral', duration: '', notes: ''
  });
  const patientRef = useRef(null);
  const medRef     = useRef(null);

  // Patient search
  useEffect(() => {
    if (!patientQuery.trim()) { setPatientResults([]); return; }
    const q = patientQuery.toLowerCase();
    setPatientResults(
      PATIENT_DIRECTORY.filter(p =>
        p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
      ).slice(0, 5)
    );
  }, [patientQuery]);

  // Medicine search
  useEffect(() => {
    if (!medQuery.trim()) { setMedResults([]); return; }
    const q = medQuery.toLowerCase();
    setMedResults(
      MEDICINE_CATALOGUE.filter(m => m.name.toLowerCase().includes(q)).slice(0, 6)
    );
  }, [medQuery]);

  const selectPatient = (p) => {
    setSelectedPatient(p);
    setPatientQuery(p.name);
    setPatientResults([]);
  };

  const selectMed = (m) => {
    setSelectedMed(m);
    setMedQuery(m.name);
    setMedResults([]);
  };

  const handleSubmit = () => {
    if (!selectedPatient || !selectedMed || !form.dose || !form.freq || !form.duration) return;
    const newRx = {
      id: `RX-${8808 + Math.floor(Math.random() * 100)}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      ward: selectedPatient.ward,
      medicine: selectedMed.name,
      dose: form.dose,
      freq: form.freq,
      route: form.route,
      duration: form.duration,
      issued: false,
      issuedDate: null,
      expiryDate: fmtDate(addDays(today, 30)),
      expired: false,
      notes: form.notes,
      prescribedDate: fmtDate(today),
    };
    onSave(newRx);
    onClose();
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '1px solid var(--pm-border)',
    borderRadius: 8, fontSize: '0.875rem',
    background: 'var(--pm-surface-2)',
    color: 'var(--pm-text)',
    outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '0.72rem', fontWeight: 700,
    letterSpacing: '0.06em', color: 'var(--pm-text-muted)',
    marginBottom: 5, display: 'block',
  };

  const dropdownStyle = {
    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
    background: 'var(--pm-surface)',
    border: '1px solid var(--pm-border)',
    borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    marginTop: 4, overflow: 'hidden',
  };

  const dropItemStyle = (hover) => ({
    padding: '10px 14px', cursor: 'pointer',
    fontSize: '0.85rem',
    background: hover ? 'var(--pm-surface-2)' : 'transparent',
    transition: 'background 0.15s',
  });

  const [hoverP, setHoverP] = useState(null);
  const [hoverM, setHoverM] = useState(null);

  const canSubmit = selectedPatient && selectedMed && form.dose && form.freq && form.duration;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--pm-surface)', borderRadius: 16,
        width: '100%', maxWidth: 620, maxHeight: '90vh',
        overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        border: '1px solid var(--pm-border)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--pm-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--pm-primary)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Pill size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>New Prescription</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)' }}>Maternity Hospital — {fmtDate(today)}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--pm-text-muted)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 24 }}>

          {/* Patient Search */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>PATIENT SEARCH</label>
            <div style={{ position: 'relative' }} ref={patientRef}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)' }} />
                <input
                  value={patientQuery}
                  onChange={e => { setPatientQuery(e.target.value); setSelectedPatient(null); }}
                  placeholder="Search by name or Patient ID…"
                  style={{ ...inputStyle, paddingLeft: 34 }}
                />
              </div>
              {patientResults.length > 0 && (
                <div style={dropdownStyle}>
                  {patientResults.map((p, i) => (
                    <div
                      key={p.id}
                      style={dropItemStyle(hoverP === i)}
                      onMouseEnter={() => setHoverP(i)}
                      onMouseLeave={() => setHoverP(null)}
                      onClick={() => selectPatient(p)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontWeight: 600 }}>{p.name}</span>
                          <span style={{ color: 'var(--pm-text-muted)', marginLeft: 8, fontSize: '0.8rem' }}>{p.id}</span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>{p.ward}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>
                        {p.weeks}w gestation · {p.condition}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Autofilled patient card */}
            {selectedPatient && (
              <div style={{
                marginTop: 10, padding: '10px 14px',
                background: 'var(--pm-surface-2)',
                border: '1px solid var(--pm-border)',
                borderRadius: 8, display: 'flex', gap: 14,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'var(--pm-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <User size={16} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{selectedPatient.name}</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.78rem', color: 'var(--pm-text-muted)', marginTop: 2, flexWrap: 'wrap' }}>
                    <span><Hash size={11} style={{ verticalAlign: 'middle' }} /> {selectedPatient.id}</span>
                    <span>Age {selectedPatient.age}</span>
                    <span>{selectedPatient.weeks}w gestation</span>
                    <span>{selectedPatient.ward}</span>
                  </div>
                  <div style={{
                    display: 'inline-block', marginTop: 5, fontSize: '0.72rem', fontWeight: 600,
                    background: '#eff6ff', color: 'var(--pm-info)', borderRadius: 4, padding: '2px 7px',
                  }}>{selectedPatient.condition}</div>
                </div>
              </div>
            )}
          </div>

          {/* Medicine Search */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>MEDICINE</label>
            <div style={{ position: 'relative' }} ref={medRef}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)' }} />
                <input
                  value={medQuery}
                  onChange={e => { setMedQuery(e.target.value); setSelectedMed(null); }}
                  placeholder="Search medicine catalogue…"
                  style={{ ...inputStyle, paddingLeft: 34 }}
                />
              </div>
              {medResults.length > 0 && (
                <div style={dropdownStyle}>
                  {medResults.map((m, i) => (
                    <div
                      key={m.name}
                      style={dropItemStyle(hoverM === i)}
                      onMouseEnter={() => setHoverM(i)}
                      onMouseLeave={() => setHoverM(null)}
                      onClick={() => selectMed(m)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>{m.name}</span>
                        {m.shortage && (
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--pm-danger)', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, padding: '1px 6px' }}>
                            ⚠ SHORTAGE
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 1 }}>
                        {m.category} · Per {m.unit}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedMed?.shortage && (
              <div style={{
                marginTop: 8, padding: '8px 12px',
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
                display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#b91c1c',
              }}>
                <AlertTriangle size={14} />
                This medicine is currently flagged as low stock by the dispensary.
              </div>
            )}
          </div>

          {/* Dosage Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>DOSE</label>
              <input
                value={form.dose}
                onChange={e => setForm(f => ({ ...f, dose: e.target.value }))}
                placeholder={selectedMed ? `e.g. ${selectedMed.name.match(/\d+\w+/)?.[0] || '500mg'}` : 'e.g. 500mg'}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>ROUTE</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={form.route}
                  onChange={e => setForm(f => ({ ...f, route: e.target.value }))}
                  style={{ ...inputStyle, appearance: 'none', paddingRight: 30, cursor: 'pointer' }}
                >
                  {ROUTES.map(r => <option key={r}>{r}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* Frequency & Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>FREQUENCY</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={form.freq}
                  onChange={e => setForm(f => ({ ...f, freq: e.target.value }))}
                  style={{ ...inputStyle, appearance: 'none', paddingRight: 30, cursor: 'pointer' }}
                >
                  <option value="">Select frequency…</option>
                  {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)', pointerEvents: 'none' }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>DURATION</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={form.duration}
                  onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                  style={{ ...inputStyle, appearance: 'none', paddingRight: 30, cursor: 'pointer' }}
                >
                  <option value="">Select duration…</option>
                  {DURATIONS.map(d => <option key={d}>{d}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>CLINICAL NOTES (OPTIONAL)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Dosage instructions, warnings, monitoring requirements…"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="pm-btn pm-btn-outline" onClick={onClose} style={{ minWidth: 90 }}>Cancel</button>
            <button
              className="pm-btn pm-btn-primary"
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{ minWidth: 160, opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
            >
              <Pill size={14} /> Issue Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Prescription Detail Modal ────────────────────────────────────────────────

function PrescriptionDetailModal({ rx, onClose, onRenew }) {
  if (!rx) return null;

  const statusColor = rx.expired ? '#64748b' : rx.issued ? 'var(--pm-success, #16a34a)' : 'var(--pm-warning)';
  const statusLabel = rx.expired ? 'Expired' : rx.issued ? 'Issued to Patient' : 'Pending Dispensing';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--pm-surface)', borderRadius: 16,
        width: '100%', maxWidth: 520,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        border: '1px solid var(--pm-border)',
        overflow: 'hidden',
      }}>
        {/* Colour strip top */}
        <div style={{ height: 4, background: statusColor }} />

        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--pm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>{rx.id}</span>
              <StatusBadge issued={rx.issued} expired={rx.expired} />
              <ShortageTag medicine={rx.medicine} />
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--pm-text-muted)', marginTop: 3 }}>Prescribed {rx.prescribedDate}</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--pm-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Patient */}
          <div style={{ marginBottom: 18, padding: '12px 14px', background: 'var(--pm-surface-2)', borderRadius: 10, border: '1px solid var(--pm-border)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--pm-text-muted)', marginBottom: 6 }}>PATIENT</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{rx.patientName}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{rx.patientId} · {rx.ward}</div>
              </div>
            </div>
          </div>

          {/* Medicine */}
          <div style={{ marginBottom: 18, padding: '12px 14px', background: 'var(--pm-surface-2)', borderRadius: 10, border: '1px solid var(--pm-border)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--pm-text-muted)', marginBottom: 8 }}>PRESCRIPTION DETAILS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Medicine', value: rx.medicine },
                { label: 'Dose',     value: rx.dose },
                { label: 'Route',    value: rx.route },
                { label: 'Frequency',value: rx.freq },
                { label: 'Duration', value: rx.duration },
              ].map(item => (
                <div key={item.label} style={{ gridColumn: item.label === 'Medicine' ? 'span 2' : 'auto' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dispensing Status */}
          <div style={{ marginBottom: 18, padding: '12px 14px', background: 'var(--pm-surface-2)', borderRadius: 10, border: '1px solid var(--pm-border)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--pm-text-muted)', marginBottom: 8 }}>DISPENSING STATUS</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)', marginBottom: 4 }}>Medicine Issued</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.875rem', color: rx.issued ? '#16a34a' : 'var(--pm-warning)' }}>
                  {rx.issued
                    ? <><CheckCircle size={15} /> Yes — {rx.issuedDate}</>
                    : <><Clock size={15} /> Awaiting Dispensary</>
                  }
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)', marginBottom: 4 }}>Expiry Date</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: rx.expired ? 'var(--pm-danger)' : 'inherit' }}>
                  {rx.expiryDate} {rx.expired && '⚠ Expired'}
                </div>
              </div>
            </div>
          </div>

          {rx.notes && (
            <div style={{ marginBottom: 18, padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', color: '#92400e', marginBottom: 4 }}>CLINICAL NOTES</div>
              <div style={{ fontSize: '0.83rem', color: '#78350f', lineHeight: 1.5 }}>{rx.notes}</div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="pm-btn pm-btn-outline" onClick={onClose}>Close</button>
            {rx.expired && (
              <button
                className="pm-btn pm-btn-primary"
                onClick={() => { onRenew(rx); onClose(); }}
              >
                <RefreshCw size={14} /> Renew Prescription
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions]   = useState(INITIAL_PRESCRIPTIONS);
  const [searchQuery, setSearchQuery]       = useState('');
  const [statusFilter, setStatusFilter]     = useState('all');
  const [showNewModal, setShowNewModal]     = useState(false);
  const [selectedRx, setSelectedRx]         = useState(null);

  // Stats
  const total    = prescriptions.length;
  const issued   = prescriptions.filter(r => r.issued && !r.expired).length;
  const pending  = prescriptions.filter(r => !r.issued && !r.expired).length;
  const expired  = prescriptions.filter(r => r.expired).length;

  // Filter
  const filtered = prescriptions.filter(rx => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q
      || rx.patientId.toLowerCase().includes(q)
      || rx.patientName.toLowerCase().includes(q)
      || rx.id.toLowerCase().includes(q)
      || rx.medicine.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === 'all'    ? true :
      statusFilter === 'issued' ? (rx.issued && !rx.expired) :
      statusFilter === 'pending'? (!rx.issued && !rx.expired) :
      statusFilter === 'expired'? rx.expired : true;
    return matchSearch && matchStatus;
  });

  const handleSave = (rx) => {
    setPrescriptions(prev => [rx, ...prev]);
  };

  const handleRenew = (rx) => {
    const renewed = {
      ...rx,
      id: `RX-${8900 + Math.floor(Math.random() * 99)}`,
      issued: false,
      issuedDate: null,
      expired: false,
      prescribedDate: fmtDate(today),
      expiryDate: fmtDate(addDays(today, 30)),
    };
    setPrescriptions(prev => [renewed, ...prev]);
  };

  const filterBtnStyle = (active) => ({
    padding: '6px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
    cursor: 'pointer', border: '1px solid var(--pm-border)',
    background: active ? 'var(--pm-primary)' : 'var(--pm-surface-2)',
    color: active ? '#fff' : 'var(--pm-text-muted)',
    transition: 'all 0.15s',
  });

  return (
    <div>
      {/* ── Stat Cards ── */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-3">
          <div className="pm-stat-card" style={{ cursor: 'default' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Pill size={20} style={{ opacity: 0.8 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, opacity: 0.85, background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 20 }}>Total</span>
            </div>
            <div className="pm-card-title" style={{ color: 'rgba(255,255,255,0.7)' }}>All Prescriptions</div>
            <div className="pm-stat-value" style={{ color: '#fff', fontSize: '2.4rem' }}>{total}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: 4 }}>This cycle</div>
          </div>
        </div>
        <div className="col-12 col-sm-3">
          <div className="pm-stat-card secondary">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <CheckCircle size={20} style={{ color: '#16a34a', opacity: 0.9 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: 20 }}>Issued</span>
            </div>
            <div className="pm-card-title">Issued</div>
            <div className="pm-stat-value">{issued}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 4 }}>Dispensed to patient</div>
          </div>
        </div>
        <div className="col-12 col-sm-3">
          <div className="pm-stat-card secondary" style={{ border: '1px solid var(--pm-warning)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Clock size={20} style={{ color: 'var(--pm-warning)', opacity: 0.9 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--pm-warning)', background: '#fef3c7', padding: '2px 8px', borderRadius: 20 }}>Pending</span>
            </div>
            <div className="pm-card-title">Pending Dispensing</div>
            <div className="pm-stat-value">{pending}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 4 }}>Awaiting dispensary</div>
          </div>
        </div>
        <div className="col-12 col-sm-3">
          <div className="pm-stat-card secondary" style={{ border: '1px solid var(--pm-danger)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <AlertTriangle size={20} style={{ color: 'var(--pm-danger)', opacity: 0.9 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--pm-danger)', background: '#fee2e2', padding: '2px 8px', borderRadius: 20 }}>Expired</span>
            </div>
            <div className="pm-card-title">Expired / Needs Renewal</div>
            <div className="pm-stat-value">{expired}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 4 }}>Click to renew</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* ── Left: Prescriptions Table ── */}
        <div className="col-12 col-lg-8">
          <div className="pm-card">
            {/* Header */}
            <div className="pm-section-header" style={{ flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div className="pm-section-title">Prescription Records</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''} found</div>
              </div>
              <button className="pm-btn pm-btn-primary pm-btn-sm" onClick={() => setShowNewModal(true)}>
                <Plus size={13} /> New Prescription
              </button>
            </div>

            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)' }} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search patient ID, name, medicine…"
                  style={{
                    width: '100%', padding: '8px 12px 8px 32px',
                    border: '1px solid var(--pm-border)', borderRadius: 8,
                    fontSize: '0.85rem', background: 'var(--pm-surface-2)',
                    color: 'var(--pm-text)', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { key: 'all',     label: 'All' },
                  { key: 'issued',  label: 'Issued' },
                  { key: 'pending', label: 'Pending' },
                  { key: 'expired', label: 'Expired' },
                ].map(f => (
                  <button key={f.key} style={filterBtnStyle(statusFilter === f.key)} onClick={() => setStatusFilter(f.key)}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="pm-table">
                <thead>
                  <tr>
                    <th>RX ID</th>
                    <th>PATIENT</th>
                    <th>MEDICINE</th>
                    <th>FREQ</th>
                    <th>PRESCRIBED</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--pm-text-muted)' }}>
                        No prescriptions match your search.
                      </td>
                    </tr>
                  ) : filtered.map((rx, i) => (
                    <tr
                      key={rx.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedRx(rx)}
                    >
                      <td style={{ fontWeight: 700, color: 'var(--pm-primary)', whiteSpace: 'nowrap' }}>{rx.id}</td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{rx.patientName}</div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--pm-text-muted)' }}>{rx.patientId}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.875rem' }}>{rx.medicine}</div>
                        <div style={{ marginTop: 2 }}><ShortageTag medicine={rx.medicine} /></div>
                      </td>
                      <td style={{ color: 'var(--pm-text-muted)', fontSize: '0.83rem', whiteSpace: 'nowrap' }}>{rx.freq}</td>
                      <td style={{ color: 'var(--pm-text-muted)', fontSize: '0.83rem', whiteSpace: 'nowrap' }}>{rx.prescribedDate}</td>
                      <td><StatusBadge issued={rx.issued} expired={rx.expired} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Right: Dispensary Notices ── */}
        <div className="col-12 col-lg-4">
          <div className="pm-card" style={{ height: '100%' }}>
            <div className="pm-section-header">
              <div>
                <div className="pm-section-title">Dispensary Notices</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>Medicine shortage alerts</div>
              </div>
              <span style={{
                fontSize: '0.68rem', fontWeight: 700, background: '#fef2f2',
                color: 'var(--pm-danger)', borderRadius: 20, padding: '2px 8px',
                border: '1px solid #fecaca',
              }}>
                {DISPENSARY_NOTICES.filter(n => n.severity === 'critical').length} Critical
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DISPENSARY_NOTICES.map((notice) => {
                const isCritical = notice.severity === 'critical';
                const bg     = isCritical ? '#fef2f2' : '#fffbeb';
                const border = isCritical ? '#fecaca' : '#fde68a';
                const color  = isCritical ? 'var(--pm-danger)' : '#92400e';
                const iconBg = isCritical ? '#fee2e2' : '#fef3c7';
                return (
                  <div key={notice.id} style={{
                    padding: '12px 14px', borderRadius: 10,
                    background: bg, border: `1px solid ${border}`,
                  }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        background: iconBg, color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <notice.icon size={15} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.83rem', color }}>{notice.medicine}</div>
                        <div style={{ fontSize: '0.78rem', color, opacity: 0.85, marginTop: 2, lineHeight: 1.4 }}>{notice.message}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Shortage medicine quick reference */}
            <div style={{ marginTop: 20 }}>
              <div style={{
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em',
                color: 'var(--pm-text-muted)', marginBottom: 10,
              }}>
                SHORTAGE MEDICINES — QUICK REF
              </div>
              {MEDICINE_CATALOGUE.filter(m => m.shortage).map(m => (
                <div key={m.name} className="pm-notice-item">
                  <div className="pm-notice-icon" style={{ background: '#fee2e2', color: 'var(--pm-danger)' }}>
                    <Package size={14} />
                  </div>
                  <div>
                    <div className="pm-notice-title">{m.name}</div>
                    <div className="pm-notice-sub">{m.category} · Per {m.unit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showNewModal && (
        <NewPrescriptionModal
          onClose={() => setShowNewModal(false)}
          onSave={handleSave}
        />
      )}
      {selectedRx && (
        <PrescriptionDetailModal
          rx={selectedRx}
          onClose={() => setSelectedRx(null)}
          onRenew={handleRenew}
        />
      )}
    </div>
  );
}