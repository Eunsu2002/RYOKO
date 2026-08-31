package com.example.demo.service;

import com.example.demo.dto.ReviewRequest;
import com.example.demo.dto.ReviewResponse;
import com.example.demo.entity.Place;
import com.example.demo.entity.Review;
import com.example.demo.entity.User;
import com.example.demo.repository.PlaceRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

        private final ReviewRepository reviewRepository;
        private final UserRepository userRepository;
        private final PlaceRepository placeRepository;

        // 리뷰 조회 서비스
        public List<ReviewResponse> getReviews(Integer placeId) {
                List<Review> reviews = reviewRepository.findByPlaceId(placeId);
                return reviews.stream().map(ReviewResponse::from).toList();
        }

        // 리뷰 저장 서비스 (세션 로그인 사용자)
        @Transactional
        public void createReviews(Integer placeId, Long userId, ReviewRequest reviewRequest) {
                Review review = new Review();
                review.setPlaceId(placeId);
                review.setUser(userRepository.getReferenceById(userId)); // 세션 사용자
                review.setStar(reviewRequest.star());
                review.setBody(reviewRequest.body());

                reviewRepository.save(review);
                updatePlaceRating(placeId);
        }

        // 리뷰 작성 시 reviewCount와 avgStar 업데이트
        private void updatePlaceRating(int placeId) {
                List<Review> reviews = reviewRepository.findByPlaceId(placeId);

                // 별점 평균 계산
                double avgStar = reviews.stream()
                                .mapToDouble(Review::getStar)
                                .average()
                                .orElse(0.0);

                // 여행지 조회
                Place place = placeRepository.findById(placeId)
                                .orElseThrow(() -> new RuntimeException("여행지를 조회하지 못했습니다."));

                place.setAvgStar((float) avgStar);
                place.setReviewCount(reviews.size());
                placeRepository.save(place);
        }

}
