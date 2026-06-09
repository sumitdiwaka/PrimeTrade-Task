import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractToken, JWTPayload } from './auth'

export interface AuthRequest extends NextRequest {
  user?: JWTPayload
}

type RouteHandler = (req: AuthRequest, context: { params: Record<string, string> }) => Promise<NextResponse>

export function withAuth(handler: RouteHandler, requiredRole?: string) {
  return async (req: AuthRequest, context: { params: Record<string, string> }) => {
    try {
      const token = extractToken(req.headers.get('authorization'))
      if (!token) {
        return NextResponse.json({ success: false, message: 'Access denied. No token provided.' }, { status: 401 })
      }
      const payload = verifyToken(token)
      req.user = payload
      if (requiredRole && payload.role !== requiredRole) {
        return NextResponse.json({ success: false, message: 'Access denied. Insufficient permissions.' }, { status: 403 })
      }
      return handler(req, context)
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid or expired token.' }, { status: 401 })
    }
  }
}

export function apiResponse<T>(data: T, message: string, status: number = 200, meta?: Record<string, unknown>) {
  return NextResponse.json({
    success: status < 400,
    message,
    data,
    ...(meta && { meta }),
    timestamp: new Date().toISOString(),
  }, { status })
}
