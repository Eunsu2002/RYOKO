package com.example.demo.service;

import com.example.demo.DAO.ReviewDao;
import com.example.demo.DAO.TravelDao;
import com.example.demo.entity.Review;
import com.example.demo.entity.Travel;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TravelService {

    private static final long TEMP_USER_ID = 1L;

    private final TravelDao travelDao = new TravelDao();
    private final ReviewDao reviewDao = new ReviewDao();

    public List<Travel> getTravels(String keyword) throws SQLException {
        if (keyword == null || keyword.isBlank()) {
            return travelDao.findAll();
        }
        return travelDao.findByKeyword(keyword);
    }

    public Map<String, Object> getTravelDetail(int id) throws SQLException {
        Travel travel = travelDao.findById(id);
        if (travel == null) {
            return null;
        }

        List<Review> reviews = reviewDao.findByTravelId(id);

        Map<String, Object> result = new HashMap<>();
        result.put("id", travel.getId());
        result.put("name", travel.getName());
        result.put("location", travel.getLocation());
        result.put("description", travel.getDescription());
        result.put("imageUrl", travel.getImageUrl());
        result.put("operatingHours", travel.getOperatingHours());
        result.put("recommendedSchedule", travel.getRecommendedSchedule());
        result.put("averageRating", travel.getRating());
        result.put("reviewCount", travel.getReviewCount());
        result.put("reviews", reviews);
        return result;
    }

    public Review addReview(int travelId, String userName, int rating, String content)
            throws SQLException {
        Travel travel = travelDao.findById(travelId);
        if (travel == null) {
            throw new IllegalArgumentException("여행지를 찾을 수 없습니다. id=" + travelId);
        }

        Review review = new Review();
        review.setTravelId(travelId);
        review.setUserId(TEMP_USER_ID);
        review.setUserName(userName);
        review.setRating(rating);
        review.setContent(content);

        return reviewDao.insert(review);
    }
}
