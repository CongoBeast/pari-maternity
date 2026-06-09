import React, { useState, useMemo } from 'react';
import {
  Users, Calendar, Clock, ChevronLeft, Search, X,
  ArrowUp, ArrowDown, ArrowUpDown, CheckCircle, XCircle,
  AlertTriangle, ChevronRight, ChevronDown, BarChart2,
  UserCheck, UserX, Timer, Umbrella, Filter, Eye,
  CalendarDays, TrendingUp, TrendingDown, Award, Briefcase,
  GraduationCap, FileText, Bell, ClipboardList, Info,
  Baby, Heart, Stethoscope, Activity, Wrench, Star
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// ROLE CONFIG  (mirrors StaffManagementPage)
// ─────────────────────────────────────────────────────────────────────────────

const ROLE = {
  all:     { label: 'All Staff',  color: '#6366f1', light: '#eef2ff', icon: Users },
  admin:   { label: 'Admin',      color: '#f59e0b', light: '#fffbeb', icon: Briefcase },
  doctor:  { label: 'Doctors',    color: '#7c3aed', light: '#f5f3ff', icon: Stethoscope },
  midwife: { label: 'Midwives',   color: '#ec4899', light: '#fdf2f8', icon: Baby },
  nurse:   { label: 'Nurses',     color: '#0d9488', light: '#f0fdfa', icon: Heart },
  theatre: { label: 'Theatre',    color: '#dc2626', light: '#fff1f2', icon: Activity },
  support: { label: 'Support',    color: '#64748b', light: '#f8fafc', icon: Wrench },
};

const ATT_CFG = {
  P:       { label: 'Present',  color: '#16a34a', bg: '#dcfce7', short: 'P' },
  T:       { label: 'Late',     color: '#d97706', bg: '#fef3c7', short: 'L' },
  A:       { label: 'Absent',   color: '#dc2626', bg: '#fee2e2', short: 'A' },
  L:       { label: 'Leave',    color: '#2563eb', bg: '#dbeafe', short: 'Lv' },
  weekend: { label: 'Weekend',  color: '#9ca3af', bg: '#f3f4f6', short: '—' },
};

// Oct 2024 weekend days
const OCT_WEEKENDS = new Set([5, 6, 12, 13, 19, 20, 26, 27]);
const WORKING_DAYS = Array.from({ length: 31 }, (_, i) => i + 1).filter(d => !OCT_WEEKENDS.has(d));

function buildGrid(overrides = {}) {
  return Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    if (OCT_WEEKENDS.has(day)) return { day, s: 'weekend' };
    return { day, s: overrides[day] || 'P' };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// LEAVE REQUESTS
// ─────────────────────────────────────────────────────────────────────────────

const LEAVE_REQUESTS_INIT = [
  { id: 'LR-001', staffId: 'STF-005', staffName: 'Sr. Memory Choto',      type: 'Annual',  from: '28 Oct', to: '31 Oct', days: 4, reason: 'Family vacation — booked in advance.',        status: 'approved', submitted: '20 Oct' },
  { id: 'LR-002', staffId: 'STF-002', staffName: 'Dr. Tendai Mutombwa',   type: 'Sick',    from: '21 Oct', to: '22 Oct', days: 2, reason: 'Acute gastroenteritis — doctor\'s note attached.', status: 'approved', submitted: '21 Oct' },
  { id: 'LR-003', staffId: 'STF-011', staffName: 'SN Rutendo Mhike',      type: 'Annual',  from: '04 Nov', to: '08 Nov', days: 5, reason: 'Attending sister\'s wedding in Mutare.',       status: 'pending',  submitted: '24 Oct' },
  { id: 'LR-004', staffId: 'STF-012', staffName: 'Mr. Simba Ncube',       type: 'Study',   from: '11 Nov', to: '15 Nov', days: 5, reason: 'NSSA accredited safety course — Bulawayo.',    status: 'pending',  submitted: '25 Oct' },
  { id: 'LR-005', staffId: 'STF-008', staffName: 'Sr. Anesu Murewa',      type: 'Annual',  from: '10 Oct', to: '10 Oct', days: 1, reason: 'Personal appointment — pre-arranged.',        status: 'approved', submitted: '05 Oct' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STAFF DATA (full roster)
// ─────────────────────────────────────────────────────────────────────────────

const STAFF = [
  {
    id: 'STF-001', name: 'Dr. Chipo Chigudu',    role: 'doctor',  status: 'active',
    title: 'OB/GYN Consultant', department: 'Obstetrics & Gynaecology', shift: 'Day (07:00–19:00)',
    leaveBalance: { annual: 18, sick: 5, study: 3 },
    attendanceStats: { present: 19, late: 1, absent: 0, leave: 0, total: 20 },
    attendanceGrid: buildGrid({ 15: 'T' }),
    leaveRequests: [
      { id: 'LR-C01', type: 'Annual', from: '15 Nov', to: '22 Nov', days: 6, reason: 'Annual family holiday — Zimbabwe/Mozambique.', status: 'pending', submitted: '28 Oct' },
    ],
  },
  {
    id: 'STF-002', name: 'Dr. Tendai Mutombwa',  role: 'doctor',  status: 'active',
    title: 'Medical Officer (MO)', department: 'Obstetrics & Gynaecology', shift: 'Rotating',
    leaveBalance: { annual: 22, sick: 10, study: 5 },
    attendanceStats: { present: 17, late: 0, absent: 1, leave: 2, total: 20 },
    attendanceGrid: buildGrid({ 3: 'A', 21: 'L', 22: 'L' }),
    leaveRequests: [
      { id: 'LR-002', type: 'Sick', from: '21 Oct', to: '22 Oct', days: 2, reason: 'Acute gastroenteritis — doctor\'s note attached.', status: 'approved', submitted: '21 Oct' },
    ],
  },
  {
    id: 'STF-003', name: 'Dr. Ruvimbo Mupanduki', role: 'doctor', status: 'active',
    title: 'Senior Registrar OB/GYN', department: 'Obstetrics & Gynaecology', shift: 'Day / On-call',
    leaveBalance: { annual: 14, sick: 10, study: 8 },
    attendanceStats: { present: 18, late: 2, absent: 0, leave: 0, total: 20 },
    attendanceGrid: buildGrid({ 8: 'T', 17: 'T' }),
    leaveRequests: [],
  },
  {
    id: 'STF-004', name: 'Sr. Agnes Musabayana',  role: 'midwife', status: 'active',
    title: 'Senior Midwife / Ward Sister', department: 'Labour & Delivery Ward', shift: 'Day (07:00–19:00)',
    leaveBalance: { annual: 10, sick: 3, study: 0 },
    attendanceStats: { present: 20, late: 0, absent: 0, leave: 0, total: 20 },
    attendanceGrid: buildGrid({}),
    leaveRequests: [],
  },
  {
    id: 'STF-005', name: 'Sr. Memory Choto',      role: 'midwife', status: 'on-leave',
    title: 'Registered Midwife', department: 'Labour & Delivery Ward', shift: 'Night (19:00–07:00)',
    leaveBalance: { annual: 5, sick: 10, study: 5 },
    attendanceStats: { present: 16, late: 0, absent: 0, leave: 4, total: 20 },
    attendanceGrid: buildGrid({ 28: 'L', 29: 'L', 30: 'L', 31: 'L' }),
    leaveRequests: [
      { id: 'LR-001', type: 'Annual', from: '28 Oct', to: '31 Oct', days: 4, reason: 'Family vacation — booked in advance.', status: 'approved', submitted: '20 Oct' },
    ],
  },
  {
    id: 'STF-006', name: 'SN Blessing Mwanaka',   role: 'nurse',   status: 'active',
    title: 'Staff Nurse (RGN)', department: 'Postnatal Ward', shift: 'Day (07:00–19:00)',
    leaveBalance: { annual: 20, sick: 10, study: 5 },
    attendanceStats: { present: 18, late: 1, absent: 1, leave: 0, total: 20 },
    attendanceGrid: buildGrid({ 9: 'T', 24: 'A' }),
    leaveRequests: [],
  },
  {
    id: 'STF-007', name: 'EN Primrose Dube',       role: 'nurse',   status: 'active',
    title: 'Enrolled Nurse (EN)', department: 'Antenatal Ward', shift: 'Rotating',
    leaveBalance: { annual: 22, sick: 10, study: 5 },
    attendanceStats: { present: 18, late: 2, absent: 0, leave: 0, total: 20 },
    attendanceGrid: buildGrid({ 4: 'T', 22: 'T' }),
    leaveRequests: [],
  },
  {
    id: 'STF-008', name: 'Sr. Anesu Murewa',       role: 'theatre', status: 'active',
    title: 'Theatre Nurse (Scrub)', department: 'Operating Theatre', shift: 'Day / On-call',
    leaveBalance: { annual: 12, sick: 8, study: 3 },
    attendanceStats: { present: 19, late: 0, absent: 0, leave: 1, total: 20 },
    attendanceGrid: buildGrid({ 10: 'L' }),
    leaveRequests: [
      { id: 'LR-005', type: 'Annual', from: '10 Oct', to: '10 Oct', days: 1, reason: 'Personal appointment — pre-arranged.', status: 'approved', submitted: '05 Oct' },
    ],
  },
  {
    id: 'STF-009', name: 'Mr. Takudzwa Kanyama',   role: 'theatre', status: 'active',
    title: 'Nurse Anaesthetist', department: 'Anaesthesia & Theatre', shift: 'Day / On-call',
    leaveBalance: { annual: 16, sick: 10, study: 5 },
    attendanceStats: { present: 20, late: 0, absent: 0, leave: 0, total: 20 },
    attendanceGrid: buildGrid({}),
    leaveRequests: [],
  },
  {
    id: 'STF-010', name: 'Mr. Taurai Zvobgo',      role: 'admin',   status: 'active',
    title: 'Hospital Administrator', department: 'Administration', shift: 'Office Hours',
    leaveBalance: { annual: 8, sick: 10, study: 5 },
    attendanceStats: { present: 20, late: 0, absent: 0, leave: 0, total: 20 },
    attendanceGrid: buildGrid({}),
    leaveRequests: [],
  },
  {
    id: 'STF-011', name: 'SN Rutendo Mhike',       role: 'nurse',   status: 'active',
    title: 'Staff Nurse (RGN)', department: 'Postnatal Ward', shift: 'Night',
    leaveBalance: { annual: 17, sick: 10, study: 5 },
    attendanceStats: { present: 19, late: 1, absent: 0, leave: 0, total: 20 },
    attendanceGrid: buildGrid({ 14: 'T' }),
    leaveRequests: [
      { id: 'LR-003', type: 'Annual', from: '04 Nov', to: '08 Nov', days: 5, reason: 'Attending sister\'s wedding in Mutare.', status: 'pending', submitted: '24 Oct' },
    ],
  },
  {
    id: 'STF-012', name: 'Mr. Simba Ncube',        role: 'support', status: 'active',
    title: 'Hospital Porter / Support', department: 'Support Services', shift: 'Day',
    leaveBalance: { annual: 25, sick: 10, study: 3 },
    attendanceStats: { present: 17, late: 0, absent: 2, leave: 1, total: 20 },
    attendanceGrid: buildGrid({ 7: 'A', 11: 'A', 25: 'L' }),
    leaveRequests: [
      { id: 'LR-004', type: 'Study', from: '11 Nov', to: '15 Nov', days: 5, reason: 'NSSA accredited safety course — Bulawayo.', status: 'pending', submitted: '25 Oct' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DAILY PRESENCE — derive from grids: how many present per working day
// ─────────────────────────────────────────────────────────────────────────────

function buildDailyStats() {
  return WORKING_DAYS.map(day => {
    let present = 0, late = 0, absent = 0, leave = 0;
    STAFF.forEach(s => {
      const cell = s.attendanceGrid[day - 1];
      if (cell.s === 'P') present++;
      else if (cell.s === 'T') { present++; late++; }
      else if (cell.s === 'A') absent++;
      else if (cell.s === 'L') leave++;
    });
    const total = STAFF.length;
    return { day, present, late, absent, leave, total };
  });
}

const DAILY_STATS = buildDailyStats();

// ─────────────────────────────────────────────────────────────────────────────
// SMALL SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Avatar({ name, role, size = 36 }) {
  const cfg = ROLE[role] || ROLE.support;
  const initials = name.split(' ').filter(Boolean).slice(-2).map(p => p[0]).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: cfg.light, border: `2px solid ${cfg.color}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 800, color: cfg.color, flexShrink: 0,
    }}>{initials}</div>
  );
}

function RoleTag({ role }) {
  const cfg = ROLE[role] || ROLE.support;
  const Icon = cfg.icon;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: cfg.light, color: cfg.color, border: `1px solid ${cfg.color}40`, borderRadius: 20, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
      <Icon size={10} strokeWidth={2.5} /> {cfg.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = { active: { cls: 'pm-badge-success', label: 'Active' }, 'on-leave': { cls: 'pm-badge-warning', label: 'On Leave' }, inactive: { cls: 'pm-badge-neutral', label: 'Inactive' } };
  const s = map[status] || map.inactive;
  return <span className={`pm-badge ${s.cls}`}>{s.label}</span>;
}

function AttRate({ pct }) {
  const color = pct >= 90 ? '#16a34a' : pct >= 75 ? '#d97706' : '#dc2626';
  const bg    = pct >= 90 ? '#dcfce7' : pct >= 75 ? '#fef3c7' : '#fee2e2';
  return (
    <span style={{ background: bg, color, border: `1px solid ${color}40`, borderRadius: 20, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 800 }}>
      {pct}%
    </span>
  );
}

function SortIcon({ col, sortBy, sortDir }) {
  if (sortBy !== col) return <ArrowUpDown size={12} style={{ opacity: 0.3 }} />;
  return sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE CALENDAR (compact heatmap)
// ─────────────────────────────────────────────────────────────────────────────

function AttCalendar({ grid, compact = false }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const cell = compact ? 22 : 30;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${cell}px)`, gap: compact ? 2 : 3, marginBottom: 4 }}>
        {days.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: '0.6rem', fontWeight: 700, color: 'var(--pm-text-muted)' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${cell}px)`, gap: compact ? 2 : 3 }}>
        <div style={{ width: cell, height: cell }} />
        {grid.map(({ day, s }) => {
          const cfg = ATT_CFG[s] || ATT_CFG.P;
          return (
            <div key={day} title={`${day} Oct — ${cfg.label}`} style={{
              width: cell, height: cell, borderRadius: compact ? 3 : 5,
              background: cfg.bg, border: `1px solid ${cfg.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: compact ? '0.55rem' : '0.62rem', fontWeight: 700, color: cfg.color,
              cursor: 'default',
            }}>
              {s !== 'weekend' ? day : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY OVERVIEW PANEL
// ─────────────────────────────────────────────────────────────────────────────

function DailyOverviewPanel() {
  const [selectedDay, setSelectedDay] = useState(null);

  const dayDetail = useMemo(() => {
    if (!selectedDay) return null;
    return STAFF.map(s => {
      const cell = s.attendanceGrid[selectedDay - 1];
      return { ...s, dayStatus: cell.s };
    }).sort((a, b) => {
      const order = { A: 0, T: 1, L: 2, P: 3 };
      return (order[a.dayStatus] ?? 4) - (order[b.dayStatus] ?? 4);
    });
  }, [selectedDay]);

  const peak = useMemo(() => Math.max(...DAILY_STATS.map(d => d.present)), []);

  return (
    <div>
      {/* Heatmap bar chart */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--pm-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Daily Presence — October 2024 · Click a day to inspect
        </div>
        <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', overflowX: 'auto', paddingBottom: 8 }}>
          {DAILY_STATS.map(({ day, present, late, absent, leave, total }) => {
            const heightPx = Math.max(8, Math.round((present / peak) * 80));
            const pct = Math.round((present / total) * 100);
            const color = pct >= 90 ? '#16a34a' : pct >= 75 ? '#d97706' : '#dc2626';
            const isSelected = selectedDay === day;
            return (
              <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer', minWidth: 28 }}
                onClick={() => setSelectedDay(prev => prev === day ? null : day)}>
                <span style={{ fontSize: '0.58rem', fontWeight: 700, color: isSelected ? color : 'transparent' }}>{present}</span>
                <div style={{
                  width: 22, height: heightPx + 8, borderRadius: 4,
                  background: isSelected ? color : pct >= 90 ? '#86efac' : pct >= 75 ? '#fde68a' : '#fca5a5',
                  border: isSelected ? `2px solid ${color}` : '2px solid transparent',
                  transition: 'all 0.15s',
                  boxShadow: isSelected ? `0 0 0 3px ${color}33` : 'none',
                }} />
                <span style={{ fontSize: '0.6rem', fontWeight: isSelected ? 800 : 500, color: isSelected ? color : 'var(--pm-text-muted)' }}>{day}</span>
                {(absent > 0 || late > 0) && (
                  <div style={{ display: 'flex', gap: 1 }}>
                    {absent > 0 && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#dc2626' }} title={`${absent} absent`} />}
                    {late > 0 && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#d97706' }} title={`${late} late`} />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 14, marginTop: 4, flexWrap: 'wrap' }}>
          {[
            { color: '#86efac', label: '≥90% present' },
            { color: '#fde68a', label: '75–89%' },
            { color: '#fca5a5', label: '<75%' },
            { color: '#dc2626', dot: true, label: 'Absences' },
            { color: '#d97706', dot: true, label: 'Late arrivals' },
          ].map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {l.dot
                ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                : <div style={{ width: 14, height: 10, borderRadius: 2, background: l.color }} />}
              <span style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day drill-down */}
      {selectedDay && dayDetail && (
        <div style={{ marginTop: 16, borderTop: '1px solid var(--pm-border)', paddingTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Wednesday, {selectedDay} October 2024</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginLeft: 8 }}>
                {dayDetail.filter(s => s.dayStatus !== 'weekend').length} staff working
              </span>
            </div>
            <button onClick={() => setSelectedDay(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pm-text-muted)', padding: 4 }}>
              <X size={14} />
            </button>
          </div>

          {/* Summary chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {[
              { key: 'P', label: 'Present',  count: dayDetail.filter(s => s.dayStatus === 'P').length, color: '#16a34a', bg: '#dcfce7' },
              { key: 'T', label: 'Late',     count: dayDetail.filter(s => s.dayStatus === 'T').length, color: '#d97706', bg: '#fef3c7' },
              { key: 'A', label: 'Absent',   count: dayDetail.filter(s => s.dayStatus === 'A').length, color: '#dc2626', bg: '#fee2e2' },
              { key: 'L', label: 'On Leave', count: dayDetail.filter(s => s.dayStatus === 'L').length, color: '#2563eb', bg: '#dbeafe' },
            ].map(c => (
              <div key={c.key} style={{ background: c.bg, border: `1px solid ${c.color}40`, borderRadius: 8, padding: '6px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: c.color }}>{c.count}</div>
                <div style={{ fontSize: '0.67rem', color: c.color, fontWeight: 600 }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* Staff rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto' }}>
            {dayDetail.filter(s => s.dayStatus !== 'weekend').map(s => {
              const cfg = ATT_CFG[s.dayStatus];
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', background: cfg.bg, border: `1px solid ${cfg.color}30`, borderRadius: 8 }}>
                  <Avatar name={s.name} role={s.role} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)' }}>{s.title}</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: cfg.color, background: 'white', border: `1px solid ${cfg.color}50`, borderRadius: 6, padding: '2px 8px', whiteSpace: 'nowrap' }}>
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEAVE BALANCE TABLE
// ─────────────────────────────────────────────────────────────────────────────

function LeaveBalancePanel() {
  const sorted = useMemo(() =>
    [...STAFF].sort((a, b) => (a.leaveBalance.annual + a.leaveBalance.sick + a.leaveBalance.study) - (b.leaveBalance.annual + b.leaveBalance.sick + b.leaveBalance.study)),
  []);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="pm-table">
        <thead>
          <tr>
            <th>STAFF MEMBER</th>
            <th style={{ textAlign: 'center' }}>ANNUAL</th>
            <th style={{ textAlign: 'center' }}>SICK</th>
            <th style={{ textAlign: 'center' }}>STUDY</th>
            <th style={{ textAlign: 'center' }}>TOTAL LEFT</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(s => {
            const total = s.leaveBalance.annual + s.leaveBalance.sick + s.leaveBalance.study;
            return (
              <tr key={s.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={s.name} role={s.role} size={28} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{s.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)' }}>{s.id}</div>
                    </div>
                  </div>
                </td>
                {[s.leaveBalance.annual, s.leaveBalance.sick, s.leaveBalance.study].map((v, i) => (
                  <td key={i} style={{ textAlign: 'center' }}>
                    <span style={{
                      fontWeight: 800, fontSize: '0.9rem',
                      color: v <= 3 ? '#dc2626' : v <= 7 ? '#d97706' : '#16a34a',
                    }}>{v}</span>
                    <div style={{ fontSize: '0.62rem', color: 'var(--pm-text-muted)' }}>days</div>
                  </td>
                ))}
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontWeight: 800, fontSize: '0.95rem',
                    color: total <= 10 ? '#dc2626' : total <= 20 ? '#d97706' : '#16a34a',
                  }}>{total}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAFF PROFILE MODAL — attendance + requests + leave
// ─────────────────────────────────────────────────────────────────────────────

function StaffProfileModal({ staff, onClose }) {
  const [tab, setTab] = useState('attendance');
  const { color } = ROLE[staff.role] || ROLE.support;
  const { present, late, absent, leave, total } = staff.attendanceStats;
  const pct = Math.round((present / total) * 100);

  const TABS = [
    { key: 'attendance', label: 'Attendance',     icon: Calendar },
    { key: 'leave',      label: 'Leave Days',      icon: Umbrella },
    { key: 'requests',   label: 'Leave Requests',  icon: FileText },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={onClose}>
      <div style={{ background: 'var(--pm-surface)', borderRadius: 14, width: '100%', maxWidth: 680, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--pm-border)', background: `linear-gradient(135deg, ${color}08, transparent)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={staff.name} role={staff.role} size={46} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>{staff.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>{staff.title} · {staff.id}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
                <RoleTag role={staff.role} />
                <StatusBadge status={staff.status} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <AttRate pct={pct} />
              <div style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)', marginTop: 4 }}>Oct attendance</div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pm-text-muted)', padding: 4, marginLeft: 4 }}>
              <X size={18} />
            </button>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Present', value: present, color: '#16a34a', bg: '#dcfce7' },
              { label: 'Late',    value: late,    color: '#d97706', bg: '#fef3c7' },
              { label: 'Absent',  value: absent,  color: '#dc2626', bg: '#fee2e2' },
              { label: 'Leave',   value: leave,   color: '#2563eb', bg: '#dbeafe' },
            ].map(c => (
              <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.color}40`, borderRadius: 8, padding: '6px 12px', textAlign: 'center', minWidth: 64 }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: c.color }}>{c.value}</div>
                <div style={{ fontSize: '0.62rem', color: c.color, fontWeight: 600 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--pm-border)', background: 'var(--pm-surface-2)' }}>
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                flex: 1, padding: '10px 8px', border: 'none', background: 'none', cursor: 'pointer',
                borderBottom: active ? `2px solid ${color}` : '2px solid transparent',
                color: active ? color : 'var(--pm-text-muted)',
                fontWeight: active ? 700 : 500, fontSize: '0.8rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                transition: 'all 0.15s',
              }}>
                <Icon size={13} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

          {tab === 'attendance' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 12 }}>October 2024 — Full Attendance Calendar</div>
              <AttCalendar grid={staff.attendanceGrid} />
              {/* Shift info */}
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', borderRadius: 8 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--pm-text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>Shift Pattern</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{staff.shift}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>{staff.department}</div>
              </div>
            </div>
          )}

          {tab === 'leave' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 14 }}>Leave Balance — FY 2024 (Remaining Days)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { key: 'annual', label: 'Annual Leave', icon: CalendarDays, fullAllowance: 30 },
                  { key: 'sick',   label: 'Sick Leave',   icon: Heart,        fullAllowance: 10 },
                  { key: 'study',  label: 'Study Leave',  icon: GraduationCap,fullAllowance: 10 },
                ].map(({ key, label, icon: Icon, fullAllowance }) => {
                  const days = staff.leaveBalance[key];
                  const used = fullAllowance - days;
                  const pctUsed = Math.round((used / fullAllowance) * 100);
                  const low = days <= 5;
                  const color2 = low ? '#dc2626' : days <= 10 ? '#d97706' : '#16a34a';
                  const bg2   = low ? '#fee2e2'  : days <= 10 ? '#fef3c7' : '#dcfce7';
                  return (
                    <div key={key} style={{ background: bg2, border: `1px solid ${color2}30`, borderRadius: 10, padding: '14px', textAlign: 'center' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', boxShadow: `0 2px 8px ${color2}20` }}>
                        <Icon size={18} style={{ color: color2 }} />
                      </div>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: color2, lineHeight: 1 }}>{days}</div>
                      <div style={{ fontSize: '0.68rem', color: color2, fontWeight: 700, marginTop: 2 }}>days remaining</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)', marginTop: 6, fontWeight: 600 }}>{label}</div>
                      {/* Mini progress bar */}
                      <div style={{ marginTop: 8, height: 4, background: 'white', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pctUsed}%`, background: color2, borderRadius: 2, transition: 'width 0.4s' }} />
                      </div>
                      <div style={{ fontSize: '0.62rem', color: 'var(--pm-text-muted)', marginTop: 3 }}>{used} of {fullAllowance} used</div>
                      {low && <div style={{ marginTop: 6, fontSize: '0.62rem', color: color2, fontWeight: 700 }}>⚠ Running low</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'requests' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 12 }}>Leave Requests History</div>
              {staff.leaveRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--pm-text-muted)' }}>
                  <FileText size={28} style={{ opacity: 0.2, display: 'block', margin: '0 auto 8px' }} />
                  No leave requests on record
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {staff.leaveRequests.map(req => {
                    const isPending = req.status === 'pending';
                    const isApproved = req.status === 'approved';
                    return (
                      <div key={req.id} style={{
                        padding: '12px 14px', borderRadius: 8,
                        background: isPending ? '#fffbeb' : isApproved ? '#f0fdf4' : '#fef2f2',
                        border: `1px solid ${isPending ? '#fde68a' : isApproved ? '#bbf7d0' : '#fecaca'}`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{req.type} Leave</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', marginLeft: 8 }}>{req.days} day{req.days !== 1 ? 's' : ''}</span>
                          </div>
                          <span className={`pm-badge ${isPending ? 'pm-badge-warning' : isApproved ? 'pm-badge-success' : 'pm-badge-danger'}`} style={{ fontSize: '0.62rem' }}>
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.77rem', color: 'var(--pm-text-muted)', marginBottom: 6 }}>
                          📅 {req.from} → {req.to} · Submitted {req.submitted}
                        </div>
                        <div style={{ fontSize: '0.78rem', fontStyle: 'italic', color: 'var(--pm-text-muted)', background: 'white', padding: '5px 8px', borderRadius: 5, border: '1px solid var(--pm-border)' }}>
                          "{req.reason}"
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { key: 'name',      label: 'Name' },
  { key: 'id',        label: 'Staff ID' },
  { key: 'rate',      label: 'Attendance %' },
  { key: 'present',   label: 'Days Present' },
  { key: 'late',      label: 'Late Arrivals' },
  { key: 'absent',    label: 'Absences' },
  { key: 'leave',     label: 'Leave Days' },
  { key: 'annualLeft',label: 'Annual Leave Left' },
];

export default function AttendanceManagementPage({ user, onNavigate }) {
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy]         = useState('name');
  const [sortDir, setSortDir]       = useState('asc');
  const [activeView, setActiveView] = useState('records'); // 'records' | 'daily' | 'leave'
  const [profileStaff, setProfileStaff] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState(LEAVE_REQUESTS_INIT);

  // Summary stats
  const summary = useMemo(() => {
    const totalWorking = STAFF.length * 20;
    const totalPresent = STAFF.reduce((acc, s) => acc + s.attendanceStats.present, 0);
    const totalLate    = STAFF.reduce((acc, s) => acc + s.attendanceStats.late,    0);
    const totalAbsent  = STAFF.reduce((acc, s) => acc + s.attendanceStats.absent,  0);
    const totalLeave   = STAFF.reduce((acc, s) => acc + s.attendanceStats.leave,   0);
    return { totalWorking, totalPresent, totalLate, totalAbsent, totalLeave, overallRate: Math.round((totalPresent / totalWorking) * 100) };
  }, []);

  // Filtered & sorted staff
  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    const arr = STAFF.filter(p =>
      (s === '' || p.name.toLowerCase().includes(s) || p.id.toLowerCase().includes(s)) &&
      (roleFilter === 'all' || p.role === roleFilter)
    );
    const dir = sortDir === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      const rateA = Math.round((a.attendanceStats.present / a.attendanceStats.total) * 100);
      const rateB = Math.round((b.attendanceStats.present / b.attendanceStats.total) * 100);
      switch (sortBy) {
        case 'name':       return dir * a.name.localeCompare(b.name);
        case 'id':         return dir * a.id.localeCompare(b.id);
        case 'rate':       return dir * (rateA - rateB);
        case 'present':    return dir * (a.attendanceStats.present - b.attendanceStats.present);
        case 'late':       return dir * (a.attendanceStats.late    - b.attendanceStats.late);
        case 'absent':     return dir * (a.attendanceStats.absent  - b.attendanceStats.absent);
        case 'leave':      return dir * (a.attendanceStats.leave   - b.attendanceStats.leave);
        case 'annualLeft': return dir * (a.leaveBalance.annual     - b.leaveBalance.annual);
        default:           return 0;
      }
    });
    return arr;
  }, [search, roleFilter, sortBy, sortDir]);

  function toggleSort(col) {
    if (sortBy === col) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  }

  function handleLeaveAction(id, action) {
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  }

  const pendingLeave = leaveRequests.filter(r => r.status === 'pending').length;
  const roleCounts = useMemo(() => {
    const c = {};
    Object.keys(ROLE).forEach(k => { c[k] = k === 'all' ? STAFF.length : STAFF.filter(s => s.role === k).length; });
    return c;
  }, []);

  const VIEW_TABS = [
    { key: 'records', label: 'Attendance Records', icon: ClipboardList },
    { key: 'daily',   label: 'Daily Overview',     icon: CalendarDays },
    { key: 'leave',   label: 'Leave Balances',     icon: Umbrella },
  ];

  return (
    <div>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Attendance Management</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>
            October 2024 · {STAFF.length} staff members · Parirenyatwa Group of Hospitals — Maternity Unit
          </div>
        </div>
        {pendingLeave > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, padding: '6px 12px' }}>
            <Bell size={14} style={{ color: '#d97706' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#d97706' }}>{pendingLeave} leave request{pendingLeave > 1 ? 's' : ''} pending</span>
          </div>
        )}
      </div>

      {/* OVERVIEW STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Overall Rate',    value: `${summary.overallRate}%`, icon: TrendingUp,  color: '#6366f1', bg: '#eef2ff',  sub: 'Oct 2024 avg.' },
          { label: 'Days Present',    value: summary.totalPresent,      icon: UserCheck,   color: '#16a34a', bg: '#dcfce7',  sub: `of ${summary.totalWorking} total` },
          { label: 'Late Arrivals',   value: summary.totalLate,         icon: Timer,       color: '#d97706', bg: '#fef3c7',  sub: 'across all staff' },
          { label: 'Absences',        value: summary.totalAbsent,       icon: UserX,       color: '#dc2626', bg: '#fee2e2',  sub: 'unplanned only' },
          { label: 'Leave Days Taken',value: summary.totalLeave,        icon: Umbrella,    color: '#2563eb', bg: '#dbeafe',  sub: 'approved leave' },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="pm-card" style={{ padding: '12px 14px', borderLeft: `3px solid ${c.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: c.color, lineHeight: 1 }}>{c.value}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pm-text)', marginTop: 3 }}>{c.label}</div>
                  <div style={{ fontSize: '0.67rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>{c.sub}</div>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} style={{ color: c.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIEW TABS */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', borderRadius: 10, padding: 4 }}>
        {VIEW_TABS.map(t => {
          const Icon = t.icon;
          const active = activeView === t.key;
          return (
            <button key={t.key} onClick={() => setActiveView(t.key)} style={{
              flex: 1, padding: '8px 10px', border: 'none', cursor: 'pointer',
              background: active ? 'var(--pm-surface)' : 'none',
              boxShadow: active ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              borderRadius: 7, color: active ? 'var(--pm-primary)' : 'var(--pm-text-muted)',
              fontWeight: active ? 700 : 500, fontSize: '0.8rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              transition: 'all 0.15s',
            }}>
              <Icon size={13} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ── ATTENDANCE RECORDS VIEW ── */}
      {activeView === 'records' && (
        <div className="row g-3">
          {/* LEFT — main table */}
          <div className="col-12 col-xl-8">
            <div className="pm-card">
              {/* Filters row */}
              <div style={{ marginBottom: 14 }}>
                {/* Search */}
                <div style={{ position: 'relative', marginBottom: 10 }}>
                  <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--pm-text-muted)' }} />
                  <input
                    type="text" placeholder="Search by name or staff ID…"
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', padding: '8px 36px 8px 36px', border: '1px solid var(--pm-border)', borderRadius: 8, background: 'var(--pm-surface-2)', fontSize: '0.85rem', outline: 'none', color: 'var(--pm-text)', boxSizing: 'border-box' }}
                  />
                  {search && (
                    <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pm-text-muted)', padding: 2 }}>
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Role filter pills + sort */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {Object.entries(ROLE).map(([key, cfg]) => {
                      const active = roleFilter === key;
                      return (
                        <button key={key} onClick={() => setRoleFilter(prev => prev === key ? 'all' : key)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '3px 9px', borderRadius: 20, border: `1px solid ${active ? cfg.color : 'var(--pm-border)'}`,
                            background: active ? cfg.color : 'transparent', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700,
                            color: active ? 'white' : 'var(--pm-text-muted)', transition: 'all 0.15s',
                          }}>
                          {cfg.label}
                          <span style={{ background: active ? 'rgba(255,255,255,0.25)' : 'var(--pm-surface-2)', borderRadius: 10, padding: '0 4px', fontSize: '0.65rem' }}>
                            {roleCounts[key]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Sort dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Filter size={12} style={{ color: 'var(--pm-text-muted)' }} />
                    <select value={sortBy} onChange={e => { setSortBy(e.target.value); setSortDir('asc'); }}
                      style={{ padding: '4px 8px', border: '1px solid var(--pm-border)', borderRadius: 6, background: 'var(--pm-surface-2)', fontSize: '0.75rem', color: 'var(--pm-text)', cursor: 'pointer', outline: 'none' }}>
                      {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                    </select>
                    <button onClick={() => setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')}
                      style={{ padding: '4px 8px', border: '1px solid var(--pm-border)', borderRadius: 6, background: 'var(--pm-surface-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', color: 'var(--pm-text)' }}>
                      {sortDir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                      {sortDir === 'asc' ? 'Asc' : 'Desc'}
                    </button>
                    {(search || roleFilter !== 'all') && (
                      <button onClick={() => { setSearch(''); setRoleFilter('all'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', border: '1px solid var(--pm-border)', borderRadius: 6, background: 'var(--pm-surface-2)', cursor: 'pointer', fontSize: '0.72rem', color: 'var(--pm-text-muted)' }}>
                        <X size={11} /> Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--pm-text-muted)', marginBottom: 8 }}>
                Showing {filtered.length} of {STAFF.length} staff members
              </div>

              {/* TABLE */}
              <div style={{ overflowX: 'auto' }}>
                <table className="pm-table">
                  <thead>
                    <tr>
                      <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('name')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>STAFF MEMBER <SortIcon col="name" sortBy={sortBy} sortDir={sortDir} /></div>
                      </th>
                      <th style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => toggleSort('rate')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>RATE <SortIcon col="rate" sortBy={sortBy} sortDir={sortDir} /></div>
                      </th>
                      <th style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => toggleSort('present')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}><UserCheck size={11} style={{ color: '#16a34a' }} /> PRESENT <SortIcon col="present" sortBy={sortBy} sortDir={sortDir} /></div>
                      </th>
                      <th style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => toggleSort('late')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}><Timer size={11} style={{ color: '#d97706' }} /> LATE <SortIcon col="late" sortBy={sortBy} sortDir={sortDir} /></div>
                      </th>
                      <th style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => toggleSort('absent')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}><UserX size={11} style={{ color: '#dc2626' }} /> ABSENT <SortIcon col="absent" sortBy={sortBy} sortDir={sortDir} /></div>
                      </th>
                      <th style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => toggleSort('leave')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}><Umbrella size={11} style={{ color: '#2563eb' }} /> LEAVE <SortIcon col="leave" sortBy={sortBy} sortDir={sortDir} /></div>
                      </th>
                      <th style={{ textAlign: 'center' }}>CALENDAR</th>
                      <th style={{ textAlign: 'center' }}>DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--pm-text-muted)' }}>
                          <Search size={28} style={{ opacity: 0.2, display: 'block', margin: '0 auto 8px' }} />
                          No staff members match your search
                        </td>
                      </tr>
                    ) : filtered.map(s => {
                      const { present, late, absent, leave, total } = s.attendanceStats;
                      const pct = Math.round((present / total) * 100);
                      return (
                        <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => setProfileStaff(s)}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Avatar name={s.name} role={s.role} size={32} />
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.83rem' }}>{s.name}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                                  <span style={{ fontSize: '0.68rem', color: 'var(--pm-text-muted)' }}>{s.id}</span>
                                  <RoleTag role={s.role} />
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}><AttRate pct={pct} /></td>
                          <td style={{ textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>{present}</td>
                          <td style={{ textAlign: 'center' }}>
                            {late > 0
                              ? <span style={{ fontWeight: 700, color: '#d97706', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 6, padding: '1px 7px', fontSize: '0.8rem' }}>{late}</span>
                              : <span style={{ color: 'var(--pm-text-muted)', fontSize: '0.8rem' }}>—</span>}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {absent > 0
                              ? <span style={{ fontWeight: 700, color: '#dc2626', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 6, padding: '1px 7px', fontSize: '0.8rem' }}>{absent}</span>
                              : <span style={{ color: 'var(--pm-text-muted)', fontSize: '0.8rem' }}>—</span>}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {leave > 0
                              ? <span style={{ fontWeight: 700, color: '#2563eb', background: '#dbeafe', border: '1px solid #bfdbfe', borderRadius: 6, padding: '1px 7px', fontSize: '0.8rem' }}>{leave}</span>
                              : <span style={{ color: 'var(--pm-text-muted)', fontSize: '0.8rem' }}>—</span>}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {/* Mini heatmap strip — show only weekdays */}
                            <div style={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 120 }}>
                              {s.attendanceGrid.filter(c => c.s !== 'weekend').map(({ day, s: status }) => {
                                const cfg = ATT_CFG[status] || ATT_CFG.P;
                                return (
                                  <div key={day} title={`${day} Oct — ${cfg.label}`} style={{ width: 8, height: 8, borderRadius: 2, background: cfg.bg, border: `1px solid ${cfg.color}50` }} />
                                );
                              })}
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button className="pm-btn pm-btn-outline pm-btn-sm" onClick={e => { e.stopPropagation(); setProfileStaff(s); }}
                              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', margin: '0 auto' }}>
                              <Eye size={11} /> View
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

          {/* RIGHT — leave requests panel */}
          <div className="col-12 col-xl-4 d-flex flex-column gap-3">
            <div className="pm-card">
              <div className="pm-section-header" style={{ marginBottom: 12 }}>
                <div>
                  <div className="pm-section-title">Leave Requests</div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--pm-text-muted)' }}>{pendingLeave} pending approval</div>
                </div>
                {pendingLeave > 0 && (
                  <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 12, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
                    {pendingLeave} Pending
                  </span>
                )}
              </div>
              {leaveRequests.map(req => {
                const isPending = req.status === 'pending';
                const typeColor = { Annual: '#6366f1', Sick: '#dc2626', Study: '#7c3aed' }[req.type] || '#6366f1';
                return (
                  <div key={req.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--pm-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <div style={{ display: 'flex', align: 'flex-start', gap: 8 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{req.staffName}</div>
                          <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginTop: 2 }}>
                            <span style={{ fontSize: '0.66rem', color: 'var(--pm-text-muted)' }}>{req.staffId}</span>
                            <span style={{ background: `${typeColor}15`, color: typeColor, border: `1px solid ${typeColor}40`, borderRadius: 10, padding: '1px 6px', fontSize: '0.63rem', fontWeight: 700 }}>{req.type}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`pm-badge ${isPending ? 'pm-badge-warning' : 'pm-badge-success'}`} style={{ fontSize: '0.62rem', flexShrink: 0 }}>
                        {isPending ? 'Pending' : 'Approved'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginBottom: 5 }}>
                      📅 {req.from} → {req.to} · {req.days} day{req.days > 1 ? 's' : ''} · Submitted {req.submitted}
                    </div>
                    <div style={{ fontSize: '0.76rem', background: 'var(--pm-surface-2)', border: '1px solid var(--pm-border)', borderRadius: 5, padding: '5px 8px', marginBottom: isPending ? 8 : 0, fontStyle: 'italic', color: 'var(--pm-text-muted)' }}>
                      "{req.reason}"
                    </div>
                    {isPending && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="pm-btn pm-btn-sm" style={{ flex: 1, background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: '0.73rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                          onClick={() => handleLeaveAction(req.id, 'approved')}>
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button className="pm-btn pm-btn-sm" style={{ flex: 1, background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '0.73rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                          onClick={() => handleLeaveAction(req.id, 'rejected')}>
                          <XCircle size={12} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Attendance breakdown donut-style summary */}
            <div className="pm-card">
              <div className="pm-section-title" style={{ marginBottom: 12 }}>Month at a Glance</div>
              {[
                { label: 'Present (incl. late)', value: summary.totalPresent, total: summary.totalWorking, color: '#16a34a', bg: '#dcfce7' },
                { label: 'Late arrivals',         value: summary.totalLate,    total: summary.totalWorking, color: '#d97706', bg: '#fef3c7' },
                { label: 'Absences',              value: summary.totalAbsent,  total: summary.totalWorking, color: '#dc2626', bg: '#fee2e2' },
                { label: 'Leave days taken',      value: summary.totalLeave,   total: summary.totalWorking, color: '#2563eb', bg: '#dbeafe' },
              ].map(item => {
                const pct = Math.round((item.value / item.total) * 100);
                return (
                  <div key={item.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{item.label}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: item.color }}>{item.value} <span style={{ fontSize: '0.65rem', fontWeight: 500, color: 'var(--pm-text-muted)' }}>days</span></span>
                    </div>
                    <div style={{ height: 6, background: 'var(--pm-surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: item.color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                    </div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--pm-text-muted)', marginTop: 2 }}>{pct}% of total person-days</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── DAILY OVERVIEW VIEW ── */}
      {activeView === 'daily' && (
        <div className="pm-card">
          <DailyOverviewPanel />
        </div>
      )}

      {/* ── LEAVE BALANCES VIEW ── */}
      {activeView === 'leave' && (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            {[
              { label: 'Critical (≤3 days)',  color: '#dc2626', bg: '#fee2e2', count: STAFF.filter(s => s.leaveBalance.annual <= 3).length },
              { label: 'Low (4–7 days)',      color: '#d97706', bg: '#fef3c7', count: STAFF.filter(s => s.leaveBalance.annual > 3 && s.leaveBalance.annual <= 7).length },
              { label: 'Healthy (8+ days)',   color: '#16a34a', bg: '#dcfce7', count: STAFF.filter(s => s.leaveBalance.annual > 7).length },
            ].map(c => (
              <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.color}40`, borderRadius: 8, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 900, color: c.color }}>{c.count}</span>
                <span style={{ fontSize: '0.77rem', color: c.color, fontWeight: 600 }}>{c.label}</span>
              </div>
            ))}
            <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--pm-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Info size={12} /> Annual leave remaining — sorted low to high
            </div>
          </div>
          <div className="pm-card">
            <LeaveBalancePanel />
          </div>
        </div>
      )}

      {/* STAFF PROFILE MODAL */}
      {profileStaff && (
        <StaffProfileModal staff={profileStaff} onClose={() => setProfileStaff(null)} />
      )}
    </div>
  );
}