package com.example.demo.plan;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PlanRepository extends JpaRepository<Plan, Integer> {

    // 특정 유저의, 특정 날짜(하루) 범위 안에 시작하는 일정 목록을 시간순으로 조회
    List<Plan> findByUserIdAndStartDateBetweenOrderByStartDateAsc(
            Long userId, LocalDateTime rangeStart, LocalDateTime rangeEnd);
}
