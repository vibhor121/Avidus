# TaskManager Pro — Role-Based Access & Activity Tracking

A full-stack task management application with role-based access control (RBAC), admin dashboard, and user activity tracking.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Frontend | React.js (Vite) |
| Styling | Tailwind CSS |
| HTTP Client | Axios |

---

## Project Structure

```
Avidus/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js             # User schema with role & status
│   │   │   ├── Task.js             # Task schema
│   │   │   └── ActivityLog.js      # Activity log schema
│   │   ├── middleware/
│   │   │   └── auth.js             # protect + adminOnly middleware
│   │   ├── controllers/
│   │   │   ├── authController.js   # Register, Login, GetMe
│   │   │   ├── taskController.js   # User task CRUD
│   │   │   └── adminController.js  # Admin operations
│   │   └── routes/
│   │       ├── auth.js             # /api/auth
│   │       ├── tasks.js            # /api/tasks
│   │       └── admin.js            # /api/admin
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js            # Axios instance with auth interceptor
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state
    │   ├── components/
    │   │   ├── Navbar.jsx          # Role-aware navigation
    │   │   ├── ProtectedRoute.jsx  # Redirect unauthenticated users
    │   │   ├── AdminRoute.jsx      # Redirect non-admin users
    │   │   └── StatCard.jsx        # Reusable analytics card
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx       # User dashboard with task stats
    │   │   ├── Tasks.jsx           # Task CRUD page
    │   │   └── admin/
    │   │       ├── AdminLayout.jsx     # Sidebar layout
    │   │       ├── Overview.jsx        # Analytics & stats
    │   │       ├── UserManagement.jsx  # Manage users
    │   │       ├── TaskMonitoring.jsx  # View all tasks
    │   │       └── ActivityLogs.jsx    # View all activity
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/vibhor121/Avidus.git
cd Avidus
git checkout feature/role-based-access
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/avidus_taskmanager
JWT_SECRET=your_secret_key_here
PORT=5000
```

Start the backend:

```bash
npm run dev       # development with nodemon
npm start         # production
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 4. Create First Admin User

Since registration always creates a regular user, use this curl command once to create your first account:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"123456"}'
```

Then open MongoDB Atlas or Compass, find your user, and manually change `role` from `"user"` to `"admin"`.

After that, login at `http://localhost:5173/login` and you will be redirected to the admin dashboard automatically.

---

## API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user (role always defaults to user) |
| POST | `/login` | Public | Login and receive JWT token |
| GET | `/me` | Protected | Get currently logged-in user info |

---

### Task Routes — `/api/tasks`

All routes require a valid JWT token in the Authorization header.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | User | Get own tasks only |
| POST | `/` | User | Create a new task |
| PUT | `/:id` | User | Update own task only |
| DELETE | `/:id` | User | Delete own task only |

---

### Admin Routes — `/api/admin`

All routes require JWT token + `role: "admin"`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Get platform-wide analytics |
| GET | `/users` | View all registered users |
| DELETE | `/users/:id` | Delete a user and all their data |
| PATCH | `/users/:id/status` | Toggle user active or inactive |
| GET | `/tasks` | View all tasks across all users |
| DELETE | `/tasks/:id` | Delete any task |
| GET | `/activity-logs` | View full activity audit trail |

---

## Role-Based Access Control

### How It Works

```
HTTP Request
    │
    ▼
protect middleware        ← Verifies JWT token, attaches req.user
    │
    ▼
adminOnly middleware       ← Checks req.user.role === 'admin'
    │
    ▼
Route Handler             ← Executes only if all checks pass
```

### Permission Matrix

| Action | Admin | User |
|--------|-------|------|
| View all users | Yes | No |
| Delete any user | Yes | No |
| Toggle user status | Yes | No |
| View all tasks | Yes | No |
| Delete any task | Yes | No |
| View activity logs | Yes | No |
| Create own tasks | Yes | Yes |
| View own tasks | Yes | Yes |
| Update own tasks | Yes | Yes |
| Delete own tasks | Yes | Yes |

### Roles

- **admin** — Full platform access. Assigned manually in the database for security.
- **user** — Default role assigned on registration. Can only manage their own tasks.

---

## Activity Log System

Every important action is automatically recorded in the `ActivityLog` collection in MongoDB.

| Action | Trigger |
|--------|---------|
| `USER_REGISTERED` | New user signs up |
| `USER_LOGIN` | User logs in successfully |
| `TASK_CREATED` | User creates a task |
| `TASK_UPDATED` | User updates a task |
| `TASK_DELETED` | User deletes their task |
| `ADMIN_TASK_DELETED` | Admin deletes any task |

Each log stores: `user reference`, `action type`, `details`, `IP address`, `timestamp`

---

## Frontend Pages

### User Pages

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Email and password login form |
| `/register` | Register | Create a new user account |
| `/dashboard` | Dashboard | Personal task stats and recent tasks |
| `/tasks` | Tasks | Full task CRUD with status filters |

### Admin Pages (admin role only)

| Route | Page | Description |
|-------|------|-------------|
| `/admin/overview` | Overview | Platform-wide analytics with progress bars |
| `/admin/users` | User Management | View, delete, toggle active/inactive |
| `/admin/tasks` | Task Monitoring | View and delete all tasks |
| `/admin/activity-logs` | Activity Logs | Searchable full audit trail |

---

## Key Features

- **JWT Authentication** — Stateless auth with 7-day token expiry
- **Role-Based Access Control** — Admin and User roles with separate permissions
- **Activity Logging** — Every login and task action is tracked automatically
- **Protected Routes** — Both API and React routes are secured by role
- **Responsive Purple UI** — Clean design built with Tailwind CSS
- **Admin Dashboard** — Sidebar layout with analytics, user and task management
- **Security** — Passwords hashed with bcrypt, role cannot be set from registration form

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWTs | `mysecretkey123` |
| `PORT` | Port for the backend server | `5000` |

---

## Git Branch

All work is on the `feature/role-based-access` branch.

```bash
git checkout feature/role-based-access
```

A Pull Request is raised to merge into `main`.

---

## Author

**Vibhor** — [github.com/vibhor121](https://github.com/vibhor121)
