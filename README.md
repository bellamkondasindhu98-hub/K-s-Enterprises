# K's Enterprises - Premium Fish Feed Website

A full-stack web platform built for **K's Enterprises**, an aquaculture nutrition manufacturer. The platform is architected with a decoupled four-tier structure: **Frontend**, **Backend**, **Admin Dashboard**, and **Database**.

---

## 1. Architectural Overview

```
fish-feed-website/
├── frontend/             # Customer-facing storefront (HTML5, CSS3, Vanilla JS, i18n, Theme Engine)
├── admin-dashboard/      # Administrative operations portal (Inventory, Reviews, Comparison, CMS)
├── backend/              # Enterprise Java 17 + Spring Boot 3.2.3 REST API backend
└── database/             # MySQL 8.0+ DDL relational schema & comprehensive seed data
```

---

## 2. Key Architecture & Business Rules

1. **Ordering Mechanism (WhatsApp ONLY)**:
   - **NO shopping cart, checkout page, payment gateway, COD, or online order processing.**
   - All product ordering and inquiries are routed directly to WhatsApp (`https://wa.me/<number>?text=<encoded_message>`) with auto-generated order details (Product Name, Category, Packaging Size, Price, Inquiry Timestamp).
2. **Executive Representation (CEO ONLY)**:
   - Contains a dedicated **CEO profile section** and **Company profile**.
   - **No founders section** exists in accordance with business requirements.
3. **Placeholder Transparency**:
   - Company & CEO specifics that are pending final registration are labeled with explicit placeholders (e.g., `[GST_NUMBER_PLACEHOLDER]`, `[COMPANY_ADDRESS_PLACEHOLDER]`, `[PHONE_NUMBER_PLACEHOLDER]`, `[EMAIL_ADDRESS_PLACEHOLDER]`, `[WHATSAPP_NUMBER_PLACEHOLDER]`, `[CEO_NAME_PLACEHOLDER]`).
   - These can be updated dynamically via the Admin Dashboard or directly in the database/configuration.

---

## 3. Technology Stack

### Frontend & Admin Dashboard
- **Markup & Styling**: Semantic HTML5, Modular CSS3 with CSS custom properties (`var(--...)`), Responsive CSS Grid and Flexbox.
- **Theming**: Dark and Light theme toggle with `localStorage` persistence.
- **Internationalization (i18n)**: Client-side dynamic multilingual switcher supporting **English (`en`)**, **Telugu (`te`)**, and **Hindi (`hi`)**.
- **JavaScript**: Modular ES6+ with dedicated service layers for API communication, authentication state, and WhatsApp intent generation.

### Backend
- **Language & Runtime**: Java 17 (LTS)
- **Framework**: Spring Boot 3.2.3
- **Security**: Spring Security 6, Stateless JWT (JSON Web Token), BCrypt password hashing, Role-Based Access Control (`ROLE_CUSTOMER`, `ROLE_ADMIN`).
- **Data Persistence**: Spring Data JPA / Hibernate 6, MySQL Connector/J.
- **Build Tool**: Apache Maven 3.8+.

### Database
- **Engine**: MySQL 8.0+ / MariaDB 10.5+
- **Schema Design**: Normalized relational architecture with foreign key constraints, indexes on query fields, JSON attributes for nutritional matrices, and timestamp auditing.

---

## 4. Complete Project Directory Structure

```text
fish-feed-website/
│
├── .gitignore
├── README.md
│
├── database/
│   ├── schema/
│   │   └── schema.sql                   # Complete DDL tables, indexes, constraints
│   └── seed-data/
│       └── seed.sql                     # Seed categories, feeds, comparison, CMS, admin/user accounts
│
├── backend/
│   ├── pom.xml                          # Maven build descriptors and dependencies
│   └── src/
│       ├── main/
│       │   ├── resources/
│       │   │   └── application.yml      # DB credentials, JWT secrets, CORS, WhatsApp config
│       │   └── java/com/ksenterprise/
│       │       ├── KsEnterpriseApplication.java
│       │       ├── config/              # AppConfig, CorsConfig, DataInitializer
│       │       ├── controller/          # 11 REST API controllers (Auth, Product, Admin, etc.)
│       │       ├── dto/                 # Request and Response Data Transfer Objects
│       │       ├── exception/           # Custom exceptions and GlobalExceptionHandler
│       │       ├── model/               # 13 JPA Entities (User, Product, Category, Review, etc.)
│       │       ├── repository/          # 12 Spring Data JPA Repositories
│       │       ├── security/            # JWT Token Provider, Filters, SecurityConfig
│       │       └── service/             # Service interfaces and implementations
│       └── test/
│
├── frontend/
│   ├── index.html                       # Entrypoint redirect to pages/home/
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/                      # SVG mockups for 5 fish feeds, hero banner, CEO placeholder
│   │   └── logos/                       # K's Enterprises vector SVG logo
│   ├── locales/
│   │   ├── en.json                      # English localization dictionary
│   │   ├── te.json                      # Telugu localization dictionary
│   │   └── hi.json                      # Hindi localization dictionary
│   ├── styles/
│   │   ├── main.css                     # Reset, typography, layout utilities
│   │   ├── themes.css                   # CSS custom properties for Light/Dark themes
│   │   └── components.css               # Shared modal, toast, form, and button styles
│   ├── services/
│   │   ├── api.service.js               # Centralized fetch wrapper with JWT bearer attachment
│   │   ├── auth.service.js              # Customer auth state management (Login/Register/Logout)
│   │   ├── product.service.js           # Catalog and product details API service
│   │   ├── wishlist.service.js          # Customer wishlist operations
│   │   ├── review.service.js            # Review submission and product rating retrieval
│   │   ├── comparison.service.js        # Feed vs competitor comparison matrix service
│   │   ├── recommendation.service.js    # Related feeds recommendation service
│   │   ├── company.service.js           # Company, CEO, and CMS dynamic content service
│   │   ├── whatsapp.service.js          # WhatsApp ordering URL & message payload builder
│   │   ├── theme.service.js             # Dark/Light mode switcher & listener
│   │   └── i18n.service.js              # Multilingual dynamic DOM translator
│   ├── components/
│   │   ├── navbar/                      # Navigation header component (HTML, CSS, JS)
│   │   ├── footer/                      # Footer component with links, address, GST (HTML, CSS, JS)
│   │   ├── search-bar/                  # Auto-complete search bar component (HTML, CSS, JS)
│   │   ├── product-card/                # Reusable feed product card (HTML, CSS, JS)
│   │   ├── product-grid/                # Responsive product grid container (HTML, CSS, JS)
│   │   ├── wishlist-button/             # Quick toggle wishlist heart button (HTML, CSS, JS)
│   │   ├── share-button/                # Social & Web Share API button (HTML, CSS, JS)
│   │   ├── whatsapp-order-button/       # Dedicated WhatsApp order trigger (HTML, CSS, JS)
│   │   ├── language-selector/           # Language dropdown selector (HTML, CSS, JS)
│   │   └── theme-toggle/                # Light/Dark mode pill switcher (HTML, CSS, JS)
│   └── pages/
│       ├── home/                        # Landing page: Hero, Categories, Featured, Comparison, CEO
│       ├── products/                    # Catalog with Category & Price filters, sorting
│       ├── product-details/             # Nutrition specs, feeding guide, WhatsApp order, reviews
│       ├── wishlist/                    # Customer saved feeds collection
│       ├── search/                      # Dedicated search results page with filters
│       ├── comparison/                  # Nutrition & Cost comparison vs market feeds
│       ├── company-profile/             # Mission, Vision, Infrastructure, Quality certifications
│       ├── why-choose-us/               # FCR efficiency, water stability, natural ingredients
│       ├── feedback/                    # Inquiry and feedback submission form
│       ├── help-center/                 # FAQ accordion and customer support contacts
│       ├── login/                       # Customer authentication & Google OAuth button
│       ├── register/                    # Customer signup form with validation
│       ├── forgot-password/             # Password reset email trigger
│       └── reset-password/              # Password update with token validation
│
└── admin-dashboard/
    ├── index.html                       # Entrypoint redirect to dashboard or login
    ├── styles/
    │   ├── admin-main.css               # Admin layout, sidebar, topbar, metric cards, tables
    │   └── admin-forms.css              # Admin modal, inputs, selects, action buttons
    ├── services/
    │   ├── admin-api.service.js         # Fetch wrapper with admin JWT bearer token
    │   ├── admin-auth.service.js        # Admin login/logout & route protection guards
    │   └── admin-management.service.js  # Unified CRUD operations service
    ├── components/
    │   ├── admin-navbar/                # Top bar with user profile, live clock, logout
    │   └── admin-sidebar/               # Side navigation with active route highlights
    └── pages/
        ├── login/                       # Secure admin portal authentication
        ├── dashboard/                   # High-level inventory, customer, and review KPIs
        ├── products/                    # Product CRUD, stock status toggle, price editing
        ├── reviews/                     # Review moderation (Approve, Reject, Delete)
        ├── comparison/                  # Competitor benchmark comparison editor
        ├── recommendations/             # Up-sell and cross-sell recommendation mappings
        ├── company/                     # Edit Company info, GST, WhatsApp number, CEO details
        ├── website/                     # Live CMS editor for homepage & company text
        ├── customers/                   # Registered customer directory
        └── feedback/                    # Customer inquiries & feedback inbox
```

---

## 5. Getting Started & Setup Guide

### 5.1 Prerequisites
- **Java**: JDK 17 or higher
- **Maven**: 3.8+
- **MySQL**: 8.0+
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### 5.2 Database Setup
1. Open MySQL terminal or your preferred GUI client (MySQL Workbench, DBeaver):
   ```sql
   CREATE DATABASE ks_enterprises_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Execute the schema script:
   ```bash
   mysql -u root -p ks_enterprises_db < database/schema/schema.sql
   ```
3. Execute the seed data script:
   ```bash
   mysql -u root -p ks_enterprises_db < database/seed-data/seed.sql
   ```

### 5.3 Backend Execution
1. Verify database credentials in `backend/src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/ks_enterprises_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
       username: root
       password: your_mysql_password
   ```
2. Build and run the Spring Boot application:
   ```bash
   cd backend
   mvn clean package
   mvn spring-boot:run
   ```
3. The backend will start on **`http://localhost:8080/api`**.

### 5.4 Running the Frontend & Admin Dashboard
Because the frontend and admin dashboard are pure HTML5/CSS/JavaScript with modular `fetch()` requests:
- Serve the root project using any static web server:
  - **VS Code Live Server**: Right click `frontend/pages/home/index.html` -> "Open with Live Server".
  - **Python HTTP Server**:
    ```bash
    # From the fish-feed-website root directory
    python3 -m http.server 3000
    ```
- Open in browser:
  - **Customer Storefront**: `http://localhost:3000/frontend/`
  - **Admin Dashboard**: `http://localhost:3000/admin-dashboard/`

---

## 6. Default Credentials

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@ksenterprises.com` | `Admin@123` |
| **Customer (Demo)** | `farmer.rajesh@example.com` | `Customer@123` |

---

## 7. Placeholder Configuration Guide

The following placeholders are configured across database seed data, configuration files, and frontend footers:

| Placeholder Key | Purpose | How to Update |
|---|---|---|
| `[GST_NUMBER_PLACEHOLDER]` | Official Indian GSTIN registration | Admin Portal (`/admin-dashboard/pages/company/`) or `company` table |
| `[COMPANY_ADDRESS_PLACEHOLDER]` | Head office / manufacturing address | Admin Portal (`/admin-dashboard/pages/company/`) or `company` table |
| `[PHONE_NUMBER_PLACEHOLDER]` | Official telephone / customer service line | Admin Portal (`/admin-dashboard/pages/company/`) or `company` table |
| `[EMAIL_ADDRESS_PLACEHOLDER]` | Official contact email | Admin Portal (`/admin-dashboard/pages/company/`) or `company` table |
| `[WHATSAPP_NUMBER_PLACEHOLDER]` | WhatsApp ordering number (e.g. `919876543210`) | `application.yml` and Admin Company settings |
| `[CEO_NAME_PLACEHOLDER]` | Name of Chief Executive Officer | Admin Portal (`/admin-dashboard/pages/company/`) or `ceo` table |
| `[CEO_MESSAGE_PLACEHOLDER]` | Executive message to farmers & dealers | Admin Portal (`/admin-dashboard/pages/company/`) or `ceo` table |

---

## 8. REST API Documentation Summary

### Public & Customer Endpoints
- `POST /api/auth/register` - Customer signup
- `POST /api/auth/login` - Customer JWT login
- `POST /api/auth/google` - Google OAuth token exchange
- `POST /api/auth/forgot-password` - Trigger reset email
- `POST /api/auth/reset-password` - Complete password reset
- `GET /api/products` - Filtered & paginated product catalog
- `GET /api/products/{id}` - Complete product details with nutrition matrix
- `GET /api/products/featured` - Homepage featured feeds
- `GET /api/products/categories` - Product categories list
- `GET /api/search` - Search by keyword, category, fish type, pellet size
- `GET /api/search/suggestions` - Real-time autocomplete suggestions
- `GET /api/comparisons` - Feed vs competitor nutritional comparison table
- `GET /api/recommendations/{productId}` - Related recommended feeds
- `GET /api/company/profile` - Company contact details, GST, and address
- `GET /api/company/ceo` - CEO profile and leadership message
- `GET /api/company/content/{sectionKey}` - Dynamic CMS section content
- `POST /api/feedback` - Submit inquiry or feedback

### Customer Authenticated Endpoints (`ROLE_CUSTOMER` / `ROLE_ADMIN`)
- `GET /api/user/profile` - View logged-in customer profile
- `PUT /api/user/profile` - Update customer profile
- `GET /api/wishlist` - Get saved products
- `POST /api/wishlist/{productId}` - Add product to wishlist
- `DELETE /api/wishlist/{productId}` - Remove product from wishlist
- `POST /api/reviews` - Submit product review & rating

### Admin Protected Endpoints (`ROLE_ADMIN`)
- `GET /api/admin/dashboard/stats` - Inventory, customer, and feedback KPIs
- `POST /api/admin/products` - Create new feed product
- `PUT /api/admin/products/{id}` - Update feed product
- `DELETE /api/admin/products/{id}` - Delete feed product
- `PATCH /api/admin/products/{id}/stock` - Toggle `IN_STOCK` / `OUT_OF_STOCK`
- `GET /api/admin/reviews` - List all reviews
- `PATCH /api/admin/reviews/{id}/moderate` - Approve / reject customer review
- `DELETE /api/admin/reviews/{id}` - Delete review
- `POST /api/admin/comparisons` - Add competitor benchmark
- `PUT /api/admin/comparisons/{id}` - Update competitor benchmark
- `DELETE /api/admin/comparisons/{id}` - Remove competitor benchmark
- `POST /api/admin/recommendations` - Map recommended feeds
- `DELETE /api/admin/recommendations` - Unmap recommended feeds
- `PUT /api/admin/company` - Update company information & GST
- `PUT /api/admin/ceo` - Update CEO profile & message
- `PUT /api/admin/website/content` - Update dynamic website CMS text
- `GET /api/admin/customers` - View customer directory
- `GET /api/admin/feedback` - View incoming inquiries
- `PATCH /api/admin/feedback/{id}/read` - Mark feedback as read
- `DELETE /api/admin/feedback/{id}` - Delete feedback entry

---

## 9. License & Attribution
Designed and built for **K's Enterprises**. All rights reserved.
