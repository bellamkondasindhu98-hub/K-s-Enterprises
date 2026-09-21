# K's ENTERPRISES - Fish Feed Company Portal

A professional, responsive, and secure **Fish Feed & Aquaculture Management Portal** for **K's ENTERPRISES**. Built with modern web standards, clean aquaculture visual styling, robust form validation, route protection, and a modular authentication layer supporting both prototype mock authentication and production Node.js / Express backend endpoints (`POST /api/auth/login` and `POST /api/auth/register`).

---

## 🐟 Key Features

### 1. Thematic Aquaculture Visual Design & Responsive Layout
- Clean light aesthetic with ocean blue (`#0284C7`), marine teal (`#0D9488`), and nutrient green (`#059669`) accents.
- Responsive centered card with official company logo ([`K'senterprises.jpg`](file:///home/user/fish-feed-website/K'senterprises.jpg)) and brand name **"K's ENTERPRISES"**.
- Desktop side visual banner highlighting feed extrusion technology, nutrient ratios (42%–52% crude protein), and ISO 22000 / HACCP standards.

### 2. Login Page (`/login`)
- Email & password validation.
- Show/hide password eye icon.
- "Remember Me" session persistence.
- 1-Click **"Fill Demo Account"** button (`demo@gmail.com` / `Demo@123`).
- Link to Register: *"Don't have an account? Register"* (navigates to `/register`).

### 3. Forgot Password Page (`/forgot-password`) & Reset Password (`/reset-password`)
- **Brand & Theme Matching**: Exact visual layout, company logo ([`K'senterprises.jpg`](file:///home/user/fish-feed-website/K'senterprises.jpg)), typography, colors, and side banner.
- **Email Validation**: Mandatory email with RFC-5322 regex validation displaying clear error messages (*"Email is required"*, *"Please enter a valid email address"*).
- **Loading & State Feedback**: Interactive button spinner (*"Sending reset link..."*) with disabled submission state.
- **Security & Privacy**: Protects against user enumeration attacks by returning generic status: *"✓ If an account exists for this email, a password reset link has been sent."*
- **Prototype Flow**: Seamless continuation to `/reset-password` simulating the password reset workflow.
- **Navigation**: "← Back to Login" link returning to `/login`.
- **Modular REST API**: `POST /api/auth/forgot-password` and `POST /api/auth/reset-password`.

### 4. Registration Page (`/register`)
- **Full Name**: Required, minimum 2 characters.
- **Email**: Required, format validated.
- **Phone Number**: Required, validates Indian mobile number formats (with or without `+91` / `0` prefix).
- **Password**: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (e.g. `Demo@123`), with interactive live requirement checklist.
- **Confirm Password**: Matching validation with show/hide password toggle.
- **Terms & Conditions**: Mandatory agreement checkbox with accessible modals.
- **Duplicate Email Prevention**: Checks existing accounts and presents *"An account with this email already exists. Please login."* with direct Login link.
- **Role Assignment**: New registrations are automatically provisioned with role **`CUSTOMER`**.
- **Success Flow**: Displays *"Account created successfully!"* and redirects to `/login`.

### 5. Route Guarding & Protected Pages
- Application opens at `/login`.
- Protected views:
  - `/home`: Aquaculture Command Center and feed analytics dashboard.
  - `/products`: High-protein floating & sinking aquafeed catalog.
  - `/profile`: User credentials, avatar ([`ceo.jpg`](file:///home/user/fish-feed-website/ceo.jpg)), and session tokens.
  - `/company`: Corporate details and manufacturing mill operations.
- Unauthenticated access attempts are blocked and redirected to `/login`.

---

## 📁 Project Architecture

```
fish-feed-website/
├── index.html               # Main HTML entry point (/login, /register, /forgot-password, /reset-password, protected views)
├── package.json             # NPM package scripts & configuration
├── server.js                # Node.js server with REST endpoints (/api/auth/login, /register, /forgot-password, /reset-password)
├── README.md                # Documentation & backend integration guide
├── K'senterprises.jpg       # Company Logo
├── ceo.jpg                  # User Profile Avatar
│
├── css/
│   └── styles.css           # Custom CSS stylesheet with design tokens & responsive breakpoints
│
├── js/
│   ├── config.js            # Configuration, password rules, and API endpoints
│   ├── validation.js        # Email, phone, password, and form validation functions
│   ├── authService.js       # Modular Auth Service (Mock store & REST API client)
│   ├── router.js            # Client-side router & route guard
│   ├── mockData.js          # Product catalog and company datasets
│   └── app.js               # Application controller & DOM event handling
│
└── test/
    └── auth_test.js         # Automated test suite (27/27 tests passing)
```

---

## 🚀 Quick Start

### 1. Start Server
```bash
npm start
# or: node server.js
```
Open your browser at `http://localhost:3000`.

### 2. Run Automated Test Suite
```bash
npm test
# or: node test/auth_test.js
```

---

## 🔑 Demo Account Credentials

| Field | Value |
| :--- | :--- |
| **Email** | `demo@gmail.com` |
| **Password** | `Demo@123` |
| **Role** | Aquaculture Farm Manager |
| **Phone** | +91 9876543210 |

---

## 🔌 Connecting to Express Backend & Database

1. In [`js/config.js`](file:///home/user/fish-feed-website/js/config.js), set `USE_MOCK_AUTH: false`.
2. Ensure your backend handles:
   - `POST /api/auth/login` (validates credentials, returns JWT token)
   - `POST /api/auth/register` (creates user with role `CUSTOMER`, hashes password with bcrypt/argon2)
