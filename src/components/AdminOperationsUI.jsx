import React from 'react';
import * as Icons from 'lucide-react';

export const money = (value) => new Intl.NumberFormat('en-ZW', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 2,
}).format(Number(value || 0));

export function PageHeader({ icon = 'LayoutDashboard', title, subtitle, actions }) {
  const Icon = Icons[icon] || Icons.LayoutDashboard;
  return (
    <div className="ops-page-header">
      <div className="ops-page-heading">
        <div className="ops-page-icon"><Icon size={22} /></div>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      {actions && <div className="ops-page-actions">{actions}</div>}
    </div>
  );
}

export function MetricCard({ icon = 'Activity', label, value, note, tone = 'primary' }) {
  const Icon = Icons[icon] || Icons.Activity;
  return (
    <div className={`ops-metric ops-tone-${tone}`}>
      <div className="ops-metric-top">
        <span className="ops-metric-icon"><Icon size={17} /></span>
        <span className="ops-metric-label">{label}</span>
      </div>
      <div className="ops-metric-value">{value}</div>
      <div className="ops-metric-note">{note}</div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const key = String(status || '').toLowerCase();
  let cls = 'pm-badge-neutral';
  if (['paid', 'complete', 'completed', 'available', 'active', 'discharged', 'resolved', 'in service', 'ready'].includes(key)) cls = 'pm-badge-success';
  if (['pending', 'waiting', 'scheduled', 'observation', 'maintenance due', 'partial', 'awaiting payment', 'admitted'].includes(key)) cls = 'pm-badge-warning';
  if (['critical', 'overdue', 'retired', 'cancelled', 'unpaid', 'emergency'].includes(key)) cls = 'pm-badge-danger';
  if (['in consultation', 'triaged', 'processing', 'inspection', 'high', 'urgent'].includes(key)) cls = 'pm-badge-info';
  return <span className={`pm-badge ${cls}`}>{status}</span>;
}

export function SearchFilter({ search, onSearch, placeholder = 'Search…', children }) {
  return (
    <div className="ops-toolbar">
      <div className="ops-search-wrap">
        <Icons.Search size={16} />
        <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder={placeholder} />
      </div>
      <div className="ops-toolbar-filters">{children}</div>
    </div>
  );
}

export function Modal({ open, onClose, title, subtitle, icon = 'FileText', size = 'md', children, footer }) {
  if (!open) return null;
  const Icon = Icons[icon] || Icons.FileText;
  return (
    <div className="ops-modal-backdrop" onMouseDown={onClose}>
      <div className={`ops-modal ops-modal-${size}`} onMouseDown={(e) => e.stopPropagation()}>
        <div className="ops-modal-header">
          <div className="ops-modal-title-wrap">
            <div className="ops-modal-icon"><Icon size={18} /></div>
            <div>
              <h3>{title}</h3>
              {subtitle && <p>{subtitle}</p>}
            </div>
          </div>
          <button className="ops-icon-button" onClick={onClose} aria-label="Close"><Icons.X size={18} /></button>
        </div>
        <div className="ops-modal-body">{children}</div>
        {footer && <div className="ops-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function FormField({ label, children, hint }) {
  return (
    <label className="ops-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function DetailGrid({ children }) {
  return <div className="ops-detail-grid">{children}</div>;
}

export function DetailItem({ label, value, wide = false }) {
  return (
    <div className={`ops-detail-item${wide ? ' wide' : ''}`}>
      <span>{label}</span>
      <strong>{value ?? '—'}</strong>
    </div>
  );
}

export function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="ops-toast">
      <Icons.CheckCircle2 size={17} />
      <span>{message}</span>
      <button onClick={onClose}><Icons.X size={14} /></button>
    </div>
  );
}

export function EmptyState({ icon = 'Inbox', title = 'No records found', text = 'Try changing your filters.' }) {
  const Icon = Icons[icon] || Icons.Inbox;
  return (
    <div className="ops-empty">
      <Icon size={30} />
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}
