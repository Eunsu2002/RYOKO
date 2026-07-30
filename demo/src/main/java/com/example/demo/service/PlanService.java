package com.example.demo.service;
import com.example.demo.entity.Plan;
import com.example.demo.repository.PlanRepository;

import com.example.demo.dto.PlanRequest;
import com.example.demo.dto.PlanResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PlanService {

    // TODO: 로그인 연동 전 임시값. Firebase Auth ↔ users.id 매핑이 생기면
    // 로그인 사용자의 실제 id로 교체하세요 (컨트롤러에서 SecurityContext 등으로 주입).
    private static final Long TEMP_USER_ID = 1L;

    private final PlanRepository planRepository;

    public PlanService(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    // 특정 날짜에 시작하는 일정 목록 (달력에서 날짜 클릭 시 호출)
    public List<PlanResponse> getPlansByDate(LocalDate date) {
        LocalDateTime rangeStart = date.atStartOfDay();
        LocalDateTime rangeEnd = date.atTime(LocalTime.MAX);

        return planRepository
                .findByUserIdAndStartDateBetweenOrderByStartDateAsc(TEMP_USER_ID, rangeStart, rangeEnd)
                .stream()
                .map(PlanResponse::from)
                .toList();
    }

    public PlanResponse createPlan(PlanRequest request) {
        Plan plan = new Plan(
                TEMP_USER_ID,
                request.getPName(),
                request.getPlaceId(),
                request.getLocationLat(),
                request.getLocationLng(),
                request.getStartDate(),
                request.getEndDate(),
                request.getMemo());
        return PlanResponse.from(planRepository.save(plan));
    }

    public PlanResponse updatePlan(Integer id, PlanRequest request) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("スケジュールが見つかりません。 id=" + id));

        plan.setPName(request.getPName());
        plan.setPlaceId(request.getPlaceId());
        plan.setLocationLat(request.getLocationLat());
        plan.setLocationLng(request.getLocationLng());
        plan.setStartDate(request.getStartDate());
        plan.setEndDate(request.getEndDate());
        plan.setMemo(request.getMemo());

        return PlanResponse.from(planRepository.save(plan));
    }

    public void deletePlan(Integer id) {
        if (!planRepository.existsById(id)) {
            throw new NoSuchElementException("スケジュールが見つかりません。 id=" + id);
        }
        planRepository.deleteById(id);
    }
}
