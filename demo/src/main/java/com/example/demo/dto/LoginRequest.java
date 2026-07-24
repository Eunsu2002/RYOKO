package com.example.demo.dto;

public class LoginRequest {

    private String email;
    private String password;

    public LoginRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    private boolean keepLoggedIn;

    public boolean isKeepLoggedIn() {
        return keepLoggedIn;
    }

    public void setKeepLoggedIn(boolean keepLoggedIn) {
        this.keepLoggedIn = keepLoggedIn;
    }
    
}