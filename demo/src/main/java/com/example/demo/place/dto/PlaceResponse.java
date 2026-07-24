package com.example.demo.place.dto;


import com.example.demo.place.Place;
import jakarta.persistence.Column;

import java.time.LocalDateTime;

public record PlaceResponse(
         int id,
         String pName,
         String body,
         String style,
         String category,
         Float pLocationLat,
         Float pLocationLng,
         Float avgStar,
         Integer reviewCount
) {
    public static PlaceResponse from(Place place) {
        return new PlaceResponse(
                place.getId(),
                place.getPName(),
                place.getBody(),
                place.getStyle(),
                place.getCategory(),
                place.getPLocationLat(),
                place.getPLocationLng(),
                place.getAvgStar(),
                place.getReviewCount()
        );
    }

}
