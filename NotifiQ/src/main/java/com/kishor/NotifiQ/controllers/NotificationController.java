package com.kishor.NotifiQ.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kishor.NotifiQ.dto.NotificationResponse;
import com.kishor.NotifiQ.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {
	
	private final NotificationService notificationService;
	
	
	@GetMapping
	public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(){
		List<NotificationResponse> notifications = notificationService.getUnreadNotifications();
		return ResponseEntity.ok(notifications);
	}
	
	@PatchMapping("/{notificationId}")
	public ResponseEntity<?> MarkNotificationRead(@PathVariable Long notificationId) {
		notificationService.MarkNotificationRead(notificationId);
		
		return ResponseEntity.ok("Notification status updated");
		
	}
	
	@GetMapping("/{notificationId}")
	public ResponseEntity<?> getNotificationById(@PathVariable Long notificationId){
		NotificationResponse response  = notificationService.getNotificationById(notificationId);
		
		return ResponseEntity.ok(response);
	}
	
	@PatchMapping
	public ResponseEntity<?> markAllNotificationsAsRead(){
		notificationService.markAllNotificationsAsRead();
		
		return ResponseEntity.ok("Notification status updated");
	}
}
