package com.example.demo.place;

import org.springframework.data.jpa.domain.Specification;

public class PlaceSpecification {

    // name, style, category

    public static Specification<Place> hasName(String name) {
        return (root, query, cb) ->
                name == null ? null : cb.like(root.get("name"), "%" + name + "%");
    }

    public static Specification<Place> hasStyle(Integer style) {
        return (root, query, cb) ->
                style == null ? null : cb.like(root.get("style"), style);
    }

    public static Specification<Place> hasCategory(String category) {
        return (root, query, cb) ->
                category == null ? null : cb.like(root.get("category"), "%" + category + "%");
    }



}
