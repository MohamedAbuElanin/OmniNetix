import { useState } from 'react'
import { Search, X } from 'lucide-react'
import type { Locale, SourcingRequest } from '../../../types/database.types'
import { useAdminData } from '../../../hooks/useAdminData'
import {
  EmptyState,
  PageHeading,
  Panel,
  RestrictedState,
  SkeletonRows,
  StatusBadge
} from '../AdminPrimitives'

type Props = {
  locale: Locale
}

const copy = (locale: Locale, en: string, ar: string) => (locale === 'ar' ? ar : en)

export function RequestsPage({ locale }: Props) {
  const { requests, loading, isDevState } = useAdminData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedReq, setSelectedReq] = useState<SourcingRequest | null>(null)

  const filtered = requests.filter(r => {
    const matchesStatus = !statusFilter || r.status === statusFilter
    const query = `${r.reference} ${r.customerName} ${r.company} ${r.customerEmail}`.toLowerCase()
    const matchesSearch = !search || query.includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <>
      <PageHeading
        title={copy(locale, 'Sourcing Requests', 'طلبات التوريد والتسليم')}
        eyebrow={copy(locale, 'SALES & PROCUREMENT WORKFLOW', 'إدارة الطلبات والعمليات')}
        action={copy(locale, 'Create Manual Request', 'إنشاء طلب يدوي')}
      />

      {isDevState && (
        <RestrictedState
          title={copy(
            locale,
            'Staff Session Required for Production Request Flow',
            'يتطلب وصول موظفي التوريد لعرض كافة الجداول التشغيلية'
          )}
        />
      )}

      <div className="admin-toolbar">
        <label>
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={copy(locale, 'Search reference, customer, company...', 'ابحث بالرقم المرجعي، العميل، الشركة...')}
          />
        </label>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">{copy(locale, 'All Workflow Statuses', 'جميع حالات الطلبات')}</option>
          <option value="new">New</option>
          <option value="under_review">Under Review</option>
          <option value="sourcing">Sourcing</option>
          <option value="quote_preparation">Quote Preparation</option>
          <option value="quote_sent">Quote Sent</option>
          <option value="awaiting_customer">Awaiting Customer</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <Panel>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Request Ref</th>
                <th>Customer & Company</th>
                <th>Contact Email</th>
                <th>Items</th>
                <th>Workflow Status</th>
                <th>Created Date</th>
                <th>Assigned Staff</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>
                    <SkeletonRows rows={5} />
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map(req => (
                  <tr key={req.id}>
                    <td>
                      <b>{req.reference}</b>
                    </td>
                    <td>
                      <b>{req.customerName}</b>
                      <small>{req.company || 'Direct Client'}</small>
                    </td>
                    <td>{req.customerEmail}</td>
                    <td>{req.itemCount} line(s)</td>
                    <td>
                      <StatusBadge status={req.status} />
                    </td>
                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td>{req.assignedTo || 'Unassigned'}</td>
                    <td>
                      <button className="admin-row-action" onClick={() => setSelectedReq(req)}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      title="No sourcing requests found"
                      detail="No active customer sourcing requests are logged in this view."
                      action="Create Manual Request"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {selectedReq && (
        <RequestDetailModal
          locale={locale}
          request={selectedReq}
          onClose={() => setSelectedReq(null)}
        />
      )}
    </>
  )
}

function RequestDetailModal({
  locale,
  request,
  onClose
}: {
  locale: Locale
  request: SourcingRequest
  onClose: () => void
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(16, 44, 59, 0.6)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '680px',
          height: '100vh',
          overflowY: 'auto',
          padding: '28px',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '10px', color: '#c1712e', fontStyle: 'normal', fontWeight: 700, letterSpacing: '1px' }}>
              REQUEST DETAIL — {request.reference}
            </span>
            <h2 style={{ margin: '4px 0 0', fontSize: '22px' }}>{request.customerName}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 0, cursor: 'pointer' }}>
            <X size={22} color="#102c3b" />
          </button>
        </div>

        <div style={{ background: '#f5f6f3', border: '1px solid #d9dfdc', padding: '16px', borderRadius: '4px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
            <div>
              <span style={{ color: '#60737b', display: 'block' }}>Business Email</span>
              <strong style={{ color: '#102c3b' }}>{request.customerEmail}</strong>
            </div>
            <div>
              <span style={{ color: '#60737b', display: 'block' }}>Company / Organization</span>
              <strong style={{ color: '#102c3b' }}>{request.company || '—'}</strong>
            </div>
            <div>
              <span style={{ color: '#60737b', display: 'block' }}>Current Status</span>
              <StatusBadge status={request.status} />
            </div>
            <div>
              <span style={{ color: '#60737b', display: 'block' }}>Created Date</span>
              <strong style={{ color: '#102c3b' }}>{new Date(request.createdAt).toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '15px', color: '#102c3b', marginBottom: '10px' }}>Workflow Progress Timeline</h3>
        <div style={{ border: '1px solid #d9dfdc', padding: '16px', background: '#fff', borderRadius: '4px', marginBottom: '20px' }}>
          {[
            ['01', 'Request Received', 'New sourcing ticket created'],
            ['02', 'Reviewing Requirements', 'Specification verified'],
            ['03', 'Sourcing Products', 'Engaging supplier network'],
            ['04', 'Preparing Quote', 'Calculating commercial offer'],
            ['05', 'Quote Sent', 'Official proposal sent to client']
          ].map(([num, stage, desc], idx) => (
            <div
              key={num}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '10px 0',
                borderBottom: idx < 4 ? '1px solid #e3e8e6' : '0'
              }}
            >
              <b style={{ color: '#c1712e', fontSize: '12px' }}>{num}</b>
              <div>
                <strong style={{ display: 'block', fontSize: '13px', color: '#102c3b' }}>{stage}</strong>
                <span style={{ fontSize: '11px', color: '#60737b' }}>{desc}</span>
              </div>
            </div>
          ))}
        </div>

        {request.notes && (
          <div style={{ background: '#fff', border: '1px solid #d9dfdc', padding: '16px', borderRadius: '4px' }}>
            <strong style={{ fontSize: '13px', color: '#102c3b', display: 'block', marginBottom: '6px' }}>
              Customer Notes / Specifications
            </strong>
            <p style={{ margin: 0, fontSize: '12px', color: '#60737b', lineHeight: 1.5 }}>{request.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
