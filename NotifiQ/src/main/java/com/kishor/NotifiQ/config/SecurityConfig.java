package com.kishor.NotifiQ.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	@Autowired
	private JWTAuthenticationFilter authenticationFilter;
	
	@Autowired
	private JwtAuthenticationEntryPoint authenticationEntryPoint;
	
	@Bean 
	public SecurityFilterChain securityFilterChain(HttpSecurity http) {
		
		http
			.cors(org.springframework.security.config.Customizer.withDefaults())
			.csrf(csrf->csrf.disable())
			.exceptionHandling(ex->{
				ex.authenticationEntryPoint(authenticationEntryPoint);
			})
			.authorizeHttpRequests(auth->{
				auth
					.requestMatchers("/api/auth/**",
									"/swagger-ui/**",
									"/v3/api-docs/**",
									 "/ws/**").permitAll()
					.anyRequest().authenticated();
			})
			.sessionManagement(sess -> {
				sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
			})
			.addFilterBefore(authenticationFilter,UsernamePasswordAuthenticationFilter.class);
			
		
		return http.build();
	}
	
}
