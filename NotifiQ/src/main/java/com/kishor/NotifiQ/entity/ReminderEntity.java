package com.kishor.NotifiQ.entity;

import java.time.Instant;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@ToString(exclude = "user")
public class ReminderEntity {
	
	public enum ReminderStatus{
		PENDING,COMPLETED,CANCELLED
	}
	
	public enum RepeatUnit{
		MINUTE,HOUR,DAY,WEEK,MONTH,YEAR,NONE
	}
	
	public enum Priority{
		LOW,MEDIUM,HIGH;
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long reminderId;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@NotNull
	@JoinColumn(name = "user_id",nullable = false)
	private UserEntity user;
	
	@NotBlank
	@Size(max = 200,min = 1)
	private String title;
	
	@NotBlank
	@Size(max=500)
	private String description;
	
	@NotNull
	@Column(nullable=false)
	private LocalDateTime remindAt;
	
	@Enumerated(EnumType.STRING)
	@Builder.Default
	@Column(nullable=false)
	private ReminderStatus status = ReminderStatus.PENDING;
	
	@Positive
	private Integer repeatInterval;

	@Enumerated(EnumType.STRING)
	@NotNull
	@Column(nullable = false)
	private RepeatUnit repeatUnit;

	@Builder.Default
	@Enumerated(EnumType.STRING)
	@Column(nullable=false)
	private Priority priority = Priority.MEDIUM;
	
	@CreationTimestamp
	@Column(updatable = false)
	private Instant createdAt;
	
	@UpdateTimestamp
	private Instant updatedAt;
	
	private Instant deletedAt; // not null - yes | null - no
	
}
