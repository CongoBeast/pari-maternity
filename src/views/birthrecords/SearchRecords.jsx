import React, { useState, useMemo } from 'react';
import {
  Search, Baby, X, Copy, Check, FileText, Calendar, User,
  Stethoscope, MapPin, Weight, CheckCircle, Clock, Hash,
  Ticket, ArrowUp, ArrowDown, ArrowUpDown, AlertCircle,
} from 'lucide-react';

// ---- Demo birth records ------------------------------------------------------
const RECORDS = [
  { id: 'BR-2024-001', child: 'Rutendo Moyo',     sex: 'F', dob: '2024-03-08', time: '04:12 AM', weight: '3.4 kg', ward: 'Neonatal Unit-A', mother: 'Tendai Moyo',     father: 'Tafadzwa Moyo',   physician: 'Dr. Tafadzwa Makoni',  status: 'verified' },
  { id: 'BR-2024-002', child: 'Kudakwashe Zvobgo', sex: 'M', dob: '2024-03-09', time: '11:48 PM', weight: '3.7 kg', ward: 'Neonatal Unit-A', mother: 'Chipo Zvobgo',    father: 'Takudzwa Zvobgo', physician: 'Dr. Kudzai Ncube',    status: 'inprogress' },
  { id: 'BR-2024-003', child: 'Rudo Mafuka',      sex: 'F', dob: '2024-03-09', time: '09:30 AM', weight: '2.9 kg', ward: 'Neonatal Unit-B', mother: 'Rudo Mafuka',     father: 'Tinashe Mafuka',  physician: 'Dr. Chiedza Mhlanga',  status: 'amendment' },
  { id: 'BR-2024-004', child: 'Tariro Gumbo',     sex: 'M', dob: '2024-03-11', time: '06:05 AM', weight: '3.5 kg', ward: 'Neonatal Unit-A', mother: 'Tariro Gumbo',    father: 'Farai Gumbo',     physician: 'Dr. Tafadzwa Makoni',  status: 'verified' },
  { id: 'BR-2024-005', child: 'Nyasha Mhondoro',  sex: 'F', dob: '2024-03-12', time: '02:20 PM', weight: '3.1 kg', ward: 'Neonatal Unit-C', mother: 'Nyasha Mhondoro', father: 'Anesu Mhondoro',  physician: 'Dr. Chiedza Mhlanga',  status: 'verified' },
  { id: 'BR-2024-006', child: 'Anotida Sibanda',  sex: 'M', dob: '2024-03-14', time: '08:55 AM', weight: '3.8 kg', ward: 'Neonatal Unit-B', mother: 'Rutendo Sibanda', father: 'Kudzai Sibanda',  physician: 'Dr. Kudzai Ncube',    status: 'inprogress' },
  { id: 'BR-2024-007', child: 'Tendai Murefu',    sex: 'F', dob: '2024-03-15', time: '01:10 AM', weight: '2.7 kg', ward: 'Neonatal Unit-C', mother: 'Kudzai Murefu',   father: 'Tawanda Murefu',  physician: 'Dr. Tafadzwa Makoni',  status: 'verified' },
  { id: 'BR-2024-008', child: 'Tanaka Moyo',      sex: 'M', dob: '2024-03-16', time: '07:42 PM', weight: '3.6 kg', ward: 'Neonatal Unit-A', mother: 'Tendai Moyo',     father: 'Tafadzwa Moyo',   physician: 'Dr. Chiedza Mhlanga',  status: 'amendment' },
  { id: 'BR-2024-009', child: 'Chipo Ncube',      sex: 'F', dob: '2024-03-18', time: '10:25 AM', weight: '3.2 kg', ward: 'Neonatal Unit-B', mother: 'Rudo Mafuka',     father: 'Tinashe Mafuka',  physician: 'Dr. Kudzai Ncube',    status: 'verified' },
  { id: 'BR-2024-010', child: 'Tafadzwa Gumbo',   sex: 'M', dob: '2024-03-19', time: '05:33 AM', weight: '4.0 kg', ward: 'Neonatal Unit-A', mother: 'Tariro Gumbo',    father: 'Farai Gumbo',     physician: 'Dr. Tafadzwa Makoni',  status: 'verified' },
  { id: 'BR-2024-011', child: 'Rutendo Dube',     sex: 'F', dob: '2024-03-20', time: '12:01 PM', weight: '3.0 kg', ward: 'Neonatal Unit-C', mother: 'Chipo Zvobgo',    father: 'Takudzwa Zvobgo', physician: 'Dr. Chiedza Mhlanga',  status: 'inprogress' },
  { id: 'BR-2024-012', child: 'Kudzai Mafuka',    sex: 'M', dob: '2024-03-21', time: '03:47 AM', weight: '3.3 kg', ward: 'Neonatal Unit-B', mother: 'Rudo Mafuka',     father: 'Tinashe Mafuka',  physician: 'Dr. Kudzai Ncube',    status: 'verified' },
];

const STATUS_MAP = {
  verified:   { cls: 'pm-badge-success', label: 'Verified' },
  inprogress: { cls: 'pm-badge-warning', label: 'In Progress' },
  amendment:  { cls: 'pm-badge-danger',  label: 'Amendment' },
};

function StatusBadge({ s }) {
  const { cls, label } = STATUS_MAP[s] || { cls: 'pm-badge-neutral', label: s };
  return <span className={`pm-badge ${cls}`}>{label}</span>;
}

// ---- Helpers -----------------------------------------------------------------
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${MONTHS[+m - 1]} ${d}, ${y}`;
}

function makeReservationCode() {
  const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BC-2024-${seg()}-${seg()}`;
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) { /* fall through */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  } catch (e) {
    return false;
  }
}

// ---- Detail modal ------------------------------------------------------------
function RecordModal({ record, code, onGenerate, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!record) return null;

  const handleCopy = async () => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const row = (Icon, label, value) => (
    <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--pm-border)' }}>
      <Icon size={16} style={{ color: 'var(--pm-primary)', flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
        <div style={{ fontSize: '0.88rem', color: 'var(--pm-text)', fontWeight: 500, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} className="pm-card" style={{ maxWidth: 580, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} className="pm-btn pm-btn-ghost pm-btn-sm" style={{ position: 'absolute', top: 14, right: 14 }} aria-label="Close">
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--pm-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Baby size={20} style={{ color: 'var(--pm-primary)' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--pm-text)' }}>{record.child}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', fontFamily: 'monospace' }}>#{record.id}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}><StatusBadge s={record.status} /></div>
        </div>

        <div className="row g-0" style={{ marginTop: 10 }}>
          <div className="col-12 col-sm-6" style={{ paddingRight: 12 }}>
            {row(User, 'Sex', record.sex === 'F' ? 'Female' : 'Male')}
            {row(Calendar, 'Date of Birth', formatDate(record.dob))}
            {row(Clock, 'Time of Birth', record.time)}
            {row(Weight, 'Birth Weight', record.weight)}
          </div>
          <div className="col-12 col-sm-6" style={{ paddingLeft: 12 }}>
            {row(MapPin, 'Ward', record.ward)}
            {row(User, 'Mother', record.mother)}
            {row(User, 'Father', record.father)}
            {row(Stethoscope, 'Attending Physician', record.physician)}
          </div>
        </div>

        {/* Reservation code section */}
        <div style={{ marginTop: 18, padding: 16, borderRadius: 12, border: '1px solid var(--pm-border)', background: 'var(--pm-surface-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Ticket size={16} style={{ color: 'var(--pm-primary)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pm-text)' }}>Birth Certificate Reservation</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', margin: '0 0 12px' }}>
            Generate a reservation code the family can use to collect the official birth certificate.
          </p>

          {!code ? (
            <button
              className="pm-btn pm-btn-primary"
              onClick={() => onGenerate(record.id)}
              disabled={record.status !== 'verified'}
              style={{ opacity: record.status !== 'verified' ? 0.55 : 1 }}
            >
              <Ticket size={15} /> Generate Reservation Code
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <code style={{
                flex: '1 1 200px', fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 700,
                letterSpacing: '0.06em', color: 'var(--pm-primary)', background: 'var(--pm-primary-light)',
                padding: '10px 14px', borderRadius: 8, textAlign: 'center',
              }}>
                {code}
              </code>
              <button className="pm-btn pm-btn-outline" onClick={handleCopy}>
                {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy</>}
              </button>
              <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => onGenerate(record.id)} title="Generate a new code">
                Regenerate
              </button>
            </div>
          )}

          {record.status !== 'verified' && !code && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: 'var(--pm-danger)', marginTop: 10 }}>
              <AlertCircle size={13} /> Record must be verified before a certificate can be reserved.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Sortable header cell ----------------------------------------------------
function Th({ label, col, sortBy, sortDir, onSort }) {
  const active = sortBy === col;
  return (
    <th onClick={() => onSort(col)} style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {label}
        {active
          ? (sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)
          : <ArrowUpDown size={12} style={{ opacity: 0.35 }} />}
      </span>
    </th>
  );
}

// ---- Page --------------------------------------------------------------------
export default function SearchRecords() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sex, setSex] = useState('all');
  const [ward, setWard] = useState('all');
  const [sortBy, setSortBy] = useState('dob');
  const [sortDir, setSortDir] = useState('desc');
  const [selected, setSelected] = useState(null);
  const [codes, setCodes] = useState({}); // recordId -> reservation code

  const wards = useMemo(() => ['all', ...Array.from(new Set(RECORDS.map((r) => r.ward)))], []);

  const stats = useMemo(() => ({
    total: RECORDS.length,
    verified: RECORDS.filter((r) => r.status === 'verified').length,
    inprogress: RECORDS.filter((r) => r.status === 'inprogress').length,
    amendment: RECORDS.filter((r) => r.status === 'amendment').length,
  }), []);

  const onSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = RECORDS.filter((r) => {
      if (status !== 'all' && r.status !== status) return false;
      if (sex !== 'all' && r.sex !== sex) return false;
      if (ward !== 'all' && r.ward !== ward) return false;
      if (q && !(`${r.child} ${r.id} ${r.mother} ${r.father}`.toLowerCase().includes(q))) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      let av = a[sortBy], bv = b[sortBy];
      if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [search, status, sex, ward, sortBy, sortDir]);

  const generateCode = (id) => setCodes((prev) => ({ ...prev, [id]: makeReservationCode() }));

  const selectStyle = { padding: '8px 11px', borderRadius: 8, border: '1px solid var(--pm-border)', background: 'var(--pm-surface-2)', color: 'var(--pm-text)', fontSize: '0.85rem', outline: 'none' };

  return (
    <div>
      {/* Stat cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3 col-6">
          <div className="pm-stat-card" style={{ minHeight: 120 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', opacity: 0.75, marginBottom: 8 }}>TOTAL RECORDS</div>
            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '2.4rem', fontWeight: 700, lineHeight: 1 }}>{stats.total}</div>
          </div>
        </div>
        <div className="col-12 col-md-3 col-6">
          <div className="pm-stat-card secondary">
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--pm-text-muted)', marginBottom: 8 }}>VERIFIED</div>
            <div className="pm-stat-value">{stats.verified}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--pm-success)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle size={13} /> Ready to issue
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 col-6">
          <div className="pm-stat-card secondary">
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--pm-text-muted)', marginBottom: 8 }}>IN PROGRESS</div>
            <div className="pm-stat-value">{stats.inprogress}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={13} /> Awaiting review
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 col-6">
          <div className="pm-stat-card secondary">
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--pm-text-muted)', marginBottom: 8 }}>AMENDMENTS</div>
            <div className="pm-stat-value">{stats.amendment}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--pm-danger)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertCircle size={13} /> Need action
            </div>
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="pm-card">
        <div className="pm-section-header">
          <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Baby size={18} style={{ color: 'var(--pm-primary)' }} /> Search Birth Records
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by child, parent, or record ID…"
              style={{ ...selectStyle, width: '100%', paddingLeft: 34 }}
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
            <option value="all">All statuses</option>
            <option value="verified">Verified</option>
            <option value="inprogress">In Progress</option>
            <option value="amendment">Amendment</option>
          </select>
          <select value={sex} onChange={(e) => setSex(e.target.value)} style={selectStyle}>
            <option value="all">All</option>
            <option value="F">Female</option>
            <option value="M">Male</option>
          </select>
          <select value={ward} onChange={(e) => setWard(e.target.value)} style={selectStyle}>
            {wards.map((w) => <option key={w} value={w}>{w === 'all' ? 'All wards' : w}</option>)}
          </select>
        </div>

        {/* Results table */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--pm-text-muted)' }}>
            <Search size={28} style={{ opacity: 0.4, marginBottom: 8 }} />
            <div style={{ fontSize: '0.9rem' }}>No records match your search.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="pm-table">
              <thead>
                <tr>
                  <Th label="Record ID" col="id" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
                  <Th label="Child" col="child" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
                  <th>Sex</th>
                  <Th label="DOB" col="dob" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
                  <th>Ward</th>
                  <Th label="Status" col="status" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(r)}>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>#{r.id}</td>
                    <td style={{ fontWeight: 500 }}>
                      {r.child}
                      {codes[r.id] && <Ticket size={13} style={{ color: 'var(--pm-primary)', marginLeft: 6, verticalAlign: 'middle' }} title="Certificate reserved" />}
                    </td>
                    <td>{r.sex === 'F' ? 'Female' : 'Male'}</td>
                    <td style={{ color: 'var(--pm-text-muted)', whiteSpace: 'nowrap' }}>{formatDate(r.dob)}</td>
                    <td style={{ color: 'var(--pm-text-muted)' }}>{r.ward}</td>
                    <td><StatusBadge s={r.status} /></td>
                    <td>
                      <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={(e) => { e.stopPropagation(); setSelected(r); }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: 14, fontSize: '0.75rem', color: 'var(--pm-text-muted)' }}>
          Showing {filtered.length} of {RECORDS.length} records
        </div>
      </div>

      <RecordModal
        record={selected}
        code={selected ? codes[selected.id] : null}
        onGenerate={generateCode}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}