import type { ReactNode } from 'react'
import { AlertTriangle, DatabaseZap, Plus, RefreshCw } from 'lucide-react'

export function PageHeading({
  title,
  eyebrow,
  action,
  onActionClick
}: {
  title: string
  eyebrow?: string
  action?: string
  onActionClick?: () => void
}) {
  return (
    <div className="admin-page-heading">
      <div>
        <span>{eyebrow || 'OPERATIONS'}</span>
        <h1>{title}</h1>
      </div>
      {action && (
        <button className="admin-primary" onClick={onActionClick}>
          <Plus size={17} />
          {action}
        </button>
      )}
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const formatted = status.replaceAll('_', ' ')
  return (
    <span className={`admin-status admin-status-${status.replaceAll('_', '-')}`}>
      {formatted}
    </span>
  )
}

export function EmptyState({
  title,
  detail,
  action,
  onActionClick
}: {
  title: string
  detail: string
  action?: string
  onActionClick?: () => void
}) {
  return (
    <div className="admin-empty">
      <DatabaseZap size={28} />
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
      {action && (
        <button className="admin-primary" onClick={onActionClick}>
          <Plus size={16} />
          {action}
        </button>
      )}
    </div>
  )
}

export function RestrictedState({
  title = 'Development & Security Notice'
}: {
  title?: string
}) {
  return (
    <div className="admin-restricted">
      <AlertTriangle size={18} />
      <div>
        <strong>{title}</strong>
        <p>
          Internal operational tables require an authenticated OmniNetix staff session with Supabase Row Level Security (RLS) privileges. Private costs and internal supplier terms are protected.
        </p>
      </div>
    </div>
  )
}

export function ErrorState({ detail, onRetry }: { detail: string; onRetry?: () => void }) {
  return (
    <div className="admin-error">
      <AlertTriangle size={18} />
      <div>
        <strong>Unable to load workspace data</strong>
        <p>{detail}</p>
      </div>
      <button className="admin-secondary" onClick={onRetry || (() => window.location.reload())}>
        <RefreshCw size={15} />
        Retry
      </button>
    </div>
  )
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="admin-skeletons" aria-label="Loading workspace data">
      {Array.from({ length: rows }).map((_, i) => (
        <i key={i} />
      ))}
    </div>
  )
}

export function Panel({
  title,
  action,
  children
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="admin-panel">
      {title && (
        <header>
          <h2>{title}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}
