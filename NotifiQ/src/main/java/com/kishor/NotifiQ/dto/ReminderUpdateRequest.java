package com.kishor.NotifiQ.dto;

import java.time.LocalDateTime;

import com.kishor.NotifiQ.entity.ReminderEntity.Priority;
import com.kishor.NotifiQ.entity.ReminderEntity.RepeatUnit;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReminderUpdateRequest {
	

    @Size(min = 1, max = 200)
    private String title;

    @Size(max = 500)
    private String description;

    private LocalDateTime remindAt;

    @Positive
    private Integer repeatInterval;

    private RepeatUnit repeatUnit;

    private Priority priority;
	
}
