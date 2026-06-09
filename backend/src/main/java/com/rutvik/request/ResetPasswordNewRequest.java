package com.rutvik.request;

import lombok.Data;

@Data
public class ResetPasswordNewRequest {

    private String email;
    private String resetToken;
    private String newPassword;
    private String confirmPassword;
}
