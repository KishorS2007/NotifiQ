package com.kishor.NotifiQ.dto;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor	
public class RegisterRequestDTO {
	@NotBlank
	@Length(min = 6)
	@Column(unique = true)
	private String userName;
	
	@NotBlank
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
