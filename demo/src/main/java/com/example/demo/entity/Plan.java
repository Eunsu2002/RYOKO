package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

/**
 * ryokoso.sql 의 `plan` 테이블과 1:1로 매핑되는 엔티티.
 * schedule.html의 "일정 카드" 하나가 row 하나에 해당합니다.
 */
@Entity
@Table(name = "plan")
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // TODO: 현재는 로그인 연동 전이라 PlanService에서 임시 고정값(1L)을 넣고 있습니다.
    // Firebase Auth ↔ users.id 매핑이 생기면 실제 로그인 사용자 id로 교체하세요.
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "p_name")
    private String pName;

    @Column(name = "place_id")
    private Integer placeId;

    @Column(name = "p_location_lat")
    private Float locationLat;

    // ryokoso.sql 원본 컬럼명이 p_location_lang (오타로 보이지만 그대로 매핑)
    @Column(name = "p_location_lang")
    private Float locationLng;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "memo")
    private String memo;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    protected Plan() {
        // JPA 기본 생성자
    }

    public Plan(Long userId, String pName, Integer placeId, Float locationLat, Float locationLng,
            LocalDateTime startDate, LocalDateTime endDate, String memo) {
        this.userId = userId;
        this.pName = pName;
        this.placeId = placeId;
        this.locationLat = locationLat;
        this.locationLng = locationLng;
        this.startDate = startDate;
        this.endDate = endDate;
        this.memo = memo;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
