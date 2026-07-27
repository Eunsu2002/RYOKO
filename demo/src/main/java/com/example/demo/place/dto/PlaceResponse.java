package com.example.demo.place.dto;

import com.example.demo.place.Place;

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
         Integer reviewCount
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
                place.getReviewCount()
        );
    }

}
