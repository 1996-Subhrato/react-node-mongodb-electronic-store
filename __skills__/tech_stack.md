# TechZone — Technology Stack & Dependencies

This document provides a comprehensive inventory of the technology stack, software libraries, versions, and design tokens employed across the TechZone platform.

---

## 🛠️ Backend Stack

### Core Runtime & Framework
- **Runtime Environment**: Node.js (v18.0.0+)
- **Module System**: ES Modules (`"type": "module"` in `package.json`)
- **Web Application Framework**: Express.js (v5.2.1)
- **Database Driver / ODM**: Mongoose (v9.5.0)

### Production Dependencies Breakdown
| Package Name | Version | Purpose & Architectural Justification |
|---|---|---|
| `express` | `^5.2.1` | Minimalist and flexible web server framework for routing and middleware. |
| `mongoose` | `^9.5.0` | Object Data Modeling (ODM) library providing schema validation, type casting, and query building. |
| `bcrypt` | `^6.0.0` | Cryptographic hashing function used to salt and hash User & Admin passwords before persistence. |
| `jsonwebtoken` | `^9.0.3` | Generates and verifies HMAC-SHA256 signed JWT tokens for stateless authentication. |
| `cookie-parser` | `^1.4.7` | Parses incoming cookie headers and populates `req.cookies` for HttpOnly auth tokens. |
| `cors` | `^2.8.6` | Enables Cross-Origin Resource Sharing with whitelisted origins and cookie forwarding. |
| `helmet` | `^8.1.0` | Secures Express apps by setting various HTTP response headers (X-Frame-Options, CSP, etc.). |
| `morgan` | `^1.10.1` | HTTP request logger middleware for development debugging and request auditing. |
| `multer` | `^2.1.1` | Middleware for handling `multipart/form-data`, primarily used for uploading product and profile images. |
| `dotenv` | `^17.4.2` | Loads environment configuration variables from a `.env` file into `process.env`. |
| `razorpay` | `^2.9.6` | Official SDK for creating test payment orders and verifying HMAC-SHA256 payment signatures. |
| `openai` | `^6.34.0` | Official client for calling the OpenAI Chat Completions API (`gpt-3.5-turbo` / `gpt-4o-mini`). |

### Backend Development Tools
- `nodemon` (`^3.1.14`): Monitor for file modifications and automatically restart the development server.

---

## 💻 Frontend Stack

### Core Runtime & Build Tooling
- **Library**: React 19 (v19.2.4)
- **DOM Renderer**: React DOM (v19.2.4)
- **Build Engine & Dev Server**: Vite 8 (v8.0.4)
- **Language**: JavaScript (ES2022+ / JSX)

### Production Dependencies Breakdown
| Package Name | Version | Purpose & Architectural Justification |
|---|---|---|
| `react` | `^19.2.4` | Core UI library utilizing modern concurrent rendering, declarative components, and hooks. |
| `react-dom` | `^19.2.4` | DOM-specific entry points for rendering React components into the web browser. |
| `react-router-dom` | `^7.14.1` | Client-side dynamic routing engine managing nested layouts, navigation, and protected routes. |
| `axios` | `^1.15.0` | Promise-based HTTP client featuring request/response interceptors and cookie synchronization. |
| `lucide-react` | `^1.8.0` | Clean, modern, highly customizable SVG icon set for navigation, actions, and status badges. |
| `react-hook-form` | `^7.72.1` | Performant, flexible form state management and input validation with minimal re-renders. |

### Frontend Development & Linting Tools
- `@vitejs/plugin-react` (`^6.0.1`): Enables Fast Refresh for React components during Vite development.
- `eslint` (`^9.39.4`): Enforces coding standards, code quality, and React Hooks lint rules.
- `eslint-plugin-react-hooks` (`^7.0.1`): Validates adherence to the Rules of Hooks.

---

## 🎨 Design System & Aesthetic Tokens

The frontend design reflects a high-end, modern electronics retail brand with an intuitive, responsive interface:

### 1. Typography
- **Primary Font**: `Inter`, `Segoe UI`, `-apple-system`, `BlinkMacSystemFont`, sans-serif.
- **Hierarchy**:
  - Main Page Titles (`h1`): `2rem` to `2.5rem`, font-weight 700.
  - Section Headers (`h2`): `1.5rem` to `1.75rem`, font-weight 600.
  - Card Titles (`h3`): `1.1rem` to `1.25rem`, font-weight 600.
  - Body Text: `0.95rem` to `1rem`, line-height 1.6.
  - Metadata / Badges: `0.75rem` to `0.85rem`, font-weight 500.

### 2. Color Palette
- **Primary Brand Accent**: `#2563eb` (Vibrant Royal Blue) / `#1d4ed8` (Hover state).
- **Secondary Accent**: `#06b6d4` (Electric Cyan) / `#4f46e5` (Deep Indigo).
- **Backgrounds**:
  - App Background: `#f8fafc` (Soft slate background for customer views).
  - Admin Panel Background: `#0f172a` (Sleek dark navy layout).
  - Card / Surface Background: `#ffffff` (Clean white with subtle borders).
- **Status Colors**:
  - Success / In Stock: `#10b981` (Emerald Green).
  - Warning / Low Stock: `#f59e0b` (Amber Orange).
  - Danger / Out of Stock / Cancelled: `#ef4444` (Coral Red).
  - Information / Processing: `#3b82f6` (Sky Blue).

### 3. Component Styling Paradigm
- **Vanilla CSS Architecture**: Scoped component CSS stylesheets matching component files (e.g., `ProductCard.css`, `Navbar.css`, `AdminDashboardHome.css`).
- **Responsive Layouts**: CSS Grid for product catalog showcases (`grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`) and Flexbox for toolbars, headers, and modals.
- **Micro-Interactions**: Hover elevation transitions (`transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);`), smooth drawer slide-ins for the AI assistant, and pulsing badges for low-stock warnings.
