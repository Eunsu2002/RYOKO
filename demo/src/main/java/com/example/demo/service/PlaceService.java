package com.example.demo.service;

import com.example.demo.dto.PlaceResponse;
import com.example.demo.dto.SortOption;
import com.example.demo.entity.Place;
import com.example.demo.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlaceService {

    private final PlaceRepository placeRepository;

    // 여행지 검색
    public Page<PlaceResponse> getPlaces(String keyword, Integer style, SortOption sort, int page, int size) {
        // 키워드 공백 제거
        String trimmedKeyword = (keyword == null || keyword.isBlank() ? null : keyword.trim());
        // 스타일 선택
        Integer chooseStyle = (style == null || style == 0 ? null : style);

        Sort sortObj = switch (sort) {
            case STAR_DESC -> Sort.by(Sort.Direction.DESC, "avg_star");
            case REVIEW_COUNT_DESC ->  Sort.by(Sort.Direction.DESC, "review_count");
        };

        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<Place> places = placeRepository.search(trimmedKeyword, chooseStyle, pageable);
        // 키워드와 선택한 스타일로 where절 조건문을 거친 places를 List로 반환
        return places.map(PlaceResponse::from);
    }
//    대표 사진 조회

    // 여행지 세부 페이지 내용 담기
    public PlaceResponse getPlaceDetail(Integer id) {
        Place place = placeRepository.findById(id)
                .orElseThrow();
        // 나중에 custom Exception 만들어서 넣기

        return PlaceResponse.from(place);
    }

}
