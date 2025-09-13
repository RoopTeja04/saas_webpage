
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
  - **Admin**: Can manage users and upgrade subscription plan.
  - **Member**: Can only create, view, update, and delete notes.
- Test accounts (all passwords = `password`):
  - `admin@acme.test` → Admin, tenant: Acme  
  - `user@acme.test` → Member, tenant: Acme  
  - `admin@globex.test` → Admin, tenant: Globex  
  - `user@globex.test` → Member, tenant: Globex  

### 3. Subscription Gating
- **Free Plan** → Limited to **3 notes per tenant**.  
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

### 5. Deployment
- Backend + Frontend deployed on **Vercel**.  
- **CORS enabled** for API access.  
- Health endpoint:  
  ```http
  GET /health → { "status": "ok" }
  ```

### 6. Frontend (React)
- Login using predefined accounts.  
- Manage (list, create, delete) notes.  
- Shows **“Upgrade to Pro”** option when free plan hits limit.  
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

## License
MIT
