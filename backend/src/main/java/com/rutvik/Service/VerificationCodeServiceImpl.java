package com.rutvik.Service;

import com.rutvik.Repository.VerificationCodeRepository;
import com.rutvik.Service.VerificationCodeService;
import com.rutvik.domain.VerificationType;
import com.rutvik.model.User;
import com.rutvik.model.VerificationCode;
import com.rutvik.utils.OtpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VerificationCodeServiceImpl implements VerificationCodeService {

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @Override
    public VerificationCode sendVerificationCode(User user, VerificationType verificationType) throws Exception {

        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setOtp(OtpUtils.generateOtp());
        verificationCode.setVerificationType(verificationType);
        verificationCode.setUser(user);

        return verificationCodeRepository.save(verificationCode);
    }

    @Override
    public VerificationCode getVerificationCodeById(Long id) throws Exception {

        return verificationCodeRepository.findById(id)
                .orElseThrow(() -> new Exception("Verification code not found"));
    }

    @Override
    public VerificationCode getVerificationCodeByUser(Long userId) {

        return verificationCodeRepository.findByUserId(userId);
    }

    @Override
    public void deleteVerificationCodeById(Long id) throws Exception {

        VerificationCode verificationCode = getVerificationCodeById(id);
        verificationCodeRepository.delete(verificationCode);
    }
}
