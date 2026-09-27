import { Link, NavLink } from 'react-router-dom'
import {
  BadgeDollarSign,
  Boxes,
  ChartNoAxesCombined,
  ClipboardList,
  FileCheck2,
  FolderTree,
  History,
  LayoutDashboard,
  Package,
  Settings,
  ShieldCheck,
  Tags,
  Truck,
  Users,
  X
} from 'lucide-react'
import type { Locale } from '../../types/database.types'
import type { AdminRole } from '../../services/adminAuth.service'
import { useAdminSession } from '../../hooks/useAdminSession'

type Props = {
  locale: Locale
  open: boolean
  onClose: () => void
}

const copy = (locale: Locale, en: string, ar: string) => (locale === 'ar' ? ar : en)

export function AdminSidebar({ locale, open, onClose }: Props) {
  const session = useAdminSession()
  const permittedPaths: Record<AdminRole, string[]> = {
    super_admin: ['', 'products', 'departments', 'product-types', 'categories', 'subcategories', 'brands', 'requests', 'customers', 'suppliers', 'supplier-offers', 'quotations', 'analytics', 'activity-log', 'settings'],
    admin: ['', 'products', 'departments', 'product-types', 'categories', 'subcategories', 'brands', 'requests', 'customers', 'suppliers', 'supplier-offers', 'quotations', 'analytics'],
    manager: ['', 'products', 'departments', 'product-types', 'categories', 'subcategories', 'brands', 'requests', 'customers', 'quotations', 'analytics'],
    sales: ['', 'requests', 'customers', 'quotations'], procurement: ['', 'requests', 'suppliers', 'supplier-offers'], catalog_manager: ['', 'products', 'departments', 'product-types', 'categories', 'subcategories', 'brands']
  }

  const navGroups = [
    {
      label: 'MAIN',
      links: [
        ['', copy(locale, 'Dashboard', 'لوحة العمليات'), LayoutDashboard]
      ]
    },
    {
      label: 'CATALOG',
      links: [
        ['products', copy(locale, 'Products', 'المنتجات'), Package],
        ['departments', copy(locale, 'Departments', 'الأقسام'), Boxes],
        ['product-types', copy(locale, 'Product Types', 'أنواع المنتجات'), FolderTree],
        ['categories', copy(locale, 'Categories', 'الفئات'), FolderTree],
        ['subcategories', copy(locale, 'Subcategories', 'الفئات الفرعية'), FolderTree],
        ['brands', copy(locale, 'Brands', 'العلامات التجارية'), Tags]
      ]
    },
    {
      label: 'SALES & REQUESTS',
      links: [
        ['requests', copy(locale, 'Requests', 'طلبات التوريد'), ClipboardList],
        ['customers', copy(locale, 'Customers', 'العملاء'), Users],
        ['quotations', copy(locale, 'Quotations', 'عروض الأسعار'), FileCheck2]
      ]
    },
    {
      label: 'PROCUREMENT',
      links: [
        ['suppliers', copy(locale, 'Suppliers', 'الموردين الداخليين'), Truck],
        ['supplier-offers', copy(locale, 'Supplier Offers', 'عروض الموردين'), BadgeDollarSign]
      ]
    },
    {
      label: 'ANALYTICS',
      links: [
        ['analytics', copy(locale, 'Analytics', 'التحليلات التقنية'), ChartNoAxesCombined]
      ]
    },
    {
      label: 'SYSTEM',
      links: [
        ['activity-log', copy(locale, 'Activity Log', 'سجل النشاطات'), History],
        ['settings', copy(locale, 'Settings', 'الإعدادات'), Settings]
      ]
    }
  ] as const

  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-brand">
        <Link to="/" onClick={onClose}>
          <img src="/omni-logo.svg" alt="OmniNetix Logo" />
        </Link>
        <span>OPERATIONS</span>
        <button aria-label="Close navigation" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <nav style={{ flex: 1 }}>
        {navGroups.map(group => (
          <div className="admin-nav-group" key={group.label}>
            <span>{group.label}</span>
            {group.links.filter(([path]) => session.profile ? permittedPaths[session.profile.role].includes(path) : false).map(([path, label, Icon]) => (
              <NavLink
                end={path === ''}
                to={path === '' ? '/admin' : `/admin/${path}`}
                key={path}
                onClick={onClose}
              >
                <Icon size={17} />
                <b>{label}</b>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-foot">
        <ShieldCheck size={16} />
        <span>
          {session.authenticated
            ? copy(locale, 'Staff Session Active', 'جلسة موظف مفعلة')
            : copy(locale, 'Auth Pending / Public Read', 'وضع المعاينة العامة')}
        </span>
      </div>
    </aside>
  )
}
