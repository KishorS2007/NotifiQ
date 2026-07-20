package com.kishor.NotifiQ.config;

import java.time.Duration;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JWTService {
	
	
	private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B59";
	
	// user name in this application is email
	public String extractUserName(String token) {
		 return extractAllClaims(token).getSubject();
	}
	
	// token with no extra claims
	public String generateToken(UserDetails userDetails) {
		return generateToken(Map.of(),userDetails);
	}
	// token with extra claims
	public String generateToken(Map<String ,Object> extraClaims,UserDetails userDetails) {
		return Jwts
				.builder()
				.claims(extraClaims)
				.subject(userDetails.getUsername())
				.issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + Duration.ofDays(1).toMillis()))
				.signWith(getSecretKey())
				.compact();
	}
	
	public boolean isExpired(String token) {
		return extractAllClaims(token).getExpiration().before(new Date());
	}
	
	public boolean isTokenValid(String token,UserDetails userDetails) {
		return 	extractUserName(token).equals(userDetails.getUsername()) 
				&& !isExpired(token);
	}
	
	private Claims extractAllClaims(String token) {
		return Jwts.parser()
				.verifyWith(getSecretKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}
	
	private SecretKey getSecretKey() {
		byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
		return Keys.hmacShaKeyFor(keyBytes);
	}
}
