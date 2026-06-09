import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const checks: Record<string, any> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ MISSING',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ MISSING',
      NODE_ENV: process.env.NODE_ENV,
    },
    database: 'checking...',
  }

  try {
    await db.$queryRaw`SELECT 1`
    checks.database = '✅ Connected'
  } catch (err: any) {
    checks.database = `❌ Failed: ${err?.message}`
    checks.status = 'error'
  }

  const httpStatus = checks.status === 'ok' ? 200 : 500
  return NextResponse.json(checks, { status: httpStatus })
}
