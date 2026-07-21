package com.kishor.NotifiQ.service;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import com.kishor.NotifiQ.Specifications.ReminderSpecification;
import com.kishor.NotifiQ.dto.ReminderDTO;
import com.kishor.NotifiQ.dto.ReminderResponse;
import com.kishor.NotifiQ.dto.ReminderUpdateRequest;
import com.kishor.NotifiQ.entity.ReminderEntity;
import com.kishor.NotifiQ.entity.ReminderEntity.ReminderStatus;
import com.kishor.NotifiQ.entity.UserEntity;
import com.kishor.NotifiQ.exception.InvalidCredentialsException;
import com.kishor.NotifiQ.exception.ReminderNotFoundException;
import com.kishor.NotifiQ.exception.ResourceAccessDeniedException;
import com.kishor.NotifiQ.exception.UserNotFoundException;
import com.kishor.NotifiQ.repository.ReminderRepository;
import com.kishor.NotifiQ.repository.UserRepository;

@Service
public class ReminderService {
	@Autowired
	private ReminderRepository reminderRepo;

	@Autowired
	private AuthService authService;

	private ReminderResponse createResponse(ReminderEntity reminder) {
		return ReminderResponse.builder().reminderId(reminder.getReminderId()).title(reminder.getTitle())
				.description(reminder.getDescription()).remindAt(reminder.getRemindAt())
				.repeatInterval(reminder.getRepeatInterval()).repeatUnit(reminder.getRepeatUnit())
				.priority(reminder.getPriority()).build();
	}

	public void addReminder(ReminderDTO request) {

		UserEntity user = authService.getCurrentUser();

		ReminderEntity reminder = ReminderEntity.builder().title(request.getTitle())
				.description(request.getDescription()).remindAt(request.getRemindAt())
				.repeatInterval(request.getRepeatInterval()).repeatUnit(request.getRepeatUnit())
				.priority(request.getPriority()).user(user).build();

		reminderRepo.save(reminder);
	}

	public List<ReminderResponse> getAllReminders(int page, int size, String keyword, String priority, String status,
			Instant reminderFrom, Instant reminderTo) {

		Pageable pageable = PageRequest.of(page, size);
		UserEntity user = authService.getCurrentUser();

		Specification<ReminderEntity> spec = Specification.where(ReminderSpecification.hasUser(user))
				.and(ReminderSpecification.hasTextLike(keyword))
				.and(ReminderSpecification.hasPriority(priority))
				.and(ReminderSpecification.hasStatus(status))
				.and(ReminderSpecification.reminderBetween(reminderFrom, reminderTo));

		Page<ReminderEntity> reminders = reminderRepo.findAll(spec,pageable);
		
		return reminders.getContent().stream().map(reminder -> createResponse(reminder)).toList();
	}

	public ReminderResponse getReminderById(Long reminderId) {

		UserEntity user = authService.getCurrentUser();

		ReminderEntity reminder = reminderRepo.findByReminderIdAndUserAndDeletedAtIsNull(reminderId, user)
				.orElseThrow(() -> new ReminderNotFoundException("Reminder not found with id : " + reminderId));

		return createResponse(reminder);
	}

	public void deleteReminderById(Long reminderId) {
		UserEntity user = authService.getCurrentUser();

		ReminderEntity reminder = reminderRepo.findByReminderIdAndUserAndDeletedAtIsNull(reminderId, user)
				.orElseThrow(() -> new ReminderNotFoundException("Reminder not found with id : " + reminderId));

		reminder.setDeletedAt(Instant.now());
		reminder.setStatus(ReminderEntity.ReminderStatus.CANCELLED);
		reminderRepo.save(reminder);
	}

	public void updateReminder(Long reminderId, ReminderUpdateRequest dto) {

		if (reminderId == null) {
			new ReminderNotFoundException("Reminder not found with id : " + reminderId);
		}

		ReminderEntity reminder = reminderRepo.findByReminderIdAndDeletedAtIsNull(reminderId)
				.orElseThrow(() -> new ReminderNotFoundException("Reminder not found with id : " + reminderId));

		if (!reminder.getUser().equals(authService.getCurrentUser())) {
			throw new ResourceAccessDeniedException("You are not authorized to access this resource.!!");
		}

		if (dto.getTitle() != null) {
			reminder.setTitle(dto.getTitle());
		}

		if (dto.getDescription() != null) {
			reminder.setDescription(dto.getDescription());
		}

		if (dto.getRemindAt() != null) {
			reminder.setRemindAt(dto.getRemindAt());
		}

		if (dto.getRepeatInterval() != null) {
			reminder.setRepeatInterval(dto.getRepeatInterval());
		}

		if (dto.getRepeatUnit() != null) {
			reminder.setRepeatUnit(dto.getRepeatUnit());
		}

		if (dto.getPriority() != null) {
			reminder.setPriority(dto.getPriority());
		}

		reminderRepo.save(reminder);
	}
}
