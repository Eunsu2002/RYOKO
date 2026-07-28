package com.example.demo.place;


import com.example.demo.place.dto.PlaceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.example.demo.place.SortOption.STAR_DESC;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlaceService {

    private final PlaceRepository placeRepository;

    // 여행지 검색
    public List<PlaceResponse> getPlaces(String keyword, Integer style, SortOption sort) {
        // 키워드 공백 제거
        String trimmedKeyword = (keyword == null || keyword.isBlank() ? null : keyword.trim());
        // 스타일 선택
        Integer chooseStyle = (style == null || style == 0 ? null : style);
        // repository 조건에 맞춰 db 조회
        List<Place> places = switch (sort) {
            case STAR_DESC -> placeRepository.searchOrderByStar(trimmedKeyword, chooseStyle);
            case REVIEW_COUNT_DESC ->  placeRepository.searchOrderByReviewCount(trimmedKeyword, chooseStyle);
        };

        // 키워드와 선택한 스타일로 where절 조건문을 거친 places를 List로 반환
        return places.stream()
                .map(PlaceResponse::from)
                .toList();
    }

//    지역·카테고리·스타일 필터
//    평점·리뷰 수 정렬
//    페이지네이션
//    대표 사진 조회

}
