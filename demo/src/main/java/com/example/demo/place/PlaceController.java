package com.example.demo.place;

import com.example.demo.place.dto.PlaceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    // 검색기능 서비스 연결
    @GetMapping
    public Page<PlaceResponse> getPlaces(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer style,
            @RequestParam(defaultValue = "REVIEW_COUNT_DESC") SortOption sort,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "6") Integer size
            ) {
        return placeService.getPlaces(keyword, style, sort, page, size);
    }

    // 각 여행 세부 페이지 연결
    @GetMapping("/{id}")
    public PlaceResponse getPlace(@PathVariable Integer id) {
        // service에서 request 받은 id를 넣어서 받은 값을 JSON으로 넘김
        return placeService.getPlaceDetail(id);
    }

}
