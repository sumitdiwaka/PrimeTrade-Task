'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserRow { id: string; name: string; email: string; role: string; createdAt: string; _count: { tasks: number } }

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (!u || JSON.parse(u).role !== 'ADMIN') { router.push('/dashboard'); return }
    const token = localStorage.getItem('token')
    fetch('/api/v1/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setUsers(d.data) })
      .finally(() => setLoading(false))
  }, [router])

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>
      <nav style={{ padding: '1rem 2rem', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--accent)' }}>TaskFlow</span>
          <span style={{ padding: '3px 10px', background: 'rgba(255,101,132,0.15)', color: 'var(--accent2)', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>ADMIN</span>
        </div>
        <Link href="/dashboard" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Dashboard</Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>User Management</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>{users.length} registered users</p>
          </div>
          <input
            placeholder="Search users..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none', minWidth: 220 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: '2rem' }}>
          {[
            { label: 'Total Users', value: users.length, color: '#a39fff' },
            { label: 'Admin Users', value: users.filter(u => u.role === 'ADMIN').length, color: '#ff6584' },
            { label: 'Total Tasks', value: users.reduce((a, u) => a + u._count.tasks, 0), color: '#4ade80' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>Loading users...</p>
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 60px 100px', padding: '12px 20px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <span>User</span><span>Email</span><span>Role</span><span>Tasks</span><span>Joined</span>
            </div>
            {filtered.map((u, i) => (
              <div key={u.id} style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 80px 60px 100px',
                padding: '14px 20px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'center', fontSize: 14,
              }}>
                <span style={{ fontWeight: 600 }}>{u.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{u.email}</span>
                <span style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 20, fontWeight: 700, textTransform: 'uppercase',
                  background: u.role === 'ADMIN' ? 'rgba(255,101,132,0.15)' : 'rgba(108,99,255,0.15)',
                  color: u.role === 'ADMIN' ? 'var(--accent2)' : 'var(--accent)',
                  display: 'inline-block',
                }}>{u.role}</span>
                <span style={{ color: 'var(--text-muted)' }}>{u._count.tasks}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
            {filtered.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found</p>}
          </div>
        )}
      </div>
    </div>
  )
}
