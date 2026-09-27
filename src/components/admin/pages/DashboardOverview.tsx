import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import {
  Boxes,
  ClipboardList,
  FileCheck2,
  Package,
  ShieldCheck,
  Truck
} from 'lucide-react'
import type { Locale, Product } from '../../../types/database.types'
import { useCatalog } from '../../../hooks/useCatalog'
import { useAdminData } from '../../../hooks/useAdminData'
import {
  EmptyState,
  ErrorState,
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
const name = (item: { en: string; ar: string }, locale: Locale) => item[locale] || item.en

export function DashboardOverview({ locale }: Props) {
  const catalog = useCatalog()
  const { requests, isDevState } = useAdminData()

  const metrics = [
    ['Total Products', catalog.products.length, Package],
    ['Published Products', catalog.products.length, ShieldCheck],
    ['New Requests', requests.filter(r => r.status === 'new').length, ClipboardList],
    ['Requests in Sourcing', requests.filter(r => r.status === 'sourcing').length, Truck],
    ['Pending Quotations', requests.filter(r => r.status === 'quote_preparation').length, FileCheck2],
    ['Accepted Quotations', requests.filter(r => r.status === 'approved' || r.status === 'completed').length, FileCheck2]
  ] as const

  const distribution = catalog.departments.map(dept => ({
    name: name(dept, locale),
    products: catalog.products.filter(p => p.departmentId === dept.id).length
  }))

  return (
    <>
      <PageHeading
        title={copy(locale, 'Operational Overview', 'لوحة العمليات والملخص')}
        eyebrow={copy(locale, 'ADMIN / LIVE WORKSPACE', 'الإدارة / مساحة العمل')}
      />

      {catalog.error && (
        <ErrorState detail={`Supabase Catalog Connection Error: ${catalog.error}`} />
      )}

      <div className="admin-kpis">
        {metrics.map(([label, value, Icon]) => (
          <article key={label}>
            <div>
              <span>{copy(locale, label, label)}</span>
              <b>{catalog.loading ? '—' : value}</b>
              <small>
                {typeof value === 'number'
                  ? copy(locale, 'Live catalog data', 'بيانات الكتالوج النشطة')
                  : copy(locale, 'Operational record', 'سجل التشغيل')}
              </small>
            </div>
            <Icon size={21} />
          </article>
        ))}
      </div>

      <div className="admin-grid-two">
        <Panel
          title={copy(locale, 'Request Pipeline', 'مسار طلبات التوريد')}
          action={<span className="admin-data-label">OPERATIONS WORKFLOW</span>}
        >
          <div className="admin-pipeline">
            {[
              'new',
              'under_review',
              'sourcing',
              'quote_preparation',
              'quote_sent',
              'awaiting_customer',
              'approved',
              'completed',
              'cancelled'
            ].map(status => {
              const count = requests.filter(r => r.status === status).length
              return (
                <button key={status} type="button">
                  <StatusBadge status={status} />
                  <b>{count}</b>
                </button>
              )
            })}
          </div>
          {isDevState && (
            <RestrictedState
              title={copy(
                locale,
                'Internal request tables waiting for authentication',
                'جداول الطلبات بانتظار توثيق الموظفين'
              )}
            />
          )}
        </Panel>

        <Panel title={copy(locale, 'Catalog Health', 'صحة ونشاط الكتالوج')}>
          <div className="admin-health">
            <div>
              <span>Published Public Products</span>
              <b>{catalog.loading ? '—' : catalog.products.length}</b>
            </div>
            <div>
              <span>Departments Configured</span>
              <b>{catalog.loading ? '—' : catalog.departments.length}</b>
            </div>
            <div>
              <span>Brands Active</span>
              <b>{catalog.loading ? '—' : catalog.brands.length}</b>
            </div>
          </div>
          <p className="admin-note">
            {copy(
              locale,
              'All catalog items shown above are verified against live Supabase public tables.',
              'جميع منتجات الكتالوج المعروضة أعلاه موثقة ومربوطة مباشرة بجداول Supabase المباشرة.'
            )}
          </p>
        </Panel>
      </div>

      <div className="admin-grid-two">
        <Panel title={copy(locale, 'Products by Department', 'توزيع المنتجات حسب القسم')}>
          <div className="admin-chart">
            {catalog.loading ? (
              <SkeletonRows />
            ) : distribution.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={distribution} margin={{ left: -20, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="products" fill="#1d4e6b" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                title="No product distribution"
                detail="Published products will appear here after catalog records are added."
              />
            )}
          </div>
        </Panel>

        <Panel title={copy(locale, 'Recent Requests', 'أحدث طلبات التوريد')}>
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Request Ref</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length ? (
                  requests.slice(0, 5).map(req => (
                    <tr key={req.id}>
                      <td>
                        <b>{req.reference}</b>
                      </td>
                      <td>
                        <b>{req.customerName}</b>
                        <small>{req.company}</small>
                      </td>
                      <td>{req.itemCount} line(s)</td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                      <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="admin-row-action">View</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <RestrictedState title="Operational requests require authorized staff session" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  )
}
