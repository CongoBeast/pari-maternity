import React, { useState } from 'react';
import {
  Clock, LogIn, LogOut, Calendar, AlertCircle, CheckCircle, Clock4, AlertTriangle,
  Plus, X, Search, Filter, Download, Eye, TrendingDown, Users, Briefcase, 
  Info, Siren, MapPin, MessageSquare
} from 'lucide-react';

// Sample attendance data
const sampleClockHistory = [
  { date: '2024-10-24', clockIn: '07:58 AM', clockOut: '17:05 PM', status: 'present', duration: '9h 7m', location: 'Main Gate' },
  { date: '2024-10-23', clockIn: '08:15 AM', clockOut: '17:00 PM', status: 'late', duration: '8h 45m', location: 'Main Gate' },
  { date: '2024-10-22', clockIn: '08:00 AM', clockOut: '17:00 PM', status: 'present', duration: '9h 0m', location: 'Main Gate' },
  { date: '2024-10-21', clockIn: '—', clockOut: '—', status: 'absent', duration: '0h', location: '—' },
  { date: '2024-10-20', clockIn: '08:05 AM', clockOut: '—', status: 'missing_checkout', duration: '—', location: 'Main Gate' },
  { date: '2024-10-19', clockIn: '07:55 AM', clockOut: '17:30 PM', status: 'present', duration: '9h 35m', location: 'Main Gate' },
  { date: '2024-10-18', clockIn: '08:10 AM', clockOut: '16:50 PM', status: 'early_leave', duration: '8h 40m', location: 'Main Gate' },
  { date: '2024-10-17', clockIn: '08:00 AM', clockOut: '17:00 PM', status: 'present', duration: '9h 0m', location: 'Main Gate' },
];

// Leave/Time Off Requests
const sampleLeaveRequests = [
  { id: 'LR001', type: 'Annual Leave', startDate: '2024-11-15', endDate: '2024-11-22', duration: 6, status: 'approved', reason: 'Family visit', requestDate: '2024-10-10' },
  { id: 'LR002', type: 'Sick Leave', startDate: '2024-10-25', endDate: '2024-10-25', duration: 1, status: 'pending', reason: 'Medical appointment', requestDate: '2024-10-24' },
  { id: 'LR003', type: 'Compassionate Leave', startDate: '2024-10-20', endDate: '2024-10-20', duration: 1, status: 'approved', reason: 'Family emergency', requestDate: '2024-10-19' },
  { id: 'LR004', type: 'Annual Leave', startDate: '2024-09-01', endDate: '2024-09-05', duration: 5, status: 'approved', reason: 'Vacation', requestDate: '2024-08-15' },
];

// Holiday Calendar
const holidays = [
  { date: '2024-11-01', name: 'All Saints Day', type: 'Public Holiday' },
  { date: '2024-12-25', name: 'Christmas Day', type: 'Public Holiday' },
  { date: '2024-12-26', name: 'Boxing Day', type: 'Public Holiday' },
  { date: '2025-01-01', name: 'New Year Day', type: 'Public Holiday' },
];

// Lab notices
const attendanceNotices = [
  { icon: AlertCircle, color: 'var(--pm-warning)', title: 'Attendance Policy Update', sub: 'New clock-in grace period: 10 minutes. Review updated policy document.' },
  { icon: Info, color: 'var(--pm-info)', title: 'Holiday Schedule Released', sub: 'Q4 2024 holiday calendar now available in Help Center' },
  { icon: CheckCircle, color: '#16a34a', title: 'Attendance Report Generated', sub: 'Your Q3 attendance report is ready for download' },
];

function statusBadge(status) {
  const statusMap = {
    present: { class: 'pm-badge-success', label: 'Present' },
    late: { class: 'pm-badge-warning', label: 'Late' },
    absent: { class: 'pm-badge-danger', label: 'Absent' },
    'early_leave': { class: 'pm-badge-warning', label: 'Early Leave' },
    'missing_checkout': { class: 'pm-badge-warning', label: 'Missing Checkout' },
    approved: { class: 'pm-badge-success', label: 'Approved' },
    pending: { class: 'pm-badge-warning', label: 'Pending' },
    rejected: { class: 'pm-badge-danger', label: 'Rejected' },
  };
  const config = statusMap[status] || { class: 'pm-badge-neutral', label: status };
  return <span className={`pm-badge ${config.class}`}>{config.label}</span>;
}

function LeaveRequestModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    type: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: '',
    notes: ''
  });

  const leaveTypes = [
    'Annual Leave',
    'Sick Leave',
    'Compassionate Leave',
    'Maternity Leave',
    'Paternity Leave',
    'Unpaid Leave',
    'Study Leave'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) {
      alert('Please select both start and end dates');
      return;
    }
    onSubmit(formData);
    setFormData({ type: 'Annual Leave', startDate: '', endDate: '', reason: '', notes: '' });
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="pm-card" style={{
        width: '90%',
        maxWidth: 500,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: '1px solid var(--pm-border)'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Request Time Off</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--pm-surface-2)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: 6,
              color: 'var(--pm-text-primary)'
            }}>
              Leave Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--pm-border)',
                borderRadius: 6,
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                background: 'var(--pm-surface)',
                color: 'var(--pm-text-primary)',
                cursor: 'pointer'
              }}
            >
              {leaveTypes.map((type, i) => (
                <option key={i} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: 6,
                color: 'var(--pm-text-primary)'
              }}>
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--pm-border)',
                  borderRadius: 6,
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: 6,
                color: 'var(--pm-text-primary)'
              }}>
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--pm-border)',
                  borderRadius: 6,
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: 6,
              color: 'var(--pm-text-primary)'
            }}>
              Reason *
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="e.g., Medical appointment, Family visit"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--pm-border)',
                borderRadius: 6,
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: 6,
              color: 'var(--pm-text-primary)'
            }}>
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--pm-border)',
                borderRadius: 6,
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{
            padding: '12px',
            background: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: 6,
            display: 'flex',
            gap: 8,
            fontSize: '0.85rem',
            color: '#92400e'
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>Leave requests must be made at least 5 days in advance for annual leave.</span>
          </div>

          <div style={{
            display: 'flex',
            gap: 12,
            paddingTop: 12,
            borderTop: '1px solid var(--pm-border)'
          }}>
            <button
              type="button"
              onClick={onClose}
              className="pm-btn pm-btn-outline"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pm-btn pm-btn-primary"
              style={{ flex: 1 }}
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DoctorAttendance({ user, onNavigate }) {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState(sampleClockHistory);
  const [leaveRequestsData, setLeaveRequestsData] = useState(sampleLeaveRequests);
  const [filterAttendance, setFilterAttendance] = useState('all');
  const [filterLeave, setFilterLeave] = useState('all');

  const handleAddLeaveRequest = (formData) => {
    const newRequest = {
      id: `LR${String(leaveRequestsData.length + 1).padStart(3, '0')}`,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration: Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + 1,
      status: 'pending',
      reason: formData.reason,
      requestDate: new Date().toISOString().split('T')[0]
    };
    setLeaveRequestsData([newRequest, ...leaveRequestsData]);
    setIsLeaveModalOpen(false);
  };

  // Calculate statistics
  const stats = {
    totalWorkingDays: attendanceData.length,
    presentDays: attendanceData.filter(c => c.status === 'present').length,
    lateDays: attendanceData.filter(c => c.status === 'late').length,
    absentDays: attendanceData.filter(c => c.status === 'absent').length,
    leaveDaysUsed: leaveRequestsData.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.duration, 0),
    leaveRequestsPending: leaveRequestsData.filter(l => l.status === 'pending').length,
  };

  const totalAnnualLeave = 21;
  const leaveDaysRemaining = totalAnnualLeave - stats.leaveDaysUsed;
  const attendancePercentage = stats.totalWorkingDays > 0 ? Math.round((stats.presentDays / stats.totalWorkingDays) * 100) : 0;

  const filteredClockHistory = filterAttendance === 'all' ? attendanceData : attendanceData.filter(c => c.status === filterAttendance);
  const filteredLeaveRequests = filterLeave === 'all' ? leaveRequestsData : leaveRequestsData.filter(l => l.status === filterLeave);

  return (
    <div>
      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="pm-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Calendar size={20} style={{ opacity: 0.8, color: '#fff' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, opacity: 0.85, background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 20 }}>{attendancePercentage}%</span>
            </div>
            <div className="pm-card-title" style={{ color: 'rgba(255,255,255,0.7)' }}>Attendance Rate</div>
            <div className="pm-stat-value" style={{ color: '#fff', fontSize: '2.4rem' }}>{stats.presentDays}/{stats.totalWorkingDays}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: 4 }}>This month</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="pm-stat-card secondary">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Clock4 size={20} style={{ color: 'var(--pm-primary)', opacity: 0.8 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: stats.lateDays > 3 ? 'var(--pm-danger)' : '#f59e0b', background: stats.lateDays > 3 ? '#fee2e2' : '#fef3c7', padding: '2px 8px', borderRadius: 20 }}>
                {stats.lateDays > 0 ? `⚠ ${stats.lateDays}` : 'Good'}
              </span>
            </div>
            <div className="pm-card-title">Late Arrivals</div>
            <div className="pm-stat-value">{stats.lateDays}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 4 }}>Days this month</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="pm-stat-card secondary">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Briefcase size={20} style={{ color: 'var(--pm-primary)', opacity: 0.8 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: 20 }}>{leaveDaysRemaining}/{totalAnnualLeave}</span>
            </div>
            <div className="pm-card-title">Leave Days Left</div>
            <div className="pm-stat-value">{leaveDaysRemaining}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 4 }}>Annual allocation</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="pm-stat-card secondary" style={{ border: stats.leaveRequestsPending > 0 ? '1px solid var(--pm-warning)' : '1px solid var(--pm-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <AlertCircle size={20} style={{ color: 'var(--pm-primary)', opacity: 0.8 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: stats.leaveRequestsPending > 0 ? 'var(--pm-warning)' : '#6b7280', background: stats.leaveRequestsPending > 0 ? '#fef3c7' : '#f3f4f6', padding: '2px 8px', borderRadius: 20 }}>
                {stats.leaveRequestsPending > 0 ? `Pending` : 'Clear'}
              </span>
            </div>
            <div className="pm-card-title">Leave Requests</div>
            <div className="pm-stat-value">{stats.leaveRequestsPending}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 4 }}>Awaiting approval</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Clock In/Out History */}
        <div className="col-12 col-lg-7">
          <div className="pm-card">
            <div className="pm-section-header">
              <div>
                <div className="pm-section-title">Clock In/Out History</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>Your attendance record this month</div>
              </div>
              <button className="pm-btn pm-btn-primary pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Download size={16} /> Export
              </button>
            </div>

            {/* Filter Controls */}
            <div style={{
              display: 'flex',
              gap: 8,
              marginBottom: 16,
              overflowX: 'auto',
              paddingBottom: 4
            }}>
              {['all', 'present', 'late', 'absent', 'early_leave'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterAttendance(status)}
                  style={{
                    padding: '6px 12px',
                    border: filterAttendance === status ? 'none' : '1px solid var(--pm-border)',
                    background: filterAttendance === status ? 'var(--pm-primary)' : 'transparent',
                    color: filterAttendance === status ? '#fff' : 'var(--pm-text-primary)',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (filterAttendance !== status) {
                      e.target.style.background = 'var(--pm-surface-2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filterAttendance !== status) {
                      e.target.style.background = 'transparent';
                    }
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="pm-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>CLOCK IN</th>
                    <th>CLOCK OUT</th>
                    <th>DURATION</th>
                    <th>LOCATION</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClockHistory.length > 0 ? (
                    filteredClockHistory.map((row, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{new Date(row.date).toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                        <td style={{ color: 'var(--pm-text-muted)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <LogIn size={14} style={{ color: '#16a34a' }} /> {row.clockIn}
                          </div>
                        </td>
                        <td style={{ color: 'var(--pm-text-muted)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <LogOut size={14} style={{ color: '#dc2626' }} /> {row.clockOut}
                          </div>
                        </td>
                        <td style={{ fontWeight: 500 }}>{row.duration}</td>
                        <td style={{ fontSize: '0.9rem', color: 'var(--pm-text-muted)' }}>{row.location}</td>
                        <td>{statusBadge(row.status)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--pm-text-muted)' }}>
                        No records found with this filter
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-12 col-lg-5 d-flex flex-column gap-3">
          {/* Notices */}
          <div className="pm-card">
            <div className="pm-section-header">
              <div className="pm-section-title">Attendance Notices</div>
              <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => onNavigate && onNavigate('help')}>
                More
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {attendanceNotices.map((notice, i) => (
                <div className="pm-notice-item" key={i}>
                  <div className="pm-notice-icon" style={{ background: `${notice.color}18`, color: notice.color }}>
                    <notice.icon size={16} />
                  </div>
                  <div>
                    <div className="pm-notice-title">{notice.title}</div>
                    <div className="pm-notice-sub">{notice.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="pm-btn pm-btn-outline w-100 mt-3 pm-btn-sm" onClick={() => onNavigate && onNavigate('help')}>
              View All Notices
            </button>
          </div>

          {/* Leave Balance Card */}
          <div className="pm-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', opacity: 0.75, marginBottom: 12 }}>ANNUAL LEAVE BALANCE</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.85, marginBottom: 8 }}>Days Used</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.leaveDaysUsed}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.75 }}>of {totalAnnualLeave} days</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{
              height: 8,
              background: 'rgba(255,255,255,0.3)',
              borderRadius: 4,
              overflow: 'hidden',
              marginBottom: 16
            }}>
              <div style={{
                height: '100%',
                background: 'rgba(255,255,255,0.9)',
                width: `${(stats.leaveDaysUsed / totalAnnualLeave) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              paddingTop: 12,
              borderTop: 'rgba(255,255,255,0.2) 1px solid'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', opacity: 0.75, marginBottom: 4 }}>Used</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{stats.leaveDaysUsed}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', opacity: 0.75, marginBottom: 4 }}>Remaining</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{leaveDaysRemaining}</div>
              </div>
            </div>

            <button
              className="pm-btn pm-btn-primary"
              onClick={() => setIsLeaveModalOpen(true)}
              style={{
                width: '100%',
                marginTop: 16,
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <Plus size={16} /> Request Time Off
            </button>
          </div>
        </div>
      </div>

      {/* Leave Requests Section */}
      <div className="pm-card" style={{ marginTop: 24 }}>
        <div className="pm-section-header">
          <div>
            <div className="pm-section-title">Leave & Time Off Requests</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>Your leave request history and status</div>
          </div>
          <button
            className="pm-btn pm-btn-primary pm-btn-sm"
            onClick={() => setIsLeaveModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={16} /> New Request
          </button>
        </div>

        {/* Filter Controls */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 16,
          overflowX: 'auto',
          paddingBottom: 4
        }}>
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterLeave(status)}
              style={{
                padding: '6px 12px',
                border: filterLeave === status ? 'none' : '1px solid var(--pm-border)',
                background: filterLeave === status ? 'var(--pm-primary)' : 'transparent',
                color: filterLeave === status ? '#fff' : 'var(--pm-text-primary)',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (filterLeave !== status) {
                  e.target.style.background = 'var(--pm-surface-2)';
                }
              }}
              onMouseLeave={(e) => {
                if (filterLeave !== status) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Leave Requests Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="pm-table">
            <thead>
              <tr>
                <th>LEAVE TYPE</th>
                <th>START DATE</th>
                <th>END DATE</th>
                <th>DURATION</th>
                <th>REASON</th>
                <th>STATUS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaveRequests.length > 0 ? (
                filteredLeaveRequests.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{row.type}</td>
                    <td>{new Date(row.startDate).toLocaleDateString('en-GB')}</td>
                    <td>{new Date(row.endDate).toLocaleDateString('en-GB')}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.duration} days</td>
                    <td style={{ color: 'var(--pm-text-muted)', fontSize: '0.9rem' }}>{row.reason}</td>
                    <td>{statusBadge(row.status)}</td>
                    <td>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 4,
                          transition: 'background 0.2s',
                          color: 'var(--pm-primary)'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'var(--pm-surface-2)'}
                        onMouseLeave={(e) => e.target.style.background = 'none'}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--pm-text-muted)' }}>
                    No leave requests found with this filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Holiday Calendar */}
      <div className="pm-card" style={{ marginTop: 24 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: '1px solid var(--pm-border)'
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: 'var(--pm-surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--pm-primary)'
          }}>
            <Calendar size={20} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Hospital Holiday Calendar</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
          {holidays.map((holiday, i) => (
            <div
              key={i}
              style={{
                padding: 16,
                border: '1px solid var(--pm-border)',
                borderRadius: 8,
                background: 'var(--pm-surface)'
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--pm-primary)', marginBottom: 4 }}>
                {new Date(holiday.date).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
                {holiday.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--pm-text-muted)' }}>
                {holiday.type}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Request Modal */}
      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleAddLeaveRequest}
      />
    </div>
  );
}