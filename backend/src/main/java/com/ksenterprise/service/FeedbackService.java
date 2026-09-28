package com.ksenterprise.service;

import com.ksenterprise.dto.request.FeedbackRequestDTO;
import com.ksenterprise.model.Feedback;

import java.util.List;

public interface FeedbackService {
    Feedback submitFeedback(FeedbackRequestDTO request);
    List<Feedback> getAllFeedback();
    List<Feedback> getUnreadFeedback();
    void markAsRead(Long feedbackId);
    void deleteFeedback(Long feedbackId);
}
