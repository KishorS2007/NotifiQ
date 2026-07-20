package com.kishor.NotifiQ.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.Length;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="users")
public class UserEntity implements UserDetails{
	 
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public enum Role{
		ADMIN , USER
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userId;
	
	@NotBlank
	@Length(min = 6)
	@Column(unique = true)
	private String fullName;
	
	@NotBlank
	@Email
	@Column(unique = true)
	private String email;
	
	private String password; 
	
	@Enumerated(EnumType.STRING)
	@Builder.Default
	private Role role = Role.USER;
	
	
	@Builder.Default
	@OneToMany(cascade = CascadeType.ALL,orphanRemoval = true,mappedBy = "user")
	private List<ReminderEntity> reminders = new ArrayList<>();
	
	@CreationTimestamp
	@Column(updatable = false)
	private Instant createdAt;
	
	@UpdateTimestamp
	private Instant updatedAt;
	
	private Instant deletedAt;

	
	
	
	
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority(role.name()));
	}

	@Override
	public @Nullable String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return email;
	}
	
}
