package com.rutvik.Service;

import com.rutvik.Repository.UserRepository;
import com.rutvik.config.JwtProvider;
import com.rutvik.model.Address;
import com.rutvik.model.User;
import com.rutvik.request.UpdateUserRequest;
import com.rutvik.utils.OtpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Configuration from application.properties
    @Value("${otp.expiry.minutes:10}")
    private int otpExpiryMinutes;

    @Value("${otp.max.attempts:3}")
    private int maxOtpAttempts;

    @Value("${reset.token.expiry.minutes:15}")
    private int resetTokenExpiryMinutes;

    @Value("${otp.resend.cooldown.minutes:2}")
    private int otpResendCooldownMinutes;

    @Override
    public User findUserProfileByJwt(String jwt) throws Exception {
        String email = JwtProvider.getEmailFromToken(jwt);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("User not found"));
        return user;
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("User not found"));
        return user;
    }

    @Override
    public User findUserById(Long userId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
        return user;
    }

    @Override
    public User updateUserProfile(Long userId, UpdateUserRequest request) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        // Update personal details
        if (request.getFullName() != null && !request.getFullName().isEmpty()) {
            user.setFullName(request.getFullName());
        }

        if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()) {
            user.setDateOfBirth(request.getDateOfBirth());
        }

        if (request.getNationality() != null && !request.getNationality().isEmpty()) {
            user.setNationality(request.getNationality());
        }

        // Update address
        if (request.getAddress() != null) {
            Address address = user.getAddress();
            if (address == null) {
                address = new Address();
            }

            if (request.getAddress().getStreet() != null && !request.getAddress().getStreet().isEmpty()) {
                address.setStreet(request.getAddress().getStreet());
            }

            if (request.getAddress().getCity() != null && !request.getAddress().getCity().isEmpty()) {
                address.setCity(request.getAddress().getCity());
            }

            if (request.getAddress().getPostCode() != null && !request.getAddress().getPostCode().isEmpty()) {
                address.setPostCode(request.getAddress().getPostCode());
            }

            if (request.getAddress().getCountry() != null && !request.getAddress().getCountry().isEmpty()) {
                address.setCountry(request.getAddress().getCountry());
            }

            user.setAddress(address);
        }

        return userRepository.save(user);
    }

    // ⭐ NEW METHOD 1: SEND FORGOT PASSWORD OTP
    @Override
    public void sendForgotPasswordOtp(String email) throws Exception {

        System.out.println("🔍 Attempting to send forgot password OTP to: " + email);

        // Step 1: Check if user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("No account exists with this email"));

        System.out.println("✅ User found: " + user.getFullName());

        // Step 2: Check rate limiting (prevent spam)
        if (user.getLastOtpRequest() != null) {
            LocalDateTime cooldownTime = user.getLastOtpRequest().plusMinutes(otpResendCooldownMinutes);
            if (LocalDateTime.now().isBefore(cooldownTime)) {
                long secondsRemaining = java.time.Duration.between(LocalDateTime.now(), cooldownTime).getSeconds();
                throw new Exception("Please wait " + secondsRemaining + " seconds before requesting a new OTP");
            }
        }

        // Step 3: Generate new OTP
        String otp = OtpUtils.generateOtp();
        System.out.println("🔐 Generated OTP: " + otp);

        // Step 4: Calculate expiry time
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(otpExpiryMinutes);

        // Step 5: Save OTP to database
        user.setForgotPasswordOtp(otp);
        user.setOtpExpiry(expiryTime);
        user.setOtpAttempts(0); // Reset attempts
        user.setLastOtpRequest(LocalDateTime.now());
        userRepository.save(user);

        System.out.println("💾 OTP saved to database, expires at: " + expiryTime);

        // Step 6: Send OTP email
        emailService.sendForgotPasswordOtp(user.getEmail(), otp, user.getFullName());

        System.out.println("📧 OTP email sent successfully to: " + email);
    }

    // ⭐ NEW METHOD 2: VERIFY FORGOT PASSWORD OTP
    @Override
    public String verifyForgotPasswordOtp(String email, String otp) throws Exception {

        System.out.println("🔍 Verifying OTP for email: " + email);

        // Step 1: Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("User not found"));

        // Step 2: Check if OTP exists
        if (user.getForgotPasswordOtp() == null || user.getForgotPasswordOtp().isEmpty()) {
            throw new Exception("No OTP found. Please request a new one");
        }

        // Step 3: Check if OTP expired
        if (user.getOtpExpiry() == null || LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            // Clear expired OTP
            user.setForgotPasswordOtp(null);
            user.setOtpExpiry(null);
            user.setOtpAttempts(0);
            userRepository.save(user);
            throw new Exception("OTP has expired. Please request a new one");
        }

        // Step 4: Check max attempts
        if (user.getOtpAttempts() >= maxOtpAttempts) {
            // Clear OTP after max attempts
            user.setForgotPasswordOtp(null);
            user.setOtpExpiry(null);
            user.setOtpAttempts(0);
            userRepository.save(user);
            throw new Exception("Too many failed attempts. Please request a new OTP");
        }

        // Step 5: Verify OTP
        if (!user.getForgotPasswordOtp().equals(otp)) {
            // Increment attempts
            user.setOtpAttempts(user.getOtpAttempts() + 1);
            userRepository.save(user);

            int attemptsLeft = maxOtpAttempts - user.getOtpAttempts();
            throw new Exception("Wrong OTP. " + attemptsLeft + " attempts remaining");
        }

        System.out.println("✅ OTP verified successfully");

        // Step 6: Generate reset token
        String resetToken = UUID.randomUUID().toString();
        LocalDateTime tokenExpiry = LocalDateTime.now().plusMinutes(resetTokenExpiryMinutes);

        // Step 7: Save reset token
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(tokenExpiry);

        // Clear OTP data
        user.setForgotPasswordOtp(null);
        user.setOtpExpiry(null);
        user.setOtpAttempts(0);

        userRepository.save(user);

        System.out.println("🎟️ Reset token generated: " + resetToken);

        return resetToken;
    }

    // ⭐ NEW METHOD 3: RESET PASSWORD
    @Override
    public void resetPassword(String email, String resetToken, String newPassword, String confirmPassword) throws Exception {

        System.out.println("🔍 Resetting password for email: " + email);

        // Step 1: Validate passwords match
        if (!newPassword.equals(confirmPassword)) {
            throw new Exception("Passwords don't match");
        }

        // Step 2: Validate password strength
        if (newPassword.length() < 8) {
            throw new Exception("Password must be at least 8 characters long");
        }

        if (!newPassword.matches(".*[A-Z].*")) {
            throw new Exception("Password must contain at least one uppercase letter");
        }

        if (!newPassword.matches(".*[0-9].*")) {
            throw new Exception("Password must contain at least one number");
        }

        if (!newPassword.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            throw new Exception("Password must contain at least one special character");
        }

        // Step 3: Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("User not found"));

        // Step 4: Validate reset token
        if (user.getResetToken() == null || !user.getResetToken().equals(resetToken)) {
            throw new Exception("Invalid reset token");
        }

        // Step 5: Check if token expired
        if (user.getResetTokenExpiry() == null || LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
            // Clear expired token
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            throw new Exception("Reset link has expired. Please start the process again");
        }

        System.out.println("✅ Reset token validated");

        // Step 6: Hash and update password
        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedPassword);

        // Step 7: Clear reset token
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);

        System.out.println("✅ Password reset successfully for: " + email);

        // Optional: Send confirmation email
        try {
            emailService.sendPasswordResetConfirmation(user.getEmail(), user.getFullName());
        } catch (Exception e) {
            System.out.println("⚠️ Could not send confirmation email: " + e.getMessage());
        }
    }
}
