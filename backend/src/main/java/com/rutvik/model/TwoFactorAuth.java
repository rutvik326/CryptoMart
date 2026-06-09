package com.rutvik.model;

import com.rutvik.domain.VerificationType;
import lombok.Data;
import jakarta.persistence.Embeddable;

@Data
@Embeddable
public class TwoFactorAuth {
    private boolean isEnabled = false;
    private VerificationType verificationType;
}
