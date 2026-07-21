package com.kishor.NotifiQ.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.kishor.NotifiQ.entity.ReminderEntity;
import com.kishor.NotifiQ.entity.ReminderEntity.ReminderStatus;
import com.kishor.NotifiQ.entity.UserEntity;

@Repository
public interface ReminderRepository extends JpaRepository<ReminderEntity, Long> , JpaSpecificationExecutor<ReminderEntity> {
	public Page<ReminderEntity> findByStatusAndUser(Pageable pageable,ReminderStatus status,UserEntity User);
	public Page<ReminderEntity> findByStatus(Pageable pageable,ReminderStatus status);
	public Optional<ReminderEntity> findByReminderIdAndDeletedAtIsNull(Long reminderId);
	public Optional<ReminderEntity> findByReminderIdAndUserAndDeletedAtIsNull(Long reminderId,UserEntity user);
	public List<ReminderEntity> findByStatusAndDeletedAtIsNullAndRemindAtLessThanEqual(ReminderStatus status,LocalDateTime remindAt);
}
