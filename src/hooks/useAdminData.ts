import { useEffect, useState } from 'react'
import {
  fetchAdminActivityLogs,
  fetchAdminCustomers,
  fetchAdminQuotations,
  fetchAdminRequests,
  fetchAdminSupplierOffers,
  fetchAdminSuppliers
} from '../services/admin.service'
import type { ActivityLog, Customer, Quotation, SourcingRequest, Supplier, SupplierOffer } from '../types/database.types'
import { useAdminSession } from './useAdminSession'

export function useAdminData() {
  const { authorized, loading: sessionLoading } = useAdminSession()
  const [requests, setRequests] = useState<SourcingRequest[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [supplierOffers, setSupplierOffers] = useState<SupplierOffer[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDevState, setIsDevState] = useState(false)

  useEffect(() => {
    if (sessionLoading || !authorized) {
      setLoading(sessionLoading)
      return
    }
    let isMounted = true

    async function loadAll() {
      setLoading(true)
      try {
        const [reqRes, custRes, suppRes, offerRes, quoteRes, logRes] = await Promise.all([
          fetchAdminRequests(),
          fetchAdminCustomers(),
          fetchAdminSuppliers(),
          fetchAdminSupplierOffers(),
          fetchAdminQuotations(),
          fetchAdminActivityLogs()
        ])

        if (!isMounted) return

        setRequests(reqRes.data)
        setCustomers(custRes.data)
        setSuppliers(suppRes.data)
        setSupplierOffers(offerRes.data)
        setQuotations(quoteRes.data)
        setActivityLogs(logRes.data)

        const devFlag = reqRes.isDevState || custRes.isDevState || suppRes.isDevState || quoteRes.isDevState
        setIsDevState(devFlag)
        setLoading(false)
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error initializing operational workspace')
          setLoading(false)
        }
      }
    }

    void loadAll()

    return () => {
      isMounted = false
    }
  }, [authorized, sessionLoading])

  return {
    requests,
    customers,
    suppliers,
    supplierOffers,
    quotations,
    activityLogs,
    loading,
    error,
    isDevState
  }
}
