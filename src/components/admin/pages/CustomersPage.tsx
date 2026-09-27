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

export function CustomersPage({ locale }: Props) {
  const { customers, loading } = useAdminData()
  const [search, setSearch] = useState('')

  const filtered = customers.filter(c => {
    const q = search.toLowerCase()
    return !search || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  })

  return (
    <>
      <PageHeading
        title={copy(locale, 'Customers Directory', 'دليل العملاء والشركات')}
        eyebrow={copy(locale, 'CLIENT ACCOUNTS & ENTERPRISE PARTNERS', 'إدارة العلاقات والشركاء')}
        action={copy(locale, 'Add Customer Record', 'إضافة عميل')}
      />

      <div className="admin-toolbar">
        <label>
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={copy(locale, 'Search customer name, email, company...', 'ابحث باسم العميل، البريد، الشركة...')}
          />
        </label>
      </div>

      <Panel>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Company / Organization</th>
                <th>Business Email</th>
                <th>Phone Contact</th>
                <th>Location</th>
                <th>Requests Count</th>
                <th>Tier / Status</th>
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
                filtered.map(cust => (
                  <tr key={cust.id}>
                    <td>
                      <b>{cust.name}</b>
                    </td>
                    <td>{cust.company || '—'}</td>
                    <td>{cust.email}</td>
                    <td>{cust.phone || '—'}</td>
                    <td>{cust.location}</td>
                    <td>{cust.totalRequests} request(s)</td>
                    <td>
                      <StatusBadge status={cust.status} />
                    </td>
                    <td>
                      <button className="admin-row-action">Profile</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      title="No customers registered"
                      detail="Customer records will accumulate automatically as sourcing requests are submitted."
                      action="Add Customer Record"
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
