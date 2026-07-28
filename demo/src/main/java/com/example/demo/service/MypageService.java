package com.example.demo.service;

import com.example.demo.dto.MypageUserResponse;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MypageService {

    private final UserRepository userRepository;

    @Autowired
    public MypageService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 세션에 저장된 userId로 최신 유저 정보를 DB에서 조회해서 응답용 DTO로 변환
    public MypageUserResponse getMypageUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        return new MypageUserResponse(
                user.getId(),
                user.getUsername(),
                user.getProfileImg()
        );
    }
}