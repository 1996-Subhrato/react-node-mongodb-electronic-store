# TechZone Electronics Store — Architecture & Skills Hub

Welcome to the comprehensive architectural documentation and skills blueprint for **TechZone**, an AI-Powered Full-Stack Electronics E-Commerce Platform. This knowledge base serves as the definitive reference for the decoupled **React (Vite) + Node.js (Express) + MongoDB (Mongoose)** production architecture.

---

## 📌 Documentation Index

### 1. Project Foundations
- [**Project Overview**](project-overview.md) — High-level identity, core capabilities, directory inventory, and business workflows.
- [**System Architecture**](architecture.md) — Decoupled MERN stack design, data flow diagrams, and request/response lifecycle.
- [**Technology Stack**](tech_stack.md) — Runtime, frameworks, libraries, design tokens, and UI guidelines.
- [**Folder Structure**](folder-structure.json) — Complete directory tree mapping and file responsibilities.
- [**Dependencies Analysis**](dependencies-analysis.md) — In-depth breakdown of backend and frontend npm packages.

### 2. Database & Data Architecture
- [**Database Analysis**](database-analysis.md) — Comprehensive schema specifications, data types, indexes, and document relationships.
- [**Database Patterns**](database-patterns.js) — Production Mongoose query patterns, atomic inventory operations, population, and error handling.
- [**Migration Strategy & Roadmap**](migration-strategy.md) — SQL-to-NoSQL transformation insights and future production roadmap.

### 3. Backend & API Services
- [**Backend Flow**](backend-flow.md) — Controller-Route-Model architecture, middleware pipeline, static serving, and uploads.
- [**Backend Patterns**](backend-patterns.md) — Design patterns, standardized controller patterns, and query sanitization.
- [**Routes Analysis**](routes-analysis.md) — Comprehensive catalog of all 12 Express route modules and endpoint guards.
- [**API Mapping**](api-mapping.md) — Full REST API contract specifications (request bodies, query params, response payloads, error codes).

### 4. Security & Authentication
- [**Authentication Flow**](authentication-flow.md) — Dual-role JWT authentication (User vs Admin), HttpOnly cookies, and session restoration.
- [**Role-Based Access Control (RBAC)**](role-based-access.md) — Permission matrices, authorization guards, and route protection.
- [**Forms & Validations**](forms-and-validations.md) — Client-side validation schemas (React Hook Form) and server-side request verification.

### 5. Frontend & UI Engineering
- [**Frontend Flow**](frontend-flow.md) — Component tree, React Router DOM v7 layout routing, and user journey flows.
- [**Frontend Patterns**](frontend-patterns.md) — Modern React patterns, custom hooks, reusable modals, and Indian price formatting.
- [**UI Components Analysis**](ui-components-analysis.md) — Inventory of reusable UI elements, cards, layouts, sheets, and feedback toasts.
- [**State & Session Flow**](state-and-session-flow.md) — Global state distribution via `AuthContext`, `ToastContext`, and Axios interceptors.

### 6. Domain Logic & Reusable Code
- [**Reusable Business Logic**](reusable-business-logic.md) — Real-time stock reservation, cancellation restoration, Razorpay test payment verification, and AI context construction.
- [**Reusable Snippets**](reusable-snippets.js) — Tested code snippets for price formatting (INR), asset resolution, error interception, and debouncing.
- [**Coding Standards**](coding-standards.md) — Production code quality conventions, naming standards, and standardized response formats.

---

## ⚡ Quick Architecture Summary

```
                      +---------------------------------------+
                      |       React 19 Frontend (Vite)        |
                      |  - Public Catalog & Category Filters   |
                      |  - Cart & Checkout (Razorpay Test)    |
                      |  - Order Tracking & Verified Reviews   |
                      |  - Admin Dashboard & Inventory Mgmt   |
                      |  - AI Assistant (Contextual Specs)    |
                      +-------------------+-------------------+
                                          | Axios (withCredentials: true)
                                          v
                      +---------------------------------------+
                      |      Node.js + Express 5 Backend      |
                      |  - Helmet, CORS, Morgan, CookieParser |
                      |  - Dual JWT Guards (User vs Admin)    |
                      |  - Multer Local Asset Pipeline        |
                      |  - OpenAI Service + Mock Fallback     |
                      +-------------------+-------------------+
                                          | Mongoose 9.x
                                          v
                      +---------------------------------------+
                      |         MongoDB (NoSQL Cluster)       |
                      |  - Users, Admins, Categories, Products |
                      |  - Inventory, Orders, Payments        |
                      |  - Carts, Reviews, Wishlists, Views   |
                      +---------------------------------------+
```

---
*Maintained by Antigravity AI — Full Stack Systems Architect*
