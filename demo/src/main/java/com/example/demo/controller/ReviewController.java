package com.example.demo.controller;

import com.example.demo.dto.ReviewRequest;
import com.example.demo.dto.ReviewResponse;
import com.example.demo.service.ReviewService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/places/{placeId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    // 그 여행지의 리뷰 목록 조회
    @GetMapping
    public List<ReviewResponse> getReviews(@PathVariable int placeId) {
        return reviewService.getReviews(placeId);
    }

    // 리뷰 생성 — 세션 로그인 필수
    @PostMapping
    public ResponseEntity<Void> createReviews(
            @PathVariable int placeId,
            @RequestBody ReviewRequest request,
            HttpSession session) {
        Object userId = session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).build(); // 로그인 필요
        }
        reviewService.createReviews(placeId, ((Number) userId).longValue(), request);
        return ResponseEntity.status(201).build();
    }
}