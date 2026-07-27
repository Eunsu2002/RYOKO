package com.example.demo.place.dto;

import com.example.demo.place.Place;

import java.time.LocalDateTime;

public record PlaceResponse(
         int id,
         String pName,
         String body,
         Integer style,
         String category,
         String address,
         Float pLocationLat,
         Float pLocationLng,
         Float avgStar,
         Integer reviewCount,
         String operatingHours,
         String recommendedSchedule,
         LocalDateTime createdAt,
         LocalDateTime updatedAt
) {
    public static PlaceResponse from(Place place) {
        return new PlaceResponse(
                place.getId(),
                place.getPName(),
                place.getBody(),
                place.getStyle(),
                place.getCategory(),
                place.getAddress(),
                place.getPLocationLat(),
                place.getPLocationLng(),
                place.getAvgStar(),
                place.getReviewCount(),
                place.getOperatingHours(),
                place.getRecommendedSchedule(),
                place.getCreatedAt(),
                place.getUpdatedAt()
        );
    }

}
