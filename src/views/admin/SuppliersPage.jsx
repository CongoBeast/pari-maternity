import React, { useState, useMemo } from 'react';
import {
  Users, FileText, FileCheck, Receipt, Search, X, ChevronLeft,
  AlertTriangle, CheckCircle, Clock, Plus, ArrowRight, Send,
  Building2, Phone, Mail, MapPin, Star, TrendingUp, DollarSign,
  Package, Truck, Calendar, Download, Eye, Filter, Printer,
  Pill, Syringe, Droplets, Heart, ShieldCheck, Activity,
  Award, History, ChevronRight, Sparkles, Zap, MoreHorizontal,
  Stethoscope, Wrench, Boxes,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_CFG = {
  pharmaceutical: { label: 'Pharmaceuticals', icon: Pill,        color: '#7c3aed' },
  iv_fluids:      { label: 'IV Fluids',       icon: Droplets,    color: '#0284c7' },
  equipment:      { label: 'Medical Equipment', icon: Stethoscope, color: '#0d9488' },
  consumable:     { label: 'Consumables',     icon: Boxes,       color: '#d97706' },
  furniture:      { label: 'Furniture & Beds', icon: Package,    color: '#ec4899' },
  ppe:            { label: 'PPE & Hygiene',   icon: ShieldCheck, color: '#16a34a' },
  maintenance:    { label: 'Maintenance',     icon: Wrench,      color: '#64748b' },
};

const RFQ_STATUS_CFG = {
  draft:     { label: 'Draft',          cls: 'pm-badge-neutral', color: '#64748b' },
  sent:      { label: 'Sent',           cls: 'pm-badge-info',    color: '#0284c7' },
  awaiting:  { label: 'Awaiting Quotes', cls: 'pm-badge-warning', color: '#d97706' },
  quoted:    { label: 'Quotes Received', cls: 'pm-badge-success', color: '#16a34a' },
  awarded:   { label: 'Awarded',        cls: 'pm-badge-success', color: '#16a34a' },
  closed:    { label: 'Closed',         cls: 'pm-badge-neutral', color: '#64748b' },
  cancelled: { label: 'Cancelled',      cls: 'pm-badge-danger',  color: '#dc2626' },
};

const QUOTE_STATUS_CFG = {
  pending:   { label: 'Pending Review',  cls: 'pm-badge-warning', color: '#d97706' },
  accepted:  { label: 'Accepted',        cls: 'pm-badge-success', color: '#16a34a' },
  rejected:  { label: 'Rejected',        cls: 'pm-badge-danger',  color: '#dc2626' },
  expired:   { label: 'Expired',         cls: 'pm-badge-neutral', color: '#64748b' },
};

const INVOICE_STATUS_CFG = {
  unpaid:    { label: 'Unpaid',          cls: 'pm-badge-warning', color: '#d97706' },
  overdue:   { label: 'Overdue',         cls: 'pm-badge-danger',  color: '#dc2626' },
  paid:      { label: 'Paid',            cls: 'pm-badge-success', color: '#16a34a' },
  partial:   { label: 'Partial Payment', cls: 'pm-badge-info',    color: '#0284c7' },
};

// ─────────────────────────────────────────────────────────────────────────────
// SUPPLIERS — Parirenyatwa Group of Hospitals · Maternity Unit
// ─────────────────────────────────────────────────────────────────────────────

const SUPPLIERS = [
  {
    id: 'SUP-001', name: 'Varichem Pharmaceuticals',
    category: 'pharmaceutical', tier: 'preferred',
    contact: 'Tendai Mukamuri', role: 'Key Accounts Manager',
    phone: '+263 242 757 281', email: 'tenders@varichem.co.zw',
    address: '1 Stirling Road, Workington, Harare',
    registered: '2018-03-14', rating: 4.7, onTimeRate: 94,
    totalOrders: 218, lifetimeValue: 412800, openOrders: 3,
    paymentTerms: 'Net 30', leadTime: '5–7 days', currency: 'USD',
    categories: ['Analgesics', 'Antibiotics', 'Oxytocics', 'Supplements'],
    bbeeCert: 'Yes', mccazRegistered: true,
    notes: 'Local manufacturer. Excellent on paracetamol, amoxicillin, misoprostol.',
  },
  {
    id: 'SUP-002', name: 'CAPS Holdings',
    category: 'pharmaceutical', tier: 'preferred',
    contact: 'Dr. Ruvimbo Chigora', role: 'Hospital Sales Director',
    phone: '+263 242 759 460', email: 'hospitals@caps.co.zw',
    address: 'Lytton Road, Workington, Harare',
    registered: '2017-08-22', rating: 4.5, onTimeRate: 91,
    totalOrders: 184, lifetimeValue: 388500, openOrders: 2,
    paymentTerms: 'Net 30', leadTime: '4–6 days', currency: 'USD',
    categories: ['Controlled Drugs', 'Anaesthetics', 'IV Fluids', 'Emergency'],
    bbeeCert: 'Yes', mccazRegistered: true,
    notes: 'Sole local supplier for several controlled lines. Strong cold-chain logistics.',
  },
  {
    id: 'SUP-003', name: 'Datlabs Pharmaceuticals',
    category: 'iv_fluids', tier: 'preferred',
    contact: 'Brighton Ndlovu', role: 'Regional Sales Manager',
    phone: '+263 292 463 121', email: 'sales@datlabs.co.zw',
    address: '12 Birmingham Road, Bulawayo',
    registered: '2019-01-08', rating: 4.6, onTimeRate: 96,
    totalOrders: 156, lifetimeValue: 298400, openOrders: 1,
    paymentTerms: 'Net 45', leadTime: '6–8 days', currency: 'USD',
    categories: ['IV Fluids', 'Electrolytes', 'Antibiotics', 'Analgesics'],
    bbeeCert: 'Yes', mccazRegistered: true,
    notes: 'Largest local IV-fluid producer. Bulk pricing on Normal Saline and Ringers.',
  },
  {
    id: 'SUP-004', name: 'Surgimed Zimbabwe',
    category: 'equipment', tier: 'approved',
    contact: 'Patience Moyo', role: 'Account Executive',
    phone: '+263 242 882 010', email: 'sales@surgimed.co.zw',
    address: '24 Glenara Avenue South, Eastlea, Harare',
    registered: '2020-05-30', rating: 4.3, onTimeRate: 87,
    totalOrders: 64, lifetimeValue: 184200, openOrders: 2,
    paymentTerms: 'Net 60', leadTime: '14–21 days', currency: 'USD',
    categories: ['Monitors', 'Fetal Doppler', 'Sterilizers', 'Biomed Spares'],
    bbeeCert: 'Yes', mccazRegistered: false,
    notes: 'Authorised Philips & Mindray distributor. Carries warranty servicing.',
  },
  {
    id: 'SUP-005', name: 'MedTech Africa (Pvt) Ltd',
    category: 'equipment', tier: 'approved',
    contact: 'Kudakwashe Sibanda', role: 'Sales Engineer',
    phone: '+263 242 700 415', email: 'kuda@medtechafrica.co.zw',
    address: '88 Samora Machel Avenue, Harare CBD',
    registered: '2021-02-11', rating: 4.1, onTimeRate: 82,
    totalOrders: 38, lifetimeValue: 142000, openOrders: 1,
    paymentTerms: 'Net 30', leadTime: '21–30 days', currency: 'USD',
    categories: ['Incubators', 'Phototherapy', 'Resuscitaires', 'Warmers'],
    bbeeCert: 'No', mccazRegistered: false,
    notes: 'GE Healthcare & Dräger distributor. Long lead times on imports.',
  },
  {
    id: 'SUP-006', name: 'Cliniwall Hygiene Products',
    category: 'ppe', tier: 'approved',
    contact: 'Memory Chikwava', role: 'Customer Liaison',
    phone: '+263 242 446 200', email: 'orders@cliniwall.co.zw',
    address: '7 Coventry Road, Workington, Harare',
    registered: '2019-09-17', rating: 4.4, onTimeRate: 93,
    totalOrders: 102, lifetimeValue: 87600, openOrders: 1,
    paymentTerms: 'Net 30', leadTime: '7–10 days', currency: 'USD',
    categories: ['Curtains', 'Surgical Gowns', 'Drapes', 'Hand Sanitiser'],
    bbeeCert: 'Yes', mccazRegistered: false,
    notes: 'Antimicrobial cubicle curtains on a 90-day swap contract.',
  },
  {
    id: 'SUP-007', name: 'Probrands Medical Consumables',
    category: 'consumable', tier: 'approved',
    contact: 'Farai Gomba', role: 'Sales Representative',
    phone: '+263 242 612 558', email: 'medical@probrands.co.zw',
    address: '14 Martin Drive, Msasa, Harare',
    registered: '2018-11-04', rating: 4.2, onTimeRate: 89,
    totalOrders: 174, lifetimeValue: 96800, openOrders: 2,
    paymentTerms: 'Net 30', leadTime: '3–5 days', currency: 'USD',
    categories: ['Syringes', 'Cannulas', 'Gloves', 'Sutures', 'Dressings'],
    bbeeCert: 'Yes', mccazRegistered: true,
    notes: 'Reliable for fast-moving consumables. Cheapest on examination gloves.',
  },
  {
    id: 'SUP-008', name: 'Zimplow Medical Division',
    category: 'furniture', tier: 'occasional',
    contact: 'Lovemore Chitsa', role: 'Institutional Sales',
    phone: '+263 242 887 700', email: 'medical@zimplow.co.zw',
    address: '15 Steven Drive, Msasa, Harare',
    registered: '2020-08-19', rating: 3.9, onTimeRate: 78,
    totalOrders: 22, lifetimeValue: 64500, openOrders: 0,
    paymentTerms: 'Net 60', leadTime: '30–45 days', currency: 'USD',
    categories: ['Hospital Beds', 'Cots', 'Trolleys', 'Cabinets'],
    bbeeCert: 'Yes', mccazRegistered: false,
    notes: 'Locally fabricated metalwork. Longer lead times but durable.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL LOW STOCK — pulled from dispensary thresholds
// ─────────────────────────────────────────────────────────────────────────────

const CRITICAL_LOW = [
  { id: 'MED-020', name: 'Oxytocin Injection',     strength: '10 IU/ml', form: 'Ampoule',
    qty: 18, minQty: 60, unit: 'amps', preferredSupplier: 'CAPS Holdings',     supplierId: 'SUP-002', urgency: 'critical' },
  { id: 'MED-012', name: 'Ceftriaxone Injection',  strength: '1g',       form: 'Vial',
    qty: 12, minQty: 50, unit: 'vials', preferredSupplier: 'Datlabs Pharmaceuticals', supplierId: 'SUP-003', urgency: 'critical' },
  { id: 'MED-032', name: 'Ketamine Injection',     strength: '500mg/10ml', form: 'Vial',
    qty: 8,  minQty: 20, unit: 'vials', preferredSupplier: 'CAPS Holdings',     supplierId: 'SUP-002', urgency: 'critical' },
  { id: 'MED-050', name: 'Vitamin K1 Injection',   strength: '1mg/0.5ml', form: 'Ampoule',
    qty: 42, minQty: 80, unit: 'amps', preferredSupplier: 'Varichem Pharmaceuticals', supplierId: 'SUP-001', urgency: 'low' },
  { id: 'MED-052', name: 'Caffeine Citrate Injection', strength: '20mg/ml', form: 'Vial',
    qty: 15, minQty: 20, unit: 'vials', preferredSupplier: 'CAPS Holdings',     supplierId: 'SUP-002', urgency: 'low' },
  { id: 'MED-003', name: 'Pethidine Injection',    strength: '100mg/2ml', form: 'Ampoule',
    qty: 28, minQty: 40, unit: 'amps', preferredSupplier: 'CAPS Holdings',     supplierId: 'SUP-002', urgency: 'low' },
];

// ─────────────────────────────────────────────────────────────────────────────
// RFQs
// ─────────────────────────────────────────────────────────────────────────────

const RFQS = [
  { id: 'RFQ-2026-0142', issued: '2026-06-18', deadline: '2026-06-25', status: 'quoted',
    title: 'Oxytocin + Ergometrine Resupply', category: 'pharmaceutical',
    items: [
      { name: 'Oxytocin Injection 10 IU/ml', qty: 200, unit: 'amps' },
      { name: 'Ergometrine Injection 0.5mg/ml', qty: 100, unit: 'amps' },
    ],
    invitedSuppliers: ['SUP-001', 'SUP-002', 'SUP-003'], quotesReceived: 3,
    raisedBy: 'Pharm. T. Madziva',
  },
  { id: 'RFQ-2026-0141', issued: '2026-06-16', deadline: '2026-06-23', status: 'awarded',
    title: 'Ceftriaxone 1g Resupply', category: 'pharmaceutical',
    items: [{ name: 'Ceftriaxone Injection 1g', qty: 300, unit: 'vials' }],
    invitedSuppliers: ['SUP-002', 'SUP-003'], quotesReceived: 2,
    raisedBy: 'Pharm. T. Madziva', awardedTo: 'SUP-003', awardValue: 2850,
  },
  { id: 'RFQ-2026-0140', issued: '2026-06-14', deadline: '2026-06-28', status: 'awaiting',
    title: 'NICU Phototherapy Unit (replacement)', category: 'equipment',
    items: [{ name: 'LED Phototherapy Unit – overhead, neonatal', qty: 1, unit: 'unit' }],
    invitedSuppliers: ['SUP-004', 'SUP-005'], quotesReceived: 1,
    raisedBy: 'Biomed — T. Ncube',
  },
  { id: 'RFQ-2026-0139', issued: '2026-06-12', deadline: '2026-06-22', status: 'quoted',
    title: 'Q3 Consumables Replenishment', category: 'consumable',
    items: [
      { name: 'Sterile Gloves (M)', qty: 5000, unit: 'pairs' },
      { name: 'IV Cannula 18G',     qty: 2000, unit: 'units' },
      { name: 'Suture 2-0 Vicryl',  qty: 600,  unit: 'units' },
    ],
    invitedSuppliers: ['SUP-006', 'SUP-007'], quotesReceived: 2,
    raisedBy: 'Stores — F. Mhondoro',
  },
  { id: 'RFQ-2026-0138', issued: '2026-06-08', deadline: '2026-06-18', status: 'closed',
    title: 'Cubicle Curtains – 90-day Swap', category: 'ppe',
    items: [{ name: 'Antimicrobial Cubicle Curtain Sets', qty: 40, unit: 'sets' }],
    invitedSuppliers: ['SUP-006'], quotesReceived: 1,
    raisedBy: 'Housekeeping', awardedTo: 'SUP-006', awardValue: 3400,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// QUOTES RECEIVED
// ─────────────────────────────────────────────────────────────────────────────

const QUOTES = [
  { id: 'QUO-9821', rfqId: 'RFQ-2026-0142', supplierId: 'SUP-002', supplierName: 'CAPS Holdings',
    submitted: '2026-06-20', validUntil: '2026-07-04', total: 1840, leadTime: '4 days', status: 'pending',
    lineCount: 2, paymentTerms: 'Net 30' },
  { id: 'QUO-9820', rfqId: 'RFQ-2026-0142', supplierId: 'SUP-001', supplierName: 'Varichem Pharmaceuticals',
    submitted: '2026-06-19', validUntil: '2026-07-03', total: 1925, leadTime: '6 days', status: 'pending',
    lineCount: 2, paymentTerms: 'Net 30' },
  { id: 'QUO-9819', rfqId: 'RFQ-2026-0142', supplierId: 'SUP-003', supplierName: 'Datlabs Pharmaceuticals',
    submitted: '2026-06-19', validUntil: '2026-07-03', total: 1980, leadTime: '7 days', status: 'pending',
    lineCount: 2, paymentTerms: 'Net 45' },
  { id: 'QUO-9818', rfqId: 'RFQ-2026-0141', supplierId: 'SUP-003', supplierName: 'Datlabs Pharmaceuticals',
    submitted: '2026-06-18', validUntil: '2026-07-02', total: 2850, leadTime: '5 days', status: 'accepted',
    lineCount: 1, paymentTerms: 'Net 45' },
  { id: 'QUO-9817', rfqId: 'RFQ-2026-0141', supplierId: 'SUP-002', supplierName: 'CAPS Holdings',
    submitted: '2026-06-17', validUntil: '2026-07-01', total: 3120, leadTime: '4 days', status: 'rejected',
    lineCount: 1, paymentTerms: 'Net 30' },
  { id: 'QUO-9816', rfqId: 'RFQ-2026-0140', supplierId: 'SUP-005', supplierName: 'MedTech Africa (Pvt) Ltd',
    submitted: '2026-06-19', validUntil: '2026-07-10', total: 4250, leadTime: '28 days', status: 'pending',
    lineCount: 1, paymentTerms: 'Net 30' },
  { id: 'QUO-9815', rfqId: 'RFQ-2026-0139', supplierId: 'SUP-007', supplierName: 'Probrands Medical Consumables',
    submitted: '2026-06-15', validUntil: '2026-06-29', total: 2210, leadTime: '4 days', status: 'pending',
    lineCount: 3, paymentTerms: 'Net 30' },
  { id: 'QUO-9814', rfqId: 'RFQ-2026-0139', supplierId: 'SUP-006', supplierName: 'Cliniwall Hygiene Products',
    submitted: '2026-06-14', validUntil: '2026-06-28', total: 2380, leadTime: '7 days', status: 'pending',
    lineCount: 3, paymentTerms: 'Net 30' },
];

// ─────────────────────────────────────────────────────────────────────────────
// INVOICES
// ─────────────────────────────────────────────────────────────────────────────

const INVOICES = [
  { id: 'INV-VRC-44218', supplierId: 'SUP-001', supplierName: 'Varichem Pharmaceuticals',
    issued: '2026-06-10', due: '2026-07-10', amount: 4820, status: 'unpaid', poRef: 'PO-2026-0388', items: 6 },
  { id: 'INV-CAP-77104', supplierId: 'SUP-002', supplierName: 'CAPS Holdings',
    issued: '2026-06-05', due: '2026-07-05', amount: 6310, status: 'unpaid', poRef: 'PO-2026-0381', items: 4 },
  { id: 'INV-DAT-21088', supplierId: 'SUP-003', supplierName: 'Datlabs Pharmaceuticals',
    issued: '2026-05-28', due: '2026-07-12', amount: 3950, status: 'partial', poRef: 'PO-2026-0376', items: 5 },
  { id: 'INV-SGM-10024', supplierId: 'SUP-004', supplierName: 'Surgimed Zimbabwe',
    issued: '2026-04-18', due: '2026-06-17', amount: 8900, status: 'overdue', poRef: 'PO-2026-0344', items: 1 },
  { id: 'INV-PBR-55810', supplierId: 'SUP-007', supplierName: 'Probrands Medical Consumables',
    issued: '2026-06-12', due: '2026-07-12', amount: 1880, status: 'unpaid', poRef: 'PO-2026-0391', items: 8 },
  { id: 'INV-CLW-30142', supplierId: 'SUP-006', supplierName: 'Cliniwall Hygiene Products',
    issued: '2026-05-20', due: '2026-06-19', amount: 3400, status: 'paid', poRef: 'PO-2026-0362', items: 1 },
  { id: 'INV-VRC-44109', supplierId: 'SUP-001', supplierName: 'Varichem Pharmaceuticals',
    issued: '2026-05-15', due: '2026-06-14', amount: 5210, status: 'paid', poRef: 'PO-2026-0358', items: 7 },
  { id: 'INV-CAP-76998', supplierId: 'SUP-002', supplierName: 'CAPS Holdings',
    issued: '2026-05-10', due: '2026-06-09', amount: 7140, status: 'paid', poRef: 'PO-2026-0351', items: 5 },
  { id: 'INV-MTA-20015', supplierId: 'SUP-005', supplierName: 'MedTech Africa (Pvt) Ltd',
    issued: '2026-04-02', due: '2026-06-01', amount: 12400, status: 'overdue', poRef: 'PO-2026-0331', items: 1 },
];

// ─────────────────────────────────────────────────────────────────────────────
// HISTORICAL SUPPLIES (per supplier — shown on profile drill-in)
// ─────────────────────────────────────────────────────────────────────────────

const SUPPLY_HISTORY = {
  'SUP-001': [
    { date: '2026-05-10', poRef: 'PO-2026-0358', item: 'Paracetamol 500mg', qty: '5,000 tabs', value: 420, onTime: true },
    { date: '2026-04-18', poRef: 'PO-2026-0322', item: 'Ibuprofen 400mg',   qty: '3,000 tabs', value: 380, onTime: true },
    { date: '2026-04-05', poRef: 'PO-2026-0311', item: 'Tramadol 50mg',     qty: '400 caps',   value: 290, onTime: true },
    { date: '2026-03-22', poRef: 'PO-2026-0298', item: 'Misoprostol 200mcg', qty: '800 tabs',  value: 540, onTime: false },
    { date: '2026-03-05', poRef: 'PO-2026-0281', item: 'Vitamin K1 1mg',    qty: '250 amps',   value: 410, onTime: true },
  ],
  'SUP-002': [
    { date: '2026-05-08', poRef: 'PO-2026-0354', item: 'Lidocaine 2%',       qty: '200 vials',  value: 580, onTime: true },
    { date: '2026-04-14', poRef: 'PO-2026-0319', item: 'Metronidazole IV',   qty: '100 bags',   value: 720, onTime: true },
    { date: '2026-03-22', poRef: 'PO-2026-0299', item: 'Pethidine 100mg',    qty: '120 amps',   value: 1100, onTime: true },
    { date: '2026-03-10', poRef: 'PO-2026-0286', item: 'Oxytocin 10 IU',     qty: '200 amps',   value: 480, onTime: true },
    { date: '2026-02-20', poRef: 'PO-2026-0264', item: 'Caffeine Citrate',   qty: '60 vials',   value: 920, onTime: false },
  ],
  'SUP-003': [
    { date: '2026-05-18', poRef: 'PO-2026-0370', item: 'Normal Saline 1L',   qty: '500 bags',  value: 1200, onTime: true },
    { date: '2026-05-10', poRef: 'PO-2026-0359', item: 'Ringers Lactate 1L', qty: '400 bags',  value: 980, onTime: true },
    { date: '2026-04-25', poRef: 'PO-2026-0335', item: 'Dextrose 5% 1L',     qty: '300 bags',  value: 760, onTime: true },
    { date: '2026-04-22', poRef: 'PO-2026-0330', item: 'Bupivacaine 0.5%',   qty: '150 vials', value: 870, onTime: true },
  ],
  'SUP-004': [
    { date: '2026-04-18', poRef: 'PO-2026-0344', item: 'Vital Signs Monitor', qty: '1 unit',   value: 8900, onTime: false },
    { date: '2026-01-20', poRef: 'PO-2026-0188', item: 'Fetal Doppler',       qty: '3 units',  value: 2400, onTime: true },
    { date: '2025-11-12', poRef: 'PO-2025-1142', item: 'Autoclave Service Kit', qty: '1 kit',  value: 1850, onTime: true },
  ],
  'SUP-005': [
    { date: '2026-04-02', poRef: 'PO-2026-0331', item: 'Radiant Warmer GE Lullaby', qty: '1 unit', value: 12400, onTime: false },
    { date: '2025-08-22', poRef: 'PO-2025-0844', item: 'Phototherapy LED Unit',     qty: '1 unit', value: 3400,  onTime: false },
  ],
  'SUP-006': [
    { date: '2026-05-20', poRef: 'PO-2026-0362', item: 'Cubicle Curtain Sets', qty: '40 sets', value: 3400, onTime: true },
    { date: '2026-02-18', poRef: 'PO-2026-0260', item: 'Surgical Gowns L',     qty: '500 pcs', value: 2200, onTime: true },
    { date: '2025-11-15', poRef: 'PO-2025-1150', item: 'Hand Sanitiser 5L',    qty: '60 btls', value: 720,  onTime: true },
  ],
  'SUP-007': [
    { date: '2026-06-12', poRef: 'PO-2026-0391', item: 'Sterile Gloves M',     qty: '5,000 pairs', value: 1100, onTime: true },
    { date: '2026-05-04', poRef: 'PO-2026-0348', item: 'IV Cannula 18G',       qty: '2,000 units', value: 480, onTime: true },
    { date: '2026-04-10', poRef: 'PO-2026-0316', item: 'Suture 2-0 Vicryl',    qty: '600 units',   value: 540, onTime: true },
    { date: '2026-03-12', poRef: 'PO-2026-0288', item: 'Syringes 5ml',         qty: '3,000 units', value: 320, onTime: true },
  ],
  'SUP-008': [
    { date: '2025-12-08', poRef: 'PO-2025-1208', item: 'KMC Reclining Beds', qty: '4 units', value: 8400, onTime: false },
    { date: '2025-07-22', poRef: 'PO-2025-0722', item: 'Linen Trolleys',     qty: '6 units', value: 2100, onTime: true },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

const StatusBadge = ({ cfgMap, status }) => {
  const cfg = cfgMap[status];
  if (!cfg) return null;
  return <span className={`pm-badge ${cfg.cls}`}>{cfg.label}</span>;
};

const TierBadge = ({ tier }) => {
  const map = {
    preferred:  { label: 'Preferred',  bg: '#dcfce7', color: '#16a34a' },
    approved:   { label: 'Approved',   bg: '#dbeafe', color: '#0284c7' },
    occasional: { label: 'Occasional', bg: '#f1f5f9', color: '#64748b' },
  };
  const c = map[tier] || map.occasional;
  return (
    <span style={{
      fontSize: '0.68rem', fontWeight: 700, background: c.bg, color: c.color,
      padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>{c.label}</span>
  );
};

const Rating = ({ value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
    <Star size={13} fill="#f59e0b" stroke="#f59e0b" />
    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{value.toFixed(1)}</span>
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
// NEW RFQ MODAL
// ═════════════════════════════════════════════════════════════════════════════

function NewRfqModal({ prefillItems, onClose, onSubmit }) {
  const [title, setTitle] = useState(
    prefillItems?.length === 1
      ? `${prefillItems[0].name} Resupply`
      : prefillItems?.length ? 'Auto-generated RFQ — Critical Low Stock' : ''
  );
  const [category, setCategory] = useState('pharmaceutical');
  const [items, setItems] = useState(
    prefillItems?.map(i => ({
      name: `${i.name} ${i.strength}`,
      qty: Math.max((i.minQty - i.qty) * 2, i.minQty),
      unit: i.unit,
    })) || [{ name: '', qty: '', unit: '' }]
  );
  const [selectedSuppliers, setSelectedSuppliers] = useState(
    prefillItems?.length
      ? [...new Set(prefillItems.map(i => i.supplierId))]
      : []
  );
  const [deadline, setDeadline] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });

  const addItem = () => setItems([...items, { name: '', qty: '', unit: '' }]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx, field, val) => {
    const next = [...items]; next[idx] = { ...next[idx], [field]: val }; setItems(next);
  };
  const toggleSupplier = (id) => setSelectedSuppliers(s =>
    s.includes(id) ? s.filter(x => x !== id) : [...s, id]
  );

  const isAutoGen = prefillItems?.length > 0;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16, backdropFilter: 'blur(2px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--pm-surface, #fff)', borderRadius: 12,
        width: '100%', maxWidth: 720, maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 22px', borderBottom: '1px solid var(--pm-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: isAutoGen ? 'linear-gradient(135deg, var(--pm-primary) 0%, #4f46e5 100%)' : 'transparent',
          color: isAutoGen ? '#fff' : 'inherit',
          borderTopLeftRadius: 12, borderTopRightRadius: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isAutoGen ? <Sparkles size={20} /> : <FileText size={20} />}
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>
                {isAutoGen ? 'Auto-Generate RFQ' : 'New Request for Quotation'}
              </div>
              {isAutoGen && (
                <div style={{ fontSize: '0.72rem', opacity: 0.85, marginTop: 2 }}>
                  Pre-filled from critical low-stock alerts
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: isAutoGen ? '#fff' : 'var(--pm-text-muted)', padding: 4,
          }}><X size={20} /></button>
        </div>

        <div style={{ padding: 22 }}>
          {/* Title & meta */}
          <div className="row g-3 mb-3">
            <div className="col-12">
              <label style={labelStyle}>RFQ Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Oxytocin Resupply — Maternity" style={inputStyle} />
            </div>
            <div className="col-md-6">
              <label style={labelStyle}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                {Object.entries(CATEGORY_CFG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label style={labelStyle}>Quote Deadline</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Line items */}
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Line Items</div>
              <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={addItem}
                style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Plus size={12} /> Add Line
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((it, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr 90px 90px 32px', gap: 8,
                  background: 'var(--pm-surface-2)', padding: 8, borderRadius: 8,
                }}>
                  <input value={it.name} onChange={e => updateItem(i, 'name', e.target.value)}
                    placeholder="Item description" style={{ ...inputStyle, padding: '6px 10px' }} />
                  <input value={it.qty} onChange={e => updateItem(i, 'qty', e.target.value)}
                    placeholder="Qty" style={{ ...inputStyle, padding: '6px 10px' }} />
                  <input value={it.unit} onChange={e => updateItem(i, 'unit', e.target.value)}
                    placeholder="Unit" style={{ ...inputStyle, padding: '6px 10px' }} />
                  <button onClick={() => removeItem(i)} disabled={items.length === 1}
                    style={{
                      background: 'transparent', border: 'none',
                      cursor: items.length === 1 ? 'not-allowed' : 'pointer',
                      color: items.length === 1 ? 'var(--pm-text-muted)' : '#dc2626',
                      opacity: items.length === 1 ? 0.4 : 1,
                    }}><X size={16} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Suppliers */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>
              Invite Suppliers ({selectedSuppliers.length} selected)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto', paddingRight: 4 }}>
              {SUPPLIERS.map(s => {
                const checked = selectedSuppliers.includes(s.id);
                return (
                  <label key={s.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                    border: `1px solid ${checked ? 'var(--pm-primary)' : 'var(--pm-border)'}`,
                    borderRadius: 6, cursor: 'pointer',
                    background: checked ? 'var(--pm-primary-light)' : 'transparent',
                  }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleSupplier(s.id)} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{s.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>
                        {s.categories.slice(0, 3).join(' · ')} · Lead {s.leadTime}
                      </div>
                    </div>
                    <Rating value={s.rating} />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 22px', borderTop: '1px solid var(--pm-border)',
          display: 'flex', justifyContent: 'flex-end', gap: 10, background: 'var(--pm-surface-2)',
          borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
        }}>
          <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={onClose}>Cancel</button>
          <button className="pm-btn pm-btn-primary pm-btn-sm" onClick={() => onSubmit({ title, category, items, selectedSuppliers, deadline })}
            disabled={!title || selectedSuppliers.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Send size={13} /> Send RFQ to {selectedSuppliers.length} {selectedSuppliers.length === 1 ? 'supplier' : 'suppliers'}
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.72rem', fontWeight: 700,
  color: 'var(--pm-text-muted)', textTransform: 'uppercase',
  letterSpacing: '0.05em', marginBottom: 5,
};
const inputStyle = {
  width: '100%', padding: '8px 12px', border: '1px solid var(--pm-border)',
  borderRadius: 6, fontSize: '0.85rem', background: 'var(--pm-surface, #fff)',
  color: 'var(--pm-text)',
};

// ═════════════════════════════════════════════════════════════════════════════
// SUPPLIER PROFILE (drill-in)
// ═════════════════════════════════════════════════════════════════════════════

function SupplierProfile({ supplier, onBack }) {
  const cat = CATEGORY_CFG[supplier.category];
  const CatIcon = cat.icon;
  const history = SUPPLY_HISTORY[supplier.id] || [];
  const supplierInvoices = INVOICES.filter(i => i.supplierId === supplier.id);
  const supplierQuotes = QUOTES.filter(q => q.supplierId === supplier.id);
  const supplierRfqs = RFQS.filter(r => r.invitedSuppliers.includes(supplier.id));

  return (
    <div>
      <button className="pm-btn pm-btn-ghost pm-btn-sm mb-3" onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <ChevronLeft size={14} /> Back to Suppliers
      </button>

      {/* Profile header */}
      <div className="pm-card mb-3" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{
          background: `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}dd 100%)`,
          color: '#fff', padding: '22px 24px', display: 'flex',
          alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 14, background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <CatIcon size={32} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', opacity: 0.85, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
                {supplier.id} · {cat.label}
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.15 }}>{supplier.name}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <TierBadge tier={supplier.tier} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem' }}>
                  <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
                  <span style={{ fontWeight: 700 }}>{supplier.rating.toFixed(1)}</span>
                  <span style={{ opacity: 0.75 }}>/ 5.0</span>
                </div>
                {supplier.mccazRegistered && (
                  <div style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 10 }}>
                    <ShieldCheck size={11} /> MCCAZ Registered
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="pm-btn pm-btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Mail size={13} /> Contact
            </button>
            <button className="pm-btn pm-btn-sm" style={{ background: '#fff', color: cat.color, fontWeight: 700 }}>
              <Send size={13} /> Send RFQ
            </button>
          </div>
        </div>

        {/* Contact & meta */}
        <div style={{ padding: '18px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          <Field icon={<Phone size={13} />}   label="Phone"    value={supplier.phone} />
          <Field icon={<Mail size={13} />}    label="Email"    value={supplier.email} />
          <Field icon={<MapPin size={13} />}  label="Address"  value={supplier.address} />
          <Field icon={<Users size={13} />}   label="Contact"  value={`${supplier.contact} — ${supplier.role}`} />
          <Field icon={<Calendar size={13} />} label="Registered" value={supplier.registered} />
          <Field icon={<DollarSign size={13} />} label="Terms" value={`${supplier.paymentTerms} · ${supplier.currency}`} />
          <Field icon={<Truck size={13} />}   label="Lead Time" value={supplier.leadTime} />
          <Field icon={<Award size={13} />}   label="BBEE" value={supplier.bbeeCert} />
        </div>

        {supplier.notes && (
          <div style={{ padding: '0 24px 18px' }}>
            <div style={{
              background: 'var(--pm-surface-2)', borderLeft: `3px solid ${cat.color}`,
              padding: '10px 14px', borderRadius: 6, fontSize: '0.82rem', color: 'var(--pm-text-muted)', fontStyle: 'italic',
            }}>“{supplier.notes}”</div>
          </div>
        )}
      </div>

      {/* KPI strip */}
      <div className="row g-3 mb-3">
        <StatCard icon={<Package size={16} />} label="Total Orders"    value={supplier.totalOrders}              tone="info" />
        <StatCard icon={<DollarSign size={16} />} label="Lifetime Value" value={`$${supplier.lifetimeValue.toLocaleString()}`} tone="success" />
        <StatCard icon={<TrendingUp size={16} />} label="On-Time Rate"   value={`${supplier.onTimeRate}%`}        tone={supplier.onTimeRate >= 90 ? 'success' : supplier.onTimeRate >= 80 ? 'warning' : 'danger'} />
        <StatCard icon={<Clock size={16} />} label="Open Orders"         value={supplier.openOrders}              tone="warning" />
      </div>

      {/* Categories supplied */}
      <div className="pm-card mb-3">
        <div className="pm-section-header">
          <div className="pm-section-title">Categories Supplied</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {supplier.categories.map(c => (
            <span key={c} style={{
              fontSize: '0.78rem', fontWeight: 600, background: `${cat.color}15`,
              color: cat.color, padding: '4px 12px', borderRadius: 14,
            }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Supply History */}
      <div className="pm-card mb-3">
        <div className="pm-section-header">
          <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <History size={16} /> Historical Supplies
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>
            {history.length} deliveries on record
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="pm-table">
            <thead>
              <tr><th>DATE</th><th>PO REF</th><th>ITEM</th><th>QTY</th><th>VALUE</th><th>DELIVERY</th></tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 28, color: 'var(--pm-text-muted)' }}>No supply history yet</td></tr>
              ) : history.map((h, i) => (
                <tr key={i}>
                  <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>{h.date}</td>
                  <td style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--pm-text-muted)' }}>{h.poRef}</td>
                  <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>{h.item}</td>
                  <td style={{ fontSize: '0.8rem' }}>{h.qty}</td>
                  <td style={{ fontSize: '0.82rem', fontWeight: 700 }}>${h.value.toLocaleString()}</td>
                  <td>
                    {h.onTime
                      ? <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}><CheckCircle size={11} /> On Time</span>
                      : <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Clock size={11} /> Late</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row g-3">
        {/* Past RFQs sent */}
        <div className="col-12 col-lg-6">
          <div className="pm-card h-100">
            <div className="pm-section-header">
              <div className="pm-section-title">RFQs Sent</div>
              <span className="pm-badge pm-badge-info">{supplierRfqs.length}</span>
            </div>
            {supplierRfqs.length === 0
              ? <div style={{ padding: 20, textAlign: 'center', color: 'var(--pm-text-muted)', fontSize: '0.82rem' }}>No RFQs sent</div>
              : supplierRfqs.slice(0, 5).map(r => (
                <div className="pm-notice-item" key={r.id}>
                  <div className="pm-notice-icon"><FileText size={14} /></div>
                  <div style={{ flex: 1 }}>
                    <div className="pm-notice-title">{r.title}</div>
                    <div className="pm-notice-time">{r.id} · Issued {r.issued}</div>
                  </div>
                  <StatusBadge cfgMap={RFQ_STATUS_CFG} status={r.status} />
                </div>
              ))}
          </div>
        </div>

        {/* Invoices */}
        <div className="col-12 col-lg-6">
          <div className="pm-card h-100">
            <div className="pm-section-header">
              <div className="pm-section-title">Invoices</div>
              <span className="pm-badge pm-badge-info">{supplierInvoices.length}</span>
            </div>
            {supplierInvoices.length === 0
              ? <div style={{ padding: 20, textAlign: 'center', color: 'var(--pm-text-muted)', fontSize: '0.82rem' }}>No invoices</div>
              : supplierInvoices.map(inv => (
                <div className="pm-notice-item" key={inv.id}>
                  <div className="pm-notice-icon"><Receipt size={14} /></div>
                  <div style={{ flex: 1 }}>
                    <div className="pm-notice-title">{inv.id}</div>
                    <div className="pm-notice-time">Due {inv.due} · ${inv.amount.toLocaleString()}</div>
                  </div>
                  <StatusBadge cfgMap={INVOICE_STATUS_CFG} status={inv.status} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.66rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--pm-text)' }}>{value}</div>
    </div>
  );
}

function StatCard({ icon, label, value, tone = 'info' }) {
  const tones = {
    info:    { bg: '#dbeafe', color: '#0284c7' },
    success: { bg: '#dcfce7', color: '#16a34a' },
    warning: { bg: '#fef3c7', color: '#d97706' },
    danger:  { bg: '#fee2e2', color: '#dc2626' },
  };
  const t = tones[tone];
  return (
    <div className="col-6 col-md-3">
      <div className="pm-card" style={{ padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: t.bg, color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </div>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1.1, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════

export default function SuppliersPage() {
  const [tab, setTab] = useState('suppliers');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [rfqModal, setRfqModal] = useState(null); // { prefillItems: [...] } | { } | null
  const [toast, setToast] = useState(null);

  // KPI metrics
  const stats = useMemo(() => ({
    suppliers: SUPPLIERS.length,
    activeRfqs: RFQS.filter(r => ['sent', 'awaiting', 'quoted'].includes(r.status)).length,
    pendingQuotes: QUOTES.filter(q => q.status === 'pending').length,
    outstanding: INVOICES.filter(i => ['unpaid', 'overdue', 'partial'].includes(i.status))
      .reduce((s, i) => s + i.amount, 0),
    criticalItems: CRITICAL_LOW.filter(c => c.urgency === 'critical').length,
  }), []);

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return SUPPLIERS.filter(s => {
      if (catFilter !== 'all' && s.category !== catFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q)
        || s.contact.toLowerCase().includes(q)
        || s.id.toLowerCase().includes(q)
        || s.categories.some(c => c.toLowerCase().includes(q));
    });
  }, [search, catFilter]);

  const handleRfqSubmit = (rfqData) => {
    setRfqModal(null);
    setToast(`RFQ sent to ${rfqData.selectedSuppliers.length} ${rfqData.selectedSuppliers.length === 1 ? 'supplier' : 'suppliers'}`);
    setTimeout(() => setToast(null), 3500);
  };

  // Profile view takes over the whole page
  if (selectedSupplier) {
    return <SupplierProfile supplier={selectedSupplier} onBack={() => setSelectedSupplier(null)} />;
  }

  return (
    <div>
      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1100,
          background: '#16a34a', color: '#fff', padding: '12px 18px',
          borderRadius: 8, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600,
        }}>
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      {/* RFQ MODAL */}
      {rfqModal !== null && (
        <NewRfqModal
          prefillItems={rfqModal.prefillItems}
          onClose={() => setRfqModal(null)}
          onSubmit={handleRfqSubmit}
        />
      )}

      {/* TOP KPIS */}
      <div className="row g-3 mb-3">
        <div className="col-6 col-md-3">
          <div className="pm-stat-card" style={{ background: 'var(--pm-primary)' }}>
            <Building2 size={16} style={{ opacity: 0.75, marginBottom: 6 }} />
            <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Active Suppliers</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1 }}>{stats.suppliers}</div>
            <div style={{ fontSize: '0.68rem', opacity: 0.7, marginTop: 4 }}>4 preferred · 3 approved</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="pm-stat-card" style={{ background: '#0284c7' }}>
            <FileText size={16} style={{ opacity: 0.75, marginBottom: 6 }} />
            <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Active RFQs</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1 }}>{stats.activeRfqs}</div>
            <div style={{ fontSize: '0.68rem', opacity: 0.7, marginTop: 4 }}>Out for quotation</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="pm-stat-card" style={{ background: '#d97706' }}>
            <FileCheck size={16} style={{ opacity: 0.75, marginBottom: 6 }} />
            <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Quotes to Review</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1 }}>{stats.pendingQuotes}</div>
            <div style={{ fontSize: '0.68rem', opacity: 0.7, marginTop: 4 }}>Awaiting decision</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="pm-stat-card" style={{ background: 'var(--pm-danger)' }}>
            <Receipt size={16} style={{ opacity: 0.75, marginBottom: 6 }} />
            <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Outstanding A/P</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1 }}>${(stats.outstanding / 1000).toFixed(1)}k</div>
            <div style={{ fontSize: '0.68rem', opacity: 0.7, marginTop: 4 }}>Across {INVOICES.filter(i => i.status !== 'paid').length} invoices</div>
          </div>
        </div>
      </div>

      {/* CRITICAL LOW STOCK ALERT */}
      <div className="pm-card mb-3" style={{
        borderLeft: '4px solid #dc2626',
        background: 'linear-gradient(to right, #fef2f2 0%, transparent 60%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: '#dc2626', color: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#dc2626' }}>Critical Low Stock — RFQ Action Required</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>
                {CRITICAL_LOW.length} items below minimum threshold · {stats.criticalItems} require urgent reorder
              </div>
            </div>
          </div>
          <button
            className="pm-btn pm-btn-primary pm-btn-sm"
            style={{ background: '#dc2626', borderColor: '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => setRfqModal({ prefillItems: CRITICAL_LOW })}
          >
            <Sparkles size={13} /> Auto-Generate RFQ for All
          </button>
        </div>

        <div className="row g-2">
          {CRITICAL_LOW.map(item => {
            const pctOfMin = Math.round((item.qty / item.minQty) * 100);
            const isCritical = item.urgency === 'critical';
            return (
              <div className="col-12 col-md-6 col-xl-4" key={item.id}>
                <div style={{
                  background: 'var(--pm-surface, #fff)',
                  border: `1px solid ${isCritical ? '#fecaca' : '#fed7aa'}`,
                  borderRadius: 8, padding: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pm-text)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>{item.strength} · {item.form}</div>
                    </div>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 700,
                      background: isCritical ? '#dc2626' : '#d97706', color: '#fff',
                      padding: '2px 7px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', marginLeft: 8,
                    }}>{isCritical ? 'Critical' : 'Low'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--pm-text-muted)', marginBottom: 4 }}>
                    <span>Current: <strong style={{ color: 'var(--pm-text)' }}>{item.qty} {item.unit}</strong></span>
                    <span>Min: {item.minQty} {item.unit}</span>
                  </div>
                  <div className="pm-progress" style={{ marginBottom: 8 }}>
                    <div className="pm-progress-fill" style={{
                      width: `${Math.min(pctOfMin, 100)}%`,
                      background: isCritical ? '#dc2626' : '#d97706',
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Preferred: <strong style={{ color: 'var(--pm-text)' }}>{item.preferredSupplier}</strong>
                    </div>
                    <button
                      className="pm-btn pm-btn-outline pm-btn-sm"
                      style={{ fontSize: '0.7rem', padding: '4px 8px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}
                      onClick={() => setRfqModal({ prefillItems: [item] })}
                    >
                      <Send size={11} /> Send RFQ
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TABS */}
      <div className="pm-card">
        <div style={{
          display: 'flex', gap: 4, borderBottom: '1px solid var(--pm-border)',
          marginBottom: 16, overflowX: 'auto', paddingBottom: 0,
        }}>
          {[
            { key: 'suppliers', label: 'Suppliers Directory', icon: Users,    count: SUPPLIERS.length },
            { key: 'rfqs',      label: 'RFQs',                icon: FileText, count: RFQS.length },
            { key: 'quotes',    label: 'Quotes Received',     icon: FileCheck, count: QUOTES.length },
            { key: 'invoices',  label: 'Invoices',            icon: Receipt,  count: INVOICES.length },
          ].map(t => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', background: 'transparent', border: 'none',
                borderBottom: `2px solid ${active ? 'var(--pm-primary)' : 'transparent'}`,
                color: active ? 'var(--pm-primary)' : 'var(--pm-text-muted)',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                whiteSpace: 'nowrap', marginBottom: -1,
              }}>
                <Icon size={14} /> {t.label}
                <span style={{
                  fontSize: '0.7rem', background: active ? 'var(--pm-primary-light)' : 'var(--pm-surface-2)',
                  color: active ? 'var(--pm-primary)' : 'var(--pm-text-muted)',
                  padding: '1px 7px', borderRadius: 10, fontWeight: 700,
                }}>{t.count}</span>
              </button>
            );
          })}
          <div style={{ flex: 1 }} />
          <button className="pm-btn pm-btn-primary pm-btn-sm" onClick={() => setRfqModal({})}
            style={{ display: 'flex', alignItems: 'center', gap: 6, alignSelf: 'center', marginBottom: 8 }}>
            <Plus size={13} /> New RFQ
          </button>
        </div>

        {/* SUPPLIERS TAB */}
        {tab === 'suppliers' && (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 360 }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)' }} />
                <input type="text" placeholder="Search suppliers, contacts, categories…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 32 }} />
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <button onClick={() => setCatFilter('all')}
                  className={`pm-btn pm-btn-sm ${catFilter === 'all' ? 'pm-btn-primary' : 'pm-btn-ghost'}`}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}>All</button>
                {Object.entries(CATEGORY_CFG).map(([k, v]) => (
                  <button key={k} onClick={() => setCatFilter(k)}
                    className={`pm-btn pm-btn-sm ${catFilter === k ? 'pm-btn-primary' : 'pm-btn-ghost'}`}
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}>{v.label}</button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--pm-text-muted)', marginBottom: 8 }}>
              Showing {filteredSuppliers.length} of {SUPPLIERS.length} suppliers
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="pm-table">
                <thead>
                  <tr>
                    <th>SUPPLIER</th><th>CATEGORY</th><th>RATING</th><th>ON-TIME</th>
                    <th>ORDERS</th><th>LIFETIME</th><th>TIER</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--pm-text-muted)' }}>
                      <Search size={28} style={{ opacity: 0.2, display: 'block', margin: '0 auto 8px' }} />
                      No suppliers match your search
                    </td></tr>
                  ) : filteredSuppliers.map(s => {
                    const cat = CATEGORY_CFG[s.category];
                    const CatIcon = cat.icon;
                    return (
                      <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedSupplier(s)}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 8, background: `${cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <CatIcon size={17} style={{ color: cat.color }} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{s.name}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>{s.contact} · {s.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: cat.color, background: `${cat.color}15`, borderRadius: 10, padding: '2px 8px', whiteSpace: 'nowrap' }}>{cat.label}</span>
                        </td>
                        <td><Rating value={s.rating} /></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 50, height: 5, background: 'var(--pm-surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{
                                width: `${s.onTimeRate}%`, height: '100%',
                                background: s.onTimeRate >= 90 ? '#16a34a' : s.onTimeRate >= 80 ? '#d97706' : '#dc2626',
                              }} />
                            </div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{s.onTimeRate}%</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>{s.totalOrders}</td>
                        <td style={{ fontSize: '0.82rem', fontWeight: 700 }}>${(s.lifetimeValue / 1000).toFixed(0)}k</td>
                        <td><TierBadge tier={s.tier} /></td>
                        <td>
                          <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={e => { e.stopPropagation(); setSelectedSupplier(s); }}
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
          </>
        )}

        {/* RFQS TAB */}
        {tab === 'rfqs' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="pm-table">
              <thead>
                <tr>
                  <th>RFQ ID</th><th>TITLE</th><th>ITEMS</th><th>INVITED</th>
                  <th>QUOTES IN</th><th>DEADLINE</th><th>STATUS</th><th></th>
                </tr>
              </thead>
              <tbody>
                {RFQS.map(r => {
                  const cat = CATEGORY_CFG[r.category];
                  return (
                    <tr key={r.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.78rem' }}>{r.id}</td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>By {r.raisedBy} · {r.issued}</div>
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>{r.items.length}</td>
                      <td style={{ fontSize: '0.82rem' }}>{r.invitedSuppliers.length}</td>
                      <td>
                        <span style={{
                          fontSize: '0.78rem', fontWeight: 700,
                          color: r.quotesReceived === r.invitedSuppliers.length ? '#16a34a' : '#d97706',
                        }}>{r.quotesReceived} / {r.invitedSuppliers.length}</span>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>{r.deadline}</td>
                      <td><StatusBadge cfgMap={RFQ_STATUS_CFG} status={r.status} /></td>
                      <td>
                        <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ fontSize: '0.75rem' }}>
                          <Eye size={11} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* QUOTES TAB */}
        {tab === 'quotes' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="pm-table">
              <thead>
                <tr>
                  <th>QUOTE ID</th><th>RFQ</th><th>SUPPLIER</th><th>LINES</th>
                  <th>TOTAL</th><th>LEAD TIME</th><th>TERMS</th><th>VALID UNTIL</th><th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {QUOTES.map(q => (
                  <tr key={q.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.78rem' }}>{q.id}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: 'var(--pm-text-muted)' }}>{q.rfqId}</td>
                    <td>
                      <button onClick={() => {
                        const s = SUPPLIERS.find(x => x.id === q.supplierId);
                        if (s) setSelectedSupplier(s);
                      }} style={{
                        background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                        color: 'var(--pm-primary)', fontWeight: 600, fontSize: '0.82rem', textAlign: 'left',
                      }}>{q.supplierName}</button>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{q.lineCount}</td>
                    <td style={{ fontSize: '0.85rem', fontWeight: 700 }}>${q.total.toLocaleString()}</td>
                    <td style={{ fontSize: '0.8rem' }}>{q.leadTime}</td>
                    <td style={{ fontSize: '0.8rem' }}>{q.paymentTerms}</td>
                    <td style={{ fontSize: '0.8rem' }}>{q.validUntil}</td>
                    <td><StatusBadge cfgMap={QUOTE_STATUS_CFG} status={q.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* INVOICES TAB */}
        {tab === 'invoices' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="pm-table">
              <thead>
                <tr>
                  <th>INVOICE ID</th><th>SUPPLIER</th><th>PO REF</th><th>ITEMS</th>
                  <th>ISSUED</th><th>DUE</th><th>AMOUNT</th><th>STATUS</th><th></th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.78rem' }}>{inv.id}</td>
                    <td>
                      <button onClick={() => {
                        const s = SUPPLIERS.find(x => x.id === inv.supplierId);
                        if (s) setSelectedSupplier(s);
                      }} style={{
                        background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                        color: 'var(--pm-primary)', fontWeight: 600, fontSize: '0.82rem', textAlign: 'left',
                      }}>{inv.supplierName}</button>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: 'var(--pm-text-muted)' }}>{inv.poRef}</td>
                    <td style={{ fontSize: '0.82rem' }}>{inv.items}</td>
                    <td style={{ fontSize: '0.8rem' }}>{inv.issued}</td>
                    <td style={{ fontSize: '0.8rem' }}>{inv.due}</td>
                    <td style={{ fontSize: '0.9rem', fontWeight: 700 }}>${inv.amount.toLocaleString()}</td>
                    <td><StatusBadge cfgMap={INVOICE_STATUS_CFG} status={inv.status} /></td>
                    <td>
                      <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Download size={11} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}