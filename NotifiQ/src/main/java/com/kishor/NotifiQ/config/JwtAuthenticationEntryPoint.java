package com.kishor.NotifiQ.config;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.kishor.NotifiQ.dto.ErrorResponseDTO;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint{

	// to show error message when user tries to access protected resource without login
	
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException, ServletException {
		
		HttpStatus status = HttpStatus.UNAUTHORIZED;
		
		ErrorResponseDTO errorResponse = ErrorResponseDTO.builder()
					.status(status.value())
					.error(status.getReasonPhrase())
					.message(authException.getMessage())
					.build();
		
		response.setStatus(status.value());
		response.setContentType("application/json");
		
		new ObjectMapper().writeValue(response.getOutputStream(), errorResponse);
	}

}
