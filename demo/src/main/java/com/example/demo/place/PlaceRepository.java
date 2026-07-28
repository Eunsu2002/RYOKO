package com.example.demo.place;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Integer>,
                                         JpaSpecificationExecutor<Place> {

    // 키워드로 검색하는 기능 -- 지역 이름 및 카테고리
    @Query("""
        SELECT p FROM Place p
        WHERE lower(p.pName) like lower(concat('%', :keyword, '%'))
        or lower(p.address) like lower(concat('%', :keyword, '%')) 
        or lower(p.category) like lower(concat('%', :keyword, '%')) 
    """)
    List<Place> searchByKeyword (@Param("keyword") String keyword);

    // 키워드로 필터 기능
    @Query("""
        SELECT p FROM Place p
        WHERE (:name IS NULL OR p.pName LIKE CONCAT('%', :name, '%'))
        AND (:style IS NULL OR p.address = :address)
        AND (:category IS NULL OR p.category = :category)
        """)
    List<Place> filterByKeyword (@Param("name") String name,
                                 @Param("address") String address,
                                 @Param("category") String category);

}
