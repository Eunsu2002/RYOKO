package com.example.demo.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

public class LoginCheckInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        Object userId = request.getSession(false) != null
                ? request.getSession(false).getAttribute("userId")
                : null;
        if (userId == null) {
            response.sendRedirect("/logIn");
            return false;
        }
        return true;
    }
}