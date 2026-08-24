package com.example.demo.repository;


import com.example.demo.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    // Place id FK 사용하여 조회
    List<Review> findByPlaceId(Integer placeId);


}
