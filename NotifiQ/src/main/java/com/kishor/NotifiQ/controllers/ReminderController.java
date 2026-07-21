package com.kishor.NotifiQ.controllers;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kishor.NotifiQ.dto.ReminderDTO;
import com.kishor.NotifiQ.dto.ReminderResponse;
import com.kishor.NotifiQ.dto.ReminderUpdateRequest;
import com.kishor.NotifiQ.service.ReminderService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {
	@Autowired
	private ReminderService reminderService;
	
	@PostMapping
	public ResponseEntity<String> addReminder(@Valid @RequestBody ReminderDTO request){
		reminderService.addReminder(request);
		
		return ResponseEntity.status(HttpStatus.CREATED).body("Reminder added successfuly");
	}
	
	@GetMapping
	public ResponseEntity<List<ReminderResponse>> getAllreminders(
			@RequestParam(defaultValue = "0") int page ,@RequestParam(defaultValue = "5") int size,
			@RequestParam(required = false) String keyword , @RequestParam(required = false) String priority,
			@RequestParam(required = false) String status ,@RequestParam(required = false) Instant reminderFrom ,
			@RequestParam(required = false) Instant reminderTo 
	){
		
		List<ReminderResponse> reminders = reminderService.getAllReminders(page,size,keyword,priority,status,reminderFrom,reminderTo);
		return ResponseEntity.ok(reminders);
	}
	
	@GetMapping("/{reminderId}")
	public ResponseEntity<ReminderResponse> getReminderById(@PathVariable Long reminderId){
		ReminderResponse dto = reminderService.getReminderById(reminderId);
		return ResponseEntity.ok(dto);
	}
	
	@DeleteMapping("/{reminderId}")
	public ResponseEntity<String> deleteReminderById(@PathVariable Long reminderId){
		reminderService.deleteReminderById(reminderId);
		return ResponseEntity.ok("successfuly Deleted reminder with id "+reminderId);
	}
	
	@PatchMapping("/{reminderId}")
	public ResponseEntity<String> updateReminder(@PathVariable @NotNull Long reminderId , @Valid @RequestBody ReminderUpdateRequest dto){
		reminderService.updateReminder(reminderId,dto);
		
		return ResponseEntity.ok("successfuly Updated reminder with id "+reminderId);
	}
}
