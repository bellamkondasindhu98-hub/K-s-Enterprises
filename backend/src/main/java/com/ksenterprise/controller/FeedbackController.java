package com.ksenterprise.controller;

import com.ksenterprise.dto.ApiResponse;
import com.ksenterprise.dto.request.FeedbackRequestDTO;
import com.ksenterprise.model.Feedback;
import com.ksenterprise.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> submitFeedback(@Valid @RequestBody FeedbackRequestDTO request) {
        feedbackService.submitFeedback(request);
        return ResponseEntity.ok(ApiResponse.success("Thank you for your feedback! Our team will get back to you shortly.", null));
    }
}
