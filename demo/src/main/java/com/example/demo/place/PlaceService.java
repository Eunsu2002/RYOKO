package com.example.demo.place;


import com.example.demo.place.dto.PlaceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlaceService {

    private final PlaceRepository placeRepository;

    // 여행지 전체 조회
    public List<PlaceResponse> getPlaces() {
        return placeRepository.findAll()
                .stream()
                .map(PlaceResponse::from)
                .toList();
    }

//    키워드 검색
    public

//    지역·카테고리·스타일 필터
//    평점·리뷰 수 정렬
//    페이징
//    대표 사진 조회

}
