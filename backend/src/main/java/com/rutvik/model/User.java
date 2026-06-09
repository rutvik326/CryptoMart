package com.rutvik.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rutvik.domain.UserRole;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fullName;

    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private UserRole role = UserRole.ROLE_CUSTOMER;

    @Embedded
    private TwoFactorAuth twoFactorAuth = new TwoFactorAuth();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private WatchList watchList;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private PaymentDetails paymentDetails;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Wallet wallet;

    private String dateOfBirth;

    private String nationality;

    @Embedded
    private Address address = new Address();

    // ⭐ NEW FORGOT PASSWORD FIELDS - ADD THESE 6 LINES
    private String forgotPasswordOtp;

    private LocalDateTime otpExpiry;

    private Integer otpAttempts = 0;

    private String resetToken;

    private LocalDateTime resetTokenExpiry;

    private LocalDateTime lastOtpRequest;
}
