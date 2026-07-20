package com.kishor.NotifiQ.service.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.kishor.NotifiQ.entity.ReminderEntity;
import com.kishor.NotifiQ.entity.ReminderEntity.ReminderStatus;
import com.kishor.NotifiQ.repository.ReminderRepository;
import com.kishor.NotifiQ.service.NotificationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ReminderScheduler {
	private final ReminderRepository reminderRepo;
	private final NotificationService notificationService;

	@Scheduled(cron = "0 * * * * *")
	@Transactional
	public void check() {

		List<ReminderEntity> reminders = reminderRepo.findByStatusAndDeletedAtIsNullAndRemindAtLessThanEqual(ReminderStatus.PENDING,LocalDateTime.now());
		notificationService.processReminders(reminders);
		
	}
}
