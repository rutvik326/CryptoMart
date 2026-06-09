package com.rutvik.response;

import lombok.Data;

@Data
public class ForgotPasswordResponse {

    private boolean success;
    private String message;
    private String email;
    private String resetToken;
}
