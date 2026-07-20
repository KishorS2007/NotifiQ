package com.kishor.NotifiQ.entity;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class NotificationEntity {
	
	public enum NotificationStatus{
		READ,UNREAD
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long  notificationId;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="user_id")
	private UserEntity user;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="reminder_id")
	private ReminderEntity reminder;
	
	@NotBlank
	@Column(nullable = false)
	private String title;
	
	@NotBlank
	@Column(nullable = false)
	private String description;
	
	@Enumerated(EnumType.STRING)
	@Builder.Default
	private NotificationStatus status = NotificationStatus.UNREAD;
	
	@CreationTimestamp
	private Instant createdAt;
	
	private Instant readAt;
}
