package com.kishor.NotifiQ.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kishor.NotifiQ.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>{
	public Optional<UserEntity> findByEmail(String email);
	public boolean existsByEmail(String email);
	
}
