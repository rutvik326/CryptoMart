package com.rutvik.Controller;

import com.rutvik.model.User;
import com.rutvik.request.PromptBody;
import com.rutvik.response.ApiResponse;
import com.rutvik.Service.ChatBotService;
import com.rutvik.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat") // Updated path to standard /api convention
public class ChatBotController {

    @Autowired
    private ChatBotService chatBotService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse> chat(
            @RequestBody PromptBody promptBody,
            @RequestHeader("Authorization") String jwt) throws Exception {

        // 1. Identify User
        User user = userService.findUserProfileByJwt(jwt);

        // 2. Chat with Context
        ApiResponse response = chatBotService.getCoinDetails(promptBody.getPrompt(), user);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}