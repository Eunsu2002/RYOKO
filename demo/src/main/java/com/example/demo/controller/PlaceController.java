package com.example.demo.controller;
import com.example.demo.service.PlaceService;

import com.example.demo.dto.PlaceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    // 검색기능 서비스 연결
    @GetMapping
    public List<PlaceResponse> getPlaces(
            @RequestParam(required = false) String keyword
    ) {
        return placeService.getPlaces(keyword);
    }

}
