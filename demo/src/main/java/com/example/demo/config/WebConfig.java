package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginCheckInterceptor())
                .addPathPatterns("/mypage.html", "/mypage"); // .html 없애면 이 패턴도 같이
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/travel-list").setViewName("forward:/travel-list.html");
        registry.addViewController("/travel-detail").setViewName("forward:/travel-detail.html");
    }

}