package com.example.demo.dto;

import com.example.demo.entity.Review;

import java.time.LocalDateTime;

public record ReviewResponse(
        int id,
        String username,
        double star,
        String body,
        LocalDateTime createdAt
) {
    public static ReviewResponse from(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getUser().getUsername(),
                review.getStar(),
                review.getBody(),
                review.getCreatedAt()
        );
    }

}
