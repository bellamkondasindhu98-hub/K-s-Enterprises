package com.ksenterprise.service.impl;

import com.ksenterprise.dto.request.FeedbackRequestDTO;
import com.ksenterprise.exception.ResourceNotFoundException;
import com.ksenterprise.model.Feedback;
import com.ksenterprise.repository.FeedbackRepository;
import com.ksenterprise.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;

    @Override
    @Transactional
    public Feedback submitFeedback(FeedbackRequestDTO request) {
        Feedback feedback = Feedback.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .phone(request.getPhone())
                .message(request.getMessage())
                .read(false)
                .build();
        return feedbackRepository.save(feedback);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Feedback> getUnreadFeedback() {
        return feedbackRepository.findByReadFalseOrderByCreatedAtDesc();
    }

    @Override
    @Transactional
    public void markAsRead(Long feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback", "id", feedbackId));
        feedback.setRead(true);
        feedbackRepository.save(feedback);
    }

    @Override
    @Transactional
    public void deleteFeedback(Long feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback", "id", feedbackId));
        feedbackRepository.delete(feedback);
    }
}
