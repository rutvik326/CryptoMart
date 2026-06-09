package com.rutvik.request;

import lombok.Data;

@Data
public class VerifyOtpRequest {

    private String email;
    private String otp;
}
