import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import type { Locale } from '../../types/database.types'
import { AdminLayout } from './AdminLayout'
import { DashboardOverview } from './pages/DashboardOverview'
import { ProductsPage } from './pages/ProductsPage'
import { CatalogLevelPage } from './pages/CatalogLevelPage'
import { RequestsPage } from './pages/RequestsPage'
import { CustomersPage } from './pages/CustomersPage'
import { SuppliersPage } from './pages/SuppliersPage'
import { SupplierOffersPage } from './pages/SupplierOffersPage'
import { QuotationsPage } from './pages/QuotationsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { ActivityLogPage } from './pages/ActivityLogPage'
import { SettingsPage } from './pages/SettingsPage'
import { AdminAuthProvider } from '../../hooks/useAdminSession'
import { AdminLoginPage, ProtectedAdminRoute } from './AdminAuthGate'

type Props = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export function AdminApp({ locale, setLocale }: Props) {
  useEffect(() => {
    document.querySelector('.app')?.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
  }, [locale])

  return (
    <AdminAuthProvider>
    <Routes>
      <Route path="login" element={<AdminLoginPage locale={locale} setLocale={setLocale} />} />
      <Route element={<ProtectedAdminRoute />}>
      <Route element={<AdminLayout locale={locale} setLocale={setLocale} />}>
        <Route index element={<DashboardOverview locale={locale} />} />
        <Route path="products" element={<ProductsPage locale={locale} />} />
        <Route path="departments" element={<CatalogLevelPage kind="departments" locale={locale} />} />
        <Route path="product-types" element={<CatalogLevelPage kind="product-types" locale={locale} />} />
        <Route path="categories" element={<CatalogLevelPage kind="categories" locale={locale} />} />
        <Route path="subcategories" element={<CatalogLevelPage kind="subcategories" locale={locale} />} />
        <Route path="brands" element={<CatalogLevelPage kind="brands" locale={locale} />} />
        <Route path="requests" element={<RequestsPage locale={locale} />} />
        <Route path="customers" element={<CustomersPage locale={locale} />} />
        <Route path="suppliers" element={<SuppliersPage locale={locale} />} />
        <Route path="supplier-offers" element={<SupplierOffersPage locale={locale} />} />
        <Route path="quotations" element={<QuotationsPage locale={locale} />} />
        <Route path="analytics" element={<AnalyticsPage locale={locale} />} />
        <Route path="activity-log" element={<ActivityLogPage locale={locale} />} />
        <Route path="settings" element={<SettingsPage locale={locale} setLocale={setLocale} />} />
        <Route path="*" element={<DashboardOverview locale={locale} />} />
      </Route>
      </Route>
    </Routes>
    </AdminAuthProvider>
  )
}
