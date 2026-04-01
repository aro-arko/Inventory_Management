# 🚀 Elite Inventory Dashboard

A state-of-the-art **Inventory Management System** built with **Next.js 15**, **React 19**, and **Tailwind CSS 4**. This frontend provides a seamless, high-performance experience for tracking analytics, managing fulfillment workflows, and maintaining stock health.

---

## 🛠️ Tech Stack

- **Core**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI (Manual Shadcn integration)
- **Forms & Validation**: React Hook Form, Zod
- **Icons & UI**: Lucide React, Sonner (Toasts)
- **State Management**: React Hooks (UseState, UseMemo)
- **Data Fetching**: Native Fetch API with Service Layering

---

## ✨ Key Features

### 📊 Intelligent Dashboard
- **Real-time Analytics**: Visual tracks for Daily Orders and Revenue using dynamic charting.
- **Stock Health Insights**: Immediate visibility into Low Stock and Out of Stock critical items.
- **Recent Activity Logic**: Live Feed of system logs and fulfillment actions.

### 📦 Seamless Order Fulfillment
- **Integrated Expansion**: A custom table sub-row system for order details. Clicking "Items" expands the row to show a full-width fulfillment summary.
- **Scroll-Free UI**: Auto-expanding layouts ensure all product data is visible at a glance.
- **Fulfillment States**: Full workflow management: *Pending -> Confirmed -> Shipped -> Delivered*.

### 🔄 Dynamic Inventory & Restock
- **Smart Queue**: Automatically identifies items falling below minimum thresholds.
- **Restock Workflow**: Direct action from the restock queue to replenish inventory levels.
- **Soft Deletion**: Robust data management for Categories and Products.

### 🔐 Secure Authentication
- **JWT Protection**: Secure session management for all dashboard routes.
- **Account Actions**: Interactive user profile menu with "Change Password" functionality.
- **Demo Guard**: Built-in protections to maintain the integrity of the shared demo account.

---

## 🌐 Production API

This frontend is integrated with the **Elite Inventory Production API**:
> **API URL**: `https://eliteintventoryserver.vercel.app/api/v1`

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd frontend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Configuration
Create a `.env` or `.env.local` file in the root directory:
```env
NEXT_PUBLIC_BASE_API=https://eliteintventoryserver.vercel.app/api/v1
```

### 4️⃣ Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

- `src/app/`: Next.js App Router and page layouts.
- `src/components/`: Modular UI components (Dashboard, Orders, Products, etc.).
- `src/services/`: Centralized API service layer for all backend communications.
- `src/types/`: TypeScript interfaces and Zod validation schemas.
- `src/lib/`: Shared utilities and tailwind configurations.

---

## 📝 License
This project is licensed under the MIT License.
