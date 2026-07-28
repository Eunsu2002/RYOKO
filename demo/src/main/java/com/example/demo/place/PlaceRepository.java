package com.example.demo.place;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Integer>,
                                         JpaSpecificationExecutor<Place> {

    // 키워드로 검색하는 기능 + 스타일 비트플래그 받기
    @Query(value = """
        SELECT p.* FROM place p
        WHERE ( lower(p.p_name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR lower(p.address) LIKE LOWER(CONCAT('%', :keyword, '%')) 
        OR lower(p.category) LIKE LOWER(CONCAT('%', :keyword, '%')) )
        AND (:style IS NULL OR (p.style & :style) > 0)
        ORDER BY p.avg_star DESC
    """, nativeQuery = true)
    List<Place> searchOrderByStar (@Param("keyword") String keyword, @Param("style") Integer style);

    // 키워드로 검색하는 기능 + 스타일 비트플래그 받기
    @Query(value = """
        SELECT p.* FROM place p
        WHERE ( lower(p.p_name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR lower(p.address) LIKE LOWER(CONCAT('%', :keyword, '%')) 
        OR lower(p.category) LIKE LOWER(CONCAT('%', :keyword, '%')) )
        AND (:style IS NULL OR (p.style & :style) > 0)
        ORDER BY p.review_count DESC
    """, nativeQuery = true)
    List<Place> searchOrderByReviewCount (@Param("keyword") String keyword, @Param("style") Integer style);




//    키워드로 필터 기능
//    @Query("""
//        SELECT p FROM Place p
//        WHERE (:name IS NULL OR p.pName LIKE CONCAT('%', :name, '%'))
//        AND (:style IS NULL OR p.address = :address)
//        AND (:category IS NULL OR p.category = :category)
//        """)
//    List<Place> filterByKeyword (@Param("name") String name,
//                                 @Param("address") String address,
//                                 @Param("category") String category);

}
