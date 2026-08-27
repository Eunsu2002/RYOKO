package com.example.demo.repository;

import com.example.demo.entity.PlaceImg;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlaceImgRepository extends JpaRepository<PlaceImg, Integer> {

    // 대표 사진 하나 찾기
    Optional<PlaceImg> findFirstByPlaceIdOrderBySortOrderAsc(Integer placeId);

}
