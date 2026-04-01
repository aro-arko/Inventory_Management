# 📦 Elite Inventory Management System

A full-stack, enterprise-grade **Inventory Management & Order Fulfillment** system. This repository features a high-performance **Next.js 15** frontend and a modular **Node.js/Express** backend, designed for scalability, security, and exceptional user experience.

---

## 🏗️ System Architecture

The project is structured as a monorepo-style repository with two main components:

- **[Frontend (Dashboard)](./frontend)**: A state-of-the-art interface for real-time analytics, stock monitoring, and order fulfillment.
- **[Backend (API Server)](./backend)**: A robust RESTful API with strict data isolation, modular services, and advanced querying capabilities.

---

## ✨ Key Features

### 📊 Powerful Analytics & Monitoring
- **Intelligent Dashboard**: Real-time sales charts, revenue tracking, and automated stock health insights (Low/Out of Stock).
- **Activity Logging**: Full audit trails for tracking system actions and user behavior.

### 📦 Order & Fulfillment Workflow
- **Enhanced Order Table**: Nested sub-rows for detailed item fulfillment without leaving the view.
- **Dynamic Fulfillment States**: Manage order lifecycles from *Pending* to *Delivered*.
- **Validation-First**: Server-side stock validation and conflict handling for all orders.

### 🔄 Inventory & Restock Intelligence
- **Smart Restock Queue**: Automatically identifies items below minimum thresholds.
- **Modular CRUD**: Full control over Products and Categories with soft-deletion and audit support.

### 🔐 Enterprise Security
- **Data Isolation**: Strict user-level data multi-tenancy; users only see and manage their own data.
- **JWT Protection**: Secure API communication with session-based authentication.

---

## 🛠️ Tech Stack

| Component | technologies |
| :--- | :--- |
| **Frontend** | Next.js 15, React 19, Tailwind CSS 4, Radix UI, Zod, Hook Form, Lucide, Sonner |
| **Backend** | Node.js, Express, TypeScript, MongoDB (Mongoose), Zod, JWT, bcrypt |
| **Deployment** | Vercel (both Frontend & Backend) |

---

## 📂 Repository Structure

```text
Inventory-Management/
├── backend/          # Express API (Node.js/TypeScript)
│   ├── src/          # Modular services, routes, and controllers
│   └── README.md     # Backend-specific documentation
└── frontend/         # Next.js Dashboard (React/Tailwind)
    ├── src/          # Components, Services, and Layouts
    └── README.md     # Frontend-specific documentation
```

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd "Inventory Management"
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
# Configure your .env file (see backend/README.md for details)
npm run start:dev
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
# Configure your .env file (pointing to your backend API)
npm run dev
```

---

## 📖 Detailed Documentation

For specific setup instructions, API endpoints, and internal architecture, please refer to the individual module documentation:

- **[Backend Documentation Details](./backend/README.md)**
- **[Frontend Documentation Details](./frontend/README.md)**

---

## ⚖️ License

The project components are licensed as follows:
- **Backend**: [ISC License](./backend/LICENSE)
- **Frontend**: [MIT License](./frontend/LICENSE)
