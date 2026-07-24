package com.example.demo.place;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PlaceRepository
        extends JpaRepository<Place, Integer>,
                JpaSpecificationExecutor<Place> {

}
