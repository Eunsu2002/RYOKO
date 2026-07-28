package com.example.demo.place;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Integer> {


    @Query(value = """
        SELECT p.* FROM place p
        WHERE ( lower(p.p_name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR lower(p.address) LIKE LOWER(CONCAT('%', :keyword, '%')) 
        OR lower(p.category) LIKE LOWER(CONCAT('%', :keyword, '%')) )
        AND (:style IS NULL OR (p.style & :style) > 0)
    """,
            countQuery = """
        SELECT COUNT(*) FROM place p
        WHERE ( lower(p.p_name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR lower(p.address) LIKE LOWER(CONCAT('%', :keyword, '%')) 
        OR lower(p.category) LIKE LOWER(CONCAT('%', :keyword, '%')) )
        AND (:style IS NULL OR (p.style & :style) > 0)
    """,
            nativeQuery = true)
    Page<Place> search (@Param("keyword") String keyword,
                        @Param("style") Integer style,
                        Pageable pageable);






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
