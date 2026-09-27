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

export type RequestStatus =
  | 'new'
  | 'under_review'
  | 'sourcing'
  | 'quote_preparation'
  | 'quote_sent'
  | 'awaiting_customer'
  | 'approved'
  | 'completed'
  | 'cancelled'

export type SourcingRequest = {
  id: string
  reference: string
  customerName: string
  customerEmail: string
  company: string
  notes: string
  status: RequestStatus
  itemCount: number
  totalEst?: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
}

export type Customer = {
  id: string
  name: string
  email: string
  company: string
  phone: string
  location: string
  totalRequests: number
  status: 'active' | 'vip' | 'inactive'
  createdAt: string
}

export type Supplier = {
  id: string
  name: string
  contactName: string
  phone: string
  email: string
  location: string
  rating: number
  status: 'active' | 'preferred' | 'under_review' | 'inactive'
  notes?: string
  createdAt: string
}

export type SupplierOffer = {
  id: string
  requestId: string
  requestRef: string
  supplierId: string
  supplierName: string
  productId: string
  productName: string
  quantity: number
  unitCost: number
  totalCost: number
  leadTimeDays: number
  status: 'pending' | 'received' | 'selected' | 'rejected'
  createdAt: string
}

export type QuotationStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'

export type Quotation = {
  id: string
  reference: string
  requestId: string
  customerName: string
  totalAmount: number
  currency: string
  validUntil: string
  status: QuotationStatus
  createdAt: string
}

export type ActivityLog = {
  id: string
  timestamp: string
  user: string
  action: string
  entity: string
  entityId: string
  summary: string
}

