package com.kishor.NotifiQ.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class LoginRequestDTO {

	@Email
	@Column(unique = true)
	private String email;
	
	@Pattern(
	    regexp = "^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$",
	    message = "Password must be at least 8 characters and contain a digit,"
	    			+ "an uppercase letter, and a special character"
	)
	private String password;

	
	
}
