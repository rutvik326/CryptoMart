# 🪙 CryptoSphere: Enterprise Digital Asset Trading Platform

CryptoSphere is a fully decoupled, full-stack cryptocurrency trading dashboard. Designed with production-grade architecture, the platform handles real-time market discovery, asynchronous global state management, secure digital ledger transactions, and international multi-currency payment checkout flows.

🔗 **[Live Production Deployment Link]** | 📺 **[System Walkthrough & Architecture Video Link]**

---

## 📸 Platform Interface & Dashboards

| Market Discovery & Trading | Secure Wallet & Transactions |
| :---: | :---: |
| <img src="[LINK_TO_YOUR_FRONTEND_SCREENSHOT_1_HERE]" width="400" alt="Market Dashboard"/> | <img src="[LINK_TO_YOUR_WALLET_SCREENSHOT_2_HERE]" width="400" alt="Wallet Dashboard"/> |


---

## 🏗️ System Architecture & Engineering Highlights

```text
  [ React + Vite Client ] ──( Global State: Redux Toolkit )
             │
      ( RESTful APIs / JWT )
             ▼
  [ Spring Boot App Server ] ──( Spring Security + 2FA Engine )
             │
     ┌───────┴───────┐
     ▼               ▼
[ MySQL DB ]   [ External Services ] ──( CoinGecko API & Stripe SDK )


🛠️ Technology Stack MatrixInfrastructure LayerFrameworks & Protocols UsedFront-End View EngineReact.js, Vite Core CompilerFront-End Global StateRedux, Async Thunk MiddlewareStyle ArchitectureTailwind CSS, Shadcn UI Components, Lucide IconsApplication ServerJava 17, Spring Boot Framework (v3.x)Identity & AccessSpring Security, JSON Web Tokens (JWT), Java Mail SenderDatabase TierMySQL Relational Engine, Spring Data JPA / HibernateAPI / Finance WrappersCoinGecko RESTful API, Stripe Checkout SDK
