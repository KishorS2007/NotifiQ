package com.kishor.NotifiQ.Specifications;

import java.time.Instant;

import org.springframework.data.jpa.domain.Specification;

import com.kishor.NotifiQ.entity.ReminderEntity;
import com.kishor.NotifiQ.entity.UserEntity;

public class ReminderSpecification {	
	
	public static Specification<ReminderEntity> hasUser(UserEntity user){
		
		return (root, query, cb)->{
			if(user == null) return null;
			return cb.equal(root.get("user"), user);
		};
	}
	
	public static Specification<ReminderEntity> hasTextLike(String text) {
		return (root, query, cb) -> {
			if(text == null || text.isBlank()) return null;
			
			String lowerKeyword = "%"+text.trim().toLowerCase()+"%";
			String upperKeyword = "%"+text.trim().toUpperCase()+"%";
			
			return cb.or(
						cb.like(cb.lower(root.get("title")), lowerKeyword) , 
						cb.like(cb.lower(root.get("description")),lowerKeyword) ,
						cb.like(root.get("repeatUnit").as(String.class), upperKeyword)
					);
		}; 
	}
	
	
	public static Specification<ReminderEntity> hasPriority(String keyword){
		return (root, query, cb)->{
			if(keyword == null || keyword.isBlank()) return null;
			
			return cb.equal(root.get("priority").as(String.class), keyword.toUpperCase());
		};
	}
	
	public static Specification<ReminderEntity> hasStatus(String keyword){
		return (root, query, cb)->{
			if(keyword == null || keyword.isBlank() || keyword.equals("CANCELLED")) return null;
			
			return cb.equal(root.get("status").as(String.class),keyword.toUpperCase()); 
		};
	}
	
	public static Specification<ReminderEntity> reminderBetween(Instant from,Instant to){
		return (root, query, cb)->{
			if(from == null && to == null) return null;
			
			if(from == null) {
				return cb.lessThanOrEqualTo(root.get("remindAt"), to);
			} else if(to == null) {
				return cb.greaterThanOrEqualTo(root.get("remindAt"), from);
			}
			
			return cb.between(root.get("remindAt"), from, to);
		};
	}

	public static Specification<ReminderEntity> isNotDeleted() {
		return (root, query, cb)->{
			return cb.isNull(root.get("deletedAt"));
		};
	}
}
