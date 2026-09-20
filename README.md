# K's ENTERPRISES - Fish Feed Company Portal

A professional, responsive, and secure **Fish Feed & Aquaculture Management Portal** for **K's ENTERPRISES**. Built with modern standards, clean aquaculture visual styling, robust form validation, route protection, and a modular authentication layer designed to transition seamlessly from prototype mock data to a production Node.js / Express backend.

---

## 🐟 Key Features

- **Thematic Aquaculture Visual Design**: Clean white/light background with ocean blues, marine teals, and nutrient-green accents. Centered login card with company logo (`K'senterprises.jpg`) and brand name `K's ENTERPRISES`.
- **Fish-Feed Side Visual Banner**: Desktop 2-column layout showcasing floating feed pellet technology, nutrient metrics (42%-52% crude protein), and certification badges. Adapts gracefully for mobile and tablet screens.
- **Robust Client Validation**:
  - Email format validation with instant feedback on blur and submit.
  - Password validation with show/hide password eye icon toggle.
  - Strict empty-field blocking ("Email is required", "Password is required").
- **Demo Account 1-Click Auto-Fill**:
  - **Email**: `demo@gmail.com`
  - **Password**: `Demo@123` (8+ characters, 1 uppercase, 1 special character)
  - Interactive "Fill Demo Account" shortcut button on the card.
- **Route Guarding & User Flow**:
  - Application opens directly at `/login`.
  - Unauthenticated users attempting to access `/home`, `/products`, `/profile`, or `/company` are blocked and redirected to `/login` with an informational notice.
  - Successful login transitions smoothly into the protected `/home` Aquaculture Command Center.
- **Modular Backend API Blueprint**:
  - Decoupled `authService.js` supporting both instant prototype mock authentication and full `POST /api/auth/login` REST API endpoints.
  - Ready-to-run `server.js` included.

---

## 📁 Project Architecture

```
fish-feed-website/
├── index.html               # Main HTML entry point with views and accessible markup
├── package.json             # NPM package scripts & configuration
├── server.js                # Node.js static server & POST /api/auth/login API
├── README.md                # Project documentation & integration guide
├── K'senterprises.jpg       # Company Logo
├── ceo.jpg                  # User Avatar
│
├── css/
│   └── styles.css           # Complete CSS stylesheet with custom design tokens
│
├── js/
│   ├── config.js            # Global configuration, endpoints, and credentials
│   ├── validation.js        # Email & password validation functions
│   ├── authService.js       # Authentication service (Mock & REST API modes)
│   ├── router.js            # Client-side router & route guard
│   ├── mockData.js          # Product catalog and company datasets
│   └── app.js               # Main application controller & DOM event handling
│
└── test/
    └── auth_test.js         # Automated unit & integration test suite
```

---

## 🚀 Quick Start

### 1. Run with Node.js Server
Start the built-in server to serve static assets and enable the `POST /api/auth/login` endpoint:
```bash
npm start
# or: node server.js
```
Open your browser at:
`http://localhost:3000`

### 2. Run Automated Test Suite
Verify all validation rules and authentication flows:
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
| **Associated Farm** | Blue Ocean Aqua Farms |

> **Tip**: Click the **"Fill Demo Account"** button on the login screen to automatically populate these credentials.

---

## 🔌 Connecting to a Real Node.js / Express Backend

When you are ready to connect to your production backend and database:

1. In [`js/config.js`](file:///home/user/fish-feed-website/js/config.js), change:
   ```javascript
   export const CONFIG = {
     USE_MOCK_AUTH: false, // Set to false to use REST API
     API_BASE_URL: "/api",
     AUTH_ENDPOINT: "/api/auth/login",
     // ...
   };
   ```
2. Your Express backend should implement `POST /api/auth/login` accepting:
   ```json
   {
     "email": "user@example.com",
     "password": "UserPassword123!"
   }
   ```
   And returning:
   ```json
   {
     "success": true,
     "token": "<JWT_TOKEN>",
     "user": {
       "id": "usr_123",
       "email": "user@example.com",
       "name": "Alex Morgan",
       "role": "Aquaculture Farm Manager",
       "farmName": "Blue Ocean Aqua Farms"
     },
     "expiresAt": 1789876543210
   }
   ```

---

## ♿ Accessibility & Standards

- Semantic HTML5 landmark elements (`<header>`, `<main>`, `<section>`, `<aside>`, `<nav>`).
- Live `aria-invalid`, `aria-describedby`, and `role="alert"` announcements for assistive technologies.
- Keyboard accessible form navigation with `Tab` and `Enter` key form submissions.
- High contrast color ratios adhering to WCAG AA guidelines.
- Touch-friendly tap target sizing ($\ge 44\text{px}$) across mobile devices.
