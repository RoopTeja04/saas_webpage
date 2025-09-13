# Multi-Tenant SaaS Notes Application

## Objective
A multi-tenant SaaS Notes application developed with the **MERN stack** and deployed on **Vercel**.  
The app allows multiple tenants (companies) to securely manage users and notes with strict isolation, role-based access, and subscription-based feature gating.

---

## Features

### 1. Multi-Tenancy
- Two tenants supported: **Acme** and **Globex**.
- Approach: **Shared schema with `tenantId` field** in every document (Users, Notes).
- Guarantees strict isolation: one tenant’s data is never accessible to another.

### 2. Authentication & Authorization
- **JWT-based authentication** with `userId`, `role`, `tenantId`, and `tenantSlug` in the payload.
- Roles:
  - **Admin**: Can invite users and upgrade subscription plan.
  - **Member**: Can create, view, update, and delete notes.
- Test accounts (all passwords = `password`):
  - `admin@acme.test` → Admin, tenant: Acme  
  - `user@acme.test` → Member, tenant: Acme  
  - `admin@globex.test` → Admin, tenant: Globex  
  - `user@globex.test` → Member, tenant: Globex  

### 3. Subscription Gating
- **Free Plan** → Limited to **3 notes per tenant**.  
  - Frontend shows a **notification** when the limit is reached.  
- **Pro Plan** → Unlimited notes.  
- Upgrade endpoint:  
  ```http
  POST /tenants/:slug/upgrade
  ```
  *(Accessible only by Admins)*

### 4. Notes API (CRUD)
- `POST /notes` → Create a note  
- `GET /notes` → List all notes for current tenant  
- `GET /notes/:id` → Get a specific note  
- `PUT /notes/:id` → Update a note  
- `DELETE /notes/:id` → Delete a note  
- Fully tenant-isolated and role-enforced.

### 5. Admin Features
- **Invite users** (Admin only):  
  ```http
  POST /tenants/:slug/invite
  ```
- Can invite both **Admins** and **Members**.

### 6. Frontend (React + Tailwind)
- Login using predefined accounts.  
- Manage notes (list, create, edit, delete).  
- Shows **“Upgrade to Pro”** option when Free plan hits limit.  
- Admin-only UI for inviting users and upgrading plan.  
- Logout included.  

---

## Tech Stack
- **Frontend**: React, TailwindCSS, Axios, React Router  
- **Backend**: Node.js, Express.js, JWT, bcrypt, Mongoose  
- **Database**: MongoDB Atlas  
- **Deployment**: Vercel  

---

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/RoopTeja04/saas_webpage.git
cd saas_webpage
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Environment variables (`.env`):
```env
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret
JWT_EXPIRES_IN=2h
```

Seed Database:
```bash
node seed.js
```

Start Server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## Deployment
- **Backend API**: [https://your-backend.vercel.app](https://your-backend.vercel.app)  
- **Frontend UI**: [https://your-frontend.vercel.app](https://your-frontend.vercel.app)  

*(Update with actual deployed URLs before submission)*

---

## Test Accounts
- `admin@acme.test` → Admin, tenant: Acme  
- `user@acme.test` → Member, tenant: Acme  
- `admin@globex.test` → Admin, tenant: Globex  
- `user@globex.test` → Member, tenant: Globex  
(All passwords: `password`)  

---

## Health Check
```http
GET /health → { "status": "ok" }
```

---

## Notes
- **Strict tenant isolation** → No data leakage between tenants.  
- **Role enforcement** → Members cannot invite/upgrade.  
- **Subscription enforcement** → Free plan max 3 notes, Pro = unlimited.  
- Upgrades take effect immediately without re-login.  
