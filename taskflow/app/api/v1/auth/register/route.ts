import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { apiResponse } from '@/lib/middleware'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) return apiResponse(null, parsed.error.errors[0].message, 400)

    const { name, email, password } = parsed.data
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) return apiResponse(null, 'Email already registered.', 409)

    const hashed = await hashPassword(password)
    const user = await db.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    return apiResponse({ token, user }, 'Registration successful.', 201)
  } catch (error: any) {
    console.error('[REGISTER ERROR]', error)
    // Return the actual error message in development so you can debug
    const isDev = process.env.NODE_ENV === 'development'
    const message = isDev
      ? `Server error: ${error?.message || String(error)}`
      : 'Internal server error.'
    return NextResponse.json({ success: false, message, timestamp: new Date().toISOString() }, { status: 500 })
  }
}
