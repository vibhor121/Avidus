# TaskManager Pro

### Role-Based Access Control + Activity Tracking — Full Stack Assignment

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens)

---

## Admin Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@taskmanager.com | Admin@123 |
| User | Register at /register | your choice |

> Admin is redirected to the Admin Dashboard automatically on login.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://avidus-jet.vercel.app/login |
| Backend API | https://avidus-laap.onrender.com/api/health |

---

## What Was Built

A full-stack task management application implementing:

- **Role-Based Access Control (RBAC)** — Admin and User roles with separate permissions
- **JWT Authentication** — Secure stateless auth with 7-day token expiry
- **Activity Log System** — Every login and task action is tracked automatically
- **Admin Dashboard** — Full platform control with analytics, user and task management
- **Protected Routes** — Both API middleware and React route guards

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend Runtime | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB Atlas + Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcryptjs |
| Frontend | React.js 18 + Vite |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Hosting — Frontend | Vercel |
| Hosting — Backend | Render |

---

## Project Structure

```
Avidus/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js               # User schema (role, status)
│   │   │   ├── Task.js               # Task schema (title, status, priority)
│   │   │   └── ActivityLog.js        # Activity log schema
│   │   ├── middleware/
│   │   │   └── auth.js               # protect + adminOnly middleware
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, Login, GetMe
│   │   │   ├── taskController.js     # User task CRUD + activity logging
│   │   │   └── adminController.js    # Admin operations + stats
│   │   └── routes/
│   │       ├── auth.js               # /api/auth
│   │       ├── tasks.js              # /api/tasks
│   │       └── admin.js              # /api/admin
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js              # Axios instance with auth interceptor
    │   ├── context/
    │   │   └── AuthContext.jsx       # Global auth state (login/logout/register)
    │   ├── components/
    │   │   ├── Navbar.jsx            # Role-aware navigation bar
    │   │   ├── ProtectedRoute.jsx    # Redirects unauthenticated users
    │   │   ├── AdminRoute.jsx        # Redirects non-admin users
    │   │   └── StatCard.jsx          # Reusable analytics stat card
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx         # User dashboard with personal task stats
    │   │   ├── Tasks.jsx             # Full task CRUD with filters
    │   │   └── admin/
    │   │       ├── AdminLayout.jsx   # Sidebar layout for admin pages
    │   │       ├── Overview.jsx      # Platform analytics + progress bars
    │   │       ├── UserManagement.jsx
    │   │       ├── TaskMonitoring.jsx
    │   │       └── ActivityLogs.jsx  # Searchable audit trail
    │   ├── App.jsx                   # Route definitions
    │   └── main.jsx
    └── package.json
```

---

## Role-Based Access Control

### Middleware Flow

```
HTTP Request
    │
    ▼
protect middleware      ← Verifies JWT, loads req.user from DB
    │
    ▼
adminOnly middleware    ← Checks req.user.role === 'admin'
    │
    ▼
Route Handler          ← Executes only if all checks pass
```

### Permission Matrix

| Action | Admin | User |
|--------|:-----:|:----:|
| View all users | ✅ | ❌ |
| Delete any user | ✅ | ❌ |
| Toggle user active/inactive | ✅ | ❌ |
| View all tasks (platform-wide) | ✅ | ❌ |
| Delete any task | ✅ | ❌ |
| View activity logs | ✅ | ❌ |
| Create own tasks | ✅ | ✅ |
| View own tasks | ✅ | ✅ |
| Update own tasks | ✅ | ✅ |
| Delete own tasks | ✅ | ✅ |

### How Admin Role is Assigned

A deliberate security decision was made — **the registration API never allows self-assigning the admin role**. This prevents any user from passing `role: "admin"` in the request body.

```
POST /api/auth/register  →  role is always forced to "user" in code
seed.js (server-side)    →  only way to create an admin, runs directly on the server
```

The first admin is bootstrapped via a seed script that writes directly to MongoDB through Mongoose, bypassing the HTTP API entirely — the same pattern used in production applications.

---

## Activity Log System

Every important action is automatically recorded in the `ActivityLog` MongoDB collection.

| Event | Trigger |
|-------|---------|
| `USER_REGISTERED` | New user signs up |
| `USER_LOGIN` | User logs in successfully |
| `TASK_CREATED` | User creates a task |
| `TASK_UPDATED` | User updates a task |
| `TASK_DELETED` | User deletes their task |
| `ADMIN_TASK_DELETED` | Admin deletes any task |

Each log stores: `user`, `action`, `details`, `ipAddress`, `createdAt`

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register (role always = user) |
| POST | `/login` | Public | Login, returns JWT token |
| GET | `/me` | Protected | Get current user info |

### Tasks — `/api/tasks`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | User | Get own tasks only |
| POST | `/` | User | Create task |
| PUT | `/:id` | User | Update own task |
| DELETE | `/:id` | User | Delete own task |

### Admin — `/api/admin`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Platform analytics (users, tasks, completion rate) |
| GET | `/users` | All registered users |
| DELETE | `/users/:id` | Delete user + all their data |
| PATCH | `/users/:id/status` | Toggle active / inactive |
| GET | `/tasks` | All tasks across all users |
| DELETE | `/tasks/:id` | Delete any task |
| GET | `/activity-logs` | Full audit trail (latest 200) |

---

## Frontend Pages

### User

| Route | Description |
|-------|-------------|
| `/login` | Login with email + password |
| `/register` | Create new account |
| `/dashboard` | Personal stats + recent tasks |
| `/tasks` | Create, edit, delete, filter tasks |

### Admin (admin role only)

| Route | Description |
|-------|-------------|
| `/admin/overview` | Platform stats + completion rate progress bars |
| `/admin/users` | View all users, toggle status, delete |
| `/admin/tasks` | View all tasks, filter by status, delete |
| `/admin/activity-logs` | Searchable real-time activity audit trail |

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- npm

### 1. Clone

```bash
git clone https://github.com/vibhor121/Avidus.git
cd Avidus
git checkout feature/role-based-access
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

`.env` file:
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/avidus_taskmanager
JWT_SECRET=your_secret_key
PORT=5000
```

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Seed Admin

```bash
cd backend
node seed.js
```

```
Email    : admin@taskmanager.com
Password : Admin@123
```

---

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `MONGO_URI` | Backend | MongoDB Atlas connection string |
| `JWT_SECRET` | Backend | Secret key for signing JWTs |
| `PORT` | Backend | Server port (default 5000) |
| `FRONTEND_URL` | Backend | Vercel URL for CORS whitelist |
| `VITE_API_URL` | Frontend | Backend API base URL |

---

## Git Workflow

- All work done on `feature/role-based-access` branch
- Pull Request raised to merge into `main`
- Separate commits for each logical unit of work

```bash
git checkout feature/role-based-access
```

---

## Author

**Vibhor** — [github.com/vibhor121](https://github.com/vibhor121)
