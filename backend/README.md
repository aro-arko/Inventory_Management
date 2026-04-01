# 📦 Inventory Management System - Backend

A robust, enterprise-grade backend for managing inventory, tracking sales, and monitoring stock levels. Built with a modular architecture for high scalability and maintainability.

---

## 🚀 Features

- **🔐 Secure Authentication**: JWT-based authentication with bcrypt password hashing.
- **🛡️ Data Isolation**: Strict user-level data isolation ensuring privacy and security.
- **📑 Modular CRUD**: Full management of Products, Categories, and Orders.
- **📊 Real-time Dashboard**: Aggregated statistics for stock levels, revenue, and order trends.
- **🕒 Activity Logging**: Comprehensive logging of user activities for audit trails.
- **⚡ Advanced Querying**: Built-in `QueryBuilder` for dynamic filtering, sorting, and pagination.
- **✅ Robust Validation**: Schema-based validation using Zod for all incoming requests.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Auth**: [JSON Web Token (JWT)](https://jwt.io/) & [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Deployment**: Configured for [Vercel](https://vercel.com/)

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── config/          # Environment configuration
│   ├── errors/          # Global error handling
│   ├── interfaces/      # Global TypeScript interfaces
│   ├── middlewares/      # Express middlewares (Auth, Validation)
│   ├── modules/         # Feature-based modular structure
│   │   ├── ActivityLog/
│   │   ├── Auth/
│   │   ├── Category/
│   │   ├── Dashboard/
│   │   ├── Order/
│   │   ├── Product/
│   │   └── User/
│   ├── routes/          # API Route definitions
│   └── builder/         # Advanced QueryBuilder utility
├── server.ts            # Entry point for the server
└── app.ts               # Express application setup
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Setup

Create a `.env` file in the root directory and add the following variables:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=your_mongodb_connection_string
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=your_super_secret_key
JWT_ACCESS_EXPIRES_IN=1d
```

### Running the Server

- **Development Mode**:
  ```bash
  npm run start:dev
  ```
- **Build Project**:
  ```bash
  npm run build
  ```
- **Production Mode**:
  ```bash
  npm run start
  ```

---

## 🛡️ API Endpoints Summary

| Module | Base Route | Description |
| :--- | :--- | :--- |
| **Auth** | `/api/v1/auth` | Login and Registration |
| **Products** | `/api/v1/products` | Manage inventory items |
| **Categories** | `/api/v1/categories` | Manage product classifications |
| **Orders** | `/api/v1/orders` | Process sales and restocking |
| **Dashboard** | `/api/v1/dashboard` | Fetch analytical data |
| **Activity Log** | `/api/v1/activity-logs` | View audit trails |

---

## 🧹 Code Quality

- **Linting**: `npm run lint`
- **Formatting**: `npm run prettier`

---

## 📜 License

This project is licensed under the ISC License.
