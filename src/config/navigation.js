/**
 * PARI MATERNITY — Navigation Configuration
 * ──────────────────────────────────────────
 * To add a new tab to any role: add an entry to the relevant array.
 * Each entry: { key, label, icon (lucide name string), path }
 * The 'path' is relative to the role's base route.
 */

export const NAV_CONFIG = {
  doctor: [
    { key: 'dashboard',    label: 'Dashboard',           icon: 'LayoutDashboard', path: '' },
    { key: 'theatre',      label: 'Theatre Scheduling',   icon: 'Calendar',        path: '/theatre' },
    { key: 'patients',     label: 'Patients',             icon: 'Users',           path: '/patients' },
    { key: 'labtests',     label: 'Lab Tests',            icon: 'FlaskConical',    path: '/lab-tests' },
    { key: 'prescriptions',label: 'Prescription Records', icon: 'Pill',            path: '/prescriptions' },
    { key: 'attendance',   label: 'Attendance Records',   icon: 'ClipboardList',   path: '/attendance' },
  ],
  admin: [
    { key: 'dashboard',    label: 'Dashboard',            icon: 'LayoutDashboard', path: '' },
    { key: 'staff',        label: 'Staff',                icon: 'UserCog',         path: '/staff' },
    { key: 'management',   label: 'Management',           icon: 'Building2',       path: '/management' },
    { key: 'patients',     label: 'Patient Records',      icon: 'FolderOpen',      path: '/patient-records' },
    { key: 'ward',         label: 'Ward Management',      icon: 'BedDouble',       path: '/ward-management' },
    { key: 'inventory',    label: 'Inventory',            icon: 'Package',         path: '/inventory' },
    { key: 'fault',        label: 'Fault Reports',        icon: 'AlertTriangle',   path: '/fault-reports' },
    { key: 'birth',        label: 'Birth Records',        icon: 'Baby',            path: '/birth-records' },
    { key: 'attendance',   label: 'Attendance Records',   icon: 'ClipboardList',   path: '/attendance' },
    { key: 'dispensary',   label: 'Dispensary Management',   icon: 'BriefcaseMedical',   path: '/dispensary' },
    { key: 'blood',   label: 'Blood Bank Management',   icon: 'Droplets',   path: '/blood-bank' },
    { key: 'suppliers',   label: 'Supplier Management',   icon: 'Van',   path: '/suppliers' },
    { key: 'insurance',   label: 'Insurance Management',   icon: 'WalletCards',   path: '/insurance' },

  ],
  patient: [
    { key: 'dashboard',    label: 'Dashboard',            icon: 'LayoutDashboard', path: '' },
    { key: 'prescriptions',label: 'Prescriptions',        icon: 'Pill',            path: '/prescriptions' },
    { key: 'notifications',label: 'Notifications',        icon: 'Bell',            path: '/notifications' },
    { key: 'history',      label: 'History',              icon: 'History',         path: '/history' },
    { key: 'scans',        label: 'Scans',                icon: 'ScanLine',        path: '/scans' },
    { key: 'myinfo',       label: 'My Information',       icon: 'UserCircle',      path: '/my-info' },
  ],
  birthRecord: [
    { key: 'dashboard',    label: 'Dashboard',            icon: 'LayoutDashboard', path: '' },
    { key: 'search',       label: 'Search Records',       icon: 'Search',          path: '/search' },
    { key: 'notifications',label: 'Notifications',        icon: 'Bell',            path: '/notifications' },
    { key: 'myinfo',       label: 'My Information',       icon: 'UserCircle',      path: '/my-info' },
  ],
};
