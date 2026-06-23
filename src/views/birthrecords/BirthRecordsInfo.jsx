import React, { useState } from 'react';
import {
  UserCog, Shield, Mail, Phone, MapPin, Building2, BadgeCheck,
  Calendar, Pencil, Check, X, KeyRound, Award, CheckCircle2,
  Lock, Clock,
} from 'lucide-react';

// Small presentational field helper (text ⇄ input) ---------------------------
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
          style={{ width: '100%', padding: '8px 11px', borderRadius: 8, border: '1px solid var(--pm-border)', background: 'var(--pm-surface-2)', color: 'var(--pm-text)', fontSize: '0.88rem', outline: 'none' }}
        />
      ) : (
        <div style={{ fontSize: '0.92rem', color: 'var(--pm-text)', fontWeight: 500 }}>
          {value || <span style={{ color: 'var(--pm-text-muted)' }}>—</span>}
        </div>
      )}
    </div>
  );
}

export default function BirthRecordsInfo({ user, onUpdate }) {
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.name || 'Tafadzwa Makoni',
    officerId: 'OFF-RR-0457',
    title: 'Senior Birth Records Registrar',
    department: 'Vital Records & Neonatal Registration',
    employeeSince: '2019-06-03',
    email: user?.email || 'tafadzwa.makoni@records.gov.zw',
    phone: '+263 24 270 1234',
    office: 'Records Division · 3rd Floor, Block A, Harare Central Registry',
  });

  const [draft, setDraft] = useState(form);

  const startEdit = () => { setDraft(form); setEditing(true); };
  const cancelEdit = () => { setDraft(form); setEditing(false); };
  const saveEdit = () => { setForm(draft); setEditing(false); if (onUpdate) onUpdate(draft); };
  const onChange = (e) => setDraft({ ...draft, [e.target.name]: e.target.value });
  const data = editing ? draft : form;

  // System-derived info (display only) ----------------------------------------
  const accessLevel = 'Level 3 — Registrar (Approve & Amend)';
  const accountStatus = 'Active';
  const twoFactor = true;
  const lastCredentialRenewal = 'Renewed 5 hours ago';
  const certifications = [
    'HIPAA Compliance — Certified',
    'Vital Records Handling — Tier II',
    'Digital Certificate Authority Access',
  ];
  const workSummary = [
    { label: 'Records Processed (Month)', value: '342' },
    { label: 'Certificates Approved', value: '150' },
    { label: 'Sent for Amendment', value: '50' },
  ];

  const initials = (data.fullName || '?')
    .split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div>
      {/* Identity header */}
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
              {data.title}
            </div>
            <div style={{ fontSize: '0.78rem', opacity: 0.7, marginTop: 2 }}>
              Officer ID: {data.officerId}
            </div>
          </div>
          <button
            className="pm-btn"
            onClick={editing ? cancelEdit : startEdit}
            style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
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

      {/* Work summary stats */}
      <div className="row g-3 mb-3">
        {workSummary.map((s, i) => (
          <div className="col-12 col-md-4" key={i}>
            <div className="pm-stat-card secondary">
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--pm-text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                {s.label}
              </div>
              <div className="pm-stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* Professional details */}
        <div className="col-12 col-lg-6">
          <div className="pm-card" style={{ height: '100%' }}>
            <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <UserCog size={16} style={{ color: 'var(--pm-primary)' }} /> Professional Details
            </div>
            <Field label="Full Name" name="fullName" value={data.fullName} editing={editing} onChange={onChange} icon={UserCog} />
            <div className="row g-2">
              <div className="col-6">
                <Field label="Officer ID" name="officerId" value={data.officerId} editing={editing} onChange={onChange} icon={BadgeCheck} />
              </div>
              <div className="col-6">
                <Field label="Employee Since" name="employeeSince" value={data.employeeSince} editing={editing} onChange={onChange} type="date" icon={Calendar} />
              </div>
            </div>
            <Field label="Title / Role" name="title" value={data.title} editing={editing} onChange={onChange} icon={Award} />
            <Field label="Department" name="department" value={data.department} editing={editing} onChange={onChange} icon={Building2} />
          </div>
        </div>

        {/* Contact information */}
        <div className="col-12 col-lg-6">
          <div className="pm-card" style={{ height: '100%' }}>
            <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Phone size={16} style={{ color: 'var(--pm-primary)' }} /> Contact Information
            </div>
            <Field label="Work Email" name="email" value={data.email} editing={editing} onChange={onChange} type="email" icon={Mail} />
            <Field label="Phone" name="phone" value={data.phone} editing={editing} onChange={onChange} icon={Phone} />
            <Field label="Office Location" name="office" value={data.office} editing={editing} onChange={onChange} icon={MapPin} />
          </div>
        </div>

        {/* Credentials & security */}
        <div className="col-12">
          <div className="pm-card">
            <div className="pm-section-header">
              <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={16} style={{ color: 'var(--pm-primary)' }} /> Credentials & Security
              </div>
              <span className="pm-badge pm-badge-success">{accountStatus}</span>
            </div>

            <div className="row g-3">
              {/* Access level */}
              <div className="col-12 col-md-6">
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 14, borderRadius: 10, background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', height: '100%' }}>
                  <KeyRound size={18} style={{ color: 'var(--pm-primary)', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Access Level</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--pm-text)', fontWeight: 600, marginTop: 3 }}>{accessLevel}</div>
                  </div>
                </div>
              </div>

              {/* Two-factor + renewal */}
              <div className="col-12 col-md-6">
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 14, borderRadius: 10, background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', height: '100%' }}>
                  <Lock size={18} style={{ color: 'var(--pm-primary)', flexShrink: 0, marginTop: 1 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Two-Factor Authentication</span>
                      <span className={`pm-badge ${twoFactor ? 'pm-badge-success' : 'pm-badge-danger'}`}>{twoFactor ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={13} /> {lastCredentialRenewal}
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="col-12">
                <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                  Certifications
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {certifications.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px', borderRadius: 20, background: 'var(--pm-primary-light)', fontSize: '0.8rem', color: 'var(--pm-text)', fontWeight: 500 }}>
                      <CheckCircle2 size={14} style={{ color: 'var(--pm-primary)' }} /> {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button className="pm-btn pm-btn-outline pm-btn-sm mt-3">
              <KeyRound size={13} /> Renew Security Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}