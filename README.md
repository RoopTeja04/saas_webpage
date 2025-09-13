# Multi-Tenant SaaS Notes Application

## Objective
A multi-tenant SaaS Notes application developed with the **MERN stack** and deployed on **Vercel**.  
The app allows multiple tenants (companies) to securely manage users and notes with strict isolation, role-based access, and subscription-based feature gating.

---

## Features

### 1. Multi-Tenancy
- Two tenants supported: **Acme** and **Globex**.
- Isolation via a **shared schema with `tenantId` field** in every document (Users, Notes).
- Each tenant’s data is completely isolated.

### 2. Authentication & Authorization
- **JWT-based authentication** with `userId`, `role`, and `tenantId` in the payload.
- Roles:
  - **Admin**: Can manage users, invite users, and upgrade subscription plan.
  - **Member**: Can only create, view, update, and delete notes.
- Test accounts (all passwords = `password`):
  - `admin@acme.test` → Admin, tenant: Acme  
  - `user@acme.test` → Member, tenant: Acme  
  - `admin@globex.test` → Admin, tenant: Globex  
  - `user@globex.test` → Member, tenant: Globex  

### 3. Subscription Gating
- **Free Plan** → Limited to **3 notes per tenant**.  
  - Shows a **notification** when the limit is reached.  
- **Pro Plan** → Unlimited notes.  
- Upgrade endpoint:  
  ```http
  POST /tenants/:slug/upgrade
  ```
  (Only accessible by Admin).  

### 4. Notes API (CRUD)
- `POST /notes` → Create a note.  
- `GET /notes` → List all notes for current tenant.  
- `GET /notes/:id` → Get specific note.  
- `PUT /notes/:id` → Update note.  
- `DELETE /notes/:id` → Delete note.  
- **Edit note functionality** is available via frontend.  

### 5. Admin Features
- **Invite users** (Admin only) via:
  ```http
  POST /tenants/:slug/invite
  ```
- Admin can assign **Admin** or **Member** roles during invitation.  

### 6. Frontend (React)
- Login using predefined accounts.  
- Manage (list, create, edit, delete) notes.  
- Shows **“Upgrade to Pro”** option when free plan hits limit.  
- Admin can invite users directly from the UI.  
- Logout option available.  

---

## Tech Stack
- **Frontend**: React, Axios, React Router.  
- **Backend**: Node.js, Express.js, JWT, bcrypt, Mongoose.  
- **Database**: MongoDB Atlas.  
- **Deployment**: Vercel.  

---

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/RoopTeja04/saas_webpage.git
cd notes-app
```

### 2. Backend Setup
```bash
cd backend
npm install
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

## Test Accounts
- `admin@acme.test` → Admin, tenant: Acme  
- `user@acme.test` → Member, tenant: Acme  
- `admin@globex.test` → Admin, tenant: Globex  
- `user@globex.test` → Member, tenant: Globex  
(All with password: `password`)

---

## Health Check
```http
GET /health → { "status": "ok" }
```

---

## Additional Notes
- **Role-based restrictions** are enforced across all routes.  
- **Tenant isolation** ensures that users cannot access notes from other tenants.  
- Free plan restrictions and Pro plan upgrades work immediately without re-login.  
- Frontend fully supports creating, editing, deleting notes, inviting users (Admin), and upgrading plan.  

---