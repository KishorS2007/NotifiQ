package com.kishor.NotifiQ.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kishor.NotifiQ.dto.LoginRequestDTO;
import com.kishor.NotifiQ.dto.LoginResponse;
import com.kishor.NotifiQ.dto.RegisterRequestDTO;
import com.kishor.NotifiQ.dto.RegisterResponse;
import com.kishor.NotifiQ.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	private AuthService authService;
	
	@PostMapping("/register")
	public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequestDTO request) {
		RegisterResponse response = authService.register(request);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
	
	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequestDTO request) {

		LoginResponse response =  authService.login(request);
		
		return ResponseEntity.ok(response);
	}
}
