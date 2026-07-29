package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public User login(String email, String password) {
        Optional<User> found = userRepository.findByEmail(email);

        if (found.isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 이메일입니다.");
        }

        User user = found.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return user;
    }
    public void resetPassword(String email, String newPassword) {
        if (newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException("새 비밀번호를 입력해주세요.");
        }

        Optional<User> found = userRepository.findByEmail(email);

        if (found.isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 이메일입니다.");
        }

        User user = found.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    public void signup(String name, String phone, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        User user = new User();
        user.setUsername(name);
        user.setPhoneNum(phone);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        userRepository.save(user);
    }
    public void withdrawUser(Long userId) {
        User user = userRepository.findById(userId)
        // 예외 처리 (해당 회원 정보가 없는 경우) ex) 로그인한 뒤 관리자가 해당 회원을 삭제한 경우, 버그로 세션은 남아 있는데 DB에는 회원이 없는 경우
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        userRepository.delete(user);
    }
}