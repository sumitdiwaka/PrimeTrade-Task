import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { comparePassword, signToken } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'
import { apiResponse } from '@/lib/middleware'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) return apiResponse(null, parsed.error.errors[0].message, 400)

    const { email, password } = parsed.data
    const user = await db.user.findUnique({ where: { email } })
    if (!user) return apiResponse(null, 'Invalid email or password.', 401)

    const valid = await comparePassword(password, user.password)
    if (!valid) return apiResponse(null, 'Invalid email or password.', 401)

    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    const { password: _, ...safeUser } = user
    return apiResponse({ token, user: safeUser }, 'Login successful.')
  } catch (error: any) {
    console.error('[LOGIN ERROR]', error)
    const isDev = process.env.NODE_ENV === 'development'
    const message = isDev
      ? `Server error: ${error?.message || String(error)}`
      : 'Internal server error.'
    return NextResponse.json({ success: false, message, timestamp: new Date().toISOString() }, { status: 500 })
  }
}
