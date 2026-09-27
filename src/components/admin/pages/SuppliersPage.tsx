import { useState } from 'react'
import { Search, ShieldAlert } from 'lucide-react'
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

export function SuppliersPage({ locale }: Props) {
  const { suppliers, loading } = useAdminData()
  const [search, setSearch] = useState('')

  const filtered = suppliers.filter(s => {
    const q = search.toLowerCase()
    return !search || s.name.toLowerCase().includes(q) || s.contactName.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
  })

  return (
    <>
      <PageHeading
        title={copy(locale, 'Internal Suppliers Directory', 'الموردين الداخليين والموزعين')}
        eyebrow={copy(locale, 'CONFIDENTIAL PROCUREMENT DATA', 'بيانات التوريد السرية والداخلية')}
        action={copy(locale, 'Register Supplier', 'تسجيل مورد جديد')}
      />

      <div
        style={{
          background: '#102c3b',
          color: '#ffffff',
          padding: '12px 18px',
          borderRadius: '4px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '12px'
        }}
      >
        <ShieldAlert size={18} color="#c1712e" />
        <span>
          <strong>INTERNAL ONLY:</strong> Supplier directory and terms remain strictly private to authorized OmniNetix staff. Never exposed to public storefront APIs.
        </span>
      </div>

      <div className="admin-toolbar">
        <label>
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={copy(locale, 'Search supplier, contact person, location...', 'ابحث باسم المورد، جهة الاتصال، الموقع...')}
          />
        </label>
      </div>

      <Panel>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th>Primary Contact</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Status</th>
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
                filtered.map(supp => (
                  <tr key={supp.id}>
                    <td>
                      <b>{supp.name}</b>
                    </td>
                    <td>{supp.contactName}</td>
                    <td>{supp.phone}</td>
                    <td>{supp.email}</td>
                    <td>{supp.location}</td>
                    <td>★ {supp.rating}/5</td>
                    <td>
                      <StatusBadge status={supp.status} />
                    </td>
                    <td>
                      <button className="admin-row-action">Manage</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      title="No internal suppliers registered"
                      detail="Add verified distributor or vendor channels to enable internal sourcing comparison."
                      action="Register Supplier"
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
