# 🪙 CryptoMart: Enterprise Digital Asset Trading Platform

<div align="center">
  <img src="[INSERT_YOUR_IMAGE_LINK_HERE_E.G._HTTPS://GITHUB.COM/USER/REPO/BLOB/MAIN/FRONTEND_V1.1/PUBLIC/IMAGES/LOGO.PNG]" alt="CryptoMart Dashboard Preview" width="900"/>
</div>

<br/>

CryptoMart is a fully decoupled, full-stack cryptocurrency trading dashboard. Designed with production-grade architecture, the platform handles real-time market discovery, asynchronous global state management, secure digital ledger transactions, and international payment checkout flows.

🔗 **[Live Production Deployment Link]** | 📺 **[System Walkthrough & Architecture Video Link]**

---

## 🏗️ System Architecture & Engineering Highlights

    [ React + Vite Client ] ──( Global State: Redux Toolkit )
               │
        ( RESTful APIs / JWT )
               ▼
    [ Spring Boot App Server ] ──( Spring Security + 2FA Engine )
               │
       ┌───────┴───────┐
       ▼               ▼
  [ MySQL DB ]   [ External Services ] ──( CoinGecko API & Stripe SDK )

* **Decoupled Client-Server Architecture:** Built as entirely independent services. The React client handles UI composition and consumer-side state, while the Spring Boot server dictates core transactional logic and strict domain boundaries.
* **Global Asynchronous State Management:** Utilizes a unidirectional data flow architecture via Redux to synchronize data mutations seamlessly between the backend REST endpoints and the front-end views.
* **Multi-Factor Transactional Security:** Features custom JSON Web Token (JWT) stateless authorization filters and an advanced Two-Factor Authentication (2FA) module utilizing session-locked verification OTPs via secure SMTP network streams.
* **Deterministic Financial Computations:** Avoids standard binary floating-point rounding errors inside core wallets and order processing systems by utilizing arbitrary-precision financial primitives (`BigDecimal`) to calculate exact asset buy/sell transactions.

---

## 🛠️ Technology Stack Matrix

| Infrastructure Layer | Frameworks & Protocols Used |
| :--- | :--- |
| **Front-End View Engine** | React.js, Vite Core Compiler |
| **Front-End Global State**| Redux, Async Thunk Middleware |
| **Style Architecture** | Tailwind CSS, Shadcn UI Components |
| **Application Server** | Java 17, Spring Boot Framework (v3.x) |
| **Identity & Access** | Spring Security, JSON Web Tokens (JWT), Java Mail Sender |
| **Database Tier** | MySQL Relational Engine, Spring Data JPA / Hibernate |
| **API / Finance Wrappers**| CoinGecko RESTful API, Stripe Checkout SDK |

---

## 📂 System Topology (Directory Layout)

<details>
<summary><b>Click to expand full repository structure</b></summary>

```text
├── Frontend V1.1/                  # Single Page Application Dashboard
│   ├── public/
│   │   └── images/                 # Static Assets (Stripe, Logos, etc.)
│   ├── src/
│   │   ├── components/ui/          # Atomic Stateless UI Components (Shadcn UI base)
│   │   ├── config/                 # API Routing Configurations
│   │   ├── lib/                    # Reusable utility functions
│   │   ├── pages/                  # Page-Level Views (Auth, Portfolio, Wallet, etc.)
│   │   ├── State/                  # Redux Global Storage (Actions, Reducers, Stores)
│   │   │   ├── Asset/
│   │   │   ├── Auth/
│   │   │   ├── Coin/
│   │   │   ├── Order/
│   │   │   ├── Wallet/
│   │   │   ├── Watchlist/
│   │   │   └── Withdrawal/
│   │   ├── App.jsx                 # Dynamic Client Routing Registry
│   │   └── main.jsx                # SPA Entry-point
│   └── package.json                # Frontend Dependencies
│
├── backend/                        # Enterprise Java App Engine
│   ├── src/main/java/com/rutvik/
│   │   ├── config/                 # Security Configurations, CORS Policies, JWT Filters
│   │   ├── Controller/             # REST Endpoints (Auth, Wallet, Orders, Assets, Coins)
│   │   ├── domain/                 # Domain Boundaries (Enums: OrderStatus, TransactionType)
│   │   ├── model/                  # JPA Database Entities (User, Asset, Wallet, PaymentOrder)
│   │   ├── Repository/             # Relational Database abstraction (JPA Data layers)
│   │   ├── request/                # DTOs for incoming API payloads
│   │   ├── response/               # DTOs for outgoing API payloads
│   │   └── Service/                # Core Business Logic Layer implementations
│   ├── src/main/resources/
│   │   └── application.properties  # Database, Stripe SDK & SMTP Configuration Variables
│   └── pom.xml                     # Maven Dependencies
