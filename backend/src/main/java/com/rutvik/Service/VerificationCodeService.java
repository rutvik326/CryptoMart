package com.rutvik.Service;

import com.rutvik.domain.VerificationType;
import com.rutvik.model.User;
import com.rutvik.model.VerificationCode;

public interface VerificationCodeService {

    VerificationCode sendVerificationCode(User user, VerificationType verificationType) throws Exception;

    VerificationCode getVerificationCodeById(Long id) throws Exception;

    VerificationCode getVerificationCodeByUser(Long userId);

    void deleteVerificationCodeById(Long id) throws Exception;
}
