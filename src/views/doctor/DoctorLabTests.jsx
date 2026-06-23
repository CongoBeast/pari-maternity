import React, { useState } from 'react';
import {
  Flask, CheckCircle, Clock, AlertCircle, Plus, X, Info, Siren, FlaskConical,
  Filter, Download, Eye, Search
} from 'lucide-react';

// Sample lab test data
const labTests = [
  { id: 'LT001', patient: 'Tendai Moyo',        test: 'Full Blood Count', orderDate: 'Oct 20', dueDate: 'Oct 24', status: 'completed', result: 'Normal', priority: 'routine' },
  { id: 'LT002', patient: 'Chipo Zvobgo',       test: 'Glucose Tolerance Test', orderDate: 'Oct 21', dueDate: 'Oct 25', status: 'pending', result: '—', priority: 'urgent' },
  { id: 'LT003', patient: 'Rudo Mafuka',        test: 'Liver Function Tests', orderDate: 'Oct 18', dueDate: 'Oct 23', status: 'delayed', result: '—', priority: 'routine' },
  { id: 'LT004', patient: 'Tariro Gumbo',       test: 'Kidney Function Panel', orderDate: 'Oct 22', dueDate: 'Oct 26', status: 'completed', result: 'Normal', priority: 'routine' },
  { id: 'LT005', patient: 'Tendai Moyo',        test: 'Thyroid Function (TSH)', orderDate: 'Oct 22', dueDate: 'Oct 27', status: 'in_progress', result: '—', priority: 'routine' },
  { id: 'LT006', patient: 'Chipo Zvobgo',       test: 'HIV Screening', orderDate: 'Oct 21', dueDate: 'Oct 24', status: 'completed', result: 'Negative', priority: 'urgent' },
  { id: 'LT007', patient: 'Rudo Mafuka',        test: 'Syphilis RPR Test', orderDate: 'Oct 20', dueDate: 'Oct 23', status: 'completed', result: 'Negative', priority: 'routine' },
  { id: 'LT008', patient: 'Tariro Gumbo',       test: 'Blood Group & Type', orderDate: 'Oct 22', dueDate: 'Oct 24', status: 'pending', result: '—', priority: 'routine' },
];

const labNotices = [
  { icon: AlertCircle, color: 'var(--pm-danger)', title: 'Urgent: Reagent Shortage', sub: 'Glucose reagents low - expect 2-3 day delays on GTT' },
  { icon: Clock, color: 'var(--pm-warning)', title: 'Lab Hours Extended', sub: 'Weekend hours: Sat & Sun 9AM–2PM (urgent tests only)' },
  { icon: Info, color: 'var(--pm-info)', title: 'New Sample Collection Protocol', sub: 'Updated guidelines for blood samples - review in Help Center' },
  { icon: Siren, color: 'var(--pm-danger)', title: 'Equipment Maintenance', sub: 'Automated analyzer down Oct 26–27. Manual processing only.' },
];

function statusBadge(status, priority) {
  const statusMap = {
    completed: { class: 'pm-badge-success', label: 'Completed' },
    pending: { class: 'pm-badge-warning', label: 'Pending' },
    in_progress: { class: 'pm-badge-info', label: 'In Progress' },
    delayed: { class: 'pm-badge-danger', label: 'Delayed' },
  };
  const config = statusMap[status] || { class: 'pm-badge-neutral', label: status };
  return <span className={`pm-badge ${config.class}`}>{config.label}</span>;
}

function priorityBadge(priority) {
  const map = {
    urgent: { color: 'var(--pm-danger)', bg: '#fee2e2' },
    routine: { color: '#6b7280', bg: '#f3f4f6' },
  };
  const config = map[priority] || { color: '#6b7280', bg: '#f3f4f6' };
  return (
    <span style={{
      fontSize: '0.65rem',
      fontWeight: 600,
      color: config.color,
      background: config.bg,
      padding: '3px 7px',
      borderRadius: 12,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      {priority}
    </span>
  );
}

function RequestModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    patientName: '',
    testType: 'FBC',
    priority: 'routine',
    notes: ''
  });

  const testOptions = [
    'Full Blood Count (FBC)',
    'Glucose Tolerance Test',
    'Liver Function Tests (LFTs)',
    'Kidney Function Panel (U&E)',
    'Thyroid Function (TSH)',
    'Blood Group & Type',
    'HIV Screening',
    'Syphilis RPR Test',
    'Pregnancy Test (uHCG)',
    'Hepatitis Panel',
    'Malaria Test',
    'Cholesterol Panel',
    'Urine Analysis',
    'Stool Analysis',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName.trim() || !formData.testType.trim()) {
      alert('Please fill in patient name and test type');
      return;
    }
    onSubmit(formData);
    setFormData({ patientName: '', testType: 'FBC', priority: 'routine', notes: '' });
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
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Request New Lab Test</h3>
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
              Patient Name *
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Enter patient name"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--pm-border)',
                borderRadius: 6,
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--pm-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--pm-border)';
                e.target.style.boxShadow = 'none';
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
              Test Type *
            </label>
            <select
              name="testType"
              value={formData.testType}
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
              <option value="">Select a test...</option>
              {testOptions.map((test, i) => (
                <option key={i} value={test}>{test}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: 6,
              color: 'var(--pm-text-primary)'
            }}>
              Priority
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              {['routine', 'urgent'].map(opt => (
                <label key={opt} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  flex: 1,
                  padding: '10px 12px',
                  border: `2px solid ${formData.priority === opt ? 'var(--pm-primary)' : 'var(--pm-border)'}`,
                  borderRadius: 6,
                  background: formData.priority === opt ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                  transition: 'all 0.2s'
                }}>
                  <input
                    type="radio"
                    name="priority"
                    value={opt}
                    checked={formData.priority === opt}
                    onChange={handleChange}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize' }}>{opt}</span>
                </label>
              ))}
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
              Clinical Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any relevant clinical information..."
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--pm-border)',
                borderRadius: 6,
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                resize: 'vertical',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--pm-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--pm-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
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
              Request Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DoctorLabTests({ user, onNavigate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tests, setTests] = useState(labTests);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleAddTest = (formData) => {
    const newTest = {
      id: `LT${String(tests.length + 1).padStart(3, '0')}`,
      patient: formData.patientName,
      test: formData.testType,
      orderDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: 'pending',
      result: '—',
      priority: formData.priority
    };
    setTests([newTest, ...tests]);
    setIsModalOpen(false);
  };

  const filteredTests = filterStatus === 'all' ? tests : tests.filter(t => t.status === filterStatus);

  const stats = {
    total: tests.length,
    completed: tests.filter(t => t.status === 'completed').length,
    pending: tests.filter(t => t.status === 'pending' || t.status === 'in_progress').length,
    delayed: tests.filter(t => t.status === 'delayed').length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div>
      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="pm-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <FlaskConical size={20} style={{ opacity: 0.8, color: '#fff' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, opacity: 0.85, background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 20 }}>Total</span>
            </div>
            <div className="pm-card-title" style={{ color: 'rgba(255,255,255,0.7)' }}>Tests Ordered</div>
            <div className="pm-stat-value" style={{ color: '#fff', fontSize: '2.4rem' }}>{stats.total}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: 4 }}>This month</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="pm-stat-card secondary">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <CheckCircle size={20} style={{ color: 'var(--pm-primary)', opacity: 0.8 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: 20 }}>+{completionRate}%</span>
            </div>
            <div className="pm-card-title">Completed</div>
            <div className="pm-stat-value">{stats.completed}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 4 }}>{completionRate}% completion rate</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="pm-stat-card secondary">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Clock size={20} style={{ color: 'var(--pm-primary)', opacity: 0.8 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#f59e0b', background: '#fef3c7', padding: '2px 8px', borderRadius: 20 }}>Pending</span>
            </div>
            <div className="pm-card-title">In Progress</div>
            <div className="pm-stat-value">{stats.pending}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 4 }}>Awaiting results</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="pm-stat-card secondary" style={{ border: '1px solid var(--pm-danger)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <AlertCircle size={20} style={{ color: 'var(--pm-primary)', opacity: 0.8 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--pm-danger)', background: '#fee2e2', padding: '2px 8px', borderRadius: 20 }}>Overdue</span>
            </div>
            <div className="pm-card-title">Delayed</div>
            <div className="pm-stat-value">{stats.delayed}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pm-text-muted)', marginTop: 4 }}>Follow up required</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Test Results Table */}
        <div className="col-12 col-lg-8">
          <div className="pm-card">
            <div className="pm-section-header">
              <div>
                <div className="pm-section-title">Lab Test Results</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)' }}>Track all test requests and results</div>
              </div>
              <button
                className="pm-btn pm-btn-primary pm-btn-sm"
                onClick={() => setIsModalOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Plus size={16} /> Request Test
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
              {['all', 'completed', 'pending', 'in_progress', 'delayed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '6px 12px',
                    border: filterStatus === status ? 'none' : '1px solid var(--pm-border)',
                    background: filterStatus === status ? 'var(--pm-primary)' : 'transparent',
                    color: filterStatus === status ? '#fff' : 'var(--pm-text-primary)',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (filterStatus !== status) {
                      e.target.style.background = 'var(--pm-surface-2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filterStatus !== status) {
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
                    <th>PATIENT</th>
                    <th>TEST TYPE</th>
                    <th>ORDERED</th>
                    <th>DUE</th>
                    <th>PRIORITY</th>
                    <th>STATUS</th>
                    <th>RESULT</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.length > 0 ? (
                    filteredTests.map((row, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{row.patient}</td>
                        <td style={{ color: 'var(--pm-text-muted)', fontSize: '0.9rem' }}>{row.test}</td>
                        <td style={{ fontSize: '0.9rem' }}>{row.orderDate}</td>
                        <td style={{ fontSize: '0.9rem' }}>{row.dueDate}</td>
                        <td>{priorityBadge(row.priority)}</td>
                        <td>{statusBadge(row.status, row.priority)}</td>
                        <td style={{ fontWeight: 600, color: row.result === 'Normal' || row.result === 'Negative' ? '#16a34a' : 'var(--pm-text-primary)' }}>
                          {row.result}
                        </td>
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
                      <td colSpan="8" style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--pm-text-muted)' }}>
                        No tests found with this filter
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Lab Notices */}
        <div className="col-12 col-lg-4 d-flex flex-column gap-3">
          <div className="pm-card">
            <div className="pm-section-header">
              <div className="pm-section-title">Lab Notices & Updates</div>
              <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => onNavigate && onNavigate('help')}>
                More
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {labNotices.map((notice, i) => (
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

          {/* Quick Stats Card */}
          <div className="pm-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', opacity: 0.75, marginBottom: 12 }}>TURNAROUND TIME</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: 6 }}>Average</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>3-5 days</div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              paddingTop: 12,
              borderTop: 'rgba(255,255,255,0.2) 1px solid'
            }}>
              <div style={{ paddingTop: 12 }}>
                <div style={{ fontSize: '0.7rem', opacity: 0.75, marginBottom: 4 }}>Routine</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>5–7 days</div>
              </div>
              <div style={{ paddingTop: 12 }}>
                <div style={{ fontSize: '0.7rem', opacity: 0.75, marginBottom: 4 }}>Urgent</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>24–48 hrs</div>
              </div>
            </div>
          </div>

          {/* Contacts Card */}
          <div className="pm-card">
            <div className="pm-section-title" style={{ marginBottom: 12 }}>Lab Contact Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--pm-text-primary)', marginBottom: 2 }}>Lab Reception</div>
                <div style={{ color: 'var(--pm-text-muted)' }}>+263 4 XXX XXXX</div>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--pm-text-primary)', marginBottom: 2 }}>Results Hotline</div>
                <div style={{ color: 'var(--pm-text-muted)' }}>+263 4 XXX XXXX Ext. 5</div>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--pm-text-primary)', marginBottom: 2 }}>Email</div>
                <div style={{ color: 'var(--pm-text-muted)', wordBreak: 'break-all' }}>lab@hospital.co.zw</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTest}
      />
    </div>
  );
}