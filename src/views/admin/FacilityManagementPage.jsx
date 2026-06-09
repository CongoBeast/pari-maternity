import React, { useState, useMemo } from 'react';
import {
  ChevronLeft, AlertTriangle, CheckCircle, Wifi, WifiOff,
  Users, Monitor, BedDouble, Building2, Activity, Baby,
  Heart, Stethoscope, MapPin, Phone, Clock, ArrowRight,
  Info, Layers, Home, Zap, Shield, Thermometer, Radio
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// FLOOR CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const FLOOR_COLORS = {
  ground: { color: '#f59e0b', light: '#fffbeb', ring: '#fde68a', dark: '#d97706' },
  first:  { color: '#7c3aed', light: '#f5f3ff', ring: '#ddd6fe', dark: '#6d28d9' },
  second: { color: '#0d9488', light: '#f0fdfa', ring: '#99f6e4', dark: '#0f766e' },
  third:  { color: '#ec4899', light: '#fdf2f8', ring: '#fbcfe8', dark: '#db2777' },
};

// ─────────────────────────────────────────────────────────────────────────────
// BED STATUS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const BED_CFG = {
  occupied:  { bg: '#16a34a', border: '#15803d', dot: '#fff', label: 'Occupied' },
  available: { bg: '#e5e7eb', border: '#d1d5db', dot: '#9ca3af', label: 'Available' },
  cleaning:  { bg: '#f59e0b', border: '#d97706', dot: '#fff', label: 'Cleaning' },
  critical:  { bg: '#dc2626', border: '#b91c1c', dot: '#fff', label: 'Critical' },
  reserved:  { bg: '#3b82f6', border: '#2563eb', dot: '#fff', label: 'Reserved' },
};

const UNIT_STATUS_CFG = {
  full:       { color: '#dc2626', bg: '#fee2e2', label: 'Full' },
  partial:    { color: '#d97706', bg: '#fef3c7', label: 'Partial' },
  available:  { color: '#16a34a', bg: '#dcfce7', label: 'Available' },
  occupied:   { color: '#7c3aed', bg: '#f3e8ff', label: 'In Use' },
  cleaning:   { color: '#f59e0b', bg: '#fef3c7', label: 'Cleaning' },
  critical:   { color: '#dc2626', bg: '#fee2e2', label: '⚠ CRITICAL' },
  active:     { color: '#16a34a', bg: '#dcfce7', label: 'Active' },
  busy:       { color: '#d97706', bg: '#fef3c7', label: 'Busy' },
  offline:    { color: '#64748b', bg: '#f1f5f9', label: 'Offline' },
  standby:    { color: '#6366f1', bg: '#eef2ff', label: 'Standby' },
};

// ─────────────────────────────────────────────────────────────────────────────
// HOSPITAL FLOORS DATA
// ─────────────────────────────────────────────────────────────────────────────

const FLOORS = [
  /* ═══════════════════════════════════════════════
     GROUND FLOOR — Admissions · Antenatal · Diagnostics
     ═══════════════════════════════════════════════ */
  {
    id: 'ground', num: 'GF', name: 'Ground Floor',
    subtitle: 'Admissions · Antenatal Clinic · Diagnostics',
    description: 'Main patient entry point. Houses the admissions desk, two diagnostic scan rooms, the antenatal clinic, and all administrative records.',
    matron: { name: 'Sr. Chipo Mutasa', id: 'STF-016', phone: '+263 77 111 2233', since: 'Mar 2016' },
    sic:    { name: 'Sr. Agnes Dube',   id: 'STF-017', phone: '+263 77 444 5566', since: 'Jan 2019' },
    nursesOnDuty: 4,
    monitors: [
      { id: 'GF-M1', name: 'Monitor 1 — Lobby Display',     status: 'online',  location: 'Main Lobby',        content: 'Queue Numbers & Announcements' },
      { id: 'GF-M2', name: 'Monitor 2 — ANC Waiting Area',  status: 'online',  location: 'ANC Waiting Lounge', content: 'Appointment Queue Display' },
    ],
    sections: [
      {
        id: 'gf-admin', name: 'Administration & Support', type: 'admin',
        units: [
          { id: 'GF-NS',  name: "Nurses' Management Station", type: 'station',  status: 'active',   note: '4 nurses on duty — shift handover at 19:00',     beds: null },
          { id: 'GF-MO',  name: "Floor Matron's Office",      type: 'office',   status: 'active',   note: 'Sr. Chipo Mutasa — in office',                    beds: null },
          { id: 'GF-SIC', name: "Sister-in-Charge's Office",  type: 'office',   status: 'active',   note: 'Sr. Agnes Dube — in office',                      beds: null },
          { id: 'GF-BR',  name: 'Birth Records Office',       type: 'office',   status: 'active',   note: '2 records clerks on duty — open 08:00–16:00',      beds: null },
        ]
      },
      {
        id: 'gf-clinical', name: 'Clinical & Diagnostic Services', type: 'clinical',
        units: [
          { id: 'GF-ADM', name: 'Admissions Desk',     type: 'admissions', status: 'busy',      queue: 8,  note: '8 patients in queue · Processing time ~20 min',          beds: null },
          { id: 'GF-SR1', name: 'Scan Room 1',         type: 'scan',       status: 'occupied',  queue: null, note: 'Mrs. Rudo Hove — 20-week anomaly scan in progress',     beds: [{ id: 'SR1-S1', status: 'occupied', patient: 'Mrs. Rudo Hove (20-wk anomaly scan)' }] },
          { id: 'GF-SR2', name: 'Scan Room 2',         type: 'scan',       status: 'available', queue: null, note: 'Next patient in 15 min — Mrs. Farai Mucheke (36-wk)',   beds: [{ id: 'SR2-S1', status: 'available', patient: null }] },
          { id: 'GF-ANC', name: 'Antenatal Clinic',    type: 'clinic',     status: 'busy',      queue: 7,  note: '18 patients seen today · 7 remaining appointments',      beds: null, capacity: 25, current: 18 },
        ]
      },
    ],
    stats: { totalBeds: 2, occupiedBeds: 1, patientCount: 19, alertCount: 0 },
  },

  /* ═══════════════════════════════════════════════
     FIRST FLOOR — Theatre · Delivery · Recovery
     ═══════════════════════════════════════════════ */
  {
    id: 'first', num: '1F', name: 'First Floor',
    subtitle: 'Operating Theatre · Delivery Rooms · Recovery',
    description: 'Clinical hub of the maternity unit. Houses the full operating theatre complex, 7 delivery rooms, and 6 post-delivery recovery rooms.',
    matron: { name: 'Sr. Memory Murewa',  id: 'STF-018', phone: '+263 77 222 3344', since: 'Jun 2018' },
    sic:    { name: 'Sr. Anesu Maposa',   id: 'STF-019', phone: '+263 77 555 6677', since: 'Aug 2020' },
    nursesOnDuty: 8,
    monitors: [
      { id: '1F-M1', name: 'Monitor 1 — Theatre Corridor',  status: 'online',  location: 'Theatre Corridor', content: 'Theatre Schedule & Case List' },
      { id: '1F-M2', name: 'Monitor 2 — Delivery Wing',     status: 'offline', location: 'Delivery Wing',    content: 'Delivery Queue (OFFLINE — fault reported)' },
    ],
    sections: [
      {
        id: '1f-admin', name: 'Administration & Support', type: 'admin',
        units: [
          { id: '1F-NS',  name: "Nurses' Management Station", type: 'station', status: 'active', note: '8 nurses on duty across theatre and delivery wing', beds: null },
          { id: '1F-MO',  name: "Floor Matron's Office",      type: 'office',  status: 'active', note: 'Sr. Memory Murewa — coordinating theatre schedule',  beds: null },
          { id: '1F-SIC', name: "Sister-in-Charge's Office",  type: 'office',  status: 'active', note: 'Sr. Anesu Maposa — overseeing delivery wing',         beds: null },
        ]
      },
      {
        id: '1f-theatre', name: 'Operating Theatre Complex', type: 'theatre',
        units: [
          { id: 'OR1', name: 'Operation Room 1', type: 'theatre-or', status: 'critical',
            note: 'ACTIVE — Emergency LSCS · Dr. Chigudu · Est. completion 12:30',
            beds: [{ id: 'OR1-T1', status: 'critical', patient: 'Mrs. Grace Mukwena — Emergency LSCS in progress' }] },
          { id: 'OR2', name: 'Operation Room 2', type: 'theatre-or', status: 'cleaning',
            note: 'Post-elective LSCS cleaning — Ready approx. 11:45',
            beds: [{ id: 'OR2-T1', status: 'cleaning', patient: null }] },
          { id: 'TR1', name: 'Theatre Recovery Unit 1', type: 'theatre-recovery', status: 'partial',
            note: '1/2 beds occupied — routine post-CS monitoring',
            beds: [
              { id: 'TR1-B1', status: 'occupied', patient: 'Mrs. Chiedza Ncube — 3h post-LSCS, stable' },
              { id: 'TR1-B2', status: 'available', patient: null },
            ]},
          { id: 'TR2', name: 'Theatre Recovery Unit 2', type: 'theatre-recovery', status: 'full',
            note: '2/2 beds occupied',
            beds: [
              { id: 'TR2-B1', status: 'occupied', patient: 'Mrs. Spiwe Moyo — 1h post-LSCS' },
              { id: 'TR2-B2', status: 'occupied', patient: 'Mrs. Rumbi Choto — 2h post-LSCS' },
            ]},
          { id: 'TR-TEA',  name: 'Staff Tea Room',        type: 'support',  status: 'active',  note: 'Staff only', beds: null },
          { id: 'TR-WAIT', name: 'Theatre Waiting Room',  type: 'support',  status: 'busy',    note: '6 family members currently waiting', queue: 6, beds: null },
          { id: 'TR-DIS',  name: 'Disinfection Room',     type: 'support',  status: 'active',  note: 'Instruments being processed', beds: null },
          { id: 'TR-CHG',  name: 'Staff Changing Room',   type: 'support',  status: 'active',  note: 'Staff use only', beds: null },
        ]
      },
      {
        id: '1f-delivery', name: 'Delivery Rooms — 7 Units · 14 Beds', type: 'delivery',
        units: [
          { id: 'DR1', name: 'Delivery Room 1', type: 'delivery', status: 'full',
            beds: [
              { id: 'DR1-B1', status: 'occupied', patient: 'Mrs. Rudo Chimuti — Active labour 8 cm dilation' },
              { id: 'DR1-B2', status: 'occupied', patient: 'Mrs. Tendai Mhuka — Active labour 6 cm' },
            ]},
          { id: 'DR2', name: 'Delivery Room 2', type: 'delivery', status: 'partial',
            beds: [
              { id: 'DR2-B1', status: 'occupied', patient: 'Mrs. Farai Zimuto — Imminent delivery, pushing' },
              { id: 'DR2-B2', status: 'available', patient: null },
            ]},
          { id: 'DR3', name: 'Delivery Room 3', type: 'delivery', status: 'full',
            beds: [
              { id: 'DR3-B1', status: 'occupied', patient: 'Mrs. Sasha Banda — Induced labour, 5 cm' },
              { id: 'DR3-B2', status: 'occupied', patient: 'Mrs. Tanya Makore — Active labour 7 cm' },
            ]},
          { id: 'DR4', name: 'Delivery Room 4', type: 'delivery', status: 'critical',
            note: '⚠ FETAL DISTRESS — Emergency team present',
            beds: [
              { id: 'DR4-B1', status: 'critical', patient: 'Mrs. Priscilla Nyoni — Fetal distress CTG — EMERGENCY RESPONSE' },
              { id: 'DR4-B2', status: 'occupied', patient: 'Mrs. Loveness Mupfuro — Pushing stage, imminent' },
            ]},
          { id: 'DR5', name: 'Delivery Room 5', type: 'delivery', status: 'partial',
            beds: [
              { id: 'DR5-B1', status: 'occupied', patient: 'Mrs. Sekai Dhliwayo — Early labour, 4 cm' },
              { id: 'DR5-B2', status: 'available', patient: null },
            ]},
          { id: 'DR6', name: 'Delivery Room 6', type: 'delivery', status: 'full',
            beds: [
              { id: 'DR6-B1', status: 'occupied', patient: 'Mrs. Melody Musariri — VBAC attempt, monitored' },
              { id: 'DR6-B2', status: 'occupied', patient: 'Mrs. Joyce Mwanza — Active labour 9 cm, crowning soon' },
            ]},
          { id: 'DR7', name: 'Delivery Room 7', type: 'delivery', status: 'available',
            beds: [
              { id: 'DR7-B1', status: 'available', patient: null },
              { id: 'DR7-B2', status: 'available', patient: null },
            ]},
        ]
      },
      {
        id: '1f-recovery', name: 'Post-Delivery Recovery — 6 Units · 12 Beds', type: 'recovery',
        units: [
          { id: 'RR1', name: 'Recovery Room 1', type: 'recovery', status: 'full',
            beds: [
              { id: 'RR1-B1', status: 'occupied', patient: 'Mrs. Leticia Gomo — 2h post-NVD, stable' },
              { id: 'RR1-B2', status: 'occupied', patient: 'Mrs. Sandra Dziva — 1h post-NVD' },
            ]},
          { id: 'RR2', name: 'Recovery Room 2', type: 'recovery', status: 'partial',
            beds: [
              { id: 'RR2-B1', status: 'occupied', patient: 'Mrs. Mercy Zvobgo — 4h post-NVD, preparing transfer' },
              { id: 'RR2-B2', status: 'cleaning', patient: null },
            ]},
          { id: 'RR3', name: 'Recovery Room 3', type: 'recovery', status: 'full',
            beds: [
              { id: 'RR3-B1', status: 'occupied', patient: 'Mrs. Esther Muyambo — 3h post-NVD' },
              { id: 'RR3-B2', status: 'occupied', patient: 'Mrs. Kudzai Mhuri — 1h post-NVD, breastfeeding' },
            ]},
          { id: 'RR4', name: 'Recovery Room 4', type: 'recovery', status: 'available',
            beds: [
              { id: 'RR4-B1', status: 'available', patient: null },
              { id: 'RR4-B2', status: 'available', patient: null },
            ]},
          { id: 'RR5', name: 'Recovery Room 5', type: 'recovery', status: 'partial',
            beds: [
              { id: 'RR5-B1', status: 'occupied', patient: 'Mrs. Chipo Gumbo — 2h post-NVD' },
              { id: 'RR5-B2', status: 'available', patient: null },
            ]},
          { id: 'RR6', name: 'Recovery Room 6', type: 'recovery', status: 'full',
            beds: [
              { id: 'RR6-B1', status: 'occupied', patient: 'Mrs. Alice Mushore — 5h post-NVD, transferring' },
              { id: 'RR6-B2', status: 'occupied', patient: 'Mrs. Beatrice Mwenye — 3h post-NVD' },
            ]},
        ]
      },
    ],
    stats: { totalBeds: 30, occupiedBeds: 22, patientCount: 24, alertCount: 2 },
    alerts: ['DR4 — Fetal distress emergency — team on site', 'Monitor 2 (Delivery Wing) — offline, fault logged'],
  },

  /* ═══════════════════════════════════════════════
     SECOND FLOOR — Postnatal · Nursery · NICU
     ═══════════════════════════════════════════════ */
  {
    id: 'second', num: '2F', name: 'Second Floor',
    subtitle: 'Postnatal Ward · Nursery · NICU · Preterm Unit',
    description: 'Houses postnatal women recovering after delivery, the nursery complex (NICU, preterm, term), the solution preparation area, and a ward for unwell postnatal women.',
    matron: { name: 'Sr. Ruth Ncube',    id: 'STF-020', phone: '+263 77 333 4455', since: 'Feb 2017' },
    sic:    { name: 'Sr. Vimbai Dube',   id: 'STF-021', phone: '+263 77 666 7788', since: 'Nov 2021' },
    nursesOnDuty: 7,
    monitors: [
      { id: '2F-M1', name: 'Monitor 1 — Postnatal Corridor', status: 'online', location: 'Postnatal Wing',   content: 'Patient Room & Feeding Schedule' },
      { id: '2F-M2', name: 'Monitor 2 — Nursery Entrance',   status: 'online', location: 'Nursery Corridor', content: 'Baby Status Board & Feeding Times' },
    ],
    sections: [
      {
        id: '2f-admin', name: 'Administration & Support', type: 'admin',
        units: [
          { id: '2F-NS',  name: "Nurses' Management Station", type: 'station', status: 'active', note: '7 nurses on duty across postnatal and nursery', beds: null },
          { id: '2F-MO',  name: "Floor Matron's Office",      type: 'office',  status: 'active', note: 'Sr. Ruth Ncube — overseeing nursery & postnatal', beds: null },
          { id: '2F-SIC', name: "Sister-in-Charge's Office",  type: 'office',  status: 'active', note: 'Sr. Vimbai Dube — postnatal ward oversight',       beds: null },
        ]
      },
      {
        id: '2f-nursery', name: 'Nursery Complex', type: 'nursery',
        units: [
          {
            id: 'NICU', name: 'Neonatal ICU (NICU)', type: 'nicu', status: 'busy',
            note: '6/8 incubators occupied — 2 on ventilator support',
            beds: [
              { id: 'NICU-1', status: 'critical', patient: 'Baby Nyoni — 32wk preterm, CPAP, day 3' },
              { id: 'NICU-2', status: 'critical', patient: 'Baby Mukwena — 29wk preterm, ventilated, day 1' },
              { id: 'NICU-3', status: 'occupied', patient: 'Baby Choto — 34wk, on CPAP, day 5' },
              { id: 'NICU-4', status: 'occupied', patient: 'Baby Zimuto — 35wk, nasal prongs, day 2' },
              { id: 'NICU-5', status: 'occupied', patient: 'Baby Banda — 33wk, improving, day 7' },
              { id: 'NICU-6', status: 'occupied', patient: 'Baby Gomo — 36wk, weaning O2, day 4' },
              { id: 'NICU-7', status: 'available', patient: null },
              { id: 'NICU-8', status: 'available', patient: null },
            ]
          },
          {
            id: 'PRET', name: 'Preterm Baby Unit — 16 Incubators', type: 'preterm', status: 'full',
            note: '12/16 incubators occupied — stable preterm neonates',
            beds: [
              { id: 'PT-01', status: 'occupied', patient: 'Baby Moyo — 36wk, growing well' },
              { id: 'PT-02', status: 'occupied', patient: 'Baby Ncube (Twin 1) — 37wk, phototherapy' },
              { id: 'PT-03', status: 'occupied', patient: 'Baby Ncube (Twin 2) — 37wk, phototherapy' },
              { id: 'PT-04', status: 'occupied', patient: 'Baby Dube — 35wk, stable' },
              { id: 'PT-05', status: 'occupied', patient: 'Baby Mupambi — 36wk, breastfeeding' },
              { id: 'PT-06', status: 'occupied', patient: 'Baby Sithole — 37wk, preparing discharge' },
              { id: 'PT-07', status: 'occupied', patient: 'Baby Murewa — 35wk, cup feeding' },
              { id: 'PT-08', status: 'occupied', patient: 'Baby Maposa — 34wk, stable, gaining weight' },
              { id: 'PT-09', status: 'occupied', patient: 'Baby Chimuti — 36wk, on board feeds' },
              { id: 'PT-10', status: 'occupied', patient: 'Baby Mwanaka — 37wk, rooming-in soon' },
              { id: 'PT-11', status: 'occupied', patient: 'Baby Zvobgo — 35wk, kangaroo care' },
              { id: 'PT-12', status: 'occupied', patient: 'Baby Gumbo — 36wk, breastfeeding progressing' },
              { id: 'PT-13', status: 'available', patient: null },
              { id: 'PT-14', status: 'available', patient: null },
              { id: 'PT-15', status: 'available', patient: null },
              { id: 'PT-16', status: 'available', patient: null },
            ]
          },
          {
            id: 'TERM', name: 'Term Baby Nursery', type: 'term-nursery', status: 'partial',
            note: '8/14 bassinets occupied — healthy term neonates awaiting rooming-in',
            beds: [
              { id: 'TN-01', status: 'occupied', patient: 'Baby Moyo (Male) — 39wk, Day 5, healthy' },
              { id: 'TN-02', status: 'occupied', patient: 'Baby Dziva — 40wk, Day 3' },
              { id: 'TN-03', status: 'occupied', patient: 'Baby Mushore — 38wk, Day 2' },
              { id: 'TN-04', status: 'occupied', patient: 'Baby Mwenye — 39wk, Day 1' },
              { id: 'TN-05', status: 'occupied', patient: 'Baby Mhuri — 40wk, Day 4' },
              { id: 'TN-06', status: 'occupied', patient: 'Baby Zvobgo (Female) — 39wk, Day 2' },
              { id: 'TN-07', status: 'occupied', patient: 'Baby Muyambo — 38wk, Day 3' },
              { id: 'TN-08', status: 'occupied', patient: 'Baby Dhliwayo — 41wk, Day 1' },
              { id: 'TN-09', status: 'available', patient: null },
              { id: 'TN-10', status: 'available', patient: null },
              { id: 'TN-11', status: 'available', patient: null },
              { id: 'TN-12', status: 'available', patient: null },
              { id: 'TN-13', status: 'available', patient: null },
              { id: 'TN-14', status: 'available', patient: null },
            ]
          },
          {
            id: 'SOL', name: 'Solution Preparation Area — 4 Units', type: 'solution', status: 'active',
            note: 'IV fluid preparation for neonatal and postnatal patients',
            beds: [
              { id: 'SOL-1', status: 'occupied', patient: 'Unit 1 — In use (neonatal TPN prep)' },
              { id: 'SOL-2', status: 'occupied', patient: 'Unit 2 — In use (IV antibiotic prep)' },
              { id: 'SOL-3', status: 'available', patient: null },
              { id: 'SOL-4', status: 'available', patient: null },
            ]
          },
        ]
      },
      {
        id: '2f-postnatal', name: 'Postnatal Ward', type: 'postnatal',
        note: 'Main postnatal accommodation for mothers — rooming-in encouraged',
        units: [
          { id: 'PN-A', name: 'Postnatal Bay A', type: 'postnatal', status: 'full', note: '6/6 beds occupied',
            beds: Array.from({ length: 6 }, (_, i) => ({ id: `PN-A-B${i+1}`, status: 'occupied', patient: ['Mrs. T. Moyo — Day 5', 'Mrs. A. Gumbo — Day 3', 'Mrs. S. Mwanza — Day 2', 'Mrs. P. Mhuka — Day 4', 'Mrs. M. Zimuto — Day 1', 'Mrs. L. Banda — Day 3'][i] })) },
          { id: 'PN-B', name: 'Postnatal Bay B', type: 'postnatal', status: 'partial', note: '4/6 beds occupied',
            beds: [ ...Array.from({ length: 4 }, (_, i) => ({ id: `PN-B-B${i+1}`, status: 'occupied', patient: ['Mrs. R. Dube — Day 2', 'Mrs. C. Sithole — Day 5', 'Mrs. N. Mupfuro — Day 1', 'Mrs. B. Musabayana — Day 3'][i] })), { id: 'PN-B-B5', status: 'available', patient: null }, { id: 'PN-B-B6', status: 'available', patient: null } ] },
          { id: 'PN-C', name: 'Postnatal Bay C', type: 'postnatal', status: 'partial', note: '3/6 beds occupied',
            beds: [ ...Array.from({ length: 3 }, (_, i) => ({ id: `PN-C-B${i+1}`, status: 'occupied', patient: ['Mrs. E. Muyambo — Day 1', 'Mrs. J. Makore — Day 2', 'Mrs. F. Dhliwayo — Day 4'][i] })), ...Array.from({ length: 3 }, (_, i) => ({ id: `PN-C-B${i+4}`, status: 'available', patient: null })) ] },
        ]
      },
      {
        id: '2f-unwell', name: 'Unwell Postnatal Women — 10 Units · 20 Beds', type: 'ward',
        note: 'Ward for postnatal women with complications requiring continued monitoring',
        units: [
          { id: 'UW1',  name: 'Unit 1',  type: 'ward', status: 'full',      beds: [{ id: 'UW1-B1', status: 'critical', patient: 'Mrs. Rutendo Dube — Severe pre-eclampsia, MgSO4' }, { id: 'UW1-B2', status: 'occupied', patient: 'Mrs. F. Mupambi — GDM management' }] },
          { id: 'UW2',  name: 'Unit 2',  type: 'ward', status: 'full',      beds: [{ id: 'UW2-B1', status: 'occupied', patient: 'Mrs. C. Ncube — Post-op CS Day 2, BP monitoring' }, { id: 'UW2-B2', status: 'occupied', patient: 'Mrs. G. Mukwena — HIV+ post-CS, ARV review' }] },
          { id: 'UW3',  name: 'Unit 3',  type: 'ward', status: 'partial',   beds: [{ id: 'UW3-B1', status: 'occupied', patient: 'Mrs. S. Moyo — Wound infection, antibiotics' }, { id: 'UW3-B2', status: 'available', patient: null }] },
          { id: 'UW4',  name: 'Unit 4',  type: 'ward', status: 'partial',   beds: [{ id: 'UW4-B1', status: 'occupied', patient: 'Mrs. A. Choto — PPH, stabilised on transfusion' }, { id: 'UW4-B2', status: 'available', patient: null }] },
          { id: 'UW5',  name: 'Unit 5',  type: 'ward', status: 'full',      beds: [{ id: 'UW5-B1', status: 'occupied', patient: 'Mrs. T. Zvobgo — Post-CS urinary retention' }, { id: 'UW5-B2', status: 'occupied', patient: 'Mrs. P. Marufu — Puerperal pyrexia, IV antibiotics' }] },
          { id: 'UW6',  name: 'Unit 6',  type: 'ward', status: 'available', beds: [{ id: 'UW6-B1', status: 'available', patient: null }, { id: 'UW6-B2', status: 'available', patient: null }] },
          { id: 'UW7',  name: 'Unit 7',  type: 'ward', status: 'partial',   beds: [{ id: 'UW7-B1', status: 'occupied', patient: 'Mrs. R. Mhuri — Severe anaemia, transfusion Day 2' }, { id: 'UW7-B2', status: 'available', patient: null }] },
          { id: 'UW8',  name: 'Unit 8',  type: 'ward', status: 'full',      beds: [{ id: 'UW8-B1', status: 'occupied', patient: 'Mrs. M. Mwanza — Postnatal depression obs.' }, { id: 'UW8-B2', status: 'occupied', patient: 'Mrs. K. Musariri — Mastitis, antibiotics' }] },
          { id: 'UW9',  name: 'Unit 9',  type: 'ward', status: 'partial',   beds: [{ id: 'UW9-B1', status: 'occupied', patient: 'Mrs. L. Mupanduki — Wound dehiscence, reviewed' }, { id: 'UW9-B2', status: 'cleaning', patient: null }] },
          { id: 'UW10', name: 'Unit 10', type: 'ward', status: 'available', beds: [{ id: 'UW10-B1', status: 'available', patient: null }, { id: 'UW10-B2', status: 'available', patient: null }] },
        ]
      },
    ],
    stats: { totalBeds: 58, occupiedBeds: 45, patientCount: 52, alertCount: 1 },
    alerts: ['NICU — Baby Mukwena (29wk, ventilated) — critical monitoring ongoing'],
  },

  /* ═══════════════════════════════════════════════
     THIRD FLOOR — Kangaroo Mother Care Unit
     ═══════════════════════════════════════════════ */
  {
    id: 'third', num: '3F', name: 'Third Floor',
    subtitle: 'Kangaroo Mother Care Unit · Specialised Ward',
    description: 'Specialised Kangaroo Mother Care (KMC) unit for stable preterm and low birth weight babies and their mothers. Has its own delivery rooms, ward, and nursing station.',
    matron: { name: 'Sr. Tendai Mwari',     id: 'STF-022', phone: '+263 77 444 5566', since: 'Sep 2019' },
    sic:    { name: 'Sr. Primrose Mapuranga', id: 'STF-023', phone: '+263 77 777 8899', since: 'Apr 2022' },
    nursesOnDuty: 4,
    monitors: [
      { id: '3F-M1', name: 'Monitor 1 — KMC Ward Entrance', status: 'online',  location: 'KMC Ward Entrance', content: 'KMC Progress Board & Education Displays' },
      { id: '3F-M2', name: 'Monitor 2 — Delivery Area',     status: 'standby', location: 'Delivery Area',     content: 'Queue Display (standby — low demand)' },
    ],
    sections: [
      {
        id: '3f-admin', name: 'Administration & Support', type: 'admin',
        units: [
          { id: '3F-NS',  name: "Nurses' Management Station", type: 'station', status: 'active', note: '4 specialist KMC nurses on duty', beds: null },
          { id: '3F-MO',  name: "Floor Matron's Office",      type: 'office',  status: 'active', note: 'Sr. Tendai Mwari — in office',    beds: null },
          { id: '3F-SIC', name: "Sister-in-Charge's Office",  type: 'office',  status: 'active', note: 'Sr. Primrose Mapuranga — in office', beds: null },
        ]
      },
      {
        id: '3f-delivery', name: 'KMC Delivery Rooms', type: 'delivery',
        note: 'Dedicated smaller delivery area for KMC-eligible mothers',
        units: [
          { id: 'KDR1', name: 'KMC Delivery Room 1', type: 'delivery', status: 'available',
            beds: [{ id: 'KDR1-B1', status: 'available', patient: null }, { id: 'KDR1-B2', status: 'available', patient: null }] },
          { id: 'KDR2', name: 'KMC Delivery Room 2', type: 'delivery', status: 'partial',
            beds: [{ id: 'KDR2-B1', status: 'occupied', patient: 'Mrs. C. Maposa — 36wk, imminent preterm delivery' }, { id: 'KDR2-B2', status: 'available', patient: null }] },
          { id: 'KDR3', name: 'KMC Delivery Room 3', type: 'delivery', status: 'available',
            beds: [{ id: 'KDR3-B1', status: 'available', patient: null }, { id: 'KDR3-B2', status: 'available', patient: null }] },
        ]
      },
      {
        id: '3f-kmc', name: 'Kangaroo Mother Care Ward', type: 'kmc',
        note: 'Mother–baby pairs doing continuous KMC skin-to-skin contact. Mothers admitted with babies.',
        units: [
          { id: 'KMC-A', name: 'KMC Bay A', type: 'kmc', status: 'full', note: '4/4 mother-baby pairs',
            beds: [
              { id: 'KMC-A1', status: 'occupied', patient: 'Mrs. Rudo Hove + Baby (35wk, 1.8kg) — Day 8 KMC' },
              { id: 'KMC-A2', status: 'occupied', patient: 'Mrs. Sasha Muza + Baby (34wk, 1.6kg) — Day 5 KMC' },
              { id: 'KMC-A3', status: 'occupied', patient: 'Mrs. Loveness Biti + Baby (36wk, 2.0kg) — Day 3 KMC' },
              { id: 'KMC-A4', status: 'occupied', patient: 'Mrs. Melody Tsiga + Baby (34wk, 1.7kg) — Day 6 KMC' },
            ]},
          { id: 'KMC-B', name: 'KMC Bay B', type: 'kmc', status: 'partial', note: '3/4 mother-baby pairs',
            beds: [
              { id: 'KMC-B1', status: 'occupied', patient: 'Mrs. Faith Mavhu + Baby (35wk, 1.9kg) — Day 2 KMC' },
              { id: 'KMC-B2', status: 'occupied', patient: 'Mrs. Grace Mawema + Baby (33wk, 1.5kg) — Day 10 KMC' },
              { id: 'KMC-B3', status: 'occupied', patient: 'Mrs. Chipo Dete + Baby (36wk, 2.1kg) — Day 4 KMC' },
              { id: 'KMC-B4', status: 'available', patient: null },
            ]},
          { id: 'KMC-C', name: 'KMC Bay C', type: 'kmc', status: 'partial', note: '2/4 mother-baby pairs',
            beds: [
              { id: 'KMC-C1', status: 'occupied', patient: 'Mrs. Rutendo Mash + Baby (37wk, 2.3kg) — Day 1 KMC' },
              { id: 'KMC-C2', status: 'occupied', patient: 'Mrs. Memory Tande + Baby (35wk, 1.8kg) — Day 7 KMC' },
              { id: 'KMC-C3', status: 'available', patient: null },
              { id: 'KMC-C4', status: 'available', patient: null },
            ]},
        ]
      },
      {
        id: '3f-support', name: 'KMC Education & Support Area', type: 'support-kmc',
        units: [
          { id: 'KMC-EDU',  name: 'KMC Education Room',         type: 'support', status: 'active', note: 'Daily breastfeeding & KMC education sessions 10:00 & 14:00', beds: null },
          { id: 'KMC-EXPR', name: 'Breast Milk Expression Room', type: 'support', status: 'active', note: '3 mothers currently expressing — peer support available',    beds: null },
          { id: 'KMC-COOK', name: 'Mothers\' Kitchen',           type: 'support', status: 'active', note: 'Nutritional support kitchen for admitted KMC mothers',         beds: null },
        ]
      },
    ],
    stats: { totalBeds: 18, occupiedBeds: 10, patientCount: 18, alertCount: 0 },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function computeFloorBedStats(floor) {
  let total = 0, occupied = 0, critical = 0, available = 0;
  floor.sections.forEach(s => s.units.forEach(u => {
    if (u.beds) {
      u.beds.forEach(b => {
        total++;
        if (b.status === 'occupied') occupied++;
        if (b.status === 'critical') { occupied++; critical++; }
        if (b.status === 'available') available++;
      });
    }
  }));
  return { total, occupied, critical, available, pct: total ? Math.round((occupied / total) * 100) : 0 };
}

function PersonnelChip({ label, name, phone }) {
  const initials = name.replace(/^Sr\.\s+|^Dr\.\s+|^Mr\.\s+|^Ms\.\s+/, '').split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--pm-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, flexShrink: 0 }}>{initials}</div>
      <div>
        <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
        <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{name}</div>
      </div>
    </div>
  );
}

function BedDot({ bed }) {
  const cfg = BED_CFG[bed.status] || BED_CFG.available;
  return (
    <div title={bed.patient || 'Available'} style={{
      width: 22, height: 22, borderRadius: 5,
      background: cfg.bg,
      border: `1.5px solid ${cfg.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: bed.patient ? 'help' : 'default', flexShrink: 0,
    }}>
      {bed.status === 'occupied' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot }} />}
      {bed.status === 'critical' && <span style={{ fontSize: '10px', lineHeight: 1 }}>!</span>}
      {bed.status === 'cleaning' && <span style={{ fontSize: '9px', lineHeight: 1 }}>↻</span>}
      {bed.status === 'reserved' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot }} />}
    </div>
  );
}

function MonitorChip({ monitor }) {
  const online = monitor.status === 'online';
  const standby = monitor.status === 'standby';
  const color = online ? '#16a34a' : standby ? '#6366f1' : '#dc2626';
  const Icon = online ? Wifi : standby ? Radio : WifiOff;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px', background: online ? '#f0fdf4' : standby ? '#eef2ff' : '#fff1f2', border: `1px solid ${color}40`, borderRadius: 7 }}>
      <Icon size={13} style={{ color, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color }}>{monitor.name}</div>
        <div style={{ fontSize: '0.67rem', color: 'var(--pm-text-muted)' }}>{monitor.content}</div>
      </div>
    </div>
  );
}

const SECTION_ICONS = {
  admin: Building2, clinical: Stethoscope, theatre: Activity,
  delivery: Heart, recovery: Shield, postnatal: Baby,
  nursery: Baby, nicu: Baby, ward: BedDouble, kmc: Heart,
  'support-kmc': Home, 'recovery-theatre': Shield,
};

const SECTION_COLORS = {
  admin: '#64748b', clinical: '#0284c7', theatre: '#7c3aed',
  delivery: '#ec4899', recovery: '#0d9488', postnatal: '#16a34a',
  nursery: '#f59e0b', nicu: '#dc2626', ward: '#6366f1', kmc: '#ec4899',
  'support-kmc': '#0d9488',
};

const UNIT_TYPE_COLORS = {
  'station': '#6366f1', 'office': '#64748b', 'scan': '#0284c7',
  'clinic': '#0d9488', 'admissions': '#f59e0b', 'support': '#64748b',
  'theatre-or': '#7c3aed', 'theatre-recovery': '#6366f1',
  'delivery': '#ec4899', 'recovery': '#0d9488',
  'nicu': '#dc2626', 'preterm': '#f59e0b', 'term-nursery': '#16a34a',
  'solution': '#0284c7', 'postnatal': '#16a34a',
  'ward': '#6366f1', 'kmc': '#ec4899',
};

// ─────────────────────────────────────────────────────────────────────────────
// FLOOR OVERVIEW CARD
// ─────────────────────────────────────────────────────────────────────────────

function FloorCard({ floor, onClick }) {
  const { color, light, ring } = FLOOR_COLORS[floor.id] || FLOOR_COLORS.ground;
  const bedStats = computeFloorBedStats(floor);
  const pct = bedStats.total > 0 ? bedStats.pct : null;
  const hasCritical = bedStats.critical > 0 || (floor.alerts && floor.alerts.length > 0);
  const alertCount = floor.stats?.alertCount ?? 0;

  const sectionSummary = floor.sections
    .filter(s => s.type !== 'admin')
    .slice(0, 4);

  return (
    <div onClick={onClick} style={{
      border: `1.5px solid ${hasCritical ? '#dc2626' : 'var(--pm-border)'}`,
      borderLeft: `5px solid ${color}`,
      borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
      background: 'var(--pm-card-bg, #fff)',
      transition: 'box-shadow 0.15s ease, transform 0.1s ease',
      boxShadow: hasCritical ? '0 0 0 2px #fee2e2' : 'none',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 16px ${color}30`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = hasCritical ? '0 0 0 2px #fee2e2' : 'none'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* Card Header */}
      <div style={{ background: color, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.02em' }}>
            {floor.num}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>{floor.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.73rem' }}>{floor.subtitle}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {hasCritical && (
            <span style={{ background: '#fff', color: '#dc2626', borderRadius: 20, padding: '2px 10px', fontSize: '0.68rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertTriangle size={10} /> {alertCount} ALERT{alertCount !== 1 ? 'S' : ''}
            </span>
          )}
          <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: '0.7rem', fontWeight: 700 }}>
            {floor.stats?.patientCount ?? 0} Patients
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '14px 18px' }}>
        {/* Occupancy bar */}
        {pct !== null && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--pm-text-muted)', fontWeight: 600 }}>Bed Occupancy</span>
              <span style={{ fontWeight: 800, color: pct >= 90 ? '#dc2626' : pct >= 75 ? '#d97706' : '#16a34a' }}>{pct}%</span>
            </div>
            <div style={{ height: 6, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: pct >= 90 ? '#dc2626' : pct >= 75 ? '#f59e0b' : color, borderRadius: 4, transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>
              <span>{bedStats.occupied} occupied</span>
              {bedStats.critical > 0 && <span style={{ color: '#dc2626', fontWeight: 700 }}>⚠ {bedStats.critical} critical</span>}
              <span>{bedStats.available} available</span>
            </div>
          </div>
        )}

        {/* Section summary pills */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {sectionSummary.map(s => {
            const sColor = SECTION_COLORS[s.type] || '#64748b';
            return (
              <span key={s.id} style={{ fontSize: '0.67rem', fontWeight: 600, color: sColor, background: `${sColor}12`, border: `1px solid ${sColor}30`, borderRadius: 20, padding: '2px 8px' }}>
                {s.name.split(' — ')[0].split(' · ')[0].replace(' Complex', '').replace(' Ward', '').replace(' Rooms', '')}
              </span>
            );
          })}
        </div>

        {/* Personnel */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid var(--pm-border)', marginBottom: 12 }}>
          <PersonnelChip label="Floor Matron" name={floor.matron.name} />
          <PersonnelChip label="Sister-in-Charge" name={floor.sic.name} />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 12, fontSize: '0.73rem', color: 'var(--pm-text-muted)' }}>
            <span>👩‍⚕️ {floor.nursesOnDuty} Nurses</span>
            <span>🖥 {floor.monitors.length} Monitors</span>
          </div>
          <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 5, color, borderColor: color }}>
            View Floor <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIT CARD — used in floor detail
// ─────────────────────────────────────────────────────────────────────────────

function UnitCard({ unit, floorColor }) {
  const hasBeds = unit.beds && unit.beds.length > 0;
  const sCfg = UNIT_STATUS_CFG[unit.status] || UNIT_STATUS_CFG.active;
  const typeColor = UNIT_TYPE_COLORS[unit.type] || '#64748b';
  const occupied = hasBeds ? unit.beds.filter(b => b.status === 'occupied' || b.status === 'critical').length : null;
  const total = hasBeds ? unit.beds.length : null;
  const isCritical = unit.status === 'critical' || (hasBeds && unit.beds.some(b => b.status === 'critical'));

  return (
    <div style={{
      border: `1px solid ${isCritical ? '#dc2626' : 'var(--pm-border)'}`,
      borderRadius: 8, padding: '10px 12px', background: isCritical ? '#fff5f5' : 'var(--pm-card-bg, #fff)',
      boxShadow: isCritical ? '0 0 0 2px #fecaca' : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: hasBeds ? 8 : 0, gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.83rem', marginBottom: 2 }}>{unit.name}</div>
          {unit.note && <div style={{ fontSize: '0.73rem', color: 'var(--pm-text-muted)', lineHeight: 1.4 }}>{unit.note}</div>}
          {unit.queue != null && (
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#d97706', marginTop: 2 }}>
              🕐 Queue: {unit.queue}
            </div>
          )}
          {unit.capacity != null && unit.current != null && (
            <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>
              {unit.current}/{unit.capacity} capacity
            </div>
          )}
        </div>
        <span style={{ fontSize: '0.66rem', fontWeight: 700, color: sCfg.color, background: sCfg.bg, borderRadius: 20, padding: '2px 8px', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {sCfg.label}
        </span>
      </div>

      {hasBeds && (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--pm-border)' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)', marginRight: 2 }}>Beds:</span>
          {unit.beds.map(b => <BedDot key={b.id} bed={b} />)}
          {occupied !== null && (
            <span style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)', marginLeft: 4 }}>
              {occupied}/{total}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOOR DETAIL PAGE
// ─────────────────────────────────────────────────────────────────────────────

function FloorDetail({ floor, onBack }) {
  const [activeSection, setActiveSection] = useState('all');
  const { color, light } = FLOOR_COLORS[floor.id] || FLOOR_COLORS.ground;
  const bedStats = computeFloorBedStats(floor);

  const nonAdminSections = floor.sections.filter(s => s.type !== 'admin');
  const adminSection = floor.sections.find(s => s.type === 'admin');

  // Collect all patients across all beds
  const allPatients = useMemo(() => {
    const list = [];
    floor.sections.forEach(s => {
      s.units.forEach(u => {
        if (u.beds) {
          u.beds.filter(b => b.patient).forEach(b => {
            list.push({ bed: b.id, patient: b.patient, room: u.name, status: b.status, section: s.name });
          });
        }
      });
    });
    return list;
  }, [floor]);

  return (
    <div>
      {/* Back button */}
      <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={onBack} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <ChevronLeft size={16} /> Back to Facility Overview
      </button>

      {/* Floor Header */}
      <div style={{ background: color, borderRadius: 12, padding: '18px 22px', marginBottom: 16, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 900, fontSize: '1.8rem', lineHeight: 1 }}>{floor.num}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{floor.name}</div>
                <div style={{ opacity: 0.8, fontSize: '0.8rem' }}>{floor.subtitle}</div>
              </div>
            </div>
            <div style={{ opacity: 0.85, fontSize: '0.8rem', marginTop: 8, maxWidth: 560 }}>{floor.description}</div>
          </div>
          {(floor.alerts && floor.alerts.length > 0) && (
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 14px', maxWidth: 280 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.8, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ⚠ Active Alerts
              </div>
              {floor.alerts.map((a, i) => (
                <div key={i} style={{ fontSize: '0.77rem', opacity: 0.9, marginBottom: i < floor.alerts.length - 1 ? 4 : 0 }}>• {a}</div>
              ))}
            </div>
          )}
        </div>

        {/* Stat row */}
        <div style={{ display: 'flex', gap: 20, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.2)', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Beds', value: bedStats.total },
            { label: 'Occupied', value: bedStats.occupied },
            { label: 'Available', value: bedStats.available },
            { label: 'Critical', value: bedStats.critical },
            { label: 'Patients', value: floor.stats?.patientCount ?? allPatients.length },
            { label: 'Nurses on Duty', value: floor.nursesOnDuty },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: '0.68rem', opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 1 }}>{s.label}</div>
              <div style={{ fontWeight: 800, fontSize: '1.35rem', lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Personnel + Monitors Row */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <div className="pm-card">
            <div className="pm-section-title" style={{ marginBottom: 12 }}>Floor Personnel</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ label: 'Floor Matron', ...floor.matron }, { label: 'Sister-in-Charge', ...floor.sic }].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', borderRadius: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                    {p.name.replace(/^Sr\.\s+|^Dr\.\s+/, '').split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.label}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>{p.id} · Since {p.since}</div>
                  </div>
                  <a href={`tel:${p.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: color, fontWeight: 600, textDecoration: 'none' }}>
                    <Phone size={12} /> {p.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="pm-card">
            <div className="pm-section-title" style={{ marginBottom: 12 }}>Floor Display Monitors</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {floor.monitors.map(m => <MonitorChip key={m.id} monitor={m} />)}
            </div>
            {floor.monitors.some(m => m.status === 'offline') && (
              <div style={{ marginTop: 10, padding: '8px 12px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 6, fontSize: '0.77rem', color: '#dc2626', fontWeight: 600 }}>
                ⚠ One or more monitors offline — log a fault report
              </div>
            )}
            {adminSection && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--pm-border)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--pm-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Units</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {adminSection.units.map(u => (
                    <span key={u.id} style={{ fontSize: '0.7rem', background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', borderRadius: 6, padding: '3px 9px', color: 'var(--pm-text-muted)' }}>
                      {u.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bed legend */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', fontWeight: 600, alignSelf: 'center' }}>Bed Status:</span>
        {Object.entries(BED_CFG).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: v.bg, border: `1.5px solid ${v.border}` }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>{v.label}</span>
          </div>
        ))}
      </div>

      {/* Sections */}
      {nonAdminSections.map(section => {
        const SIcon = SECTION_ICONS[section.type] || Layers;
        const sColor = SECTION_COLORS[section.type] || '#64748b';
        const bedCount = section.units.reduce((acc, u) => acc + (u.beds ? u.beds.length : 0), 0);
        const occupiedCount = section.units.reduce((acc, u) => acc + (u.beds ? u.beds.filter(b => b.status === 'occupied' || b.status === 'critical').length : 0), 0);
        const criticalUnits = section.units.filter(u => u.status === 'critical' || (u.beds && u.beds.some(b => b.status === 'critical')));

        return (
          <div key={section.id} className="pm-card" style={{ marginBottom: 14, borderLeft: `3px solid ${sColor}` }}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: `${sColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <SIcon size={18} style={{ color: sColor }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>{section.name}</div>
                  {section.note && <div style={{ fontSize: '0.73rem', color: 'var(--pm-text-muted)' }}>{section.note}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {criticalUnits.length > 0 && (
                  <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 20, padding: '2px 10px', fontSize: '0.68rem', fontWeight: 800 }}>
                    ⚠ {criticalUnits.length} Critical
                  </span>
                )}
                {bedCount > 0 && (
                  <span style={{ background: `${sColor}12`, color: sColor, borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700, border: `1px solid ${sColor}30` }}>
                    {occupiedCount}/{bedCount} beds
                  </span>
                )}
              </div>
            </div>

            {/* Units grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
              {section.units.map(unit => (
                <UnitCard key={unit.id} unit={unit} floorColor={sColor} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Patient List */}
      {allPatients.length > 0 && (
        <div className="pm-card">
          <div className="pm-section-header" style={{ marginBottom: 12 }}>
            <div>
              <div className="pm-section-title">All Patients on {floor.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{allPatients.length} patients currently housed on this floor</div>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="pm-table">
              <thead>
                <tr><th>PATIENT</th><th>ROOM / UNIT</th><th>SECTION</th><th>BED STATUS</th></tr>
              </thead>
              <tbody>
                {allPatients.map((p, i) => {
                  const bCfg = BED_CFG[p.status] || BED_CFG.occupied;
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, fontSize: '0.83rem' }}>{p.patient}</td>
                      <td style={{ color: 'var(--pm-text-muted)', fontSize: '0.8rem' }}>{p.room}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{p.section.split(' — ')[0].split(' · ')[0]}</td>
                      <td>
                        <span style={{ fontSize: '0.66rem', fontWeight: 700, color: bCfg.bg === '#e5e7eb' ? '#6b7280' : bCfg.border, background: `${bCfg.bg}`, border: `1px solid ${bCfg.border}40`, borderRadius: 20, padding: '2px 8px' }}>
                          {bCfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FACILITY MANAGEMENT PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function FacilityManagementPage({ user, onNavigate }) {
  const [selectedFloor, setSelectedFloor] = useState(null);

  const hospitalStats = useMemo(() => {
    let totalBeds = 0, occupied = 0, critical = 0, available = 0, patients = 0, alerts = 0;
    FLOORS.forEach(f => {
      const bs = computeFloorBedStats(f);
      totalBeds += bs.total;
      occupied += bs.occupied;
      critical += bs.critical;
      available += bs.available;
      patients += f.stats?.patientCount ?? 0;
      alerts += f.stats?.alertCount ?? 0;
    });
    return { totalBeds, occupied, critical, available, patients, alerts, pct: totalBeds ? Math.round((occupied / totalBeds) * 100) : 0 };
  }, []);

  if (selectedFloor) {
    return <FloorDetail floor={selectedFloor} onBack={() => setSelectedFloor(null)} />;
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Facility Management</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>Parirenyatwa Group of Hospitals — Maternity Unit · 4 Floors · Real-time Occupancy</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Monitor size={13} /> Monitor Status
          </button>
          <button className="pm-btn pm-btn-primary pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Zap size={13} /> Log Fault
          </button>
        </div>
      </div>

      {/* Hospital-wide stat cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Hospital Beds', value: hospitalStats.totalBeds, sub: 'Across all floors', icon: BedDouble, color: '#6366f1', primary: false },
          { label: 'Occupied Beds', value: hospitalStats.occupied, sub: `${hospitalStats.pct}% occupancy rate`, icon: Users, color: '#0d9488', primary: false },
          { label: 'Available Beds', value: hospitalStats.available, sub: 'Ready for admission', icon: CheckCircle, color: '#16a34a', primary: false },
          { label: 'Critical Patients', value: hospitalStats.critical, sub: 'Requiring urgent attention', icon: AlertTriangle, color: '#dc2626', alert: true },
          { label: 'Total Patients', value: hospitalStats.patients, sub: 'Across all wards', icon: Baby, color: '#ec4899', primary: false },
          { label: 'Active Alerts', value: hospitalStats.alerts, sub: 'Requiring follow-up', icon: Zap, color: '#f59e0b', alert: hospitalStats.alerts > 0 },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="col-6 col-md-4 col-xl-2">
              <div className="pm-stat-card secondary" style={{ borderLeft: `3px solid ${s.color}`, ...(s.alert ? { border: `1px solid ${s.color}`, borderLeft: `3px solid ${s.color}` } : {}) }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Icon size={18} style={{ color: s.color }} />
                  {s.alert && s.value > 0 && <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'block', boxShadow: `0 0 0 3px ${s.color}30` }} />}
                </div>
                <div className="pm-card-title" style={{ fontSize: '0.73rem' }}>{s.label}</div>
                <div className="pm-stat-value" style={{ fontSize: '1.9rem', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hospital-wide occupancy bar */}
      <div className="pm-card" style={{ padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Hospital Bed Occupancy — All Floors</div>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: hospitalStats.pct >= 90 ? '#dc2626' : hospitalStats.pct >= 75 ? '#d97706' : '#16a34a' }}>
            {hospitalStats.pct}%
          </span>
        </div>
        <div style={{ height: 10, background: '#e5e7eb', borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
          {FLOORS.map(f => {
            const bs = computeFloorBedStats(f);
            const floorPct = hospitalStats.totalBeds ? (bs.total / hospitalStats.totalBeds) * 100 : 0;
            const occupiedPct = bs.total ? (bs.occupied / bs.total) * 100 : 0;
            const { color } = FLOOR_COLORS[f.id];
            return (
              <div key={f.id} title={`${f.name}: ${bs.occupied}/${bs.total} beds`} style={{ width: `${floorPct}%`, height: '100%', position: 'relative', cursor: 'pointer' }} onClick={() => setSelectedFloor(f)}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${occupiedPct}%`, background: color }} />
                <div style={{ position: 'absolute', right: 0, top: 0, width: 1, height: '100%', background: '#fff', zIndex: 1 }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
          {FLOORS.map(f => {
            const { color } = FLOOR_COLORS[f.id];
            const bs = computeFloorBedStats(f);
            return (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }} onClick={() => setSelectedFloor(f)}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>
                  {f.num} — {bs.occupied}/{bs.total} ({bs.total ? Math.round((bs.occupied / bs.total) * 100) : 0}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floor Cards Grid */}
      <div style={{ marginBottom: 8, fontWeight: 700, fontSize: '0.88rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Select a floor to view full details
      </div>
      <div className="row g-3">
        {FLOORS.map(floor => (
          <div key={floor.id} className="col-12 col-md-6">
            <FloorCard floor={floor} onClick={() => setSelectedFloor(floor)} />
          </div>
        ))}
      </div>
    </div>
  );
}