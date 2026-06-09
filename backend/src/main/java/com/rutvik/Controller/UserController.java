package com.rutvik.Controller;

import com.rutvik.Repository.UserRepository;
import com.rutvik.domain.VerificationType;
import com.rutvik.model.TwoFactorAuth;
import com.rutvik.model.User;
import com.rutvik.model.VerificationCode;
import com.rutvik.Repository.VerificationCodeRepository;
import com.rutvik.Service.EmailService;
import com.rutvik.Service.UserService;
import com.rutvik.Service.VerificationCodeService;
import com.rutvik.request.UpdateUserRequest;
import com.rutvik.utils.OtpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationCodeService verificationCodeService;

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/auth/two-factor/enable")
    public ResponseEntity<User> sendTwoFactorOtp(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);

        VerificationCode verificationCode = verificationCodeService.getVerificationCodeByUser(user.getId());

        if (verificationCode != null) {
            verificationCodeService.deleteVerificationCodeById(verificationCode.getId());
        }

        String otp = OtpUtils.generateOtp();

        VerificationCode newVerificationCode = verificationCodeService.sendVerificationCode(
                user,
                VerificationType.EMAIL
        );

        newVerificationCode.setOtp(otp);
        newVerificationCode.setEmail(user.getEmail());

        verificationCodeRepository.save(newVerificationCode);

        emailService.sendVerificationOtpEmail(user.getEmail(), otp);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PatchMapping("/enable-two-factor/verify-otp/{otp}")
    public ResponseEntity<User> enableTwoFactorAuthentication(@PathVariable String otp,
                                                              @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);

        VerificationCode verificationCode = verificationCodeService.getVerificationCodeByUser(user.getId());

        String sendTo = verificationCode.getVerificationType().equals(VerificationType.EMAIL) ?
                verificationCode.getEmail() : verificationCode.getMobile();

        boolean isVerified = verificationCode.getOtp().equals(otp);

        if (isVerified) {
            TwoFactorAuth twoFactorAuth = user.getTwoFactorAuth();
            twoFactorAuth.setEnabled(true);
            user.setTwoFactorAuth(twoFactorAuth);
            userRepository.save(user);

            verificationCodeService.deleteVerificationCodeById(verificationCode.getId());

            return new ResponseEntity<>(user, HttpStatus.OK);
        }

        throw new Exception("Invalid otp");
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateUserProfile(
            @RequestHeader("Authorization") String jwt,
            @RequestBody UpdateUserRequest request) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        User updatedUser = userService.updateUserProfile(user.getId(), request);

        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    // ⭐ NEW - Disable Two-Factor Authentication
    @PatchMapping("/disable-two-factor")
    public ResponseEntity<User> disableTwoFactorAuthentication(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);

        TwoFactorAuth twoFactorAuth = user.getTwoFactorAuth();
        twoFactorAuth.setEnabled(false);
        user.setTwoFactorAuth(twoFactorAuth);

        User updatedUser = userRepository.save(user);

        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }
}
