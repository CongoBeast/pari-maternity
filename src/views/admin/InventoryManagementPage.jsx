import React, { useState, useMemo, useRef } from 'react';
import {
  Package, BedDouble, Blinds, Table2, MonitorSmartphone, Armchair,
  Boxes, Search, X, ScanLine, ArrowRight, ChevronLeft, Printer,
  Edit2, Wrench, MapPin, AlertTriangle, CheckCircle, Clock,
  DollarSign, ShieldCheck, History, Camera, Plus, Download, QrCode,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_CFG = {
  bed:         { label: 'Beds & Cots',     icon: BedDouble,         color: '#6366f1' },
  curtain:     { label: 'Curtains & Blinds', icon: Blinds,          color: '#0d9488' },
  table:       { label: 'Tables & Trolleys', icon: Table2,          color: '#d97706' },
  electronic:  { label: 'Electronics',     icon: MonitorSmartphone, color: '#0284c7' },
  chair:       { label: 'Chairs & Seating', icon: Armchair,         color: '#ec4899' },
  furniture:   { label: 'Furniture',       icon: Boxes,             color: '#7c3aed' },
};

const STATUS_CFG = {
  'in-service':  { cls: 'pm-badge-success', label: 'In Service',     color: '#16a34a' },
  'maintenance': { cls: 'pm-badge-warning', label: 'Due Maintenance', color: '#d97706' },
  'repair':      { cls: 'pm-badge-info',    label: 'In Repair',      color: '#0284c7' },
  'storage':     { cls: 'pm-badge-neutral', label: 'In Storage',     color: '#64748b' },
  'condemned':   { cls: 'pm-badge-danger',  label: 'Condemned',      color: '#dc2626' },
};

const CONDITION_CFG = {
  excellent: { label: 'Excellent', color: '#16a34a' },
  good:      { label: 'Good',      color: '#0d9488' },
  fair:      { label: 'Fair',      color: '#d97706' },
  poor:      { label: 'Poor',      color: '#dc2626' },
};

const LOCATIONS = [
  'all',
  'Ground Floor', 'First Floor', 'Second Floor', 'Third Floor', 'Central Store',
];

// ─────────────────────────────────────────────────────────────────────────────
// INVENTORY DATA — Parirenyatwa Group of Hospitals · Maternity Unit
// Every asset carries a scannable barcode (Code-128 style asset tag).
// ─────────────────────────────────────────────────────────────────────────────

const INVENTORY = [
  // ── BEDS & COTS ──
  { id: 'AST-00118', barcode: 'PGH-MAT-00118', category: 'bed', name: 'Electric Delivery Bed', model: 'Hill-Rom Affinity 4', manufacturer: 'Hill-Rom', serial: 'HR-AFF-77231', status: 'in-service', condition: 'good', floor: 'First Floor', location: 'Delivery Room 3', purchased: '2021-04-12', value: 14500, warranty: '2026-04-11', lastService: '2025-11-02', nextService: '2026-05-02',
    history: [ { date: '2025-11-02', type: 'Service', by: 'Biomed — T. Ncube', note: 'Hydraulic check, lubricated rails, all OK.' }, { date: '2025-05-08', type: 'Service', by: 'Biomed — T. Ncube', note: 'Replaced side-rail latch.' } ] },
  { id: 'AST-00119', barcode: 'PGH-MAT-00119', category: 'bed', name: 'Electric Delivery Bed', model: 'Hill-Rom Affinity 4', manufacturer: 'Hill-Rom', serial: 'HR-AFF-77232', status: 'repair', condition: 'fair', floor: 'First Floor', location: 'Delivery Room 4', purchased: '2021-04-12', value: 14500, warranty: '2026-04-11', lastService: '2025-12-01', nextService: '—',
    history: [ { date: '2026-01-14', type: 'Fault', by: 'Sr. Anesu Maposa', note: 'Foot section motor not responding. Logged for repair.' } ] },
  { id: 'AST-00204', barcode: 'PGH-MAT-00204', category: 'bed', name: 'Infant Bassinet / Cot', model: 'Drive Medical 19000', manufacturer: 'Drive Medical', serial: 'DM-19000-4412', status: 'in-service', condition: 'excellent', floor: 'Third Floor', location: 'Postnatal Ward A', purchased: '2023-06-20', value: 480, warranty: '2026-06-19', lastService: '2025-10-15', nextService: '2026-04-15',
    history: [ { date: '2025-10-15', type: 'Inspection', by: 'Biomed — R. Banda', note: 'Wheels and brakes verified.' } ] },
  { id: 'AST-00231', barcode: 'PGH-MAT-00231', category: 'bed', name: 'KMC Reclining Bed', model: 'Custom KMC Unit', manufacturer: 'MedFurnish ZW', serial: 'MF-KMC-0091', status: 'in-service', condition: 'good', floor: 'Second Floor', location: 'KMC Unit', purchased: '2022-09-01', value: 2100, warranty: 'Expired', lastService: '2025-09-30', nextService: '2026-03-30',
    history: [ { date: '2025-09-30', type: 'Service', by: 'Biomed — R. Banda', note: 'Reupholstered headrest.' } ] },
  { id: 'AST-00302', barcode: 'PGH-MAT-00302', category: 'bed', name: 'Examination Couch', model: 'Seers Clinnova', manufacturer: 'Seers Medical', serial: 'SM-CLN-3320', status: 'in-service', condition: 'good', floor: 'Ground Floor', location: 'Antenatal Clinic', purchased: '2020-02-18', value: 950, warranty: 'Expired', lastService: '2025-08-11', nextService: '2026-02-11',
    history: [ { date: '2025-08-11', type: 'Service', by: 'Biomed — T. Ncube', note: 'Gas strut replaced.' } ] },

  // ── CURTAINS & BLINDS ──
  { id: 'AST-00410', barcode: 'PGH-MAT-00410', category: 'curtain', name: 'Cubicle Privacy Curtain Set', model: 'Antimicrobial Disposable', manufacturer: 'Cliniwall', serial: 'CW-CUR-8841', status: 'in-service', condition: 'good', floor: 'Third Floor', location: 'Postnatal Ward A — Bay 1', purchased: '2025-01-10', value: 85, warranty: 'N/A', lastService: '2026-01-05', nextService: '2026-04-05',
    history: [ { date: '2026-01-05', type: 'Replacement', by: 'Housekeeping', note: 'Curtains swapped per 90-day infection-control cycle.' } ] },
  { id: 'AST-00411', barcode: 'PGH-MAT-00411', category: 'curtain', name: 'Cubicle Privacy Curtain Set', model: 'Antimicrobial Disposable', manufacturer: 'Cliniwall', serial: 'CW-CUR-8842', status: 'maintenance', condition: 'fair', floor: 'Third Floor', location: 'Postnatal Ward A — Bay 2', purchased: '2024-10-02', value: 85, warranty: 'N/A', lastService: '2025-10-02', nextService: '2026-01-02',
    history: [ { date: '2025-10-02', type: 'Replacement', by: 'Housekeeping', note: 'Due for 90-day swap — overdue, flagged.' } ] },
  { id: 'AST-00425', barcode: 'PGH-MAT-00425', category: 'curtain', name: 'Window Blinds — Vertical', model: 'PVC Blackout', manufacturer: 'Blindcraft', serial: 'BC-VRT-2210', status: 'in-service', condition: 'good', floor: 'First Floor', location: 'Recovery Room 2', purchased: '2022-03-15', value: 140, warranty: 'Expired', lastService: '2025-07-20', nextService: '2026-07-20',
    history: [ { date: '2025-07-20', type: 'Inspection', by: 'Maintenance', note: 'Cords and slats intact.' } ] },

  // ── TABLES & TROLLEYS ──
  { id: 'AST-00510', barcode: 'PGH-MAT-00510', category: 'table', name: 'Overbed Table', model: 'Bristol Maid Tilt-Top', manufacturer: 'Bristol Maid', serial: 'BM-OBT-5510', status: 'in-service', condition: 'good', floor: 'Third Floor', location: 'Postnatal Ward A', purchased: '2021-11-09', value: 320, warranty: 'Expired', lastService: '2025-06-14', nextService: '2026-06-14',
    history: [ { date: '2025-06-14', type: 'Service', by: 'Maintenance', note: 'Castor wheel replaced.' } ] },
  { id: 'AST-00522', barcode: 'PGH-MAT-00522', category: 'table', name: 'Stainless Instrument Trolley', model: 'Pedigo CDS-148', manufacturer: 'Pedigo', serial: 'PG-CDS-9087', status: 'in-service', condition: 'excellent', floor: 'First Floor', location: 'Operating Room 1', purchased: '2023-02-01', value: 690, warranty: '2026-01-31', lastService: '2025-12-20', nextService: '2026-06-20',
    history: [ { date: '2025-12-20', type: 'Inspection', by: 'Theatre Sister', note: 'Deep clean, all clear.' } ] },
  { id: 'AST-00531', barcode: 'PGH-MAT-00531', category: 'table', name: 'Resuscitaire Trolley', model: 'Dräger Babyleo (frame)', manufacturer: 'Dräger', serial: 'DR-RES-3344', status: 'maintenance', condition: 'good', floor: 'First Floor', location: 'Delivery Room 2', purchased: '2022-07-30', value: 1850, warranty: '2025-07-29', lastService: '2025-08-01', nextService: '2026-02-01',
    history: [ { date: '2025-08-01', type: 'Service', by: 'Biomed — T. Ncube', note: 'Heater element due for inspection Feb 2026.' } ] },

  // ── ELECTRONICS ──
  { id: 'AST-00610', barcode: 'PGH-MAT-00610', category: 'electronic', name: 'Fetal Monitor (CTG)', model: 'Philips Avalon FM30', manufacturer: 'Philips', serial: 'PH-FM30-2201', status: 'in-service', condition: 'good', floor: 'First Floor', location: 'Delivery Room 3', purchased: '2021-05-18', value: 8900, warranty: '2026-05-17', lastService: '2025-11-10', nextService: '2026-05-10',
    history: [ { date: '2025-11-10', type: 'Calibration', by: 'Biomed — T. Ncube', note: 'Transducers recalibrated, printer ribbon replaced.' } ] },
  { id: 'AST-00611', barcode: 'PGH-MAT-00611', category: 'electronic', name: 'Fetal Monitor (CTG)', model: 'Philips Avalon FM30', manufacturer: 'Philips', serial: 'PH-FM30-2202', status: 'repair', condition: 'fair', floor: 'First Floor', location: 'Delivery Room 4', purchased: '2021-05-18', value: 8900, warranty: '2026-05-17', lastService: '2025-11-10', nextService: '—',
    history: [ { date: '2026-01-12', type: 'Fault', by: 'Sr. Anesu Maposa', note: 'Intermittent display flicker — logged with biomed.' } ] },
  { id: 'AST-00620', barcode: 'PGH-MAT-00620', category: 'electronic', name: 'Infant Radiant Warmer', model: 'GE Lullaby Warmer', manufacturer: 'GE Healthcare', serial: 'GE-LUL-7741', status: 'in-service', condition: 'excellent', floor: 'Second Floor', location: 'NICU', purchased: '2023-08-22', value: 11200, warranty: '2026-08-21', lastService: '2025-12-05', nextService: '2026-06-05',
    history: [ { date: '2025-12-05', type: 'Calibration', by: 'Biomed — R. Banda', note: 'Skin-temp probe verified within tolerance.' } ] },
  { id: 'AST-00625', barcode: 'PGH-MAT-00625', category: 'electronic', name: 'Phototherapy Unit', model: 'Natus neoBLUE LED', manufacturer: 'Natus', serial: 'NT-NEO-5510', status: 'in-service', condition: 'good', floor: 'Second Floor', location: 'NICU', purchased: '2022-11-14', value: 3400, warranty: 'Expired', lastService: '2025-10-01', nextService: '2026-04-01',
    history: [ { date: '2025-10-01', type: 'Service', by: 'Biomed — R. Banda', note: 'LED output measured at 92% — within spec.' } ] },
  { id: 'AST-00640', barcode: 'PGH-MAT-00640', category: 'electronic', name: 'Vital Signs Monitor', model: 'Mindray uMEC12', manufacturer: 'Mindray', serial: 'MR-UMEC-3120', status: 'in-service', condition: 'good', floor: 'First Floor', location: 'Recovery Room 1', purchased: '2022-01-30', value: 2600, warranty: 'Expired', lastService: '2025-09-18', nextService: '2026-03-18',
    history: [ { date: '2025-09-18', type: 'Calibration', by: 'Biomed — T. Ncube', note: 'NIBP and SpO2 calibrated.' } ] },
  { id: 'AST-00655', barcode: 'PGH-MAT-00655', category: 'electronic', name: 'Volumetric Infusion Pump', model: 'B.Braun Infusomat', manufacturer: 'B.Braun', serial: 'BB-INF-6602', status: 'storage', condition: 'good', floor: 'Central Store', location: 'Biomed Store — Shelf C3', purchased: '2021-09-05', value: 1450, warranty: 'Expired', lastService: '2025-12-22', nextService: '2026-06-22',
    history: [ { date: '2025-12-22', type: 'Service', by: 'Biomed — R. Banda', note: 'Serviced and returned to spare pool.' } ] },
  { id: 'AST-00670', barcode: 'PGH-MAT-00670', category: 'electronic', name: 'Lobby Information Display', model: 'Samsung QM43R', manufacturer: 'Samsung', serial: 'SS-QM43-9981', status: 'in-service', condition: 'excellent', floor: 'Ground Floor', location: 'Main Lobby', purchased: '2024-03-12', value: 720, warranty: '2027-03-11', lastService: '2025-06-01', nextService: '2026-06-01',
    history: [ { date: '2025-06-01', type: 'Inspection', by: 'IT', note: 'Firmware updated, mount checked.' } ] },
  { id: 'AST-00671', barcode: 'PGH-MAT-00671', category: 'electronic', name: 'Delivery Wing Display', model: 'Samsung QM43R', manufacturer: 'Samsung', serial: 'SS-QM43-9982', status: 'condemned', condition: 'poor', floor: 'First Floor', location: 'Delivery Wing Corridor', purchased: '2020-08-20', value: 720, warranty: 'Expired', lastService: '2025-09-30', nextService: '—',
    history: [ { date: '2026-01-08', type: 'Fault', by: 'Maintenance', note: 'Panel failure — beyond economic repair, marked for disposal.' } ] },

  // ── CHAIRS & SEATING ──
  { id: 'AST-00710', barcode: 'PGH-MAT-00710', category: 'chair', name: 'Wheelchair — Standard', model: 'Karma Aero X', manufacturer: 'Karma', serial: 'KM-AERO-1180', status: 'in-service', condition: 'good', floor: 'Ground Floor', location: 'Admissions', purchased: '2022-05-10', value: 280, warranty: 'Expired', lastService: '2025-11-15', nextService: '2026-05-15',
    history: [ { date: '2025-11-15', type: 'Service', by: 'Maintenance', note: 'Tyres inflated, brakes adjusted.' } ] },
  { id: 'AST-00720', barcode: 'PGH-MAT-00720', category: 'chair', name: 'Birthing Stool', model: 'Wooden Adjustable', manufacturer: 'MedFurnish ZW', serial: 'MF-BST-0042', status: 'in-service', condition: 'good', floor: 'First Floor', location: 'Delivery Room 1', purchased: '2023-01-19', value: 160, warranty: 'N/A', lastService: '2025-08-08', nextService: '2026-08-08',
    history: [ { date: '2025-08-08', type: 'Inspection', by: 'Maintenance', note: 'Joints and finish inspected.' } ] },
  { id: 'AST-00735', barcode: 'PGH-MAT-00735', category: 'chair', name: 'Recliner — Maternity', model: 'Champion 56 Series', manufacturer: 'Champion', serial: 'CH-56-3309', status: 'in-service', condition: 'fair', floor: 'Third Floor', location: 'Postnatal Ward B', purchased: '2020-12-01', value: 540, warranty: 'Expired', lastService: '2025-07-02', nextService: '2026-07-02',
    history: [ { date: '2025-07-02', type: 'Service', by: 'Maintenance', note: 'Recline mechanism stiff — monitor.' } ] },
  { id: 'AST-00750', barcode: 'PGH-MAT-00750', category: 'chair', name: 'Waiting Area Bench (4-seat)', model: 'Steel Beam Seating', manufacturer: 'Blindcraft', serial: 'BC-BEN-7720', status: 'in-service', condition: 'good', floor: 'Ground Floor', location: 'ANC Waiting Area', purchased: '2021-02-22', value: 410, warranty: 'Expired', lastService: '2025-05-19', nextService: '2026-05-19',
    history: [ { date: '2025-05-19', type: 'Inspection', by: 'Maintenance', note: 'Bolts tightened.' } ] },

  // ── FURNITURE ──
  { id: 'AST-00810', barcode: 'PGH-MAT-00810', category: 'furniture', name: 'Bedside Locker Cabinet', model: 'Bristol Maid Classic', manufacturer: 'Bristol Maid', serial: 'BM-LCK-4420', status: 'in-service', condition: 'good', floor: 'Third Floor', location: 'Postnatal Ward A', purchased: '2021-11-09', value: 230, warranty: 'Expired', lastService: '2025-06-14', nextService: '2026-06-14',
    history: [ { date: '2025-06-14', type: 'Inspection', by: 'Maintenance', note: 'Drawer runners cleaned.' } ] },
  { id: 'AST-00822', barcode: 'PGH-MAT-00822', category: 'furniture', name: 'Medicine Storage Cabinet (locked)', model: 'Pharma-Secure 2D', manufacturer: 'MedFurnish ZW', serial: 'MF-MED-0151', status: 'in-service', condition: 'excellent', floor: 'First Floor', location: "Nurses' Station — 1F", purchased: '2023-04-04', value: 880, warranty: '2026-04-03', lastService: '2025-12-10', nextService: '2026-06-10',
    history: [ { date: '2025-12-10', type: 'Inspection', by: 'Pharmacy', note: 'Lock and audit log verified.' } ] },
  { id: 'AST-00830', barcode: 'PGH-MAT-00830', category: 'furniture', name: 'Mobile IV Drip Stand', model: 'Stainless 5-Hook', manufacturer: 'Drive Medical', serial: 'DM-IVS-2290', status: 'maintenance', condition: 'fair', floor: 'Second Floor', location: 'NICU', purchased: '2020-06-15', value: 95, warranty: 'Expired', lastService: '2025-09-01', nextService: '2025-12-01',
    history: [ { date: '2025-09-01', type: 'Service', by: 'Maintenance', note: 'Base wobble — castor due for replacement.' } ] },
  { id: 'AST-00845', barcode: 'PGH-MAT-00845', category: 'furniture', name: 'Records Filing Cabinet', model: '4-Drawer Steel', manufacturer: 'Blindcraft', serial: 'BC-FIL-1102', status: 'storage', condition: 'good', floor: 'Central Store', location: 'Records Archive', purchased: '2019-10-10', value: 210, warranty: 'Expired', lastService: '2025-04-12', nextService: '2026-04-12',
    history: [ { date: '2025-04-12', type: 'Inspection', by: 'Maintenance', note: 'Relocated to archive store.' } ] },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function money(n) {
  return '$' + n.toLocaleString('en-US');
}

// Deterministic Code-128-style barcode rendered as SVG bars from a string.
function Barcode({ value, height = 64, scale = 2 }) {
  const bars = useMemo(() => {
    // Build a stable bit pattern from the string's char codes.
    let bits = '';
    for (let i = 0; i < value.length; i++) {
      const c = value.charCodeAt(i);
      bits += (c % 8 + 1).toString(2).padStart(4, '0');
      bits += ((c * 3) % 8 + 1).toString(2).padStart(4, '0');
    }
    // Frame it like a real symbol (quiet zone + guard bars).
    bits = '1101' + bits + '1011';
    const out = [];
    let x = 0;
    let run = bits[0];
    let len = 0;
    for (let i = 0; i <= bits.length; i++) {
      if (bits[i] === run) { len++; continue; }
      const w = ((len % 3) + 1) * scale; // 1–3 module widths
      if (run === '1') out.push({ x, w });
      x += w;
      run = bits[i];
      len = 1;
    }
    return { out, total: x };
  }, [value, scale]);

  return (
    <div style={{ display: 'inline-block', background: '#fff', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--pm-border)' }}>
      <svg width="100%" viewBox={`0 0 ${bars.total} ${height}`} preserveAspectRatio="none" style={{ display: 'block', maxWidth: 320 }}>
        {bars.out.map((b, i) => (
          <rect key={i} x={b.x} y={0} width={b.w} height={height} fill="#0f172a" />
        ))}
      </svg>
      <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '0.8rem', letterSpacing: '0.18em', marginTop: 6, color: '#0f172a', fontWeight: 700 }}>
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_CFG[status];
  return <span className={`pm-badge ${s.cls}`} style={{ fontSize: '0.68rem' }}>{s.label}</span>;
}

function ConditionDot({ condition }) {
  const c = CONDITION_CFG[condition];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 600, color: c.color }}>
      <span style={{ width: 9, height: 9, borderRadius: '50%', background: c.color }} />
      {c.label}
    </span>
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

// ─────────────────────────────────────────────────────────────────────────────
// ITEM DETAIL  (what a scanned barcode resolves to)
// ─────────────────────────────────────────────────────────────────────────────

function ItemDetail({ item, onBack, scanned }) {
  const cat = CATEGORY_CFG[item.category];
  const CatIcon = cat.icon;
  const overdue = item.nextService !== '—' && item.nextService < '2026-06-09';

  return (
    <div>
      <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={onBack} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <ChevronLeft size={16} /> Back to Inventory
      </button>

      {scanned && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: '0.8rem', fontWeight: 600 }}>
          <ScanLine size={15} /> Barcode <strong>{item.barcode}</strong> scanned successfully — asset matched.
        </div>
      )}

      {/* Header card */}
      <div className="pm-card" style={{ marginBottom: 16, padding: '18px 20px', borderLeft: `4px solid ${cat.color}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap' }}>
          <div style={{ width: 58, height: 58, borderRadius: 12, background: `${cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CatIcon size={30} style={{ color: cat.color }} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{item.name}</span>
              <StatusBadge status={item.status} />
              <ConditionDot condition={item.condition} />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--pm-text-muted)', marginBottom: 6 }}>{cat.label} · {item.manufacturer} {item.model}</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Package size={13} /> {item.id}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {item.floor} · {item.location}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><DollarSign size={13} /> {money(item.value)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
            <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Edit2 size={13} /> Edit</button>
            <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Printer size={13} /> Print Label</button>
            <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={13} /> Move / Reassign</button>
            <button className="pm-btn pm-btn-sm" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: 5 }}><Wrench size={13} /> Log Fault</button>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* LEFT — barcode + asset facts */}
        <div className="col-12 col-xl-5 d-flex flex-column gap-3">
          <div className="pm-card">
            <div className="pm-section-title" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <QrCode size={15} /> Asset Barcode
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <Barcode value={item.barcode} />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', textAlign: 'center' }}>
              Scan at any ward terminal to pull up this record.
            </div>
          </div>

          <div className="pm-card">
            <div className="pm-section-title" style={{ marginBottom: 8 }}>Identification</div>
            <InfoGrid rows={[
              { label: 'Asset Tag', value: item.id },
              { label: 'Barcode', value: item.barcode },
              { label: 'Category', value: cat.label },
              { label: 'Manufacturer', value: item.manufacturer },
              { label: 'Model', value: item.model },
              { label: 'Serial No.', value: item.serial },
            ]} />
          </div>
        </div>

        {/* RIGHT — lifecycle + history */}
        <div className="col-12 col-xl-7 d-flex flex-column gap-3">
          <div className="pm-card">
            <div className="pm-section-title" style={{ marginBottom: 8 }}>Lifecycle & Service</div>
            <InfoGrid rows={[
              { label: 'Status', value: <StatusBadge status={item.status} /> },
              { label: 'Condition', value: <ConditionDot condition={item.condition} /> },
              { label: 'Location', value: `${item.floor} · ${item.location}` },
              { label: 'Purchased', value: item.purchased },
              { label: 'Value', value: money(item.value) },
              { label: 'Warranty', value: item.warranty },
              { label: 'Last Service', value: item.lastService },
              { label: 'Next Service', value: (
                <span style={{ color: overdue ? '#dc2626' : 'inherit', fontWeight: overdue ? 700 : 500 }}>
                  {item.nextService} {overdue && '· OVERDUE'}
                </span>
              ) },
            ]} />
          </div>

          <div className="pm-card">
            <div className="pm-section-title" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <History size={15} /> Maintenance History
            </div>
            {item.history.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: i < item.history.length - 1 ? '1px solid var(--pm-border)' : 'none' }}>
                <div style={{ width: 6, borderRadius: 3, background: 'var(--pm-border)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{h.type}</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--pm-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} /> {h.date}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', marginBottom: 2 }}>{h.note}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', fontStyle: 'italic' }}>— {h.by}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCAN BOX  (type or scan a barcode to jump straight to an asset)
// ─────────────────────────────────────────────────────────────────────────────

function ScanBox({ onResolve }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const submit = (raw) => {
    const code = (raw ?? value).trim().toUpperCase();
    if (!code) return;
    const hit = INVENTORY.find(i => i.barcode.toUpperCase() === code || i.id.toUpperCase() === code);
    if (hit) { setError(''); setValue(''); onResolve(hit); }
    else setError(`No asset found for "${code}"`);
  };

  return (
    <div className="pm-card" style={{ marginBottom: 16, borderLeft: '3px solid #0284c7' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ScanLine size={24} style={{ color: '#0284c7' }} />
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>Scan a Barcode</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)' }}>
            Point the handheld scanner at an asset label, or type the barcode and press Enter.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 260 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <ScanLine size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)' }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="e.g. PGH-MAT-00610"
              value={value}
              onChange={e => { setValue(e.target.value); setError(''); }}
              onKeyDown={e => { if (e.key === 'Enter') submit(); }}
              style={{ width: '100%', padding: '9px 12px 9px 36px', border: `1px solid ${error ? '#fca5a5' : 'var(--pm-border)'}`, borderRadius: 8, background: 'var(--pm-surface-2)', fontSize: '0.85rem', fontFamily: 'monospace', letterSpacing: '0.08em', outline: 'none', color: 'var(--pm-text)', boxSizing: 'border-box' }}
            />
          </div>
          <button className="pm-btn pm-btn-primary pm-btn-sm" onClick={() => submit()} style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
            <Camera size={14} /> Look Up
          </button>
        </div>
      </div>
      {error && <div style={{ marginTop: 8, fontSize: '0.76rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 5 }}><AlertTriangle size={13} /> {error}</div>}
      <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>Try:</span>
        {['PGH-MAT-00610', 'PGH-MAT-00118', 'PGH-MAT-00620'].map(code => (
          <button key={code} onClick={() => submit(code)} className="pm-btn pm-btn-ghost pm-btn-sm" style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '2px 8px' }}>
            {code}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function InventoryManagementPage({ user, onNavigate }) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locFilter, setLocFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [cameFromScan, setCameFromScan] = useState(false);

  const stats = useMemo(() => {
    const totalValue = INVENTORY.reduce((a, i) => a + i.value, 0);
    return {
      total: INVENTORY.length,
      inService: INVENTORY.filter(i => i.status === 'in-service').length,
      attention: INVENTORY.filter(i => i.status === 'maintenance' || i.status === 'repair').length,
      condemned: INVENTORY.filter(i => i.status === 'condemned').length,
      totalValue,
    };
  }, []);

  const catCounts = useMemo(() => {
    const m = {};
    Object.keys(CATEGORY_CFG).forEach(k => { m[k] = INVENTORY.filter(i => i.category === k).length; });
    return m;
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return INVENTORY.filter(i =>
      (i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.barcode.toLowerCase().includes(q) ||
       i.model.toLowerCase().includes(q) || i.location.toLowerCase().includes(q) || i.serial.toLowerCase().includes(q)) &&
      (catFilter === 'all' || i.category === catFilter) &&
      (statusFilter === 'all' || i.status === statusFilter) &&
      (locFilter === 'all' || i.floor === locFilter)
    );
  }, [search, catFilter, statusFilter, locFilter]);

  const openItem = (item, scanned = false) => { setCameFromScan(scanned); setSelected(item); };

  if (selected) {
    return <ItemDetail item={selected} scanned={cameFromScan} onBack={() => setSelected(null)} />;
  }

  const hasFilters = search || catFilter !== 'all' || statusFilter !== 'all' || locFilter !== 'all';

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Inventory Management</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>
            Parirenyatwa Group of Hospitals — Maternity Unit · Asset Register · Barcode-tracked
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Download size={13} /> Export
          </button>
          <button className="pm-btn pm-btn-primary pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Plus size={13} /> Add Asset
          </button>
        </div>
      </div>

      {/* Scan box */}
      <ScanBox onResolve={(item) => openItem(item, true)} />

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Assets', value: stats.total, sub: 'Registered & tagged', icon: Package, color: '#6366f1' },
          { label: 'In Service', value: stats.inService, sub: 'Operational', icon: CheckCircle, color: '#16a34a' },
          { label: 'Needs Attention', value: stats.attention, sub: 'Maintenance or repair', icon: Wrench, color: '#d97706', alert: true },
          { label: 'Condemned', value: stats.condemned, sub: 'Pending disposal', icon: AlertTriangle, color: '#dc2626', alert: true },
          { label: 'Total Asset Value', value: money(stats.totalValue), sub: 'Replacement estimate', icon: DollarSign, color: '#0d9488' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="col-6 col-md-4 col-xl">
              <div className="pm-stat-card secondary" style={{ borderLeft: `3px solid ${s.color}`, ...(s.alert ? { border: `1px solid ${s.color}`, borderLeft: `3px solid ${s.color}` } : {}) }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Icon size={18} style={{ color: s.color }} />
                  {s.alert && s.value > 0 && <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'block', boxShadow: `0 0 0 3px ${s.color}30` }} />}
                </div>
                <div className="pm-card-title" style={{ fontSize: '0.73rem' }}>{s.label}</div>
                <div className="pm-stat-value" style={{ fontSize: '1.6rem', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button onClick={() => setCatFilter('all')}
          className={`pm-btn pm-btn-sm ${catFilter === 'all' ? 'pm-btn-primary' : 'pm-btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
          <Boxes size={14} /> All Categories <span style={{ opacity: 0.7 }}>({INVENTORY.length})</span>
        </button>
        {Object.entries(CATEGORY_CFG).map(([key, c]) => {
          const Icon = c.icon;
          const active = catFilter === key;
          return (
            <button key={key} onClick={() => setCatFilter(key)}
              className={`pm-btn pm-btn-sm ${active ? '' : 'pm-btn-ghost'}`}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem',
                ...(active ? { background: c.color, color: '#fff', borderColor: c.color } : { color: c.color }) }}>
              <Icon size={14} /> {c.label} <span style={{ opacity: 0.7 }}>({catCounts[key]})</span>
            </button>
          );
        })}
      </div>

      {/* List card */}
      <div className="pm-card">
        {/* Search + filters */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)' }} />
            <input
              type="text" placeholder="Search by name, asset tag, barcode, model, serial, or location…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--pm-border)', borderRadius: 8, background: 'var(--pm-surface-2)', fontSize: '0.85rem', outline: 'none', color: 'var(--pm-text)', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[{ k: 'all', l: 'All Status' }, ...Object.entries(STATUS_CFG).map(([k, v]) => ({ k, l: v.label }))].map(f => (
                <button key={f.k} onClick={() => setStatusFilter(f.k)}
                  className={`pm-btn pm-btn-sm ${statusFilter === f.k ? 'pm-btn-primary' : 'pm-btn-ghost'}`}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                  {f.l}
                </button>
              ))}
            </div>
            <select value={locFilter} onChange={e => setLocFilter(e.target.value)} style={{
              padding: '5px 10px', border: '1px solid var(--pm-border)', borderRadius: 6,
              background: 'var(--pm-surface-2)', fontSize: '0.78rem', color: 'var(--pm-text)', cursor: 'pointer',
            }}>
              {LOCATIONS.map(l => <option key={l} value={l}>{l === 'all' ? 'All Locations' : l}</option>)}
            </select>
            {hasFilters && (
              <button className="pm-btn pm-btn-ghost pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}
                onClick={() => { setSearch(''); setCatFilter('all'); setStatusFilter('all'); setLocFilter('all'); }}>
                <X size={12} /> Clear Filters
              </button>
            )}
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginBottom: 8 }}>
          Showing {filtered.length} of {INVENTORY.length} assets
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="pm-table">
            <thead>
              <tr>
                <th>ASSET</th><th>BARCODE</th><th>CATEGORY</th><th>LOCATION</th>
                <th>CONDITION</th><th>STATUS</th><th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--pm-text-muted)' }}>
                    <Search size={28} style={{ opacity: 0.2, display: 'block', margin: '0 auto 8px' }} />
                    No assets match your search
                  </td>
                </tr>
              ) : filtered.map(item => {
                const cat = CATEGORY_CFG[item.category];
                const CatIcon = cat.icon;
                return (
                  <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => openItem(item)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: `${cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CatIcon size={17} style={{ color: cat.color }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>{item.manufacturer} {item.model}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.78rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--pm-text-muted)', letterSpacing: '0.03em' }}>{item.barcode}</td>
                    <td>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: cat.color, background: `${cat.color}15`, borderRadius: 10, padding: '2px 8px', whiteSpace: 'nowrap' }}>{cat.label}</span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', maxWidth: 180 }}>
                      <div style={{ fontWeight: 600, color: 'var(--pm-text)' }}>{item.floor}</div>
                      <div>{item.location}</div>
                    </td>
                    <td><ConditionDot condition={item.condition} /></td>
                    <td><StatusBadge status={item.status} /></td>
                    <td>
                      <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={e => { e.stopPropagation(); openItem(item); }} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}>
                        View <ArrowRight size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}