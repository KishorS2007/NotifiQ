package com.kishor.NotifiQ.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kishor.NotifiQ.entity.NotificationEntity;
import com.kishor.NotifiQ.entity.NotificationEntity.NotificationStatus;
import com.kishor.NotifiQ.entity.UserEntity;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long>{
	public List<NotificationEntity> findByStatus(NotificationStatus status);
	public List<NotificationEntity> findByUserAndStatus(UserEntity user, NotificationStatus status);
}
