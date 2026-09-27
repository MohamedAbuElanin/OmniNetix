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

export function SupplierOffersPage({ locale }: Props) {
  const { supplierOffers, loading } = useAdminData()
  const [search, setSearch] = useState('')

  const filtered = supplierOffers.filter(o => {
    const q = search.toLowerCase()
    return !search || o.requestRef.toLowerCase().includes(q) || o.supplierName.toLowerCase().includes(q) || o.productName.toLowerCase().includes(q)
  })

  return (
    <>
      <PageHeading
        title={copy(locale, 'Supplier Offers & Quotes', 'عروض الموردين والتكاليف')}
        eyebrow={copy(locale, 'INTERNAL PROCUREMENT COST DATA', 'بيانات التكلفة والتوريد الداخلية')}
        action={copy(locale, 'Record Supplier Offer', 'تسجيل عرض مورد')}
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
          <strong>CONFIDENTIAL DATA:</strong> Internal unit costs, margins, and supplier lead times are strictly isolated from customer-facing proposals.
        </span>
      </div>

      <div className="admin-toolbar">
        <label>
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={copy(locale, 'Search request ref, supplier, product...', 'ابحث بالرقم المرجعي، المورد، المنتج...')}
          />
        </label>
      </div>

      <Panel>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Request Ref</th>
                <th>Supplier</th>
                <th>Hardware / Product</th>
                <th>Qty</th>
                <th>Unit Cost</th>
                <th>Total Cost</th>
                <th>Lead Time</th>
                <th>Offer Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9}>
                    <SkeletonRows rows={5} />
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map(offer => (
                  <tr key={offer.id}>
                    <td>
                      <b>{offer.requestRef}</b>
                    </td>
                    <td>
                      <b>{offer.supplierName}</b>
                    </td>
                    <td>{offer.productName}</td>
                    <td>{offer.quantity}</td>
                    <td>${offer.unitCost.toLocaleString()}</td>
                    <td>
                      <strong style={{ color: '#1d4e6b' }}>${offer.totalCost.toLocaleString()}</strong>
                    </td>
                    <td>{offer.leadTimeDays} day(s)</td>
                    <td>
                      <StatusBadge status={offer.status} />
                    </td>
                    <td>
                      <button className="admin-row-action">Select Offer</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <EmptyState
                      title="No supplier offers logged"
                      detail="Internal vendor pricing responses for active sourcing lines will be listed here."
                      action="Record Supplier Offer"
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
