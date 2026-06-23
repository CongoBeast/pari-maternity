import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, ShieldX, Clock, AlertCircle, Search, Filter,
  ChevronDown, FileText, ArrowUpDown, X, CheckCircle2,
  XCircle, HelpCircle, RefreshCw, Eye, Download, Building2
} from 'lucide-react';

// ── Zimbabwe insurance providers ──────────────────────────────────────────────
const INSURERS = [
  'CIMAS Health',
  'First Mutual Health',
  'Econet Life',
  'Cell Life',
  'Old Mutual Zimbabwe',
  'NMB Life',
  'Zimnat Lion',
  'All Insurers',
];

const CLAIM_TYPES = [
  'Maternity',
  'Neonatal ICU',
  'Surgical',
  'Outpatient',
  'Emergency',
  'Pharmacy',
  'Laboratory',
  'All Types',
];

const STATUS_CONFIG = {
  Approved:    { color: 'var(--pm-success)',  icon: CheckCircle2, badgeClass: 'pm-badge-success' },
  Rejected:    { color: 'var(--pm-danger)',   icon: XCircle,      badgeClass: 'pm-badge-danger'  },
  Pending:     { color: '#f59e0b',             icon: Clock,        badgeClass: 'pm-badge-warning' },
  'Under Review': { color: 'var(--pm-primary)', icon: RefreshCw,  badgeClass: 'pm-badge-info'    },
};

// ── Sample data – Zimbabwe-localised names & amounts in ZiG ──────────────────
const CLAIMS_DATA = [
  {
    id: 'CLM-2025-0041',
    patientId: 'PT-10892',
    patientName: 'Chipo Mutasa',
    dob: '14 Mar 1994',
    ward: 'Post-Natal Ward B',
    insurer: 'CIMAS Health',
    policyNo: 'CIM-2891-ZW',
    type: 'Maternity',
    submitted: '2025-06-01',
    amount: 42500,
    approvedAmt: 42500,
    status: 'Approved',
    adjudicator: 'CIMAS Claims Dept',
    notes: 'Normal vaginal delivery. All documentation verified.',
    rejectionReason: null,
  },
  {
    id: 'CLM-2025-0042',
    patientId: 'PT-11034',
    patientName: 'Rudo Moyo',
    dob: '29 Jul 1998',
    ward: 'NICU – Floor 2',
    insurer: 'First Mutual Health',
    policyNo: 'FMH-7712-ZW',
    type: 'Neonatal ICU',
    submitted: '2025-06-02',
    amount: 185000,
    approvedAmt: 120000,
    status: 'Approved',
    adjudicator: 'First Mutual Assessors',
    notes: 'Partial approval. NICU days 1–6 covered; day 7 outside benefit limit.',
    rejectionReason: null,
  },
  {
    id: 'CLM-2025-0043',
    patientId: 'PT-10455',
    patientName: 'Tendai Nyamukapa',
    dob: '03 Feb 1989',
    ward: 'Delivery Room 3',
    insurer: 'Econet Life',
    policyNo: 'ECL-5540-ZW',
    type: 'Surgical',
    submitted: '2025-06-03',
    amount: 97000,
    approvedAmt: null,
    status: 'Pending',
    adjudicator: null,
    notes: 'Awaiting pre-authorisation confirmation from Econet Life.',
    rejectionReason: null,
  },
  {
    id: 'CLM-2025-0044',
    patientId: 'PT-10788',
    patientName: 'Farai Chirinda',
    dob: '18 Nov 2001',
    ward: 'Post-Natal Ward A',
    insurer: 'Old Mutual Zimbabwe',
    policyNo: 'OM-3341-ZW',
    type: 'Maternity',
    submitted: '2025-05-28',
    amount: 38000,
    approvedAmt: null,
    status: 'Rejected',
    adjudicator: 'Old Mutual Health Division',
    notes: 'Policy lapsed 14 days prior to admission.',
    rejectionReason: 'Policy not active at time of admission.',
  },
  {
    id: 'CLM-2025-0045',
    patientId: 'PT-11120',
    patientName: 'Nyaradzo Chikosi',
    dob: '22 Apr 1996',
    ward: 'Delivery Room 1',
    insurer: 'CIMAS Health',
    policyNo: 'CIM-4490-ZW',
    type: 'Emergency',
    submitted: '2025-06-04',
    amount: 63000,
    approvedAmt: null,
    status: 'Under Review',
    adjudicator: 'CIMAS Claims Dept',
    notes: 'Awaiting theatre notes and anaesthetist report.',
    rejectionReason: null,
  },
  {
    id: 'CLM-2025-0046',
    patientId: 'PT-10213',
    patientName: 'Blessing Gumbo',
    dob: '07 Sep 1992',
    ward: 'Outpatient Clinic',
    insurer: 'Cell Life',
    policyNo: 'CL-8820-ZW',
    type: 'Outpatient',
    submitted: '2025-05-30',
    amount: 12500,
    approvedAmt: 12500,
    status: 'Approved',
    adjudicator: 'Cell Life Health',
    notes: 'Routine 6-week post-natal check. Fully covered.',
    rejectionReason: null,
  },
  {
    id: 'CLM-2025-0047',
    patientId: 'PT-11200',
    patientName: 'Maidei Hungwe',
    dob: '11 Jan 2000',
    ward: 'Pharmacy',
    insurer: 'NMB Life',
    policyNo: 'NMB-6610-ZW',
    type: 'Pharmacy',
    submitted: '2025-06-05',
    amount: 8900,
    approvedAmt: null,
    status: 'Rejected',
    adjudicator: 'NMB Life Assessors',
    notes: 'Prescribed medication not on NMB formulary list.',
    rejectionReason: 'Medication not on approved formulary.',
  },
  {
    id: 'CLM-2025-0048',
    patientId: 'PT-10657',
    patientName: 'Tsitsi Zvenyika',
    dob: '30 May 1987',
    ward: 'Laboratory',
    insurer: 'Zimnat Lion',
    policyNo: 'ZL-2281-ZW',
    type: 'Laboratory',
    submitted: '2025-06-06',
    amount: 22000,
    approvedAmt: 22000,
    status: 'Approved',
    adjudicator: 'Zimnat Health Assessors',
    notes: 'Full blood count and antenatal panel. All covered.',
    rejectionReason: null,
  },
  {
    id: 'CLM-2025-0049',
    patientId: 'PT-11310',
    patientName: 'Sheila Dube',
    dob: '15 Aug 1995',
    ward: 'NICU – Floor 2',
    insurer: 'First Mutual Health',
    policyNo: 'FMH-9930-ZW',
    type: 'Neonatal ICU',
    submitted: '2025-06-07',
    amount: 210000,
    approvedAmt: null,
    status: 'Under Review',
    adjudicator: 'First Mutual Assessors',
    notes: 'Complex premature birth. Specialist report pending.',
    rejectionReason: null,
  },
  {
    id: 'CLM-2025-0050',
    patientId: 'PT-10900',
    patientName: 'Priscah Ncube',
    dob: '04 Dec 1993',
    ward: 'Delivery Room 2',
    insurer: 'Old Mutual Zimbabwe',
    policyNo: 'OM-7712-ZW',
    type: 'Surgical',
    submitted: '2025-06-03',
    amount: 115000,
    approvedAmt: 115000,
    status: 'Approved',
    adjudicator: 'Old Mutual Health Division',
    notes: 'Emergency C-section. Fully authorised.',
    rejectionReason: null,
  },
];

// ── Format ZiG currency ──────────────────────────────────────────────────────
const fmtZiG = (n) =>
  n == null ? '—' : `ZiG ${n.toLocaleString('en-ZW')}`;

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {};
  const Icon = cfg.icon || HelpCircle;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: '0.7rem',
        fontWeight: 700,
        padding: '3px 9px',
        borderRadius: 20,
        background: cfg.color + '22',
        color: cfg.color,
        border: `1px solid ${cfg.color}44`,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={11} />
      {status}
    </span>
  );
}

// ── Detail drawer (slide-in panel) ───────────────────────────────────────────
function ClaimDetailDrawer({ claim, onClose }) {
  if (!claim) return null;
  const cfg = STATUS_CONFIG[claim.status] || {};
  const Icon = cfg.icon || HelpCircle;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: 480,
          background: 'var(--pm-card-bg)',
          height: '100%', overflowY: 'auto',
          padding: '28px 24px',
          boxShadow: '-6px 0 30px rgba(0,0,0,0.18)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Claim Reference</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--pm-text)' }}>{claim.id}</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pm-text-muted)', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Status banner */}
        <div
          style={{
            background: cfg.color + '18',
            border: `1px solid ${cfg.color}44`,
            borderRadius: 10,
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 22,
          }}
        >
          <Icon size={20} style={{ color: cfg.color, flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, color: cfg.color, fontSize: '0.9rem' }}>{claim.status}</div>
            {claim.rejectionReason && (
              <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>{claim.rejectionReason}</div>
            )}
          </div>
        </div>

        {/* Patient info */}
        <Section title="Patient Details">
          <Row label="Full Name"    value={claim.patientName} />
          <Row label="Patient ID"   value={claim.patientId} />
          <Row label="Date of Birth" value={claim.dob} />
          <Row label="Ward"         value={claim.ward} />
        </Section>

        {/* Insurance info */}
        <Section title="Insurance Details">
          <Row label="Insurer"      value={claim.insurer} />
          <Row label="Policy No."   value={claim.policyNo} />
          <Row label="Claim Type"   value={claim.type} />
          <Row label="Date Submitted" value={claim.submitted} />
        </Section>

        {/* Financials */}
        <Section title="Financial Summary">
          <Row label="Amount Claimed" value={fmtZiG(claim.amount)} bold />
          <Row label="Amount Approved" value={fmtZiG(claim.approvedAmt)} bold
            valueStyle={{ color: claim.approvedAmt ? 'var(--pm-success)' : 'var(--pm-text-muted)' }}
          />
          {claim.approvedAmt != null && claim.approvedAmt < claim.amount && (
            <Row
              label="Shortfall"
              value={fmtZiG(claim.amount - claim.approvedAmt)}
              valueStyle={{ color: 'var(--pm-danger)' }}
              bold
            />
          )}
        </Section>

        {/* Notes */}
        {claim.notes && (
          <Section title="Adjudicator Notes">
            <div style={{ fontSize: '0.82rem', color: 'var(--pm-text-muted)', lineHeight: 1.6 }}>{claim.notes}</div>
            {claim.adjudicator && (
              <div style={{ fontSize: '0.72rem', marginTop: 8, color: 'var(--pm-text-muted)', fontStyle: 'italic' }}>
                — {claim.adjudicator}
              </div>
            )}
          </Section>
        )}

        <button className="pm-btn pm-btn-outline pm-btn-sm w-100" style={{ marginTop: 8 }}>
          <Download size={13} /> Export Claim PDF
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: '0.68rem', fontWeight: 700, color: 'var(--pm-text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.07em',
        marginBottom: 10, paddingBottom: 6,
        borderBottom: '1px solid var(--pm-border)',
      }}>{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value, bold, valueStyle = {} }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 12 }}>
      <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', flexShrink: 0 }}>{label}</div>
      <div style={{ fontSize: '0.82rem', fontWeight: bold ? 700 : 500, color: 'var(--pm-text)', textAlign: 'right', ...valueStyle }}>{value}</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function InsuranceClaimsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [insurerFilter, setInsurerFilter] = useState('All Insurers');
  const [sortField, setSortField] = useState('submitted');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedClaim, setSelectedClaim] = useState(null);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = CLAIMS_DATA.length;
    const approved = CLAIMS_DATA.filter(c => c.status === 'Approved').length;
    const rejected = CLAIMS_DATA.filter(c => c.status === 'Rejected').length;
    const pending = CLAIMS_DATA.filter(c => c.status === 'Pending' || c.status === 'Under Review').length;
    const totalClaimed = CLAIMS_DATA.reduce((s, c) => s + c.amount, 0);
    const totalApproved = CLAIMS_DATA.reduce((s, c) => s + (c.approvedAmt || 0), 0);
    const recoveryRate = totalClaimed > 0 ? Math.round((totalApproved / totalClaimed) * 100) : 0;
    return { total, approved, rejected, pending, totalClaimed, totalApproved, recoveryRate };
  }, []);

  // ── Filter + sort ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = CLAIMS_DATA.filter(c => {
      const matchSearch =
        !q ||
        c.patientName.toLowerCase().includes(q) ||
        c.patientId.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.policyNo.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === 'All' || c.status === statusFilter;
      const matchType =
        typeFilter === 'All Types' || c.type === typeFilter;
      const matchInsurer =
        insurerFilter === 'All Insurers' || c.insurer === insurerFilter;
      return matchSearch && matchStatus && matchType && matchInsurer;
    });

    list = [...list].sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [search, statusFilter, typeFilter, insurerFilter, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortTh = ({ field, label }) => (
    <th
      style={{ cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none', padding: '10px 12px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--pm-border)', background: 'var(--pm-surface)' }}
      onClick={() => toggleSort(field)}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {label}
        <ArrowUpDown size={11} style={{ opacity: sortField === field ? 1 : 0.35, color: sortField === field ? 'var(--pm-primary)' : undefined }} />
      </span>
    </th>
  );

  const activeFilters = [
    statusFilter !== 'All' && { key: 'status', label: statusFilter, clear: () => setStatusFilter('All') },
    typeFilter !== 'All Types' && { key: 'type', label: typeFilter, clear: () => setTypeFilter('All Types') },
    insurerFilter !== 'All Insurers' && { key: 'insurer', label: insurerFilter, clear: () => setInsurerFilter('All Insurers') },
  ].filter(Boolean);

  return (
    <div>
      {/* ── Stat cards ─────────────────────────────────────────────────────── */}
      <div className="row g-3 mb-4">
        {/* Total claims */}
        <div className="col-6 col-md-4 col-xl">
          <div className="pm-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <FileText size={16} style={{ opacity: 0.7 }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'rgba(255,255,255,0.18)', padding: '1px 7px', borderRadius: 20 }}>Total</span>
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.75, marginBottom: 2 }}>All Claims</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1 }}>{stats.total}</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.65, marginTop: 5 }}>This period</div>
          </div>
        </div>

        {/* Approved */}
        <div className="col-6 col-md-4 col-xl">
          <div className="pm-stat-card" style={{ background: 'var(--pm-success)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <ShieldCheck size={16} style={{ opacity: 0.7 }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'rgba(255,255,255,0.18)', padding: '1px 7px', borderRadius: 20 }}>Approved</span>
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.75, marginBottom: 2 }}>Approved Claims</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1 }}>{stats.approved}</div>
            <div className="pm-progress mt-2"><div className="pm-progress-fill" style={{ width: `${Math.round((stats.approved / stats.total) * 100)}%` }} /></div>
            <div style={{ fontSize: '0.7rem', opacity: 0.65, marginTop: 5 }}>{Math.round((stats.approved / stats.total) * 100)}% approval rate</div>
          </div>
        </div>

        {/* Rejected */}
        <div className="col-6 col-md-4 col-xl">
          <div className="pm-stat-card" style={{ background: 'var(--pm-danger)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <ShieldX size={16} style={{ opacity: 0.7 }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'rgba(255,255,255,0.18)', padding: '1px 7px', borderRadius: 20 }}>Rejected</span>
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.75, marginBottom: 2 }}>Rejected Claims</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1 }}>{stats.rejected}</div>
            <div className="pm-progress mt-2"><div className="pm-progress-fill" style={{ width: `${Math.round((stats.rejected / stats.total) * 100)}%` }} /></div>
            <div style={{ fontSize: '0.7rem', opacity: 0.65, marginTop: 5 }}>{Math.round((stats.rejected / stats.total) * 100)}% rejection rate</div>
          </div>
        </div>

        {/* Pending / Under Review */}
        <div className="col-6 col-md-4 col-xl">
          <div className="pm-stat-card" style={{ background: 'linear-gradient(135deg, #b45309, #92400e)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <Clock size={16} style={{ opacity: 0.7 }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'rgba(255,255,255,0.18)', padding: '1px 7px', borderRadius: 20 }}>Awaiting</span>
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.75, marginBottom: 2 }}>Pending / Review</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1 }}>{stats.pending}</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.65, marginTop: 5 }}>Action required</div>
          </div>
        </div>

        {/* Recovery rate */}
        <div className="col-6 col-md-4 col-xl">
          <div className="pm-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <Building2 size={16} style={{ opacity: 0.7 }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'rgba(255,255,255,0.18)', padding: '1px 7px', borderRadius: 20 }}>ZiG</span>
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.75, marginBottom: 2 }}>Recovery Rate</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1 }}>{stats.recoveryRate}%</div>
            <div className="pm-progress mt-2"><div className="pm-progress-fill" style={{ width: `${stats.recoveryRate}%` }} /></div>
            <div style={{ fontSize: '0.7rem', opacity: 0.65, marginTop: 5 }}>{fmtZiG(stats.totalApproved)} recovered</div>
          </div>
        </div>
      </div>

      {/* ── Claims table card ───────────────────────────────────────────────── */}
      <div className="pm-card">
        <div className="pm-section-header" style={{ marginBottom: 16 }}>
          <div className="pm-section-title">Insurance Claims</div>
          <button className="pm-btn pm-btn-primary pm-btn-sm">
            <FileText size={12} /> New Claim
          </button>
        </div>

        {/* Search + filters row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 0 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search by name, patient ID or claim no…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', paddingLeft: 32, paddingRight: 10, paddingTop: 8, paddingBottom: 8,
                fontSize: '0.82rem', border: '1px solid var(--pm-border)', borderRadius: 8,
                background: 'var(--pm-surface)', color: 'var(--pm-text)', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Status filter */}
          <SelectFilter
            value={statusFilter}
            onChange={setStatusFilter}
            options={['All', 'Approved', 'Rejected', 'Pending', 'Under Review']}
            icon={<Filter size={12} />}
          />

          {/* Claim type */}
          <SelectFilter
            value={typeFilter}
            onChange={setTypeFilter}
            options={CLAIM_TYPES}
            icon={<ChevronDown size={12} />}
          />

          {/* Insurer */}
          <SelectFilter
            value={insurerFilter}
            onChange={setInsurerFilter}
            options={INSURERS}
            icon={<Building2 size={12} />}
          />
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {activeFilters.map(f => (
              <span
                key={f.key}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: '0.72rem', fontWeight: 600,
                  padding: '3px 10px', borderRadius: 20,
                  background: 'var(--pm-primary-light)',
                  color: 'var(--pm-primary)',
                  border: '1px solid var(--pm-primary)',
                }}
              >
                {f.label}
                <button onClick={f.clear} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, color: 'inherit', display: 'flex' }}>
                  <X size={10} />
                </button>
              </span>
            ))}
            <button
              onClick={() => { setStatusFilter('All'); setTypeFilter('All Types'); setInsurerFilter('All Insurers'); }}
              style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Result count */}
        <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginBottom: 10 }}>
          Showing {filtered.length} of {CLAIMS_DATA.length} claims
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <SortTh field="id"          label="Claim No." />
                <SortTh field="patientId"   label="Patient ID" />
                <SortTh field="patientName" label="Patient Name" />
                <SortTh field="insurer"     label="Insurer" />
                <SortTh field="type"        label="Type" />
                <SortTh field="submitted"   label="Submitted" />
                <SortTh field="amount"      label="Claimed (ZiG)" />
                <th style={{ padding: '10px 12px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--pm-border)', background: 'var(--pm-surface)', whiteSpace: 'nowrap' }}>Approved (ZiG)</th>
                <SortTh field="status"      label="Status" />
                <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--pm-border)', background: 'var(--pm-surface)' }} />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--pm-text-muted)', fontSize: '0.85rem' }}>
                    <AlertCircle size={24} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.4 }} />
                    No claims match your search or filters.
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr
                    key={c.id}
                    style={{
                      background: i % 2 === 0 ? 'transparent' : 'var(--pm-surface)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--pm-primary-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--pm-surface)'}
                  >
                    <td style={td}><span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--pm-primary)', fontWeight: 600 }}>{c.id}</span></td>
                    <td style={td}><span style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{c.patientId}</span></td>
                    <td style={td}>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{c.patientName}</div>
                      <div style={{ fontSize: '0.69rem', color: 'var(--pm-text-muted)' }}>{c.ward}</div>
                    </td>
                    <td style={td}>
                      <div style={{ fontSize: '0.82rem' }}>{c.insurer}</div>
                      <div style={{ fontSize: '0.69rem', color: 'var(--pm-text-muted)', fontFamily: 'monospace' }}>{c.policyNo}</div>
                    </td>
                    <td style={td}>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 12, background: 'var(--pm-surface)', border: '1px solid var(--pm-border)', fontWeight: 600 }}>{c.type}</span>
                    </td>
                    <td style={{ ...td, fontSize: '0.8rem', color: 'var(--pm-text-muted)' }}>{c.submitted}</td>
                    <td style={{ ...td, fontWeight: 600, fontSize: '0.82rem', textAlign: 'right', whiteSpace: 'nowrap' }}>{fmtZiG(c.amount)}</td>
                    <td style={{ ...td, fontWeight: 700, fontSize: '0.82rem', textAlign: 'right', whiteSpace: 'nowrap', color: c.approvedAmt != null ? 'var(--pm-success)' : 'var(--pm-text-muted)' }}>
                      {c.status === 'Rejected' ? (
                        <span style={{ color: 'var(--pm-danger)', fontWeight: 600, fontSize: '0.78rem' }}>Declined</span>
                      ) : fmtZiG(c.approvedAmt)}
                    </td>
                    <td style={td}><StatusBadge status={c.status} /></td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <button
                        className="pm-btn pm-btn-ghost pm-btn-sm"
                        style={{ padding: '4px 10px' }}
                        onClick={() => setSelectedClaim(c)}
                      >
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer totals */}
        {filtered.length > 0 && (
          <div style={{
            display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 20,
            padding: '12px 12px 0', borderTop: '1px solid var(--pm-border)', marginTop: 8,
            fontSize: '0.8rem', color: 'var(--pm-text-muted)',
          }}>
            <span>Total claimed: <strong style={{ color: 'var(--pm-text)' }}>{fmtZiG(filtered.reduce((s, c) => s + c.amount, 0))}</strong></span>
            <span>Total approved: <strong style={{ color: 'var(--pm-success)' }}>{fmtZiG(filtered.reduce((s, c) => s + (c.approvedAmt || 0), 0))}</strong></span>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      <ClaimDetailDrawer claim={selectedClaim} onClose={() => setSelectedClaim(null)} />
    </div>
  );
}

// ── Shared td style ───────────────────────────────────────────────────────────
const td = {
  padding: '11px 12px',
  borderBottom: '1px solid var(--pm-border)',
  verticalAlign: 'middle',
  fontSize: '0.83rem',
  color: 'var(--pm-text)',
};

// ── Reusable select ───────────────────────────────────────────────────────────
function SelectFilter({ value, onChange, options, icon }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)', pointerEvents: 'none', display: 'flex' }}>
        {icon}
      </span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          paddingLeft: 28, paddingRight: 24, paddingTop: 7, paddingBottom: 7,
          fontSize: '0.8rem', border: '1px solid var(--pm-border)', borderRadius: 8,
          background: 'var(--pm-surface)', color: 'var(--pm-text)', cursor: 'pointer',
          appearance: 'none', outline: 'none',
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={11} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--pm-text-muted)' }} />
    </div>
  );
}