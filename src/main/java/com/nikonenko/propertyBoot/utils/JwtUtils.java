package com.nikonenko.propertyBoot.utils;

import com.nikonenko.propertyBoot.models.User;
import com.nikonenko.propertyBoot.services.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;

@Component
public class JwtUtils {
    private final UserService userService;

    @Value("${application.security.jwt.secret-key}")
    private String SECRET_KEY; // Замените на ваш секретный ключ

    public JwtUtils(UserService userService) {
        this.userService = userService;
    }

    public User extractUser(String token) {
        byte[] decodedKey = Base64.getDecoder().decode(SECRET_KEY);
        Key signingKey = Keys.hmacShaKeyFor(decodedKey);
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return userService.findByEmail(claims.getSubject()).orElseThrow();
    }
}
