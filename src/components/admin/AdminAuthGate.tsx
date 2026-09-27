import { type FormEvent, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, KeyRound, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { sendPasswordRecovery, signInAdmin } from '../../services/adminAuth.service'
import { useAdminSession } from '../../hooks/useAdminSession'
import type { Locale } from '../../types/database.types'

export function AdminLoadingState() { return <div className="admin-auth-loading"><span>OMNINETIX</span><i /><i /><i /></div> }

export function ProtectedAdminRoute() {
  const auth = useAdminSession()
  if (auth.loading) return <AdminLoadingState />
  if (!auth.authenticated) return <Navigate to="/admin/login" replace />
  if (!auth.authorized) return <AccessDenied />
  return <Outlet />
}

export function AdminLoginPage({ locale, setLocale }: { locale: Locale; setLocale: (locale: Locale) => void }) {
  const auth = useAdminSession(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [visible, setVisible] = useState(false); const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const [submitting, setSubmitting] = useState(false); const [recovery, setRecovery] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setNotice('')
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError('Enter a valid email address.'); return }
    if (!recovery && !password) { setError('Enter your password.'); return }
    setSubmitting(true)
    const result = recovery ? await sendPasswordRecovery(email) : await signInAdmin(email, password)
    if (recovery && !result.error) setNotice('If this address belongs to an account, a recovery link has been sent.')
    if (result.error) setError(result.error)
    setPassword(''); setSubmitting(false)
  }
  if (auth.loading) return <AdminLoadingState />
  if (auth.authenticated) return <Navigate to="/admin" replace />
  const ar = locale === 'ar'
  return <main className="admin-login-shell"><section className="admin-login-copy"><img src="/omni-logo.svg" alt="OmniNetix" /><span>{ar ? 'العمليات الداخلية' : 'INTERNAL OPERATIONS'}</span><h1>{ar ? <>توريد تقني<br />تحت السيطرة.</> : <>Technology sourcing,<br />under control.</>}</h1><p>{ar ? 'أدر الكتالوج والطلبات وأعمال التوريد من مساحة عمل واحدة محمية.' : 'Manage catalog, requests and procurement work from one protected workspace.'}</p><div><ShieldCheck size={18} /><span>{ar ? 'يتم التحقق من الوصول عبر Supabase Auth وسياسات RLS.' : 'Access is verified with Supabase Auth and database RLS.'}</span></div></section><section className="admin-login-panel"><button className="admin-login-language" type="button" onClick={() => setLocale(ar ? 'en' : 'ar')}>{ar ? 'English' : 'العربية'}</button><form className="admin-login-card" onSubmit={submit} noValidate><div className="admin-login-mark"><LockKeyhole size={22} /></div><span className="admin-login-eyebrow">{ar ? 'دخول آمن' : 'SECURE ACCESS'}</span><h2>{recovery ? (ar ? 'إعادة تعيين كلمة المرور' : 'Reset your password') : (ar ? 'تسجيل الدخول للعمليات' : 'Sign in to operations')}</h2><p>{recovery ? (ar ? 'أدخل بريد العمل وسنرسل رابط استعادة آمن.' : 'Enter your work email and we will send a secure recovery link.') : (ar ? 'استخدم بريد مسؤول OmniNetix وكلمة المرور.' : 'Use your OmniNetix administrator email and password.')}</p><label><span>{ar ? 'البريد الإلكتروني' : 'Email'}</span><div><Mail size={17} /><input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required aria-invalid={Boolean(error)} /></div></label>{!recovery && <label><span>{ar ? 'كلمة المرور' : 'Password'}</span><div><KeyRound size={17} /><input type={visible ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /><button className="admin-password-toggle" type="button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>}{error && <p className="admin-login-error" role="alert">{error}</p>}{notice && <p className="admin-login-notice" role="status">{notice}</p>}<button className="admin-login-submit" type="submit" disabled={submitting}>{submitting ? (ar ? 'جارٍ التحقق…' : 'Verifying…') : <>{recovery ? (ar ? 'إرسال رابط الاستعادة' : 'Send recovery link') : (ar ? 'تسجيل الدخول' : 'Sign in')} <ArrowRight size={17} /></>}</button><button className="admin-forgot-password" type="button" onClick={() => { setRecovery(!recovery); setError(''); setNotice('') }}>{recovery ? (ar ? 'العودة لتسجيل الدخول' : 'Back to sign in') : (ar ? 'هل نسيت كلمة المرور؟' : 'Forgot password?')}</button><small>{ar ? 'لموظفي OmniNetix المصرح لهم فقط.' : 'Authorized OmniNetix personnel only.'}</small></form></section></main>
}

function AccessDenied() {
  const auth = useAdminSession(); const navigate = useNavigate()
  return <main className="admin-denied"><div><LockKeyhole size={30} /><span>OMNINETIX / ACCESS CONTROL</span><h1>Access denied</h1><p>{auth.profile?.status !== 'active' ? 'Your account is not active. Please contact an administrator.' : 'You do not have permission to access this area.'}</p>{auth.profileError && <small>Your access profile could not be verified.</small>}<div><button className="admin-primary" onClick={() => navigate('/')}>Return to website</button><button className="admin-secondary" onClick={() => { void auth.signOut() }}>Sign out</button></div></div></main>
}
