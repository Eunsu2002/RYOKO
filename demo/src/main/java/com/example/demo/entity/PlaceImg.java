package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "place_img")
public class PlaceImg {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "place_id")
    private int placeId;

    @Column(name = "img_url")
    private String imgUrl;

    @Column(name = "sort_order")
    private int sortOrder;

}
