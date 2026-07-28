package com.example.demo.controller;

import com.example.demo.dto.MypageUserResponse;
import com.example.demo.service.MypageService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mypage")
public class MypageController {

    // AuthController와 동일한 세션 키 사용 (session.setAttribute("userId", ...))
    private static final String SESSION_USER_ID_KEY = "userId";

    private final MypageService mypageService;

    @Autowired
    public MypageController(MypageService mypageService) {
        this.mypageService = mypageService;
    }

    // 마이페이지 진입 시 현재 로그인한 유저의 id, 닉네임, 프로필 이미지를 내려줌
    @GetMapping("/user")
    public ResponseEntity<?> getMypageUser(HttpSession session) {
        Object rawUserId = session.getAttribute(SESSION_USER_ID_KEY);

        if (rawUserId == null) {
            return ResponseEntity.status(401).body("로그인 상태가 아닙니다.");
        }

        Long userId = (Long) rawUserId;
        MypageUserResponse userInfo = mypageService.getMypageUserInfo(userId);
        return ResponseEntity.ok(userInfo);
    }
}