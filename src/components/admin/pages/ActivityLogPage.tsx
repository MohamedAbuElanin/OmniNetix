import { useState } from 'react'
import { Search } from 'lucide-react'
import type { Locale } from '../../../types/database.types'
import { useAdminData } from '../../../hooks/useAdminData'
import { EmptyState, PageHeading, Panel, SkeletonRows } from '../AdminPrimitives'

type Props = {
  locale: Locale
}

const copy = (locale: Locale, en: string, ar: string) => (locale === 'ar' ? ar : en)

export function ActivityLogPage({ locale }: Props) {
  const { activityLogs, loading } = useAdminData()
  const [search, setSearch] = useState('')

  const filtered = activityLogs.filter(log => {
    const q = search.toLowerCase()
    return !search || log.user.toLowerCase().includes(q) || log.action.toLowerCase().includes(q) || log.summary.toLowerCase().includes(q)
  })

  return (
    <>
      <PageHeading
        title={copy(locale, 'System Activity Log & Audit Trail', 'سجل نشاطات النظام والعمليات')}
        eyebrow={copy(locale, 'SECURITY & AUDIT LOGS', 'سجل الأمان والتتبع')}
      />

      <div className="admin-toolbar">
        <label>
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={copy(locale, 'Search user, action, entity...', 'ابحث بالمستخدم، الإجراء، السجل...')}
          />
        </label>
      </div>

      <Panel>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Operator</th>
                <th>Action Type</th>
                <th>Target Entity</th>
                <th>Entity ID</th>
                <th>Summary Description</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <SkeletonRows rows={5} />
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map(log => (
                  <tr key={log.id}>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td>
                      <b>{log.user}</b>
                    </td>
                    <td>
                      <span
                        style={{
                          background: '#eaf0ef',
                          color: '#1d4e6b',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '3px 6px',
                          borderRadius: '3px'
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td>{log.entity}</td>
                    <td>
                      <code>{log.entityId}</code>
                    </td>
                    <td>{log.summary}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      title="No activity recorded"
                      detail="Audit trail logs for administrative mutations and staff activities will be listed here."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}
