# TaskFlow — Scalable REST API with JWT Auth & RBAC

A production-ready fullstack task manager built with **Next.js 14**, **PostgreSQL**, **Prisma ORM**, **JWT authentication**, and **role-based access control**.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (local or [Railway](https://railway.app) / [Neon](https://neon.tech) free tier)

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment
```bash
cp .env.example .env
```
Edit `.env` and set:
- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_SECRET` — any random 32+ char string

### 3. Setup database
```bash
npx prisma migrate dev --name init
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Making a User Admin

After registering, promote a user via Prisma Studio:
```bash
npx prisma studio
```
Find the user in the `users` table → set `role = ADMIN` → Save.

Or via SQL:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

---

## 📡 API Endpoints

Base URL: `/api/v1`

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | ❌ | Register new user |
| `POST` | `/auth/login` | ❌ | Login, returns JWT |

### Tasks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/tasks` | ✅ JWT | Get tasks (filters: status, priority, page, limit) |
| `POST` | `/tasks` | ✅ JWT | Create task |
| `GET` | `/tasks/:id` | ✅ JWT | Get single task |
| `PUT` | `/tasks/:id` | ✅ JWT | Update task |
| `DELETE` | `/tasks/:id` | ✅ JWT | Delete task |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/admin/users` | ✅ ADMIN | List all users + task counts |

### Docs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/docs` | OpenAPI 3.0 JSON spec |

---

## 🗃️ Database Schema

```
User
  id        String  (cuid)
  email     String  (unique)
  name      String
  password  String  (bcrypt hashed)
  role      Role    (USER | ADMIN)
  tasks     Task[]

Task
  id          String
  title       String
  description String?
  status      TaskStatus  (TODO | IN_PROGRESS | DONE)
  priority    Priority    (LOW | MEDIUM | HIGH)
  dueDate     DateTime?
  userId      String (FK → User)
```

---

## 🛡️ Security Features
- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT** tokens with configurable expiry
- Input sanitized via **Zod** schemas
- Route protection via Next.js **middleware**
- Admin routes protected at API level

---

## 📁 Project Structure
```
taskflow/
├── app/
│   ├── api/v1/          # API routes (versioned)
│   │   ├── auth/        # register, login
│   │   ├── tasks/       # CRUD + [id]
│   │   └── admin/       # admin-only routes
│   ├── (auth)/          # login, register pages
│   ├── dashboard/       # protected user dashboard
│   └── admin/           # protected admin panel
├── lib/                 # auth, db, middleware, validations
├── prisma/              # schema + migrations
└── types/               # TypeScript interfaces
```

---

## 🛠️ Available Scripts
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npx prisma studio    # Open DB GUI
npx prisma migrate dev  # Run migrations
```
