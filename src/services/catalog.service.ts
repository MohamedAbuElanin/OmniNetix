import { supabase } from '../lib/supabaseClient'
import type { Brand, Category, Department, Product, ProductType, Subcategory } from '../types/database.types'

type Row = Record<string, unknown>
const text = (value: unknown) => typeof value === 'string' ? value : ''
const localized = (row: Row) => ({ en: text(row.name_en), ar: text(row.name_ar) || text(row.name_en) })
const descriptionFor = (slug: string) => ({
  en: 'Browse technology products and sourcing options for your requirements.',
  ar: 'تصفّح المنتجات التقنية وخيارات التوريد التي تلائم متطلباتك.'
})

function requireData<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message)
  return data as T
}

export async function testSupabaseConnection() {
  const [departmentsResult, productTypesResult] = await Promise.all([
    supabase.from('departments').select('id, name_en, name_ar, slug').limit(5),
    supabase.from('product_types').select('id, name_en, name_ar, slug, department_id').limit(5)
  ])
  if (departmentsResult.error) throw new Error(`Departments connection test failed: ${departmentsResult.error.message}`)
  if (productTypesResult.error) throw new Error(`Product types connection test failed: ${productTypesResult.error.message}`)
  console.info('Supabase catalog connection verified', {
    departments: departmentsResult.data.length,
    productTypes: productTypesResult.data.length
  })
}

export async function getDepartments(): Promise<Department[]> {
  const { data, error } = await supabase.from('departments').select('id, name_en, name_ar, slug').order('name_en')
  return requireData(data as Row[] | null, error).map(row => ({ ...localized(row), id: text(row.id), slug: text(row.slug), description: descriptionFor(text(row.slug)) }))
}

export async function getProductTypes(): Promise<ProductType[]> {
  const { data, error } = await supabase.from('product_types').select('id, name_en, name_ar, slug, department_id').order('name_en')
  return requireData(data as Row[] | null, error).map(row => ({ ...localized(row), id: text(row.id), slug: text(row.slug), departmentId: text(row.department_id) }))
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('id, name_en, name_ar, slug, product_type_id').order('name_en')
  return requireData(data as Row[] | null, error).map(row => ({ ...localized(row), id: text(row.id), slug: text(row.slug), productTypeId: text(row.product_type_id), subcategories: [] }))
}

export async function getSubcategories(): Promise<Subcategory[]> {
  const { data, error } = await supabase.from('subcategories').select('id, name_en, name_ar, slug, category_id').order('name_en')
  return requireData(data as Row[] | null, error).map(row => ({ ...localized(row), id: text(row.id), slug: text(row.slug), categoryId: text(row.category_id) }))
}

export async function getBrands(): Promise<Brand[]> {
  const { data, error } = await supabase.from('brands').select('id, name_en, name_ar, slug').order('name_en')
  return requireData(data as Row[] | null, error).map(row => ({ ...localized(row), id: text(row.id), slug: text(row.slug) }))
}

export async function getProducts(brands: Brand[], subcategories: Subcategory[]): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, sku, name_en, name_ar, department_id, product_type_id, category_id, subcategory_id, brand_id, pricing_mode, public_price, currency, availability, condition, warranty, model_number, manufacturer_part_number')
    .eq('is_published', true)
    .order('name_en')
  const brandNames = new Map(brands.map(brand => [brand.id, brand.en]))
  const subcategoryNames = new Map(subcategories.map(subcategory => [subcategory.id, subcategory.en]))
  return requireData(data as Row[] | null, error).map(row => {
    const publicPrice = row.public_price == null ? undefined : `${text(row.currency) || 'USD'} ${String(row.public_price)}`
    const specs = Object.fromEntries(Object.entries({
      Brand: brandNames.get(text(row.brand_id)),
      Availability: text(row.availability),
      Condition: text(row.condition),
      Warranty: text(row.warranty),
      Model: text(row.model_number),
      'Manufacturer part number': text(row.manufacturer_part_number)
    }).filter(([, value]) => Boolean(value))) as Record<string, string>
    return {
      ...localized(row), id: text(row.id), slug: text(row.slug), sku: text(row.sku),
      departmentId: text(row.department_id) || null, productTypeId: text(row.product_type_id) || null,
      categoryId: text(row.category_id) || null, subcategoryId: text(row.subcategory_id) || null,
      subcategory: subcategoryNames.get(text(row.subcategory_id)) || '', brand: brandNames.get(text(row.brand_id)) || '',
      mode: text(row.pricing_mode) === 'fixed' || text(row.pricing_mode) === 'starting' ? text(row.pricing_mode) as 'fixed' | 'starting' : 'quote',
      price: publicPrice, specs
    }
  })
}
