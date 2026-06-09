import React, { useState, useMemo } from 'react';
import {
  ChevronLeft, AlertTriangle, CheckCircle, Clock, Search, X,
  Filter, Plus, Wrench, Lightbulb, Droplets, Monitor, Wind,
  Zap, Package, ArrowRight, Calendar, User, MapPin, Tag,
  Camera, Edit3, ChevronDown, ChevronUp, Bell, Tool,
  RefreshCw, Eye, FileText, TrendingUp, AlertCircle,
  CheckSquare, XCircle, Circle, Building2, Activity,
  Thermometer, Settings, Image, Upload, Clipboard, Hash
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — Fault categories, statuses, priorities
// ─────────────────────────────────────────────────────────────────────────────

const FAULT_CATEGORY = {
  electrical:  { label: 'Electrical',       color: '#f59e0b', light: '#fffbeb', icon: Zap },
  plumbing:    { label: 'Plumbing',          color: '#0d9488', light: '#f0fdfa', icon: Droplets },
  equipment:   { label: 'Medical Equipment', color: '#dc2626', light: '#fef2f2', icon: Activity },
  hvac:        { label: 'HVAC / Ventilation',color: '#6366f1', light: '#eef2ff', icon: Wind },
  lighting:    { label: 'Lighting',          color: '#eab308', light: '#fefce8', icon: Lightbulb },
  structural:  { label: 'Structural',        color: '#78716c', light: '#fafaf9', icon: Building2 },
  it:          { label: 'IT & Comms',        color: '#8b5cf6', light: '#f5f3ff', icon: Monitor },
  other:       { label: 'Other',             color: '#64748b', light: '#f8fafc', icon: Package },
};

const FAULT_STATUS = {
  open:        { label: 'Open',           color: '#dc2626', bg: '#fee2e2',  icon: AlertCircle },
  inprogress:  { label: 'In Progress',    color: '#d97706', bg: '#fef3c7',  icon: RefreshCw },
  pending:     { label: 'Pending Parts',  color: '#7c3aed', bg: '#f3e8ff',  icon: Clock },
  resolved:    { label: 'Resolved',       color: '#16a34a', bg: '#dcfce7',  icon: CheckCircle },
  closed:      { label: 'Closed',         color: '#64748b', bg: '#f1f5f9',  icon: CheckSquare },
};

const FAULT_PRIORITY = {
  critical:  { label: 'Critical',  color: '#dc2626', bg: '#fee2e2' },
  high:      { label: 'High',      color: '#ea580c', bg: '#fff7ed' },
  medium:    { label: 'Medium',    color: '#d97706', bg: '#fef3c7' },
  low:       { label: 'Low',       color: '#16a34a', bg: '#dcfce7' },
};

// ─────────────────────────────────────────────────────────────────────────────
// MAINTENANCE NOTICES
// ─────────────────────────────────────────────────────────────────────────────

const MAINTENANCE_NOTICES = [
  {
    id: 'MN-001',
    type: 'planned',
    title: 'Generator B Full Service',
    description: 'Annual servicing of Backup Generator Unit B (Ground Floor Plant Room). Power will be routed via Generator A. Minimal disruption expected.',
    scheduledDate: '15 Nov 2024',
    time: '06:00 – 10:00',
    affectedAreas: ['Ground Floor', 'Admissions'],
    assignedTo: 'ProTech Engineering Ltd',
    contactPerson: 'Mr. Brighton Dube',
    contactPhone: '+263 77 811 2233',
    postedBy: 'Eng. Farai Ncube',
    postedDate: '01 Nov 2024',
    status: 'upcoming',
    priority: 'high',
  },
  {
    id: 'MN-002',
    type: 'completed',
    title: 'Central AC Unit — Compressor Replaced',
    description: 'Compressor on the 2nd floor central air conditioning unit was replaced with a new Hitachi unit. System tested and running at optimal performance. Refrigerant recharge also completed.',
    scheduledDate: '28 Oct 2024',
    time: '08:00 – 14:00',
    affectedAreas: ['Second Floor', 'HDU', 'Ward B'],
    assignedTo: 'CoolBreeze HVAC Services',
    contactPerson: 'Mr. Tinashe Moyo',
    contactPhone: '+263 71 922 3344',
    postedBy: 'Eng. Farai Ncube',
    postedDate: '25 Oct 2024',
    completedDate: '28 Oct 2024',
    status: 'completed',
    priority: 'critical',
  },
  {
    id: 'MN-003',
    type: 'planned',
    title: 'Theatre Plumbing — Scrub Room Sink Replacement',
    description: 'Both scrub room sinks in OR 1 and OR 2 to be replaced with sensor-activated stainless steel units as per infection control upgrade plan. Theatre will be out of service during works.',
    scheduledDate: '20 Nov 2024',
    time: '07:00 – 17:00',
    affectedAreas: ['First Floor', 'Operating Theatre', 'OR 1', 'OR 2'],
    assignedTo: 'Premier Plumbing Zimbabwe',
    contactPerson: 'Ms. Rutendo Chikwanda',
    contactPhone: '+263 77 633 4455',
    postedBy: 'Sr. Memory Murewa',
    postedDate: '04 Nov 2024',
    status: 'upcoming',
    priority: 'high',
  },
  {
    id: 'MN-004',
    type: 'completed',
    title: 'Fire Alarm Panel — Routine Inspection',
    description: 'Annual fire alarm panel test and sensor battery replacement completed by certified fire safety engineer. All zones tested. One faulty smoke sensor in Ward C storeroom replaced.',
    scheduledDate: '05 Nov 2024',
    time: '09:00 – 11:30',
    affectedAreas: ['All Floors'],
    assignedTo: 'FireSafe Zimbabwe',
    contactPerson: 'Mr. Arnold Sibanda',
    contactPhone: '+263 71 744 5566',
    postedBy: 'Eng. Farai Ncube',
    postedDate: '30 Oct 2024',
    completedDate: '05 Nov 2024',
    status: 'completed',
    priority: 'medium',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FAULT REPORTS DATA
// ─────────────────────────────────────────────────────────────────────────────

const FAULTS = [
  {
    id: 'FLT-001',
    title: 'Delivery Room 3 — Overhead Surgical Light Flickering',
    category: 'electrical',
    priority: 'critical',
    status: 'inprogress',
    location: { floor: 'First Floor', ward: 'Delivery Wing', room: 'Delivery Room 3', unit: '1F-DR3' },
    description: 'The main overhead surgical light in DR3 has been flickering intermittently since 06:30. The issue worsens when the side arm lamp is adjusted. Risk of electrical failure during an active delivery. Delivery room has been temporarily taken out of service pending repair.',
    reportedBy: { name: 'Sr. Agnes Dube', id: 'STF-017', role: 'Sister-in-Charge' },
    reportedDate: '2024-11-06',
    reportedTime: '06:47',
    assignedTo: 'Maintenance Team — Electrician on duty',
    assignedDate: '2024-11-06',
    estimatedCompletion: '2024-11-06',
    lastUpdated: '2024-11-06 08:15',
    updates: [
      { time: '06:47', by: 'Sr. Agnes Dube', note: 'Fault reported. DR3 taken out of service. Patients rerouted to DR4 and DR5.' },
      { time: '07:30', by: 'Admin Office', note: 'Assigned to duty electrician — Mr. Blessing Mutumbu.' },
      { time: '08:15', by: 'Mr. Blessing Mutumbu', note: 'Initial inspection done. Faulty ballast unit suspected. Replacement ballast being sourced from stores.' },
    ],
    faultImages: ['fault_dr3_light_1.jpg', 'fault_dr3_light_2.jpg'],
    repairImages: [],
    tags: ['surgical-light', 'electrical', 'urgent', 'delivery-room'],
    cost: null,
    partsRequired: ['Ballast Unit — Philips 400W Medical Grade'],
  },
  {
    id: 'FLT-002',
    title: 'Ground Floor Toilet Block — Two Sinks Not Draining',
    category: 'plumbing',
    priority: 'high',
    status: 'open',
    location: { floor: 'Ground Floor', ward: 'Patient Amenities', room: 'Toilet Block B (Corridor 2)', unit: 'GF-WC-B' },
    description: 'Sinks 2 and 3 in the ground floor patient toilet block are completely blocked and not draining. Water is pooling in both basins. The area has an unpleasant odour. The issue was first noticed by the cleaning staff during the morning routine at 05:30.',
    reportedBy: { name: 'Mr. Samuel Gumbo', id: 'STF-042', role: 'Head of Housekeeping' },
    reportedDate: '2024-11-06',
    reportedTime: '05:55',
    assignedTo: null,
    assignedDate: null,
    estimatedCompletion: null,
    lastUpdated: '2024-11-06 05:55',
    updates: [
      { time: '05:55', by: 'Mr. Samuel Gumbo', note: 'Fault logged. Sinks 2 and 3 out of service. Signage placed. Awaiting assignment to plumber.' },
    ],
    faultImages: ['fault_gf_sink_1.jpg'],
    repairImages: [],
    tags: ['sink', 'drain', 'plumbing', 'hygiene'],
    cost: null,
    partsRequired: [],
  },
  {
    id: 'FLT-003',
    title: 'Ward C — CTG Machine (Unit 3C-CTG2) Not Powering On',
    category: 'equipment',
    priority: 'critical',
    status: 'pending',
    location: { floor: 'Third Floor', ward: 'Antenatal Ward C', room: 'Bay 3', unit: '3F-WC' },
    description: 'CTG machine ID 3C-CTG2 failed to power on during the morning shift. The device shows no signs of life — no display, no response from power button. Battery backup indicator was completely flat. The ward is now operating with only one CTG machine (3C-CTG1). This is a significant risk given current occupancy of 8 monitored patients.',
    reportedBy: { name: 'Sr. Chipo Mutasa', id: 'STF-016', role: 'Floor Matron' },
    reportedDate: '2024-11-05',
    reportedTime: '07:12',
    assignedTo: 'Biomedical Engineering Dept.',
    assignedDate: '2024-11-05',
    estimatedCompletion: '2024-11-08',
    lastUpdated: '2024-11-05 15:30',
    updates: [
      { time: '07:12', by: 'Sr. Chipo Mutasa', note: 'Device failure reported. Escalated to Biomedical Engineering immediately.' },
      { time: '09:00', by: 'Biomed — Mr. Evans Chitiyo', note: 'Initial assessment completed. Power board fault suspected. Manufacturer (Philips) technical team contacted.' },
      { time: '15:30', by: 'Biomed — Mr. Evans Chitiyo', note: 'Awaiting Philips service engineer. Earliest available visit: Thursday 8 November. Loan unit has been requested from equipment pool.' },
    ],
    faultImages: ['fault_ctg_machine_1.jpg', 'fault_ctg_power_board.jpg'],
    repairImages: [],
    tags: ['CTG', 'medical-equipment', 'biomedical', 'patient-safety'],
    cost: null,
    partsRequired: ['Philips Avalon CTG — Power Board Assembly (Part No. PH-CTG-2210)'],
  },
  {
    id: 'FLT-004',
    title: 'Second Floor Corridor — 4 Fluorescent Light Tubes Out',
    category: 'lighting',
    priority: 'medium',
    status: 'resolved',
    location: { floor: 'Second Floor', ward: 'Main Corridor', room: 'Corridor 2A to 2B (15m stretch)', unit: '2F-CORR' },
    description: 'Four consecutive fluorescent light tubes are out along the main corridor linking Ward A to Ward B on the second floor. The area is dim during the night shift. A temporary floor-standing lamp has been placed as interim measure.',
    reportedBy: { name: 'Sr. Anesu Maposa', id: 'STF-019', role: 'Sister-in-Charge' },
    reportedDate: '2024-11-01',
    reportedTime: '20:40',
    assignedTo: 'Mr. Blessing Mutumbu',
    assignedDate: '2024-11-02',
    estimatedCompletion: '2024-11-02',
    lastUpdated: '2024-11-02 14:05',
    resolvedDate: '2024-11-02',
    updates: [
      { time: '20:40', by: 'Sr. Anesu Maposa', note: 'Reported 4 light tubes out. Interim floor lamp placed for safety.' },
      { time: '08:00', by: 'Admin Office', note: 'Assigned to electrician Mr. Mutumbu for day shift.' },
      { time: '14:05', by: 'Mr. Blessing Mutumbu', note: 'All 4 tubes replaced with Philips T8 36W units. Corridor lighting confirmed fully restored.' },
    ],
    faultImages: ['fault_2f_lights_1.jpg'],
    repairImages: ['repair_2f_lights_done.jpg'],
    tags: ['lighting', 'corridor', 'tubes'],
    cost: 45.00,
    partsRequired: ['Philips T8 36W Fluorescent Tube x4'],
    resolvedBy: 'Mr. Blessing Mutumbu',
  },
  {
    id: 'FLT-005',
    title: 'ANC Waiting Area — Air Conditioner Making Loud Noise',
    category: 'hvac',
    priority: 'medium',
    status: 'inprogress',
    location: { floor: 'Ground Floor', ward: 'Antenatal Clinic', room: 'ANC Waiting Lounge', unit: 'GF-ANC' },
    description: 'The split unit air conditioner in the ANC waiting area is producing a loud rattling noise from the indoor unit. The noise has been ongoing for 3 days. The unit is still cooling but the noise is disturbing to waiting patients. Possible loose fan blade or debris in the unit.',
    reportedBy: { name: 'Ms. Tsitsi Banda', id: 'STF-028', role: 'ANC Receptionist' },
    reportedDate: '2024-11-03',
    reportedTime: '09:15',
    assignedTo: 'CoolBreeze HVAC Services',
    assignedDate: '2024-11-04',
    estimatedCompletion: '2024-11-07',
    lastUpdated: '2024-11-04 10:30',
    updates: [
      { time: '09:15', by: 'Ms. Tsitsi Banda', note: 'Loud rattling noise from AC unit reported. Patients complaining.' },
      { time: '10:30', by: 'Admin Office', note: 'Logged. CoolBreeze HVAC contacted — technician scheduled for 4 November.' },
      { time: '10:30', by: 'CoolBreeze HVAC', note: 'Technician will attend 4 November AM. Remote diagnostic suggests loose fan assembly.' },
    ],
    faultImages: [],
    repairImages: [],
    tags: ['HVAC', 'AC', 'noise', 'ANC'],
    cost: null,
    partsRequired: [],
  },
  {
    id: 'FLT-006',
    title: 'Ward B — Patient Bed Frame Broken (Bed B-14)',
    category: 'structural',
    priority: 'high',
    status: 'resolved',
    location: { floor: 'Second Floor', ward: 'Postnatal Ward B', room: 'Bay 2, Bed 14', unit: '2F-WB' },
    description: 'The adjustment mechanism on bed B-14 is broken — the backrest will not lock in position and collapses flat. The patient using the bed was moved to a spare bed. Bed B-14 has been marked out of service and moved to the corridor.',
    reportedBy: { name: 'Sr. Thandiwe Nyoni', id: 'STF-023', role: 'Ward Sister' },
    reportedDate: '2024-10-30',
    reportedTime: '14:20',
    assignedTo: 'Mr. Felix Munyoro — Maintenance',
    assignedDate: '2024-10-30',
    estimatedCompletion: '2024-10-31',
    lastUpdated: '2024-10-31 11:00',
    resolvedDate: '2024-10-31',
    updates: [
      { time: '14:20', by: 'Sr. Thandiwe Nyoni', note: 'Bed frame mechanism broken. Patient relocated. Bed taken out of service.' },
      { time: '15:00', by: 'Admin Office', note: 'Assigned to Mr. Munyoro — maintenance technician.' },
      { time: '11:00', by: 'Mr. Felix Munyoro', note: 'Backrest locking pin replaced. Mechanism tested and working correctly. Bed returned to service.' },
    ],
    faultImages: ['fault_bed_b14_1.jpg'],
    repairImages: ['repair_bed_b14_fixed.jpg'],
    tags: ['bed', 'furniture', 'postnatal', 'patient-safety'],
    cost: 12.50,
    partsRequired: ['Bed Backrest Locking Pin Assembly x1'],
    resolvedBy: 'Mr. Felix Munyoro',
  },
  {
    id: 'FLT-007',
    title: 'First Floor — Theatre Monitor Display Offline (1F-M2)',
    category: 'it',
    priority: 'high',
    status: 'open',
    location: { floor: 'First Floor', ward: 'Delivery Wing', room: 'Delivery Wing Corridor', unit: '1F-M2' },
    description: 'The delivery wing queue display monitor (Monitor 1F-M2) has been offline since the previous night. The screen shows a black display with a "No Signal" message. The connected media player appears to be on but is not sending output. This disrupts the queue management display for the delivery wing waiting area.',
    reportedBy: { name: 'Sr. Memory Murewa', id: 'STF-018', role: 'Floor Matron' },
    reportedDate: '2024-11-05',
    reportedTime: '07:30',
    assignedTo: null,
    assignedDate: null,
    estimatedCompletion: null,
    lastUpdated: '2024-11-05 07:30',
    updates: [
      { time: '07:30', by: 'Sr. Memory Murewa', note: 'Monitor offline. Queue display not functional. IT department notified.' },
    ],
    faultImages: ['fault_monitor_1fm2.jpg'],
    repairImages: [],
    tags: ['IT', 'monitor', 'display', 'queue-system'],
    cost: null,
    partsRequired: [],
  },
  {
    id: 'FLT-008',
    title: 'Third Floor Sluice Room — Tap Dripping Constantly',
    category: 'plumbing',
    priority: 'low',
    status: 'closed',
    location: { floor: 'Third Floor', ward: 'Antenatal Ward C', room: 'Sluice Room 3A', unit: '3F-WC-SLUICE' },
    description: 'The cold water tap in the 3rd floor sluice room has been dripping constantly for over a week. Washer replacement needed. Non-urgent but wasteful.',
    reportedBy: { name: 'Ms. Violet Chikomba', id: 'STF-034', role: 'Enrolled Nurse' },
    reportedDate: '2024-10-22',
    reportedTime: '11:00',
    assignedTo: 'Mr. Felix Munyoro — Maintenance',
    assignedDate: '2024-10-22',
    estimatedCompletion: '2024-10-25',
    lastUpdated: '2024-10-24 09:30',
    resolvedDate: '2024-10-24',
    updates: [
      { time: '11:00', by: 'Ms. Violet Chikomba', note: 'Dripping tap reported.' },
      { time: '09:30', by: 'Mr. Felix Munyoro', note: 'Tap washer and O-ring replaced. No more drip. Tap working correctly.' },
    ],
    faultImages: [],
    repairImages: [],
    tags: ['tap', 'drip', 'washer', 'low-priority'],
    cost: 2.00,
    partsRequired: ['Tap Washer x1', 'O-Ring x1'],
    resolvedBy: 'Mr. Felix Munyoro',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = FAULT_STATUS[status];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: cfg.bg, color: cfg.color,
      borderRadius: 6, padding: '2px 9px', fontSize: '0.72rem', fontWeight: 700,
    }}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const cfg = FAULT_PRIORITY[priority];
  if (!cfg) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: cfg.bg, color: cfg.color,
      borderRadius: 6, padding: '2px 9px', fontSize: '0.72rem', fontWeight: 700,
      border: `1px solid ${cfg.color}30`,
    }}>
      {cfg.label}
    </span>
  );
}

function CategoryTag({ category }) {
  const cfg = FAULT_CATEGORY[category];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: cfg.light, color: cfg.color,
      borderRadius: 6, padding: '2px 9px', fontSize: '0.72rem', fontWeight: 600,
    }}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
}

function ImagePlaceholder({ label, isRepair }) {
  return (
    <div style={{
      width: 100, height: 75, borderRadius: 8,
      background: isRepair ? '#dcfce7' : '#fee2e2',
      border: `1px dashed ${isRepair ? '#16a34a' : '#dc2626'}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 4, cursor: 'pointer', flexShrink: 0,
    }}>
      <Image size={18} style={{ color: isRepair ? '#16a34a' : '#dc2626', opacity: 0.6 }} />
      <span style={{ fontSize: '0.6rem', color: isRepair ? '#16a34a' : '#dc2626', textAlign: 'center', lineHeight: 1.2, maxWidth: 80, opacity: 0.8 }}>
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAINTENANCE NOTICE CARD
// ─────────────────────────────────────────────────────────────────────────────

function MaintenanceNoticeCard({ notice }) {
  const [expanded, setExpanded] = useState(false);
  const isCompleted = notice.status === 'completed';

  const typeStyle = isCompleted
    ? { color: '#16a34a', bg: '#dcfce7', label: 'Completed' }
    : { color: '#7c3aed', bg: '#f3e8ff', label: 'Planned' };

  const priorityMap = {
    critical: { color: '#dc2626', bg: '#fee2e2' },
    high:     { color: '#d97706', bg: '#fef3c7' },
    medium:   { color: '#6366f1', bg: '#eef2ff' },
  };
  const pCfg = priorityMap[notice.priority] || priorityMap.medium;

  return (
    <div style={{
      border: `1px solid ${isCompleted ? '#bbf7d0' : '#ddd6fe'}`,
      borderLeft: `3px solid ${isCompleted ? '#16a34a' : '#7c3aed'}`,
      borderRadius: 10, padding: '12px 14px',
      background: isCompleted ? '#f0fdf4' : '#faf5ff',
      marginBottom: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ background: typeStyle.bg, color: typeStyle.color, borderRadius: 5, padding: '1px 8px', fontSize: '0.68rem', fontWeight: 700 }}>
              {typeStyle.label}
            </span>
            <span style={{ background: pCfg.bg, color: pCfg.color, borderRadius: 5, padding: '1px 8px', fontSize: '0.68rem', fontWeight: 600 }}>
              {FAULT_PRIORITY[notice.priority]?.label}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>{notice.id}</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.84rem', marginBottom: 4 }}>{notice.title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Calendar size={11} /> {notice.scheduledDate} · {notice.time}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Wrench size={11} /> {notice.assignedTo}
            </span>
          </div>
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--pm-text-muted)' }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--pm-border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--pm-text)', marginBottom: 8, lineHeight: 1.55 }}>
            {notice.description}
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.73rem' }}>
            <div>
              <div style={{ color: 'var(--pm-text-muted)', marginBottom: 2 }}>Affected Areas</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {notice.affectedAreas.map(a => (
                  <span key={a} style={{ background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', borderRadius: 4, padding: '1px 6px', fontSize: '0.68rem', fontWeight: 600 }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--pm-text-muted)', marginBottom: 2 }}>Contact</div>
              <div style={{ fontWeight: 600 }}>{notice.contactPerson} — {notice.contactPhone}</div>
            </div>
            <div>
              <div style={{ color: 'var(--pm-text-muted)', marginBottom: 2 }}>Posted By</div>
              <div style={{ fontWeight: 600 }}>{notice.postedBy} · {notice.postedDate}</div>
            </div>
            {notice.completedDate && (
              <div>
                <div style={{ color: 'var(--pm-text-muted)', marginBottom: 2 }}>Completed</div>
                <div style={{ color: '#16a34a', fontWeight: 700 }}>{notice.completedDate}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAULT DETAIL VIEW
// ─────────────────────────────────────────────────────────────────────────────

function FaultDetailView({ fault, onBack, onUpdate }) {
  const [editStatus, setEditStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(fault.status);
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);

  const catCfg = FAULT_CATEGORY[fault.category];
  const CatIcon = catCfg?.icon || Package;

  function handleSaveStatus() {
    if (!newNote.trim()) return;
    setSaving(true);
    setTimeout(() => {
      onUpdate(fault.id, newStatus, newNote);
      setSaving(false);
      setEditStatus(false);
      setNewNote('');
    }, 600);
  }

  return (
    <div>
      {/* Back nav */}
      <button
        onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pm-text-muted)', fontWeight: 600, fontSize: '0.82rem', marginBottom: 14, padding: 0 }}>
        <ChevronLeft size={16} /> Back to Fault Reports
      </button>

      {/* Header card */}
      <div className="pm-card" style={{ padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
              <span style={{ fontWeight: 800, fontSize: '0.75rem', color: catCfg?.color, background: catCfg?.light, borderRadius: 6, padding: '2px 9px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CatIcon size={12} /> {catCfg?.label}
              </span>
              <StatusBadge status={fault.status} />
              <PriorityBadge priority={fault.priority} />
              <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', fontFamily: 'monospace', background: 'var(--pm-surface-2)', borderRadius: 4, padding: '2px 7px', border: '1px solid var(--pm-border)' }}>
                {fault.id}
              </span>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0 0 8px', lineHeight: 1.3 }}>{fault.title}</h2>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: '0.76rem', color: 'var(--pm-text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={12} /> {fault.location.floor} · {fault.location.ward} · {fault.location.room}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <User size={12} /> Reported by {fault.reportedBy.name} ({fault.reportedBy.role})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={12} /> {fault.reportedDate} at {fault.reportedTime}
              </span>
            </div>
          </div>
          <button
            onClick={() => setEditStatus(e => !e)}
            className="pm-btn pm-btn-primary pm-btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <Edit3 size={13} /> Update Status
          </button>
        </div>
      </div>

      {/* Status Update Panel */}
      {editStatus && (
        <div className="pm-card" style={{ padding: '16px 18px', marginBottom: 16, border: '2px solid var(--pm-primary)', background: '#fffbf0' }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Edit3 size={15} style={{ color: 'var(--pm-primary)' }} /> Update Fault Status
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {Object.entries(FAULT_STATUS).map(([k, v]) => {
              const Icon = v.icon;
              return (
                <button
                  key={k}
                  onClick={() => setNewStatus(k)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px',
                    border: `2px solid ${newStatus === k ? v.color : 'var(--pm-border)'}`,
                    borderRadius: 7, background: newStatus === k ? v.bg : 'var(--pm-surface)',
                    color: newStatus === k ? v.color : 'var(--pm-text-muted)',
                    fontWeight: newStatus === k ? 700 : 500, fontSize: '0.78rem', cursor: 'pointer',
                  }}>
                  <Icon size={12} /> {v.label}
                </button>
              );
            })}
          </div>
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="Add an update note (required)…"
            style={{
              width: '100%', minHeight: 80, padding: '8px 12px',
              border: '1px solid var(--pm-border)', borderRadius: 8,
              background: 'var(--pm-surface)', color: 'var(--pm-text)',
              fontSize: '0.82rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
            <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => { setEditStatus(false); setNewNote(''); }}>
              Cancel
            </button>
            <button
              className="pm-btn pm-btn-primary pm-btn-sm"
              onClick={handleSaveStatus}
              disabled={!newNote.trim() || saving}
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {saving ? <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={13} />}
              {saving ? 'Saving…' : 'Save Update'}
            </button>
          </div>
        </div>
      )}

      <div className="row g-3">
        {/* Left column */}
        <div className="col-12 col-lg-7">

          {/* Description */}
          <div className="pm-card" style={{ padding: '16px 18px', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={14} style={{ color: 'var(--pm-primary)' }} /> Fault Description
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--pm-text)', lineHeight: 1.65, margin: 0 }}>
              {fault.description}
            </p>
            {fault.partsRequired?.length > 0 && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--pm-border)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pm-text-muted)', marginBottom: 6 }}>PARTS REQUIRED</div>
                {fault.partsRequired.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: '0.78rem' }}>
                    <Package size={12} style={{ color: 'var(--pm-text-muted)', flexShrink: 0 }} /> {p}
                  </div>
                ))}
              </div>
            )}
            {fault.tags?.length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {fault.tags.map(t => (
                  <span key={t} style={{ background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', borderRadius: 4, padding: '1px 7px', fontSize: '0.67rem', color: 'var(--pm-text-muted)' }}>
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="pm-card" style={{ padding: '16px 18px', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Activity size={14} style={{ color: 'var(--pm-primary)' }} /> Activity Log
            </div>
            <div style={{ position: 'relative' }}>
              {fault.updates.map((u, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < fault.updates.length - 1 ? 14 : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--pm-primary)', flexShrink: 0, marginTop: 3 }} />
                    {i < fault.updates.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--pm-border)', marginTop: 4 }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: i < fault.updates.length - 1 ? 4 : 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--pm-text)' }}>{u.by}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)', background: 'var(--pm-surface-2)', borderRadius: 4, padding: '1px 6px', border: '1px solid var(--pm-border)' }}>
                        <Clock size={9} style={{ marginRight: 3 }} />{u.time}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', lineHeight: 1.5 }}>{u.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div className="pm-card" style={{ padding: '16px 18px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Camera size={14} style={{ color: 'var(--pm-primary)' }} /> Photos & Evidence
            </div>

            {/* Fault photos */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#dc2626', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Fault / Damage Photos
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                {fault.faultImages.length === 0
                  ? <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', fontStyle: 'italic' }}>No fault photos uploaded yet.</div>
                  : fault.faultImages.map((img, i) => <ImagePlaceholder key={i} label={img} isRepair={false} />)
                }
                <button style={{
                  width: 100, height: 75, borderRadius: 8,
                  border: '1px dashed var(--pm-border)', background: 'var(--pm-surface-2)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 4, cursor: 'pointer', color: 'var(--pm-text-muted)', flexShrink: 0,
                }}>
                  <Upload size={16} />
                  <span style={{ fontSize: '0.62rem', textAlign: 'center' }}>Upload Photo</span>
                </button>
              </div>
            </div>

            {/* Repair photos */}
            <div>
              <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#16a34a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Repair / Resolution Photos
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                {fault.repairImages.length === 0
                  ? <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', fontStyle: 'italic' }}>No repair photos yet. Add after repair is completed.</div>
                  : fault.repairImages.map((img, i) => <ImagePlaceholder key={i} label={img} isRepair={true} />)
                }
                <button style={{
                  width: 100, height: 75, borderRadius: 8,
                  border: '1px dashed var(--pm-border)', background: 'var(--pm-surface-2)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 4, cursor: 'pointer', color: 'var(--pm-text-muted)', flexShrink: 0,
                }}>
                  <Upload size={16} />
                  <span style={{ fontSize: '0.62rem', textAlign: 'center' }}>Upload Photo</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-12 col-lg-5">
          {/* Quick info */}
          <div className="pm-card" style={{ padding: '16px 18px', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 12 }}>Fault Details</div>
            {[
              { label: 'Report ID',         value: fault.id },
              { label: 'Reported By',       value: `${fault.reportedBy.name} (${fault.reportedBy.id})` },
              { label: 'Date Reported',     value: `${fault.reportedDate} at ${fault.reportedTime}` },
              { label: 'Floor',             value: fault.location.floor },
              { label: 'Ward / Area',       value: fault.location.ward },
              { label: 'Room / Unit',       value: fault.location.room },
              { label: 'Assigned To',       value: fault.assignedTo || '— Not yet assigned' },
              { label: 'Assigned Date',     value: fault.assignedDate || '—' },
              { label: 'Est. Completion',   value: fault.estimatedCompletion || '—' },
              { label: 'Last Updated',      value: fault.lastUpdated },
              ...(fault.resolvedDate ? [{ label: 'Resolved Date', value: fault.resolvedDate, highlight: true }] : []),
              ...(fault.resolvedBy ? [{ label: 'Resolved By', value: fault.resolvedBy, highlight: true }] : []),
              ...(fault.cost != null ? [{ label: 'Repair Cost', value: `$${fault.cost.toFixed(2)}`, highlight: true }] : []),
            ].map(({ label, value, highlight }, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', gap: 10,
                padding: '7px 0', borderBottom: '1px solid var(--pm-border)',
                fontSize: '0.78rem',
              }}>
                <span style={{ color: 'var(--pm-text-muted)', flexShrink: 0 }}>{label}</span>
                <span style={{ fontWeight: 600, textAlign: 'right', color: highlight ? '#16a34a' : 'var(--pm-text)' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Category + Priority */}
          <div className="pm-card" style={{ padding: '16px 18px', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 12 }}>Classification</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <CategoryTag category={fault.category} />
              <StatusBadge status={fault.status} />
              <PriorityBadge priority={fault.priority} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color, icon: Icon, alert }) {
  return (
    <div className="pm-stat-card secondary" style={{
      borderLeft: `3px solid ${color}`,
      ...(alert ? { border: `1px solid ${color}`, borderLeft: `3px solid ${color}` } : {}),
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Icon size={18} style={{ color }} />
        {alert && value > 0 && (
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'block', boxShadow: `0 0 0 3px ${color}30` }} />
        )}
      </div>
      <div className="pm-card-title" style={{ fontSize: '0.73rem' }}>{label}</div>
      <div className="pm-stat-value" style={{ fontSize: '1.9rem', color }}>{value}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FAULT REPORTS PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function FaultReportsPage({ user, onNavigate }) {
  const [selectedFault, setSelectedFault] = useState(null);
  const [faults, setFaults] = useState(FAULTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [showNotices, setShowNotices] = useState(true);

  // Stats
  const stats = useMemo(() => {
    const total = faults.length;
    const open = faults.filter(f => f.status === 'open').length;
    const inprogress = faults.filter(f => f.status === 'inprogress').length;
    const pending = faults.filter(f => f.status === 'pending').length;
    const resolved = faults.filter(f => f.status === 'resolved' || f.status === 'closed').length;
    const critical = faults.filter(f => f.priority === 'critical').length;
    const byCategory = Object.fromEntries(
      Object.keys(FAULT_CATEGORY).map(k => [k, faults.filter(f => f.category === k).length])
    );
    return { total, open, inprogress, pending, resolved, critical, byCategory };
  }, [faults]);

  // Filtered + sorted faults
  const filtered = useMemo(() => {
    let result = faults.filter(f => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        f.id.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.reportedBy.name.toLowerCase().includes(q) ||
        f.location.ward.toLowerCase().includes(q) ||
        f.location.floor.toLowerCase().includes(q) ||
        f.location.room.toLowerCase().includes(q) ||
        (f.assignedTo || '').toLowerCase().includes(q) ||
        f.tags.some(t => t.toLowerCase().includes(q));
      const matchStatus = statusFilter === 'all' || f.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || f.category === categoryFilter;
      const matchPriority = priorityFilter === 'all' || f.priority === priorityFilter;
      const matchFloor = floorFilter === 'all' || f.location.floor === floorFilter;
      return matchSearch && matchStatus && matchCategory && matchPriority && matchFloor;
    });

    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const statusOrder = { open: 0, inprogress: 1, pending: 2, resolved: 3, closed: 4 };

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':  return b.reportedDate.localeCompare(a.reportedDate);
        case 'date_asc':   return a.reportedDate.localeCompare(b.reportedDate);
        case 'priority':   return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
        case 'status':     return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
        case 'reporter':   return a.reportedBy.name.localeCompare(b.reportedBy.name);
        case 'floor':      return a.location.floor.localeCompare(b.location.floor);
        default:           return 0;
      }
    });
    return result;
  }, [faults, search, statusFilter, categoryFilter, priorityFilter, floorFilter, sortBy]);

  const floors = useMemo(() => ['all', ...new Set(faults.map(f => f.location.floor))], [faults]);

  function handleUpdate(id, newStatus, note) {
    setFaults(prev => prev.map(f => {
      if (f.id !== id) return f;
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      return {
        ...f,
        status: newStatus,
        lastUpdated: `${f.reportedDate} ${timeStr}`,
        updates: [...f.updates, { time: timeStr, by: user?.name || 'Admin', note }],
        ...(newStatus === 'resolved' ? { resolvedDate: f.reportedDate, resolvedBy: user?.name || 'Admin' } : {}),
      };
    }));
  }

  // ── If a fault is selected, show detail view ──
  if (selectedFault) {
    const liveFault = faults.find(f => f.id === selectedFault.id) || selectedFault;
    return (
      <FaultDetailView
        fault={liveFault}
        onBack={() => setSelectedFault(null)}
        onUpdate={(id, status, note) => {
          handleUpdate(id, status, note);
          setSelectedFault(prev => faults.find(f => f.id === prev.id) || prev);
        }}
      />
    );
  }

  const hasActiveFilters = search || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all' || floorFilter !== 'all';
  const clearFilters = () => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); setPriorityFilter('all'); setFloorFilter('all'); };

  return (
    <div>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Fault Reports</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>
            Parirenyatwa Group of Hospitals — Maternity Unit · Fault Tracking & Maintenance Management
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="pm-btn pm-btn-outline pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Bell size={13} /> Notices
          </button>
          <button className="pm-btn pm-btn-primary pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Plus size={13} /> Log Fault
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Reports',    value: stats.total,      sub: 'All time', color: '#6366f1', icon: Clipboard, alert: false },
          { label: 'Open Faults',      value: stats.open,       sub: 'Awaiting assignment', color: '#dc2626', icon: AlertCircle, alert: stats.open > 0 },
          { label: 'In Progress',      value: stats.inprogress, sub: 'Being worked on', color: '#d97706', icon: RefreshCw, alert: false },
          { label: 'Pending Parts',    value: stats.pending,    sub: 'Awaiting materials', color: '#7c3aed', icon: Clock, alert: stats.pending > 0 },
          { label: 'Resolved / Closed',value: stats.resolved,   sub: 'Completed repairs', color: '#16a34a', icon: CheckCircle, alert: false },
          { label: 'Critical Priority',value: stats.critical,   sub: 'Urgent attention needed', color: '#be123c', icon: AlertTriangle, alert: stats.critical > 0 },
        ].map((s, i) => (
          <div key={i} className="col-6 col-md-4 col-xl-2">
            <StatCard {...s} />
          </div>
        ))}
      </div>

      {/* ── Category Breakdown Bar ── */}
      <div className="pm-card" style={{ padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Faults by Category</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>{stats.total} total reports</span>
        </div>
        <div style={{ display: 'flex', height: 10, borderRadius: 6, overflow: 'hidden', background: '#e5e7eb', marginBottom: 10 }}>
          {Object.entries(FAULT_CATEGORY).map(([key, cfg]) => {
            const count = stats.byCategory[key] || 0;
            const pct = stats.total ? (count / stats.total) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div key={key} title={`${cfg.label}: ${count}`} style={{ width: `${pct}%`, background: cfg.color, height: '100%', cursor: 'pointer', transition: 'opacity 0.15s' }}
                onClick={() => setCategoryFilter(categoryFilter === key ? 'all' : key)} />
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {Object.entries(FAULT_CATEGORY).map(([key, cfg]) => {
            const count = stats.byCategory[key] || 0;
            if (count === 0) return null;
            const Icon = cfg.icon;
            return (
              <button key={key} onClick={() => setCategoryFilter(categoryFilter === key ? 'all' : key)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, background: categoryFilter === key ? cfg.light : 'none', border: 'none', borderRadius: 6, padding: '2px 8px', cursor: 'pointer' }}>
                <div style={{ width: 9, height: 9, borderRadius: 2, background: cfg.color }} />
                <Icon size={11} style={{ color: cfg.color }} />
                <span style={{ fontSize: '0.71rem', color: 'var(--pm-text-muted)', fontWeight: categoryFilter === key ? 700 : 400 }}>
                  {cfg.label} ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Layout: Table + Notices ── */}
      <div className="row g-3">

        {/* ── LEFT: Fault Table ── */}
        <div className={`col-12 ${showNotices ? 'col-xl-8' : ''}`}>
          <div className="pm-card" style={{ padding: '16px 18px' }}>

            {/* Search + Sort + Filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)' }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by ID, title, reporter, ward, tag…"
                  style={{
                    width: '100%', padding: '7px 10px 7px 32px',
                    border: '1px solid var(--pm-border)', borderRadius: 8,
                    background: 'var(--pm-surface-2)', color: 'var(--pm-text)',
                    fontSize: '0.8rem', boxSizing: 'border-box',
                  }}
                />
              </div>
              {/* Sort */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
                padding: '6px 10px', border: '1px solid var(--pm-border)', borderRadius: 8,
                background: 'var(--pm-surface-2)', fontSize: '0.78rem', color: 'var(--pm-text)', cursor: 'pointer',
              }}>
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="priority">By Priority</option>
                <option value="status">By Status</option>
                <option value="reporter">By Reporter</option>
                <option value="floor">By Floor</option>
              </select>
            </div>

            {/* Filter row */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10, alignItems: 'center' }}>
              {/* Status */}
              {[{ k: 'all', l: 'All Status' }, ...Object.entries(FAULT_STATUS).map(([k, v]) => ({ k, l: v.label }))].map(f => (
                <button key={f.k} onClick={() => setStatusFilter(f.k)}
                  className={`pm-btn pm-btn-sm ${statusFilter === f.k ? 'pm-btn-primary' : 'pm-btn-ghost'}`}
                  style={{ fontSize: '0.72rem', padding: '3px 9px' }}>
                  {f.l}
                </button>
              ))}

              {/* Priority */}
              <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} style={{
                padding: '4px 9px', border: '1px solid var(--pm-border)', borderRadius: 6,
                background: 'var(--pm-surface-2)', fontSize: '0.75rem', color: 'var(--pm-text)', cursor: 'pointer',
              }}>
                <option value="all">All Priorities</option>
                {Object.entries(FAULT_PRIORITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>

              {/* Floor */}
              <select value={floorFilter} onChange={e => setFloorFilter(e.target.value)} style={{
                padding: '4px 9px', border: '1px solid var(--pm-border)', borderRadius: 6,
                background: 'var(--pm-surface-2)', fontSize: '0.75rem', color: 'var(--pm-text)', cursor: 'pointer',
              }}>
                {floors.map(f => <option key={f} value={f}>{f === 'all' ? 'All Floors' : f}</option>)}
              </select>

              {hasActiveFilters && (
                <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={clearFilters}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem' }}>
                  <X size={11} /> Clear
                </button>
              )}
            </div>

            <div style={{ fontSize: '0.73rem', color: 'var(--pm-text-muted)', marginBottom: 8 }}>
              Showing {filtered.length} of {faults.length} fault reports
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="pm-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>FAULT</th>
                    <th>CATEGORY</th>
                    <th>LOCATION</th>
                    <th>REPORTED BY</th>
                    <th>DATE</th>
                    <th>PRIORITY</th>
                    <th>STATUS</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--pm-text-muted)' }}>
                        <Search size={28} style={{ opacity: 0.2, display: 'block', margin: '0 auto 8px' }} />
                        No fault reports match your filters
                      </td>
                    </tr>
                  ) : filtered.map(f => {
                    const catCfg = FAULT_CATEGORY[f.category];
                    const CatIcon = catCfg?.icon || Package;
                    return (
                      <tr key={f.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedFault(f)}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, color: 'var(--pm-text-muted)', background: 'var(--pm-surface-2)', borderRadius: 4, padding: '1px 5px', border: '1px solid var(--pm-border)' }}>
                            {f.id}
                          </span>
                        </td>
                        <td style={{ maxWidth: 240 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {f.title}
                          </div>
                        </td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: catCfg?.light, color: catCfg?.color, borderRadius: 5, padding: '2px 7px', fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            <CatIcon size={10} /> {catCfg?.label}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', minWidth: 130 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--pm-text)' }}>{f.location.ward}</div>
                          <div style={{ fontSize: '0.7rem' }}>{f.location.floor}</div>
                        </td>
                        <td style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: 600 }}>{f.reportedBy.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)' }}>{f.reportedBy.role}</div>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', whiteSpace: 'nowrap' }}>
                          {f.reportedDate}
                        </td>
                        <td><PriorityBadge priority={f.priority} /></td>
                        <td><StatusBadge status={f.status} /></td>
                        <td>
                          <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={e => { e.stopPropagation(); setSelectedFault(f); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
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

        {/* ── RIGHT: Maintenance Notices Panel ── */}
        <div className="col-12 col-xl-4">

          {/* Status Summary mini-cards */}
          <div className="pm-card" style={{ padding: '14px 16px', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={14} style={{ color: 'var(--pm-primary)' }} /> Status Summary
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(FAULT_STATUS).map(([k, v]) => {
                const count = faults.filter(f => f.status === k).length;
                const Icon = v.icon;
                return (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: v.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={12} style={{ color: v.color }} />
                    </div>
                    <div style={{ flex: 1, height: 6, borderRadius: 4, background: '#e5e7eb', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.total ? (count / stats.total) * 100 : 0}%`, height: '100%', background: v.color, borderRadius: 4, transition: 'width 0.4s' }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: v.color, minWidth: 16, textAlign: 'right' }}>{count}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', minWidth: 80 }}>{v.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Maintenance Notices */}
          <div className="pm-card" style={{ padding: '14px 16px' }}>
            <div className="pm-section-header" style={{ marginBottom: 12 }}>
              <div>
                <div className="pm-section-title">Maintenance Notices</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--pm-text-muted)' }}>
                  {MAINTENANCE_NOTICES.filter(n => n.status === 'upcoming').length} upcoming · {MAINTENANCE_NOTICES.filter(n => n.status === 'completed').length} completed
                </div>
              </div>
              <button className="pm-btn pm-btn-primary pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem' }}>
                <Plus size={12} /> Add
              </button>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              {[{ label: 'Planned', color: '#7c3aed', bg: '#f3e8ff' }, { label: 'Completed', color: '#16a34a', bg: '#dcfce7' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: l.bg, border: `1px solid ${l.color}`, borderLeft: `3px solid ${l.color}` }} />
                  <span style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)' }}>{l.label}</span>
                </div>
              ))}
            </div>

            {MAINTENANCE_NOTICES.map(notice => (
              <MaintenanceNoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}