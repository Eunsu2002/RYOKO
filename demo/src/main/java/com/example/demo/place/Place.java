package com.example.demo.place;

import jakarta.persistence.*;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "place")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "p_name", nullable = false)
    private String pName;

    @Column(name = "body")
    private String body;

    @Column(name = "style")
    private String style;

    @Column(name = "category")
    private String category;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "p_location_lat", nullable = false)
    private Float pLocationLat;

    @Column(name = "p_location_lng", nullable = false)
    private Float pLocationLng;

    @Column(name = "avg_star")
    private Float avgStar;

    @Column(name = "review_count")
    private Integer reviewCount;

    @Column(name = "operating_hours")
    private String operatingHours;

    @Column(name = "recommended_schedule")
    private String recommendedSchedule;
    
    @Column(name = "created_at", insertable = false, updatable = false )
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}


