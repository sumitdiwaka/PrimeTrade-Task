import { db } from '@/lib/db'
import { taskSchema } from '@/lib/validations'
import { withAuth, apiResponse, AuthRequest } from '@/lib/middleware'

export const GET = withAuth(async (req: AuthRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') as any
    const priority = searchParams.get('priority') as any
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = { userId: req.user!.userId }
    if (status) where.status = status
    if (priority) where.priority = priority

    const [tasks, total] = await Promise.all([
      db.task.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      db.task.count({ where }),
    ])

    return apiResponse(tasks, 'Tasks fetched successfully.', 200, {
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch {
    return apiResponse(null, 'Internal server error.', 500)
  }
})

export const POST = withAuth(async (req: AuthRequest) => {
  try {
    const body = await req.json()
    const parsed = taskSchema.safeParse(body)
    if (!parsed.success) return apiResponse(null, parsed.error.errors[0].message, 400)

    const task = await db.task.create({
      data: { ...parsed.data, userId: req.user!.userId },
    })
    return apiResponse(task, 'Task created successfully.', 201)
  } catch {
    return apiResponse(null, 'Internal server error.', 500)
  }
})
