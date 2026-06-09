import Link from 'next/link'

export default function Home() {
  const features = [
    { icon: '🔐', title: 'JWT Auth', desc: 'Secure stateless authentication with token expiry' },
    { icon: '👥', title: 'Role-Based Access', desc: 'USER and ADMIN roles with route protection' },
    { icon: '📋', title: 'Task CRUD', desc: 'Full create, read, update, delete with filters' },
    { icon: '📖', title: 'API Docs', desc: 'OpenAPI 3.0 spec at /api/docs' },
    { icon: '🛡️', title: 'Input Validation', desc: 'Zod schemas with detailed error messages' },
    { icon: '🗃️', title: 'Prisma ORM', desc: 'Type-safe PostgreSQL with migrations' },
  ]

  return (
    <main style={{
      minHeight: '100vh', fontFamily: 'var(--font-body)',
      background: 'radial-gradient(ellipse at 60% 10%, #1a0a3a 0%, #0a0a0f 55%)',
    }}>
      <nav style={{
        padding: '1.25rem 2rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--accent)' }}>
          TaskFlow
        </span>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/login" style={{ padding: '8px 20px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }}>Login</Link>
          <Link href="/register" style={{
            padding: '8px 20px', background: 'var(--accent)', color: '#fff',
            borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600,
          }}>Get Started</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '5rem 2rem 3rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', padding: '6px 18px',
          background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)',
          borderRadius: 100, fontSize: 13, color: '#a39fff', marginBottom: 28,
          fontFamily: 'var(--font-display)', letterSpacing: 1,
        }}>
          v1.0 · REST API · Next.js 14
        </div>

        <h1 style={{
          fontSize: 'clamp(3.5rem, 9vw, 6rem)', fontFamily: 'var(--font-display)',
          fontWeight: 800, lineHeight: 0.95, marginBottom: 24,
          background: 'linear-gradient(135deg, #f0f0f8 30%, #a39fff 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Task<br />Flow
        </h1>

        <p style={{ fontSize: 18, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.75 }}>
          A production-ready fullstack task manager built with Next.js, PostgreSQL,
          JWT authentication, and role-based access control.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '5rem' }}>
          <Link href="/register" style={{
            padding: '15px 36px', background: 'var(--accent)',
            color: '#fff', borderRadius: 10, fontWeight: 700,
            textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: 16,
          }}>Start Free →</Link>
          <Link href="/login" style={{
            padding: '15px 36px', background: 'var(--surface)',
            color: 'var(--text)', border: '1px solid var(--border)',
            borderRadius: 10, fontWeight: 600, textDecoration: 'none', fontSize: 16,
          }}>Sign In</Link>
          <a href="/api/docs" target="_blank" style={{
            padding: '15px 36px', background: 'transparent',
            color: '#a39fff', border: '1px solid rgba(108,99,255,0.3)',
            borderRadius: 10, fontWeight: 600, textDecoration: 'none', fontSize: 16,
          }}>API Docs ↗</a>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16, textAlign: 'left',
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '1.5rem',
              transition: 'border-color 0.2s',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '4rem', padding: '1.5rem', background: 'var(--surface2)', borderRadius: 12, textAlign: 'left', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-display)', fontWeight: 600 }}>QUICK START</p>
          <pre style={{ fontSize: 13, color: '#a39fff', overflow: 'auto' }}>{`cp .env.example .env   # Add your DATABASE_URL + JWT_SECRET
npx prisma migrate dev  # Setup database
npm run dev             # Start at localhost:3000`}</pre>
        </div>
      </div>
    </main>
  )
}
