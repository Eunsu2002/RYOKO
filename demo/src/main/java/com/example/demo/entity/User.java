package com.example.demo.entity;

// JPA 관련 import (DB 테이블과 연결하기 위해 필요)
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// "이 클래스는 DB 테이블과 연결된 클래스야" 라는 표시
@Entity
// "연결할 테이블 이름은 users야" 라는 표시
@Table(name = "users")
public class User {

    // ============================
    // 변수 선언 (= DB 컬럼과 1:1 매칭)
    // ============================

    // "이게 PRIMARY KEY야" 라는 표시
    @Id
    // "AUTO_INCREMENT야 (자동 증가)" 라는 표시
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                // 회원 고유번호

    @Column(unique = true, nullable = false)  // 중복 불가, 필수 입력
    private String username;        // 로그인 아이디

    @Column(unique = true, nullable = false)
    private String email;           // 이메일

    @Column(nullable = false)       // 필수 입력
    private String password;        // 비밀번호

    @Column(name = "phone_num")     // DB 컬럼 이름이 phone_num 이라서 지정
    private String phoneNum;        // 전화번호

    @Column(name = "profile_img")
    private String profileImg;      // 프로필 이미지

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;   // 가입일

    @Column(name = "updated_at")
    private java.sql.Timestamp updatedAt;   // 수정일


    // ============================
    // 기본 생성자 (JPA가 필수로 요구함)
    // ============================
    public User() {
    }


    // ============================
    // Getter — 변수 값을 꺼내는 메서드
    // 예: user.getUsername() → "kim_travel"
    // ============================

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public String getProfileImg() {
        return profileImg;
    }

    public java.sql.Timestamp getCreatedAt() {
        return createdAt;
    }

    public java.sql.Timestamp getUpdatedAt() {
        return updatedAt;
    }


    // ============================
    // Setter — 변수 값을 넣는 메서드
    // 예: user.setUsername("kim_travel")
    // ============================

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public void setProfileImg(String profileImg) {
        this.profileImg = profileImg;
    }

    public void setCreatedAt(java.sql.Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(java.sql.Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}