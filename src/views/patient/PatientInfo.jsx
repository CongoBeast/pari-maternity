import React, { useState } from 'react';
import {
  User, Phone, Mail, MapPin, Heart, Droplet, Calendar,
  AlertTriangle, Pencil, Check, X, ShieldAlert, Baby,
  Sprout, Egg, HeartPulse, PartyPopper,
} from 'lucide-react';

// ---- Birthing journey stages -------------------------------------------------
const JOURNEY = [
  { key: 'conception', label: 'Conception', weeks: '0', icon: Sprout },
  { key: 't1', label: '1st Trimester', weeks: '1–12', icon: Egg },
  { key: 't2', label: '2nd Trimester', weeks: '13–27', icon: HeartPulse },
  { key: 't3', label: '3rd Trimester', weeks: '28–40', icon: Baby },
  { key: 'due', label: 'Due Date', weeks: '40', icon: PartyPopper },
];

// Small presentational helpers ------------------------------------------------
function Field({ label, value, name, editing, onChange, type = 'text', icon: Icon }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 5 }}>
        {Icon && <Icon size={13} />} {label}
      </div>
      {editing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          style={{
            width: '100%', padding: '8px 11px', borderRadius: 8,
            border: '1px solid var(--pm-border)', background: 'var(--pm-surface-2)',
            color: 'var(--pm-text)', fontSize: '0.88rem', outline: 'none',
          }}
        />
      ) : (
        <div style={{ fontSize: '0.92rem', color: 'var(--pm-text)', fontWeight: 500 }}>
          {value || <span style={{ color: 'var(--pm-text-muted)' }}>—</span>}
        </div>
      )}
    </div>
  );
}

export default function PatientInfo({ user, onUpdate }) {
  const [editing, setEditing] = useState(false);

  // Seed from the logged-in user where possible, fall back to demo data.
const [form, setForm] = useState({
    fullName: user?.name || 'Tendai Moyo',
    patientId: 'PT-2024-08817',
    dob: '1994-03-18',
    bloodType: 'O+',
    phone: '+263 77 123 4567',
    email: user?.email || 'tendai.moyo@example.com',
    address: '123 Samora Machel Avenue, Harare, Zimbabwe',
    emergencyName: 'Tafadzwa Moyo (Spouse)',
    emergencyPhone: '+263 71 234 5678',
    allergies: 'Penicillin, Shellfish',
    conditions: 'Mild gestational anemia',
    obHistory: 'G2 P1 — one prior full-term delivery (2021)',
    bloodPressure: '118 / 76 mmHg',
    week: 24,
  });

  // A working copy so "Cancel" can discard edits cleanly.
  const [draft, setDraft] = useState(form);

  const startEdit = () => { setDraft(form); setEditing(true); };
  const cancelEdit = () => { setDraft(form); setEditing(false); };
  const saveEdit = () => {
    setForm(draft);
    setEditing(false);
    if (onUpdate) onUpdate(draft);
  };

  const onChange = (e) => setDraft({ ...draft, [e.target.name]: e.target.value });
  const data = editing ? draft : form;

  const week = Number(data.week) || 0;
  const progress = Math.min((week / 40) * 100, 100);
  const currentStageIndex =
    week === 0 ? 0 : week <= 12 ? 1 : week <= 27 ? 2 : week < 40 ? 3 : 4;

  const initials = (data.fullName || '?')
    .split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div>
      {/* Header / identity card */}
      <div className="pm-card mb-3" style={{
        background: 'linear-gradient(135deg, var(--pm-primary) 0%, var(--pm-primary-dark) 100%)',
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 170, height: 170, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(255,255,255,0.18)', border: '2px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Roboto Condensed', sans-serif", fontSize: '1.6rem', fontWeight: 700,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '1.9rem', fontWeight: 700, lineHeight: 1.1 }}>
              {data.fullName}
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.85, marginTop: 4 }}>
              Patient ID: {data.patientId} · Blood Type {data.bloodType}
            </div>
          </div>
          <button
            className="pm-btn"
            onClick={editing ? cancelEdit : startEdit}
            style={{
              background: 'rgba(255,255,255,0.18)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            {editing ? <><X size={15} /> Cancel</> : <><Pencil size={15} /> Edit Profile</>}
          </button>
          {editing && (
            <button className="pm-btn" onClick={saveEdit} style={{ background: '#fff', color: 'var(--pm-primary-dark)' }}>
              <Check size={15} /> Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Birthing journey / patient story */}
      <div className="pm-card mb-3">
        <div className="pm-section-header">
          <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Baby size={17} style={{ color: 'var(--pm-primary)' }} /> Birthing Journey
          </div>
          <span className="pm-badge pm-badge-info">Week {week} of 40</span>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--pm-text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
          {data.fullName.split(' ')[0]} is currently in the{' '}
          <strong style={{ color: 'var(--pm-text)' }}>second trimester</strong>, week {week}. Baby is
          developing nicely with a steady heartbeat and healthy growth measurements. The estimated
          due date is approaching in the third trimester.
        </p>

        {/* Stage rail */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, overflowX: 'auto', paddingBottom: 4 }}>
          {JOURNEY.map((stage, i) => {
            const done = i < currentStageIndex;
            const active = i === currentStageIndex;
            const StageIcon = stage.icon;
            const iconColor = active ? '#fff' : done ? 'var(--pm-primary)' : 'var(--pm-text-muted)';
            return (
              <div key={stage.key} style={{ flex: '1 0 120px', textAlign: 'center' }}>
                <div style={{
                  height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: active ? 'var(--pm-primary)' : done ? 'var(--pm-primary-light)' : 'var(--pm-surface-2)',
                  border: active ? 'none' : '1px solid var(--pm-border)',
                  boxShadow: active ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
                }}>
                  <StageIcon size={20} style={{ color: iconColor }} />
                </div>
                <div style={{
                  fontSize: '0.74rem', marginTop: 6, fontWeight: active ? 700 : 500,
                  color: active ? 'var(--pm-primary)' : 'var(--pm-text-muted)',
                }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--pm-text-muted)', opacity: 0.7 }}>
                  Wk {stage.weeks}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pm-progress">
          <div className="pm-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="row g-3">
        {/* Contact information */}
        <div className="col-12 col-lg-6">
          <div className="pm-card" style={{ height: '100%' }}>
            <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Phone size={16} style={{ color: 'var(--pm-primary)' }} /> Contact Information
            </div>
            <Field label="Phone" name="phone" value={data.phone} editing={editing} onChange={onChange} icon={Phone} />
            <Field label="Email" name="email" value={data.email} editing={editing} onChange={onChange} type="email" icon={Mail} />
            <Field label="Home Address" name="address" value={data.address} editing={editing} onChange={onChange} icon={MapPin} />
            <hr style={{ borderColor: 'var(--pm-border)', margin: '4px 0 16px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
              <ShieldAlert size={13} /> Emergency Contact
            </div>
            <Field label="Name" name="emergencyName" value={data.emergencyName} editing={editing} onChange={onChange} />
            <Field label="Phone" name="emergencyPhone" value={data.emergencyPhone} editing={editing} onChange={onChange} />
          </div>
        </div>

        {/* Personal & medical details */}
        <div className="col-12 col-lg-6">
          <div className="pm-card" style={{ height: '100%' }}>
            <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <User size={16} style={{ color: 'var(--pm-primary)' }} /> Personal & Medical Details
            </div>
            <div className="row g-2">
              <div className="col-6">
                <Field label="Date of Birth" name="dob" value={data.dob} editing={editing} onChange={onChange} type="date" icon={Calendar} />
              </div>
              <div className="col-6">
                <Field label="Blood Type" name="bloodType" value={data.bloodType} editing={editing} onChange={onChange} icon={Droplet} />
              </div>
              <div className="col-6">
                <Field label="Blood Pressure" name="bloodPressure" value={data.bloodPressure} editing={editing} onChange={onChange} icon={Heart} />
              </div>
              <div className="col-6">
                <Field label="Current Week" name="week" value={data.week} editing={editing} onChange={onChange} type="number" icon={Baby} />
              </div>
            </div>
            <hr style={{ borderColor: 'var(--pm-border)', margin: '4px 0 16px' }} />

            {/* Allergies callout */}
            <div style={{
              display: 'flex', gap: 10, alignItems: 'flex-start', padding: 12, borderRadius: 10,
              background: 'rgba(220,53,69,0.06)', border: '1px solid rgba(220,53,69,0.2)', marginBottom: 16,
            }}>
              <AlertTriangle size={16} style={{ color: 'var(--pm-danger, #dc3545)', flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--pm-danger, #dc3545)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
                  Known Allergies
                </div>
                {editing ? (
                  <input name="allergies" value={data.allergies} onChange={onChange}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--pm-border)', background: 'var(--pm-surface-2)', color: 'var(--pm-text)', fontSize: '0.85rem', outline: 'none' }} />
                ) : (
                  <div style={{ fontSize: '0.88rem', color: 'var(--pm-text)', fontWeight: 500 }}>{data.allergies}</div>
                )}
              </div>
            </div>

            <Field label="Existing Conditions" name="conditions" value={data.conditions} editing={editing} onChange={onChange} />
            <Field label="Obstetric History" name="obHistory" value={data.obHistory} editing={editing} onChange={onChange} />
          </div>
        </div>
      </div>
    </div>
  );
}