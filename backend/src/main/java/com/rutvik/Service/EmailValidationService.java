package com.rutvik.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rutvik.model.EmailValidationResult;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class EmailValidationService {

    // Kickbox API - 100 free verifications/month
    private static final String API_KEY = "live_040742b304d8ad9d78e7cd2b8626ddca66dd21f13475eefc5a2a6d37a83cbcdf";
    private static final String API_URL = "https://api.kickbox.com/v2/verify";

    public EmailValidationResult validateEmail(String email) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = API_URL + "?email=" + email + "&apikey=" + API_KEY;

            System.out.println("Validating email: " + email);

            String response = restTemplate.getForObject(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            EmailValidationResult result = new EmailValidationResult();
            result.setEmail(email);

            // Get result: deliverable, undeliverable, risky, unknown
            String status = root.path("result").asText();

            // Get reason
            String reason = root.path("reason").asText();

            // Check if disposable
            boolean isDisposable = root.path("disposable").asBoolean();

            // Get sendex score (0-1, quality score)
            double sendex = root.path("sendex").asDouble();

            // Check if role email (info@, support@, etc.)
            boolean isRole = root.path("role").asBoolean();

            // Get suggestion for typos
            String suggestion = root.path("did_you_mean").asText("");
            if (suggestion != null && !suggestion.isEmpty() && !suggestion.equals("null")) {
                result.setDidYouMean(suggestion);
            }

            // Set validation result
            result.setValid(status.equals("deliverable"));
            result.setReason(status.toUpperCase());
            result.setDisposable(isDisposable);
            result.setQualityScore(sendex);

            System.out.println("Result: " + status + ", Valid: " + result.isValid() + ", Score: " + sendex);
            if (isDisposable) {
                System.out.println("Warning: Disposable email detected");
            }
            if (!suggestion.isEmpty()) {
                System.out.println("Suggestion: " + suggestion);
            }

            return result;

        } catch (HttpClientErrorException e) {
            System.err.println("API Error: " + e.getStatusCode() + " - " + e.getMessage());

            // Allow signup if API fails
            EmailValidationResult result = new EmailValidationResult();
            result.setEmail(email);
            result.setValid(true);
            result.setReason("API_ERROR");
            return result;

        } catch (Exception e) {
            System.err.println("Validation error: " + e.getMessage());

            EmailValidationResult result = new EmailValidationResult();
            result.setEmail(email);
            result.setValid(true);
            result.setReason("API_ERROR");
            return result;
        }
    }
}
