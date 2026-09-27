import { useMemo, useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import type { Locale, Product } from '../../../types/database.types'
import { useCatalog } from '../../../hooks/useCatalog'
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

export function ProductsPage({ locale }: Props) {
  const catalog = useCatalog()
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [brandName, setBrandName] = useState('')
  const [modeFilter, setModeFilter] = useState('')
  const [showEditor, setShowEditor] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const products = useMemo(() => {
    return catalog.products.filter(p => {
      const matchesDept = !departmentId || p.departmentId === departmentId
      const matchesBrand = !brandName || p.brand === brandName
      const matchesMode = !modeFilter || p.mode === modeFilter
      const textQuery = `${p.en} ${p.ar} ${p.sku} ${p.brand}`.toLowerCase()
      const matchesSearch = !search || textQuery.includes(search.toLowerCase())
      return matchesDept && matchesBrand && matchesMode && matchesSearch
    })
  }, [catalog.products, departmentId, brandName, modeFilter, search])

  return (
    <>
      <PageHeading
        title={copy(locale, 'Products Management', 'إدارة المنتجات التقنية')}
        action={copy(locale, 'Create Product', 'إضافة منتج جديد')}
        onActionClick={() => {
          setSelectedProduct(null)
          setShowEditor(true)
        }}
      />

      {catalog.error && (
        <ErrorState detail={`Supabase Catalog Connection Error: ${catalog.error}`} />
      )}

      <div className="admin-toolbar">
        <label>
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={copy(locale, 'Search name, SKU, or brand...', 'ابحث بالاسم، SKU أو العلامة...')}
          />
        </label>

        <select value={departmentId} onChange={e => setDepartmentId(e.target.value)}>
          <option value="">{copy(locale, 'All Departments', 'جميع الأقسام')}</option>
          {catalog.departments.map(dept => (
            <option key={dept.id} value={dept.id}>
              {name(dept, locale)}
            </option>
          ))}
        </select>

        <select value={brandName} onChange={e => setBrandName(e.target.value)}>
          <option value="">{copy(locale, 'All Brands', 'جميع العلامات التجارية')}</option>
          {catalog.brands.map(b => (
            <option key={b.id} value={b.en}>
              {name(b, locale)}
            </option>
          ))}
        </select>

        <select value={modeFilter} onChange={e => setModeFilter(e.target.value)}>
          <option value="">{copy(locale, 'All Pricing Modes', 'جميع أنماط التسعير')}</option>
          <option value="quote">Quote / On Request</option>
          <option value="fixed">Fixed Price</option>
          <option value="starting">Starting From</option>
        </select>
      </div>

      <Panel>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product Name & Slug</th>
                <th>SKU</th>
                <th>Brand</th>
                <th>Department</th>
                <th>Product Type</th>
                <th>Pricing Mode</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {catalog.loading ? (
                <tr>
                  <td colSpan={8}>
                    <SkeletonRows rows={6} />
                  </td>
                </tr>
              ) : products.length ? (
                products.map(product => {
                  const dept = catalog.departments.find(d => d.id === product.departmentId)
                  const type = catalog.productTypes.find(t => t.id === product.productTypeId)
                  return (
                    <tr key={product.id}>
                      <td>
                        <b>{name(product, locale)}</b>
                        <small>{product.slug}</small>
                      </td>
                      <td>{product.sku || '—'}</td>
                      <td>{product.brand || '—'}</td>
                      <td>{dept ? name(dept, locale) : '—'}</td>
                      <td>{type ? name(type, locale) : '—'}</td>
                      <td>
                        <StatusBadge status={product.mode} />
                      </td>
                      <td>
                        <StatusBadge status="published" />
                      </td>
                      <td>
                        <button
                          className="admin-row-action"
                          onClick={() => {
                            setSelectedProduct(product)
                            setShowEditor(true)
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      title="No products match filter"
                      detail="Try clearing your search query or department filter."
                      action="Create Product"
                      onActionClick={() => {
                        setSelectedProduct(null)
                        setShowEditor(true)
                      }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {showEditor && (
        <ProductEditorModal
          locale={locale}
          product={selectedProduct}
          catalog={catalog}
          onClose={() => setShowEditor(false)}
        />
      )}
    </>
  )
}

function ProductEditorModal({
  locale,
  product,
  catalog,
  onClose
}: {
  locale: Locale
  product: Product | null
  catalog: ReturnType<typeof useCatalog>
  onClose: () => void
}) {
  const [departmentId, setDepartmentId] = useState(product?.departmentId || catalog.departments[0]?.id || '')
  const [typeId, setTypeId] = useState(product?.productTypeId || '')
  const [categoryId, setCategoryId] = useState(product?.categoryId || '')
  const [subcategoryId, setSubcategoryId] = useState(product?.subcategoryId || '')
  const [brandId, setBrandId] = useState('')

  const availableTypes = catalog.productTypes.filter(t => t.departmentId === departmentId)
  const availableCategories = catalog.categories.filter(c => c.productTypeId === typeId)
  const availableSubcategories = catalog.subcategories.filter(s => s.categoryId === categoryId)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(16, 44, 59, 0.6)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '780px',
          height: '100vh',
          overflowY: 'auto',
          padding: '28px',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '10px', color: '#c1712e', fontWeight: 700, letterSpacing: '1px' }}>
              PRODUCT EDITOR
            </span>
            <h2 style={{ margin: '4px 0 0', fontSize: '22px' }}>
              {product ? `Edit: ${name(product, locale)}` : 'Create New Technical Product'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 0, cursor: 'pointer' }}>
            <X size={22} color="#102c3b" />
          </button>
        </div>

        <RestrictedState title="Catalog mutations require staff permissions" />

        <form className="admin-form" onSubmit={e => e.preventDefault()} style={{ marginTop: '16px' }}>
          <section>
            <h2>1. Basic Information</h2>
            <div>
              <label>
                SKU / Part Number
                <input defaultValue={product?.sku || ''} placeholder="e.g. CS-C9200-24P" />
              </label>
              <label>
                Slug
                <input defaultValue={product?.slug || ''} placeholder="cisco-catalyst-9200-24p" />
              </label>
              <label>
                Name (English)
                <input defaultValue={product?.en || ''} placeholder="Cisco Catalyst 9200 24-Port Switch" />
              </label>
              <label className="admin-form-wide">
                Name (Arabic)
                <input defaultValue={product?.ar || ''} placeholder="مبدل سيسكو كاتاليست ٩٢٠٠ ذو ٢٤ منفذ" />
              </label>
            </div>
          </section>

          <section>
            <h2>2. Classification Hierarchy</h2>
            <div>
              <label>
                Department
                <select
                  value={departmentId}
                  onChange={e => {
                    setDepartmentId(e.target.value)
                    setTypeId('')
                    setCategoryId('')
                    setSubcategoryId('')
                  }}
                >
                  <option value="">Select Department</option>
                  {catalog.departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {name(dept, locale)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Product Type
                <select
                  value={typeId}
                  onChange={e => {
                    setTypeId(e.target.value)
                    setCategoryId('')
                    setSubcategoryId('')
                  }}
                  disabled={!departmentId}
                >
                  <option value="">Select Product Type</option>
                  {availableTypes.map(t => (
                    <option key={t.id} value={t.id}>
                      {name(t, locale)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Category
                <select
                  value={categoryId}
                  onChange={e => {
                    setCategoryId(e.target.value)
                    setSubcategoryId('')
                  }}
                  disabled={!typeId}
                >
                  <option value="">Select Category</option>
                  {availableCategories.map(c => (
                    <option key={c.id} value={c.id}>
                      {name(c, locale)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Subcategory
                <select
                  value={subcategoryId}
                  onChange={e => setSubcategoryId(e.target.value)}
                  disabled={!categoryId}
                >
                  <option value="">Select Subcategory</option>
                  {availableSubcategories.map(s => (
                    <option key={s.id} value={s.id}>
                      {name(s, locale)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Brand
                <select value={brandId} onChange={e => setBrandId(e.target.value)}>
                  <option value="">Select Brand</option>
                  {catalog.brands.map(b => (
                    <option key={b.id} value={b.id}>
                      {name(b, locale)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section>
            <h2>3. Commercial & Pricing Terms</h2>
            <div>
              <label>
                Pricing Mode
                <select defaultValue={product?.mode || 'quote'}>
                  <option value="quote">Quote On Request (Sourcing)</option>
                  <option value="fixed">Fixed List Price</option>
                  <option value="starting">Starting From</option>
                </select>
              </label>
              <label>
                Public Price (USD / SAR)
                <input defaultValue={product?.price || ''} placeholder="e.g. 1450.00" />
              </label>
              <label>
                Availability State
                <select defaultValue="available_on_request">
                  <option value="in_stock">In Stock</option>
                  <option value="available_on_request">Available on Sourcing Request</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </label>
              <label>
                Condition
                <select defaultValue="new">
                  <option value="new">Brand New</option>
                  <option value="refurbished">Factory Refurbished</option>
                  <option value="used">Used / Tested</option>
                </select>
              </label>
              <label>
                Warranty
                <input defaultValue="1-Year Manufacturer Warranty" />
              </label>
            </div>
          </section>

          <section>
            <h2>4. Technical & Part Specifications</h2>
            <div>
              <label>
                Model Number
                <input placeholder="C9200-24P-A" />
              </label>
              <label>
                Manufacturer Part Number (MPN)
                <input placeholder="C9200-24P-A=" />
              </label>
              <label className="admin-form-wide">
                Search Keywords
                <input placeholder="cisco, catalyst, 24-port, poe+, switch, networking" />
              </label>
            </div>
          </section>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button className="admin-secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="admin-primary" type="button" disabled>
              Save Product Record
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
