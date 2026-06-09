# Scalability & Architecture Notes

## Current Stack
Monolithic Next.js 14 app — optimal for MVP, scales to ~100K users with proper infra.

## Scaling Strategies

### 1. Database
- **Connection Pooling**: Use [Prisma Accelerate](https://www.prisma.io/accelerate) or PgBouncer
- **Read Replicas**: Route GET queries to replicas
- **Indexes**: Already optimal on `userId`, `email` (unique), `status`

### 2. Caching (Redis)
```
Task lists       → Cache 60s, invalidate on write
User sessions    → Store JWT blacklist for logout
Rate limits      → Sliding window per IP
```

### 3. Horizontal Scaling
- Next.js is **stateless** — run N instances behind a load balancer
- JWT is stateless — no sticky sessions needed
- Use **Vercel / Railway / Fly.io** for zero-config scaling

### 4. Microservices Path (Future)
```
API Gateway (Kong/Nginx)
    ├── Auth Service    (JWT, users)
    ├── Task Service    (CRUD, notifications)
    └── Admin Service   (analytics, management)
```

### 5. Rate Limiting
```typescript
// Add to auth routes
import { Ratelimit } from '@upstash/ratelimit'
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '15 m'),
})
```

### 6. Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npx prisma generate && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on: [db]
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: taskflow
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes: [pgdata:/var/lib/postgresql/data]
volumes:
  pgdata:
```

### 7. Monitoring
- **Logging**: Pino (structured JSON)
- **Metrics**: Prometheus + Grafana
- **Tracing**: OpenTelemetry
- **Errors**: Sentry
