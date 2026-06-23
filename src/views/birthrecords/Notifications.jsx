import React, { useState, useMemo } from 'react';
import {
  Bell, Baby, CheckCircle, AlertCircle, Wrench, Shield, KeyRound,
  Archive, Check, X, CheckCheck, BellOff,
} from 'lucide-react';

// ---- Demo notifications ------------------------------------------------------
const INITIAL = [
  {
    id: 'n1', category: 'records', icon: Baby, iconBg: '#e0f2fe', iconColor: '#0284c7',
    title: 'New batch received',
    body: '200 birth records were received from Neonatal Unit-A and are ready for review.',
    time: '14 minutes ago', read: false,
  },
  {
    id: 'n2', category: 'records', icon: AlertCircle, iconBg: '#fee2e2', iconColor: '#dc2626',
    title: '50 records returned for amendment',
    body: 'A batch was sent back due to missing physician signatures. Action required before the end of day.',
    time: '3 hours ago', read: false,
  },
  {
    id: 'n3', category: 'security', icon: KeyRound, iconBg: '#ede9fe', iconColor: '#7c3aed',
    title: 'Security credentials renewed',
    body: 'Your registrar access credentials were renewed successfully. Next renewal due in 90 days.',
    time: '5 hours ago', read: false,
  },
  {
    id: 'n4', category: 'records', icon: CheckCircle, iconBg: '#dcfce7', iconColor: '#16a34a',
    title: '150 certificates approved',
    body: 'Digital birth certificates were approved and queued for issuance.',
    time: '1 hour ago', read: true,
  },
  {
    id: 'n5', category: 'system', icon: Wrench, iconBg: '#e0f2fe', iconColor: '#0284c7',
    title: 'Scheduled maintenance: March 15',
    body: 'The registration portal will be offline for 2 hours starting 02:00 AM EST for database optimization. Save active drafts.',
    time: '2 hours ago', read: false,
  },
  {
    id: 'n6', category: 'security', icon: Shield, iconBg: '#ede9fe', iconColor: '#7c3aed',
    title: 'Updated data privacy protocols',
    body: 'New HIPAA-compliant encryption standards are now in effect for all neonatal record transfers. Review the updated handbook.',
    time: 'Yesterday', read: true,
  },
  {
    id: 'n7', category: 'system', icon: Archive, iconBg: '#f1f5f9', iconColor: '#475569',
    title: 'Batch export completed',
    body: '120 records were archived to PDF and stored in the secure repository.',
    time: 'Yesterday', read: true,
  },
];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'records', label: 'Records' },
  { key: 'system', label: 'System' },
  { key: 'security', label: 'Security' },
];

export default function Notifications() {
  const [items, setItems] = useState(INITIAL);
  const [filter, setFilter] = useState('all');

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const visible = useMemo(() => {
    if (filter === 'all') return items;
    if (filter === 'unread') return items.filter((n) => !n.read);
    return items.filter((n) => n.category === filter);
  }, [items, filter]);

  const markRead = (id) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const dismiss = (id) => setItems((prev) => prev.filter((n) => n.id !== id));

  return (
    <div>
      <div className="pm-card">
        {/* Header */}
        <div className="pm-section-header">
          <div className="pm-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={18} style={{ color: 'var(--pm-primary)' }} /> Notifications
            {unreadCount > 0 && (
              <span className="pm-badge pm-badge-danger" style={{ marginLeft: 4 }}>{unreadCount} new</span>
            )}
          </div>
          <button
            className="pm-btn pm-btn-ghost pm-btn-sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            style={{ opacity: unreadCount === 0 ? 0.5 : 1 }}
          >
            <CheckCheck size={14} /> Mark all as read
          </button>
        </div>

        {/* Filter segmented control */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
          {FILTERS.map((f) => {
            const active = filter === f.key;
            const count = f.key === 'unread' ? unreadCount : null;
            return (
              <button
                key={f.key}
                className="pm-btn pm-btn-sm"
                onClick={() => setFilter(f.key)}
                style={{
                  borderRadius: 20,
                  border: active ? 'none' : '1px solid var(--pm-border)',
                  background: active ? 'var(--pm-primary)' : 'transparent',
                  color: active ? '#fff' : 'var(--pm-text-muted)',
                }}
              >
                {f.label}
                {count != null && count > 0 && (
                  <span style={{ marginLeft: 5, fontWeight: 700, opacity: 0.9 }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* List */}
        {visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--pm-text-muted)' }}>
            <BellOff size={30} style={{ opacity: 0.4, marginBottom: 10 }} />
            <div style={{ fontSize: '0.9rem' }}>
              {filter === 'unread' ? 'You’re all caught up — no unread notifications.' : 'No notifications to show.'}
            </div>
          </div>
        ) : (
          visible.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className="pm-notice-item"
                onClick={() => !n.read && markRead(n.id)}
                style={{
                  cursor: n.read ? 'default' : 'pointer',
                  position: 'relative',
                  borderLeft: n.read ? '3px solid transparent' : '3px solid var(--pm-primary)',
                  background: n.read ? 'transparent' : 'var(--pm-primary-light)',
                  borderRadius: 10,
                  paddingLeft: 12,
                }}
              >
                <div className="pm-notice-icon" style={{ background: n.iconBg, color: n.iconColor, width: 40, height: 40, borderRadius: 10, flexShrink: 0 }}>
                  <Icon size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="pm-notice-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {n.title}
                    {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--pm-primary)', flexShrink: 0 }} />}
                  </div>
                  <div className="pm-notice-sub" style={{ marginTop: 3 }}>{n.body}</div>
                  <div className="pm-notice-time" style={{ marginTop: 6 }}>{n.time}</div>
                </div>

                {/* Per-item actions */}
                <div style={{ display: 'flex', gap: 4, marginLeft: 8, flexShrink: 0 }}>
                  {!n.read && (
                    <button
                      className="pm-btn pm-btn-ghost pm-btn-sm"
                      onClick={(e) => { e.stopPropagation(); markRead(n.id); }}
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    className="pm-btn pm-btn-ghost pm-btn-sm"
                    onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                    title="Dismiss"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {visible.length > 0 && (
          <div style={{ marginTop: 14, fontSize: '0.75rem', color: 'var(--pm-text-muted)' }}>
            Showing {visible.length} of {items.length} notifications
          </div>
        )}
      </div>
    </div>
  );
}