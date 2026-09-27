import { supabase } from '../lib/supabaseClient'

export const ADMIN_ROLES = ['super_admin', 'admin', 'manager', 'sales', 'procurement', 'catalog_manager'] as const
export const DASHBOARD_ROLES = ['super_admin', 'admin', 'manager'] as const
export type AdminRole = typeof ADMIN_ROLES[number]
export type ProfileStatus = 'active' | 'inactive' | 'archived'

export type AdminProfile = { id: string; fullName: string | null; phone: string | null; role: AdminRole; status: ProfileStatus; avatarUrl: string | null }

export function canAccessDashboard(profile: AdminProfile | null) {
  return Boolean(profile && profile.status === 'active' && DASHBOARD_ROLES.includes(profile.role as typeof DASHBOARD_ROLES[number]))
}

export async function signInAdmin(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (!error) return { error: null }
  const message = error.message.toLowerCase()
  if (message.includes('email not confirmed')) return { error: 'Please confirm your email before signing in.' }
  if (error.status === 429 || message.includes('too many')) return { error: 'Too many login attempts. Please try again later.' }
  if (message.includes('invalid login credentials')) return { error: 'Invalid email or password.' }
  return { error: 'Unable to sign in. Please try again.' }
}

export async function sendPasswordRecovery(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin/login` })
  return { error: error ? 'Unable to send the recovery email. Please try again.' : null }
}

export async function fetchAdminProfile(userId: string): Promise<{ profile: AdminProfile | null; error: string | null }> {
  const { data, error } = await supabase.from('profiles').select('id, full_name, phone, role, status, avatar_url').eq('id', userId).maybeSingle()
  if (error) return { profile: null, error: 'Unable to verify your access profile.' }
  if (!data || !ADMIN_ROLES.includes(data.role as AdminRole)) return { profile: null, error: 'Your account does not have an OmniNetix access profile.' }
  return { profile: { id: String(data.id), fullName: typeof data.full_name === 'string' ? data.full_name : null, phone: typeof data.phone === 'string' ? data.phone : null, role: data.role as AdminRole, status: data.status === 'active' || data.status === 'inactive' || data.status === 'archived' ? data.status : 'inactive', avatarUrl: typeof data.avatar_url === 'string' ? data.avatar_url : null }, error: null }
}

export async function signOutAdmin() { await supabase.auth.signOut() }
