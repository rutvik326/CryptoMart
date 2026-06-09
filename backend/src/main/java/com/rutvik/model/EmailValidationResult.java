package com.rutvik.model;

import lombok.Data;

@Data
public class EmailValidationResult {
    private String email;
    private boolean valid;
    private String reason;
    private boolean disposable;
    private String didYouMean;
    private double qualityScore;
}
