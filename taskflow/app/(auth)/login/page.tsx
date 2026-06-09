'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { setError('Email aur password dono bharo'); return }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log('Login response:', data)

      if (!data.success) {
        setError(data.message)
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))

      console.log('Token saved, redirecting...')
      window.location.href = '/dashboard'

    } catch (err: any) {
      console.error('Login error:', err)
      setError('Error: ' + err.message)
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 14px', background: '#1a1a24',
    border: '1px solid #2a2a3a', borderRadius: 8, color: '#f0f0f8',
    fontSize: 15, outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#111118', border: '1px solid #2a2a3a', borderRadius: 20, padding: '2.5rem' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, color: '#f0f0f8' }}>Welcome back</h1>
        <p style={{ color: '#888899', marginBottom: '1.5rem', fontSize: 14 }}>TaskFlow — Sign in to continue</p>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, color: '#f87171', marginBottom: 16, fontSize: 14 }}>
            ⚠ {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, color: '#888899', display: 'block', marginBottom: 5 }}>Email</label>
            <input
              style={inp}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#888899', display: 'block', marginBottom: 5 }}>Password</label>
            <input
              style={inp}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              padding: '13px', background: loading ? '#1a1a24' : '#6c63ff',
              color: loading ? '#888899' : '#fff', border: 'none', borderRadius: 8,
              fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4,
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#888899', fontSize: 14 }}>
          No account?{' '}
          <Link href="/register" style={{ color: '#6c63ff', textDecoration: 'none', fontWeight: 600 }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}