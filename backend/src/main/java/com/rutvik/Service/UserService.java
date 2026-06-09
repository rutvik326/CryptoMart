package com.rutvik.Service;

import com.rutvik.model.User;
import com.rutvik.request.UpdateUserRequest;

public interface UserService {

    User findUserProfileByJwt(String jwt) throws Exception;

    User findUserByEmail(String email) throws Exception;

    User findUserById(Long userId) throws Exception;

    User updateUserProfile(Long userId, UpdateUserRequest request) throws Exception;

    // ⭐ NEW FORGOT PASSWORD METHODS - ADD THESE 3 LINES
    void sendForgotPasswordOtp(String email) throws Exception;

    String verifyForgotPasswordOtp(String email, String otp) throws Exception;

    void resetPassword(String email, String resetToken, String newPassword, String confirmPassword) throws Exception;
}
