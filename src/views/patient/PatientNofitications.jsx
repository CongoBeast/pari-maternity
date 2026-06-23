import React, { useState } from 'react';
import {
  Bell, FileText, CreditCard, Pill, Users, Megaphone,
  AlertCircle, CheckCircle2, Clock, ChevronRight, X,
} from 'lucide-react';

// ---- Mock notification data ---------------------------------------------
// In production these would come from the patient's notification feed via props/API.

const CATEGORY_META = {
  report: { label: 'Reports Due', icon: FileText, color: 'var(--pm-primary)' },
  billing: { label: 'Billing', icon: CreditCard, color: '#dc8a00' },
  medication: { label: 'Medication', icon: Pill, color: '#0d9488' },
  visitor: { label: 'Visitors', icon: Users, color: '#6f5cd6' },
  system: { label: 'Hospital', icon: Megaphone, color: 'var(--pm-text-muted)' },
};

const initialNotifications = [
  {
    id: 1,
    category: 'report',
    title: 'Glucose Tolerance Test results are ready',
    detail: 'Your lab report from May 18 has been uploaded for review.',
    time: '1 hour ago',
    read: false,
    actionLabel: 'View Report',
    priority: 'high',
  },
  {
    id: 2,
    category: 'medication',
    title: 'Iron Supplement — refill due in 3 days',
    detail: 'Your current supply of Ferrous Sulfate runs out May 27.',
    time: '3 hours ago',
    read: false,
    actionLabel: 'Request Refill',
    priority: 'medium',
  },
  {
    id: 3,
    category: 'billing',
    title: 'Outstanding balance for May 12 visit',
    detail: '$45.00 co-pay is due for your Morphology Scan visit.',
    time: '5 hours ago',
    read: false,
    actionLabel: 'Pay Now',
    priority: 'high',
  },
  {
    id: 4,
    category: 'visitor',
    title: 'David Okafor checked in to visit you',
    detail: 'Logged in at the maternity ward front desk.',
    time: 'Yesterday',
    read: true,
    actionLabel: null,
    priority: 'low',
  },
  {
    id: 5,
    category: 'report',
    title: 'Action needed: confirm Morphology Scan summary',
    detail: 'Please review and acknowledge the scan summary from Dr. Jenkins.',
    time: 'Yesterday',
    read: false,
    actionLabel: 'Review',
    priority: 'medium',
  },
  {
    id: 6,
    category: 'medication',
    title: 'Reminder: take your evening Prenatal Multivitamin',
    detail: 'Scheduled dose for 8:00 PM today.',
    time: 'Yesterday',
    read: true,
    actionLabel: null,
    priority: 'low',
  },
  {
    id: 7,
    category: 'system',
    title: 'New Maternity Yoga Classes starting Monday',
    detail: 'Free sessions in the Wellness Wing, every Monday at 10 AM.',
    time: '2 days ago',
    read: true,
    actionLabel: null,
    priority: 'low',
  },
  {
    id: 8,
    category: 'billing',
    title: 'Insurance pre-authorization approved',
    detail: 'Your upcoming Detailed Anatomy Scan is fully covered.',
    time: '3 days ago',
    read: true,
    actionLabel: null,
    priority: 'low',
  },
  {
    id: 9,
    category: 'visitor',
    title: 'Grace Okafor checked in to visit you',
    detail: 'Logged in at the maternity ward front desk.',
    time: '4 days ago',
    read: true,
    actionLabel: null,
    priority: 'low',
  },
  {
    id: 10,
    category: 'system',
    title: 'Scheduled Maintenance tonight at 12 AM',
    detail: 'Patient portal will be briefly offline for 30 minutes.',
    time: '4 days ago',
    read: true,
    actionLabel: null,
    priority: 'low',
  },
];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'report', label: 'Reports' },
  { key: 'billing', label: 'Billing' },
  { key: 'medication', label: 'Medication' },
  { key: 'visitor', label: 'Visitors' },
  { key: 'system', label: 'Hospital' },
];

function PriorityDot({ priority }) {
  if (priority !== 'high') return null;
  return (
    <span style={{
      width: 7, height: 7, borderRadius: '50%', background: 'var(--pm-danger, #dc3545)',
      flexShrink: 0, display: 'inline-block',
    }} />
  );
}

function NotificationRow({ n, onToggleRead, onDismiss, onAction }) {
  const meta = CATEGORY_META[n.category] || CATEGORY_META.system;
  const Icon = meta.icon;

  return (
    <div
      style={{
        display: 'flex', gap: 12, padding: '14px 4px', alignItems: 'flex-start',
        borderBottom: '1px solid var(--pm-border)',
        background: n.read ? 'transparent' : 'rgba(var(--pm-primary-rgb, 13,148,136), 0.04)',
        borderRadius: 8,
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        background: 'var(--pm-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} style={{ color: meta.color }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <PriorityDot priority={n.priority} />
          <div style={{
            fontSize: '0.86rem', fontWeight: n.read ? 500 : 700, color: 'var(--pm-text)',
          }}>
            {n.title}
          </div>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--pm-text-muted)', marginBottom: 8, lineHeight: 1.4 }}>
          {n.detail}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--pm-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={11} /> {n.time}
          </span>
          <span style={{ fontSize: '0.7rem', color: meta.color, fontWeight: 600 }}>
            {meta.label}
          </span>
          {n.actionLabel && (
            <button
              className="pm-btn pm-btn-ghost pm-btn-sm"
              style={{ padding: '2px 10px', fontSize: '0.74rem', height: 'auto' }}
              onClick={() => onAction(n)}
            >
              {n.actionLabel} <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
        <button
          title={n.read ? 'Mark as unread' : 'Mark as read'}
          onClick={() => onToggleRead(n.id)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            color: n.read ? 'var(--pm-text-muted)' : 'var(--pm-primary)',
          }}
        >
          <CheckCircle2 size={15} />
        </button>
        <button
          title="Dismiss"
          onClick={() => onDismiss(n.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--pm-text-muted)' }}
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}

export default function PatientNotifications({ user }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => filter === 'all' || n.category === filter);

  const toggleRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  const dismiss = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleAction = (n) => {
    // Placeholder: wire this up to real navigation/actions (e.g. open billing page,
    // open report viewer, open refill request flow) once backend routes exist.
    toggleRead(n.id);
  };

  const counts = FILTERS.reduce((acc, f) => {
    acc[f.key] = f.key === 'all' ? notifications.length : notifications.filter((n) => n.category === f.key).length;
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="pm-card mb-3" style={{
        background: 'linear-gradient(135deg, var(--pm-primary) 0%, var(--pm-primary-dark) 100%)',
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <Bell size={22} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9,
                background: 'var(--pm-danger, #dc3545)', color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                border: '2px solid var(--pm-primary)',
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.1 }}>
              Notifications
            </div>
            <div style={{ fontSize: '0.82rem', opacity: 0.85, marginTop: 2 }}>
              {unreadCount > 0 ? `${unreadCount} unread · reports, billing, medication & visitor updates` : 'You\u2019re all caught up'}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              className="pm-btn pm-btn-sm"
              onClick={markAllRead}
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto', paddingBottom: 2 }}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="pm-btn pm-btn-sm"
            style={{
              flexShrink: 0,
              background: filter === f.key ? 'var(--pm-primary)' : 'var(--pm-surface-2)',
              color: filter === f.key ? '#fff' : 'var(--pm-text-muted)',
              border: filter === f.key ? 'none' : '1px solid var(--pm-border)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {f.label}
            <span style={{
              fontSize: '0.65rem', opacity: 0.85, background: filter === f.key ? 'rgba(255,255,255,0.25)' : 'var(--pm-border)',
              borderRadius: 10, padding: '0 6px',
            }}>
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="pm-card">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--pm-text-muted)' }}>
            <AlertCircle size={28} style={{ marginBottom: 10, opacity: 0.5 }} />
            <div style={{ fontSize: '0.88rem' }}>No notifications in this category.</div>
          </div>
        ) : (
          filtered.map((n) => (
            <NotificationRow
              key={n.id}
              n={n}
              onToggleRead={toggleRead}
              onDismiss={dismiss}
              onAction={handleAction}
            />
          ))
        )}
      </div>
    </div>
  );
}