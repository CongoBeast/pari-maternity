import React, { useState, useMemo } from 'react';
import {
  BedDouble, Users, AlertTriangle, CheckCircle, Activity,
  Baby, Heart, Stethoscope, Building2, Shield, Wrench,
  Phone, MapPin, Clock, ChevronLeft, X, Bell, Megaphone,
  Wifi, WifiOff, Radio, Info, Plus, ArrowRight, Eye,
  Home, Layers, ZapOff, User
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// SHARED CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const FLOOR_COLORS = {
  ground: { color: '#f59e0b', light: '#fffbeb', dark: '#d97706' },
  first:  { color: '#7c3aed', light: '#f5f3ff', dark: '#6d28d9' },
  second: { color: '#0d9488', light: '#f0fdfa', dark: '#0f766e' },
  third:  { color: '#ec4899', light: '#fdf2f8', dark: '#db2777' },
};

const BED_CFG = {
  occupied:  { bg: '#16a34a', border: '#15803d', text: '#fff', label: 'Occupied',  icon: '●' },
  available: { bg: '#e5e7eb', border: '#d1d5db', text: '#9ca3af', label: 'Available', icon: '○' },
  cleaning:  { bg: '#f59e0b', border: '#d97706', text: '#fff', label: 'Cleaning',  icon: '↻' },
  critical:  { bg: '#dc2626', border: '#b91c1c', text: '#fff', label: 'Critical',  icon: '!' },
  reserved:  { bg: '#3b82f6', border: '#2563eb', text: '#fff', label: 'Reserved',  icon: '◈' },
};

const UNIT_STATUS_CFG = {
  full:      { color: '#dc2626', bg: '#fee2e2', label: 'Full' },
  partial:   { color: '#d97706', bg: '#fef3c7', label: 'Partial' },
  available: { color: '#16a34a', bg: '#dcfce7', label: 'Available' },
  occupied:  { color: '#7c3aed', bg: '#f3e8ff', label: 'In Use' },
  cleaning:  { color: '#f59e0b', bg: '#fef3c7', label: 'Cleaning' },
  critical:  { color: '#dc2626', bg: '#fee2e2', label: '⚠ CRITICAL' },
  active:    { color: '#16a34a', bg: '#dcfce7', label: 'Active' },
  busy:      { color: '#d97706', bg: '#fef3c7', label: 'Busy' },
  offline:   { color: '#64748b', bg: '#f1f5f9', label: 'Offline' },
  standby:   { color: '#6366f1', bg: '#eef2ff', label: 'Standby' },
};

const SECTION_COLORS = {
  admin: '#64748b', clinical: '#0284c7', theatre: '#7c3aed',
  delivery: '#ec4899', recovery: '#0d9488', postnatal: '#16a34a',
  nursery: '#f59e0b', nicu: '#dc2626', ward: '#6366f1', kmc: '#ec4899',
  'support-kmc': '#0d9488',
};

// ─────────────────────────────────────────────────────────────────────────────
// HOSPITAL FLOORS DATA (same source as FacilityManagementPage)
// ─────────────────────────────────────────────────────────────────────────────

const FLOORS = [
  {
    id: 'ground', num: 'GF', name: 'Ground Floor',
    subtitle: 'Admissions · Antenatal Clinic · Diagnostics',
    description: 'Main patient entry point. Houses the admissions desk, two diagnostic scan rooms, the antenatal clinic, and all administrative records.',
    matron: { name: 'Sr. Chipo Mutasa',  id: 'STF-016', phone: '+263 77 111 2233', since: 'Mar 2016' },
    sic:    { name: 'Sr. Agnes Dube',    id: 'STF-017', phone: '+263 77 444 5566', since: 'Jan 2019' },
    nursesOnDuty: 4,
    notices: [
      { id: 'gf-n1', title: 'ANC Queue Running High', body: 'Antenatal clinic backed up — 7 patients still waiting. Consider extending to 16:30 today.', time: '10:45', priority: 'warning' },
      { id: 'gf-n2', title: 'Scan Room 2 Next Patient', body: 'Mrs. Farai Mucheke (36-wk) due in 15 min. Room cleared and ready.', time: '11:00', priority: 'info' },
    ],
    monitors: [
      { id: 'GF-M1', name: 'Monitor 1 — Lobby Display',    status: 'online',  content: 'Queue Numbers & Announcements' },
      { id: 'GF-M2', name: 'Monitor 2 — ANC Waiting Area', status: 'online',  content: 'Appointment Queue Display' },
    ],
    sections: [
      {
        id: 'gf-admin', name: 'Administration & Support', type: 'admin',
        units: [
          { id: 'GF-NS',  name: "Nurses' Station",       type: 'station', status: 'active',  note: '4 nurses on duty — shift handover 19:00', beds: null },
          { id: 'GF-MO',  name: "Matron's Office",       type: 'office',  status: 'active',  note: 'Sr. Chipo Mutasa — in office',            beds: null },
          { id: 'GF-SIC', name: "Sister-in-Charge",      type: 'office',  status: 'active',  note: 'Sr. Agnes Dube — in office',              beds: null },
          { id: 'GF-BR',  name: 'Birth Records Office',  type: 'office',  status: 'active',  note: '2 records clerks on duty 08:00–16:00',    beds: null },
        ],
      },
      {
        id: 'gf-clinical', name: 'Clinical & Diagnostic Services', type: 'clinical',
        units: [
          { id: 'GF-ADM', name: 'Admissions Desk',  type: 'admissions', status: 'busy',      queue: 8,  note: '8 patients in queue · ~20 min wait', beds: null },
          { id: 'GF-SR1', name: 'Scan Room 1',      type: 'scan',       status: 'occupied',  note: 'Mrs. Rudo Hove — 20-wk anomaly scan in progress',
            beds: [{ id: 'SR1-S1', status: 'occupied', patient: 'Mrs. Rudo Hove (20-wk anomaly scan)' }] },
          { id: 'GF-SR2', name: 'Scan Room 2',      type: 'scan',       status: 'available', note: 'Next patient in 15 min',
            beds: [{ id: 'SR2-S1', status: 'available', patient: null }] },
          { id: 'GF-ANC', name: 'Antenatal Clinic', type: 'clinic',     status: 'busy',      queue: 7, note: '18 patients seen · 7 remaining', capacity: 25, current: 18, beds: null },
        ],
      },
    ],
    stats: { totalBeds: 2, occupiedBeds: 1, patientCount: 19, alertCount: 0 },
  },
  {
    id: 'first', num: '1F', name: 'First Floor',
    subtitle: 'Operating Theatre · Delivery Rooms · Recovery',
    description: 'Clinical hub of the maternity unit. Full operating theatre complex, 7 delivery rooms, and 6 post-delivery recovery rooms.',
    matron: { name: 'Sr. Memory Murewa', id: 'STF-018', phone: '+263 77 222 3344', since: 'Jun 2018' },
    sic:    { name: 'Sr. Anesu Maposa',  id: 'STF-019', phone: '+263 77 555 6677', since: 'Aug 2020' },
    nursesOnDuty: 8,
    notices: [
      { id: '1f-n1', title: '⚠ DR4 — FETAL DISTRESS', body: 'Emergency team active in Delivery Room 4. Mrs. Priscilla Nyoni — CTG abnormal. Dr. Chigudu en route.', time: '11:05', priority: 'critical' },
      { id: '1f-n2', title: 'Monitor 2 Offline', body: 'Delivery Wing display monitor is offline. Fault has been logged. Estimated repair 14:00.', time: '09:30', priority: 'warning' },
      { id: '1f-n3', title: 'OR1 Emergency LSCS', body: 'Operation Room 1 active — Emergency lower segment CS. Est. completion 12:30.', time: '11:10', priority: 'info' },
    ],
    monitors: [
      { id: '1F-M1', name: 'Monitor 1 — Theatre Corridor', status: 'online',  content: 'Theatre Schedule & Case List' },
      { id: '1F-M2', name: 'Monitor 2 — Delivery Wing',    status: 'offline', content: 'Delivery Queue (OFFLINE — fault reported)' },
    ],
    sections: [
      {
        id: '1f-admin', name: 'Administration & Support', type: 'admin',
        units: [
          { id: '1F-NS',  name: "Nurses' Station", type: 'station', status: 'active', note: '8 nurses on duty across theatre and delivery', beds: null },
          { id: '1F-MO',  name: "Matron's Office",  type: 'office',  status: 'active', note: 'Sr. Memory Murewa — coordinating theatre',    beds: null },
          { id: '1F-SIC', name: "Sister-in-Charge", type: 'office',  status: 'active', note: 'Sr. Anesu Maposa — delivery wing oversight',  beds: null },
        ],
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
          { id: 'TR1', name: 'Theatre Recovery 1', type: 'theatre-recovery', status: 'partial',
            note: '1/2 beds occupied',
            beds: [
              { id: 'TR1-B1', status: 'occupied', patient: 'Mrs. Chiedza Ncube — 3h post-LSCS, stable' },
              { id: 'TR1-B2', status: 'available', patient: null },
            ] },
          { id: 'TR2', name: 'Theatre Recovery 2', type: 'theatre-recovery', status: 'full',
            note: '2/2 beds occupied',
            beds: [
              { id: 'TR2-B1', status: 'occupied', patient: 'Mrs. Spiwe Moyo — 1h post-LSCS' },
              { id: 'TR2-B2', status: 'occupied', patient: 'Mrs. Rumbi Choto — 2h post-LSCS' },
            ] },
          { id: 'TR-WAIT', name: 'Theatre Waiting Room', type: 'support', status: 'busy', queue: 6, note: '6 family members waiting', beds: null },
        ],
      },
      {
        id: '1f-delivery', name: 'Delivery Rooms — 7 Units · 14 Beds', type: 'delivery',
        units: [
          { id: 'DR1', name: 'Delivery Room 1', type: 'delivery', status: 'full',
            beds: [{ id: 'DR1-B1', status: 'occupied', patient: 'Mrs. Rudo Chimuti — Active labour 8 cm' }, { id: 'DR1-B2', status: 'occupied', patient: 'Mrs. Tendai Mhuka — Active labour 6 cm' }] },
          { id: 'DR2', name: 'Delivery Room 2', type: 'delivery', status: 'partial',
            beds: [{ id: 'DR2-B1', status: 'occupied', patient: 'Mrs. Farai Zimuto — Imminent delivery, pushing' }, { id: 'DR2-B2', status: 'available', patient: null }] },
          { id: 'DR3', name: 'Delivery Room 3', type: 'delivery', status: 'full',
            beds: [{ id: 'DR3-B1', status: 'occupied', patient: 'Mrs. Sasha Banda — Induced labour, 5 cm' }, { id: 'DR3-B2', status: 'occupied', patient: 'Mrs. Tanya Makore — Active labour 7 cm' }] },
          { id: 'DR4', name: 'Delivery Room 4', type: 'delivery', status: 'critical',
            note: '⚠ FETAL DISTRESS — Emergency team present',
            beds: [{ id: 'DR4-B1', status: 'critical', patient: 'Mrs. Priscilla Nyoni — Fetal distress CTG — EMERGENCY' }, { id: 'DR4-B2', status: 'occupied', patient: 'Mrs. Loveness Mupfuro — Pushing stage' }] },
          { id: 'DR5', name: 'Delivery Room 5', type: 'delivery', status: 'partial',
            beds: [{ id: 'DR5-B1', status: 'occupied', patient: 'Mrs. Sekai Dhliwayo — Early labour, 4 cm' }, { id: 'DR5-B2', status: 'available', patient: null }] },
          { id: 'DR6', name: 'Delivery Room 6', type: 'delivery', status: 'full',
            beds: [{ id: 'DR6-B1', status: 'occupied', patient: 'Mrs. Melody Musariri — VBAC attempt, monitored' }, { id: 'DR6-B2', status: 'occupied', patient: 'Mrs. Joyce Mwanza — Active labour 9 cm' }] },
          { id: 'DR7', name: 'Delivery Room 7', type: 'delivery', status: 'available',
            beds: [{ id: 'DR7-B1', status: 'available', patient: null }, { id: 'DR7-B2', status: 'available', patient: null }] },
        ],
      },
      {
        id: '1f-recovery', name: 'Post-Delivery Recovery — 6 Units · 12 Beds', type: 'recovery',
        units: [
          { id: 'RR1', name: 'Recovery Room 1', type: 'recovery', status: 'full',
            beds: [{ id: 'RR1-B1', status: 'occupied', patient: 'Mrs. Leticia Gomo — 2h post-NVD, stable' }, { id: 'RR1-B2', status: 'occupied', patient: 'Mrs. Sandra Dziva — 1h post-NVD' }] },
          { id: 'RR2', name: 'Recovery Room 2', type: 'recovery', status: 'partial',
            beds: [{ id: 'RR2-B1', status: 'occupied', patient: 'Mrs. Mercy Zvobgo — 4h post-NVD, transfer pending' }, { id: 'RR2-B2', status: 'cleaning', patient: null }] },
          { id: 'RR3', name: 'Recovery Room 3', type: 'recovery', status: 'full',
            beds: [{ id: 'RR3-B1', status: 'occupied', patient: 'Mrs. Esther Muyambo — 3h post-NVD' }, { id: 'RR3-B2', status: 'occupied', patient: 'Mrs. Kudzai Mhuri — 1h post-NVD, breastfeeding' }] },
          { id: 'RR4', name: 'Recovery Room 4', type: 'recovery', status: 'available',
            beds: [{ id: 'RR4-B1', status: 'available', patient: null }, { id: 'RR4-B2', status: 'available', patient: null }] },
          { id: 'RR5', name: 'Recovery Room 5', type: 'recovery', status: 'partial',
            beds: [{ id: 'RR5-B1', status: 'occupied', patient: 'Mrs. Chipo Gumbo — 2h post-NVD' }, { id: 'RR5-B2', status: 'available', patient: null }] },
          { id: 'RR6', name: 'Recovery Room 6', type: 'recovery', status: 'full',
            beds: [{ id: 'RR6-B1', status: 'occupied', patient: 'Mrs. Alice Mushore — 5h post-NVD, transferring' }, { id: 'RR6-B2', status: 'occupied', patient: 'Mrs. Beatrice Mwenye — 3h post-NVD' }] },
        ],
      },
    ],
    stats: { totalBeds: 30, occupiedBeds: 22, patientCount: 24, alertCount: 2 },
    alerts: ['DR4 — Fetal distress emergency — team on site', 'Monitor 2 (Delivery Wing) — offline, fault logged'],
  },
  {
    id: 'second', num: '2F', name: 'Second Floor',
    subtitle: 'Postnatal Ward · Nursery · NICU · Preterm Unit',
    description: 'Houses postnatal women recovering after delivery, the nursery complex (NICU, preterm, term), the solution preparation area, and a ward for unwell postnatal women.',
    matron: { name: 'Sr. Ruth Ncube',  id: 'STF-020', phone: '+263 77 333 4455', since: 'Feb 2017' },
    sic:    { name: 'Sr. Vimbai Dube', id: 'STF-021', phone: '+263 77 666 7788', since: 'Nov 2021' },
    nursesOnDuty: 7,
    notices: [
      { id: '2f-n1', title: 'NICU — Baby Mukwena Critical', body: 'Baby Mukwena (29wk, ventilated) — ongoing critical monitoring. Neonatologist reviewing at 12:00.', time: '10:30', priority: 'critical' },
      { id: '2f-n2', title: 'Postnatal Bay A Full', body: 'Bay A at capacity (6/6). Redirect new admissions to Bay B or C.', time: '09:15', priority: 'warning' },
      { id: '2f-n3', title: 'Feeding Schedule Update', body: 'NICU & Preterm feeding schedule updated — see Sr. Vimbai Dube for revised chart.', time: '08:00', priority: 'info' },
    ],
    monitors: [
      { id: '2F-M1', name: 'Monitor 1 — Postnatal Corridor', status: 'online', content: 'Patient Room & Feeding Schedule' },
      { id: '2F-M2', name: 'Monitor 2 — Nursery Entrance',   status: 'online', content: 'Baby Status Board & Feeding Times' },
    ],
    sections: [
      {
        id: '2f-admin', name: 'Administration & Support', type: 'admin',
        units: [
          { id: '2F-NS',  name: "Nurses' Station", type: 'station', status: 'active', note: '7 nurses on duty across postnatal and nursery', beds: null },
          { id: '2F-MO',  name: "Matron's Office",  type: 'office',  status: 'active', note: 'Sr. Ruth Ncube — overseeing nursery & postnatal', beds: null },
          { id: '2F-SIC', name: "Sister-in-Charge", type: 'office',  status: 'active', note: 'Sr. Vimbai Dube — postnatal ward oversight',      beds: null },
        ],
      },
      {
        id: '2f-nursery', name: 'Nursery Complex', type: 'nursery',
        units: [
          { id: 'NICU', name: 'Neonatal ICU (NICU)', type: 'nicu', status: 'busy',
            note: '6/8 incubators — 2 on ventilator support',
            beds: [
              { id: 'NICU-1', status: 'critical', patient: 'Baby Nyoni — 32wk preterm, CPAP, day 3' },
              { id: 'NICU-2', status: 'critical', patient: 'Baby Mukwena — 29wk preterm, ventilated, day 1' },
              { id: 'NICU-3', status: 'occupied', patient: 'Baby Choto — 34wk, on CPAP, day 5' },
              { id: 'NICU-4', status: 'occupied', patient: 'Baby Zimuto — 35wk, nasal prongs, day 2' },
              { id: 'NICU-5', status: 'occupied', patient: 'Baby Banda — 33wk, improving, day 7' },
              { id: 'NICU-6', status: 'occupied', patient: 'Baby Gomo — 36wk, weaning O2, day 4' },
              { id: 'NICU-7', status: 'available', patient: null },
              { id: 'NICU-8', status: 'available', patient: null },
            ] },
          { id: 'PRET', name: 'Preterm Baby Unit', type: 'preterm', status: 'full',
            note: '12/16 incubators occupied',
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
            ] },
          { id: 'TERM', name: 'Term Baby Nursery', type: 'term-nursery', status: 'partial',
            note: '8/14 bassinets — healthy term neonates',
            beds: [
              { id: 'TN-01', status: 'occupied', patient: 'Baby Moyo (Male) — 39wk, Day 5' },
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
            ] },
        ],
      },
      {
        id: '2f-postnatal', name: 'Postnatal Ward', type: 'postnatal',
        note: 'Main postnatal accommodation — rooming-in encouraged',
        units: [
          { id: 'PN-A', name: 'Postnatal Bay A', type: 'postnatal', status: 'full', note: '6/6 beds occupied',
            beds: Array.from({ length: 6 }, (_, i) => ({ id: `PN-A-B${i+1}`, status: 'occupied', patient: ['Mrs. T. Moyo — Day 5', 'Mrs. A. Gumbo — Day 3', 'Mrs. S. Mwanza — Day 2', 'Mrs. P. Mhuka — Day 4', 'Mrs. M. Zimuto — Day 1', 'Mrs. L. Banda — Day 3'][i] })) },
          { id: 'PN-B', name: 'Postnatal Bay B', type: 'postnatal', status: 'partial', note: '4/6 beds occupied',
            beds: [...Array.from({ length: 4 }, (_, i) => ({ id: `PN-B-B${i+1}`, status: 'occupied', patient: ['Mrs. R. Dube — Day 2', 'Mrs. C. Sithole — Day 5', 'Mrs. N. Mupfuro — Day 1', 'Mrs. B. Musabayana — Day 3'][i] })), { id: 'PN-B-B5', status: 'available', patient: null }, { id: 'PN-B-B6', status: 'available', patient: null }] },
          { id: 'PN-C', name: 'Postnatal Bay C', type: 'postnatal', status: 'partial', note: '3/6 beds occupied',
            beds: [...Array.from({ length: 3 }, (_, i) => ({ id: `PN-C-B${i+1}`, status: 'occupied', patient: ['Mrs. E. Muyambo — Day 1', 'Mrs. J. Makore — Day 2', 'Mrs. F. Dhliwayo — Day 4'][i] })), ...Array.from({ length: 3 }, (_, i) => ({ id: `PN-C-B${i+4}`, status: 'available', patient: null }))] },
        ],
      },
      {
        id: '2f-unwell', name: 'Unwell Postnatal Women — 10 Units', type: 'ward',
        note: 'Postnatal women with complications requiring monitoring',
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
        ],
      },
    ],
    stats: { totalBeds: 58, occupiedBeds: 45, patientCount: 52, alertCount: 1 },
    alerts: ['NICU — Baby Mukwena (29wk, ventilated) — critical monitoring ongoing'],
  },
  {
    id: 'third', num: '3F', name: 'Third Floor',
    subtitle: 'Kangaroo Mother Care Unit · Specialised Ward',
    description: 'Specialised KMC unit for stable preterm and low birth weight babies and their mothers.',
    matron: { name: 'Sr. Tendai Mwari',       id: 'STF-022', phone: '+263 77 444 5566', since: 'Sep 2019' },
    sic:    { name: 'Sr. Primrose Mapuranga', id: 'STF-023', phone: '+263 77 777 8899', since: 'Apr 2022' },
    nursesOnDuty: 4,
    notices: [
      { id: '3f-n1', title: 'KMC Bay A — Full Capacity', body: 'Bay A is full (4/4 pairs). Next eligible mother to be admitted to Bay B.', time: '09:00', priority: 'warning' },
      { id: '3f-n2', title: 'Education Session 10:00', body: 'Breastfeeding & KMC education session at 10:00 in the Education Room. All mothers encouraged to attend.', time: '08:00', priority: 'info' },
    ],
    monitors: [
      { id: '3F-M1', name: 'Monitor 1 — KMC Ward Entrance', status: 'online',  content: 'KMC Progress Board & Education Displays' },
      { id: '3F-M2', name: 'Monitor 2 — Delivery Area',     status: 'standby', content: 'Queue Display (standby)' },
    ],
    sections: [
      {
        id: '3f-admin', name: 'Administration & Support', type: 'admin',
        units: [
          { id: '3F-NS',  name: "Nurses' Station", type: 'station', status: 'active', note: '4 KMC specialist nurses on duty', beds: null },
          { id: '3F-MO',  name: "Matron's Office",  type: 'office',  status: 'active', note: 'Sr. Tendai Mwari — in office',    beds: null },
          { id: '3F-SIC', name: "Sister-in-Charge", type: 'office',  status: 'active', note: 'Sr. Primrose Mapuranga — in office', beds: null },
        ],
      },
      {
        id: '3f-delivery', name: 'KMC Delivery Rooms', type: 'delivery',
        units: [
          { id: 'KDR1', name: 'KMC Delivery Room 1', type: 'delivery', status: 'available',
            beds: [{ id: 'KDR1-B1', status: 'available', patient: null }, { id: 'KDR1-B2', status: 'available', patient: null }] },
          { id: 'KDR2', name: 'KMC Delivery Room 2', type: 'delivery', status: 'partial',
            beds: [{ id: 'KDR2-B1', status: 'occupied', patient: 'Mrs. C. Maposa — 36wk, imminent preterm delivery' }, { id: 'KDR2-B2', status: 'available', patient: null }] },
          { id: 'KDR3', name: 'KMC Delivery Room 3', type: 'delivery', status: 'available',
            beds: [{ id: 'KDR3-B1', status: 'available', patient: null }, { id: 'KDR3-B2', status: 'available', patient: null }] },
        ],
      },
      {
        id: '3f-kmc', name: 'Kangaroo Mother Care Ward', type: 'kmc',
        note: 'Mother–baby pairs doing skin-to-skin contact',
        units: [
          { id: 'KMC-A', name: 'KMC Bay A', type: 'kmc', status: 'full', note: '4/4 mother-baby pairs',
            beds: [
              { id: 'KMC-A1', status: 'occupied', patient: 'Mrs. Rudo Hove + Baby (35wk, 1.8kg) — Day 8' },
              { id: 'KMC-A2', status: 'occupied', patient: 'Mrs. Sasha Muza + Baby (34wk, 1.6kg) — Day 5' },
              { id: 'KMC-A3', status: 'occupied', patient: 'Mrs. Loveness Biti + Baby (36wk, 2.0kg) — Day 3' },
              { id: 'KMC-A4', status: 'occupied', patient: 'Mrs. Melody Tsiga + Baby (34wk, 1.7kg) — Day 6' },
            ] },
          { id: 'KMC-B', name: 'KMC Bay B', type: 'kmc', status: 'partial', note: '3/4 mother-baby pairs',
            beds: [
              { id: 'KMC-B1', status: 'occupied', patient: 'Mrs. Faith Mavhu + Baby (35wk, 1.9kg) — Day 2' },
              { id: 'KMC-B2', status: 'occupied', patient: 'Mrs. Grace Mawema + Baby (33wk, 1.5kg) — Day 10' },
              { id: 'KMC-B3', status: 'occupied', patient: 'Mrs. Chipo Dete + Baby (36wk, 2.1kg) — Day 4' },
              { id: 'KMC-B4', status: 'available', patient: null },
            ] },
          { id: 'KMC-C', name: 'KMC Bay C', type: 'kmc', status: 'partial', note: '2/4 mother-baby pairs',
            beds: [
              { id: 'KMC-C1', status: 'occupied', patient: 'Mrs. Rutendo Mash + Baby (37wk, 2.3kg) — Day 1' },
              { id: 'KMC-C2', status: 'occupied', patient: 'Mrs. Memory Tande + Baby (35wk, 1.8kg) — Day 7' },
              { id: 'KMC-C3', status: 'available', patient: null },
              { id: 'KMC-C4', status: 'available', patient: null },
            ] },
        ],
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
    if (u.beds) u.beds.forEach(b => {
      total++;
      if (b.status === 'occupied') occupied++;
      if (b.status === 'critical') { occupied++; critical++; }
      if (b.status === 'available') available++;
    });
  }));
  return { total, occupied, critical, available, pct: total ? Math.round((occupied / total) * 100) : 0 };
}

function staffInitials(name) {
  return name.replace(/^(Sr\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s+/, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// BED CELL — used in the occupancy map grid
// ─────────────────────────────────────────────────────────────────────────────

function BedCell({ bed, size = 'normal' }) {
  const cfg = BED_CFG[bed.status] || BED_CFG.available;
  const dim = size === 'small' ? 28 : 36;
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div style={{
        width: dim, height: dim, borderRadius: 6,
        background: cfg.bg, border: `2px solid ${cfg.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: bed.patient ? 'pointer' : 'default',
        boxShadow: hovered && bed.patient ? `0 2px 8px ${cfg.border}60` : 'none',
        transition: 'box-shadow 0.15s',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: size === 'small' ? 11 : 13, color: cfg.text, fontWeight: 800, lineHeight: 1 }}>
          {cfg.icon}
        </span>
      </div>
      {hovered && bed.patient && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#1e293b', color: '#fff', borderRadius: 6, padding: '6px 10px',
          fontSize: '0.7rem', whiteSpace: 'nowrap', zIndex: 100, marginBottom: 4,
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          maxWidth: 260, whiteSpace: 'normal', lineHeight: 1.4,
        }}>
          <div style={{ fontWeight: 700, marginBottom: 2 }}>{bed.id}</div>
          {bed.patient}
          <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, background: '#1e293b', rotate: '45deg' }} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WARD OCCUPANCY MODAL
// ─────────────────────────────────────────────────────────────────────────────

function WardModal({ floor, onClose }) {
  const [activeTab, setActiveTab] = useState('map');
  const { color, light } = FLOOR_COLORS[floor.id] || FLOOR_COLORS.ground;
  const bedStats = computeFloorBedStats(floor);

  const allPatients = useMemo(() => {
    const list = [];
    floor.sections.forEach(s => {
      s.units.forEach(u => {
        if (u.beds) u.beds.filter(b => b.patient).forEach(b => {
          list.push({ bedId: b.id, patient: b.patient, room: u.name, status: b.status, section: s.name });
        });
      });
    });
    return list;
  }, [floor]);

  const nonAdminSections = floor.sections.filter(s => s.type !== 'admin');
  const pct = bedStats.total > 0 ? bedStats.pct : 0;
  const pctColor = pct >= 90 ? '#dc2626' : pct >= 75 ? '#d97706' : '#16a34a';

  const TABS = [
    { key: 'map',      label: 'Occupancy Map' },
    { key: 'patients', label: `Patients (${allPatients.length})` },
    { key: 'notices',  label: `Notices (${(floor.notices || []).length})` },
    { key: 'staff',    label: 'Ward Staff' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '16px', overflowY: 'auto' }}
      onClick={onClose}>
      <div style={{ background: 'var(--pm-surface)', borderRadius: 14, width: '100%', maxWidth: 860, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.3)', marginTop: 20, marginBottom: 20 }}
        onClick={e => e.stopPropagation()}>

        {/* Modal Header */}
        <div style={{ background: color, padding: '18px 22px', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                {floor.num}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{floor.name}</div>
                <div style={{ opacity: 0.82, fontSize: '0.78rem' }}>{floor.subtitle}</div>
                {floor.alerts && floor.alerts.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
                    {floor.alerts.map((a, i) => (
                      <span key={i} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '2px 9px', fontSize: '0.67rem', fontWeight: 700 }}>
                        ⚠ {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <X size={16} />
            </button>
          </div>

          {/* Quick stats row */}
          <div style={{ display: 'flex', gap: 20, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.2)', flexWrap: 'wrap' }}>
            {[
              { label: 'Total Beds', value: bedStats.total },
              { label: 'Occupied',   value: bedStats.occupied },
              { label: 'Available',  value: bedStats.available },
              { label: 'Critical',   value: bedStats.critical },
              { label: 'Patients',   value: floor.stats?.patientCount ?? allPatients.length },
              { label: 'Nurses',     value: floor.nursesOnDuty },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '0.62rem', opacity: 0.7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 1 }}>{s.label}</div>
                <div style={{ fontWeight: 900, fontSize: '1.3rem', lineHeight: 1 }}>{s.value}</div>
              </div>
            ))}
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '0.62rem', opacity: 0.7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Occupancy</div>
              <div style={{ fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>{pct}%</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--pm-border)', background: 'var(--pm-surface-2)' }}>
          {TABS.map(t => {
            const active = activeTab === t.key;
            return (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                flex: 1, padding: '10px 6px', border: 'none', background: 'none', cursor: 'pointer',
                borderBottom: active ? `2px solid ${color}` : '2px solid transparent',
                color: active ? color : 'var(--pm-text-muted)',
                fontWeight: active ? 700 : 500, fontSize: '0.78rem', transition: 'all 0.15s',
              }}>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{ padding: 20, maxHeight: '60vh', overflowY: 'auto' }}>

          {/* ── OCCUPANCY MAP ── */}
          {activeTab === 'map' && (
            <div>
              {/* Bed legend */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', padding: '10px 14px', background: 'var(--pm-surface-2)', borderRadius: 8, border: '1px solid var(--pm-border)' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--pm-text-muted)', alignSelf: 'center', marginRight: 4 }}>LEGEND:</span>
                {Object.entries(BED_CFG).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, background: v.bg, border: `2px solid ${v.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 9, color: v.text, fontWeight: 800 }}>{v.icon}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>{v.label}</span>
                  </div>
                ))}
                <span style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)', marginLeft: 'auto', fontStyle: 'italic' }}>Hover a bed for patient name</span>
              </div>

              {/* Occupancy bar */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--pm-text-muted)', fontWeight: 600 }}>Overall Bed Occupancy</span>
                  <span style={{ fontWeight: 800, color: pctColor }}>{pct}% — {bedStats.occupied} of {bedStats.total} beds</span>
                </div>
                <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: pctColor, borderRadius: 4, transition: 'width 0.5s' }} />
                </div>
              </div>

              {/* Sections */}
              {nonAdminSections.map(section => {
                const sColor = SECTION_COLORS[section.type] || '#64748b';
                const bedCount = section.units.reduce((acc, u) => acc + (u.beds ? u.beds.length : 0), 0);
                const occupiedCount = section.units.reduce((acc, u) => acc + (u.beds ? u.beds.filter(b => b.status === 'occupied' || b.status === 'critical').length : 0), 0);
                const sectionPct = bedCount > 0 ? Math.round((occupiedCount / bedCount) * 100) : 0;

                return (
                  <div key={section.id} style={{ marginBottom: 20 }}>
                    {/* Section header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '8px 12px', background: `${sColor}10`, border: `1px solid ${sColor}30`, borderRadius: 8, borderLeft: `4px solid ${sColor}` }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: sColor }}>{section.name}</div>
                        {section.note && <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>{section.note}</div>}
                      </div>
                      {bedCount > 0 && (
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: sColor }}>{occupiedCount}/{bedCount}</span>
                          <div style={{ fontSize: '0.62rem', color: 'var(--pm-text-muted)' }}>{sectionPct}% occupied</div>
                        </div>
                      )}
                    </div>

                    {/* Units grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                      {section.units.map(unit => {
                        const sCfg = UNIT_STATUS_CFG[unit.status] || UNIT_STATUS_CFG.active;
                        const occupiedBeds = unit.beds ? unit.beds.filter(b => b.status === 'occupied' || b.status === 'critical').length : 0;
                        const totalBeds = unit.beds ? unit.beds.length : 0;
                        const isCritical = unit.status === 'critical' || (unit.beds && unit.beds.some(b => b.status === 'critical'));

                        return (
                          <div key={unit.id} style={{
                            border: `1.5px solid ${isCritical ? '#dc2626' : 'var(--pm-border)'}`,
                            borderRadius: 8, padding: '10px 12px',
                            background: isCritical ? '#fff5f5' : 'var(--pm-surface)',
                            boxShadow: isCritical ? '0 0 0 2px #fecaca' : 'none',
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: unit.beds ? 8 : 0 }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: 2 }}>{unit.name}</div>
                                {unit.note && <div style={{ fontSize: '0.67rem', color: 'var(--pm-text-muted)', lineHeight: 1.3 }}>{unit.note}</div>}
                                {unit.queue != null && <div style={{ fontSize: '0.67rem', color: '#d97706', fontWeight: 600, marginTop: 1 }}>Queue: {unit.queue}</div>}
                                {unit.capacity != null && <div style={{ fontSize: '0.67rem', color: 'var(--pm-text-muted)', marginTop: 1 }}>{unit.current}/{unit.capacity} capacity</div>}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0, marginLeft: 6 }}>
                                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: sCfg.color, background: sCfg.bg, borderRadius: 10, padding: '1px 6px', whiteSpace: 'nowrap' }}>
                                  {sCfg.label}
                                </span>
                                {unit.beds && (
                                  <span style={{ fontSize: '0.62rem', color: 'var(--pm-text-muted)', fontWeight: 600 }}>
                                    {occupiedBeds}/{totalBeds}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Bed cells grid */}
                            {unit.beds && (
                              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--pm-border)' }}>
                                {unit.beds.map(b => <BedCell key={b.id} bed={b} size="small" />)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── PATIENT LIST ── */}
          {activeTab === 'patients' && (
            <div>
              <div style={{ marginBottom: 12, fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>
                {allPatients.length} patients currently on {floor.name}
              </div>
              {allPatients.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--pm-text-muted)' }}>No patients currently on this floor</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="pm-table">
                    <thead>
                      <tr>
                        <th>#</th><th>PATIENT</th><th>BED / UNIT</th><th>SECTION</th><th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allPatients.map((p, i) => {
                        const bCfg = BED_CFG[p.status] || BED_CFG.occupied;
                        return (
                          <tr key={i}>
                            <td style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', fontWeight: 600 }}>{i + 1}</td>
                            <td style={{ fontWeight: 700, fontSize: '0.83rem' }}>{p.patient}</td>
                            <td>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{p.room}</div>
                              <div style={{ fontSize: '0.67rem', color: 'var(--pm-text-muted)' }}>{p.bedId}</div>
                            </td>
                            <td style={{ fontSize: '0.77rem', color: 'var(--pm-text-muted)' }}>{p.section.split(' — ')[0].split(' · ')[0]}</td>
                            <td>
                              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: bCfg.text === '#fff' ? bCfg.border : '#6b7280', background: bCfg.bg, border: `1px solid ${bCfg.border}50`, borderRadius: 10, padding: '2px 8px' }}>
                                {bCfg.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── WARD NOTICES ── */}
          {activeTab === 'notices' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{(floor.notices || []).length} notices for {floor.name}</div>
                <button className="pm-btn pm-btn-primary pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem' }}>
                  <Plus size={12} /> Post Notice
                </button>
              </div>
              {(floor.notices || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--pm-text-muted)' }}>
                  <Bell size={28} style={{ opacity: 0.2, display: 'block', margin: '0 auto 8px' }} />
                  No notices for this floor
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(floor.notices || []).map(notice => {
                    const cfg = {
                      critical: { bg: '#fff5f5', border: '#fecaca', badgeBg: '#fee2e2', badgeColor: '#dc2626', badgeLabel: '⚠ CRITICAL', icon: AlertTriangle, iconColor: '#dc2626' },
                      warning:  { bg: '#fffbeb', border: '#fde68a', badgeBg: '#fef3c7', badgeColor: '#d97706', badgeLabel: 'Warning',    icon: AlertTriangle, iconColor: '#d97706' },
                      info:     { bg: '#eff6ff', border: '#bfdbfe', badgeBg: '#dbeafe', badgeColor: '#2563eb', badgeLabel: 'Notice',     icon: Info,          iconColor: '#2563eb' },
                    }[notice.priority] || {};
                    const Icon = cfg.icon;
                    return (
                      <div key={notice.id} style={{ padding: '14px 16px', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10, borderLeft: `4px solid ${cfg.iconColor}` }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: cfg.badgeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={16} style={{ color: cfg.iconColor }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
                              <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{notice.title}</div>
                              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                                <span style={{ fontSize: '0.67rem', color: 'var(--pm-text-muted)' }}>{notice.time}</span>
                                <span style={{ background: cfg.badgeBg, color: cfg.badgeColor, border: `1px solid ${cfg.iconColor}40`, borderRadius: 10, padding: '1px 7px', fontSize: '0.63rem', fontWeight: 700 }}>{cfg.badgeLabel}</span>
                              </div>
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--pm-text)', lineHeight: 1.5 }}>{notice.body}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── WARD STAFF ── */}
          {activeTab === 'staff' && (
            <div>
              {/* Matron + SIC cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Floor Matron', ...floor.matron },
                  { label: 'Sister-in-Charge', ...floor.sic },
                ].map((person, i) => (
                  <div key={i} style={{ border: `1.5px solid ${color}40`, borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ background: color, padding: '8px 14px' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{person.label}</div>
                    </div>
                    <div style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem', flexShrink: 0 }}>
                        {staffInitials(person.name)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 2 }}>{person.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', marginBottom: 6 }}>{person.id} · Assigned since {person.since}</div>
                        <a href={`tel:${person.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.77rem', color: color, fontWeight: 700, textDecoration: 'none', background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 6, padding: '3px 9px' }}>
                          <Phone size={11} /> {person.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Monitor status */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 8 }}>Floor Display Monitors</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {floor.monitors.map(m => {
                    const online = m.status === 'online';
                    const standby = m.status === 'standby';
                    const mColor = online ? '#16a34a' : standby ? '#6366f1' : '#dc2626';
                    const Icon = online ? Wifi : standby ? Radio : WifiOff;
                    return (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: online ? '#f0fdf4' : standby ? '#eef2ff' : '#fff1f2', border: `1px solid ${mColor}30`, borderRadius: 7 }}>
                        <Icon size={14} style={{ color: mColor, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.77rem', fontWeight: 700, color: mColor }}>{m.name}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)' }}>{m.content}</div>
                        </div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: mColor, background: online ? '#dcfce7' : standby ? '#e0e7ff' : '#fee2e2', borderRadius: 10, padding: '2px 8px' }}>
                          {online ? 'Online' : standby ? 'Standby' : 'Offline'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Admin units */}
              {(() => {
                const adminSec = floor.sections.find(s => s.type === 'admin');
                if (!adminSec) return null;
                return (
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 8 }}>Admin & Support Units</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {adminSec.units.map(u => (
                        <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', borderRadius: 7 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{u.name}</div>
                            {u.note && <div style={{ fontSize: '0.67rem', color: 'var(--pm-text-muted)' }}>{u.note}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WARD CARD — main overview card on the page
// ─────────────────────────────────────────────────────────────────────────────

function WardCard({ floor, onOpen }) {
  const { color, light } = FLOOR_COLORS[floor.id] || FLOOR_COLORS.ground;
  const bedStats = computeFloorBedStats(floor);
  const pct = bedStats.total > 0 ? bedStats.pct : null;
  const pctColor = pct !== null ? (pct >= 90 ? '#dc2626' : pct >= 75 ? '#d97706' : '#16a34a') : '#6366f1';
  const hasCritical = bedStats.critical > 0 || (floor.alerts && floor.alerts.length > 0);
  const alertCount = floor.stats?.alertCount ?? 0;
  const noticeCount = (floor.notices || []).length;
  const criticalNotices = (floor.notices || []).filter(n => n.priority === 'critical').length;

  return (
    <div style={{
      border: `1.5px solid ${hasCritical ? '#dc2626' : 'var(--pm-border)'}`,
      borderLeft: `5px solid ${color}`,
      borderRadius: 12, overflow: 'hidden', background: 'var(--pm-surface)',
      boxShadow: hasCritical ? '0 0 0 2px #fee2e2' : 'none',
      display: 'flex', flexDirection: 'column',
      transition: 'transform 0.12s, box-shadow 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = hasCritical ? `0 4px 20px #dc262640` : `0 4px 20px ${color}30`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = hasCritical ? '0 0 0 2px #fee2e2' : 'none'; }}>

      {/* Card top */}
      <div style={{ background: color, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem', color: '#fff' }}>
            {floor.num}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.97rem' }}>{floor.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.7rem' }}>{floor.subtitle}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {alertCount > 0 && (
            <span style={{ background: '#fff', color: '#dc2626', borderRadius: 20, padding: '2px 9px', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 3 }}>
              <AlertTriangle size={9} /> {alertCount} ALERT{alertCount > 1 ? 'S' : ''}
            </span>
          )}
          <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 20, padding: '2px 9px', fontSize: '0.68rem', fontWeight: 700 }}>
            {floor.stats?.patientCount ?? 0} patients
          </span>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '14px 18px', flex: 1 }}>

        {/* Occupancy bar */}
        {pct !== null && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.74rem' }}>
              <span style={{ color: 'var(--pm-text-muted)', fontWeight: 600 }}>Bed Occupancy</span>
              <span style={{ fontWeight: 800, color: pctColor }}>{pct}%</span>
            </div>
            <div style={{ height: 7, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: pctColor, borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontSize: '0.68rem', color: 'var(--pm-text-muted)' }}>
              <span>{bedStats.occupied} occupied</span>
              {bedStats.critical > 0 && <span style={{ color: '#dc2626', fontWeight: 700 }}>⚠ {bedStats.critical} critical</span>}
              <span>{bedStats.available} available</span>
            </div>
          </div>
        )}

        {/* Bed mini-map */}
        {(() => {
          const allBeds = [];
          floor.sections.forEach(s => s.units.forEach(u => { if (u.beds) allBeds.push(...u.beds); }));
          if (allBeds.length === 0) return null;
          return (
            <div style={{ marginBottom: 14, padding: '10px 12px', background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', borderRadius: 8 }}>
              <div style={{ fontSize: '0.67rem', fontWeight: 700, color: 'var(--pm-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Bed Overview — {allBeds.length} total
              </div>
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {allBeds.map(b => {
                  const cfg = BED_CFG[b.status] || BED_CFG.available;
                  return (
                    <div key={b.id} title={b.patient || 'Available'} style={{ width: 14, height: 14, borderRadius: 3, background: cfg.bg, border: `1.5px solid ${cfg.border}`, cursor: b.patient ? 'help' : 'default', flexShrink: 0 }} />
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
                {Object.entries(BED_CFG).map(([k, v]) => {
                  const count = allBeds.filter(b => b.status === k).length;
                  if (count === 0) return null;
                  return (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: v.bg, border: `1px solid ${v.border}` }} />
                      <span style={{ fontSize: '0.62rem', color: 'var(--pm-text-muted)' }}>{count} {v.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Personnel row */}
        <div style={{ display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid var(--pm-border)', marginBottom: 12 }}>
          {[{ label: 'Matron', ...floor.matron }, { label: 'SIC', ...floor.sic }].map((p, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 800, flexShrink: 0 }}>
                {staffInitials(p.name)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.62rem', color: 'var(--pm-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.label}</div>
                <div style={{ fontSize: '0.77rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 10, fontSize: '0.7rem', color: 'var(--pm-text-muted)', flexWrap: 'wrap' }}>
            <span>👩‍⚕️ {floor.nursesOnDuty} nurses</span>
            {noticeCount > 0 && (
              <span style={{ color: criticalNotices > 0 ? '#dc2626' : '#d97706', fontWeight: 600 }}>
                🔔 {noticeCount} notice{noticeCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button onClick={onOpen} className="pm-btn pm-btn-outline pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.73rem', color, borderColor: color }}>
            <Eye size={12} /> View Ward <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function WardOccupancyPage({ user, onNavigate }) {
  const [selectedFloor, setSelectedFloor] = useState(null);

  const hospitalStats = useMemo(() => {
    let totalBeds = 0, occupied = 0, critical = 0, available = 0, patients = 0, alerts = 0;
    FLOORS.forEach(f => {
      const bs = computeFloorBedStats(f);
      totalBeds += bs.total; occupied += bs.occupied;
      critical += bs.critical; available += bs.available;
      patients += f.stats?.patientCount ?? 0;
      alerts += f.stats?.alertCount ?? 0;
    });
    return { totalBeds, occupied, critical, available, patients, alerts, pct: totalBeds ? Math.round((occupied / totalBeds) * 100) : 0 };
  }, []);

  return (
    <div>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Ward Occupancy</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>
            Parirenyatwa Group of Hospitals — Maternity Unit · {FLOORS.length} wards · Live occupancy
          </div>
        </div>
        {hospitalStats.alerts > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: '6px 12px' }}>
            <AlertTriangle size={14} style={{ color: '#dc2626' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#dc2626' }}>{hospitalStats.alerts} active alert{hospitalStats.alerts > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* HOSPITAL-WIDE STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Total Beds',     value: hospitalStats.totalBeds, sub: 'across all wards',    icon: BedDouble,    color: '#6366f1', alert: false },
          { label: 'Occupied',       value: hospitalStats.occupied,  sub: `${hospitalStats.pct}% occupancy`, icon: Users,  color: '#0d9488', alert: false },
          { label: 'Available',      value: hospitalStats.available, sub: 'ready for admission', icon: CheckCircle,  color: '#16a34a', alert: false },
          { label: 'Critical',       value: hospitalStats.critical,  sub: 'urgent attention',    icon: AlertTriangle,color: '#dc2626', alert: true },
          { label: 'Total Patients', value: hospitalStats.patients,  sub: 'all wards',           icon: Baby,         color: '#ec4899', alert: false },
          { label: 'Active Alerts',  value: hospitalStats.alerts,    sub: 'need follow-up',      icon: Bell,         color: '#f59e0b', alert: hospitalStats.alerts > 0 },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="pm-card" style={{ padding: '12px 14px', borderLeft: `3px solid ${s.color}`, ...(s.alert && s.value > 0 ? { border: `1.5px solid ${s.color}`, borderLeft: `3px solid ${s.color}` } : {}) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Icon size={18} style={{ color: s.color }} />
                {s.alert && s.value > 0 && <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, boxShadow: `0 0 0 3px ${s.color}30` }} />}
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: s.color, lineHeight: 1, marginTop: 8 }}>{s.value}</div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--pm-text)', marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: '0.66rem', color: 'var(--pm-text-muted)', marginTop: 1 }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* COMBINED OCCUPANCY BAR */}
      <div className="pm-card" style={{ padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Hospital Bed Occupancy — All Wards</div>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: hospitalStats.pct >= 90 ? '#dc2626' : hospitalStats.pct >= 75 ? '#d97706' : '#16a34a' }}>
            {hospitalStats.pct}%
          </span>
        </div>
        <div style={{ height: 12, background: '#e5e7eb', borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
          {FLOORS.map(f => {
            const bs = computeFloorBedStats(f);
            const segPct = hospitalStats.totalBeds ? (bs.total / hospitalStats.totalBeds) * 100 : 0;
            const occPct = bs.total ? (bs.occupied / bs.total) * 100 : 0;
            const { color } = FLOOR_COLORS[f.id];
            return (
              <div key={f.id} title={`${f.name}: ${bs.occupied}/${bs.total} beds`}
                style={{ width: `${segPct}%`, height: '100%', position: 'relative', cursor: 'pointer' }}
                onClick={() => setSelectedFloor(f)}>
                <div style={{ position: 'absolute', inset: 0, background: '#e5e7eb' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${occPct}%`, background: color }} />
                <div style={{ position: 'absolute', right: 0, top: 0, width: 2, height: '100%', background: '#fff', zIndex: 2 }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
          {FLOORS.map(f => {
            const { color } = FLOOR_COLORS[f.id];
            const bs = computeFloorBedStats(f);
            const p = bs.total ? Math.round((bs.occupied / bs.total) * 100) : 0;
            return (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => setSelectedFloor(f)}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>
                  {f.num} {f.name.replace(' Floor', '')} — {bs.occupied}/{bs.total} ({p}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* WARD CARDS GRID */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Click "View Ward" to open the occupancy map
        </div>
      </div>
      <div className="row g-3">
        {FLOORS.map(floor => (
          <div key={floor.id} className="col-12 col-md-6">
            <WardCard floor={floor} onOpen={() => setSelectedFloor(floor)} />
          </div>
        ))}
      </div>

      {/* WARD MODAL */}
      {selectedFloor && (
        <WardModal floor={selectedFloor} onClose={() => setSelectedFloor(null)} />
      )}
    </div>
  );
}