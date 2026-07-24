package com.example.demo.repository;


import com.example.demo.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PlaceRepository
        extends JpaRepository<Place, Integer>,
                JpaSpecificationExecutor<Place> {

}
