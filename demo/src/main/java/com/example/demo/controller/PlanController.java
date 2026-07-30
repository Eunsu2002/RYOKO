package com.example.demo.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.PlanRequest;
import com.example.demo.dto.PlanResponse;
import com.example.demo.service.PlanService;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * schedule의 달력/카드 그리드가 호출하는 API.
 *
 * GET /api/plans?date=2026-07-20 -> 그 날짜에 시작하는 일정 목록 (달력 클릭 시)
 * POST /api/plans -> 일정 생성 (+ 버튼)
 * PUT /api/plans/{id} -> 일정 수정 (✏️ 버튼)
 * DELETE /api/plans/{id} -> 일정 삭제 (✕ 버튼)
 */
@RestController
@RequestMapping("/api/plans")
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @GetMapping
    public List<PlanResponse> getPlans(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate target = (date != null) ? date : LocalDate.now();
        return planService.getPlansByDate(target);
    }

    @PostMapping
    public ResponseEntity<PlanResponse> createPlan(@RequestBody PlanRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planService.createPlan(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanResponse> updatePlan(@PathVariable Integer id, @RequestBody PlanRequest request) {
        return ResponseEntity.ok(planService.updatePlan(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Integer id) {
        planService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<String> handleNotFound(NoSuchElementException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
