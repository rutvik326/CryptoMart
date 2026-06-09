# 🪙 CryptoMart: Enterprise Digital Asset Trading Platform

CryptoMart is a fully decoupled, full-stack cryptocurrency trading dashboard. Designed with production-grade architecture, the platform handles real-time market discovery, asynchronous global state management, secure digital ledger transactions, and international payment checkout flows.

🔗 **[https://cryptomart94.netlify.app/]**

<br/>

## 📺 System Walkthrough & Architecture Video

> **Note to Interviewers:** Click the thumbnail below for a 2-minute demonstration of the transactional state flow, Stripe payment integration, 2FA security filters, and the Redux state architecture in action.

[![CryptoMart Video Demo](https://img.youtube.com/vi/INSERT_YOUR_YOUTUBE_VIDEO_ID_HERE/maxresdefault.jpg)](https://www.youtube.com/watch?v=INSERT_YOUR_YOUTUBE_VIDEO_ID_HERE)


<br/>

## 📸 Platform Interface & Dashboards

### 1. Market Discovery & Live Trading
<div align="center">
<img width="1916" height="879" alt="Image" src="https://github.com/user-attachments/assets/734ca16c-e0eb-4725-a068-b40635b27325" />
</div>

<br/>

### 2. Secure Wallet & Transactions
<div align="center">
  <img src="[INSERT_YOUR_WALLET_IMAGE_LINK_HERE]" alt="Wallet Dashboard" width="850"/>
</div>

<br/>

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
* **Deterministic Financial Computations:** Avoids standard binary floating-point rounding errors inside core wallets and order processing systems by utilizing arbitrary-precision financial primitives (BigDecimal) to calculate exact asset buy/sell transactions.

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

</details>

---

## ⚙️ Local Development Setup

Follow these exact execution steps to deploy the decoupled environment on your local machine.

### 1. Relational Database Initialization
Initialize your local MySQL Server Instance and create an isolated schema mapping. Run this SQL command:

    CREATE DATABASE cryptomart_db;

### 2. Environment Variables Configuration
Navigate into backend/src/main/resources/application.properties and replace the placeholder fields with your local database credentials, Google SMTP app secrets, and target Stripe API keys.

    server.port=5454
    spring.datasource.url=jdbc:mysql://localhost:3306/cryptomart_db?allowPublicKeyRetrieval=true&useSSL=false
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
Open the backend folder in your terminal or IDE (e.g., IntelliJ IDEA) and trigger Maven to resolve dependencies and compile the execution bytecode:

    ./mvnw spring-boot:run

Ensure the server successfully initializes and binds to http://localhost:5454.

### 4. Install and Build Frontend Client
Open a new isolated terminal pointing to the Frontend V1.1 directory. Install dependencies and start the Vite development server:

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
