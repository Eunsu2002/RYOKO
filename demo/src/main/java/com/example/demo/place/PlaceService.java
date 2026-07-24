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

    public List<PlaceResponse> getPlaces() {
        return placeRepository.findAll()
                .stream()
                .map(PlaceResponse::from)
                .toList();
    }

}
