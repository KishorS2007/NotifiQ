package com.kishor.NotifiQ.dto;

import java.time.LocalDateTime;

import com.kishor.NotifiQ.entity.ReminderEntity.Priority;
import com.kishor.NotifiQ.entity.ReminderEntity.RepeatUnit;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor

public class ReminderResponse {

    @NotNull
    private Long reminderId;

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 500)
    private String description;

    @NotNull
    private LocalDateTime remindAt;

    @Positive
    private Integer repeatInterval;

    private RepeatUnit repeatUnit;

    @Builder.Default
    @NotNull
    private Priority priority = Priority.MEDIUM;

    private String status;

}
