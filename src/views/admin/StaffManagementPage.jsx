import React, { useState, useMemo } from 'react';
import {
  Users, Stethoscope, Baby, Heart, Activity, Wrench, Briefcase,
  Calendar, Clock, BookOpen, Mail, Printer, Shield, ChevronLeft,
  Search, X, CheckCircle, XCircle, UserPlus, User, GraduationCap,
  Phone, MapPin, ArrowRight, AlertTriangle, Bell, UserX,
  UserCheck, Edit2, LogOut, Building2, Info, Award, Clipboard
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// ROLE CONFIG — colors, labels, icons for each staff type
// ─────────────────────────────────────────────────────────────────────────────

const ROLE = {
  all:     { label: 'All Staff',   color: '#6366f1', light: '#eef2ff', icon: Users },
  admin:   { label: 'Admin',       color: '#f59e0b', light: '#fffbeb', icon: Briefcase },
  doctor:  { label: 'Doctors',     color: '#7c3aed', light: '#f5f3ff', icon: Stethoscope },
  midwife: { label: 'Midwives',    color: '#ec4899', light: '#fdf2f8', icon: Baby },
  nurse:   { label: 'Nurses',      color: '#0d9488', light: '#f0fdfa', icon: Heart },
  theatre: { label: 'Theatre',     color: '#dc2626', light: '#fff1f2', icon: Activity },
  support: { label: 'Support',     color: '#64748b', light: '#f8fafc', icon: Wrench },
};

const STATUS_STYLE = {
  active:    { cls: 'pm-badge-success', label: 'Active' },
  'on-leave':{ cls: 'pm-badge-warning', label: 'On Leave' },
  inactive:  { cls: 'pm-badge-neutral', label: 'Inactive' },
};

// ─────────────────────────────────────────────────────────────────────────────
// OCT 2024 ATTENDANCE HELPER  (1 Oct = Tuesday)
// weekends: 5,6,12,13,19,20,26,27
// ─────────────────────────────────────────────────────────────────────────────

const OCT_WEEKENDS = new Set([5, 6, 12, 13, 19, 20, 26, 27]);

function buildGrid(overrides = {}) {
  return Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    if (OCT_WEEKENDS.has(day)) return { day, s: 'weekend' };
    return { day, s: overrides[day] || 'P' };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// STAFF DATA — Zimbabwe Maternity Hospital
// ─────────────────────────────────────────────────────────────────────────────

const STAFF = [
  {
    id: 'STF-001', name: 'Dr. Chipo Chigudu', role: 'doctor', status: 'active',
    title: 'OB/GYN Consultant', department: 'Obstetrics & Gynaecology',
    shift: 'Day (07:00–19:00)', joinDate: '12 Mar 2018',
    employmentType: 'Full-time Permanent', salaryGrade: 'Senior Medical Officer Grade 1',
    qualifications: ['MBChB (University of Zimbabwe)', 'MMed Obstetrics & Gynaecology (UZ)', 'FCOG(SA) — Fellow College of OB/GYN South Africa'],
    dob: '14 May 1982', age: 42, nationalId: '63-234567-A-12', gender: 'Female',
    phone: '+263 77 234 5678', altPhone: '+263 71 345 6789',
    address: '15 Borrowdale Road, Harare', email: 'c.chigudu@parirenyatwa.ac.zw',
    nextOfKin: { name: 'Tinashe Chigudu', relation: 'Husband', phone: '+263 71 234 5678' },
    leaveBalance: { annual: 18, sick: 5, study: 3 },
    attendanceStats: { present: 19, late: 1, absent: 0, leave: 0, total: 20 },
    attendanceGrid: buildGrid({ 15: 'T' }),
    workHistory: [
      { position: 'OB/GYN Consultant', department: 'Obstetrics & Gynaecology', from: 'Mar 2020', to: 'Present', note: 'Promoted to Consultant level. Heads the high-risk obstetric and HDU unit.' },
      { position: 'Senior Registrar OB/GYN', department: 'Obstetrics & Gynaecology', from: 'Mar 2018', to: 'Feb 2020', note: 'Joined as Senior Registrar following MMed completion. Specialised in fetal medicine.' },
    ],
    training: [
      { course: 'Emergency Obstetric Care (EmOC) — Advanced', institution: 'MOHCC Zimbabwe / WHO', date: 'Apr 2023', status: 'completed' },
      { course: 'Fetal Monitoring & CTG Interpretation', institution: 'SANOG Annual Congress', date: 'Sep 2022', status: 'completed' },
      { course: 'Healthcare Leadership & Management', institution: 'UZ Business School', date: 'Feb 2025', status: 'upcoming' },
    ],
  },
  {
    id: 'STF-002', name: 'Dr. Tendai Mutombwa', role: 'doctor', status: 'active',
    title: 'Medical Officer (MO)', department: 'Obstetrics & Gynaecology',
    shift: 'Rotating (Day / On-call)', joinDate: '05 Aug 2021',
    employmentType: 'Full-time Permanent', salaryGrade: 'Medical Officer Grade 2',
    qualifications: ['MBChB (National University of Science and Technology — NUST)', 'Diploma in Obstetrics (UZ)'],
    dob: '30 Nov 1991', age: 32, nationalId: '63-456789-B-34', gender: 'Male',
    phone: '+263 77 456 7890', altPhone: '+263 78 567 8901',
    address: 'House 8, Avondale West, Harare', email: 't.mutombwa@parirenyatwa.ac.zw',
    nextOfKin: { name: 'Grace Mutombwa', relation: 'Wife', phone: '+263 78 890 1234' },
    leaveBalance: { annual: 22, sick: 10, study: 5 },
    attendanceStats: { present: 17, late: 0, absent: 1, leave: 2, total: 20 },
    attendanceGrid: buildGrid({ 3: 'A', 21: 'L', 22: 'L' }),
    workHistory: [
      { position: 'Medical Officer (MO)', department: 'Obstetrics & Gynaecology', from: 'Aug 2021', to: 'Present', note: 'Primary duties in labour ward, antenatal clinic, and emergency cover.' },
      { position: 'Intern Medical Officer', department: 'General Surgery / O&G Rotation', from: 'Feb 2020', to: 'Jul 2021', note: 'Completed internship at Parirenyatwa. Rotated through O&G, Surgery, and Paediatrics.' },
    ],
    training: [
      { course: 'Basic Emergency Obstetric Care (BEmOC)', institution: 'MOHCC Zimbabwe', date: 'Jan 2022', status: 'completed' },
      { course: 'Advanced Life Support in Obstetrics (ALSO)', institution: 'ALSO Africa', date: 'Mar 2024', status: 'completed' },
      { course: 'Diploma in Obstetrics & Gynaecology', institution: 'University of Zimbabwe', date: 'Nov 2024', status: 'upcoming' },
    ],
  },
  {
    id: 'STF-003', name: 'Dr. Ruvimbo Mupanduki', role: 'doctor', status: 'active',
    title: 'Senior Registrar OB/GYN', department: 'Obstetrics & Gynaecology',
    shift: 'Day (07:00–17:00) / On-call alternate weekends', joinDate: '10 Jan 2022',
    employmentType: 'Full-time (Training Post)', salaryGrade: 'Registrar Grade 3',
    qualifications: ['MBChB (University of Zimbabwe)', 'Enrolled: MMed OB/GYN (UZ) — Part II'],
    dob: '22 Jul 1990', age: 34, nationalId: '63-678901-C-56', gender: 'Female',
    phone: '+263 77 678 9012', altPhone: '',
    address: 'Flat 2A, Eastlea, Harare', email: 'r.mupanduki@parirenyatwa.ac.zw',
    nextOfKin: { name: 'Lovemore Mupanduki', relation: 'Husband', phone: '+263 71 234 5670' },
    leaveBalance: { annual: 14, sick: 10, study: 8 },
    attendanceStats: { present: 18, late: 2, absent: 0, leave: 0, total: 20 },
    attendanceGrid: buildGrid({ 8: 'T', 17: 'T' }),
    workHistory: [
      { position: 'Senior Registrar OB/GYN', department: 'Obstetrics & Gynaecology', from: 'Jan 2022', to: 'Present', note: 'Training post — enrolled in MMed O&G programme at UZ. Completing Part II.' },
      { position: 'Medical Officer', department: 'Mpilo Central Hospital, Bulawayo', from: 'Mar 2019', to: 'Dec 2021', note: 'MO in O&G and General Surgery before transferring for postgraduate training.' },
    ],
    training: [
      { course: 'Emergency Obstetric Care (EmOC)', institution: 'MOHCC Zimbabwe', date: 'Feb 2022', status: 'completed' },
      { course: 'Maternal-Fetal Medicine Workshop', institution: 'SASOG Annual Meeting', date: 'Aug 2023', status: 'completed' },
      { course: 'MMed Part II OSCE Preparation', institution: 'University of Zimbabwe', date: 'Dec 2024', status: 'upcoming' },
    ],
  },
  {
    id: 'STF-004', name: 'Sr. Agnes Musabayana', role: 'midwife', status: 'active',
    title: 'Senior Midwife / Ward Sister', department: 'Labour & Delivery Ward',
    shift: 'Day (07:00–19:00)', joinDate: '03 Jun 2009',
    employmentType: 'Full-time Permanent', salaryGrade: 'Sister-in-Charge Grade 2',
    qualifications: ['State Certified Midwife (SCM)', 'Registered General Nurse (RGN — UZ School of Nursing)', 'Certificate in Management — NSSA'],
    dob: '05 Feb 1975', age: 49, nationalId: '63-123456-D-78', gender: 'Female',
    phone: '+263 77 123 4560', altPhone: '+263 71 234 5670',
    address: 'House 34, Hatfield, Harare', email: 'a.musabayana@parirenyatwa.ac.zw',
    nextOfKin: { name: 'Simba Musabayana', relation: 'Husband', phone: '+263 71 234 5670' },
    leaveBalance: { annual: 10, sick: 3, study: 0 },
    attendanceStats: { present: 20, late: 0, absent: 0, leave: 0, total: 20 },
    attendanceGrid: buildGrid({}),
    workHistory: [
      { position: 'Senior Midwife / Ward Sister', department: 'Labour & Delivery Ward', from: 'Jan 2015', to: 'Present', note: 'Promoted to Sister-in-Charge. Oversees the labour ward, coordinates shift handovers, and mentors junior midwives.' },
      { position: 'Registered Midwife', department: 'Labour & Delivery Ward', from: 'Jun 2009', to: 'Dec 2014', note: 'Joined as a Staff Midwife. Quickly gained expertise in managing complicated deliveries.' },
    ],
    training: [
      { course: 'Advanced EmOC — Facilitator Training', institution: 'MOHCC Zimbabwe / UNFPA', date: 'Nov 2021', status: 'completed' },
      { course: 'Infection Prevention & Control (IPC)', institution: 'Parirenyatwa In-house Training', date: 'Mar 2023', status: 'completed' },
      { course: 'Leadership for Senior Nurses', institution: 'WHO / Ministry of Health', date: 'Jan 2025', status: 'upcoming' },
    ],
  },
  {
    id: 'STF-005', name: 'Sr. Memory Choto', role: 'midwife', status: 'on-leave',
    title: 'Registered Midwife', department: 'Labour & Delivery Ward',
    shift: 'Night (19:00–07:00)', joinDate: '14 Feb 2017',
    employmentType: 'Full-time Permanent', salaryGrade: 'Staff Midwife Grade 3',
    qualifications: ['State Certified Midwife (SCM)', 'Registered General Nurse (RGN)'],
    dob: '18 Sep 1988', age: 36, nationalId: '63-345670-E-90', gender: 'Female',
    phone: '+263 77 345 6780', altPhone: '',
    address: 'House 7, Mabelreign, Harare', email: 'm.choto@parirenyatwa.ac.zw',
    nextOfKin: { name: 'Tatenda Choto', relation: 'Husband', phone: '+263 71 456 7890' },
    leaveBalance: { annual: 5, sick: 10, study: 5 },
    attendanceStats: { present: 16, late: 0, absent: 0, leave: 4, total: 20 },
    attendanceGrid: buildGrid({ 28: 'L', 29: 'L', 30: 'L', 31: 'L' }),
    workHistory: [
      { position: 'Registered Midwife', department: 'Labour & Delivery Ward', from: 'Feb 2017', to: 'Present', note: 'Night shift specialist. Extensive experience in managing preterm labour and PMTCT protocols.' },
      { position: 'Enrolled Midwife (Student)', department: 'Harare Central Hospital', from: 'Jan 2014', to: 'Jan 2017', note: 'Completed State Midwifery Certificate at Harare Central. Qualified with distinction.' },
    ],
    training: [
      { course: 'PMTCT Refresher — Option B+', institution: 'MOHCC Zimbabwe / CDC', date: 'Aug 2022', status: 'completed' },
      { course: 'Neonatal Resuscitation Programme (NRP)', institution: 'American Academy of Pediatrics', date: 'May 2021', status: 'completed' },
      { course: 'RCM Africa Midwifery Conference', institution: 'Royal College of Midwives', date: 'Nov 2024', status: 'upcoming' },
    ],
  },
  {
    id: 'STF-006', name: 'SN Blessing Mwanaka', role: 'nurse', status: 'active',
    title: 'Staff Nurse (RGN)', department: 'Postnatal Ward',
    shift: 'Day (07:00–19:00)', joinDate: '01 Sep 2019',
    employmentType: 'Full-time Permanent', salaryGrade: 'Staff Nurse Grade 4',
    qualifications: ['Registered General Nurse (RGN — Parirenyatwa School of Nursing)', 'Certificate in HIV/AIDS Care (MOHCC)'],
    dob: '12 Mar 1994', age: 30, nationalId: '63-456781-F-12', gender: 'Female',
    phone: '+263 78 456 7801', altPhone: '+263 77 567 8902',
    address: 'House 91, Budiriro 3, Harare', email: 'b.mwanaka@parirenyatwa.ac.zw',
    nextOfKin: { name: 'Farai Mwanaka', relation: 'Mother', phone: '+263 77 567 8902' },
    leaveBalance: { annual: 20, sick: 10, study: 5 },
    attendanceStats: { present: 18, late: 1, absent: 1, leave: 0, total: 20 },
    attendanceGrid: buildGrid({ 9: 'T', 24: 'A' }),
    workHistory: [
      { position: 'Staff Nurse (RGN)', department: 'Postnatal Ward', from: 'Sep 2019', to: 'Present', note: 'Postnatal ward nurse specialising in breastfeeding support and newborn care education.' },
    ],
    training: [
      { course: 'Baby-Friendly Hospital Initiative (BFHI) Training', institution: 'UNICEF / MOHCC', date: 'Jun 2020', status: 'completed' },
      { course: 'Postnatal Mental Health Awareness', institution: 'Zimbabwe Mental Health Assoc.', date: 'Oct 2022', status: 'completed' },
      { course: 'Wound Care & Surgical Nursing', institution: 'Parirenyatwa In-house CPD', date: 'Mar 2025', status: 'upcoming' },
    ],
  },
  {
    id: 'STF-007', name: 'EN Primrose Dube', role: 'nurse', status: 'active',
    title: 'Enrolled Nurse (EN)', department: 'Antenatal Ward',
    shift: 'Rotating', joinDate: '22 Mar 2021',
    employmentType: 'Full-time Permanent', salaryGrade: 'Enrolled Nurse Grade 5',
    qualifications: ['Enrolled Nurse (EN — State Certificate)', 'Certificate in Midwifery Assistance'],
    dob: '07 Jul 1997', age: 27, nationalId: '70-567892-G-34', gender: 'Female',
    phone: '+263 77 567 8923', altPhone: '',
    address: 'Flat 1C, Njube, Bulawayo', email: 'p.dube@parirenyatwa.ac.zw',
    nextOfKin: { name: 'Sithembile Dube', relation: 'Mother', phone: '+263 77 890 1234' },
    leaveBalance: { annual: 22, sick: 10, study: 5 },
    attendanceStats: { present: 18, late: 2, absent: 0, leave: 0, total: 20 },
    attendanceGrid: buildGrid({ 4: 'T', 22: 'T' }),
    workHistory: [
      { position: 'Enrolled Nurse', department: 'Antenatal Ward', from: 'Mar 2021', to: 'Present', note: 'Provides antenatal monitoring, patient education, and assists with clinical procedures.' },
    ],
    training: [
      { course: 'ANC Essential Care Package (ECP)', institution: 'MOHCC Zimbabwe', date: 'Jul 2021', status: 'completed' },
      { course: 'Infection Prevention & Control', institution: 'Parirenyatwa In-house', date: 'Feb 2023', status: 'completed' },
    ],
  },
  {
    id: 'STF-008', name: 'Sr. Anesu Murewa', role: 'theatre', status: 'active',
    title: 'Theatre Nurse (Scrub Nurse)', department: 'Operating Theatre',
    shift: 'Day (07:00–17:00) / On-call', joinDate: '17 Jul 2015',
    employmentType: 'Full-time Permanent', salaryGrade: 'Theatre Nurse Grade 2',
    qualifications: ['Registered General Nurse (RGN)', 'Post-Basic Theatre Nursing Certificate (UZ)'],
    dob: '25 Jan 1985', age: 39, nationalId: '63-789013-H-56', gender: 'Female',
    phone: '+263 77 789 0134', altPhone: '+263 71 890 1245',
    address: '22 Malbereign Road, Harare', email: 'a.murewa@parirenyatwa.ac.zw',
    nextOfKin: { name: 'Tafadzwa Murewa', relation: 'Husband', phone: '+263 71 890 1245' },
    leaveBalance: { annual: 12, sick: 8, study: 3 },
    attendanceStats: { present: 19, late: 0, absent: 0, leave: 1, total: 20 },
    attendanceGrid: buildGrid({ 10: 'L' }),
    workHistory: [
      { position: 'Theatre Nurse (Scrub Nurse)', department: 'Operating Theatre', from: 'Jul 2015', to: 'Present', note: 'Primary scrub nurse for elective and emergency C-sections. Assists with cerclage, hysterectomy, and laparoscopy.' },
      { position: 'Staff Nurse (RGN)', department: 'Surgical Ward', from: 'Jan 2011', to: 'Jun 2015', note: 'General surgical nursing before specialising in theatre.' },
    ],
    training: [
      { course: 'Perioperative Nursing Advanced Practice', institution: 'AORN / UZ', date: 'Nov 2019', status: 'completed' },
      { course: 'Surgical Site Infection Prevention', institution: 'WHO Africa', date: 'Jun 2022', status: 'completed' },
    ],
  },
  {
    id: 'STF-009', name: 'Mr. Takudzwa Kanyama', role: 'theatre', status: 'active',
    title: 'Anaesthetic Nurse / Nurse Anaesthetist', department: 'Anaesthesia & Theatre',
    shift: 'Day / On-call (24h rotation)', joinDate: '02 Feb 2016',
    employmentType: 'Full-time Permanent', salaryGrade: 'Specialist Nurse Grade 1',
    qualifications: ['Registered General Nurse (RGN)', 'Post-Basic Anaesthetic Nursing Diploma (UZ)', 'CICO Training (WFSA)'],
    dob: '14 Oct 1983', age: 41, nationalId: '63-890124-I-78', gender: 'Male',
    phone: '+263 77 890 1245', altPhone: '',
    address: 'House 5, Greendale, Harare', email: 't.kanyama@parirenyatwa.ac.zw',
    nextOfKin: { name: 'Pamela Kanyama', relation: 'Wife', phone: '+263 71 901 2356' },
    leaveBalance: { annual: 16, sick: 10, study: 5 },
    attendanceStats: { present: 20, late: 0, absent: 0, leave: 0, total: 20 },
    attendanceGrid: buildGrid({}),
    workHistory: [
      { position: 'Nurse Anaesthetist', department: 'Anaesthesia & Theatre', from: 'Feb 2016', to: 'Present', note: 'Administers spinal and general anaesthesia for obstetric procedures. Lead for CS anaesthetic protocols.' },
      { position: 'Staff Nurse', department: 'Intensive Care Unit (ICU)', from: 'Aug 2009', to: 'Jan 2016', note: 'ICU nursing background before specialising in anaesthesia.' },
    ],
    training: [
      { course: 'Regional Anaesthesia for Obstetrics', institution: 'ATSA / University of Cape Town', date: 'Aug 2021', status: 'completed' },
      { course: 'Airway Management & Difficult Intubation', institution: 'DAS Guidelines Workshop', date: 'Mar 2020', status: 'completed' },
    ],
  },
  {
    id: 'STF-010', name: 'Mr. Taurai Zvobgo', role: 'admin', status: 'active',
    title: 'Hospital Administrator', department: 'Administration',
    shift: 'Office Hours (08:00–17:00)', joinDate: '15 Jan 2013',
    employmentType: 'Full-time Permanent', salaryGrade: 'Senior Management Grade A',
    qualifications: ['BSc Health Services Management (MSU)', 'MBA — Zimbabwe Open University', 'Diploma in Public Health Administration'],
    dob: '03 Apr 1978', age: 46, nationalId: '63-901235-J-90', gender: 'Male',
    phone: '+263 77 901 2356', altPhone: '+263 71 012 3467',
    address: '45 Enterprise Road, Highlands, Harare', email: 't.zvobgo@parirenyatwa.ac.zw',
    nextOfKin: { name: 'Chipo Zvobgo', relation: 'Wife', phone: '+263 71 012 3467' },
    leaveBalance: { annual: 8, sick: 10, study: 5 },
    attendanceStats: { present: 20, late: 0, absent: 0, leave: 0, total: 20 },
    attendanceGrid: buildGrid({}),
    workHistory: [
      { position: 'Hospital Administrator', department: 'Administration', from: 'Jan 2016', to: 'Present', note: 'Heads all non-clinical operations. Oversees HR, Finance, Facilities, and Compliance.' },
      { position: 'Deputy Administrator', department: 'Administration', from: 'Jan 2013', to: 'Dec 2015', note: 'Assisted the Administrator in policy development and operational planning.' },
    ],
    training: [
      { course: 'Hospital Accreditation & Quality Management', institution: 'COHSASA / MOHCC', date: 'Sep 2022', status: 'completed' },
      { course: 'Strategic Leadership in Health Systems', institution: 'African Management Institute', date: 'May 2025', status: 'upcoming' },
    ],
  },
  {
    id: 'STF-011', name: 'Ms. Farai Mwari', role: 'admin', status: 'active',
    title: 'Human Resources Officer', department: 'Human Resources',
    shift: 'Office Hours (08:00–17:00)', joinDate: '10 May 2019',
    employmentType: 'Full-time Permanent', salaryGrade: 'HR Officer Grade 2',
    qualifications: ['BSc Human Resources Management (Bindura University)', 'IPMZ Diploma (Institute of People Management Zimbabwe)'],
    dob: '29 Aug 1990', age: 34, nationalId: '63-012346-K-12', gender: 'Female',
    phone: '+263 77 012 3467', altPhone: '',
    address: 'House 3, Waterfalls, Harare', email: 'f.mwari@parirenyatwa.ac.zw',
    nextOfKin: { name: 'Blessing Mwari', relation: 'Husband', phone: '+263 71 123 4578' },
    leaveBalance: { annual: 20, sick: 10, study: 5 },
    attendanceStats: { present: 19, late: 1, absent: 0, leave: 0, total: 20 },
    attendanceGrid: buildGrid({ 16: 'T' }),
    workHistory: [
      { position: 'Human Resources Officer', department: 'Human Resources', from: 'May 2019', to: 'Present', note: 'Manages recruitment, payroll coordination, leave administration, and staff welfare.' },
    ],
    training: [
      { course: 'Labour Relations in the Health Sector', institution: 'IPMZ Zimbabwe', date: 'Nov 2021', status: 'completed' },
      { course: 'HRIS Systems Training — Belina Payroll', institution: 'Belina Solutions', date: 'Apr 2020', status: 'completed' },
    ],
  },
  {
    id: 'STF-012', name: 'Mr. Tinashe Ncube', role: 'admin', status: 'active',
    title: 'Finance Officer', department: 'Finance & Accounts',
    shift: 'Office Hours (08:00–17:00)', joinDate: '01 Mar 2017',
    employmentType: 'Full-time Permanent', salaryGrade: 'Finance Officer Grade 2',
    qualifications: ['BCom Accounting (Midlands State University)', 'ACCA Part III (In Progress)', 'ICAZ Affiliate Member'],
    dob: '11 Nov 1988', age: 35, nationalId: '70-123457-L-34', gender: 'Male',
    phone: '+263 77 123 4578', altPhone: '+263 73 234 5689',
    address: 'Flat 5B, Famona, Bulawayo', email: 'tinashe.ncube@parirenyatwa.ac.zw',
    nextOfKin: { name: 'Sithembile Ncube', relation: 'Wife', phone: '+263 73 234 5689' },
    leaveBalance: { annual: 15, sick: 10, study: 8 },
    attendanceStats: { present: 18, late: 0, absent: 0, leave: 2, total: 20 },
    attendanceGrid: buildGrid({ 7: 'L', 8: 'L' }),
    workHistory: [
      { position: 'Finance Officer', department: 'Finance & Accounts', from: 'Mar 2017', to: 'Present', note: 'Manages hospital budget, procurement payments, donor fund accounting, and monthly financial reports.' },
      { position: 'Accounts Clerk', department: 'Finance & Accounts', from: 'Jan 2015', to: 'Feb 2017', note: 'Accounts payable and receivable, bank reconciliations.' },
    ],
    training: [
      { course: 'PFMS — Public Finance Management System', institution: 'MOHCC / Treasury Zimbabwe', date: 'Jul 2022', status: 'completed' },
    ],
  },
  {
    id: 'STF-013', name: 'Ms. Ruth Chimuti', role: 'support', status: 'active',
    title: 'Pharmacist (In-Charge)', department: 'Pharmacy',
    shift: 'Day (08:00–17:00)', joinDate: '20 Sep 2016',
    employmentType: 'Full-time Permanent', salaryGrade: 'Pharmacist Grade 1',
    qualifications: ['BPharm (University of Zimbabwe)', 'Registered Pharmacist — Medicines Control Authority of Zimbabwe (MCAZ)'],
    dob: '02 Jun 1987', age: 37, nationalId: '63-234568-M-56', gender: 'Female',
    phone: '+263 77 234 5689', altPhone: '+263 71 345 6790',
    address: '18 Newlands Road, Harare', email: 'r.chimuti@parirenyatwa.ac.zw',
    nextOfKin: { name: 'Takudzwa Chimuti', relation: 'Husband', phone: '+263 71 345 6790' },
    leaveBalance: { annual: 18, sick: 10, study: 5 },
    attendanceStats: { present: 20, late: 0, absent: 0, leave: 0, total: 20 },
    attendanceGrid: buildGrid({}),
    workHistory: [
      { position: 'Pharmacist In-Charge', department: 'Pharmacy', from: 'Jan 2020', to: 'Present', note: 'Oversees drug management, ARV dispensing, PMTCT protocols, and pharmacy staff.' },
      { position: 'Staff Pharmacist', department: 'Pharmacy', from: 'Sep 2016', to: 'Dec 2019', note: 'Dispensing, patient counselling, and stock management.' },
    ],
    training: [
      { course: 'ARV Management & PMTCT Pharmacy', institution: 'MOHCC / USAID PEPFAR', date: 'Mar 2022', status: 'completed' },
      { course: 'Hospital Pharmacy Practice — Advanced', institution: 'MCAZ CPD Programme', date: 'Oct 2023', status: 'completed' },
    ],
  },
  {
    id: 'STF-014', name: 'Mr. Shepherd Chikomba', role: 'support', status: 'on-leave',
    title: 'Ward Orderly / Patient Care Assistant', department: 'General Services',
    shift: 'Day (07:00–15:30)', joinDate: '03 Nov 2014',
    employmentType: 'Full-time Permanent', salaryGrade: 'Ward Orderly Grade 6',
    qualifications: ['Zimbabwe Junior Certificate (ZJC)', 'Certificate in Patient Care Assistance (ZNQF Level 2)'],
    dob: '15 Feb 1980', age: 44, nationalId: '63-345679-N-78', gender: 'Male',
    phone: '+263 77 345 6790', altPhone: '+263 71 456 7801',
    address: 'House 102, Glen View 8, Harare', email: 'shepherd.chikomba@parirenyatwa.ac.zw',
    nextOfKin: { name: 'Miriam Chikomba', relation: 'Wife', phone: '+263 71 456 7801' },
    leaveBalance: { annual: 18, sick: 7, study: 0 },
    attendanceStats: { present: 17, late: 0, absent: 0, leave: 3, total: 20 },
    attendanceGrid: buildGrid({ 23: 'L', 24: 'L', 25: 'L' }),
    workHistory: [
      { position: 'Ward Orderly', department: 'General Services', from: 'Nov 2014', to: 'Present', note: 'Patient transport, ward cleaning, equipment sterilisation support, and general ward assistance.' },
    ],
    training: [
      { course: 'Patient Handling & Hygiene — In-house', institution: 'Parirenyatwa In-house', date: 'Apr 2020', status: 'completed' },
      { course: 'Occupational Health & Safety (OHS)', institution: 'NSSA Zimbabwe', date: 'Aug 2022', status: 'completed' },
    ],
  },
  {
    id: 'STF-015', name: 'Ms. Vimbai Sithole', role: 'support', status: 'active',
    title: 'Social Worker (Clinical)', department: 'Social Work & Patient Services',
    shift: 'Office Hours (08:00–16:30)', joinDate: '18 Apr 2018',
    employmentType: 'Full-time Permanent', salaryGrade: 'Social Worker Grade 3',
    qualifications: ['BSW Social Work (University of Zimbabwe)', 'Registered Social Worker — Council of Social Workers Zimbabwe'],
    dob: '28 Dec 1991', age: 32, nationalId: '63-456780-O-90', gender: 'Female',
    phone: '+263 77 456 7801', altPhone: '',
    address: 'House 17, Dzivarasekwa, Harare', email: 'v.sithole@parirenyatwa.ac.zw',
    nextOfKin: { name: 'Kudakwashe Sithole', relation: 'Brother', phone: '+263 71 567 8912' },
    leaveBalance: { annual: 20, sick: 10, study: 5 },
    attendanceStats: { present: 19, late: 0, absent: 1, leave: 0, total: 20 },
    attendanceGrid: buildGrid({ 2: 'A' }),
    workHistory: [
      { position: 'Clinical Social Worker', department: 'Social Work & Patient Services', from: 'Apr 2018', to: 'Present', note: 'GBV case management, adolescent pregnancy support, child protection referrals, and social grants facilitation.' },
    ],
    training: [
      { course: 'Gender-Based Violence (GBV) Clinical Response', institution: 'UN Women / MOHCC', date: 'May 2021', status: 'completed' },
      { course: 'Child Protection in Healthcare Settings', institution: 'UNICEF Zimbabwe', date: 'Sep 2022', status: 'completed' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NOTICES & EVENTS DATA
// ─────────────────────────────────────────────────────────────────────────────

const LEAVE_REQUESTS_INIT = [
  { id: 'LR-001', staffId: 'STF-005', staff: 'Sr. Memory Choto', role: 'midwife', type: 'Annual Leave', from: '28 Oct', to: '01 Nov', days: 5, reason: 'Family vacation — pre-booked', status: 'pending', submitted: '20 Oct 2024' },
  { id: 'LR-002', staffId: 'STF-014', staff: 'Mr. Shepherd Chikomba', role: 'support', type: 'Sick Leave', from: '23 Oct', to: '25 Oct', days: 3, reason: 'Malaria — GP medical certificate attached', status: 'pending', submitted: '23 Oct 2024' },
  { id: 'LR-003', staffId: 'STF-006', staff: 'SN Blessing Mwanaka', role: 'nurse', type: 'Study Leave', from: '04 Nov', to: '08 Nov', days: 5, reason: 'RCM Africa Midwifery Conference — Harare International Conference Centre', status: 'approved', submitted: '15 Oct 2024' },
  { id: 'LR-004', staffId: 'STF-002', staff: 'Dr. Tendai Mutombwa', role: 'doctor', type: 'Annual Leave', from: '11 Nov', to: '22 Nov', days: 10, reason: 'Annual family leave — travel to Mutare', status: 'pending', submitted: '22 Oct 2024' },
];

const EVENTS = [
  { id: 'EVT-001', type: 'training', title: 'CPD: Advanced Neonatal Resuscitation (NRP)', date: '29 Oct 2024', time: '08:00 AM', location: 'Conference Hall, Ground Floor', organizer: 'Dr. C. Chigudu', audience: 'All Midwives & Labour Ward Nurses', mandatory: true },
  { id: 'EVT-002', type: 'meeting', title: 'Monthly Ward Managers Meeting', date: '31 Oct 2024', time: '02:00 PM', location: 'Board Room, 4th Floor', organizer: 'Administration', audience: 'All Ward Managers & Department Heads', mandatory: true },
  { id: 'EVT-003', type: 'training', title: 'HIV/PMTCT Refresher Training — Option B+', date: '04 Nov 2024', time: '09:00 AM', location: 'Training Room B', organizer: 'MOHCC Training Unit / CDC', audience: 'All Clinical Staff', mandatory: false },
  { id: 'EVT-004', type: 'new-staff', title: 'New Staff: Sr. Rutendo Maposa joins Labour Ward', date: '01 Nov 2024', note: 'Transfer from Mpilo Central Hospital, Bulawayo. SCM qualified. Please welcome her.' },
  { id: 'EVT-005', type: 'departure', title: 'Farewell: Dr. Emmanuel Mwari', date: '30 Oct 2024', note: 'Dr. Mwari\'s last day is 31 Oct. Farewell tea at 4 PM, hospital canteen. All staff welcome.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS & SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Avatar({ name, role, size = 40 }) {
  const { color, light } = ROLE[role] || ROLE.support;
  const initials = name.replace(/^(Dr\.|Sr\.|Mr\.|Ms\.|SN|EN)\s+/, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size > 36 ? '1rem' : '0.75rem', fontWeight: 800,
      border: `2px solid ${light}`,
    }}>
      {initials}
    </div>
  );
}

function RoleTag({ role }) {
  const { color, label } = ROLE[role] || ROLE.support;
  return (
    <span style={{ fontSize: '0.68rem', fontWeight: 700, color, background: `${color}15`, border: `1px solid ${color}40`, borderRadius: 20, padding: '2px 8px' }}>
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.active;
  return <span className={`pm-badge ${s.cls}`} style={{ fontSize: '0.68rem' }}>{s.label}</span>;
}

function InfoGrid({ rows }) {
  return (
    <div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--pm-border)' : 'none', alignItems: 'flex-start' }}>
          <span style={{ width: 160, flexShrink: 0, fontSize: '0.77rem', color: 'var(--pm-text-muted)', fontWeight: 500, paddingTop: 1 }}>{r.label}</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.4 }}>{r.value || '—'}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RING STAT CARD
// ─────────────────────────────────────────────────────────────────────────────

function RingStatCard({ label, value, color, icon: Icon, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '14px 10px', cursor: 'pointer', flex: 1, minWidth: 86,
      background: active ? `${color}10` : 'var(--pm-card-bg, #fff)',
      border: `1.5px solid ${active ? color : 'var(--pm-border)'}`,
      borderRadius: 12, transition: 'all 0.15s ease',
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: '50%',
        border: `3px solid ${color}`,
        background: `${color}12`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 8,
        boxShadow: active ? `0 0 0 4px ${color}22` : 'none',
        transition: 'box-shadow 0.15s ease',
      }}>
        <Icon size={15} style={{ color, marginBottom: 1 }} strokeWidth={2.5} />
        <span style={{ fontWeight: 800, fontSize: '1.05rem', color, lineHeight: 1.1 }}>{value}</span>
      </div>
      <span style={{ fontSize: '0.71rem', fontWeight: 600, color: active ? color : 'var(--pm-text-muted)', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE CALENDAR
// ─────────────────────────────────────────────────────────────────────────────

const ATT_CFG = {
  P: { label: 'Present', color: '#16a34a', bg: '#dcfce7' },
  T: { label: 'Late',    color: '#d97706', bg: '#fef3c7' },
  A: { label: 'Absent',  color: '#dc2626', bg: '#fee2e2' },
  L: { label: 'Leave',   color: '#2563eb', bg: '#dbeafe' },
  weekend: { label: 'Weekend', color: '#9ca3af', bg: '#f3f4f6' },
};

function AttendanceCalendar({ grid }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // Oct 1 = Tuesday → offset = 1
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 6 }}>
        {days.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--pm-text-muted)', padding: '4px 0' }}>{d}</div>
        ))}
      </div>
      {/* 1 empty cell for Mon before Oct 1 (Tue) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
        <div style={{ aspectRatio: '1', background: 'transparent' }} />
        {grid.map(({ day, s }) => {
          const cfg = ATT_CFG[s] || ATT_CFG.P;
          return (
            <div key={day} title={`${day} Oct — ${cfg.label}`} style={{
              aspectRatio: '1', borderRadius: 5,
              background: cfg.bg,
              border: `1px solid ${cfg.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 700, color: cfg.color,
              cursor: 'default',
            }}>
              {s !== 'weekend' ? day : ''}
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        {Object.entries(ATT_CFG).filter(([k]) => k !== 'weekend').map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: v.bg, border: `1px solid ${v.color}60` }} />
            <span style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)' }}>{v.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL TABS
// ─────────────────────────────────────────────────────────────────────────────

function PersonalTab({ staff }) {
  return (
    <div className="row g-3">
      <div className="col-12 col-md-6">
        <div className="pm-card">
          <div className="pm-section-title" style={{ marginBottom: 12 }}>Personal Details</div>
          <InfoGrid rows={[
            { label: 'Full Name', value: staff.name },
            { label: 'Date of Birth', value: `${staff.dob} (Age ${staff.age})` },
            { label: 'Gender', value: staff.gender },
            { label: 'National ID', value: staff.nationalId },
          ]} />
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="pm-card">
          <div className="pm-section-title" style={{ marginBottom: 12 }}>Contact Information</div>
          <InfoGrid rows={[
            { label: 'Primary Phone', value: staff.phone },
            { label: 'Alternate Phone', value: staff.altPhone || '—' },
            { label: 'Work Email', value: staff.email },
            { label: 'Home Address', value: staff.address },
          ]} />
        </div>
      </div>
      <div className="col-12">
        <div className="pm-card">
          <div className="pm-section-title" style={{ marginBottom: 12 }}>Emergency / Next of Kin</div>
          <InfoGrid rows={[
            { label: 'Name', value: staff.nextOfKin.name },
            { label: 'Relationship', value: staff.nextOfKin.relation },
            { label: 'Phone', value: staff.nextOfKin.phone },
          ]} />
        </div>
      </div>
    </div>
  );
}

function EmploymentTab({ staff }) {
  return (
    <div className="row g-3">
      <div className="col-12 col-md-6">
        <div className="pm-card">
          <div className="pm-section-title" style={{ marginBottom: 12 }}>Role & Placement</div>
          <InfoGrid rows={[
            { label: 'Staff ID', value: staff.id },
            { label: 'Job Title', value: staff.title },
            { label: 'Department', value: staff.department },
            { label: 'Role Type', value: <RoleTag role={staff.role} /> },
            { label: 'Shift', value: staff.shift },
            { label: 'Staff Status', value: <StatusBadge status={staff.status} /> },
          ]} />
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="pm-card">
          <div className="pm-section-title" style={{ marginBottom: 12 }}>Contract & Grading</div>
          <InfoGrid rows={[
            { label: 'Date Joined', value: staff.joinDate },
            { label: 'Employment Type', value: staff.employmentType },
            { label: 'Salary Grade', value: staff.salaryGrade },
          ]} />
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: '0.77rem', fontWeight: 700, color: 'var(--pm-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qualifications</div>
            {staff.qualifications.map((q, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '5px 0', borderBottom: i < staff.qualifications.length - 1 ? '1px solid var(--pm-border)' : 'none' }}>
                <Award size={13} style={{ color: 'var(--pm-primary)', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: '0.83rem' }}>{q}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="pm-card">
          <div className="pm-section-title" style={{ marginBottom: 12 }}>Leave Balances (Remaining — FY 2024)</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {Object.entries(staff.leaveBalance).map(([type, days]) => (
              <div key={type} style={{ flex: 1, minWidth: 100, background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: days < 5 ? 'var(--pm-danger)' : 'var(--pm-primary)' }}>{days}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--pm-text-muted)', textTransform: 'capitalize', marginTop: 2 }}>{type} Leave</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)' }}>days left</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceTab({ staff }) {
  const { present, late, absent, leave, total } = staff.attendanceStats;
  const pct = Math.round((present / total) * 100);
  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="pm-card">
          <div className="pm-section-header" style={{ marginBottom: 14 }}>
            <div className="pm-section-title">October 2024 — Attendance</div>
            <span style={{ fontSize: '0.8rem', color: pct >= 90 ? '#16a34a' : pct >= 75 ? '#d97706' : '#dc2626', fontWeight: 700 }}>{pct}% Attendance Rate</span>
          </div>
          {/* Summary chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'Present', value: present, color: '#16a34a', bg: '#dcfce7' },
              { label: 'Late', value: late, color: '#d97706', bg: '#fef3c7' },
              { label: 'Absent', value: absent, color: '#dc2626', bg: '#fee2e2' },
              { label: 'On Leave', value: leave, color: '#2563eb', bg: '#dbeafe' },
              { label: 'Working Days', value: total, color: 'var(--pm-text-muted)', bg: 'var(--pm-surface-2)' },
            ].map(c => (
              <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.color}40`, borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: c.color }}>{c.value}</div>
                <div style={{ fontSize: '0.68rem', color: c.color, fontWeight: 600 }}>{c.label}</div>
              </div>
            ))}
          </div>
          <AttendanceCalendar grid={staff.attendanceGrid} />
        </div>
      </div>
    </div>
  );
}

function WorkHistoryTab({ staff }) {
  return (
    <div className="pm-card">
      <div className="pm-section-title" style={{ marginBottom: 16 }}>Employment History at Parirenyatwa Maternity</div>
      <div style={{ position: 'relative', paddingLeft: 28 }}>
        {staff.workHistory.map((w, i) => (
          <div key={i} style={{ position: 'relative', paddingBottom: i < staff.workHistory.length - 1 ? 20 : 0 }}>
            {i < staff.workHistory.length - 1 && (
              <div style={{ position: 'absolute', left: -20, top: 22, width: 2, bottom: 0, background: 'var(--pm-border)' }} />
            )}
            <div style={{ position: 'absolute', left: -28, top: 4, width: 18, height: 18, borderRadius: '50%', background: i === 0 ? 'var(--pm-primary)' : '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={10} color="#fff" strokeWidth={2.5} />
            </div>
            <div style={{ background: i === 0 ? 'var(--pm-surface-2)' : 'transparent', border: `1px solid ${i === 0 ? 'var(--pm-primary)' : 'var(--pm-border)'}`, borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{w.position}</span>
                  {i === 0 && <span className="pm-badge pm-badge-info" style={{ marginLeft: 8, fontSize: '0.62rem' }}>Current</span>}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', whiteSpace: 'nowrap' }}>{w.from} — {w.to}</span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--pm-text-muted)', marginBottom: 4 }}>{w.department}</div>
              <div style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>{w.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrainingTab({ staff }) {
  return (
    <div className="pm-card">
      <div className="pm-section-title" style={{ marginBottom: 16 }}>Training & CPD Records</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {staff.training.map((t, i) => {
          const upcoming = t.status === 'upcoming';
          return (
            <div key={i} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 14px',
              background: upcoming ? '#fffbeb' : 'var(--pm-surface-2)',
              border: `1px solid ${upcoming ? '#fde68a' : 'var(--pm-border)'}`, borderRadius: 8,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: upcoming ? '#fef3c7' : '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <GraduationCap size={18} style={{ color: upcoming ? '#d97706' : '#4f46e5' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 2 }}>{t.course}</div>
                <div style={{ fontSize: '0.77rem', color: 'var(--pm-text-muted)' }}>{t.institution}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--pm-text-muted)' }}>{t.date}</div>
                <span className={`pm-badge ${upcoming ? 'pm-badge-warning' : 'pm-badge-success'}`} style={{ fontSize: '0.62rem', marginTop: 4, display: 'inline-block' }}>
                  {upcoming ? 'Upcoming' : 'Completed'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAFF DETAIL PAGE
// ─────────────────────────────────────────────────────────────────────────────

function StaffDetail({ staff, onBack }) {
  const [tab, setTab] = useState('personal');
  const [isDeactivateModal, setDeactivateModal] = useState(false);
  const { color } = ROLE[staff.role] || ROLE.support;

  const TABS = [
    { key: 'personal', label: 'Personal', icon: User },
    { key: 'employment', label: 'Employment', icon: Briefcase },
    { key: 'attendance', label: 'Attendance', icon: Calendar },
    { key: 'history', label: 'Work History', icon: Clock },
    { key: 'training', label: 'Training & CPD', icon: GraduationCap },
  ];

  return (
    <div>
      {/* Back */}
      <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={onBack} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <ChevronLeft size={16} /> Back to Staff
      </button>

      {/* Staff Header Card */}
      <div className="pm-card" style={{ marginBottom: 16, padding: '18px 20px', borderLeft: `4px solid ${color}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap' }}>
          <Avatar name={staff.name} role={staff.role} size={58} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{staff.name}</span>
              <StatusBadge status={staff.status} />
              <RoleTag role={staff.role} />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--pm-text-muted)', marginBottom: 6 }}>{staff.title} · {staff.department}</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>
              <span>🪪 {staff.id}</span>
              <span>📅 Joined: {staff.joinDate}</span>
              <span>🔄 {staff.shift}</span>
            </div>
          </div>
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
            <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Edit2 size={13} /> Edit
            </button>
            <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Mail size={13} /> Email
            </button>
            <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Printer size={13} /> Print ID
            </button>
            {staff.status === 'active' || staff.status === 'on-leave' ? (
              <button
                className="pm-btn pm-btn-sm"
                onClick={() => setDeactivateModal(true)}
                style={{ background: '#fee2e2', color: 'var(--pm-danger)', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: 5 }}
              >
                <UserX size={13} /> Deactivate
              </button>
            ) : (
              <button className="pm-btn pm-btn-primary pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <UserCheck size={13} /> Reactivate
              </button>
            )}
          </div>
        </div>

        {/* Quick attendance bar */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--pm-border)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Attendance (Oct)', value: `${staff.attendanceStats.present}/${staff.attendanceStats.total} days`, ok: true },
            { label: 'Leave Balance', value: `${staff.leaveBalance.annual} annual days`, ok: staff.leaveBalance.annual > 5 },
            { label: 'Qualifications', value: `${staff.qualifications.length} on file`, ok: true },
            { label: 'Training Records', value: `${staff.training.filter(t => t.status === 'completed').length} completed`, ok: true },
          ].map((q, i) => (
            <div key={i}>
              <div style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)', fontWeight: 600, marginBottom: 1 }}>{q.label}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: q.ok ? 'var(--pm-text)' : 'var(--pm-danger)' }}>{q.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Deactivate Confirmation Modal (inline) */}
      {isDeactivateModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div className="pm-card" style={{ maxWidth: 400, width: '100%', padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={20} color="var(--pm-danger)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Deactivate Staff Account</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--pm-text-muted)' }}>This will revoke system access</div>
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--pm-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
              Are you sure you want to deactivate <strong>{staff.name}</strong>'s account? They will lose access to the system immediately. This action is reversible.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={() => setDeactivateModal(false)}>Cancel</button>
              <button className="pm-btn pm-btn-sm" style={{ background: 'var(--pm-danger)', color: '#fff', border: 'none' }} onClick={() => setDeactivateModal(false)}>
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--pm-border)', marginBottom: 16, overflowX: 'auto' }}>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
              padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '0.83rem', fontWeight: tab === t.key ? 700 : 500,
              color: tab === t.key ? 'var(--pm-primary)' : 'var(--pm-text-muted)',
              borderBottom: tab === t.key ? '2px solid var(--pm-primary)' : '2px solid transparent', marginBottom: -2,
            }}>
              <Icon size={14} />{t.label}
            </button>
          );
        })}
      </div>

      {tab === 'personal'    && <PersonalTab staff={staff} />}
      {tab === 'employment'  && <EmploymentTab staff={staff} />}
      {tab === 'attendance'  && <AttendanceTab staff={staff} />}
      {tab === 'history'     && <WorkHistoryTab staff={staff} />}
      {tab === 'training'    && <TrainingTab staff={staff} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEAVE REQUEST CARD
// ─────────────────────────────────────────────────────────────────────────────

function LeaveCard({ req, onAction }) {
  const { color } = ROLE[req.role] || ROLE.support;
  const isPending = req.status === 'pending';
  return (
    <div style={{
      border: `1px solid ${isPending ? '#fde68a' : 'var(--pm-border)'}`,
      background: isPending ? '#fffdf5' : 'var(--pm-surface-2)',
      borderRadius: 8, padding: '11px 14px', marginBottom: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
        <Avatar name={req.staff} role={req.role} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.83rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{req.staff}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>{req.type} · {req.days} day{req.days !== 1 ? 's' : ''}</div>
        </div>
        <span className={`pm-badge ${isPending ? 'pm-badge-warning' : 'pm-badge-success'}`} style={{ fontSize: '0.62rem', flexShrink: 0 }}>
          {isPending ? 'Pending' : 'Approved'}
        </span>
      </div>
      <div style={{ fontSize: '0.77rem', color: 'var(--pm-text-muted)', marginBottom: 5 }}>
        📅 {req.from} → {req.to} · Submitted {req.submitted}
      </div>
      <div style={{ fontSize: '0.78rem', background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', borderRadius: 5, padding: '5px 8px', marginBottom: isPending ? 8 : 0, fontStyle: 'italic', color: 'var(--pm-text-muted)' }}>
        "{req.reason}"
      </div>
      {isPending && (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="pm-btn pm-btn-sm" style={{ flex: 1, background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
            onClick={() => onAction(req.id, 'approved')}>
            <CheckCircle size={12} /> Approve
          </button>
          <button className="pm-btn pm-btn-sm" style={{ flex: 1, background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
            onClick={() => onAction(req.id, 'rejected')}>
            <XCircle size={12} /> Reject
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT / NOTICE CARD
// ─────────────────────────────────────────────────────────────────────────────

const EVENT_CFG = {
  training:   { color: '#7c3aed', bg: '#f5f3ff', icon: GraduationCap, label: 'CPD / Training' },
  meeting:    { color: '#0284c7', bg: '#e0f2fe', icon: Users,          label: 'Meeting' },
  'new-staff':{ color: '#16a34a', bg: '#dcfce7', icon: UserPlus,       label: 'New Staff' },
  departure:  { color: '#64748b', bg: '#f1f5f9', icon: LogOut,         label: 'Departure' },
};

function EventCard({ event }) {
  const cfg = EVENT_CFG[event.type] || EVENT_CFG.meeting;
  const Icon = cfg.icon;
  return (
    <div style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--pm-border)' }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} style={{ color: cfg.color }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 1 }}>{event.title}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>
          📅 {event.date}{event.time ? ` · ${event.time}` : ''}
          {event.location && <span> · 📍 {event.location}</span>}
        </div>
        {event.note && <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 3, fontStyle: 'italic' }}>{event.note}</div>}
        {event.mandatory !== undefined && (
          <span className={`pm-badge ${event.mandatory ? 'pm-badge-danger' : 'pm-badge-neutral'}`} style={{ fontSize: '0.6rem', marginTop: 4, display: 'inline-block' }}>
            {event.mandatory ? 'Mandatory' : 'Optional'}
          </span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function StaffManagementPage({ user, onNavigate }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState(LEAVE_REQUESTS_INIT);

  const counts = useMemo(() => ({
    all:     STAFF.length,
    admin:   STAFF.filter(s => s.role === 'admin').length,
    doctor:  STAFF.filter(s => s.role === 'doctor').length,
    midwife: STAFF.filter(s => s.role === 'midwife').length,
    nurse:   STAFF.filter(s => s.role === 'nurse').length,
    theatre: STAFF.filter(s => s.role === 'theatre').length,
    support: STAFF.filter(s => s.role === 'support').length,
  }), []);

  const departments = useMemo(() => ['all', ...Array.from(new Set(STAFF.map(s => s.department))).sort()], []);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return STAFF.filter(p =>
      (p.name.toLowerCase().includes(s) || p.id.toLowerCase().includes(s) || p.title.toLowerCase().includes(s)) &&
      (roleFilter === 'all' || p.role === roleFilter) &&
      (statusFilter === 'all' || p.status === statusFilter) &&
      (deptFilter === 'all' || p.department === deptFilter)
    );
  }, [search, roleFilter, statusFilter, deptFilter]);

  const pendingLeave = leaveRequests.filter(r => r.status === 'pending').length;

  function handleLeaveAction(id, action) {
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  }

  if (selected) return <StaffDetail staff={selected} onBack={() => setSelected(null)} />;

  return (
    <div>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Staff Management</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{STAFF.length} staff members on record · Parirenyatwa Group of Hospitals — Maternity Unit</div>
        </div>
        <button className="pm-btn pm-btn-primary pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <UserPlus size={14} /> Add Staff Member
        </button>
      </div>

      {/* RING STAT CARDS */}
      <div className="pm-card" style={{ padding: '14px 16px', marginBottom: 16 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--pm-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Staff by Role — Click to Filter</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {Object.entries(ROLE).map(([key, cfg]) => (
            <RingStatCard
              key={key}
              label={cfg.label}
              value={counts[key] ?? 0}
              color={cfg.color}
              icon={cfg.icon}
              active={roleFilter === key}
              onClick={() => setRoleFilter(prev => prev === key ? 'all' : key)}
            />
          ))}
        </div>
      </div>

      {/* MAIN CONTENT — Staff List + Notices */}
      <div className="row g-3">

        {/* ── LEFT: Staff List ── */}
        <div className="col-12 col-xl-8">
          <div className="pm-card">
            {/* Search + Filters */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ position: 'relative', marginBottom: 10 }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)' }} />
                <input
                  type="text" placeholder="Search by name, staff ID, or job title…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--pm-border)', borderRadius: 8, background: 'var(--pm-surface-2)', fontSize: '0.85rem', outline: 'none', color: 'var(--pm-text)', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Status filter */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {[{ k: 'all', l: 'All Status' }, { k: 'active', l: 'Active' }, { k: 'on-leave', l: 'On Leave' }, { k: 'inactive', l: 'Inactive' }].map(f => (
                    <button key={f.k} onClick={() => setStatusFilter(f.k)}
                      className={`pm-btn pm-btn-sm ${statusFilter === f.k ? 'pm-btn-primary' : 'pm-btn-ghost'}`}
                      style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                      {f.l}
                    </button>
                  ))}
                </div>
                {/* Dept filter */}
                <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{
                  padding: '5px 10px', border: '1px solid var(--pm-border)', borderRadius: 6,
                  background: 'var(--pm-surface-2)', fontSize: '0.78rem', color: 'var(--pm-text)', cursor: 'pointer',
                }}>
                  {departments.map(d => <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>)}
                </select>
                {(search || roleFilter !== 'all' || statusFilter !== 'all' || deptFilter !== 'all') && (
                  <button className="pm-btn pm-btn-ghost pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}
                    onClick={() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all'); setDeptFilter('all'); }}>
                    <X size={12} /> Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Results count */}
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginBottom: 8 }}>
              Showing {filtered.length} of {STAFF.length} staff members
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="pm-table">
                <thead>
                  <tr>
                    <th>STAFF MEMBER</th><th>ID</th><th>ROLE</th><th>DEPARTMENT</th>
                    <th>SHIFT</th><th>STATUS</th><th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--pm-text-muted)' }}>
                        <Search size={28} style={{ opacity: 0.2, display: 'block', margin: '0 auto 8px' }} />
                        No staff members match your search
                      </td>
                    </tr>
                  ) : filtered.map(s => (
                    <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(s)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar name={s.name} role={s.role} size={34} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{s.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>{s.title}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--pm-text-muted)' }}>{s.id}</td>
                      <td><RoleTag role={s.role} /></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--pm-text-muted)', maxWidth: 160 }}>{s.department}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', whiteSpace: 'nowrap' }}>{s.shift.split('(')[0].trim()}</td>
                      <td><StatusBadge status={s.status} /></td>
                      <td>
                        <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={e => { e.stopPropagation(); setSelected(s); }} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}>
                          View <ArrowRight size={11} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Notices Panel ── */}
        <div className="col-12 col-xl-4 d-flex flex-column gap-3">

          {/* Leave Requests */}
          <div className="pm-card">
            <div className="pm-section-header" style={{ marginBottom: 12 }}>
              <div>
                <div className="pm-section-title">Leave Requests</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)' }}>{pendingLeave} pending approval</div>
              </div>
              {pendingLeave > 0 && (
                <span style={{ background: '#fee2e2', color: 'var(--pm-danger)', borderRadius: 12, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
                  {pendingLeave} Pending
                </span>
              )}
            </div>
            {leaveRequests.map(req => (
              <LeaveCard key={req.id} req={req} onAction={handleLeaveAction} />
            ))}
          </div>

          {/* Events & Notices */}
          <div className="pm-card">
            <div className="pm-section-header" style={{ marginBottom: 4 }}>
              <div>
                <div className="pm-section-title">Events & Notices</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)' }}>Upcoming staff activities</div>
              </div>
              <button className="pm-btn pm-btn-primary pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem' }}>
                <Bell size={12} /> Post Notice
              </button>
            </div>
            {EVENTS.map(ev => <EventCard key={ev.id} event={ev} />)}
            {/* Legend */}
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--pm-border)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(EVENT_CFG).map(([k, v]) => {
                const Icon = v.icon;
                return (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: v.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={9} style={{ color: v.color }} />
                    </div>
                    <span style={{ fontSize: '0.67rem', color: 'var(--pm-text-muted)' }}>{v.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}