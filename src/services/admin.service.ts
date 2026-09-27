import { supabase } from '../lib/supabaseClient'
import type { ActivityLog, Customer, Quotation, SourcingRequest, Supplier, SupplierOffer } from '../types/database.types'

export async function fetchAdminRequests(): Promise<{ data: SourcingRequest[]; isDevState: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('sourcing_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return { data: [], isDevState: true, error: error.message }
    }

    if (!data || data.length === 0) {
      return { data: [], isDevState: false }
    }

    const mapped: SourcingRequest[] = data.map(row => ({
      id: String(row.id),
      reference: String(row.reference || `ONX-${row.id}`),
      customerName: String(row.customer_name || 'Anonymous Business'),
      customerEmail: String(row.customer_email || 'contact@client.com'),
      company: String(row.company || 'Enterprise Partner'),
      notes: String(row.notes || ''),
      status: (row.status as SourcingRequest['status']) || 'new',
      itemCount: Number(row.item_count || 1),
      totalEst: row.total_est ? String(row.total_est) : undefined,
      createdAt: String(row.created_at || new Date().toISOString()),
      updatedAt: String(row.updated_at || new Date().toISOString()),
      assignedTo: row.assigned_to ? String(row.assigned_to) : undefined
    }))

    return { data: mapped, isDevState: false }
  } catch (err) {
    return { data: [], isDevState: true, error: err instanceof Error ? err.message : 'Failed to load requests' }
  }
}

export async function fetchAdminCustomers(): Promise<{ data: Customer[]; isDevState: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return { data: [], isDevState: true, error: error.message }
    }

    if (!data || data.length === 0) {
      return { data: [], isDevState: false }
    }

    const mapped: Customer[] = data.map(row => ({
      id: String(row.id),
      name: String(row.name),
      email: String(row.email),
      company: String(row.company || '—'),
      phone: String(row.phone || '—'),
      location: String(row.location || 'Saudi Arabia'),
      totalRequests: Number(row.total_requests || 0),
      status: (row.status as Customer['status']) || 'active',
      createdAt: String(row.created_at || new Date().toISOString())
    }))

    return { data: mapped, isDevState: false }
  } catch (err) {
    return { data: [], isDevState: true, error: err instanceof Error ? err.message : 'Failed to load customers' }
  }
}

export async function fetchAdminSuppliers(): Promise<{ data: Supplier[]; isDevState: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name', { ascending: true })
      .limit(50)

    if (error) {
      return { data: [], isDevState: true, error: error.message }
    }

    if (!data || data.length === 0) {
      return { data: [], isDevState: false }
    }

    const mapped: Supplier[] = data.map(row => ({
      id: String(row.id),
      name: String(row.name),
      contactName: String(row.contact_name || '—'),
      phone: String(row.phone || '—'),
      email: String(row.email || '—'),
      location: String(row.location || 'Global'),
      rating: Number(row.rating || 5),
      status: (row.status as Supplier['status']) || 'active',
      notes: row.notes ? String(row.notes) : undefined,
      createdAt: String(row.created_at || new Date().toISOString())
    }))

    return { data: mapped, isDevState: false }
  } catch (err) {
    return { data: [], isDevState: true, error: err instanceof Error ? err.message : 'Failed to load suppliers' }
  }
}

export async function fetchAdminSupplierOffers(): Promise<{ data: SupplierOffer[]; isDevState: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('supplier_offers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return { data: [], isDevState: true, error: error.message }
    }

    if (!data || data.length === 0) {
      return { data: [], isDevState: false }
    }

    const mapped: SupplierOffer[] = data.map(row => ({
      id: String(row.id),
      requestId: String(row.request_id),
      requestRef: String(row.request_ref || `ONX-${row.request_id}`),
      supplierId: String(row.supplier_id),
      supplierName: String(row.supplier_name || 'Partner Supplier'),
      productId: String(row.product_id),
      productName: String(row.product_name || 'Hardware Unit'),
      quantity: Number(row.quantity || 1),
      unitCost: Number(row.unit_cost || 0),
      totalCost: Number(row.total_cost || 0),
      leadTimeDays: Number(row.lead_time_days || 3),
      status: (row.status as SupplierOffer['status']) || 'pending',
      createdAt: String(row.created_at || new Date().toISOString())
    }))

    return { data: mapped, isDevState: false }
  } catch (err) {
    return { data: [], isDevState: true, error: err instanceof Error ? err.message : 'Failed to load supplier offers' }
  }
}

export async function fetchAdminQuotations(): Promise<{ data: Quotation[]; isDevState: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return { data: [], isDevState: true, error: error.message }
    }

    if (!data || data.length === 0) {
      return { data: [], isDevState: false }
    }

    const mapped: Quotation[] = data.map(row => ({
      id: String(row.id),
      reference: String(row.reference || `QT-${row.id}`),
      requestId: String(row.request_id),
      customerName: String(row.customer_name || 'Client'),
      totalAmount: Number(row.total_amount || 0),
      currency: String(row.currency || 'USD'),
      validUntil: String(row.valid_until || new Date().toISOString()),
      status: (row.status as Quotation['status']) || 'draft',
      createdAt: String(row.created_at || new Date().toISOString())
    }))

    return { data: mapped, isDevState: false }
  } catch (err) {
    return { data: [], isDevState: true, error: err instanceof Error ? err.message : 'Failed to load quotations' }
  }
}

export async function fetchAdminActivityLogs(): Promise<{ data: ActivityLog[]; isDevState: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return { data: [], isDevState: true, error: error.message }
    }

    if (!data || data.length === 0) {
      return { data: [], isDevState: false }
    }

    const mapped: ActivityLog[] = data.map(row => ({
      id: String(row.id),
      timestamp: String(row.created_at || new Date().toISOString()),
      user: String(row.user_email || 'System User'),
      action: String(row.action || 'UPDATE'),
      entity: String(row.entity || 'Catalog'),
      entityId: String(row.entity_id || row.id),
      summary: String(row.summary || 'Record modified')
    }))

    return { data: mapped, isDevState: false }
  } catch (err) {
    return { data: [], isDevState: true, error: err instanceof Error ? err.message : 'Failed to load activity logs' }
  }
}
