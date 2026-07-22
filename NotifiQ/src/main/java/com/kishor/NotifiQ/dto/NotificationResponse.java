package com.kishor.NotifiQ.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
	
	private Long notificationId;
	
	private Long reminderId;
	
	private String title;

	private String description;

	private String priority;
	
	private Instant createdAt;
	
	private Instant readAt;
	
	private String status;
}
