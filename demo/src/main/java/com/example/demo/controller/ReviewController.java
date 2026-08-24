package com.example.demo.controller;

import com.example.demo.dto.ReviewRequest;
import com.example.demo.dto.ReviewResponse;
import com.example.demo.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/places/{placeId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    // api로 get 하면 그 여행지에 맞는 리뷰 주기
    @GetMapping
    public List<ReviewResponse> getReviews(@PathVariable int placeId) {
        return reviewService.getReviews(placeId);
    }

    // api로 post 보내면 리뷰 생성 및 저장
    @PostMapping
    public void createReviews(
            @PathVariable int placeId,
            @RequestBody ReviewRequest request
            ) {
        reviewService.createReviews(placeId, request);
    }

}
