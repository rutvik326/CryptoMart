# 🪙 CryptoSphere: Enterprise Digital Asset Trading Platform

<div align="center">
  <img src="[INSERT_YOUR_IMAGE_LINK_HERE]" alt="CryptoSphere Banner"/>
</div>

<br/>

CryptoSphere is a fully decoupled, full-stack cryptocurrency trading dashboard. Designed with production-grade architecture, the platform handles real-time market discovery, asynchronous global state management, secure digital ledger transactions, and international multi-currency payment checkout flows.

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
* **Global Asynchronous State Management:** Utilizes a unidirectional data flow architecture via Redux and custom middleware (Thunk) to synchronize data mutations seamlessly between the backend REST endpoints and the front-end views.
* **Multi-Factor Transactional Security:** Features custom JSON Web Token (JWT) stateless authorization filters and an advanced Two-Factor Authentication (2FA) module utilizing session-locked verification OTPs via secure SMTP network streams.
* **Deterministic Financial Computations:** Avoids standard binary floating-point rounding errors inside core wallets and order processing systems by utilizing arbitrary-precision financial primitives (BigDecimal) to calculate exact asset buy/sell transactions.

---

## 🛠️ Technology Stack Matrix

| Infrastructure Layer | Frameworks & Protocols Used |
| :--- | :--- |
| **Front-End View Engine** | React.js, Vite Core Compiler |
| **Front-End Global State**| Redux, Async Thunk Middleware |
| **Style Architecture** | Tailwind CSS, Shadcn UI Components, Lucide Icons |
| **Application Server** | Java 17, Spring Boot Framework (v3.x) |
| **Identity & Access** | Spring Security, JSON Web Tokens (JWT), Java Mail Sender |
| **Database Tier** | MySQL Relational Engine, Spring Data JPA / Hibernate |
| **API / Finance Wrappers**| CoinGecko RESTful API, Stripe Checkout SDK |

---

## 📂 System Topology (Directory Layout)

    ├── crypto-backend/                 # Enterprise Java App Engine
    │   ├── src/main/java/com/zosh/
    │   │   ├── config/                 # Security Configurations, CORS Policies, JWT Filters
    │   │   ├── controller/             # REST Endpoints (Auth, Wallet, Orders, Assets, Coins)
    │   │   ├── domain/                 # Domain Boundaries (Enums: OrderStatus, TransactionType)
    │   │   ├── model/                  # JPA Database Entities (User, Asset, Wallet, PaymentOrder)
    │   │   ├── repository/             # Relational Database abstraction (JPA Data layers)
    │   │   └── service/                # Core Business Logic Layer implementations
    │   └── src/main/resources/
    │       └── application.properties  # Database, Stripe SDK & SMTP Configuration Variables
    │
    ├── crypto-frontend/                # Single Page Application Dashboard Engine
    │   ├── src/
    │   │   ├── components/             # Atomic & Stateless UI Architecture components (Shadcn UI)
    │   │   ├── pages/                  # Top-level Page Layout View Context wrappers
    │   │   ├── State/                  # Redux Global Storage engines (Actions, Reducers, Stores)
    │   │   ├── utils/                  # Reusable programmatic parsing functions
    │   │   ├── App.jsx                 # Dynamic Client Routing Registry Matrix
    │   │   └── main.jsx                # SPA Entry-point Node rendering pipeline
    │   ├── JSConfig.json               # Path imports configuration matrix mapping
    │   └── Vite.config.js              # Production Bundler processing pipeline configurations

---

## ⚙️ Local Development Setup

Follow these exact execution steps to deploy the decoupled environment on your local machine.

### 1. Relational Database Initialization
Initialize your local MySQL Server Instance and create an isolated schema mapping. Run this SQL command:

    CREATE DATABASE cryptosphere_db;

### 2. Environment Variables Configuration
Navigate into crypto-backend/src/main/resources/application.properties and replace the placeholder fields with your local database credentials, Google SMTP app secrets, and target Stripe API keys.

    server.port=5454
    spring.datasource.url=jdbc:mysql://localhost:3306/cryptosphere_db?allowPublicKeyRetrieval=true&useSSL=false
    spring.datasource.username=[YOUR_MYSQL_USERNAME]
    spring.datasource.password=[YOUR_MYSQL_PASSWORD]
    spring.jpa.hibernate.ddl-auto=update

    # Secure Mail Client Verification Engine Configuration
    spring.mail.host=smtp.gmail.com
    spring.mail.port=587
    spring.mail.username=[YOUR_SMTP_EMAIL]
    spring.mail.password=[YOUR_SMTP_APP_PASSWORD]
    spring.mail.properties.spring.smtp.auth=true
    spring.mail.properties.spring.smtp.starttls.enable=true

    # Stripe API Integration
    stripe.api.key=[YOUR_STRIPE_SECRET_KEY]

### 3. Compile and Launch the Spring Boot Server
Open the crypto-backend folder in your terminal or IDE (IntelliJ IDEA) and trigger Maven to resolve dependencies and compile the execution bytecode:

    ./mvnw spring-boot:run

Ensure the server successfully initializes and binds to http://localhost:5454.

### 4. Install and Build Frontend Client
Open a new isolated terminal pointing to the crypto-frontend directory. Install dependencies and start the Vite development server:

    npm install
    npm run dev

Access the interactive client viewport at http://localhost:5173.

---

## ✉️ Contact & Developer Info

Architected and developed by **[YOUR_NAME]**. 
Open to software engineering opportunities.

* **LinkedIn:** [Insert LinkedIn Profile Link]
* **Email:** [Insert Email Address]
* **Portfolio:** [Insert Portfolio Link (Optional)]
