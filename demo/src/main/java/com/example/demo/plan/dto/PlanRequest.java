package com.example.demo.plan.dto;

import java.time.LocalDateTime;

/**
 * 일정 생성(POST) / 수정(PUT) 시 프론트에서 보내는 요청 바디.
 * schedule.html의 카드 하나(제목/장소/시작~종료 시간/메모)에 대응합니다.
 */
public class PlanRequest {

    private String pName; // 일정 제목 (예: 韓国博物館)
    private Integer placeId; // place 테이블 FK, 없으면 null
    private Float locationLat;
    private Float locationLng;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String memo; // 설명 (s-card-sub에 해당)

    public String getPName() {
        return pName;
    }

    public void setPName(String pName) {
        this.pName = pName;
    }

    public Integer getPlaceId() {
        return placeId;
    }

    public void setPlaceId(Integer placeId) {
        this.placeId = placeId;
    }

    public Float getLocationLat() {
        return locationLat;
    }

    public void setLocationLat(Float locationLat) {
        this.locationLat = locationLat;
    }

    public Float getLocationLng() {
        return locationLng;
    }

    public void setLocationLng(Float locationLng) {
        this.locationLng = locationLng;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }
}
