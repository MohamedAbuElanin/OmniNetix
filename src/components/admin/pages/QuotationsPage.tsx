import { useState } from 'react'
import { Search } from 'lucide-react'
import type { Locale } from '../../../types/database.types'
import { useAdminData } from '../../../hooks/useAdminData'
import {
  EmptyState,
  PageHeading,
  Panel,
  SkeletonRows,
  StatusBadge
} from '../AdminPrimitives'

type Props = {
  locale: Locale
}

const copy = (locale: Locale, en: string, ar: string) => (locale === 'ar' ? ar : en)

export function QuotationsPage({ locale }: Props) {
  const { quotations, loading } = useAdminData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = quotations.filter(q => {
    const matchesStatus = !statusFilter || q.status === statusFilter
    const query = `${q.reference} ${q.customerName} ${q.requestId}`.toLowerCase()
    const matchesSearch = !search || query.includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <>
      <PageHeading
        title={copy(locale, 'Quotations Management', 'عروض الأسعار والحلول')}
        eyebrow={copy(locale, 'COMMERCIAL PROPOSALS & CLIENT OFFERS', 'عروض التوريد التجارية')}
        action={copy(locale, 'Draft New Quotation', 'إنشاء عرض سعر')}
      />

      <div className="admin-toolbar">
        <label>
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={copy(locale, 'Search quotation ref, customer...', 'ابحث بالرقم المرجعي، العميل...')}
          />
        </label>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">{copy(locale, 'All Quotation Statuses', 'جميع حالات العروض')}</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="viewed">Viewed</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <Panel>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Quotation Ref</th>
                <th>Request ID</th>
                <th>Customer Name</th>
                <th>Total Proposal Amount</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Created Date</th>
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
                filtered.map(quote => (
                  <tr key={quote.id}>
                    <td>
                      <b>{quote.reference}</b>
                    </td>
                    <td>{quote.requestId}</td>
                    <td>
                      <b>{quote.customerName}</b>
                    </td>
                    <td>
                      <strong style={{ color: '#1d4e6b' }}>
                        {quote.currency} {quote.totalAmount.toLocaleString()}
                      </strong>
                    </td>
                    <td>{new Date(quote.validUntil).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={quote.status} />
                    </td>
                    <td>{new Date(quote.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="admin-row-action">View / Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      title="No commercial quotations found"
                      detail="Generated quotations for customer requests will be listed here."
                      action="Draft New Quotation"
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
