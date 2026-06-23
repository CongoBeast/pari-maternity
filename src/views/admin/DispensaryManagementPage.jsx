import React, { useState, useMemo } from 'react';
import {
  Pill, Search, X, ChevronLeft, AlertTriangle, CheckCircle, Clock,
  Package, Plus, ArrowRight, ArrowDown, ArrowUp, Truck, FileText,
  ShieldCheck, Thermometer, Eye, Filter, RefreshCw, Calendar,
  User, ClipboardList, Info, Activity, TrendingDown, Archive,
  Heart, Baby, Droplets, Syringe, Tablets, FlaskConical,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_CFG = {
  analgesic:     { label: 'Analgesics & Pain Relief',  icon: Tablets,      color: '#6366f1' },
  antibiotic:    { label: 'Antibiotics',               icon: ShieldCheck,  color: '#0d9488' },
  oxytocic:      { label: 'Oxytocics & Uterotonics',   icon: Heart,        color: '#ec4899' },
  anaesthetic:   { label: 'Anaesthetics',              icon: Syringe,      color: '#7c3aed' },
  iv_fluid:      { label: 'IV Fluids & Electrolytes',  icon: Droplets,     color: '#0284c7' },
  neonatal:      { label: 'Neonatal Medications',       icon: Baby,         color: '#f59e0b' },
  supplement:    { label: 'Vitamins & Supplements',     icon: FlaskConical, color: '#16a34a' },
  antiseptic:    { label: 'Antiseptics & Disinfectants',icon: Thermometer,  color: '#d97706' },
  emergency:     { label: 'Emergency & Resuscitation',  icon: Activity,     color: '#dc2626' },
  contraceptive: { label: 'Contraceptives & FP',        icon: Pill,         color: '#64748b' },
};

const STOCK_LEVEL_CFG = {
  critical:    { label: 'Critical',      color: '#dc2626', bg: '#fee2e2', cls: 'pm-badge-danger'  },
  low:         { label: 'Low Stock',     color: '#d97706', bg: '#fef3c7', cls: 'pm-badge-warning' },
  adequate:    { label: 'Adequate',      color: '#0284c7', bg: '#dbeafe', cls: 'pm-badge-info'    },
  well_stocked:{ label: 'Well Stocked',  color: '#16a34a', bg: '#dcfce7', cls: 'pm-badge-success' },
};

const REQUEST_STATUS_CFG = {
  pending:   { label: 'Pending Approval', color: '#d97706', bg: '#fef3c7', cls: 'pm-badge-warning' },
  approved:  { label: 'Approved',         color: '#0284c7', bg: '#dbeafe', cls: 'pm-badge-info'    },
  ordered:   { label: 'Ordered',          color: '#7c3aed', bg: '#f3e8ff', cls: 'pm-badge-info'    },
  shipped:   { label: 'In Transit',       color: '#0d9488', bg: '#ccfbf1', cls: 'pm-badge-info'    },
  delivered: { label: 'Delivered',        color: '#16a34a', bg: '#dcfce7', cls: 'pm-badge-success' },
  rejected:  { label: 'Rejected',        color: '#dc2626', bg: '#fee2e2', cls: 'pm-badge-danger'  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MEDICATION DATA — Parirenyatwa Group of Hospitals · Maternity Dispensary
// ─────────────────────────────────────────────────────────────────────────────

const MEDICATIONS = [
  // ── ANALGESICS ──
  { id: 'MED-001', name: 'Paracetamol Tablets',        generic: 'Acetaminophen', strength: '500mg', form: 'Tablet', category: 'analgesic', qty: 2400, minQty: 500, maxQty: 5000, unit: 'tabs', batchNo: 'PCM-2026-0418', expiry: '2027-08-15', supplier: 'Varichem Pharmaceuticals', location: 'Shelf A1', controlled: false, lastRestock: '2026-05-10', dispensedToday: 86 },
  { id: 'MED-002', name: 'Ibuprofen Tablets',          generic: 'Ibuprofen', strength: '400mg', form: 'Tablet', category: 'analgesic', qty: 1800, minQty: 400, maxQty: 4000, unit: 'tabs', batchNo: 'IBU-2026-0322', expiry: '2027-06-30', supplier: 'Datlabs', location: 'Shelf A1', controlled: false, lastRestock: '2026-04-18', dispensedToday: 42 },
  { id: 'MED-003', name: 'Pethidine Injection',        generic: 'Meperidine', strength: '100mg/2ml', form: 'Ampoule', category: 'analgesic', qty: 28, minQty: 40, maxQty: 120, unit: 'amps', batchNo: 'PTH-2025-1105', expiry: '2027-01-20', supplier: 'CAPS Holdings', location: 'Controlled Cabinet C1', controlled: true, lastRestock: '2026-03-22', dispensedToday: 4 },
  { id: 'MED-004', name: 'Tramadol Capsules',          generic: 'Tramadol HCl', strength: '50mg', form: 'Capsule', category: 'analgesic', qty: 85, minQty: 100, maxQty: 400, unit: 'caps', batchNo: 'TRM-2026-0201', expiry: '2027-11-10', supplier: 'Varichem Pharmaceuticals', location: 'Controlled Cabinet C1', controlled: true, lastRestock: '2026-04-05', dispensedToday: 8 },
  { id: 'MED-005', name: 'Diclofenac Sodium Injection', generic: 'Diclofenac', strength: '75mg/3ml', form: 'Ampoule', category: 'analgesic', qty: 310, minQty: 100, maxQty: 600, unit: 'amps', batchNo: 'DCF-2026-0515', expiry: '2028-02-28', supplier: 'Datlabs', location: 'Shelf A2', controlled: false, lastRestock: '2026-05-20', dispensedToday: 12 },

  // ── ANTIBIOTICS ──
  { id: 'MED-010', name: 'Amoxicillin Capsules',       generic: 'Amoxicillin', strength: '500mg', form: 'Capsule', category: 'antibiotic', qty: 1600, minQty: 500, maxQty: 3000, unit: 'caps', batchNo: 'AMX-2026-0412', expiry: '2027-09-22', supplier: 'Varichem Pharmaceuticals', location: 'Shelf B1', controlled: false, lastRestock: '2026-05-01', dispensedToday: 36 },
  { id: 'MED-011', name: 'Metronidazole IV Infusion',  generic: 'Metronidazole', strength: '500mg/100ml', form: 'Bag', category: 'antibiotic', qty: 45, minQty: 30, maxQty: 100, unit: 'bags', batchNo: 'MTZ-2026-0228', expiry: '2027-05-15', supplier: 'CAPS Holdings', location: 'Shelf B2', controlled: false, lastRestock: '2026-04-14', dispensedToday: 6 },
  { id: 'MED-012', name: 'Ceftriaxone Injection',      generic: 'Ceftriaxone', strength: '1g', form: 'Vial', category: 'antibiotic', qty: 12, minQty: 50, maxQty: 200, unit: 'vials', batchNo: 'CFX-2025-1018', expiry: '2027-03-10', supplier: 'Datlabs', location: 'Shelf B2', controlled: false, lastRestock: '2026-02-28', dispensedToday: 5 },
  { id: 'MED-013', name: 'Erythromycin Tablets',       generic: 'Erythromycin', strength: '250mg', form: 'Tablet', category: 'antibiotic', qty: 680, minQty: 200, maxQty: 1200, unit: 'tabs', batchNo: 'ERY-2026-0330', expiry: '2027-07-18', supplier: 'Varichem Pharmaceuticals', location: 'Shelf B1', controlled: false, lastRestock: '2026-04-20', dispensedToday: 16 },
  { id: 'MED-014', name: 'Gentamicin Injection',       generic: 'Gentamicin', strength: '80mg/2ml', form: 'Ampoule', category: 'antibiotic', qty: 92, minQty: 60, maxQty: 200, unit: 'amps', batchNo: 'GEN-2026-0508', expiry: '2028-01-25', supplier: 'CAPS Holdings', location: 'Shelf B2', controlled: false, lastRestock: '2026-05-12', dispensedToday: 8 },

  // ── OXYTOCICS ──
  { id: 'MED-020', name: 'Oxytocin Injection',         generic: 'Oxytocin', strength: '10 IU/ml', form: 'Ampoule', category: 'oxytocic', qty: 18, minQty: 60, maxQty: 200, unit: 'amps', batchNo: 'OXY-2026-0305', expiry: '2027-02-14', supplier: 'CAPS Holdings', location: 'Fridge R1', controlled: false, lastRestock: '2026-03-10', dispensedToday: 9 },
  { id: 'MED-021', name: 'Misoprostol Tablets',        generic: 'Misoprostol', strength: '200mcg', form: 'Tablet', category: 'oxytocic', qty: 340, minQty: 150, maxQty: 800, unit: 'tabs', batchNo: 'MSP-2026-0422', expiry: '2027-10-08', supplier: 'Varichem Pharmaceuticals', location: 'Shelf D1', controlled: false, lastRestock: '2026-05-05', dispensedToday: 14 },
  { id: 'MED-022', name: 'Ergometrine Injection',      generic: 'Ergometrine maleate', strength: '0.5mg/ml', form: 'Ampoule', category: 'oxytocic', qty: 35, minQty: 40, maxQty: 120, unit: 'amps', batchNo: 'ERG-2026-0118', expiry: '2027-04-20', supplier: 'Datlabs', location: 'Fridge R1', controlled: false, lastRestock: '2026-02-15', dispensedToday: 3 },

  // ── ANAESTHETICS ──
  { id: 'MED-030', name: 'Lidocaine Injection',        generic: 'Lignocaine', strength: '2% (20ml)', form: 'Vial', category: 'anaesthetic', qty: 180, minQty: 80, maxQty: 300, unit: 'vials', batchNo: 'LDC-2026-0410', expiry: '2028-03-22', supplier: 'CAPS Holdings', location: 'Shelf C2', controlled: false, lastRestock: '2026-05-08', dispensedToday: 6 },
  { id: 'MED-031', name: 'Bupivacaine Injection',      generic: 'Bupivacaine HCl', strength: '0.5% (20ml)', form: 'Vial', category: 'anaesthetic', qty: 52, minQty: 40, maxQty: 150, unit: 'vials', batchNo: 'BPV-2026-0320', expiry: '2027-12-15', supplier: 'Datlabs', location: 'Shelf C2', controlled: false, lastRestock: '2026-04-22', dispensedToday: 3 },
  { id: 'MED-032', name: 'Ketamine Injection',         generic: 'Ketamine HCl', strength: '500mg/10ml', form: 'Vial', category: 'anaesthetic', qty: 8, minQty: 20, maxQty: 60, unit: 'vials', batchNo: 'KET-2025-1208', expiry: '2027-06-10', supplier: 'CAPS Holdings', location: 'Controlled Cabinet C2', controlled: true, lastRestock: '2026-01-18', dispensedToday: 2 },

  // ── IV FLUIDS ──
  { id: 'MED-040', name: 'Normal Saline',              generic: 'Sodium Chloride', strength: '0.9% (1L)', form: 'Bag', category: 'iv_fluid', qty: 220, minQty: 100, maxQty: 500, unit: 'bags', batchNo: 'NS-2026-0505', expiry: '2028-05-01', supplier: 'Datlabs', location: 'Store S1', controlled: false, lastRestock: '2026-05-18', dispensedToday: 18 },
  { id: 'MED-041', name: 'Ringers Lactate',            generic: 'Ringer Lactate', strength: '1L', form: 'Bag', category: 'iv_fluid', qty: 155, minQty: 80, maxQty: 400, unit: 'bags', batchNo: 'RL-2026-0428', expiry: '2028-04-15', supplier: 'Datlabs', location: 'Store S1', controlled: false, lastRestock: '2026-05-10', dispensedToday: 14 },
  { id: 'MED-042', name: 'Dextrose 5% in Water',      generic: 'Dextrose', strength: '5% (1L)', form: 'Bag', category: 'iv_fluid', qty: 98, minQty: 60, maxQty: 300, unit: 'bags', batchNo: 'D5W-2026-0312', expiry: '2028-02-20', supplier: 'CAPS Holdings', location: 'Store S1', controlled: false, lastRestock: '2026-04-25', dispensedToday: 8 },

  // ── NEONATAL ──
  { id: 'MED-050', name: 'Vitamin K1 Injection',       generic: 'Phytomenadione', strength: '1mg/0.5ml', form: 'Ampoule', category: 'neonatal', qty: 42, minQty: 80, maxQty: 250, unit: 'amps', batchNo: 'VK1-2026-0218', expiry: '2027-08-30', supplier: 'Varichem Pharmaceuticals', location: 'Fridge R2', controlled: false, lastRestock: '2026-03-05', dispensedToday: 7 },
  { id: 'MED-051', name: 'Gentamicin Eye Drops',       generic: 'Gentamicin', strength: '0.3%', form: 'Bottle', category: 'neonatal', qty: 65, minQty: 30, maxQty: 100, unit: 'btls', batchNo: 'GED-2026-0415', expiry: '2027-04-10', supplier: 'Datlabs', location: 'Shelf E1', controlled: false, lastRestock: '2026-04-28', dispensedToday: 6 },
  { id: 'MED-052', name: 'Caffeine Citrate Injection', generic: 'Caffeine Citrate', strength: '20mg/ml', form: 'Vial', category: 'neonatal', qty: 15, minQty: 20, maxQty: 60, unit: 'vials', batchNo: 'CAF-2026-0110', expiry: '2027-07-22', supplier: 'CAPS Holdings', location: 'NICU Cabinet', controlled: false, lastRestock: '2026-02-20', dispensedToday: 3 },
  { id: 'MED-053', name: 'Surfactant (Beractant)',     generic: 'Beractant', strength: '25mg/ml (8ml)', form: 'Vial', category: 'neonatal', qty: 4, minQty: 6, maxQty: 20, unit: 'vials', batchNo: 'SRF-2025-1120', expiry: '2027-01-15', supplier: 'Import — NatPharm', location: 'Fridge R2', controlled: false, lastRestock: '2026-01-08', dispensedToday: 1 },

  // ── SUPPLEMENTS ──
  { id: 'MED-060', name: 'Ferrous Sulphate Tablets',   generic: 'Iron Supplement', strength: '200mg', form: 'Tablet', category: 'supplement', qty: 3200, minQty: 800, maxQty: 6000, unit: 'tabs', batchNo: 'FES-2026-0520', expiry: '2028-01-10', supplier: 'Varichem Pharmaceuticals', location: 'Shelf F1', controlled: false, lastRestock: '2026-05-22', dispensedToday: 64 },
  { id: 'MED-061', name: 'Folic Acid Tablets',         generic: 'Folic Acid', strength: '5mg', form: 'Tablet', category: 'supplement', qty: 4100, minQty: 1000, maxQty: 8000, unit: 'tabs', batchNo: 'FOL-2026-0518', expiry: '2028-03-25', supplier: 'Varichem Pharmaceuticals', location: 'Shelf F1', controlled: false, lastRestock: '2026-05-22', dispensedToday: 58 },
  { id: 'MED-062', name: 'Calcium Gluconate Injection', generic: 'Calcium Gluconate', strength: '10% (10ml)', form: 'Ampoule', category: 'supplement', qty: 48, minQty: 30, maxQty: 100, unit: 'amps', batchNo: 'CAG-2026-0402', expiry: '2027-11-20', supplier: 'CAPS Holdings', location: 'Shelf F2', controlled: false, lastRestock: '2026-04-15', dispensedToday: 2 },

  // ── ANTISEPTICS ──
  { id: 'MED-070', name: 'Chlorhexidine Solution',     generic: 'Chlorhexidine Gluconate', strength: '4% (500ml)', form: 'Bottle', category: 'antiseptic', qty: 22, minQty: 15, maxQty: 50, unit: 'btls', batchNo: 'CHX-2026-0410', expiry: '2028-04-08', supplier: 'Datlabs', location: 'Store S2', controlled: false, lastRestock: '2026-04-18', dispensedToday: 3 },
  { id: 'MED-071', name: 'Povidone Iodine Solution',   generic: 'Povidone-Iodine', strength: '10% (500ml)', form: 'Bottle', category: 'antiseptic', qty: 18, minQty: 12, maxQty: 40, unit: 'btls', batchNo: 'PVI-2026-0325', expiry: '2028-02-14', supplier: 'Varichem Pharmaceuticals', location: 'Store S2', controlled: false, lastRestock: '2026-04-10', dispensedToday: 2 },

  // ── EMERGENCY ──
  { id: 'MED-080', name: 'Adrenaline Injection',       generic: 'Epinephrine', strength: '1mg/ml', form: 'Ampoule', category: 'emergency', qty: 32, minQty: 30, maxQty: 80, unit: 'amps', batchNo: 'ADR-2026-0505', expiry: '2027-09-18', supplier: 'CAPS Holdings', location: 'Emergency Tray', controlled: false, lastRestock: '2026-05-10', dispensedToday: 1 },
  { id: 'MED-081', name: 'Magnesium Sulphate Injection', generic: 'MgSO4', strength: '50% (10ml)', form: 'Ampoule', category: 'emergency', qty: 9, minQty: 25, maxQty: 80, unit: 'amps', batchNo: 'MGS-2026-0215', expiry: '2027-06-30', supplier: 'Datlabs', location: 'Emergency Tray', controlled: false, lastRestock: '2026-03-01', dispensedToday: 3 },
  { id: 'MED-082', name: 'Hydralazine Injection',      generic: 'Hydralazine HCl', strength: '20mg/ml', form: 'Ampoule', category: 'emergency', qty: 14, minQty: 20, maxQty: 60, unit: 'amps', batchNo: 'HDZ-2026-0320', expiry: '2027-08-12', supplier: 'CAPS Holdings', location: 'Emergency Tray', controlled: false, lastRestock: '2026-04-02', dispensedToday: 0 },
  { id: 'MED-083', name: 'Atropine Injection',         generic: 'Atropine Sulphate', strength: '0.6mg/ml', form: 'Ampoule', category: 'emergency', qty: 55, minQty: 20, maxQty: 80, unit: 'amps', batchNo: 'ATR-2026-0428', expiry: '2028-01-05', supplier: 'CAPS Holdings', location: 'Emergency Tray', controlled: false, lastRestock: '2026-05-05', dispensedToday: 0 },

  // ── CONTRACEPTIVES ──
  { id: 'MED-090', name: 'Levonorgestrel Implant',     generic: 'Jadelle', strength: '75mg x 2 rods', form: 'Implant Kit', category: 'contraceptive', qty: 24, minQty: 20, maxQty: 60, unit: 'kits', batchNo: 'JAD-2026-0310', expiry: '2029-03-10', supplier: 'NatPharm', location: 'FP Room Cabinet', controlled: false, lastRestock: '2026-04-12', dispensedToday: 2 },
  { id: 'MED-091', name: 'Medroxyprogesterone Injection', generic: 'Depo-Provera', strength: '150mg/ml', form: 'Vial', category: 'contraceptive', qty: 38, minQty: 25, maxQty: 80, unit: 'vials', batchNo: 'DEP-2026-0405', expiry: '2028-04-18', supplier: 'NatPharm', location: 'FP Room Cabinet', controlled: false, lastRestock: '2026-04-20', dispensedToday: 4 },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUPPLY REQUESTS
// ─────────────────────────────────────────────────────────────────────────────

const SUPPLY_REQUESTS = [
  { id: 'REQ-2026-047', medication: 'Oxytocin Injection', medId: 'MED-020', qtyRequested: 120, qtyApproved: 120, status: 'shipped', requestedBy: 'Pharm. Tendai Mupfurutsa', approvedBy: 'Dr. Rutendo Mawere', date: '2026-06-18', expectedDelivery: '2026-06-25', supplier: 'CAPS Holdings', priority: 'urgent', notes: 'Critical shortage — maternity ward usage exceeds forecasted demand.' },
  { id: 'REQ-2026-046', medication: 'Magnesium Sulphate Injection', medId: 'MED-081', qtyRequested: 60, qtyApproved: 60, status: 'approved', requestedBy: 'Pharm. Tendai Mupfurutsa', approvedBy: 'Dr. Rutendo Mawere', date: '2026-06-17', expectedDelivery: '—', supplier: 'Datlabs', priority: 'urgent', notes: 'Eclampsia protocol requires minimum 25 ampoules at all times.' },
  { id: 'REQ-2026-045', medication: 'Ceftriaxone Injection', medId: 'MED-012', qtyRequested: 100, qtyApproved: 80, status: 'ordered', requestedBy: 'Sr. Nyasha Chikowore', approvedBy: 'Dr. Rutendo Mawere', date: '2026-06-16', expectedDelivery: '2026-06-28', supplier: 'Datlabs', priority: 'high', notes: 'Sepsis cases rising — need buffer stock.' },
  { id: 'REQ-2026-044', medication: 'Ketamine Injection', medId: 'MED-032', qtyRequested: 30, qtyApproved: 30, status: 'shipped', requestedBy: 'Dr. Tapiwa Gumbo', approvedBy: 'Dr. Rutendo Mawere', date: '2026-06-15', expectedDelivery: '2026-06-24', supplier: 'CAPS Holdings', priority: 'urgent', notes: 'Theatre stock below safe minimum.' },
  { id: 'REQ-2026-043', medication: 'Vitamin K1 Injection', medId: 'MED-050', qtyRequested: 150, qtyApproved: 150, status: 'pending', requestedBy: 'Sr. Mazvita Chigumba', approvedBy: '—', date: '2026-06-22', expectedDelivery: '—', supplier: 'Varichem Pharmaceuticals', priority: 'high', notes: 'Neonatal ward running through stock faster than expected.' },
  { id: 'REQ-2026-042', medication: 'Surfactant (Beractant)', medId: 'MED-053', qtyRequested: 10, qtyApproved: null, status: 'pending', requestedBy: 'Dr. James Mugaga', approvedBy: '—', date: '2026-06-21', expectedDelivery: '—', supplier: 'Import — NatPharm', priority: 'urgent', notes: 'Only 4 vials remaining. Import lead time is typically 3–4 weeks.' },
  { id: 'REQ-2026-041', medication: 'Pethidine Injection', medId: 'MED-003', qtyRequested: 60, qtyApproved: 60, status: 'delivered', requestedBy: 'Pharm. Tendai Mupfurutsa', approvedBy: 'Dr. Rutendo Mawere', date: '2026-06-10', expectedDelivery: '2026-06-18', supplier: 'CAPS Holdings', priority: 'normal', notes: 'Controlled substance — verified by Dispensary Lead on receipt.' },
  { id: 'REQ-2026-040', medication: 'Ferrous Sulphate Tablets', medId: 'MED-060', qtyRequested: 3000, qtyApproved: 3000, status: 'delivered', requestedBy: 'Sr. Nyasha Chikowore', approvedBy: 'Dr. Rutendo Mawere', date: '2026-06-05', expectedDelivery: '2026-06-12', supplier: 'Varichem Pharmaceuticals', priority: 'normal', notes: 'Routine ANC restocking.' },
  { id: 'REQ-2026-039', medication: 'Ergometrine Injection', medId: 'MED-022', qtyRequested: 80, qtyApproved: null, status: 'rejected', requestedBy: 'Sr. Mazvita Chigumba', approvedBy: 'Dr. Rutendo Mawere', date: '2026-06-03', expectedDelivery: '—', supplier: 'Datlabs', priority: 'normal', notes: 'Rejected: supplier out of stock — resubmit via NatPharm allocation.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getStockLevel(med) {
  const ratio = med.qty / med.minQty;
  if (ratio < 0.5)  return 'critical';
  if (ratio < 1.0)  return 'low';
  if (ratio < 2.5)  return 'adequate';
  return 'well_stocked';
}

function StockBadge({ level }) {
  const s = STOCK_LEVEL_CFG[level];
  return <span className={`pm-badge ${s.cls}`} style={{ fontSize: '0.68rem' }}>{s.label}</span>;
}

function RequestStatusBadge({ status }) {
  const s = REQUEST_STATUS_CFG[status];
  return <span className={`pm-badge ${s.cls}`} style={{ fontSize: '0.68rem' }}>{s.label}</span>;
}

function PriorityDot({ priority }) {
  const cfg = { urgent: { color: '#dc2626', label: 'Urgent' }, high: { color: '#d97706', label: 'High' }, normal: { color: '#64748b', label: 'Normal' } };
  const c = cfg[priority] || cfg.normal;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.76rem', fontWeight: 600, color: c.color }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
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

function StockBar({ qty, minQty, maxQty }) {
  const pct = Math.min((qty / maxQty) * 100, 100);
  const minPct = (minQty / maxQty) * 100;
  const level = qty < minQty * 0.5 ? '#dc2626' : qty < minQty ? '#d97706' : '#16a34a';
  return (
    <div style={{ position: 'relative', width: '100%', minWidth: 80 }}>
      <div style={{ height: 6, borderRadius: 3, background: 'var(--pm-border)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, background: level, width: `${pct}%`, transition: 'width 0.3s' }} />
      </div>
      <div style={{ position: 'absolute', left: `${minPct}%`, top: -2, width: 1, height: 10, background: '#64748b', opacity: 0.5 }} title={`Min: ${minQty}`} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL VIEW
// ─────────────────────────────────────────────────────────────────────────────

function MedDetail({ med, onBack }) {
  const cat = CATEGORY_CFG[med.category];
  const CatIcon = cat.icon;
  const level = getStockLevel(med);
  const daysSupply = med.dispensedToday > 0 ? Math.floor(med.qty / med.dispensedToday) : '—';
  const relatedRequests = SUPPLY_REQUESTS.filter(r => r.medId === med.id);
  const nearExpiry = new Date(med.expiry) < new Date('2027-06-01');

  return (
    <div>
      <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={onBack} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <ChevronLeft size={16} /> Back to Dispensary
      </button>

      {/* Header */}
      <div className="pm-card" style={{ marginBottom: 16, padding: '18px 20px', borderLeft: `4px solid ${cat.color}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap' }}>
          <div style={{ width: 58, height: 58, borderRadius: 12, background: `${cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CatIcon size={30} style={{ color: cat.color }} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{med.name}</span>
              <StockBadge level={level} />
              {med.controlled && (
                <span className="pm-badge pm-badge-danger" style={{ fontSize: '0.65rem' }}>CONTROLLED</span>
              )}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--pm-text-muted)', marginBottom: 6 }}>{med.generic} · {med.strength} · {med.form}</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Package size={13} /> {med.id}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Archive size={13} /> {med.location}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Truck size={13} /> {med.supplier}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
            <button className="pm-btn pm-btn-primary pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Plus size={13} /> Request Restock
            </button>
            <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <ClipboardList size={13} /> Dispense Log
            </button>
          </div>
        </div>
      </div>

      {/* Stat mini-cards */}
      <div className="row g-3 mb-3">
        {[
          { label: 'Current Stock', value: `${med.qty} ${med.unit}`, icon: Package, color: STOCK_LEVEL_CFG[level].color },
          { label: 'Dispensed Today', value: `${med.dispensedToday} ${med.unit}`, icon: ArrowUp, color: '#6366f1' },
          { label: 'Est. Days Supply', value: daysSupply, icon: Calendar, color: '#0d9488' },
          { label: 'Min Threshold', value: `${med.minQty} ${med.unit}`, icon: AlertTriangle, color: '#d97706' },
        ].map((s, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className="pm-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
              <s.icon size={18} style={{ color: s.color, marginBottom: 6 }} />
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: "'Roboto Condensed', sans-serif", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-6 d-flex flex-column gap-3">
          <div className="pm-card">
            <div className="pm-section-title" style={{ marginBottom: 8 }}>Medication Details</div>
            <InfoGrid rows={[
              { label: 'Generic Name', value: med.generic },
              { label: 'Strength', value: med.strength },
              { label: 'Form', value: med.form },
              { label: 'Category', value: cat.label },
              { label: 'Batch Number', value: med.batchNo },
              { label: 'Expiry Date', value: (<span style={{ color: nearExpiry ? '#d97706' : 'inherit', fontWeight: nearExpiry ? 700 : 500 }}>{med.expiry} {nearExpiry && '· EXPIRING SOON'}</span>) },
              { label: 'Storage', value: med.location },
              { label: 'Controlled', value: med.controlled ? 'Yes — Schedule 2' : 'No' },
            ]} />
          </div>

          <div className="pm-card">
            <div className="pm-section-title" style={{ marginBottom: 8 }}>Supply Chain</div>
            <InfoGrid rows={[
              { label: 'Supplier', value: med.supplier },
              { label: 'Last Restock', value: med.lastRestock },
              { label: 'Stock Level', value: <StockBar qty={med.qty} minQty={med.minQty} maxQty={med.maxQty} /> },
              { label: 'Current / Max', value: `${med.qty} / ${med.maxQty} ${med.unit}` },
            ]} />
          </div>
        </div>

        <div className="col-12 col-xl-6 d-flex flex-column gap-3">
          <div className="pm-card">
            <div className="pm-section-title" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Truck size={15} /> Related Supply Requests
            </div>
            {relatedRequests.length === 0 ? (
              <div style={{ fontSize: '0.82rem', color: 'var(--pm-text-muted)', padding: '20px 0', textAlign: 'center' }}>No recent supply requests for this item.</div>
            ) : relatedRequests.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: i < relatedRequests.length - 1 ? '1px solid var(--pm-border)' : 'none' }}>
                <div style={{ width: 6, borderRadius: 3, background: REQUEST_STATUS_CFG[r.status].color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{r.id}</span>
                    <RequestStatusBadge status={r.status} />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>Qty: {r.qtyRequested} · {r.date}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', fontStyle: 'italic', marginTop: 2 }}>— {r.requestedBy}</div>
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
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function DispensaryManagementPage() {
  const [view, setView] = useState('list');        // 'list' | 'requests' | 'detail'
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedMed, setSelectedMed] = useState(null);

  // Summary stats
  const stockSummary = useMemo(() => {
    const counts = { critical: 0, low: 0, adequate: 0, well_stocked: 0 };
    MEDICATIONS.forEach(m => { counts[getStockLevel(m)]++; });
    return counts;
  }, []);

  const totalDispensedToday = useMemo(() => MEDICATIONS.reduce((a, m) => a + m.dispensedToday, 0), []);
  const controlledCount = useMemo(() => MEDICATIONS.filter(m => m.controlled).length, []);

  // Filtered meds
  const filtered = useMemo(() => {
    return MEDICATIONS.filter(m => {
      if (catFilter !== 'all' && m.category !== catFilter) return false;
      if (stockFilter !== 'all' && getStockLevel(m) !== stockFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return m.name.toLowerCase().includes(q)
          || m.generic.toLowerCase().includes(q)
          || m.id.toLowerCase().includes(q)
          || m.batchNo.toLowerCase().includes(q)
          || m.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, catFilter, stockFilter]);

  const hasFilters = search || catFilter !== 'all' || stockFilter !== 'all';

  const openDetail = (med) => { setSelectedMed(med); setView('detail'); };

  // ── DETAIL VIEW ──
  if (view === 'detail' && selectedMed) {
    return <MedDetail med={selectedMed} onBack={() => { setSelectedMed(null); setView('list'); }} />;
  }

  // ── SUPPLY REQUESTS VIEW ──
  if (view === 'requests') {
    return (
      <div>
        <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => setView('list')} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <ChevronLeft size={16} /> Back to Dispensary
        </button>

        <div className="pm-card" style={{ marginBottom: 16 }}>
          <div className="pm-section-header">
            <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Truck size={18} /> Supply Requests
            </div>
            <button className="pm-btn pm-btn-primary pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Plus size={13} /> New Request
            </button>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginBottom: 14 }}>
            Track medication supply orders, approvals, and deliveries
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="pm-table">
              <thead>
                <tr>
                  <th>REQUEST ID</th><th>MEDICATION</th><th>QTY</th><th>PRIORITY</th>
                  <th>STATUS</th><th>REQUESTED BY</th><th>DATE</th><th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {SUPPLY_REQUESTS.map(req => (
                  <tr key={req.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: 'var(--pm-primary)' }}>{req.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{req.medication}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>{req.supplier}</div>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      {req.qtyRequested}
                      {req.qtyApproved !== null && req.qtyApproved !== req.qtyRequested && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)', fontWeight: 400 }}> (appr: {req.qtyApproved})</span>
                      )}
                    </td>
                    <td><PriorityDot priority={req.priority} /></td>
                    <td><RequestStatusBadge status={req.status} /></td>
                    <td>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{req.requestedBy}</div>
                      {req.approvedBy !== '—' && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>Approved: {req.approvedBy}</div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem' }}>{req.date}</div>
                      {req.expectedDelivery !== '—' && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>ETA: {req.expectedDelivery}</div>
                      )}
                    </td>
                    <td>
                      <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}>
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Request detail notes */}
        <div className="pm-card">
          <div className="pm-section-title" style={{ marginBottom: 10 }}>Request Notes & Audit Trail</div>
          {SUPPLY_REQUESTS.slice(0, 5).map((req, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: i < 4 ? '1px solid var(--pm-border)' : 'none' }}>
              <div style={{ width: 6, borderRadius: 3, background: REQUEST_STATUS_CFG[req.status].color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{req.id} — {req.medication}</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--pm-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {req.date}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', marginBottom: 2 }}>{req.notes}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', fontStyle: 'italic' }}>— {req.requestedBy}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── MAIN LIST VIEW ──
  return (
    <div>
      {/* Summary stat cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Critical',      count: stockSummary.critical,     cfg: STOCK_LEVEL_CFG.critical,     icon: AlertTriangle, clickVal: 'critical' },
          { label: 'Low Stock',     count: stockSummary.low,          cfg: STOCK_LEVEL_CFG.low,          icon: TrendingDown,  clickVal: 'low' },
          { label: 'Adequate',      count: stockSummary.adequate,     cfg: STOCK_LEVEL_CFG.adequate,     icon: CheckCircle,   clickVal: 'adequate' },
          { label: 'Well Stocked',  count: stockSummary.well_stocked, cfg: STOCK_LEVEL_CFG.well_stocked, icon: Package,       clickVal: 'well_stocked' },
        ].map((s, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className="pm-stat-card" onClick={() => setStockFilter(stockFilter === s.clickVal ? 'all' : s.clickVal)}
              style={{
                cursor: 'pointer',
                background: stockFilter === s.clickVal ? s.cfg.color : undefined,
                border: stockFilter === s.clickVal ? 'none' : `1px solid ${s.cfg.color}30`,
                color: stockFilter === s.clickVal ? '#fff' : s.cfg.color,
              }}>
              <s.icon size={18} style={{ opacity: 0.8, marginBottom: 4 }} />
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1 }}>{s.count}</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.8, marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="pm-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pill size={18} style={{ color: '#7c3aed' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: "'Roboto Condensed', sans-serif" }}>{MEDICATIONS.length}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>Total Items</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="pm-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUp size={18} style={{ color: '#0284c7' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: "'Roboto Condensed', sans-serif" }}>{totalDispensedToday}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>Dispensed Today</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="pm-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} style={{ color: '#dc2626' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: "'Roboto Condensed', sans-serif" }}>{controlledCount}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>Controlled Items</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="pm-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => setView('requests')}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={18} style={{ color: '#d97706' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: "'Roboto Condensed', sans-serif" }}>
                {SUPPLY_REQUESTS.filter(r => r.status === 'pending' || r.status === 'approved').length}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>Pending Orders</div>
            </div>
            <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--pm-text-muted)' }} />
          </div>
        </div>
      </div>

      {/* Search & Filters + Table */}
      <div className="pm-card">
        <div className="pm-section-header" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Pill size={18} /> Medication Inventory
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="pm-btn pm-btn-primary pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Plus size={13} /> Add Medication
            </button>
            <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={() => setView('requests')} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Truck size={13} /> Supply Requests
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)' }} />
          <input
            type="text" placeholder="Search by name, generic, batch number, or ID…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px 10px 40px', border: '1px solid var(--pm-border)',
              borderRadius: 8, fontSize: '0.85rem', background: 'var(--pm-surface-2)',
              color: 'var(--pm-text)', outline: 'none',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pm-text-muted)' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[{ k: 'all', l: 'All Categories' }, ...Object.entries(CATEGORY_CFG).map(([k, v]) => ({ k, l: v.label }))].map(f => (
              <button key={f.k} onClick={() => setCatFilter(f.k)}
                className={`pm-btn pm-btn-sm ${catFilter === f.k ? 'pm-btn-primary' : 'pm-btn-ghost'}`}
                style={{ fontSize: '0.72rem', padding: '3px 9px' }}>
                {f.l}
              </button>
            ))}
          </div>
          {hasFilters && (
            <button className="pm-btn pm-btn-ghost pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}
              onClick={() => { setSearch(''); setCatFilter('all'); setStockFilter('all'); }}>
              <X size={12} /> Clear Filters
            </button>
          )}
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginBottom: 8 }}>
          Showing {filtered.length} of {MEDICATIONS.length} medications
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="pm-table">
            <thead>
              <tr>
                <th>MEDICATION</th><th>CATEGORY</th><th>QTY / MIN</th>
                <th>STOCK LEVEL</th><th>BATCH</th><th>EXPIRY</th><th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--pm-text-muted)' }}>
                    <Search size={28} style={{ opacity: 0.2, display: 'block', margin: '0 auto 8px' }} />
                    No medications match your search
                  </td>
                </tr>
              ) : filtered.map(med => {
                const cat = CATEGORY_CFG[med.category];
                const CatIcon = cat.icon;
                const level = getStockLevel(med);
                const nearExpiry = new Date(med.expiry) < new Date('2027-06-01');
                return (
                  <tr key={med.id} style={{ cursor: 'pointer' }} onClick={() => openDetail(med)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: `${cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CatIcon size={17} style={{ color: cat.color }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            {med.name}
                            {med.controlled && <span style={{ marginLeft: 6, fontSize: '0.6rem', color: '#dc2626', fontWeight: 800, background: '#fee2e2', padding: '1px 5px', borderRadius: 4 }}>CTRL</span>}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>{med.generic} · {med.strength}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: cat.color, background: `${cat.color}15`, borderRadius: 10, padding: '2px 8px', whiteSpace: 'nowrap' }}>
                        {cat.label}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: STOCK_LEVEL_CFG[level].color }}>
                        {med.qty} <span style={{ fontWeight: 400, color: 'var(--pm-text-muted)', fontSize: '0.75rem' }}>/ {med.minQty} {med.unit}</span>
                      </div>
                      <StockBar qty={med.qty} minQty={med.minQty} maxQty={med.maxQty} />
                    </td>
                    <td><StockBadge level={level} /></td>
                    <td style={{ fontSize: '0.78rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--pm-text-muted)', letterSpacing: '0.03em' }}>
                      {med.batchNo}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: nearExpiry ? 700 : 400, color: nearExpiry ? '#d97706' : 'var(--pm-text-muted)' }}>
                        {med.expiry}
                        {nearExpiry && <AlertTriangle size={11} style={{ marginLeft: 4, verticalAlign: '-1px' }} />}
                      </span>
                    </td>
                    <td>
                      <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={e => { e.stopPropagation(); openDetail(med); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}>
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