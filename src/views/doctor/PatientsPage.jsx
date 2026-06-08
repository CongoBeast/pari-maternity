import React, { useState, useMemo } from 'react';
import {
  Users, Baby, AlertTriangle, CheckCircle, Clock, ChevronLeft,
  Search, Pill, Calendar, MapPin, Phone, User, Activity,
  Home, Stethoscope, FlaskConical, Shield, Heart, Info,
  ArrowRight, Filter, X, ChevronDown, Clipboard
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_MAP = {
  postnatal:   { label: 'Postnatal',   badgeCls: 'pm-badge-success', dot: '#16a34a' },
  operated:    { label: 'Post-Op (CS)',  badgeCls: '',                dot: '#7c3aed', badgeStyle: { background: '#f3e8ff', color: '#7c3aed', border: '1px solid #ddd8fe' } },
  'high-risk': { label: 'High Risk',   badgeCls: 'pm-badge-danger',  dot: '#dc2626' },
  admitted:    { label: 'Antenatal',   badgeCls: 'pm-badge-info',    dot: '#0284c7' },
  labour:      { label: 'In Labour',   badgeCls: 'pm-badge-warning', dot: '#d97706' },
  discharged:  { label: 'Discharged',  badgeCls: 'pm-badge-neutral', dot: '#6b7280' },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.admitted;
  return <span className={`pm-badge ${s.badgeCls}`} style={s.badgeStyle || {}}>{s.label}</span>;
}

function StatusDot({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.admitted;
  return <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:s.dot, marginRight:6, flexShrink:0 }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// JOURNEY ICON MAP
// ─────────────────────────────────────────────────────────────────────────────

const J_ICONS = {
  admission: Users, ward: Clock, labour: Heart, delivery: Baby,
  theatre: Activity, anaesthesia: Stethoscope, recovery: Shield,
  postnatal: Heart, discharge: Home, hdu: AlertTriangle, nursery: Baby,
};

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT DATA — Zimbabwe Maternity Hospital
// ─────────────────────────────────────────────────────────────────────────────

const PATIENTS = [
  /* ── 1. Tendai Moyo — Postnatal, NVD ── */
  {
    id: 'ZH-2024-0841', name: 'Tendai Moyo',
    dob: '15 Mar 1996', age: 28, nationalId: '63-487231-A-78',
    phone: '+263 77 123 4567', altPhone: '+263 71 987 6543',
    address: 'House 12, Kuwadzana Extension, Harare',
    nextOfKin: { name: 'Blessing Moyo', relation: 'Husband', phone: '+263 71 987 6543' },
    occupation: 'Secondary School Teacher', maritalStatus: 'Married', religion: 'Apostolic Faith',
    status: 'postnatal', ward: 'Postnatal Ward B', bed: 'Bed 12',
    admissionDate: '18 Oct 2024', dischargeDate: null,
    gestationalAge: '39+2 wks', gravida: 2, para: 1,
    bloodGroup: 'O+', hivStatus: 'Negative', pmtct: 'N/A',
    height: '162 cm', bookingWeight: '68 kg', lmp: '20 Jan 2024', edd: '27 Oct 2024',
    allergies: 'None known', chronic: ['None'],
    vitals: { bp: '118/74', pulse: '82 bpm', temp: '36.8°C', spo2: '98%', rr: '18 /min' },
    ancVisits: [
      { date: '15 Mar 2024', weeks: '8 wks', facility: 'Kuwadzana Polyclinic', bp: '110/70', weight: '63 kg', notes: 'Booking visit. HIV negative. Ferrous sulphate & folic acid prescribed.' },
      { date: '10 May 2024', weeks: '16 wks', facility: 'Kuwadzana Polyclinic', bp: '115/72', weight: '65 kg', notes: 'TT2 vaccine given. Fundal height 16 cm. PMTCT education provided.' },
      { date: '05 Jul 2024', weeks: '24 wks', facility: 'Kuwadzana Polyclinic', bp: '112/68', weight: '67 kg', notes: 'Anomaly scan normal. Vertex presentation. Midstream urine clear.' },
      { date: '02 Sep 2024', weeks: '32 wks', facility: 'Parirenyatwa Hospital OPD', bp: '118/74', weight: '69 kg', notes: 'Growth scan: EFW 1.9 kg, AFI normal. Awaiting spontaneous labour.' },
      { date: '10 Oct 2024', weeks: '38 wks', facility: 'Parirenyatwa Hospital OPD', bp: '120/76', weight: '70 kg', notes: "Bishop's score 4. Reviewed by Dr. Chigudu. Continue monitoring." },
    ],
    medications: [
      { name: 'Ferrous Sulphate', dose: '200 mg', freq: 'Once daily', route: 'Oral', start: '15 Mar 2024', prescriber: 'Dr. T. Mutombwa', status: 'active' },
      { name: 'Folic Acid', dose: '5 mg', freq: 'Once daily', route: 'Oral', start: '15 Mar 2024', prescriber: 'Dr. T. Mutombwa', status: 'active' },
      { name: 'Oxytocin', dose: '10 IU', freq: 'Single post-delivery dose', route: 'IM', start: '19 Oct 2024', prescriber: 'Dr. C. Chigudu', status: 'completed' },
      { name: 'Paracetamol', dose: '1 g', freq: 'Every 8 hours PRN', route: 'Oral', start: '19 Oct 2024', prescriber: 'Dr. C. Chigudu', status: 'active' },
    ],
    appointments: [
      { date: '25 Oct 2024', time: '09:00 AM', type: 'Postnatal Check (Day 7)', provider: 'Dr. C. Chigudu', status: 'upcoming', location: 'OPD Maternity' },
      { date: '08 Nov 2024', time: '10:30 AM', type: '6-Week Postnatal Review', provider: 'Dr. C. Chigudu', status: 'upcoming', location: 'OPD Maternity' },
      { date: '08 Nov 2024', time: '11:00 AM', type: 'Baby 6-Week Immunization', provider: 'Nursing Staff', status: 'upcoming', location: 'Under-5 Clinic' },
    ],
    journey: [
      { stage: 'Emergency Admission', icon: 'admission', location: 'A&E Maternity', date: '18 Oct 2024', time: '02:15 AM', note: 'Presented with regular contractions every 5 min. Cervix 4 cm dilated, well-effaced. CTG reactive.', status: 'done' },
      { stage: 'Antenatal Ward', icon: 'ward', location: 'Ward A, Bed 7', date: '18 Oct 2024', time: '02:45 AM', note: 'IV access established. Partogram initiated. Pain management discussed with patient and husband.', status: 'done' },
      { stage: 'Labour Ward', icon: 'labour', location: 'Labour Room 3', date: '19 Oct 2024', time: '08:30 AM', note: 'Active labour confirmed. 8 cm dilation. Good descent. Membranes intact. FHR baseline 140 bpm.', status: 'done' },
      { stage: 'Delivery', icon: 'delivery', location: 'Labour Room 3', date: '19 Oct 2024', time: '11:22 AM', note: 'Spontaneous normal vaginal delivery. Live male infant. AMTSL performed. 2nd degree perineal tear repaired under local anaesthesia.', status: 'done' },
      { stage: 'Postnatal Ward', icon: 'postnatal', location: 'Ward B, Bed 12', date: '19 Oct 2024', time: '12:30 PM', note: 'Mother and baby stable. Fundus firm at umbilicus. Lochia rubra normal. Breastfeeding initiated successfully.', status: 'active' },
    ],
    baby: {
      name: 'Baby Boy Moyo', sex: 'Male', birthDate: '19 Oct 2024', birthTime: '11:22 AM',
      weight: '3.2 kg', length: '49 cm', headCirc: '34 cm', apgar1: 8, apgar5: 9,
      deliveryType: 'Normal Vaginal Delivery', status: 'Postnatal (Rooming-in with mother)',
      hivExposure: 'Low Risk — Mother HIV Negative',
      bcg: true, polio: true, vitK: true, eyeDrops: true,
      medications: [
        { name: 'Vitamin K (Phytomenadione)', dose: '1 mg', route: 'IM', date: '19 Oct 2024', note: 'Haemorrhagic disease of newborn prophylaxis' },
        { name: 'BCG Vaccine', dose: '0.05 ml', route: 'Intradermal (Left arm)', date: '19 Oct 2024', note: 'TB prophylaxis — birth dose' },
        { name: 'Polio Vaccine (OPV0)', dose: '2 drops', route: 'Oral', date: '19 Oct 2024', note: 'Birth dose' },
        { name: 'Tetracycline 1% Eye Ointment', dose: 'Single application', route: 'Both eyes', date: '19 Oct 2024', note: 'Ophthalmia neonatorum prophylaxis' },
      ],
      notes: 'Breastfeeding well with correct latch. Jaundice screening normal at 24 h. Cord stump clean and dry. Birth registration completed. Hearing screen pending.',
      journey: [
        { stage: 'Birth', icon: 'delivery', location: 'Labour Room 3', date: '19 Oct 2024', time: '11:22 AM', note: 'Born by NVD. Cried immediately. APGAR 8 at 1 min, 9 at 5 min.', status: 'done' },
        { stage: 'Initial Newborn Assessment', icon: 'admission', location: 'Labour Room 3', date: '19 Oct 2024', time: '11:25 AM', note: 'Birth medications administered. Anthropometric measurements recorded. Birth registration form completed.', status: 'done' },
        { stage: 'Rooming-in', icon: 'postnatal', location: 'Ward B, Bed 12', date: '19 Oct 2024', time: '12:30 PM', note: 'Rooming-in with mother. Skin-to-skin contact. Exclusive breastfeeding encouraged per BFHI guidelines.', status: 'active' },
      ],
    },
  },

  /* ── 2. Chiedza Ncube — Post-Op C-Section, Twins, Bulawayo ── */
  {
    id: 'ZH-2024-0799', name: 'Chiedza Ncube',
    dob: '07 Jun 1992', age: 32, nationalId: '70-234567-B-44',
    phone: '+263 73 456 7890', altPhone: '+263 77 234 5678',
    address: 'Flat 4B, Nkulumane 10, Bulawayo',
    nextOfKin: { name: 'Simba Ncube', relation: 'Husband', phone: '+263 77 234 5678' },
    occupation: 'Nurse Aid', maritalStatus: 'Married', religion: 'Roman Catholic',
    status: 'operated', ward: 'Post-Operative Ward', bed: 'Bed 3',
    admissionDate: '17 Oct 2024', dischargeDate: null,
    gestationalAge: '37+5 wks', gravida: 3, para: 2,
    bloodGroup: 'AB+', hivStatus: 'Negative', pmtct: 'N/A',
    height: '158 cm', bookingWeight: '72 kg', lmp: '05 Jan 2024', edd: '12 Oct 2024',
    allergies: 'Penicillin (rash — confirmed)', chronic: ['Gestational Hypertension', 'Twin Pregnancy (DCDA)'],
    vitals: { bp: '138/88', pulse: '90 bpm', temp: '37.1°C', spo2: '97%', rr: '20 /min' },
    ancVisits: [
      { date: '10 Feb 2024', weeks: '5 wks', facility: 'Mpilo Hospital ANC', bp: '118/76', weight: '68 kg', notes: 'Booking. Twin pregnancy confirmed on scan. Referred to high-risk antenatal clinic.' },
      { date: '15 Apr 2024', weeks: '14 wks', facility: 'Mpilo Hospital ANC', bp: '124/80', weight: '71 kg', notes: 'NT scan normal for both twins. Aspirin 75 mg commenced for pre-eclampsia prophylaxis.' },
      { date: '20 Jun 2024', weeks: '24 wks', facility: 'Mpilo Hospital ANC', bp: '130/84', weight: '74 kg', notes: 'DCDA confirmed. Cervical length 35 mm. BP elevated. Calcium 1500 mg commenced.' },
      { date: '12 Aug 2024', weeks: '31 wks', facility: 'Mpilo Hospital ANC', bp: '136/88', weight: '77 kg', notes: 'Gestational hypertension diagnosed. Methyldopa 500 mg TDS commenced. Bed rest advised.' },
      { date: '05 Oct 2024', weeks: '37 wks', facility: 'Mpilo Hospital ANC', bp: '140/90', weight: '79 kg', notes: 'Planned LSCS at 37+5 decided. Admitted for pre-operative workup.' },
    ],
    medications: [
      { name: 'Methyldopa', dose: '500 mg', freq: 'Three times daily', route: 'Oral', start: '12 Aug 2024', prescriber: 'Dr. M. Dube', status: 'active' },
      { name: 'Calcium Carbonate', dose: '1500 mg', freq: 'Once daily', route: 'Oral', start: '20 Jun 2024', prescriber: 'Dr. M. Dube', status: 'active' },
      { name: 'Aspirin (low-dose)', dose: '75 mg', freq: 'Once daily at night', route: 'Oral', start: '15 Apr 2024', prescriber: 'Dr. M. Dube', status: 'discontinued' },
      { name: 'Cefazolin', dose: '2 g', freq: 'Single pre-operative dose', route: 'IV', start: '22 Oct 2024', prescriber: 'Dr. C. Chigudu', status: 'completed' },
      { name: 'Paracetamol', dose: '1 g', freq: 'Every 6 hours', route: 'Oral', start: '22 Oct 2024', prescriber: 'Dr. C. Chigudu', status: 'active' },
      { name: 'Ibuprofen', dose: '400 mg', freq: 'Every 8 hours with food', route: 'Oral', start: '22 Oct 2024', prescriber: 'Dr. C. Chigudu', status: 'active' },
    ],
    appointments: [
      { date: '29 Oct 2024', time: '08:00 AM', type: 'Post-op Review (Day 7)', provider: 'Dr. C. Chigudu', status: 'upcoming', location: 'Ward Round' },
      { date: '22 Nov 2024', time: '09:30 AM', type: '6-Week Postnatal Review', provider: 'Dr. C. Chigudu', status: 'upcoming', location: 'OPD Maternity' },
    ],
    journey: [
      { stage: 'Planned Admission', icon: 'admission', location: 'Antenatal Admissions', date: '17 Oct 2024', time: '09:00 AM', note: 'Admitted for elective LSCS at 37+5 weeks. Twin pregnancy with gestational hypertension. Pre-op bloods: FBC, U&E, LFT, cross-match 2 units PRBCs.', status: 'done' },
      { stage: 'Pre-operative Ward', icon: 'ward', location: 'Antenatal Ward C, Bed 2', date: '17 Oct 2024', time: '09:30 AM', note: 'Consent signed by patient and confirmed with husband. Nil by mouth from midnight. Cefazolin given.', status: 'done' },
      { stage: 'Spinal Anaesthesia', icon: 'anaesthesia', location: 'Theatre Prep Room', date: '22 Oct 2024', time: '10:15 AM', note: 'Spinal block administered by Dr. T. Kanyama (Anaesthetist). Foley catheter inserted. BP monitoring 2-minutely.', status: 'done' },
      { stage: 'Theatre (LSCS)', icon: 'theatre', location: 'Theatre 1', date: '22 Oct 2024', time: '10:45 AM', note: 'Elective lower segment C-section performed by Dr. C. Chigudu. Twin 1 delivered 10:51, Twin 2 at 10:53. Estimated blood loss 450 ml. Uterus well-contracted.', status: 'done' },
      { stage: 'Recovery Room', icon: 'recovery', location: 'Recovery Bay 2', date: '22 Oct 2024', time: '11:30 AM', note: 'Haemodynamically stable. Spinal anaesthesia wearing off. Pain controlled on regular analgesia. Uterus contracting well on palpation.', status: 'done' },
      { stage: 'Post-Operative Ward', icon: 'postnatal', location: 'Post-op Ward, Bed 3', date: '22 Oct 2024', time: '01:00 PM', note: 'Transferred to post-op ward. IV fluids continued. Urinary catheter in situ. BP monitoring 4-hourly. Babies in nursery.', status: 'active' },
    ],
    babies: [
      {
        name: 'Baby Girl Ncube — Twin 1', sex: 'Female', birthDate: '22 Oct 2024', birthTime: '10:51 AM',
        weight: '2.4 kg', length: '46 cm', headCirc: '31 cm', apgar1: 8, apgar5: 9,
        deliveryType: 'Lower Segment Caesarean Section', status: 'Special Care Nursery (Observation)',
        hivExposure: 'Low Risk — Mother HIV Negative',
        bcg: true, polio: true, vitK: true, eyeDrops: true,
        medications: [
          { name: 'Vitamin K', dose: '1 mg', route: 'IM', date: '22 Oct 2024', note: 'Birth dose' },
          { name: 'BCG Vaccine', dose: '0.05 ml', route: 'Intradermal', date: '22 Oct 2024', note: 'Birth immunization' },
          { name: 'OPV0', dose: '2 drops', route: 'Oral', date: '22 Oct 2024', note: 'Birth dose' },
        ],
        notes: 'Good cry at birth. Moderate jaundice at 48 h — phototherapy commenced. Weight loss 7% — supplemental expressed breast milk. Gaining weight.',
        journey: [
          { stage: 'Birth', icon: 'delivery', location: 'Theatre 1', date: '22 Oct 2024', time: '10:51 AM', note: 'Delivered by LSCS. Good cry. APGAR 8/9.', status: 'done' },
          { stage: 'Special Care Nursery', icon: 'nursery', location: 'SCN Bay 1', date: '22 Oct 2024', time: '11:00 AM', note: 'Admitted for observation: prematurity (37 wks) and twin status. Phototherapy at 48 h for jaundice.', status: 'active' },
        ],
      },
      {
        name: 'Baby Girl Ncube — Twin 2', sex: 'Female', birthDate: '22 Oct 2024', birthTime: '10:53 AM',
        weight: '2.2 kg', length: '44 cm', headCirc: '30.5 cm', apgar1: 7, apgar5: 9,
        deliveryType: 'Lower Segment Caesarean Section', status: 'Special Care Nursery (Phototherapy)',
        hivExposure: 'Low Risk — Mother HIV Negative',
        bcg: true, polio: true, vitK: true, eyeDrops: true,
        medications: [
          { name: 'Vitamin K', dose: '1 mg', route: 'IM', date: '22 Oct 2024', note: 'Birth dose' },
          { name: 'BCG Vaccine', dose: '0.05 ml', route: 'Intradermal', date: '22 Oct 2024', note: 'Birth immunization' },
          { name: 'OPV0', dose: '2 drops', route: 'Oral', date: '22 Oct 2024', note: 'Birth dose' },
          { name: 'Phototherapy', dose: 'Continuous', route: 'Overhead lamp', date: '23 Oct 2024', note: 'Neonatal jaundice — bilirubin 210 µmol/L' },
        ],
        notes: 'Initial depression at birth — responded to stimulation. Jaundice at 36 h — phototherapy started. Feeding by cup and spoon. Weight trending up.',
        journey: [
          { stage: 'Birth', icon: 'delivery', location: 'Theatre 1', date: '22 Oct 2024', time: '10:53 AM', note: 'Delivered by LSCS. Initial depression — responded to stimulation at 2 min. APGAR 7/9.', status: 'done' },
          { stage: 'Special Care Nursery', icon: 'nursery', location: 'SCN Bay 2', date: '22 Oct 2024', time: '11:05 AM', note: 'Admitted for observation. Phototherapy commenced at 36 h for jaundice. Cup feeding with EBM.', status: 'active' },
        ],
      },
    ],
  },

  /* ── 3. Rutendo Dube — High Risk, Severe Pre-eclampsia ── */
  {
    id: 'ZH-2024-0822', name: 'Rutendo Dube',
    dob: '03 Nov 2002', age: 22, nationalId: '63-901234-C-12',
    phone: '+263 78 678 9012', altPhone: '+263 77 890 1234',
    address: 'House 45, Glen View 3, Harare',
    nextOfKin: { name: 'Agnes Dube', relation: 'Mother', phone: '+263 77 890 1234' },
    occupation: 'University Student (UZ — Commerce)', maritalStatus: 'Single', religion: 'Pentecostal',
    status: 'high-risk', ward: 'High Dependency Unit (HDU)', bed: 'Bed 2',
    admissionDate: '22 Oct 2024', dischargeDate: null,
    gestationalAge: '34+1 wks', gravida: 1, para: 0,
    bloodGroup: 'A+', hivStatus: 'Negative', pmtct: 'N/A',
    height: '165 cm', bookingWeight: '61 kg', lmp: '15 Feb 2024', edd: '22 Nov 2024',
    allergies: 'None known', chronic: ['Severe Pre-eclampsia'],
    vitals: { bp: '162/108', pulse: '94 bpm', temp: '36.9°C', spo2: '96%', rr: '22 /min' },
    ancVisits: [
      { date: '20 Mar 2024', weeks: '5 wks', facility: 'Mbare Polyclinic', bp: '110/68', weight: '59 kg', notes: 'Booking. Primigravida. HIV negative. Folic acid commenced. PMTCT education provided.' },
      { date: '18 May 2024', weeks: '13 wks', facility: 'Mbare Polyclinic', bp: '114/70', weight: '61 kg', notes: 'NT scan normal. TT1 given. Referred for consultant review at tertiary level.' },
      { date: '05 Aug 2024', weeks: '24 wks', facility: 'Parirenyatwa Hospital OPD', bp: '118/76', weight: '65 kg', notes: 'Anomaly scan normal. Aspirin 75 mg commenced. Counselled on pre-eclampsia risk factors.' },
      { date: '20 Sep 2024', weeks: '31 wks', facility: 'Parirenyatwa Hospital OPD', bp: '140/92', weight: '68 kg', notes: 'BP elevated. Admitted briefly for observation. Discharged on methyldopa 250 mg TDS. 2/52 review.' },
    ],
    medications: [
      { name: 'Magnesium Sulphate', dose: '4 g loading → 1 g/hr', freq: 'Continuous IV infusion', route: 'IV', start: '22 Oct 2024', prescriber: 'Dr. C. Chigudu', status: 'active' },
      { name: 'Labetalol', dose: '200 mg', freq: 'Twice daily', route: 'Oral', start: '22 Oct 2024', prescriber: 'Dr. C. Chigudu', status: 'active' },
      { name: 'Hydralazine', dose: '10 mg', freq: 'PRN for acute hypertension (BP ≥160/110)', route: 'IV', start: '22 Oct 2024', prescriber: 'Dr. C. Chigudu', status: 'active' },
      { name: 'Betamethasone', dose: '12 mg × 2 doses (24 h apart)', freq: 'Fetal lung maturation', route: 'IM', start: '22 Oct 2024', prescriber: 'Dr. C. Chigudu', status: 'completed' },
      { name: 'Folic Acid', dose: '5 mg', freq: 'Once daily', route: 'Oral', start: '20 Mar 2024', prescriber: 'Dr. R. Mupanduki', status: 'active' },
    ],
    appointments: [
      { date: '23 Oct 2024', time: '08:00 AM', type: 'HDU Ward Round', provider: 'Dr. C. Chigudu', status: 'upcoming', location: 'HDU Maternity' },
      { date: '23 Oct 2024', time: '02:00 PM', type: 'MFM Specialist Review', provider: 'Prof. A. Madziyire', status: 'upcoming', location: 'HDU Maternity' },
    ],
    journey: [
      { stage: 'Emergency Admission', icon: 'admission', location: 'A&E Maternity', date: '22 Oct 2024', time: '06:30 AM', note: 'Admitted with BP 168/112, severe occipital headache, visual disturbances (scotomata), and facial oedema. Urine protein 3+ on dipstick. Urgent bloods sent.', status: 'done' },
      { stage: 'High Dependency Unit', icon: 'hdu', location: 'HDU, Bed 2', date: '22 Oct 2024', time: '07:00 AM', note: 'MgSO4 loading dose given IV over 20 min. IV labetalol 20 mg administered. Continuous CTG commenced — fetal heart reactive. Urinary catheter inserted for strict urine output monitoring (target ≥30 ml/hr). Betamethasone 1st dose given.', status: 'active' },
    ],
    baby: null,
  },

  /* ── 4. Farai Mupambi — Admitted, GDM, 36+4 weeks ── */
  {
    id: 'ZH-2024-0835', name: 'Farai Mupambi',
    dob: '14 Aug 1989', age: 35, nationalId: '63-567890-D-56',
    phone: '+263 71 234 5678', altPhone: '+263 73 456 7890',
    address: '22 Arcturus Road, Greendale, Harare',
    nextOfKin: { name: 'Tatenda Mupambi', relation: 'Husband', phone: '+263 73 456 7890' },
    occupation: 'Accountant (Private Practice)', maritalStatus: 'Married', religion: 'Seventh Day Adventist',
    status: 'admitted', ward: 'Antenatal Ward A', bed: 'Bed 11',
    admissionDate: '21 Oct 2024', dischargeDate: null,
    gestationalAge: '36+4 wks', gravida: 4, para: 2,
    bloodGroup: 'B+', hivStatus: 'Negative', pmtct: 'N/A',
    height: '170 cm', bookingWeight: '82 kg', lmp: '05 Feb 2024', edd: '12 Nov 2024',
    allergies: 'Sulphonamides (rash)', chronic: ['Gestational Diabetes Mellitus (GDM)', 'Mild Anaemia (Hb 10.2 g/dL)'],
    vitals: { bp: '128/82', pulse: '88 bpm', temp: '36.6°C', spo2: '99%', rr: '17 /min' },
    ancVisits: [
      { date: '01 Mar 2024', weeks: '4 wks', facility: 'Greendale Clinic', bp: '120/78', weight: '80 kg', notes: 'Booking. Advanced maternal age. OGTT ordered. Folic acid & ferrous sulphate commenced.' },
      { date: '15 May 2024', weeks: '15 wks', facility: 'Greendale Clinic', bp: '122/80', weight: '81 kg', notes: 'OGTT: 9.2 mmol/L at 2 hr — GDM confirmed. Referred to diabetic clinic and dietician.' },
      { date: '10 Jul 2024', weeks: '23 wks', facility: 'Parirenyatwa Hospital OPD', bp: '126/82', weight: '83 kg', notes: 'HbA1c 6.8%. Metformin 1 g BD commenced. Anomaly scan normal. Dietary counselling provided.' },
      { date: '04 Sep 2024', weeks: '31 wks', facility: 'Parirenyatwa Hospital OPD', bp: '128/84', weight: '85 kg', notes: 'Growth scan: EFW 2.2 kg (75th centile). HbA1c 6.2%. Macrosomia risk discussed.' },
      { date: '18 Oct 2024', weeks: '36 wks', facility: 'Parirenyatwa Hospital OPD', bp: '130/85', weight: '86 kg', notes: 'EFW 3.1 kg — tracking above 90th centile. Admitted for blood glucose optimisation and delivery planning.' },
    ],
    medications: [
      { name: 'Metformin', dose: '1 g', freq: 'Twice daily with meals', route: 'Oral', start: '10 Jul 2024', prescriber: 'Dr. E. Maweni', status: 'active' },
      { name: 'Insulin Actrapid', dose: 'Sliding scale', freq: 'Pre-meals (QDS monitoring)', route: 'SC', start: '21 Oct 2024', prescriber: 'Dr. C. Chigudu', status: 'active' },
      { name: 'Ferrous Sulphate', dose: '200 mg', freq: 'Once daily', route: 'Oral', start: '01 Mar 2024', prescriber: 'Dr. R. Mupanduki', status: 'active' },
      { name: 'Folic Acid', dose: '5 mg', freq: 'Once daily', route: 'Oral', start: '01 Mar 2024', prescriber: 'Dr. R. Mupanduki', status: 'active' },
    ],
    appointments: [
      { date: '24 Oct 2024', time: '10:00 AM', type: 'Diabetic Review & Delivery Planning', provider: 'Dr. C. Chigudu & Dr. E. Maweni', status: 'upcoming', location: 'Ward Round' },
    ],
    journey: [
      { stage: 'Planned Admission', icon: 'admission', location: 'Antenatal Admissions', date: '21 Oct 2024', time: '08:00 AM', note: 'Admitted for blood glucose optimisation and delivery planning. GDM on metformin with poor glucose control in recent weeks. EFW tracking macrosomic.', status: 'done' },
      { stage: 'Antenatal Ward', icon: 'ward', location: 'Ward A, Bed 11', date: '21 Oct 2024', time: '08:30 AM', note: 'QDS blood glucose monitoring initiated. Insulin sliding scale commenced. CTG daily. Endocrinology review requested. Delivery planned for 38 weeks if well-controlled.', status: 'active' },
    ],
    baby: null,
  },

  /* ── 5. Primrose Sithole — Discharged, NVD, Mufakose ── */
  {
    id: 'ZH-2024-0815', name: 'Primrose Sithole',
    dob: '22 Jan 2005', age: 19, nationalId: '63-345678-E-90',
    phone: '+263 78 901 2345', altPhone: '+263 71 123 4567',
    address: 'House 88, Mufakose, Harare',
    nextOfKin: { name: 'Judith Sithole', relation: 'Mother', phone: '+263 71 123 4567' },
    occupation: 'Student (A-Level — Churchill High School)', maritalStatus: 'Single', religion: 'Pentecostal',
    status: 'discharged', ward: '—', bed: '—',
    admissionDate: '15 Oct 2024', dischargeDate: '21 Oct 2024',
    gestationalAge: '40+1 wks', gravida: 1, para: 1,
    bloodGroup: 'O–', hivStatus: 'Negative', pmtct: 'N/A',
    height: '160 cm', bookingWeight: '60 kg', lmp: '12 Jan 2024', edd: '19 Oct 2024',
    allergies: 'None known', chronic: ['None'],
    vitals: { bp: '110/70', pulse: '80 bpm', temp: '36.7°C', spo2: '99%', rr: '16 /min' },
    ancVisits: [
      { date: '10 Mar 2024', weeks: '8 wks', facility: 'Mufakose Polyclinic', bp: '108/66', weight: '58 kg', notes: 'Booking. Primigravida. HIV negative. Ferrous sulphate & folic acid prescribed. Social worker referral — adolescent support.' },
      { date: '14 Jun 2024', weeks: '22 wks', facility: 'Mufakose Polyclinic', bp: '110/68', weight: '61 kg', notes: 'Anomaly scan normal. TT2 given. Attended adolescent ANC group session.' },
      { date: '06 Sep 2024', weeks: '34 wks', facility: 'Parirenyatwa Hospital OPD', bp: '112/70', weight: '64 kg', notes: 'Growth scan: EFW 2.3 kg — normal for dates. Planning facility delivery.' },
    ],
    medications: [
      { name: 'Ferrous Sulphate', dose: '200 mg', freq: 'Once daily', route: 'Oral', start: '10 Mar 2024', prescriber: 'Dr. R. Mupanduki', status: 'active' },
      { name: 'Folic Acid', dose: '5 mg', freq: 'Once daily', route: 'Oral', start: '10 Mar 2024', prescriber: 'Dr. R. Mupanduki', status: 'active' },
      { name: 'Oxytocin', dose: '10 IU', freq: 'Single post-delivery dose (AMTSL)', route: 'IM', start: '15 Oct 2024', prescriber: 'Dr. C. Chigudu', status: 'completed' },
    ],
    appointments: [
      { date: '29 Oct 2024', time: '09:00 AM', type: 'Postnatal Check (Day 8)', provider: 'Dr. C. Chigudu', status: 'upcoming', location: 'OPD Maternity' },
      { date: '29 Nov 2024', time: '10:00 AM', type: 'Family Planning Counselling', provider: 'Sister M. Choto', status: 'upcoming', location: 'Family Planning Clinic' },
    ],
    journey: [
      { stage: 'Emergency Admission', icon: 'admission', location: 'A&E Maternity', date: '15 Oct 2024', time: '04:00 AM', note: 'Admitted in spontaneous labour. Cervix 5 cm dilated, fully effaced. FHR 138 bpm — reassuring.', status: 'done' },
      { stage: 'Labour Ward', icon: 'labour', location: 'Labour Room 1', date: '15 Oct 2024', time: '04:30 AM', note: 'Progress monitored on partogram. Amniotic membranes ruptured spontaneously at 6 cm dilation. Clear liquor.', status: 'done' },
      { stage: 'Delivery', icon: 'delivery', location: 'Labour Room 1', date: '15 Oct 2024', time: '09:14 AM', note: 'Spontaneous normal vaginal delivery. Live female infant 3.0 kg. Intact perineum. AMTSL performed. Placenta delivered intact.', status: 'done' },
      { stage: 'Postnatal Ward', icon: 'postnatal', location: 'Ward B, Bed 4', date: '15 Oct 2024', time: '10:30 AM', note: 'Mother and baby stable. Social worker review completed. Family planning counselling given (DMPA injection at 6 weeks). Mother supported by maternal grandmother.', status: 'done' },
      { stage: 'Discharged Home', icon: 'discharge', location: '—', date: '21 Oct 2024', time: '10:00 AM', note: 'Discharged in good condition after 6-day postnatal stay. Postnatal discharge pack issued. Under-5 clinic card given to mother. 8-day postnatal review booked.', status: 'done' },
    ],
    baby: {
      name: 'Baby Girl Sithole', sex: 'Female', birthDate: '15 Oct 2024', birthTime: '09:14 AM',
      weight: '3.0 kg', length: '48 cm', headCirc: '33 cm', apgar1: 9, apgar5: 9,
      deliveryType: 'Normal Vaginal Delivery', status: 'Discharged (with mother)',
      hivExposure: 'Low Risk — Mother HIV Negative',
      bcg: true, polio: true, vitK: true, eyeDrops: true,
      medications: [
        { name: 'Vitamin K', dose: '1 mg', route: 'IM', date: '15 Oct 2024', note: 'Birth dose' },
        { name: 'BCG Vaccine', dose: '0.05 ml', route: 'Intradermal', date: '15 Oct 2024', note: 'Birth immunization' },
        { name: 'OPV0', dose: '2 drops', route: 'Oral', date: '15 Oct 2024', note: 'Birth dose' },
        { name: 'Tetracycline Eye Ointment', dose: 'Single application', route: 'Both eyes', date: '15 Oct 2024', note: 'Prophylaxis' },
      ],
      notes: 'Exclusively breastfed. Birth registration completed before discharge. Newborn hearing screen passed. 6-week immunization review booked at Under-5 clinic.',
      journey: [
        { stage: 'Birth', icon: 'delivery', location: 'Labour Room 1', date: '15 Oct 2024', time: '09:14 AM', note: 'Born by NVD. Excellent cry immediately. APGAR 9/9.', status: 'done' },
        { stage: 'Rooming-in', icon: 'postnatal', location: 'Ward B, Bed 4', date: '15 Oct 2024', time: '10:30 AM', note: 'Breastfeeding well. All birth immunizations administered.', status: 'done' },
        { stage: 'Discharged Home', icon: 'discharge', location: '—', date: '21 Oct 2024', time: '10:00 AM', note: 'Discharged with mother. Under-5 clinic card issued. First postnatal clinic booked.', status: 'done' },
      ],
    },
  },

  /* ── 6. Rudo Chimuti — In Labour, Preterm 34+2 wks, HIV+ ── */
  {
    id: 'ZH-2024-0848', name: 'Rudo Chimuti',
    dob: '30 Sep 1998', age: 26, nationalId: '63-678901-F-23',
    phone: '+263 77 567 8901', altPhone: '+263 71 678 9012',
    address: 'House 14, Budiriro 5, Harare',
    nextOfKin: { name: 'Taurai Chimuti', relation: 'Husband', phone: '+263 71 678 9012' },
    occupation: 'Hairdresser (Self-employed)', maritalStatus: 'Married', religion: 'ZAOGA',
    status: 'labour', ward: 'Labour Ward', bed: 'Labour Room 2',
    admissionDate: '23 Oct 2024', dischargeDate: null,
    gestationalAge: '34+2 wks', gravida: 2, para: 1,
    bloodGroup: 'O+', hivStatus: 'Positive (Well-controlled on HAART)', pmtct: 'Active — TDF/3TC/DTG (Viral Load <40 cp/ml)',
    height: '163 cm', bookingWeight: '64 kg', lmp: '18 Feb 2024', edd: '25 Nov 2024',
    allergies: 'None known', chronic: ['HIV (CD4 720 cells/µL — Well-controlled)', 'Preterm Labour (34 wks)'],
    vitals: { bp: '122/78', pulse: '96 bpm', temp: '36.9°C', spo2: '98%', rr: '19 /min' },
    ancVisits: [
      { date: '15 Mar 2024', weeks: '4 wks', facility: 'Budiriro Polyclinic', bp: '112/72', weight: '62 kg', notes: 'Booking. HIV positive — already on TDF/3TC/DTG from ART clinic. Viral load undetectable. CD4 690. PMTCT counselling reinforced.' },
      { date: '20 May 2024', weeks: '13 wks', facility: 'Budiriro Polyclinic', bp: '116/74', weight: '63 kg', notes: 'Adherence excellent. Viral load <40 cp/ml. TT1 given. Iron and folate continued.' },
      { date: '01 Aug 2024', weeks: '24 wks', facility: 'Parirenyatwa Hospital OPD', bp: '118/76', weight: '65 kg', notes: 'Anomaly scan normal. Viral load undetectable. CD4 720. Cervical length 32 mm — within normal limits.' },
      { date: '01 Oct 2024', weeks: '31 wks', facility: 'Parirenyatwa Hospital OPD', bp: '120/78', weight: '66 kg', notes: 'Growth scan: EFW 1.6 kg (50th centile). Normal for dates. Fetal kick chart issued.' },
    ],
    medications: [
      { name: 'TDF/3TC/DTG (Dolutegravir FDC)', dose: '1 tablet', freq: 'Once daily at night', route: 'Oral', start: '15 Mar 2024', prescriber: 'Dr. S. Mhishi (ART Clinic)', status: 'active' },
      { name: 'Ferrous Sulphate', dose: '200 mg', freq: 'Once daily', route: 'Oral', start: '15 Mar 2024', prescriber: 'Dr. R. Mupanduki', status: 'active' },
      { name: 'Folic Acid', dose: '5 mg', freq: 'Once daily', route: 'Oral', start: '15 Mar 2024', prescriber: 'Dr. R. Mupanduki', status: 'active' },
      { name: 'Betamethasone', dose: '12 mg', freq: '1st dose — 2nd dose due in 24 hrs', route: 'IM', start: '23 Oct 2024', prescriber: 'Dr. C. Chigudu', status: 'active' },
    ],
    appointments: [],
    journey: [
      { stage: 'Emergency Admission', icon: 'admission', location: 'A&E Maternity', date: '23 Oct 2024', time: '03:45 AM', note: 'Presented with painful preterm contractions every 4 min at 34+2 weeks. Cervix 3 cm dilated, 50% effaced. FHR 148 bpm — reassuring. Steroids commenced for lung maturation.', status: 'done' },
      { stage: 'Labour Ward — Active Labour', icon: 'labour', location: 'Labour Room 2', date: '23 Oct 2024', time: '04:15 AM', note: 'IV access established. Continuous CTG monitoring. Tocolysis attempted with nifedipine — failed, labour progressing. Betamethasone 1st dose IM. NICU team notified. PMTCT protocol active — IV nevirapine prepared.', status: 'active' },
    ],
    baby: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function InfoGrid({ rows }) {
  return (
    <div>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: 'flex', gap: 12, padding: '8px 0',
          borderBottom: i < rows.length - 1 ? '1px solid var(--pm-border)' : 'none',
          alignItems: 'flex-start',
        }}>
          <span style={{ width: 170, flexShrink: 0, fontSize: '0.78rem', color: 'var(--pm-text-muted)', fontWeight: 500, paddingTop: 1 }}>{r.label}</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.4 }}>{r.value || '—'}</span>
        </div>
      ))}
    </div>
  );
}

function VitalChip({ label, value, alert }) {
  return (
    <div style={{
      background: alert ? '#fff1f2' : 'var(--pm-surface-2)',
      border: `1px solid ${alert ? 'var(--pm-danger)' : 'var(--pm-border)'}`,
      borderRadius: 8, padding: '8px 12px', minWidth: 90, flex: 1,
    }}>
      <div style={{ fontSize: '0.67rem', color: alert ? 'var(--pm-danger)' : 'var(--pm-text-muted)', fontWeight: 600, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: alert ? 'var(--pm-danger)' : 'var(--pm-text)' }}>{value}</div>
    </div>
  );
}

function JourneyTimeline({ stages }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 30 }}>
      {stages.map((s, i) => {
        const isActive = s.status === 'active';
        const isDone = s.status === 'done';
        const lineColor = isDone ? '#bbf7d0' : 'var(--pm-border)';
        const circleColor = isActive ? 'var(--pm-primary)' : isDone ? '#16a34a' : '#d1d5db';
        const Icon = J_ICONS[s.icon] || Info;
        return (
          <div key={i} style={{ position: 'relative', paddingBottom: i < stages.length - 1 ? 18 : 0 }}>
            {i < stages.length - 1 && (
              <div style={{ position: 'absolute', left: -22, top: 22, width: 2, bottom: 0, background: lineColor }} />
            )}
            <div style={{
              position: 'absolute', left: -30, top: 3, width: 20, height: 20, borderRadius: '50%',
              background: circleColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isActive ? '0 0 0 3px rgba(var(--pm-primary-rgb,90,80,200),0.2)' : 'none',
            }}>
              <Icon size={11} color="#fff" strokeWidth={2.5} />
            </div>
            <div style={{
              background: isActive ? 'var(--pm-surface-2)' : 'transparent',
              border: `1px solid ${isActive ? 'var(--pm-primary)' : 'var(--pm-border)'}`,
              borderRadius: 8, padding: '10px 14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4, gap: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{s.stage}</span>
                  {isActive && <span className="pm-badge pm-badge-info" style={{ fontSize: '0.62rem', padding: '1px 7px' }}>Current</span>}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', whiteSpace: 'nowrap' }}>{s.date} · {s.time}</span>
              </div>
              {s.location !== '—' && (
                <div style={{ fontSize: '0.76rem', color: 'var(--pm-text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={11} /> {s.location}
                </div>
              )}
              <div style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>{s.note}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MedBadge({ status }) {
  if (status === 'active') return <span className="pm-badge pm-badge-success" style={{ fontSize: '0.65rem' }}>Active</span>;
  if (status === 'completed') return <span className="pm-badge pm-badge-info" style={{ fontSize: '0.65rem' }}>Completed</span>;
  if (status === 'discontinued') return <span className="pm-badge pm-badge-neutral" style={{ fontSize: '0.65rem' }}>Stopped</span>;
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB PANELS
// ─────────────────────────────────────────────────────────────────────────────

function OverviewTab({ patient }) {
  return (
    <div className="row g-3">
      <div className="col-12 col-md-6">
        <div className="pm-card">
          <div className="pm-section-title" style={{ marginBottom: 12 }}>Personal Information</div>
          <InfoGrid rows={[
            { label: 'Full Name', value: patient.name },
            { label: 'Date of Birth', value: `${patient.dob} (Age ${patient.age})` },
            { label: 'National ID', value: patient.nationalId },
            { label: 'Marital Status', value: patient.maritalStatus },
            { label: 'Occupation', value: patient.occupation },
            { label: 'Religion', value: patient.religion },
          ]} />
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="pm-card">
          <div className="pm-section-title" style={{ marginBottom: 12 }}>Contact Details</div>
          <InfoGrid rows={[
            { label: 'Primary Phone', value: patient.phone },
            { label: 'Alternate Phone', value: patient.altPhone },
            { label: 'Home Address', value: patient.address },
          ]} />
          <div style={{ marginTop: 16, background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--pm-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next of Kin</div>
            <InfoGrid rows={[
              { label: 'Name', value: patient.nextOfKin.name },
              { label: 'Relationship', value: patient.nextOfKin.relation },
              { label: 'Phone', value: patient.nextOfKin.phone },
            ]} />
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="pm-card">
          <div className="pm-section-title" style={{ marginBottom: 12 }}>Admission Details</div>
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <InfoGrid rows={[
                { label: 'Patient ID', value: patient.id },
                { label: 'Admission Date', value: patient.admissionDate },
                { label: 'Discharge Date', value: patient.dischargeDate || 'Still admitted' },
                { label: 'Current Ward', value: patient.ward },
                { label: 'Bed', value: patient.bed },
              ]} />
            </div>
            <div className="col-12 col-md-6">
              <InfoGrid rows={[
                { label: 'Status', value: <StatusBadge status={patient.status} /> },
                { label: 'Blood Group', value: patient.bloodGroup },
                { label: 'HIV Status', value: patient.hivStatus },
                { label: 'PMTCT', value: patient.pmtct },
                { label: 'Allergies', value: patient.allergies },
              ]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClinicalTab({ patient }) {
  const bpAlert = patient.vitals.bp.split('/')[0] > 140;
  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="pm-card">
          <div className="pm-section-title" style={{ marginBottom: 12 }}>Current Vitals</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <VitalChip label="Blood Pressure" value={patient.vitals.bp} alert={bpAlert} />
            <VitalChip label="Pulse" value={patient.vitals.pulse} />
            <VitalChip label="Temp" value={patient.vitals.temp} />
            <VitalChip label="SpO₂" value={patient.vitals.spo2} />
            <VitalChip label="Resp. Rate" value={patient.vitals.rr} />
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="pm-card">
          <div className="pm-section-title" style={{ marginBottom: 12 }}>Obstetric Profile</div>
          <InfoGrid rows={[
            { label: 'Gestational Age', value: patient.gestationalAge },
            { label: 'Gravida / Para', value: `G${patient.gravida} P${patient.para}` },
            { label: 'LMP', value: patient.lmp },
            { label: 'EDD', value: patient.edd },
            { label: 'Height', value: patient.height },
            { label: 'Booking Weight', value: patient.bookingWeight },
          ]} />
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="pm-card">
          <div className="pm-section-title" style={{ marginBottom: 12 }}>Chronic Conditions & Risks</div>
          {patient.chronic.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < patient.chronic.length - 1 ? '1px solid var(--pm-border)' : 'none' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: c === 'None' ? '#16a34a' : '#dc2626', flexShrink: 0 }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{c}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: '8px 12px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 6 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9a3412', marginBottom: 2 }}>Known Allergies</div>
            <div style={{ fontSize: '0.83rem' }}>{patient.allergies}</div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="pm-card">
          <div className="pm-section-header" style={{ marginBottom: 12 }}>
            <div className="pm-section-title">ANC Visit History</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{patient.ancVisits.length} visit{patient.ancVisits.length !== 1 ? 's' : ''} recorded</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="pm-table">
              <thead>
                <tr>
                  <th>DATE</th><th>GESTATION</th><th>FACILITY</th><th>BP</th><th>WEIGHT</th><th>NOTES</th>
                </tr>
              </thead>
              <tbody>
                {patient.ancVisits.map((v, i) => (
                  <tr key={i}>
                    <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{v.date}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{v.weeks}</td>
                    <td style={{ color: 'var(--pm-text-muted)', fontSize: '0.82rem' }}>{v.facility}</td>
                    <td style={{ fontWeight: 600 }}>{v.bp}</td>
                    <td>{v.weight}</td>
                    <td style={{ fontSize: '0.81rem', color: 'var(--pm-text-muted)', minWidth: 220 }}>{v.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function JourneyTab({ patient }) {
  return (
    <div className="pm-card">
      <div className="pm-section-header" style={{ marginBottom: 16 }}>
        <div>
          <div className="pm-section-title">Hospitalisation Journey</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{patient.journey.length} stage{patient.journey.length !== 1 ? 's' : ''} recorded</div>
        </div>
        <StatusBadge status={patient.status} />
      </div>
      <JourneyTimeline stages={patient.journey} />
    </div>
  );
}

function MedicationsTab({ patient }) {
  const active = patient.medications.filter(m => m.status === 'active');
  const other = patient.medications.filter(m => m.status !== 'active');
  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="pm-card">
          <div className="pm-section-header" style={{ marginBottom: 12 }}>
            <div>
              <div className="pm-section-title">Current Medications</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{active.length} active medication{active.length !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="pm-table">
              <thead>
                <tr><th>MEDICATION</th><th>DOSE</th><th>FREQUENCY</th><th>ROUTE</th><th>STARTED</th><th>PRESCRIBER</th><th>STATUS</th></tr>
              </thead>
              <tbody>
                {patient.medications.map((m, i) => (
                  <tr key={i} style={{ opacity: m.status === 'discontinued' ? 0.55 : 1 }}>
                    <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{m.name}</td>
                    <td>{m.dose}</td>
                    <td style={{ color: 'var(--pm-text-muted)', fontSize: '0.82rem' }}>{m.freq}</td>
                    <td><span className="pm-badge pm-badge-neutral" style={{ fontSize: '0.65rem' }}>{m.route}</span></td>
                    <td style={{ color: 'var(--pm-text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{m.start}</td>
                    <td style={{ color: 'var(--pm-text-muted)', fontSize: '0.82rem' }}>{m.prescriber}</td>
                    <td><MedBadge status={m.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppointmentsTab({ patient }) {
  return (
    <div className="pm-card">
      <div className="pm-section-title" style={{ marginBottom: 16 }}>Upcoming Appointments</div>
      {patient.appointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--pm-text-muted)' }}>
          <Calendar size={32} style={{ opacity: 0.3, marginBottom: 10 }} />
          <div style={{ fontSize: '0.88rem' }}>No scheduled appointments</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {patient.appointments.map((a, i) => (
            <div key={i} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start', padding: '12px 14px',
              background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', borderRadius: 8,
            }}>
              <div style={{ width: 46, height: 46, borderRadius: 8, background: 'var(--pm-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, opacity: 0.8 }}>{a.date.split(' ')[1]}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1 }}>{a.date.split(' ')[0]}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 2 }}>{a.type}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span>⏰ {a.time}</span>
                  <span>👩‍⚕️ {a.provider}</span>
                  <span>📍 {a.location}</span>
                </div>
              </div>
              <span className="pm-badge pm-badge-info" style={{ fontSize: '0.65rem', flexShrink: 0 }}>Upcoming</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SingleBabyCard({ baby, index }) {
  const [babyTab, setBabyTab] = useState('info');
  const babyTabs = [
    { key: 'info', label: 'Baby Info' },
    { key: 'journey', label: 'Journey' },
    { key: 'meds', label: 'Medications' },
  ];
  const sexColor = baby.sex === 'Male' ? '#3b82f6' : '#ec4899';

  return (
    <div style={{ border: '1px solid var(--pm-border)', borderRadius: 10, overflow: 'hidden', marginBottom: index > 0 ? 16 : 0 }}>
      {/* Baby Header */}
      <div style={{ background: baby.sex === 'Male' ? '#eff6ff' : '#fdf2f8', padding: '14px 18px', borderBottom: '1px solid var(--pm-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: sexColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Baby size={22} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{baby.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{baby.deliveryType} · Born {baby.birthDate} at {baby.birthTime}</div>
        </div>
        <span className={`pm-badge ${baby.status.includes('Discharged') ? 'pm-badge-neutral' : 'pm-badge-success'}`} style={{ marginLeft: 'auto', fontSize: '0.68rem' }}>
          {baby.status.split('(')[0].trim()}
        </span>
      </div>

      {/* Baby Subtabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--pm-border)', background: 'var(--pm-surface-2)', padding: '0 8px' }}>
        {babyTabs.map(t => (
          <button key={t.key} onClick={() => setBabyTab(t.key)} style={{
            padding: '9px 14px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: '0.78rem', fontWeight: babyTab === t.key ? 700 : 500,
            color: babyTab === t.key ? 'var(--pm-primary)' : 'var(--pm-text-muted)',
            borderBottom: babyTab === t.key ? '2px solid var(--pm-primary)' : '2px solid transparent',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Baby Tab Content */}
      <div style={{ padding: 16 }}>
        {babyTab === 'info' && (
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <InfoGrid rows={[
                { label: 'Sex', value: baby.sex },
                { label: 'Birth Weight', value: baby.weight },
                { label: 'Birth Length', value: baby.length },
                { label: 'Head Circumference', value: baby.headCirc },
                { label: 'APGAR (1 min)', value: `${baby.apgar1}/10` },
                { label: 'APGAR (5 min)', value: `${baby.apgar5}/10` },
              ]} />
            </div>
            <div className="col-12 col-md-6">
              <InfoGrid rows={[
                { label: 'Current Status', value: baby.status },
                { label: 'HIV Exposure', value: baby.hivExposure },
                { label: 'BCG Given', value: baby.bcg ? '✓ Yes' : '✗ No' },
                { label: 'OPV0 Given', value: baby.polio ? '✓ Yes' : '✗ No' },
                { label: 'Vitamin K Given', value: baby.vitK ? '✓ Yes' : '✗ No' },
                { label: 'Eye Ointment', value: baby.eyeDrops ? '✓ Yes' : '✗ No' },
              ]} />
            </div>
            {baby.notes && (
              <div className="col-12">
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15803d', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Clinical Notes</div>
                  <div style={{ fontSize: '0.83rem', lineHeight: 1.6 }}>{baby.notes}</div>
                </div>
              </div>
            )}
          </div>
        )}
        {babyTab === 'journey' && <JourneyTimeline stages={baby.journey} />}
        {babyTab === 'meds' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="pm-table">
              <thead>
                <tr><th>MEDICATION</th><th>DOSE</th><th>ROUTE</th><th>DATE</th><th>NOTES</th></tr>
              </thead>
              <tbody>
                {baby.medications.map((m, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{m.name}</td>
                    <td>{m.dose}</td>
                    <td><span className="pm-badge pm-badge-neutral" style={{ fontSize: '0.65rem' }}>{m.route}</span></td>
                    <td style={{ color: 'var(--pm-text-muted)', whiteSpace: 'nowrap' }}>{m.date}</td>
                    <td style={{ color: 'var(--pm-text-muted)', fontSize: '0.82rem' }}>{m.note}</td>
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

function BabyTab({ patient }) {
  const babies = patient.babies || (patient.baby ? [patient.baby] : []);
  if (babies.length === 0) {
    return (
      <div className="pm-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Baby size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
        <div style={{ fontWeight: 600, marginBottom: 4 }}>No baby record yet</div>
        <div style={{ fontSize: '0.83rem', color: 'var(--pm-text-muted)' }}>Baby information will appear here after delivery.</div>
      </div>
    );
  }
  return (
    <div>
      {babies.length > 1 && (
        <div style={{ marginBottom: 12, padding: '8px 14px', background: '#fef9c3', border: '1px solid #fde047', borderRadius: 8, fontSize: '0.83rem', fontWeight: 600, color: '#854d0e' }}>
          ★ Multiple Birth — {babies.length} babies recorded
        </div>
      )}
      {babies.map((baby, i) => <SingleBabyCard key={i} baby={baby} index={i} />)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT DETAIL VIEW
// ─────────────────────────────────────────────────────────────────────────────

function PatientDetail({ patient, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const hasBaby = patient.baby || (patient.babies && patient.babies.length > 0);
  const babyCount = patient.babies ? patient.babies.length : (patient.baby ? 1 : 0);

  const TABS = [
    { key: 'overview', label: 'Personal', icon: User },
    { key: 'clinical', label: 'Clinical', icon: Stethoscope },
    { key: 'journey', label: 'Journey', icon: Activity },
    { key: 'medications', label: 'Medications', icon: Pill },
    { key: 'appointments', label: 'Appointments', icon: Calendar },
    ...(hasBaby ? [{ key: 'baby', label: babyCount > 1 ? `Babies (${babyCount})` : 'Baby', icon: Baby }] : []),
  ];

  const gravida = patient.gravida, para = patient.para;

  return (
    <div>
      {/* Back Button + Header */}
      <div style={{ marginBottom: 16 }}>
        <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={onBack} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <ChevronLeft size={16} /> Back to Patients
        </button>
        <div className="pm-card" style={{ padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
              background: 'var(--pm-primary)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', fontWeight: 800,
            }}>
              {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{patient.name}</span>
                <StatusBadge status={patient.status} />
                {patient.hivStatus.startsWith('Positive') && (
                  <span className="pm-badge pm-badge-danger" style={{ fontSize: '0.65rem' }}>PMTCT Active</span>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', marginTop: 3, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span>{patient.id}</span>
                <span>Age {patient.age}</span>
                <span>G{gravida}P{para}</span>
                <span>{patient.gestationalAge}</span>
                <span>{patient.ward}{patient.bed !== '—' ? ` · ${patient.bed}` : ''}</span>
              </div>
            </div>
            {patient.status === 'high-risk' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#fee2e2', border: '1px solid var(--pm-danger)', borderRadius: 8, color: 'var(--pm-danger)', fontWeight: 700, fontSize: '0.8rem' }}>
                <AlertTriangle size={15} /> HIGH RISK — CLOSE MONITORING
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--pm-border)', marginBottom: 16, overflowX: 'auto', flexShrink: 0 }}>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '0.83rem', fontWeight: activeTab === t.key ? 700 : 500, whiteSpace: 'nowrap',
              color: activeTab === t.key ? 'var(--pm-primary)' : 'var(--pm-text-muted)',
              borderBottom: activeTab === t.key ? '2px solid var(--pm-primary)' : '2px solid transparent',
              marginBottom: -2,
            }}>
              <Icon size={14} />{t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview'      && <OverviewTab patient={patient} />}
      {activeTab === 'clinical'      && <ClinicalTab patient={patient} />}
      {activeTab === 'journey'       && <JourneyTab patient={patient} />}
      {activeTab === 'medications'   && <MedicationsTab patient={patient} />}
      {activeTab === 'appointments'  && <AppointmentsTab patient={patient} />}
      {activeTab === 'baby'          && <BabyTab patient={patient} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PATIENTS PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function PatientsPage({ user, onNavigate }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const stats = useMemo(() => ({
    total:      PATIENTS.filter(p => p.status !== 'discharged').length,
    admitted:   PATIENTS.filter(p => p.status === 'admitted').length,
    labour:     PATIENTS.filter(p => p.status === 'labour').length,
    postnatal:  PATIENTS.filter(p => p.status === 'postnatal').length,
    operated:   PATIENTS.filter(p => p.status === 'operated').length,
    highRisk:   PATIENTS.filter(p => p.status === 'high-risk').length,
    discharged: PATIENTS.filter(p => p.status === 'discharged').length,
  }), []);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return PATIENTS.filter(p =>
      (p.name.toLowerCase().includes(s) || p.id.toLowerCase().includes(s) || p.ward.toLowerCase().includes(s)) &&
      (statusFilter === 'all' || p.status === statusFilter)
    );
  }, [search, statusFilter]);

  if (selected) {
    return <PatientDetail patient={selected} onBack={() => setSelected(null)} />;
  }

  const STAT_CARDS = [
    { label: 'Active Patients', value: stats.total, sub: 'Currently admitted', icon: Users, primary: true },
    { label: 'Antenatal', value: stats.admitted, sub: 'Monitoring', icon: Clipboard, status: 'admitted' },
    { label: 'In Labour', value: stats.labour, sub: 'Labour ward', icon: Heart, status: 'labour' },
    { label: 'Postnatal', value: stats.postnatal, sub: 'Post-delivery', icon: Baby, status: 'postnatal' },
    { label: 'Post-Op (CS)', value: stats.operated, sub: 'Recovering', icon: Activity, status: 'operated' },
    { label: 'High Risk', value: stats.highRisk, sub: 'Needs close monitoring', icon: AlertTriangle, status: 'high-risk' },
    { label: 'Discharged Today', value: stats.discharged, sub: 'Sent home', icon: Home, status: 'discharged' },
  ];

  return (
    <div>
      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {STAT_CARDS.map((card, i) => {
          const Icon = card.icon;
          const cfg = card.status ? STATUS_MAP[card.status] : null;
          const dotColor = cfg ? cfg.dot : 'var(--pm-primary)';
          if (card.primary) {
            return (
              <div key={i} className="pm-stat-card" style={{ minWidth: 160, flexShrink: 0, cursor: 'pointer' }} onClick={() => setStatusFilter('all')}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Icon size={20} style={{ opacity: 0.8 }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.85, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 20 }}>All</span>
                </div>
                <div className="pm-card-title" style={{ color: 'rgba(255,255,255,0.75)' }}>{card.label}</div>
                <div className="pm-stat-value" style={{ color: '#fff', fontSize: '2.2rem' }}>{card.value}</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: 2 }}>{card.sub}</div>
              </div>
            );
          }
          return (
            <div key={i} className="pm-stat-card secondary"
              style={{
                minWidth: 148, flexShrink: 0, cursor: 'pointer',
                borderLeft: `3px solid ${dotColor}`,
                opacity: statusFilter !== 'all' && statusFilter !== card.status ? 0.6 : 1,
              }}
              onClick={() => setStatusFilter(prev => prev === card.status ? 'all' : card.status)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Icon size={18} style={{ color: dotColor, opacity: 0.9 }} />
                {statusFilter === card.status && <span style={{ fontSize: '0.65rem', background: dotColor, color: '#fff', borderRadius: 10, padding: '1px 7px', fontWeight: 600 }}>Active filter</span>}
              </div>
              <div className="pm-card-title" style={{ fontSize: '0.78rem' }}>{card.label}</div>
              <div className="pm-stat-value" style={{ fontSize: '2rem', color: dotColor }}>{card.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Search + Filter Bar */}
      <div className="pm-card" style={{ padding: '14px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name, patient ID, or ward…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px 8px 36px',
                border: '1px solid var(--pm-border)', borderRadius: 8,
                background: 'var(--pm-surface-2)', fontSize: '0.85rem',
                outline: 'none', color: 'var(--pm-text)',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {['all', 'admitted', 'labour', 'postnatal', 'operated', 'high-risk', 'discharged'].map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`pm-btn pm-btn-sm ${statusFilter === f ? 'pm-btn-primary' : 'pm-btn-ghost'}`}
                style={{ fontSize: '0.78rem', padding: '5px 12px' }}>
                {f === 'all' ? 'All' : (STATUS_MAP[f]?.label || f)}
              </button>
            ))}
          </div>
          {search && (
            <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => setSearch('')} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Patient Table */}
      <div className="pm-card">
        <div className="pm-section-header" style={{ marginBottom: 12 }}>
          <div>
            <div className="pm-section-title">Patient List</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>
              {filtered.length} patient{filtered.length !== 1 ? 's' : ''} {statusFilter !== 'all' ? `(${STATUS_MAP[statusFilter]?.label})` : ''}
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="pm-table">
            <thead>
              <tr>
                <th>STATUS</th><th>PATIENT</th><th>ID / AGE</th><th>GESTATION</th>
                <th>BLOOD GP</th><th>WARD / BED</th><th>ADMITTED</th><th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--pm-text-muted)' }}>
                    <Search size={28} style={{ opacity: 0.25, marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                    No patients match your search
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(p)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <StatusDot status={p.status} />
                        <StatusBadge status={p.status} />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--pm-text-muted)' }}>G{p.gravida}P{p.para} · {p.nationalId}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{p.id}</div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--pm-text-muted)' }}>Age {p.age}</div>
                    </td>
                    <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.gestationalAge}</td>
                    <td>
                      <span className="pm-badge pm-badge-neutral" style={{ fontSize: '0.75rem' }}>{p.bloodGroup}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>{p.ward}</div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--pm-text-muted)' }}>{p.bed}</div>
                    </td>
                    <td style={{ color: 'var(--pm-text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{p.admissionDate}</td>
                    <td>
                      <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={e => { e.stopPropagation(); setSelected(p); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem' }}>
                        View <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}