package com.kishor.NotifiQ.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.kishor.NotifiQ.dto.NotificationResponse;
import com.kishor.NotifiQ.entity.NotificationEntity;
import com.kishor.NotifiQ.entity.NotificationEntity.NotificationStatus;
import com.kishor.NotifiQ.entity.ReminderEntity;
import com.kishor.NotifiQ.entity.ReminderEntity.ReminderStatus;
import com.kishor.NotifiQ.repository.NotificationRepository;
import com.kishor.NotifiQ.repository.ReminderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
	
	private final ReminderRepository reminderRepo;
	
	private final NotificationRepository notificationRepo;
	
	private final SimpMessagingTemplate messagingTemplate;
	
	
	private NotificationResponse toResponse(NotificationEntity notification) {
		ReminderEntity reminder = notification.getReminder();
		
		return NotificationResponse.builder()
					.notificationId(notification.getNotificationId())
					.reminderId(reminder.getReminderId())
					.title(reminder.getTitle())
					.description(reminder.getDescription())
					.priority(reminder.getPriority().name())
					.createdAt(notification.getCreatedAt())
					.build();
	}
	
	
	private NotificationEntity createNotification(ReminderEntity reminder) {
		return NotificationEntity.builder().user(reminder.getUser())
    			.reminder(reminder)
    			.title(reminder.getTitle())
    			.description(reminder.getDescription())
    			.status(NotificationStatus.UNREAD)
    			.build();
	}
	
	public void processReminders(List<ReminderEntity> reminders) {
		
		if(reminders.isEmpty()) return;	
		
		consoleReminders(reminders);
		
		List<NotificationEntity> notifications = new ArrayList<>();
		
	    reminders.forEach(reminder -> {
	    		
	    		notifications.add(createNotification(reminder));
	    		
	    		switch (reminder.getRepeatUnit()) {

	            case NONE -> {
	                reminder.setStatus(ReminderStatus.COMPLETED);
	                reminder.setDeletedAt(Instant.now());
	            }

	            case MINUTE -> {
	                reminder.setRemindAt(
	                        reminder.getRemindAt()
	                                .plusMinutes(reminder.getRepeatInterval()));
	            }

	            case HOUR -> {
	                reminder.setRemindAt(
	                        reminder.getRemindAt()
	                                .plusHours(reminder.getRepeatInterval()));
	            }

	            case DAY -> {
	                reminder.setRemindAt(
	                        reminder.getRemindAt()
	                                .plusDays(reminder.getRepeatInterval()));
	            }

	            case WEEK -> {
	                reminder.setRemindAt(
	                        reminder.getRemindAt()
	                                .plusWeeks(reminder.getRepeatInterval()));
	            }

	            case MONTH -> {
	                reminder.setRemindAt(
	                        reminder.getRemindAt()
	                                .plusMonths(reminder.getRepeatInterval()));
	            }

	            case YEAR -> {
	                reminder.setRemindAt(
	                        reminder.getRemindAt()
	                                .plusYears(reminder.getRepeatInterval()));
	            }
	        }

	    });

	    notificationRepo.saveAll(notifications);
	    
	    notifications.forEach(notification -> {
	    		messagingTemplate.convertAndSendToUser(
	    				notification.getUser().getEmail(),
	    				"/queue/notifications",
	    				toResponse(notification)
			);
	    });
	    
	    reminderRepo.saveAll(reminders);
	}
	
	public void consoleReminders(List<ReminderEntity> reminders) {

	    if (reminders.isEmpty()) {
	        return;
	    }

	    System.out.println("\n========================================");
	    System.out.println("🔔 REMINDER NOTIFICATIONS");
	    System.out.println("========================================");

	    reminders.forEach(reminder -> {
	        System.out.println("Title       : " + reminder.getTitle());
	        System.out.println("Description : " + reminder.getDescription());
	        System.out.println("Priority    : " + reminder.getPriority());
	        System.out.println("Remind At   : " + reminder.getRemindAt());
	        System.out.println("----------------------------------------");
	    });

	    System.out.println("Total Notifications : " + reminders.size());
	    System.out.println("========================================\n");
	}
}
