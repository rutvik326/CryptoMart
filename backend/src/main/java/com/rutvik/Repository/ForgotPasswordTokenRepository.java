package com.rutvik.Repository;

import com.rutvik.model.ForgotPasswordToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForgotPasswordTokenRepository extends JpaRepository<ForgotPasswordToken, Long> {

    ForgotPasswordToken findByUserId(Long userId);
}
