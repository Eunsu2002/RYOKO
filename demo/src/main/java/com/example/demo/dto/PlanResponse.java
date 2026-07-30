package com.example.demo.dto;

import com.example.demo.entity.Plan;

import java.time.LocalDateTime;

public class PlanResponse {

    private Integer id;
    private Long userId;
    private String pName;
    private Integer placeId;
    private Float locationLat;
    private Float locationLng;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String memo;

    public static PlanResponse from(Plan plan) {
        PlanResponse res = new PlanResponse();
        res.id = plan.getId();
        res.userId = plan.getUserId();
        res.pName = plan.getPName();
        res.placeId = plan.getPlaceId();
        res.locationLat = plan.getLocationLat();
        res.locationLng = plan.getLocationLng();
        res.startDate = plan.getStartDate();
        res.endDate = plan.getEndDate();
        res.memo = plan.getMemo();
        return res;
    }

    public Integer getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getPName() {
        return pName;
    }

    public Integer getPlaceId() {
        return placeId;
    }

    public Float getLocationLat() {
        return locationLat;
    }

    public Float getLocationLng() {
        return locationLng;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public String getMemo() {
        return memo;
    }
}
