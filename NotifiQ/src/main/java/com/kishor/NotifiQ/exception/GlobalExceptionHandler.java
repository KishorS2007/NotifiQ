package com.kishor.NotifiQ.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.kishor.NotifiQ.dto.ErrorResponseDTO;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(UserAlreadyExistsException.class)
	public ResponseEntity<ErrorResponseDTO> handleUserAlreadyExistsException(UserAlreadyExistsException ex){
				
		HttpStatus status = HttpStatus.CONFLICT;
		ErrorResponseDTO errorBody = ErrorResponseDTO.builder()
										.status(status.value())
										.error(status.getReasonPhrase())
										.message(ex.getMessage())
										.build();
		return new ResponseEntity<>(errorBody , status);
	}
	
	@ExceptionHandler(InvalidCredentialsException.class)
	public ResponseEntity<ErrorResponseDTO> handleInvalidCredentialsExecption(InvalidCredentialsException ex){
		
		HttpStatus status = HttpStatus.UNAUTHORIZED;
		ErrorResponseDTO errorBody = ErrorResponseDTO.builder()
										.status(status.value())
										.error(status.getReasonPhrase())
										.message(ex.getMessage())
										.build();
		
		return new ResponseEntity<>(errorBody , status);
	}
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
          .forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }
	 
	
	@ExceptionHandler(ReminderNotFoundException.class)
	public ResponseEntity<ErrorResponseDTO> handleReminderNotFoundException(ReminderNotFoundException ex){
		
		HttpStatus status = HttpStatus.NOT_FOUND;
		ErrorResponseDTO errorBody = ErrorResponseDTO.builder()
										.status(status.value())
										.error(status.getReasonPhrase())
										.message(ex.getMessage())
										.build();
		return new ResponseEntity<>(errorBody , status);
	}
	
	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<ErrorResponseDTO> handleUserNotFoundException(UserNotFoundException ex){
		
		HttpStatus status = HttpStatus.NOT_FOUND;
		ErrorResponseDTO errorBody = ErrorResponseDTO.builder()
										.status(status.value())
										.error(status.getReasonPhrase())
										.message(ex.getMessage())
										.build();
		return new ResponseEntity<>(errorBody , status);
	}
	
	@ExceptionHandler(NotificationNotFoundException.class)
	public ResponseEntity<ErrorResponseDTO> handleNotificationNotFoundException(UserNotFoundException ex){
		
		HttpStatus status = HttpStatus.NOT_FOUND;
		ErrorResponseDTO errorBody = ErrorResponseDTO.builder()
										.status(status.value())
										.error(status.getReasonPhrase())
										.message(ex.getMessage())
										.build();
		return new ResponseEntity<>(errorBody , status);
	}
	
	@ExceptionHandler(ResourceAccessDeniedException.class)
	public ResponseEntity<ErrorResponseDTO> handleAccessDeniedException(ResourceAccessDeniedException ex){
		HttpStatus status = HttpStatus.FORBIDDEN;
		ErrorResponseDTO errorBody = ErrorResponseDTO.builder()
										.status(status.value())
										.error(status.getReasonPhrase())
										.message(ex.getMessage())
										.build();
		return new ResponseEntity<>(errorBody , status);
	}
	
	@ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Something went wrong: " + ex.getMessage()));
    }
	
	
}
