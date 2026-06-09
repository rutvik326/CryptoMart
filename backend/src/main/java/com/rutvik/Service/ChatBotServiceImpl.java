package com.rutvik.Service;

import com.rutvik.model.User;
import com.rutvik.model.Wallet;
import com.rutvik.response.ApiResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class ChatBotServiceImpl implements ChatBotService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Autowired
    private WalletService walletService;

    @Autowired
    private AssetService assetService;

    @Override
    public ApiResponse getCoinDetails(String userPrompt, User user) {

        try {
            // --- 1. GATHER CONTEXT ---
            String walletBalance = "0";
            try {
                Wallet userWallet = walletService.getUserWallet(user);
                if(userWallet != null) walletBalance = String.valueOf(userWallet.getBalance());
            } catch (Exception e) {}

            StringBuilder portfolioStr = new StringBuilder();
            try {
                var userAssets = assetService.getUsersAssets(user.getId());
                if (userAssets != null) {
                    userAssets.forEach(asset ->
                            portfolioStr.append(asset.getCoin().getSymbol().toUpperCase())
                                    .append(": ")
                                    .append(asset.getQuantity())
                                    .append(", ")
                    );
                }
            } catch (Exception e) {}

            // --- 2. BUILD PROMPT ---
            StringBuilder systemPrompt = new StringBuilder();
            systemPrompt.append("You are an AI Crypto Assistant. ");
            systemPrompt.append("User Balance: $").append(walletBalance).append(". ");
            systemPrompt.append("User Portfolio: [").append(portfolioStr).append("]. ");
            systemPrompt.append("Answer this user question concisely: ").append(userPrompt);

            // --- 3. CALL GEMINI API ---
            // *** FINAL FIX: Using 'gemini-1.5-flash' on 'v1beta' endpoint ***
            // This is the specific model ID that works for 99% of keys.
            String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            JSONObject requestBody = new JSONObject();
            JSONArray contentsArray = new JSONArray();
            JSONObject contentObject = new JSONObject();
            JSONArray partsArray = new JSONArray();
            JSONObject partObject = new JSONObject();

            partObject.put("text", systemPrompt.toString());
            partsArray.put(partObject);
            contentObject.put("parts", partsArray);
            contentsArray.put(contentObject);
            requestBody.put("contents", contentsArray);

            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, entity, String.class);

            JSONObject jsonResponse = new JSONObject(response.getBody());

            if (!jsonResponse.has("candidates")) {
                ApiResponse errResp = new ApiResponse();
                errResp.setMessage("AI is busy. Please try again.");
                return errResp;
            }

            String message = jsonResponse.getJSONArray("candidates")
                    .getJSONObject(0)
                    .getJSONObject("content")
                    .getJSONArray("parts")
                    .getJSONObject(0)
                    .getString("text");

            ApiResponse apiResponse = new ApiResponse();
            apiResponse.setMessage(message);
            return apiResponse;

        } catch (HttpClientErrorException e) {
            System.err.println("Gemini API Error Body: " + e.getResponseBodyAsString());
            ApiResponse errResp = new ApiResponse();

            if (e.getStatusCode().value() == 429) {
                errResp.setMessage("Too many requests! Please wait 1 minute.");
            } else if (e.getStatusCode().value() == 404) {
                // If this happens, it's definitively an API Key / Project Setting issue
                errResp.setMessage("Error 404: The AI Model is unavailable for this API Key.");
            } else {
                errResp.setMessage("AI Error: " + e.getStatusCode());
            }
            return errResp;
        } catch (Exception e) {
            e.printStackTrace();
            ApiResponse errResp = new ApiResponse();
            errResp.setMessage("Service Error. Please check backend logs.");
            return errResp;
        }
    }
}