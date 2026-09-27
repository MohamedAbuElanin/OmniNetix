import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import type { Locale } from '../../types/database.types'
import { AdminHeader } from './AdminHeader'
import { AdminSidebar } from './AdminSidebar'

type Props = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export function AdminLayout({ locale, setLocale }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="admin-app">
      <AdminSidebar
        locale={locale}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="admin-main">
        <AdminHeader
          locale={locale}
          setLocale={setLocale}
          onToggleMobileSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
