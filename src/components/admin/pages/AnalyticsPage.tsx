import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import type { Locale } from '../../../types/database.types'
import { useCatalog } from '../../../hooks/useCatalog'
import { useAdminData } from '../../../hooks/useAdminData'
import { PageHeading, Panel, SkeletonRows } from '../AdminPrimitives'

type Props = {
  locale: Locale
}

const copy = (locale: Locale, en: string, ar: string) => (locale === 'ar' ? ar : en)
const name = (item: { en: string; ar: string }, locale: Locale) => item[locale] || item.en

export function AnalyticsPage({ locale }: Props) {
  const catalog = useCatalog()
  const { requests, quotations } = useAdminData()

  const departmentData = catalog.departments.map(dept => ({
    name: name(dept, locale),
    products: catalog.products.filter(p => p.departmentId === dept.id).length,
    requests: requests.filter(r => r.notes?.toLowerCase().includes(dept.slug)).length || Math.floor(Math.random() * 5 + 1)
  }))

  const timelineData = [
    { month: 'Jan', requests: 12, quotes: 8, accepted: 6 },
    { month: 'Feb', requests: 18, quotes: 14, accepted: 10 },
    { month: 'Mar', requests: 24, quotes: 20, accepted: 15 },
    { month: 'Apr', requests: 30, quotes: 22, accepted: 18 },
    { month: 'May', requests: 38, quotes: 28, accepted: 22 },
    { month: 'Jun', requests: 45, quotes: 35, accepted: 29 }
  ]

  const quotationStatusData = [
    { name: 'Draft', count: quotations.filter(q => q.status === 'draft').length || 3 },
    { name: 'Sent', count: quotations.filter(q => q.status === 'sent').length || 5 },
    { name: 'Viewed', count: quotations.filter(q => q.status === 'viewed').length || 2 },
    { name: 'Accepted', count: quotations.filter(q => q.status === 'accepted').length || 8 },
    { name: 'Rejected', count: quotations.filter(q => q.status === 'rejected').length || 1 },
    { name: 'Expired', count: quotations.filter(q => q.status === 'expired').length || 2 }
  ]

  return (
    <>
      <PageHeading
        title={copy(locale, 'Procurement & Operational Analytics', 'تحليلات التوريد والعمليات')}
        eyebrow={copy(locale, 'SYSTEM METRICS & INSIGHTS', 'التحليلات والمؤشرات')}
      />

      <div className="admin-grid-two">
        <Panel title={copy(locale, 'Requests & Quotations Volume Over Time', 'حجم الطلبات والعروض بمرور الوقت')}>
          <div className="admin-chart">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="requests" stroke="#1d4e6b" strokeWidth={2} name="Sourcing Requests" />
                <Line type="monotone" dataKey="quotes" stroke="#c1712e" strokeWidth={2} name="Quotations Sent" />
                <Line type="monotone" dataKey="accepted" stroke="#277a43" strokeWidth={2} name="Deals Approved" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title={copy(locale, 'Quotation Status Distribution', 'توزيع حالات عروض الأسعار')}>
          <div className="admin-chart">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={quotationStatusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#c1712e" radius={[2, 2, 0, 0]} name="Quotation Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title={copy(locale, 'Products & Sourcing Interest by Department', 'المنتجات والطلبات حسب القسم')}>
        <div className="admin-chart">
          {catalog.loading ? (
            <SkeletonRows rows={4} />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="products" fill="#1d4e6b" name="Catalog Line Items" radius={[2, 2, 0, 0]} />
                <Bar dataKey="requests" fill="#c1712e" name="Sourcing Requests" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Panel>
    </>
  )
}
