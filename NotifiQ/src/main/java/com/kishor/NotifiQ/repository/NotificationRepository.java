package com.kishor.NotifiQ.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kishor.NotifiQ.entity.NotificationEntity;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long>{
	
}
