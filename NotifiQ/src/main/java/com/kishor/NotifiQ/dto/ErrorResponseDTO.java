package com.kishor.NotifiQ.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ErrorResponseDTO {
	
	private int status;
	private String error;
	private String message;
	
	@Builder.Default
	private Instant timeStamp = Instant.now();
	
}
