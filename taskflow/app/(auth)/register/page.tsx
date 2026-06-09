'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters'
    if (!form.email.includes('@')) return 'Enter a valid email address'
    if (form.password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(form.password)) return 'Password must contain at least one uppercase letter'
    if (!/[0-9]/.test(form.password)) return 'Password must contain at least one number'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setLoading(true)
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) { setError(data.message); return }
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      document.cookie = `token=${data.data.token}; path=/; max-age=${7 * 24 * 3600}`
      window.location.href = '/dashboard'
    } catch {
      setError('Network error. Check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  const pwChecks = [
    { label: '8+ chars', ok: form.password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(form.password) },
    { label: 'Number', ok: /[0-9]/.test(form.password) },
  ]

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 14px', background: '#1a1a24',
    border: '1px solid #2a2a3a', borderRadius: 8, color: '#f0f0f8', fontSize: 15, outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#111118', border: '1px solid #2a2a3a', borderRadius: 20, padding: '2.5rem' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, color: '#f0f0f8' }}>Create account</h1>
        <p style={{ color: '#888899', marginBottom: '1.5rem', fontSize: 14 }}>TaskFlow — Start managing tasks</p>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, color: '#f87171', marginBottom: 16, fontSize: 14 }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, color: '#888899', display: 'block', marginBottom: 5 }}>Full Name</label>
            <input style={inp} type="text" required placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#888899', display: 'block', marginBottom: 5 }}>Email</label>
            <input style={inp} type="email" required placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#888899', display: 'block', marginBottom: 5 }}>Password</label>
            <input style={inp} type="password" required placeholder="e.g. MyPass123" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            {form.password.length > 0 && (
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {pwChecks.map(c => (
                  <span key={c.label} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 600, background: c.ok ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.1)', color: c.ok ? '#4ade80' : '#f87171' }}>
                    {c.ok ? '✓' : '✗'} {c.label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={loading} style={{ padding: '13px', background: loading ? '#1a1a24' : '#6c63ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
            {loading ? 'Creating...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#888899', fontSize: 14 }}>
          Already have an account? <Link href="/login" style={{ color: '#6c63ff', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}