import { db } from '@/lib/db'
import { taskUpdateSchema } from '@/lib/validations'
import { withAuth, apiResponse, AuthRequest } from '@/lib/middleware'

export const GET = withAuth(async (req: AuthRequest, { params }: { params: { id: string } }) => {
  try {
    const task = await db.task.findFirst({ where: { id: params.id, userId: req.user!.userId } })
    if (!task) return apiResponse(null, 'Task not found.', 404)
    return apiResponse(task, 'Task fetched.')
  } catch {
    return apiResponse(null, 'Internal server error.', 500)
  }
})

export const PUT = withAuth(async (req: AuthRequest, { params }: { params: { id: string } }) => {
  try {
    const task = await db.task.findFirst({ where: { id: params.id, userId: req.user!.userId } })
    if (!task) return apiResponse(null, 'Task not found.', 404)

    const body = await req.json()
    const parsed = taskUpdateSchema.safeParse(body)
    if (!parsed.success) return apiResponse(null, parsed.error.errors[0].message, 400)

    const updated = await db.task.update({ where: { id: params.id }, data: parsed.data })
    return apiResponse(updated, 'Task updated.')
  } catch {
    return apiResponse(null, 'Internal server error.', 500)
  }
})

export const DELETE = withAuth(async (req: AuthRequest, { params }: { params: { id: string } }) => {
  try {
    const task = await db.task.findFirst({ where: { id: params.id, userId: req.user!.userId } })
    if (!task) return apiResponse(null, 'Task not found.', 404)
    await db.task.delete({ where: { id: params.id } })
    return apiResponse(null, 'Task deleted.')
  } catch {
    return apiResponse(null, 'Internal server error.', 500)
  }
})
