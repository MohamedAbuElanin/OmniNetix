export type Locale = 'en' | 'ar'

export type LocalizedName = { en: string; ar: string }

export type Department = LocalizedName & {
  id: string
  slug: string
  description: LocalizedName
}

export type ProductType = LocalizedName & {
  id: string
  departmentId: string
  slug: string
}

export type Subcategory = LocalizedName & { id: string; slug: string; categoryId: string }

export type Category = LocalizedName & {
  id: string
  productTypeId: string
  slug: string
  subcategories: Subcategory[]
}

export type Brand = LocalizedName & { id: string; slug: string }

export type Product = LocalizedName & {
  id: string
  slug: string
  sku: string
  departmentId: string | null
  productTypeId: string | null
  categoryId: string | null
  subcategoryId: string | null
  subcategory: string
  brand: string
  mode: 'quote' | 'starting' | 'fixed'
  price?: string
  specs: Record<string, string>
}
