package com.rutvik.Service;

import com.rutvik.domain.VerificationType;
import com.rutvik.model.ForgotPasswordToken;
import com.rutvik.model.User;
import com.rutvik.Repository.ForgotPasswordTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ForgotPasswordServiceImpl implements ForgotPasswordService {

    @Autowired
    private ForgotPasswordTokenRepository forgotPasswordTokenRepository;

    @Override
    public ForgotPasswordToken createToken(User user, String id, String otp,
                                           VerificationType verificationType, String sendTo) {

        ForgotPasswordToken token = new ForgotPasswordToken();
        token.setUser(user);
        token.setOtp(otp);
        token.setVerificationType(verificationType);
        token.setSendTo(sendTo);

        return forgotPasswordTokenRepository.save(token);
    }

    @Override
    public ForgotPasswordToken findById(Long id) throws Exception {

        return forgotPasswordTokenRepository.findById(id)
                .orElseThrow(() -> new Exception("Token not found"));
    }

    @Override
    public ForgotPasswordToken findByUser(Long userId) {

        return forgotPasswordTokenRepository.findByUserId(userId);
    }

    @Override
    public void deleteToken(Long id) throws Exception {

        ForgotPasswordToken token = findById(id);
        forgotPasswordTokenRepository.delete(token);
    }
}
