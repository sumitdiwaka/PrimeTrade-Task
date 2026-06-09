import { db } from '@/lib/db'
import { withAuth, apiResponse, AuthRequest } from '@/lib/middleware'

export const GET = withAuth(async (_req: AuthRequest) => {
  try {
    const users = await db.user.findMany({
      select: {
        id: true, name: true, email: true, role: true, createdAt: true,
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return apiResponse(users, 'Users fetched.')
  } catch {
    return apiResponse(null, 'Internal server error.', 500)
  }
}, 'ADMIN')
