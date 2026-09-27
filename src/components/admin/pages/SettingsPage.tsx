import { useState } from 'react'
import { Globe, Lock, Save, Shield, User } from 'lucide-react'
import type { Locale } from '../../../types/database.types'
import { PageHeading, Panel } from '../AdminPrimitives'

type Props = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const copy = (locale: Locale, en: string, ar: string) => (locale === 'ar' ? ar : en)

export function SettingsPage({ locale, setLocale }: Props) {
  const [saved, setSaved] = useState(false)

  return (
    <>
      <PageHeading
        title={copy(locale, 'Workspace & Operations Settings', 'إعدادات مساحة العمل والنظام')}
        eyebrow={copy(locale, 'ADMIN CONFIGURATION', 'إعدادات الإدارة')}
      />

      {saved && (
        <div
          style={{
            background: '#e4f3e7',
            border: '1px solid #99d6a8',
            color: '#207042',
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          {copy(locale, 'Workspace settings saved successfully.', 'تم حفظ إعدادات مساحة العمل بنجاح.')}
        </div>
      )}

      <div className="admin-settings">
        <Panel title={copy(locale, 'General Workspace Info', 'معلومات مساحة العمل العامة')}>
          <div style={{ padding: '16px' }}>
            <div className="admin-form">
              <label>
                Company Title
                <input defaultValue="OmniNetix IT Hardware & Networking" />
              </label>
              <label>
                Default Support Email
                <input defaultValue="sourcing@omninetix.com" />
              </label>
              <label>
                Operations Region
                <select defaultValue="sa">
                  <option value="sa">Saudi Arabia & GCC</option>
                  <option value="global">Global Tech Sourcing</option>
                </select>
              </label>
            </div>
          </div>
        </Panel>

        <Panel title={copy(locale, 'Language & Regional Localization', 'اللغة والإعدادات الإقليمية')}>
          <div style={{ padding: '16px' }}>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#60737b' }}>
              {copy(
                locale,
                'Choose the active operational language for the internal dashboard.',
                'اختر لغة تشغيل لوحة التحكم الخاصة بالإدارة.'
              )}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className={locale === 'en' ? 'admin-primary' : 'admin-secondary'}
                onClick={() => setLocale('en')}
              >
                <Globe size={16} />
                English (LTR)
              </button>
              <button
                type="button"
                className={locale === 'ar' ? 'admin-primary' : 'admin-secondary'}
                onClick={() => setLocale('ar')}
              >
                <Globe size={16} />
                العربية (RTL)
              </button>
            </div>
          </div>
        </Panel>

        <Panel title={copy(locale, 'Security & Auth Policies', 'سياسات الأمان والمصادقة')}>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <Shield size={20} color="#1d4e6b" />
              <div>
                <strong style={{ fontSize: '13px', color: '#102c3b' }}>Supabase Row Level Security (RLS)</strong>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#60737b' }}>
                  All public product catalog endpoints are operating under verified public read policies. Staff-only procurement tables require JWT authentication.
                </p>
              </div>
            </div>
            <button className="admin-secondary" type="button" disabled>
              <Lock size={15} />
              Configure Staff Roles
            </button>
          </div>
        </Panel>

        <Panel title={copy(locale, 'Operator Profile', 'ملف المشغّل المساعد')}>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
              <User size={20} color="#c1712e" />
              <div>
                <strong style={{ fontSize: '13px', color: '#102c3b' }}>Active Staff Profile</strong>
                <span style={{ display: 'block', fontSize: '11px', color: '#60737b' }}>
                  Catalog Operations & Procurement Lead
                </span>
              </div>
            </div>
            <button
              className="admin-primary"
              type="button"
              onClick={() => {
                setSaved(true)
                setTimeout(() => setSaved(false), 3000)
              }}
            >
              <Save size={16} />
              Save Preferences
            </button>
          </div>
        </Panel>
      </div>
    </>
  )
}
