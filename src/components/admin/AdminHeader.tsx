import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, ChevronRight, Menu, Search, ShieldCheck } from 'lucide-react'
import type { Locale } from '../../types/database.types'
import { useAdminSession } from '../../hooks/useAdminSession'
import { signOutAdmin } from '../../services/adminAuth.service'

type Props = {
  locale: Locale
  setLocale: (locale: Locale) => void
  onToggleMobileSidebar: () => void
}

export function AdminHeader({ locale, setLocale, onToggleMobileSidebar }: Props) {
  const location = useLocation()
  const session = useAdminSession()
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const segments = location.pathname.split('/').filter(Boolean)
  const lastSegment = segments.at(-1)?.replaceAll('-', ' ') || 'dashboard'

  return (
    <header className="admin-header">
      <button
        className="admin-menu"
        aria-label="Open navigation menu"
        onClick={onToggleMobileSidebar}
      >
        <Menu size={20} />
      </button>

      <div className="admin-breadcrumb" aria-label="Breadcrumbs">
        <Link to="/admin">Admin</Link>
        <ChevronRight size={14} />
        <span>{lastSegment}</span>
      </div>

      <div className="admin-header-tools">
        <button
          className="admin-search"
          aria-label="Search workspace"
          onClick={() => setShowSearchModal(true)}
        >
          <Search size={16} />
          <span>{locale === 'ar' ? 'بحث في مساحة العمل...' : 'Search workspace...'}</span>
        </button>

        <button
          className="admin-icon"
          aria-label="Notifications"
          title={locale === 'ar' ? 'الإشعارات' : 'Notifications'}
        >
          <Bell size={18} />
          <i />
        </button>

        <button
          className="admin-language"
          onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
          title={locale === 'en' ? 'التحويل للعربية' : 'Switch to English'}
        >
          {locale === 'en' ? 'العربية' : 'English'}
        </button>

        <div className="admin-user-wrapper" style={{ position: 'relative' }}>
          <button
            className="admin-user"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-expanded={showUserMenu}
          >
            <span>ON</span>
            <div>
              <b>{session.profile?.fullName || 'Staff Admin'}</b>
              <small>{session.profile?.role?.replaceAll('_', ' ') || 'Authorized Session'}</small>
            </div>
          </button>

          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: locale === 'ar' ? 'auto' : 0,
                left: locale === 'ar' ? 0 : 'auto',
                marginTop: '8px',
                background: '#ffffff',
                border: '1px solid #d9dfdc',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '4px',
                padding: '12px',
                zIndex: 40,
                width: '220px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ShieldCheck size={18} color="#c1712e" />
                <div>
                  <strong style={{ display: 'block', fontSize: '12px', color: '#102c3b' }}>
                    Role: {session.profile?.role?.replaceAll('_', ' ') || 'staff'}
                  </strong>
                  <span style={{ fontSize: '10px', color: '#60737b' }}>OmniNetix Internal</span>
                </div>
              </div>
              <hr style={{ border: '0', borderTop: '1px solid #e3e8e6', margin: '8px 0' }} />
              <div className="admin-profile-summary">
                <span>{session.user?.email || '—'}</span>
                <span>Status: {session.profile?.status || '—'}</span>
              </div>
              <button
                style={{
                  width: '100%',
                  textAlign: 'start',
                  background: 'none',
                  border: '0',
                  padding: '6px 0',
                  fontSize: '12px',
                  color: '#1d4e6b',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setShowUserMenu(false)
                  setLocale(locale === 'en' ? 'ar' : 'en')
                }}
              >
                {locale === 'en' ? '🌐 Toggle Arabic / RTL' : '🌐 Toggle English / LTR'}
              </button>
              <button
                className="admin-user-menu-signout"
                onClick={() => { void signOutAdmin() }}
              >
                {locale === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
              </button>
            </div>
          )}
        </div>
      </div>

      {showSearchModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(16, 44, 59, 0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '80px'
          }}
          onClick={() => setShowSearchModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '4px',
              width: '90%',
              maxWidth: '560px',
              padding: '20px',
              border: '1px solid #d9dfdc',
              boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Search size={20} color="#1d4e6b" />
              <input
                autoFocus
                type="text"
                placeholder={
                  locale === 'ar'
                    ? 'ابحث في الموردين، الطلبات، المنتجات، العروض...'
                    : 'Search products, requests, suppliers, quotations...'
                }
                style={{
                  flex: 1,
                  border: '1px solid #cbd5d3',
                  padding: '10px',
                  borderRadius: '3px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ fontSize: '11px', color: '#60737b', textAlign: 'end' }}>
              Press ESC to close
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
