package com.kishor.NotifiQ.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class WebConfig implements WebMvcConfigurer{
	@Value("${frontend.url}")
	private String frontendUrl;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
				.allowedOriginPatterns("http://localhost:5500", "http://127.0.0.1:5500", "https://*.vercel.app", frontendUrl)
				.allowedMethods("*");
	}
}
