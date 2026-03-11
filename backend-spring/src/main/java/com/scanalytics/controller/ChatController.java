package com.scanalytics.controller;

import com.scanalytics.dto.request.ChatRequest;
import com.scanalytics.dto.request.FrontendMessage;
import com.scanalytics.dto.request.TextPart;
import com.scanalytics.dto.response.ChatResponse;
import com.scanalytics.service.AiEngineService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Mirrors Python: POST /api/chat-analyst endpoint in main.py
 * No authentication required.
 */
@RestController
@RequestMapping("/api")
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private AiEngineService aiEngineService;

    @PostMapping("/chat-analyst")
    public ResponseEntity<?> chatAnalyst(@RequestBody ChatRequest request) {
        try {
            // Debug print (mirrors Python)
            log.info("\n" + "=".repeat(50));
            log.info("INCOMING CHAT: {} messages", request.getMessages().size());
            log.info("=".repeat(50));

            // Clean history: convert frontend message format to plain {role, content}
            // Mirrors Python: clean_history logic in main.py
            List<Map<String, String>> cleanHistory = new ArrayList<>();
            for (FrontendMessage msg : request.getMessages()) {
                String fullText = msg.getParts().stream()
                        .filter(p -> "text".equals(p.getType()))
                        .map(TextPart::getText)
                        .collect(Collectors.joining());

                String role = "model".equals(msg.getRole()) ? "assistant" : msg.getRole();

                Map<String, String> entry = new HashMap<>();
                entry.put("role", role);
                entry.put("content", fullText);
                cleanHistory.add(entry);
            }

            ChatResponse response = aiEngineService.chatWithAnalyst(cleanHistory);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Chat Error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("detail", e.getMessage()));
        }
    }
}
