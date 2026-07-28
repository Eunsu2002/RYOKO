package com.example.demo.dto;

// 마이페이지 진입 시 프론트로 내려줄 유저 정보 (비밀번호는 제외하고 필요한 필드만)
public class MypageUserResponse {

    private final Long id;
    private final String username;
    private final String profileImg;

    public MypageUserResponse(Long id, String username, String profileImg) {
        this.id = id;
        this.username = username;
        this.profileImg = profileImg;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getProfileImg() {
        return profileImg;
    }
}