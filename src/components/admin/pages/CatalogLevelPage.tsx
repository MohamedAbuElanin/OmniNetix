import { useState } from 'react'
import { Search } from 'lucide-react'
import type { Locale } from '../../../types/database.types'
import { useCatalog } from '../../../hooks/useCatalog'
import {
  EmptyState,
  ErrorState,
  PageHeading,
  Panel,
  SkeletonRows,
  StatusBadge
} from '../AdminPrimitives'

type Kind = 'departments' | 'product-types' | 'categories' | 'subcategories' | 'brands'

type Props = {
  kind: Kind
  locale: Locale
}

const copy = (locale: Locale, en: string, ar: string) => (locale === 'ar' ? ar : en)
const name = (item: { en: string; ar: string }, locale: Locale) => item[locale] || item.en

export function CatalogLevelPage({ kind, locale }: Props) {
  const catalog = useCatalog()
  const [search, setSearch] = useState('')

  const labels: Record<Kind, string> = {
    departments: 'Departments',
    'product-types': 'Product Types',
    categories: 'Categories',
    subcategories: 'Subcategories',
    brands: 'Brands'
  }

  const entries =
    kind === 'departments'
      ? catalog.departments
      : kind === 'product-types'
      ? catalog.productTypes
      : kind === 'categories'
      ? catalog.categories
      : kind === 'subcategories'
      ? catalog.subcategories
      : catalog.brands

  const filtered = entries.filter(item => {
    const q = search.toLowerCase()
    return !search || item.en.toLowerCase().includes(q) || item.ar.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q)
  })

  return (
    <>
      <PageHeading
        title={copy(locale, labels[kind], labels[kind])}
        eyebrow={copy(locale, 'CATALOG HIERARCHY', 'تسلسل الكتالوج')}
        action={copy(locale, `Create ${labels[kind].slice(0, -1)}`, 'إضافة سجل')}
      />

      {catalog.error && (
        <ErrorState detail={`Supabase Connection Error: ${catalog.error}`} />
      )}

      <Panel>
        <div className="admin-toolbar">
          <label>
            <Search size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${labels[kind].toLowerCase()}...`}
            />
          </label>
          <button className="admin-secondary" type="button">
            Status: Active
          </button>
        </div>

        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name (English / Arabic)</th>
                <th>Slug</th>
                <th>Parent Relationship</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {catalog.loading ? (
                <tr>
                  <td colSpan={5}>
                    <SkeletonRows rows={5} />
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map(item => (
                  <tr key={item.id}>
                    <td>
                      <b>{name(item, locale)}</b>
                      <small>{item.ar}</small>
                    </td>
                    <td>{item.slug}</td>
                    <td>{getRelationshipText(kind, item, catalog, locale)}</td>
                    <td>
                      <StatusBadge status="active" />
                    </td>
                    <td>
                      <button className="admin-row-action">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      title={`No ${labels[kind].toLowerCase()} found`}
                      detail="This catalog level is empty. Add approved business records when staff access is available."
                      action={`Create ${labels[kind].slice(0, -1)}`}
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

function getRelationshipText(
  kind: Kind,
  item: { id: string } & Record<string, unknown>,
  catalog: ReturnType<typeof useCatalog>,
  locale: Locale
) {
  if (kind === 'product-types') {
    const parent = catalog.departments.find(entry => entry.id === item.departmentId)
    return parent ? `Dept: ${name(parent, locale)}` : '—'
  }
  if (kind === 'categories') {
    const parent = catalog.productTypes.find(entry => entry.id === item.productTypeId)
    return parent ? `Type: ${name(parent, locale)}` : '—'
  }
  if (kind === 'subcategories') {
    const parent = catalog.categories.find(entry => entry.id === item.categoryId)
    return parent ? `Category: ${name(parent, locale)}` : '—'
  }
  return 'Root Hierarchy'
}
