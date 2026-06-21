import React, { useState, useMemo } from 'react';
import {
  Search, Filter, X, Users, BedDouble, Baby, AlertTriangle, Heart,
  Activity, Stethoscope, Pill, ClipboardList, MapPin, Phone, User,
  Calendar, ChevronLeft, ChevronRight, ArrowRight, DoorOpen, ShieldAlert,
  CheckCircle, Clock, Droplet, FileText, UserCheck, Building2, Home, Syringe
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const WARD_CFG = {
  antenatal:  { label: 'Antenatal Ward',   short: 'Antenatal',  color: '#0284c7', light: '#e0f2fe' },
  delivery:   { label: 'Delivery Suite',   short: 'Delivery',   color: '#ec4899', light: '#fce7f3' },
  recovery:   { label: 'Theatre Recovery', short: 'Recovery',   color: '#0d9488', light: '#ccfbf1' },
  postnatal:  { label: 'Post-Natal Ward',  short: 'Post-Natal', color: '#16a34a', light: '#dcfce7' },
  kmc:        { label: 'KMC Ward',          short: 'KMC',       color: '#7c3aed', light: '#ede9fe' },
  nicu:       { label: 'NICU',              short: 'NICU',      color: '#dc2626', light: '#fee2e2' },
};

const STATUS_CFG = {
  stable:      { label: 'Stable',         color: '#16a34a', bg: '#dcfce7' },
  observation: { label: 'Observation',    color: '#d97706', bg: '#fef3c7' },
  critical:    { label: 'Critical',       color: '#dc2626', bg: '#fee2e2' },
  recovering:  { label: 'Recovering',     color: '#0d9488', bg: '#ccfbf1' },
  discharged:  { label: 'Discharged',     color: '#64748b', bg: '#f1f5f9' },
};

const BABY_STATUS_CFG = {
  healthy:   { label: 'Healthy',          color: '#16a34a', bg: '#dcfce7' },
  nicu:      { label: 'In NICU',          color: '#dc2626', bg: '#fee2e2' },
  kmc:       { label: 'KMC / Kangaroo',   color: '#7c3aed', bg: '#ede9fe' },
  observation: { label: 'Observation',    color: '#d97706', bg: '#fef3c7' },
};

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT DATA — Parirenyatwa Maternity Unit (localized, Zimbabwe)
// ─────────────────────────────────────────────────────────────────────────────

const PATIENTS = [
  {
    id: 'MAT-1042', name: 'Mrs. Rudo Hove', age: 28, bloodGroup: 'O+',
    nationalId: '63-1429876 K 42', phone: '+263 77 234 5678',
    address: '14 Samora Machel Ave, Mbare, Harare',
    nextOfKin: 'Tapiwa Hove (husband)', nextOfKinPhone: '+263 77 999 1122',
    ward: 'postnatal', room: 'Post-Natal Bay 2', bed: 'PN-B2',
    admissionDate: '2026-06-18', status: 'stable', gravida: 'G2 P2',
    diagnosis: 'Spontaneous vaginal delivery at term (39 wks)',
    primaryDoctor: 'Dr. Nyasha Marufu', allergies: ['Penicillin'],
    vitals: { bp: '118/76', pulse: '78 bpm', temp: '36.8°C', spo2: '99%' },
    hasBaby: true,
    babies: [
      { id: 'NB-2210', name: 'Baby Hove', sex: 'Female', weight: '3.2 kg', apgar: '9/10', gestation: '39 wks', status: 'healthy', ward: 'Rooming-in (with mother)', dob: '2026-06-18', time: '04:12' },
    ],
    healthHistory: [
      { date: '2026-06-18', event: 'Admitted in active labour, 6cm dilated', type: 'admission', by: 'Sr. Memory Murewa' },
      { date: '2026-06-18', event: 'Spontaneous vaginal delivery — live female infant', type: 'delivery', by: 'Dr. Nyasha Marufu' },
      { date: '2026-06-18', event: 'Routine postpartum check — uterus well contracted', type: 'review', by: 'Dr. Nyasha Marufu' },
      { date: '2026-06-19', event: 'Breastfeeding established, mother mobilising', type: 'review', by: 'Sr. Agnes Dube' },
    ],
    roomHistory: [
      { room: 'Admissions / Triage', ward: 'antenatal', from: '2026-06-18 02:40', to: '2026-06-18 03:20', reason: 'Labour assessment' },
      { room: 'Delivery Room 3', ward: 'delivery', from: '2026-06-18 03:20', to: '2026-06-18 06:00', reason: 'Active labour & delivery' },
      { room: 'Post-Natal Bay 2', ward: 'postnatal', from: '2026-06-18 06:00', to: 'present', reason: 'Postpartum recovery' },
    ],
    prescriptions: [
      { drug: 'Paracetamol', dose: '1 g', frequency: 'TDS (3x daily)', duration: '5 days', by: 'Dr. Nyasha Marufu', date: '2026-06-18', status: 'active' },
      { drug: 'Ferrous sulphate', dose: '200 mg', frequency: 'OD (once daily)', duration: '30 days', by: 'Dr. Nyasha Marufu', date: '2026-06-18', status: 'active' },
    ],
    doctors: [
      { name: 'Dr. Nyasha Marufu', role: 'Obstetrician', speciality: 'Obstetrics & Gynaecology', attendedOn: '2026-06-18' },
      { name: 'Sr. Memory Murewa', role: 'Midwife', speciality: 'Delivery Suite', attendedOn: '2026-06-18' },
    ],
  },
  {
    id: 'MAT-1051', name: 'Mrs. Chiedza Ncube', age: 31, bloodGroup: 'A+',
    nationalId: '08-2381044 T 08', phone: '+263 71 556 2210',
    address: '27 Leopold Takawira St, Bulawayo',
    nextOfKin: 'Sipho Ncube (husband)', nextOfKinPhone: '+263 71 880 4411',
    ward: 'recovery', room: 'Theatre Recovery 1', bed: 'TR1-B1',
    admissionDate: '2026-06-20', status: 'recovering', gravida: 'G3 P3',
    diagnosis: 'Elective lower-segment caesarean section (LSCS)',
    primaryDoctor: 'Dr. Tendai Chigudu', allergies: [],
    vitals: { bp: '124/80', pulse: '84 bpm', temp: '37.0°C', spo2: '98%' },
    hasBaby: true,
    babies: [
      { id: 'NB-2218', name: 'Baby Ncube', sex: 'Male', weight: '3.6 kg', apgar: '9/10', gestation: '38 wks', status: 'healthy', ward: 'Nursery (Level 1)', dob: '2026-06-20', time: '09:45' },
    ],
    healthHistory: [
      { date: '2026-06-20', event: 'Admitted for planned elective LSCS', type: 'admission', by: 'Sr. Anesu Maposa' },
      { date: '2026-06-20', event: 'Elective LSCS performed — live male infant', type: 'surgery', by: 'Dr. Tendai Chigudu' },
      { date: '2026-06-20', event: 'Post-op review — wound clean, observations stable', type: 'review', by: 'Dr. Tendai Chigudu' },
    ],
    roomHistory: [
      { room: 'Admissions / Triage', ward: 'antenatal', from: '2026-06-20 06:30', to: '2026-06-20 07:30', reason: 'Pre-op admission' },
      { room: 'Operation Room 2', ward: 'delivery', from: '2026-06-20 09:00', to: '2026-06-20 10:15', reason: 'Elective LSCS' },
      { room: 'Theatre Recovery 1', ward: 'recovery', from: '2026-06-20 10:15', to: 'present', reason: 'Post-operative recovery' },
    ],
    prescriptions: [
      { drug: 'Diclofenac', dose: '75 mg', frequency: 'BD (2x daily)', duration: '3 days', by: 'Dr. Tendai Chigudu', date: '2026-06-20', status: 'active' },
      { drug: 'Cefazolin', dose: '1 g', frequency: 'Stat (intra-op)', duration: 'Single dose', by: 'Dr. Tendai Chigudu', date: '2026-06-20', status: 'completed' },
      { drug: 'Tramadol', dose: '50 mg', frequency: 'PRN (as needed)', duration: '2 days', by: 'Dr. Tendai Chigudu', date: '2026-06-20', status: 'active' },
    ],
    doctors: [
      { name: 'Dr. Tendai Chigudu', role: 'Surgeon', speciality: 'Obstetric Surgery', attendedOn: '2026-06-20' },
      { name: 'Dr. Rumbidzai Gumbo', role: 'Anaesthetist', speciality: 'Anaesthesiology', attendedOn: '2026-06-20' },
      { name: 'Sr. Anesu Maposa', role: 'Theatre Sister', speciality: 'Operating Theatre', attendedOn: '2026-06-20' },
    ],
  },
  {
    id: 'MAT-1063', name: 'Mrs. Tariro Madziva', age: 24, bloodGroup: 'B+',
    nationalId: '47-1190283 F 47', phone: '+263 78 102 7765',
    address: '8 Chinhoyi St, Gweru',
    nextOfKin: 'Memory Madziva (mother)', nextOfKinPhone: '+263 78 445 3398',
    ward: 'antenatal', room: 'Antenatal Bay A', bed: 'AN-A3',
    admissionDate: '2026-06-19', status: 'observation', gravida: 'G1 P0',
    diagnosis: 'Pregnancy-induced hypertension, 36 weeks — under observation',
    primaryDoctor: 'Dr. Simba Madziva', allergies: ['Sulfa drugs'],
    vitals: { bp: '148/96', pulse: '88 bpm', temp: '36.9°C', spo2: '98%' },
    hasBaby: false, babies: [],
    healthHistory: [
      { date: '2026-06-19', event: 'Admitted from ANC clinic — elevated BP 150/98', type: 'admission', by: 'Sr. Agnes Dube' },
      { date: '2026-06-19', event: 'Commenced BP monitoring & antihypertensive therapy', type: 'review', by: 'Dr. Simba Madziva' },
      { date: '2026-06-20', event: 'CTG reassuring, foetal movements normal', type: 'review', by: 'Dr. Simba Madziva' },
    ],
    roomHistory: [
      { room: 'Antenatal Clinic', ward: 'antenatal', from: '2026-06-19 10:00', to: '2026-06-19 11:30', reason: 'Routine ANC visit' },
      { room: 'Antenatal Bay A', ward: 'antenatal', from: '2026-06-19 11:30', to: 'present', reason: 'PIH observation' },
    ],
    prescriptions: [
      { drug: 'Methyldopa', dose: '250 mg', frequency: 'TDS (3x daily)', duration: 'Ongoing', by: 'Dr. Simba Madziva', date: '2026-06-19', status: 'active' },
      { drug: 'Calcium supplement', dose: '500 mg', frequency: 'OD (once daily)', duration: 'Ongoing', by: 'Dr. Simba Madziva', date: '2026-06-19', status: 'active' },
    ],
    doctors: [
      { name: 'Dr. Simba Madziva', role: 'Obstetrician', speciality: 'Maternal-Foetal Medicine', attendedOn: '2026-06-19' },
      { name: 'Sr. Agnes Dube', role: 'Midwife', speciality: 'Antenatal Ward', attendedOn: '2026-06-19' },
    ],
  },
  {
    id: 'MAT-1078', name: 'Mrs. Nokuthula Sibanda', age: 33, bloodGroup: 'O-',
    nationalId: '08-3398210 M 08', phone: '+263 73 220 9981',
    address: '102 Lobengula St West, Bulawayo',
    nextOfKin: 'Mandla Sibanda (husband)', nextOfKinPhone: '+263 73 661 0042',
    ward: 'postnatal', room: 'Post-Natal Bay 1', bed: 'PN-B5',
    admissionDate: '2026-06-17', status: 'stable', gravida: 'G4 P4',
    diagnosis: 'Vaginal delivery of twins at 37 weeks',
    primaryDoctor: 'Dr. Nyasha Marufu', allergies: [],
    vitals: { bp: '120/78', pulse: '80 bpm', temp: '36.7°C', spo2: '99%' },
    hasBaby: true,
    babies: [
      { id: 'NB-2201', name: 'Baby Sibanda (Twin 1)', sex: 'Female', weight: '2.5 kg', apgar: '8/10', gestation: '37 wks', status: 'healthy', ward: 'Rooming-in (with mother)', dob: '2026-06-17', time: '22:05' },
      { id: 'NB-2202', name: 'Baby Sibanda (Twin 2)', sex: 'Female', weight: '2.3 kg', apgar: '8/10', gestation: '37 wks', status: 'kmc', ward: 'KMC Bay A', dob: '2026-06-17', time: '22:14' },
    ],
    healthHistory: [
      { date: '2026-06-17', event: 'Admitted in labour, twin pregnancy confirmed on scan', type: 'admission', by: 'Sr. Memory Murewa' },
      { date: '2026-06-17', event: 'Vaginal delivery of twins — both live female infants', type: 'delivery', by: 'Dr. Nyasha Marufu' },
      { date: '2026-06-18', event: 'Twin 2 transferred to KMC for low birth weight support', type: 'transfer', by: 'Dr. Tatenda Moyo' },
      { date: '2026-06-19', event: 'Mother stable, both twins feeding well', type: 'review', by: 'Sr. Primrose Mapuranga' },
    ],
    roomHistory: [
      { room: 'Delivery Room 1', ward: 'delivery', from: '2026-06-17 20:00', to: '2026-06-17 23:00', reason: 'Twin delivery' },
      { room: 'Post-Natal Bay 1', ward: 'postnatal', from: '2026-06-17 23:00', to: 'present', reason: 'Postpartum recovery' },
    ],
    prescriptions: [
      { drug: 'Ferrous sulphate', dose: '200 mg', frequency: 'BD (2x daily)', duration: '30 days', by: 'Dr. Nyasha Marufu', date: '2026-06-17', status: 'active' },
      { drug: 'Folic acid', dose: '5 mg', frequency: 'OD (once daily)', duration: '30 days', by: 'Dr. Nyasha Marufu', date: '2026-06-17', status: 'active' },
    ],
    doctors: [
      { name: 'Dr. Nyasha Marufu', role: 'Obstetrician', speciality: 'Obstetrics & Gynaecology', attendedOn: '2026-06-17' },
      { name: 'Dr. Tatenda Moyo', role: 'Paediatrician', speciality: 'Neonatology', attendedOn: '2026-06-18' },
    ],
  },
  {
    id: 'MAT-1090', name: 'Mrs. Priscilla Nyoni', age: 29, bloodGroup: 'AB+',
    nationalId: '50-2810934 P 50', phone: '+263 77 884 1203',
    address: '45 Robert Mugabe Rd, Mutare',
    nextOfKin: 'Farai Nyoni (husband)', nextOfKinPhone: '+263 77 220 7754',
    ward: 'delivery', room: 'Delivery Room 4', bed: 'DR4-B1',
    admissionDate: '2026-06-21', status: 'critical', gravida: 'G2 P1',
    diagnosis: 'Foetal distress in labour — emergency team active',
    primaryDoctor: 'Dr. Tendai Chigudu', allergies: ['Latex'],
    vitals: { bp: '132/88', pulse: '102 bpm', temp: '37.4°C', spo2: '96%' },
    hasBaby: false, babies: [],
    healthHistory: [
      { date: '2026-06-21', event: 'Admitted in active labour at 39 weeks', type: 'admission', by: 'Sr. Memory Murewa' },
      { date: '2026-06-21', event: 'CTG abnormal — foetal distress identified', type: 'alert', by: 'Sr. Memory Murewa' },
      { date: '2026-06-21', event: 'Emergency obstetric team activated, prepping for LSCS', type: 'alert', by: 'Dr. Tendai Chigudu' },
    ],
    roomHistory: [
      { room: 'Admissions / Triage', ward: 'antenatal', from: '2026-06-21 08:50', to: '2026-06-21 09:30', reason: 'Labour assessment' },
      { room: 'Delivery Room 4', ward: 'delivery', from: '2026-06-21 09:30', to: 'present', reason: 'Active labour — monitoring' },
    ],
    prescriptions: [
      { drug: 'Ringer\'s Lactate', dose: '1 L', frequency: 'IV infusion', duration: 'Continuous', by: 'Dr. Tendai Chigudu', date: '2026-06-21', status: 'active' },
      { drug: 'Oxygen therapy', dose: '4 L/min', frequency: 'Via face mask', duration: 'Continuous', by: 'Dr. Tendai Chigudu', date: '2026-06-21', status: 'active' },
    ],
    doctors: [
      { name: 'Dr. Tendai Chigudu', role: 'Obstetrician', speciality: 'Emergency Obstetrics', attendedOn: '2026-06-21' },
      { name: 'Sr. Memory Murewa', role: 'Midwife', speciality: 'Delivery Suite', attendedOn: '2026-06-21' },
    ],
  },
  {
    id: 'MAT-1101', name: 'Mrs. Loveness Biti', age: 26, bloodGroup: 'A-',
    nationalId: '63-2049871 W 63', phone: '+263 78 331 5520',
    address: '19 Fife Ave, Harare',
    nextOfKin: 'Brian Biti (husband)', nextOfKinPhone: '+263 78 990 2231',
    ward: 'kmc', room: 'KMC Bay A', bed: 'KMC-A3',
    admissionDate: '2026-06-15', status: 'stable', gravida: 'G1 P1',
    diagnosis: 'Preterm delivery at 36 weeks — kangaroo mother care',
    primaryDoctor: 'Dr. Tatenda Moyo', allergies: [],
    vitals: { bp: '116/74', pulse: '76 bpm', temp: '36.6°C', spo2: '99%' },
    hasBaby: true,
    babies: [
      { id: 'NB-2188', name: 'Baby Biti', sex: 'Male', weight: '2.0 kg', apgar: '7/10', gestation: '36 wks', status: 'kmc', ward: 'KMC Bay A', dob: '2026-06-15', time: '14:30' },
    ],
    healthHistory: [
      { date: '2026-06-15', event: 'Admitted in preterm labour at 36 weeks', type: 'admission', by: 'Sr. Anesu Maposa' },
      { date: '2026-06-15', event: 'Vaginal delivery — live male infant, 2.0 kg', type: 'delivery', by: 'Dr. Nyasha Marufu' },
      { date: '2026-06-15', event: 'Baby commenced kangaroo mother care for low birth weight', type: 'transfer', by: 'Dr. Tatenda Moyo' },
      { date: '2026-06-18', event: 'Baby gaining weight steadily, skin-to-skin ongoing', type: 'review', by: 'Sr. Primrose Mapuranga' },
    ],
    roomHistory: [
      { room: 'KMC Delivery Room 2', ward: 'delivery', from: '2026-06-15 12:00', to: '2026-06-15 16:00', reason: 'Preterm delivery' },
      { room: 'KMC Bay A', ward: 'kmc', from: '2026-06-15 16:00', to: 'present', reason: 'Kangaroo mother care' },
    ],
    prescriptions: [
      { drug: 'Multivitamin syrup', dose: '5 ml', frequency: 'OD (once daily)', duration: 'Ongoing', by: 'Dr. Tatenda Moyo', date: '2026-06-15', status: 'active' },
    ],
    doctors: [
      { name: 'Dr. Tatenda Moyo', role: 'Paediatrician', speciality: 'Neonatology', attendedOn: '2026-06-15' },
      { name: 'Sr. Primrose Mapuranga', role: 'KMC Specialist Nurse', speciality: 'Kangaroo Mother Care', attendedOn: '2026-06-15' },
    ],
  },
  {
    id: 'MAT-1115', name: 'Mrs. Vimbai Gumbo', age: 35, bloodGroup: 'O+',
    nationalId: '29-1872034 H 29', phone: '+263 71 442 8890',
    address: '7 Josiah Tongogara Ave, Kwekwe',
    nextOfKin: 'Tonderai Gumbo (husband)', nextOfKinPhone: '+263 71 778 1140',
    ward: 'nicu', room: 'NICU Cot 6', bed: 'NICU-6',
    admissionDate: '2026-06-14', status: 'observation', gravida: 'G3 P2',
    diagnosis: 'Mother of NICU baby — daily attendance for feeding & care',
    primaryDoctor: 'Dr. Tatenda Moyo', allergies: [],
    vitals: { bp: '122/79', pulse: '82 bpm', temp: '36.8°C', spo2: '98%' },
    hasBaby: true,
    babies: [
      { id: 'NB-2175', name: 'Baby Gumbo', sex: 'Female', weight: '1.4 kg', apgar: '5/10', gestation: '32 wks', status: 'nicu', ward: 'NICU Cot 6', dob: '2026-06-14', time: '03:50' },
    ],
    healthHistory: [
      { date: '2026-06-14', event: 'Emergency LSCS at 32 weeks for severe pre-eclampsia', type: 'surgery', by: 'Dr. Tendai Chigudu' },
      { date: '2026-06-14', event: 'Premature female infant admitted to NICU on CPAP', type: 'transfer', by: 'Dr. Tatenda Moyo' },
      { date: '2026-06-17', event: 'Mother recovered from surgery, attending NICU daily', type: 'review', by: 'Dr. Simba Madziva' },
      { date: '2026-06-20', event: 'Baby weaned off CPAP, on nasal oxygen', type: 'review', by: 'Dr. Tatenda Moyo' },
    ],
    roomHistory: [
      { room: 'Operation Room 1', ward: 'delivery', from: '2026-06-14 03:00', to: '2026-06-14 04:30', reason: 'Emergency LSCS' },
      { room: 'Theatre Recovery 2', ward: 'recovery', from: '2026-06-14 04:30', to: '2026-06-16 09:00', reason: 'Post-op recovery' },
      { room: 'NICU Cot 6 (attending)', ward: 'nicu', from: '2026-06-16 09:00', to: 'present', reason: 'Daily NICU attendance' },
    ],
    prescriptions: [
      { drug: 'Methyldopa', dose: '250 mg', frequency: 'TDS (3x daily)', duration: 'Ongoing', by: 'Dr. Simba Madziva', date: '2026-06-14', status: 'active' },
      { drug: 'Paracetamol', dose: '1 g', frequency: 'PRN (as needed)', duration: '5 days', by: 'Dr. Simba Madziva', date: '2026-06-14', status: 'completed' },
    ],
    doctors: [
      { name: 'Dr. Tendai Chigudu', role: 'Surgeon', speciality: 'Obstetric Surgery', attendedOn: '2026-06-14' },
      { name: 'Dr. Tatenda Moyo', role: 'Neonatologist', speciality: 'Neonatal Intensive Care', attendedOn: '2026-06-14' },
      { name: 'Dr. Simba Madziva', role: 'Obstetrician', speciality: 'Maternal-Foetal Medicine', attendedOn: '2026-06-17' },
    ],
  },
  {
    id: 'MAT-1127', name: 'Mrs. Shamiso Mpofu', age: 22, bloodGroup: 'B-',
    nationalId: '08-4120983 N 08', phone: '+263 77 503 6612',
    address: '33 Plumtree Rd, Bulawayo',
    nextOfKin: 'Sibongile Mpofu (sister)', nextOfKinPhone: '+263 77 119 8830',
    ward: 'antenatal', room: 'Antenatal Bay B', bed: 'AN-B1',
    admissionDate: '2026-06-20', status: 'stable', gravida: 'G1 P0',
    diagnosis: 'Antepartum admission for foetal monitoring at 38 weeks',
    primaryDoctor: 'Dr. Simba Madziva', allergies: [],
    vitals: { bp: '114/72', pulse: '74 bpm', temp: '36.5°C', spo2: '99%' },
    hasBaby: false, babies: [],
    healthHistory: [
      { date: '2026-06-20', event: 'Admitted for reduced foetal movements at 38 weeks', type: 'admission', by: 'Sr. Agnes Dube' },
      { date: '2026-06-20', event: 'CTG reassuring, foetal movements returned', type: 'review', by: 'Dr. Simba Madziva' },
    ],
    roomHistory: [
      { room: 'Antenatal Clinic', ward: 'antenatal', from: '2026-06-20 13:00', to: '2026-06-20 14:00', reason: 'Reduced movements review' },
      { room: 'Antenatal Bay B', ward: 'antenatal', from: '2026-06-20 14:00', to: 'present', reason: 'Foetal monitoring' },
    ],
    prescriptions: [
      { drug: 'Folic acid', dose: '5 mg', frequency: 'OD (once daily)', duration: 'Ongoing', by: 'Dr. Simba Madziva', date: '2026-06-20', status: 'active' },
    ],
    doctors: [
      { name: 'Dr. Simba Madziva', role: 'Obstetrician', speciality: 'Maternal-Foetal Medicine', attendedOn: '2026-06-20' },
      { name: 'Sr. Agnes Dube', role: 'Midwife', speciality: 'Antenatal Ward', attendedOn: '2026-06-20' },
    ],
  },
  {
    id: 'MAT-1133', name: 'Mrs. Tendai Mwari', age: 30, bloodGroup: 'A+',
    nationalId: '63-3092187 R 63', phone: '+263 78 661 0093',
    address: '21 Enterprise Rd, Highlands, Harare',
    nextOfKin: 'Kudzai Mwari (husband)', nextOfKinPhone: '+263 78 220 9981',
    ward: 'postnatal', room: 'Post-Natal Bay 3', bed: 'PN-B9',
    admissionDate: '2026-06-19', status: 'stable', gravida: 'G2 P2',
    diagnosis: 'Vaginal delivery at term, uncomplicated',
    primaryDoctor: 'Dr. Nyasha Marufu', allergies: ['Aspirin'],
    vitals: { bp: '119/77', pulse: '79 bpm', temp: '36.7°C', spo2: '99%' },
    hasBaby: true,
    babies: [
      { id: 'NB-2215', name: 'Baby Mwari', sex: 'Male', weight: '3.4 kg', apgar: '9/10', gestation: '40 wks', status: 'healthy', ward: 'Rooming-in (with mother)', dob: '2026-06-19', time: '11:20' },
    ],
    healthHistory: [
      { date: '2026-06-19', event: 'Admitted in established labour at 40 weeks', type: 'admission', by: 'Sr. Memory Murewa' },
      { date: '2026-06-19', event: 'Normal vaginal delivery — live male infant', type: 'delivery', by: 'Dr. Nyasha Marufu' },
      { date: '2026-06-20', event: 'Postpartum review — mother and baby well', type: 'review', by: 'Sr. Agnes Dube' },
    ],
    roomHistory: [
      { room: 'Delivery Room 2', ward: 'delivery', from: '2026-06-19 09:00', to: '2026-06-19 12:30', reason: 'Labour & delivery' },
      { room: 'Post-Natal Bay 3', ward: 'postnatal', from: '2026-06-19 12:30', to: 'present', reason: 'Postpartum recovery' },
    ],
    prescriptions: [
      { drug: 'Paracetamol', dose: '1 g', frequency: 'TDS (3x daily)', duration: '3 days', by: 'Dr. Nyasha Marufu', date: '2026-06-19', status: 'active' },
      { drug: 'Ferrous sulphate', dose: '200 mg', frequency: 'OD (once daily)', duration: '30 days', by: 'Dr. Nyasha Marufu', date: '2026-06-19', status: 'active' },
    ],
    doctors: [
      { name: 'Dr. Nyasha Marufu', role: 'Obstetrician', speciality: 'Obstetrics & Gynaecology', attendedOn: '2026-06-19' },
      { name: 'Sr. Memory Murewa', role: 'Midwife', speciality: 'Delivery Suite', attendedOn: '2026-06-19' },
    ],
  },
  {
    id: 'MAT-1146', name: 'Mrs. Yeukai Chitepo', age: 27, bloodGroup: 'O+',
    nationalId: '47-2738190 D 47', phone: '+263 71 905 4432',
    address: '12 Simon Mazorodze Rd, Chitungwiza',
    nextOfKin: 'Munashe Chitepo (husband)', nextOfKinPhone: '+263 71 330 7765',
    ward: 'recovery', room: 'Theatre Recovery 2', bed: 'TR2-B2',
    admissionDate: '2026-06-20', status: 'recovering', gravida: 'G2 P2',
    diagnosis: 'Emergency LSCS for failure to progress',
    primaryDoctor: 'Dr. Tendai Chigudu', allergies: [],
    vitals: { bp: '126/82', pulse: '86 bpm', temp: '37.1°C', spo2: '98%' },
    hasBaby: true,
    babies: [
      { id: 'NB-2220', name: 'Baby Chitepo', sex: 'Female', weight: '3.8 kg', apgar: '8/10', gestation: '41 wks', status: 'observation', ward: 'Nursery (Level 1)', dob: '2026-06-20', time: '16:55' },
    ],
    healthHistory: [
      { date: '2026-06-20', event: 'Admitted in prolonged labour at 41 weeks', type: 'admission', by: 'Sr. Memory Murewa' },
      { date: '2026-06-20', event: 'Emergency LSCS for failure to progress', type: 'surgery', by: 'Dr. Tendai Chigudu' },
      { date: '2026-06-20', event: 'Baby admitted to nursery for routine observation', type: 'transfer', by: 'Dr. Tatenda Moyo' },
    ],
    roomHistory: [
      { room: 'Delivery Room 5', ward: 'delivery', from: '2026-06-20 12:00', to: '2026-06-20 16:00', reason: 'Prolonged labour' },
      { room: 'Operation Room 1', ward: 'delivery', from: '2026-06-20 16:15', to: '2026-06-20 17:30', reason: 'Emergency LSCS' },
      { room: 'Theatre Recovery 2', ward: 'recovery', from: '2026-06-20 17:30', to: 'present', reason: 'Post-operative recovery' },
    ],
    prescriptions: [
      { drug: 'Diclofenac', dose: '75 mg', frequency: 'BD (2x daily)', duration: '3 days', by: 'Dr. Tendai Chigudu', date: '2026-06-20', status: 'active' },
      { drug: 'Cefazolin', dose: '1 g', frequency: 'Stat (intra-op)', duration: 'Single dose', by: 'Dr. Tendai Chigudu', date: '2026-06-20', status: 'completed' },
    ],
    doctors: [
      { name: 'Dr. Tendai Chigudu', role: 'Surgeon', speciality: 'Emergency Obstetrics', attendedOn: '2026-06-20' },
      { name: 'Dr. Rumbidzai Gumbo', role: 'Anaesthetist', speciality: 'Anaesthesiology', attendedOn: '2026-06-20' },
    ],
  },
  {
    id: 'MAT-1158', name: 'Mrs. Fadzai Zhou', age: 38, bloodGroup: 'AB-',
    nationalId: '50-1029384 B 50', phone: '+263 77 220 5567',
    address: '88 Herbert Chitepo St, Masvingo',
    nextOfKin: 'Tinashe Zhou (husband)', nextOfKinPhone: '+263 77 661 9982',
    ward: 'antenatal', room: 'Antenatal Bay A', bed: 'AN-A1',
    admissionDate: '2026-06-21', status: 'observation', gravida: 'G5 P3',
    diagnosis: 'Gestational diabetes, 34 weeks — glucose stabilisation',
    primaryDoctor: 'Dr. Simba Madziva', allergies: [],
    vitals: { bp: '128/84', pulse: '81 bpm', temp: '36.9°C', spo2: '98%' },
    hasBaby: false, babies: [],
    healthHistory: [
      { date: '2026-06-21', event: 'Admitted from ANC — poorly controlled gestational diabetes', type: 'admission', by: 'Sr. Agnes Dube' },
      { date: '2026-06-21', event: 'Commenced insulin sliding scale & glucose monitoring', type: 'review', by: 'Dr. Simba Madziva' },
    ],
    roomHistory: [
      { room: 'Antenatal Clinic', ward: 'antenatal', from: '2026-06-21 09:00', to: '2026-06-21 10:30', reason: 'Routine ANC visit' },
      { room: 'Antenatal Bay A', ward: 'antenatal', from: '2026-06-21 10:30', to: 'present', reason: 'Glucose stabilisation' },
    ],
    prescriptions: [
      { drug: 'Insulin (Actrapid)', dose: 'Sliding scale', frequency: 'TDS before meals', duration: 'Ongoing', by: 'Dr. Simba Madziva', date: '2026-06-21', status: 'active' },
      { drug: 'Folic acid', dose: '5 mg', frequency: 'OD (once daily)', duration: 'Ongoing', by: 'Dr. Simba Madziva', date: '2026-06-21', status: 'active' },
    ],
    doctors: [
      { name: 'Dr. Simba Madziva', role: 'Obstetrician', speciality: 'Maternal-Foetal Medicine', attendedOn: '2026-06-21' },
      { name: 'Sr. Agnes Dube', role: 'Midwife', speciality: 'Antenatal Ward', attendedOn: '2026-06-21' },
    ],
  },
  {
    id: 'MAT-1169', name: 'Mrs. Rutendo Banda', age: 25, bloodGroup: 'O+',
    nationalId: '63-2910384 K 63', phone: '+263 78 445 1120',
    address: '5 Glenara Ave, Harare',
    nextOfKin: 'Blessing Banda (husband)', nextOfKinPhone: '+263 78 990 3321',
    ward: 'kmc', room: 'KMC Bay C', bed: 'KMC-C1',
    admissionDate: '2026-06-20', status: 'stable', gravida: 'G1 P1',
    diagnosis: 'Preterm delivery at 37 weeks — KMC for low birth weight',
    primaryDoctor: 'Dr. Tatenda Moyo', allergies: [],
    vitals: { bp: '117/75', pulse: '77 bpm', temp: '36.6°C', spo2: '99%' },
    hasBaby: true,
    babies: [
      { id: 'NB-2219', name: 'Baby Banda', sex: 'Female', weight: '2.3 kg', apgar: '8/10', gestation: '37 wks', status: 'kmc', ward: 'KMC Bay C', dob: '2026-06-20', time: '08:10' },
    ],
    healthHistory: [
      { date: '2026-06-20', event: 'Admitted in labour at 37 weeks', type: 'admission', by: 'Sr. Memory Murewa' },
      { date: '2026-06-20', event: 'Vaginal delivery — live female infant, 2.3 kg', type: 'delivery', by: 'Dr. Nyasha Marufu' },
      { date: '2026-06-20', event: 'Baby commenced KMC for low birth weight', type: 'transfer', by: 'Dr. Tatenda Moyo' },
    ],
    roomHistory: [
      { room: 'Delivery Room 1', ward: 'delivery', from: '2026-06-20 06:00', to: '2026-06-20 09:00', reason: 'Labour & delivery' },
      { room: 'KMC Bay C', ward: 'kmc', from: '2026-06-20 09:00', to: 'present', reason: 'Kangaroo mother care' },
    ],
    prescriptions: [
      { drug: 'Multivitamin syrup', dose: '5 ml', frequency: 'OD (once daily)', duration: 'Ongoing', by: 'Dr. Tatenda Moyo', date: '2026-06-20', status: 'active' },
      { drug: 'Ferrous sulphate', dose: '200 mg', frequency: 'OD (once daily)', duration: '30 days', by: 'Dr. Nyasha Marufu', date: '2026-06-20', status: 'active' },
    ],
    doctors: [
      { name: 'Dr. Tatenda Moyo', role: 'Paediatrician', speciality: 'Neonatology', attendedOn: '2026-06-20' },
      { name: 'Sr. Primrose Mapuranga', role: 'KMC Specialist Nurse', speciality: 'Kangaroo Mother Care', attendedOn: '2026-06-20' },
    ],
  },
];

// Zimbabwean doctor roster used for the "attended by" filter
const DOCTORS = [...new Set(PATIENTS.flatMap(p => p.doctors.map(d => d.name)))];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function initials(name) {
  return name.replace(/^(Sr\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s+/, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysSince(iso) {
  const d = new Date(iso);
  const today = new Date('2026-06-21');
  return Math.max(0, Math.round((today - d) / 86400000));
}

const HISTORY_ICON = {
  admission: { icon: DoorOpen, color: '#0284c7' },
  delivery:  { icon: Baby, color: '#ec4899' },
  surgery:   { icon: Activity, color: '#7c3aed' },
  transfer:  { icon: ArrowRight, color: '#0d9488' },
  review:    { icon: Stethoscope, color: '#16a34a' },
  alert:     { icon: AlertTriangle, color: '#dc2626' },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOM OCCUPANCY MODAL
// ─────────────────────────────────────────────────────────────────────────────

function RoomOccupancyModal({ patients, onClose, onSelectPatient }) {
  // Group patients by room
  const rooms = useMemo(() => {
    const map = {};
    patients.forEach(p => {
      if (!map[p.room]) map[p.room] = { room: p.room, ward: p.ward, occupants: [] };
      map[p.room].occupants.push(p);
    });
    return Object.values(map).sort((a, b) => a.ward.localeCompare(b.ward));
  }, [patients]);

  // Group rooms by ward for section headers
  const byWard = useMemo(() => {
    const map = {};
    rooms.forEach(r => { (map[r.ward] = map[r.ward] || []).push(r); });
    return map;
  }, [rooms]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 16, overflowY: 'auto' }}
      onClick={onClose}>
      <div style={{ background: 'var(--pm-surface)', borderRadius: 14, width: '100%', maxWidth: 760, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.3)', marginTop: 20, marginBottom: 20 }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background: 'var(--pm-primary)', padding: '18px 22px', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DoorOpen size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Room Occupancy</div>
                <div style={{ opacity: 0.82, fontSize: '0.78rem' }}>Who is staying in which room — {patients.length} patients across {rooms.length} rooms</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 20, maxHeight: '64vh', overflowY: 'auto' }}>
          {Object.entries(byWard).map(([wardKey, wardRooms]) => {
            const w = WARD_CFG[wardKey] || { label: wardKey, color: '#64748b', light: '#f1f5f9' };
            return (
              <div key={wardKey} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '6px 12px', background: w.light, borderRadius: 8, borderLeft: `4px solid ${w.color}` }}>
                  <Building2 size={15} style={{ color: w.color }} />
                  <span style={{ fontWeight: 800, fontSize: '0.84rem', color: w.color }}>{w.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--pm-text-muted)', fontWeight: 600 }}>
                    {wardRooms.reduce((a, r) => a + r.occupants.length, 0)} patients
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                  {wardRooms.map(r => (
                    <div key={r.room} style={{ border: '1px solid var(--pm-border)', borderRadius: 8, overflow: 'hidden' }}>
                      <div style={{ padding: '7px 11px', background: 'var(--pm-surface-2)', borderBottom: '1px solid var(--pm-border)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <BedDouble size={13} style={{ color: w.color }} />
                        <span style={{ fontWeight: 700, fontSize: '0.78rem' }}>{r.room}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '0.64rem', fontWeight: 700, color: w.color, background: w.light, borderRadius: 10, padding: '1px 7px' }}>{r.occupants.length}</span>
                      </div>
                      <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {r.occupants.map(p => {
                          const sc = STATUS_CFG[p.status];
                          return (
                            <button key={p.id} onClick={() => onSelectPatient(p)}
                              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'none', border: '1px solid transparent', borderRadius: 6, cursor: 'pointer', textAlign: 'left', width: '100%' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'var(--pm-surface-2)'; e.currentTarget.style.borderColor = 'var(--pm-border)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'transparent'; }}>
                              <div style={{ width: 26, height: 26, borderRadius: '50%', background: w.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.58rem', fontWeight: 800, flexShrink: 0 }}>
                                {initials(p.name)}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.77rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--pm-text-muted)' }}>{p.id} · Bed {p.bed}</div>
                              </div>
                              {p.hasBaby && <Baby size={13} style={{ color: '#ec4899', flexShrink: 0 }} />}
                              <span style={{ width: 8, height: 8, borderRadius: '50%', background: sc.color, flexShrink: 0 }} title={sc.label} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT DETAIL PAGE
// ─────────────────────────────────────────────────────────────────────────────

function PatientDetailPage({ patient, onBack }) {
  const w = WARD_CFG[patient.ward] || { label: patient.ward, color: '#64748b', light: '#f1f5f9' };
  const sc = STATUS_CFG[patient.status];

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '7px 0', borderBottom: '1px solid var(--pm-border)' }}>
      <Icon size={15} style={{ color: 'var(--pm-text-muted)', marginTop: 2, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.66rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );

  const SectionTitle = ({ icon: Icon, children, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{children}</div>
    </div>
  );

  return (
    <div>
      {/* Back button */}
      <button onClick={onBack} className="pm-btn pm-btn-ghost pm-btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 14 }}>
        <ChevronLeft size={15} /> Back to Patient Records
      </button>

      {/* Header card */}
      <div className="pm-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ background: w.color, padding: '20px 24px', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.4rem', flexShrink: 0 }}>
              {initials(patient.name)}
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 800, fontSize: '1.35rem' }}>{patient.name}</div>
                <span style={{ background: sc.bg, color: sc.color, fontSize: '0.68rem', fontWeight: 800, borderRadius: 20, padding: '2px 10px' }}>{sc.label}</span>
                {patient.hasBaby && (
                  <span style={{ background: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', fontWeight: 700, borderRadius: 20, padding: '2px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Baby size={11} /> {patient.babies.length} newborn{patient.babies.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div style={{ opacity: 0.85, fontSize: '0.82rem', marginTop: 4 }}>
                {patient.id} · {patient.age} yrs · {patient.gravida} · Blood group {patient.bloodGroup}
              </div>
              <div style={{ opacity: 0.85, fontSize: '0.82rem', marginTop: 2 }}>
                {w.label} · {patient.room} (Bed {patient.bed}) · Admitted {formatDate(patient.admissionDate)} ({daysSince(patient.admissionDate)}d ago)
              </div>
            </div>
          </div>
          {/* Vitals strip */}
          <div style={{ display: 'flex', gap: 20, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.2)', flexWrap: 'wrap' }}>
            {[
              { label: 'Blood Pressure', value: patient.vitals.bp },
              { label: 'Pulse', value: patient.vitals.pulse },
              { label: 'Temperature', value: patient.vitals.temp },
              { label: 'SpO₂', value: patient.vitals.spo2 },
            ].map((v, i) => (
              <div key={i}>
                <div style={{ fontSize: '0.62rem', opacity: 0.75, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{v.label}</div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{v.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnosis banner */}
        <div style={{ padding: '12px 24px', background: 'var(--pm-surface-2)', borderBottom: '1px solid var(--pm-border)' }}>
          <div style={{ fontSize: '0.66rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: 2 }}>Current Diagnosis</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{patient.diagnosis}</div>
        </div>
      </div>

      <div className="row g-3">
        {/* LEFT: Demographics + allergies */}
        <div className="col-12 col-lg-4">
          <div className="pm-card h-100">
            <SectionTitle icon={User} color="#0284c7">Patient Information</SectionTitle>
            <InfoRow icon={FileText} label="National ID" value={patient.nationalId} />
            <InfoRow icon={Phone} label="Phone" value={patient.phone} />
            <InfoRow icon={Home} label="Home Address" value={patient.address} />
            <InfoRow icon={UserCheck} label="Next of Kin" value={`${patient.nextOfKin} · ${patient.nextOfKinPhone}`} />
            <InfoRow icon={Stethoscope} label="Primary Doctor" value={patient.primaryDoctor} />
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: '0.66rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, marginBottom: 6 }}>Allergies</div>
              {patient.allergies.length === 0 ? (
                <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={13} /> No known allergies
                </span>
              ) : (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {patient.allergies.map((a, i) => (
                    <span key={i} style={{ background: '#fee2e2', color: '#dc2626', fontSize: '0.72rem', fontWeight: 700, borderRadius: 6, padding: '3px 9px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <ShieldAlert size={11} /> {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Babies */}
        <div className="col-12 col-lg-8">
          <div className="pm-card h-100">
            <SectionTitle icon={Baby} color="#ec4899">
              {patient.hasBaby ? `Newborn${patient.babies.length > 1 ? 's' : ''} (${patient.babies.length})` : 'Newborn'}
            </SectionTitle>
            {!patient.hasBaby ? (
              <div style={{ textAlign: 'center', padding: '28px 16px', color: 'var(--pm-text-muted)' }}>
                <Baby size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>No delivery recorded yet</div>
                <div style={{ fontSize: '0.74rem' }}>This patient has not given birth during this admission.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: patient.babies.length > 1 ? 'repeat(auto-fit, minmax(240px, 1fr))' : '1fr', gap: 12 }}>
                {patient.babies.map(b => {
                  const bs = BABY_STATUS_CFG[b.status] || BABY_STATUS_CFG.healthy;
                  return (
                    <div key={b.id} style={{ border: '1.5px solid #fbcfe8', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ background: '#fce7f3', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ec4899', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Baby size={16} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#9d174d' }}>{b.name}</div>
                            <div style={{ fontSize: '0.66rem', color: '#be185d' }}>{b.id} · {b.sex}</div>
                          </div>
                        </div>
                        <span style={{ background: bs.bg, color: bs.color, fontSize: '0.64rem', fontWeight: 800, borderRadius: 20, padding: '2px 9px' }}>{bs.label}</span>
                      </div>
                      <div style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px' }}>
                        {[
                          { label: 'Birth Weight', value: b.weight },
                          { label: 'APGAR Score', value: b.apgar },
                          { label: 'Gestation', value: b.gestation },
                          { label: 'Born', value: `${formatDate(b.dob)} ${b.time}` },
                          { label: 'Current Location', value: b.ward, full: true },
                        ].map((f, i) => (
                          <div key={i} style={f.full ? { gridColumn: '1 / -1' } : {}}>
                            <div style={{ fontSize: '0.62rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>{f.label}</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{f.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Health history timeline */}
        <div className="col-12 col-lg-6">
          <div className="pm-card h-100">
            <SectionTitle icon={Activity} color="#7c3aed">Health History</SectionTitle>
            <div style={{ position: 'relative' }}>
              {patient.healthHistory.map((h, i) => {
                const cfg = HISTORY_ICON[h.type] || HISTORY_ICON.review;
                const Icon = cfg.icon;
                const last = i === patient.healthHistory.length - 1;
                return (
                  <div key={i} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${cfg.color}15`, border: `2px solid ${cfg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                        <Icon size={14} style={{ color: cfg.color }} />
                      </div>
                      {!last && <div style={{ width: 2, flex: 1, background: 'var(--pm-border)', minHeight: 16 }} />}
                    </div>
                    <div style={{ paddingBottom: last ? 0 : 16, flex: 1 }}>
                      <div style={{ fontSize: '0.66rem', color: 'var(--pm-text-muted)', fontWeight: 700 }}>{formatDate(h.date)}</div>
                      <div style={{ fontSize: '0.83rem', fontWeight: 600, lineHeight: 1.4 }}>{h.event}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)', marginTop: 1 }}>by {h.by}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rooms stayed */}
        <div className="col-12 col-lg-6">
          <div className="pm-card h-100">
            <SectionTitle icon={MapPin} color="#0d9488">Rooms & Movements</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {patient.roomHistory.map((r, i) => {
                const rw = WARD_CFG[r.ward] || { color: '#64748b', short: r.ward };
                const current = r.to === 'present';
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: current ? rw.light || 'var(--pm-surface-2)' : 'var(--pm-surface-2)', border: `1px solid ${current ? rw.color : 'var(--pm-border)'}`, borderRadius: 8, borderLeft: `4px solid ${rw.color}` }}>
                    <BedDouble size={15} style={{ color: rw.color, marginTop: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.83rem', fontWeight: 700 }}>{r.room}</span>
                        {current && <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#16a34a', background: '#dcfce7', borderRadius: 10, padding: '1px 7px' }}>CURRENT</span>}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>{r.reason}</div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>
                        {r.from} {r.to !== 'present' && `→ ${r.to}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Prescriptions */}
        <div className="col-12 col-lg-7">
          <div className="pm-card h-100">
            <SectionTitle icon={Pill} color="#d97706">Prescriptions</SectionTitle>
            <div style={{ overflowX: 'auto' }}>
              <table className="pm-table" style={{ width: '100%' }}>
                <thead>
                  <tr><th>MEDICATION</th><th>DOSE</th><th>FREQUENCY</th><th>DURATION</th><th>STATUS</th></tr>
                </thead>
                <tbody>
                  {patient.prescriptions.map((rx, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <Syringe size={13} style={{ color: '#d97706', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{rx.drug}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--pm-text-muted)' }}>{rx.by} · {formatDate(rx.date)}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>{rx.dose}</td>
                      <td style={{ fontSize: '0.78rem' }}>{rx.frequency}</td>
                      <td style={{ fontSize: '0.78rem' }}>{rx.duration}</td>
                      <td>
                        <span style={{ fontSize: '0.64rem', fontWeight: 700, borderRadius: 10, padding: '2px 8px',
                          color: rx.status === 'active' ? '#16a34a' : '#64748b',
                          background: rx.status === 'active' ? '#dcfce7' : '#f1f5f9' }}>
                          {rx.status === 'active' ? 'Active' : 'Completed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Attending doctors */}
        <div className="col-12 col-lg-5">
          <div className="pm-card h-100">
            <SectionTitle icon={Stethoscope} color="#16a34a">Attending Clinicians</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {patient.doctors.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', borderRadius: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>
                    {initials(d.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{d.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>{d.role} · {d.speciality}</div>
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--pm-text-muted)', textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700 }}>Attended</div>
                    <div>{formatDate(d.attendedOn)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function PatientRecordsPage() {
  const [selected, setSelected] = useState(null);
  const [showRooms, setShowRooms] = useState(false);
  const [query, setQuery] = useState('');
  const [wardFilter, setWardFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // all | mothers | newborns
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filtered patient list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PATIENTS.filter(p => {
      if (wardFilter !== 'all' && p.ward !== wardFilter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (typeFilter === 'mothers' && p.hasBaby !== true) return false;
      if (typeFilter === 'newborns' && p.babies.length === 0) return false;
      if (doctorFilter !== 'all' && !p.doctors.some(d => d.name === doctorFilter) && p.primaryDoctor !== doctorFilter) return false;
      if (fromDate && p.admissionDate < fromDate) return false;
      if (toDate && p.admissionDate > toDate) return false;
      if (q) {
        const haystack = [
          p.name, p.id, p.nationalId, p.phone, p.room, p.bed, p.diagnosis,
          p.primaryDoctor, p.address,
          ...p.babies.map(b => `${b.name} ${b.id}`),
        ].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query, wardFilter, statusFilter, typeFilter, doctorFilter, fromDate, toDate]);

  // Stats (computed on ALL patients, not the filtered set)
  const stats = useMemo(() => {
    const wardCounts = {};
    Object.keys(WARD_CFG).forEach(k => { wardCounts[k] = 0; });
    let newborns = 0, critical = 0;
    PATIENTS.forEach(p => {
      wardCounts[p.ward] = (wardCounts[p.ward] || 0) + 1;
      newborns += p.babies.length;
      if (p.status === 'critical') critical++;
    });
    return { total: PATIENTS.length, wardCounts, newborns, critical };
  }, []);

  const activeFilterCount =
    (wardFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) +
    (typeFilter !== 'all' ? 1 : 0) + (doctorFilter !== 'all' ? 1 : 0) +
    (fromDate ? 1 : 0) + (toDate ? 1 : 0);

  const clearFilters = () => {
    setWardFilter('all'); setStatusFilter('all'); setTypeFilter('all');
    setDoctorFilter('all'); setFromDate(''); setToDate('');
  };

  // ── DETAIL VIEW ──
  if (selected) {
    return <PatientDetailPage patient={selected} onBack={() => setSelected(null)} />;
  }

  // ── LIST VIEW ──
  return (
    <div>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Patient Records</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>
            Parirenyatwa Group of Hospitals — Maternity Unit · {PATIENTS.length} active patients · {stats.newborns} newborns
          </div>
        </div>
        <button className="pm-btn pm-btn-primary pm-btn-sm" onClick={() => setShowRooms(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <DoorOpen size={14} /> Room Occupancy
        </button>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Total Patients', value: stats.total, sub: 'maternity unit', icon: Users, color: '#6366f1', wardKey: 'all' },
          { label: WARD_CFG.antenatal.short, value: stats.wardCounts.antenatal, sub: 'antenatal ward', icon: Heart, color: WARD_CFG.antenatal.color, wardKey: 'antenatal' },
          { label: WARD_CFG.delivery.short, value: stats.wardCounts.delivery, sub: 'delivery suite', icon: Activity, color: WARD_CFG.delivery.color, wardKey: 'delivery' },
          { label: WARD_CFG.postnatal.short, value: stats.wardCounts.postnatal, sub: 'post-natal ward', icon: BedDouble, color: WARD_CFG.postnatal.color, wardKey: 'postnatal' },
          { label: WARD_CFG.kmc.short, value: stats.wardCounts.kmc, sub: 'kangaroo care', icon: Heart, color: WARD_CFG.kmc.color, wardKey: 'kmc' },
          { label: 'Newborns', value: stats.newborns, sub: 'in the unit', icon: Baby, color: '#ec4899', wardKey: 'all', type: 'mothers' },
          { label: 'Critical', value: stats.critical, sub: 'urgent attention', icon: AlertTriangle, color: '#dc2626', wardKey: 'all', status: 'critical', alert: true },
        ].map((s, i) => {
          const Icon = s.icon;
          const active = (s.wardKey !== 'all' && wardFilter === s.wardKey) || (s.status && statusFilter === s.status) || (s.type && typeFilter === s.type);
          return (
            <div key={i} className="pm-card" role="button" tabIndex={0}
              onClick={() => {
                if (s.status) { setStatusFilter(statusFilter === s.status ? 'all' : s.status); }
                else if (s.type) { setTypeFilter(typeFilter === s.type ? 'all' : s.type); }
                else { setWardFilter(wardFilter === s.wardKey ? 'all' : s.wardKey); }
              }}
              style={{ padding: '12px 14px', borderLeft: `3px solid ${s.color}`, cursor: 'pointer',
                ...(active ? { border: `1.5px solid ${s.color}`, borderLeft: `3px solid ${s.color}`, boxShadow: `0 0 0 2px ${s.color}20` } : {}),
                ...(s.alert && s.value > 0 && !active ? { border: `1.5px solid ${s.color}`, borderLeft: `3px solid ${s.color}` } : {}) }}>
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

      {/* SEARCH + FILTER BAR */}
      <div className="pm-card" style={{ padding: '14px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)' }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search name, patient ID, national ID, baby, room, doctor…"
              style={{ width: '100%', padding: '9px 12px 9px 38px', borderRadius: 8, border: '1px solid var(--pm-border)', fontSize: '0.85rem', background: 'var(--pm-surface-2)', color: 'var(--pm-text)', outline: 'none' }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pm-text-muted)', display: 'flex' }}>
                <X size={15} />
              </button>
            )}
          </div>
          {/* Quick type toggle */}
          <div style={{ display: 'flex', gap: 0, border: '1px solid var(--pm-border)', borderRadius: 8, overflow: 'hidden' }}>
            {[
              { key: 'all', label: 'All' },
              { key: 'mothers', label: 'Mothers' },
              { key: 'newborns', label: 'With Baby' },
            ].map(t => (
              <button key={t.key} onClick={() => setTypeFilter(t.key)}
                style={{ padding: '8px 14px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
                  background: typeFilter === t.key ? 'var(--pm-primary)' : 'var(--pm-surface-2)',
                  color: typeFilter === t.key ? '#fff' : 'var(--pm-text-muted)' }}>
                {t.label}
              </button>
            ))}
          </div>
          {/* Filter toggle */}
          <button onClick={() => setShowFilters(f => !f)} className="pm-btn pm-btn-outline pm-btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Filter size={14} /> Filters
            {activeFilterCount > 0 && (
              <span style={{ background: 'var(--pm-primary)', color: '#fff', fontSize: '0.62rem', fontWeight: 800, borderRadius: 20, padding: '1px 7px' }}>{activeFilterCount}</span>
            )}
          </button>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--pm-border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4 }}>Ward</label>
              <select value={wardFilter} onChange={e => setWardFilter(e.target.value)} style={selectStyle}>
                <option value="all">All wards</option>
                {Object.entries(WARD_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4 }}>Status</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
                <option value="all">All statuses</option>
                {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4 }}>Attending Doctor</label>
              <select value={doctorFilter} onChange={e => setDoctorFilter(e.target.value)} style={selectStyle}>
                <option value="all">All doctors</option>
                {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4 }}>Admitted From</label>
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={selectStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4 }}>Admitted To</label>
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={selectStyle} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={clearFilters} className="pm-btn pm-btn-ghost pm-btn-sm" style={{ width: '100%' }} disabled={activeFilterCount === 0}>
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RESULTS COUNT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>
          Showing <strong style={{ color: 'var(--pm-text)' }}>{filtered.length}</strong> of {PATIENTS.length} patients
          {activeFilterCount > 0 && ' (filtered)'}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', fontStyle: 'italic' }}>
          Click any row to open the full record
        </div>
      </div>

      {/* PATIENT TABLE */}
      <div className="pm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="pm-table" style={{ width: '100%', marginBottom: 0 }}>
            <thead>
              <tr>
                <th>PATIENT</th>
                <th>PATIENT ID</th>
                <th>WARD / ROOM</th>
                <th>ADMITTED</th>
                <th>NEWBORN</th>
                <th>DOCTOR</th>
                <th>STATUS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--pm-text-muted)' }}>
                    <Search size={28} style={{ opacity: 0.3, marginBottom: 8 }} />
                    <div style={{ fontWeight: 600 }}>No patients match your search</div>
                    <div style={{ fontSize: '0.78rem' }}>Try adjusting the filters or clearing the search.</div>
                  </td>
                </tr>
              ) : filtered.map(p => {
                const w = WARD_CFG[p.ward];
                const sc = STATUS_CFG[p.status];
                return (
                  <tr key={p.id} onClick={() => setSelected(p)} style={{ cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--pm-surface-2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: w.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.66rem', fontWeight: 800, flexShrink: 0 }}>
                          {initials(p.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)' }}>{p.age} yrs · {p.gravida}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', fontWeight: 600, fontFamily: "'Roboto Mono', monospace" }}>{p.id}</td>
                    <td>
                      <span style={{ fontSize: '0.62rem', fontWeight: 700, color: w.color, background: w.light, borderRadius: 10, padding: '1px 8px' }}>{w.short}</span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)', marginTop: 3 }}>{p.room}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{formatDate(p.admissionDate)}</div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--pm-text-muted)' }}>{daysSince(p.admissionDate)}d ago</div>
                    </td>
                    <td>
                      {p.babies.length > 0 ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.73rem', fontWeight: 700, color: '#be185d', background: '#fce7f3', borderRadius: 20, padding: '2px 9px' }}>
                          <Baby size={12} /> {p.babies.length}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.76rem', color: 'var(--pm-text)' }}>{p.primaryDoctor}</td>
                    <td>
                      <span style={{ fontSize: '0.66rem', fontWeight: 700, color: sc.color, background: sc.bg, borderRadius: 20, padding: '2px 9px' }}>{sc.label}</span>
                    </td>
                    <td><ChevronRight size={16} style={{ color: 'var(--pm-text-muted)' }} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROOM OCCUPANCY MODAL */}
      {showRooms && (
        <RoomOccupancyModal
          patients={PATIENTS}
          onClose={() => setShowRooms(false)}
          onSelectPatient={(p) => { setShowRooms(false); setSelected(p); }}
        />
      )}
    </div>
  );
}

const selectStyle = {
  width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--pm-border)',
  fontSize: '0.82rem', background: 'var(--pm-surface-2)', color: 'var(--pm-text)', outline: 'none',
};