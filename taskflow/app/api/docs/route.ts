import { NextResponse } from 'next/server'

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'TaskFlow API',
    version: '1.0.0',
    description: 'Scalable REST API with JWT Authentication and Role-Based Access Control',
    contact: { name: 'TaskFlow Dev', email: 'api@taskflow.dev' },
  },
  servers: [{ url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', description: 'Development Server' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string' }, title: { type: 'string' },
          description: { type: 'string' }, status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'] },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
          dueDate: { type: 'string', format: 'date-time', nullable: true },
          userId: { type: 'string' }, createdAt: { type: 'string' }, updatedAt: { type: 'string' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Tasks', description: 'Task CRUD operations' },
    { name: 'Admin', description: 'Admin-only endpoints' },
  ],
  paths: {
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'], summary: 'Register new user',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name', 'email', 'password'], properties: { name: { type: 'string', example: 'John Doe' }, email: { type: 'string', example: 'john@example.com' }, password: { type: 'string', example: 'Password123' } } } } } },
        responses: { 201: { description: 'User registered' }, 400: { description: 'Validation error' }, 409: { description: 'Email exists' } },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'], summary: 'Login user',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string' }, password: { type: 'string' } } } } } },
        responses: { 200: { description: 'Login successful with JWT token' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/api/v1/tasks': {
      get: { tags: ['Tasks'], summary: 'Get all tasks (paginated)', security: [{ bearerAuth: [] }], parameters: [{ name: 'status', in: 'query', schema: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'] } }, { name: 'priority', in: 'query', schema: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'Task list with pagination' }, 401: { description: 'Unauthorized' } } },
      post: { tags: ['Tasks'], summary: 'Create task', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['title'], properties: { title: { type: 'string' }, description: { type: 'string' }, status: { type: 'string' }, priority: { type: 'string' }, dueDate: { type: 'string' } } } } } }, responses: { 201: { description: 'Task created' } } },
    },
    '/api/v1/tasks/{id}': {
      get: { tags: ['Tasks'], summary: 'Get task by ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Task found' }, 404: { description: 'Not found' } } },
      put: { tags: ['Tasks'], summary: 'Update task', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Task updated' } } },
      delete: { tags: ['Tasks'], summary: 'Delete task', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Task deleted' } } },
    },
    '/api/v1/admin/users': {
      get: { tags: ['Admin'], summary: 'Get all users (ADMIN only)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'User list' }, 403: { description: 'Forbidden - Admins only' } } },
    },
  },
}

export function GET() {
  return NextResponse.json(swaggerSpec)
}
