package com.rutvik.Controller;

import com.rutvik.config.JwtProvider;
import com.rutvik.model.ForgotPasswordToken;
import com.rutvik.model.User;
import com.rutvik.model.VerificationCode;
import com.rutvik.model.EmailValidationResult;
import com.rutvik.Repository.UserRepository;
import com.rutvik.Repository.VerificationCodeRepository;
import com.rutvik.request.ForgotPasswordTokenRequest;
import com.rutvik.request.ResetPasswordRequest;
import com.rutvik.response.ApiResponse;
import com.rutvik.response.AuthResponse;
import com.rutvik.Service.*;
import com.rutvik.domain.VerificationType;
import com.rutvik.utils.OtpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private VerificationCodeService verificationCodeService;

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @Autowired
    private UserService userService;

    @Autowired
    private WatchListService watchListService;

    @Autowired
    private EmailValidationService emailValidationService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) throws Exception {

        System.out.println("Signup request - Email: " + user.getEmail() + ", Name: " + user.getFullName());

        // Validate email with Kickbox
        EmailValidationResult validation = emailValidationService.validateEmail(user.getEmail());

        if (!validation.isValid()) {
            String errorMessage;
            String reason = validation.getReason();

            if (reason.equals("UNDELIVERABLE")) {
                errorMessage = "This email address does not exist. Please check your email.";
            } else if (reason.equals("RISKY")) {
                errorMessage = "This email address appears to be risky or suspicious. Please use a different email.";
            } else if (reason.equals("UNKNOWN")) {
                errorMessage = "Unable to verify this email address. Please use a different email.";
            } else if (validation.isDisposable()) {
                errorMessage = "Temporary email addresses are not allowed. Please use your personal or work email.";
            } else if (validation.getDidYouMean() != null && !validation.getDidYouMean().isEmpty()) {
                errorMessage = "Did you mean " + validation.getDidYouMean() + "?";
            } else {
                errorMessage = "Invalid email address. Please use a valid email.";
            }

            System.out.println("Signup rejected: " + errorMessage);
            throw new Exception(errorMessage);
        }

        System.out.println("Email validation passed - Score: " + validation.getQualityScore());

        // Check if email already exists
        User isEmailExist = userRepository.findByEmail(user.getEmail()).orElse(null);

        if (isEmailExist != null) {
            System.out.println("Signup rejected: Email already registered");
            throw new Exception("Email is already registered. Please login instead.");
        }

        // Create new user
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setFullName(user.getFullName());

        User savedUser = userRepository.save(newUser);
        System.out.println("User created with ID: " + savedUser.getId());

        watchListService.createWatchList(savedUser);

        Authentication auth = new UsernamePasswordAuthenticationToken(
                user.getEmail(),
                user.getPassword()
        );

        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = JwtProvider.generateToken(auth);

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setStatus(true);
        res.setMessage("Register success");

        System.out.println("Signup successful for: " + user.getEmail());

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> login(@RequestBody User user) throws Exception {

        String username = user.getEmail();
        String password = user.getPassword();

        Authentication auth = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = JwtProvider.generateToken(auth);

        User authUser = userRepository.findByEmail(username)
                .orElseThrow(() -> new Exception("User not found"));

        if (authUser.getTwoFactorAuth().isEnabled()) {
            AuthResponse res = new AuthResponse();
            res.setMessage("Two factor auth is enabled");
            res.setTwoFactorAuthEnabled(true);

            String otp = OtpUtils.generateOtp();

            VerificationCode oldVerificationCode = verificationCodeService
                    .getVerificationCodeByUser(authUser.getId());

            if (oldVerificationCode != null) {
                verificationCodeService.deleteVerificationCodeById(oldVerificationCode.getId());
            }

            VerificationCode verificationCode = verificationCodeService.sendVerificationCode(
                    authUser,
                    VerificationType.EMAIL
            );

            verificationCode.setOtp(otp);
            verificationCode.setEmail(authUser.getEmail());

            verificationCodeRepository.save(verificationCode);

            emailService.sendVerificationOtpEmail(authUser.getEmail(), otp);

            res.setSession(verificationCode.getId().toString());

            return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
        }

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setStatus(true);
        res.setMessage("Login success");

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    private Authentication authenticate(String username, String password) throws Exception {

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

        if (userDetails == null) {
            throw new Exception("Invalid username");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new Exception("Invalid password");
        }

        return new UsernamePasswordAuthenticationToken(
                userDetails,
                password,
                userDetails.getAuthorities()
        );
    }

    @PostMapping("/two-factor/otp/{otp}")
    public ResponseEntity<AuthResponse> verifySigninOtp(@PathVariable String otp,
                                                        @RequestParam String id) throws Exception {

        VerificationCode verificationCode = verificationCodeService
                .getVerificationCodeById(Long.valueOf(id));

        if (verificationCode.getOtp().equals(otp)) {

            Authentication auth = new UsernamePasswordAuthenticationToken(
                    verificationCode.getUser().getEmail(),
                    null,
                    null
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

            String jwt = JwtProvider.generateToken(auth);

            AuthResponse res = new AuthResponse();
            res.setJwt(jwt);
            res.setStatus(true);
            res.setMessage("Two factor authentication verified");

            verificationCodeService.deleteVerificationCodeById(verificationCode.getId());

            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        throw new Exception("Invalid otp");
    }

    // OLD FORGOT PASSWORD - KEEP IT FOR BACKWARD COMPATIBILITY
    @PostMapping("/users/reset-password/send-otp")
    public ResponseEntity<AuthResponse> sendForgotPasswordOtp(@RequestBody ForgotPasswordTokenRequest req) throws Exception {

        User user = userRepository.findByEmail(req.getSendTo())
                .orElseThrow(() -> new Exception("User not found"));

        String otp = OtpUtils.generateOtp();

        ForgotPasswordToken token = forgotPasswordService.findByUser(user.getId());

        if (token == null) {
            token = forgotPasswordService.createToken(
                    user,
                    null,
                    otp,
                    req.getVerificationType(),
                    req.getSendTo()
            );
        }

        token.setOtp(otp);

        if (req.getVerificationType().equals(VerificationType.EMAIL)) {
            emailService.sendVerificationOtpEmail(
                    user.getEmail(),
                    token.getOtp()
            );
        }

        AuthResponse res = new AuthResponse();
        res.setSession(token.getId().toString());
        res.setMessage("Password reset otp sent successfully");

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // OLD FORGOT PASSWORD - KEEP IT FOR BACKWARD COMPATIBILITY
    @PatchMapping("/users/reset-password/verify-otp")
    public ResponseEntity<ApiResponse> resetPassword(@RequestParam String id,
                                                     @RequestBody ResetPasswordRequest req) throws Exception {

        ForgotPasswordToken forgotPasswordToken = forgotPasswordService.findById(Long.valueOf(id));

        boolean isVerified = forgotPasswordToken.getOtp().equals(req.getOtp());

        if (isVerified) {
            User user = forgotPasswordToken.getUser();
            user.setPassword(passwordEncoder.encode(req.getPassword()));
            userRepository.save(user);

            forgotPasswordService.deleteToken(forgotPasswordToken.getId());

            ApiResponse res = new ApiResponse();
            res.setMessage("Password reset successfully");

            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        throw new Exception("Invalid otp");
    }

    // ⭐ NEW ENDPOINT 1: SEND FORGOT PASSWORD OTP
    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<Map<String, Object>> sendNewForgotPasswordOtp(@RequestBody Map<String, String> request) {

        try {
            String email = request.get("email");

            System.out.println("📨 Forgot password OTP request for: " + email);

            // Call service to send OTP
            userService.sendForgotPasswordOtp(email);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "OTP sent successfully to your email");
            response.put("email", email);

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            System.out.println("❌ Error: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    // ⭐ NEW ENDPOINT 2: VERIFY FORGOT PASSWORD OTP
    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyNewForgotPasswordOtp(@RequestBody Map<String, String> request) {

        try {
            String email = request.get("email");
            String otp = request.get("otp");

            System.out.println("🔍 Verifying OTP for: " + email);

            // Call service to verify OTP and get reset token
            String resetToken = userService.verifyForgotPasswordOtp(email, otp);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "OTP verified successfully");
            response.put("resetToken", resetToken);
            response.put("email", email);

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            System.out.println("❌ Error: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    // ⭐ NEW ENDPOINT 3: RESET PASSWORD
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<Map<String, Object>> resetNewPassword(@RequestBody Map<String, String> request) {

        try {
            String email = request.get("email");
            String resetToken = request.get("resetToken");
            String newPassword = request.get("newPassword");
            String confirmPassword = request.get("confirmPassword");

            System.out.println("🔑 Resetting password for: " + email);

            // Call service to reset password
            userService.resetPassword(email, resetToken, newPassword, confirmPassword);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Password reset successfully");

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            System.out.println("❌ Error: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}
