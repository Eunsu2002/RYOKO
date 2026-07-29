package com.example.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.PlaceResponse;
import com.example.demo.entity.Place;
import com.example.demo.repository.PlaceRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlaceService {

    private final PlaceRepository placeRepository;

    // 여행지 조회
    public List<PlaceResponse> getPlaces(String keyword) {
        List<Place> places;
        // 키워드가 null 값이나 공백이라면 모든 항목을 repository에서 조회
        if (keyword == null || keyword.isBlank()) {
            places = placeRepository.findAll();
            // 키워드가 있으면 repository에서 만든 메서드 사용해서 받은 값 공백 제거하고 조회
        } else {
            places = placeRepository.searchByKeyword(keyword.trim());
        }
        // 조건문을 지난 places를 List로 반환
        return places.stream()
                .map(PlaceResponse::from)
                .toList();

    }

    // 여행지 단건 조회
    public PlaceResponse getPlace(int id) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("存在しない旅行先です。 id=" + id));
        return PlaceResponse.from(place);
    }

    // 지역·카테고리·스타일 필터
    // 평점·리뷰 수 정렬
    // 페이지네이션
    // 대표 사진 조회

}
