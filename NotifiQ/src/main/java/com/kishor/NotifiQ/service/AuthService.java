package com.kishor.NotifiQ.service;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.kishor.NotifiQ.config.JWTService;
import com.kishor.NotifiQ.dto.LoginRequestDTO;
import com.kishor.NotifiQ.dto.LoginResponse;
import com.kishor.NotifiQ.dto.RegisterRequestDTO;
import com.kishor.NotifiQ.dto.RegisterResponse;
import com.kishor.NotifiQ.entity.UserEntity;
import com.kishor.NotifiQ.exception.InvalidCredentialsException;
import com.kishor.NotifiQ.exception.UserAlreadyExistsException;
import com.kishor.NotifiQ.repository.UserRepository;

@Service
public class AuthService {
	@Autowired
	private BCryptPasswordEncoder encoder;
	
	@Autowired
	private  UserRepository userRepo;
	
	@Autowired
	private JWTService service;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	 private static final String DUMMY_HASH = "$2a$10$ExX2MvPksRmdgJ7K4jM1O.CqK3G/gWRE6zFdfgq3fB6kCg.C2W9ma";
	
	public RegisterResponse register(RegisterRequestDTO request) {

		boolean emailAlreadyExists = userRepo.existsByEmail(request.getEmail());

		if(emailAlreadyExists) {
			throw new UserAlreadyExistsException("Email already Exists");
		}
		
		String hashedPassword = encoder.encode(request.getPassword());

		UserEntity user = UserEntity.builder()
							.fullName(request.getUserName())
							.email(request.getEmail())
							.password(hashedPassword)
							.build();
								
		userRepo.save(user);
		Map<String,Object> extraClaims = Map.of("username",user.getFullName());
		String token = service.generateToken(extraClaims,user);
		RegisterResponse registerResponse = new RegisterResponse(token);
		
		return registerResponse;
	}
	
	public LoginResponse login(LoginRequestDTO request) {
		System.out.println(request.getEmail()+" "+request.getPassword());
		Optional<UserEntity> user = userRepo.findByEmail(request.getEmail()); // user doesn't exists
		
		String dbpassword = user.isPresent() ? user.get().getPassword() : DUMMY_HASH;
		boolean isPasswordMatch = encoder.matches(request.getPassword(), dbpassword);
		
		
		if(user.isEmpty() || !isPasswordMatch) {
			throw new InvalidCredentialsException("Invalid Username or password");
		}
		
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
				user.get().getEmail(),
				request.getPassword()
//				,
//				user.get().getAuthorities()
		));
		
		Map<String,Object> extraClaims = Map.of("username",user.get().getFullName());
		String token = service.generateToken(extraClaims,user.get());
		LoginResponse loginResponse = new LoginResponse(token);
		
		return loginResponse;
	}
	
	public UserEntity getCurrentUser() {
		return (UserEntity) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}
}
