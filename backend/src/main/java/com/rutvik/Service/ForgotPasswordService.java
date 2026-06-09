package com.rutvik.Service;

import com.rutvik.domain.VerificationType;
import com.rutvik.model.ForgotPasswordToken;
import com.rutvik.model.User;

public interface ForgotPasswordService {

    ForgotPasswordToken createToken(User user, String id, String otp,
                                    VerificationType verificationType, String sendTo);

    ForgotPasswordToken findById(Long id) throws Exception;

    ForgotPasswordToken findByUser(Long userId);

    void deleteToken(Long id) throws Exception;
}
