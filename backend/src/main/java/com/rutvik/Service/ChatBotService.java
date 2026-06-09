package com.rutvik.Service;

import com.rutvik.model.User;
import com.rutvik.response.ApiResponse;

public interface ChatBotService {
    ApiResponse getCoinDetails(String prompt, User user) throws Exception;
}