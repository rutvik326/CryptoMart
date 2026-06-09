# File Tree: CryptoMart


```
├── 📁 Frontend V1.1
│   ├── 📁 public
│   │   └── 📁 images
│   │       ├── 🖼️ Razorpay_logo.svg
│   │       ├── 🖼️ bank.png
│   │       ├── 🖼️ crypto-7678815.jpg
│   │       ├── 🖼️ logo-bg.png
│   │       ├── 🖼️ logo.png
│   │       └── 🖼️ stripe.png
│   ├── 📁 src
│   │   ├── 📁 State
│   │   │   ├── 📁 Asset
│   │   │   │   ├── 📄 Action.js
│   │   │   │   ├── 📄 ActionTypes.js
│   │   │   │   └── 📄 Reducer.js
│   │   │   ├── 📁 Auth
│   │   │   │   ├── 📄 Action.js
│   │   │   │   ├── 📄 ActionTypes.js
│   │   │   │   └── 📄 Reducer.js
│   │   │   ├── 📁 Chat
│   │   │   │   ├── 📄 Action.js
│   │   │   │   ├── 📄 ActionTypes.js
│   │   │   │   └── 📄 Reducer.js
│   │   │   ├── 📁 Coin
│   │   │   │   ├── 📄 Action.js
│   │   │   │   ├── 📄 ActionType.js
│   │   │   │   └── 📄 Reducer.js
│   │   │   ├── 📁 Order
│   │   │   │   ├── 📄 Action.js
│   │   │   │   ├── 📄 ActionTypes.js
│   │   │   │   └── 📄 Reducer.js
│   │   │   ├── 📁 Wallet
│   │   │   │   ├── 📄 Action.js
│   │   │   │   ├── 📄 ActionType.js
│   │   │   │   └── 📄 Reducer.js
│   │   │   ├── 📁 Watchlist
│   │   │   │   ├── 📄 Action.js
│   │   │   │   ├── 📄 ActionTypes.js
│   │   │   │   └── 📄 Reducer.js
│   │   │   ├── 📁 Withdrawal
│   │   │   │   ├── 📄 Action.js
│   │   │   │   ├── 📄 ActionType.js
│   │   │   │   └── 📄 Reducer.js
│   │   │   └── 📄 Store.js
│   │   ├── 📁 assets
│   │   │   └── 🖼️ react.svg
│   │   ├── 📁 components
│   │   │   └── 📁 ui
│   │   │       ├── 📄 avatar.jsx
│   │   │       ├── 📄 badge.jsx
│   │   │       ├── 📄 button.jsx
│   │   │       ├── 📄 card.jsx
│   │   │       ├── 📄 dialog.jsx
│   │   │       ├── 📄 form.jsx
│   │   │       ├── 📄 input-otp.jsx
│   │   │       ├── 📄 input.jsx
│   │   │       ├── 📄 label.jsx
│   │   │       ├── 📄 radio-group.jsx
│   │   │       ├── 📄 scroll-area.jsx
│   │   │       ├── 📄 select.jsx
│   │   │       ├── 📄 separator.jsx
│   │   │       ├── 📄 sheet.jsx
│   │   │       ├── 📄 table.jsx
│   │   │       └── 📄 tabs.jsx
│   │   ├── 📁 config
│   │   │   └── 📄 api.js
│   │   ├── 📁 lib
│   │   │   └── 📄 utils.js
│   │   ├── 📁 pages
│   │   │   ├── 📁 Activity
│   │   │   │   └── 📄 Activity.jsx
│   │   │   ├── 📁 Auth
│   │   │   │   ├── 📄 Auth.jsx
│   │   │   │   ├── 📄 Forgotpasswordform.jsx
│   │   │   │   ├── 📄 OtpPopup.jsx
│   │   │   │   ├── 📄 ResetPasswordPopup.jsx
│   │   │   │   ├── 📄 Signinform.jsx
│   │   │   │   ├── 📄 Signupform.jsx
│   │   │   │   └── 📄 TwoFactorAuthModal.jsx
│   │   │   ├── 📁 Home
│   │   │   │   ├── 📄 AssetTable.jsx
│   │   │   │   ├── 📄 Home.jsx
│   │   │   │   └── 📄 Stockchart.jsx
│   │   │   ├── 📁 Navbar
│   │   │   │   ├── 📄 Navbar.jsx
│   │   │   │   └── 📄 Sidbar.jsx
│   │   │   ├── 📁 Notfound
│   │   │   │   └── 📄 Notfound.jsx
│   │   │   ├── 📁 Paymentdetails
│   │   │   │   ├── 📄 Paymentdetails.jsx
│   │   │   │   └── 📄 Paymentdetailsform.jsx
│   │   │   ├── 📁 Portfolio
│   │   │   │   └── 📄 Portfolio.jsx
│   │   │   ├── 📁 Search
│   │   │   │   └── 📄 Searchcoin.jsx
│   │   │   ├── 📁 Stockdetails
│   │   │   │   ├── 📄 Stockdetails.jsx
│   │   │   │   └── 📄 Tradingform.jsx
│   │   │   ├── 📁 Wallet
│   │   │   │   ├── 📄 Topupform.jsx
│   │   │   │   ├── 📄 Transferform.jsx
│   │   │   │   ├── 📄 Wallet.jsx
│   │   │   │   └── 📄 Withdrawalform.jsx
│   │   │   ├── 📁 Watchlist
│   │   │   │   └── 📄 Watchlist.jsx
│   │   │   ├── 📁 Withdrawal
│   │   │   │   └── 📄 Withdrawal.jsx
│   │   │   └── 📁 profile
│   │   │       ├── 📄 AccountVerificationForm.jsx
│   │   │       ├── 📄 UpdateUserInfo.jsx
│   │   │       └── 📄 profile.jsx
│   │   ├── 📄 App.jsx
│   │   ├── 🎨 index.css
│   │   └── 📄 main.jsx
│   ├── ⚙️ .gitignore
│   ├── 📝 README.md
│   ├── ⚙️ components.json
│   ├── 📄 eslint.config.js
│   ├── 🌐 index.html
│   ├── ⚙️ jsconfig.json
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   └── 📄 vite.config.js
├── 📁 backend
│   ├── 📁 .mvn
│   │   └── 📁 wrapper
│   │       └── 📄 maven-wrapper.properties
│   ├── 📁 src
│   │   ├── 📁 main
│   │   │   ├── 📁 java
│   │   │   │   └── 📁 com
│   │   │   │       └── 📁 rutvik
│   │   │   │           ├── 📁 Controller
│   │   │   │           │   ├── ☕ AssetController.java
│   │   │   │           │   ├── ☕ AuthController.java
│   │   │   │           │   ├── ☕ CacheAdminController.java
│   │   │   │           │   ├── ☕ ChatBotController.java
│   │   │   │           │   ├── ☕ CoinController.java
│   │   │   │           │   ├── ☕ HomeController.java
│   │   │   │           │   ├── ☕ OrderController.java
│   │   │   │           │   ├── ☕ PaymentController.java
│   │   │   │           │   ├── ☕ PaymentDetailsController.java
│   │   │   │           │   ├── ☕ UserController.java
│   │   │   │           │   ├── ☕ WalletController.java
│   │   │   │           │   ├── ☕ WatchListController.java
│   │   │   │           │   └── ☕ WithdrawalController.java
│   │   │   │           ├── 📁 Repository
│   │   │   │           │   ├── ☕ AssetRepository.java
│   │   │   │           │   ├── ☕ ChatBotRepository.java
│   │   │   │           │   ├── ☕ CoinRepository.java
│   │   │   │           │   ├── ☕ ForgotPasswordTokenRepository.java
│   │   │   │           │   ├── ☕ OrderItemRepository.java
│   │   │   │           │   ├── ☕ OrderRepository.java
│   │   │   │           │   ├── ☕ PaymentDetailsRepository.java
│   │   │   │           │   ├── ☕ PaymentOrderRepository.java
│   │   │   │           │   ├── ☕ UserRepository.java
│   │   │   │           │   ├── ☕ VerificationCodeRepository.java
│   │   │   │           │   ├── ☕ WalletRepository.java
│   │   │   │           │   ├── ☕ WalletTransactionRepository.java
│   │   │   │           │   ├── ☕ WatchListRepository.java
│   │   │   │           │   └── ☕ WithdrawalRepository.java
│   │   │   │           ├── 📁 Service
│   │   │   │           │   ├── ☕ AssetService.java
│   │   │   │           │   ├── ☕ AssetServiceImpl.java
│   │   │   │           │   ├── ☕ CacheService.java
│   │   │   │           │   ├── ☕ ChatBotService.java
│   │   │   │           │   ├── ☕ ChatBotServiceImpl.java
│   │   │   │           │   ├── ☕ CoinService.java
│   │   │   │           │   ├── ☕ CoinServiceImpl.java
│   │   │   │           │   ├── ☕ CustomUserDetailsService.java
│   │   │   │           │   ├── ☕ EmailService.java
│   │   │   │           │   ├── ☕ EmailValidationService.java
│   │   │   │           │   ├── ☕ ForgotPasswordService.java
│   │   │   │           │   ├── ☕ ForgotPasswordServiceImpl.java
│   │   │   │           │   ├── ☕ OrderService.java
│   │   │   │           │   ├── ☕ OrderServiceImpl.java
│   │   │   │           │   ├── ☕ PaymentDetailsService.java
│   │   │   │           │   ├── ☕ PaymentDetailsServiceImpl.java
│   │   │   │           │   ├── ☕ PaymentService.java
│   │   │   │           │   ├── ☕ PaymentServiceImpl.java
│   │   │   │           │   ├── ☕ UserService.java
│   │   │   │           │   ├── ☕ UserServiceImpl.java
│   │   │   │           │   ├── ☕ VerificationCodeService.java
│   │   │   │           │   ├── ☕ VerificationCodeServiceImpl.java
│   │   │   │           │   ├── ☕ WalletService.java
│   │   │   │           │   ├── ☕ WalletServiceImpl.java
│   │   │   │           │   ├── ☕ WatchListService.java
│   │   │   │           │   ├── ☕ WatchListServiceImpl.java
│   │   │   │           │   ├── ☕ WithdrawalService.java
│   │   │   │           │   └── ☕ WithdrawalServiceImpl.java
│   │   │   │           ├── 📁 config
│   │   │   │           │   ├── ☕ AppConfig.java
│   │   │   │           │   ├── ☕ CacheConfig.java
│   │   │   │           │   ├── ☕ JacksonConfig.java
│   │   │   │           │   ├── ☕ JwtConstant.java
│   │   │   │           │   ├── ☕ JwtProvider.java
│   │   │   │           │   └── ☕ JwtTokenValidator.java
│   │   │   │           ├── 📁 domain
│   │   │   │           │   ├── ☕ OrderStatus.java
│   │   │   │           │   ├── ☕ OrderType.java
│   │   │   │           │   ├── ☕ PaymentMethod.java
│   │   │   │           │   ├── ☕ PaymentOrderStatus.java
│   │   │   │           │   ├── ☕ UserRole.java
│   │   │   │           │   ├── ☕ VerificationType.java
│   │   │   │           │   ├── ☕ WalletTransactionType.java
│   │   │   │           │   └── ☕ WithdrawalStatus.java
│   │   │   │           ├── 📁 model
│   │   │   │           │   ├── ☕ Address.java
│   │   │   │           │   ├── ☕ Asset.java
│   │   │   │           │   ├── ☕ ChatBot.java
│   │   │   │           │   ├── ☕ Coin.java
│   │   │   │           │   ├── ☕ EmailValidationResult.java
│   │   │   │           │   ├── ☕ ForgotPasswordToken.java
│   │   │   │           │   ├── ☕ Order.java
│   │   │   │           │   ├── ☕ OrderItem.java
│   │   │   │           │   ├── ☕ PaymentDetails.java
│   │   │   │           │   ├── ☕ PaymentOrder.java
│   │   │   │           │   ├── ☕ TwoFactorAuth.java
│   │   │   │           │   ├── ☕ User.java
│   │   │   │           │   ├── ☕ VerificationCode.java
│   │   │   │           │   ├── ☕ Wallet.java
│   │   │   │           │   ├── ☕ WalletTransaction.java
│   │   │   │           │   ├── ☕ WatchList.java
│   │   │   │           │   └── ☕ Withdrawal.java
│   │   │   │           ├── 📁 request
│   │   │   │           │   ├── ☕ CreateOrderRequest.java
│   │   │   │           │   ├── ☕ ForgotPasswordRequest.java
│   │   │   │           │   ├── ☕ ForgotPasswordTokenRequest.java
│   │   │   │           │   ├── ☕ LoginRequest.java
│   │   │   │           │   ├── ☕ PromptBody.java
│   │   │   │           │   ├── ☕ ResetPasswordNewRequest.java
│   │   │   │           │   ├── ☕ ResetPasswordRequest.java
│   │   │   │           │   ├── ☕ UpdateUserRequest.java
│   │   │   │           │   └── ☕ VerifyOtpRequest.java
│   │   │   │           ├── 📁 response
│   │   │   │           │   ├── ☕ ApiResponse.java
│   │   │   │           │   ├── ☕ AuthResponse.java
│   │   │   │           │   ├── ☕ ForgotPasswordResponse.java
│   │   │   │           │   └── ☕ PaymentResponse.java
│   │   │   │           ├── 📁 utils
│   │   │   │           │   └── ☕ OtpUtils.java
│   │   │   │           └── ☕ BackendApplication.java
│   │   │   └── 📁 resources
│   │   │       ├── 📁 static
│   │   │       ├── 📁 templates
│   │   │       └── 📄 application.properties
│   │   └── 📁 test
│   │       └── 📁 java
│   │           └── 📁 com
│   │               └── 📁 rutvik
│   │                   └── ☕ BackendApplicationTests.java
│   ├── ⚙️ .gitattributes
│   ├── ⚙️ .gitignore
│   ├── 📝 HELP.md
│   ├── 📄 mvnw
│   ├── 📄 mvnw.cmd
│   └── ⚙️ pom.xml
└── ⚙️ .gitattributes
```