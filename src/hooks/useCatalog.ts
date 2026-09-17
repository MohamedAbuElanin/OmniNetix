import { useEffect, useState } from 'react'
import { getBrands, getCategories, getDepartments, getProducts, getProductTypes, getSubcategories, testSupabaseConnection } from '../services/catalog.service'
import type { Brand, Category, Department, Product, ProductType, Subcategory } from '../types/database.types'

type CatalogState = {
  departments: Department[]; productTypes: ProductType[]; categories: Category[]; subcategories: Subcategory[]; brands: Brand[]; products: Product[]
  loading: boolean; error: string | null
}
const initial: CatalogState = { departments: [], productTypes: [], categories: [], subcategories: [], brands: [], products: [], loading: true, error: null }

export function useCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>(initial)
  useEffect(() => {
    let active = true
    async function load() {
      try {
        await testSupabaseConnection()
        const [departments, productTypes, categories, subcategories, brands] = await Promise.all([getDepartments(), getProductTypes(), getCategories(), getSubcategories(), getBrands()])
        const products = await getProducts(brands, subcategories)
        if (active) setState({ departments, productTypes, categories: categories.map(category => ({ ...category, subcategories: subcategories.filter(subcategory => subcategory.categoryId === category.id) })), subcategories, brands, products, loading: false, error: null })
      } catch (cause) {
        if (active) setState(current => ({ ...current, loading: false, error: cause instanceof Error ? cause.message : 'Unable to load catalog.' }))
      }
    }
    void load()
    return () => { active = false }
  }, [])
  return state
}
