
package com.expensetracker.service;

import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    // Access token validity: 15 minutes
    private final long accessTokenExpiration = 15 * 60 * 1000;

    // Refresh token validity: 7 days
    private final long refreshTokenExpiration = 7 * 24 * 60 * 60 * 1000;

    private Key getSigningKey() {

        byte[] keyBytes = Decoders.BASE64.decode(secret);

        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate access token
    public String generateAccessToken(String email) {

        return generateToken(email, "access", accessTokenExpiration);
    }

    // Generate refresh token
    public String generateRefreshToken(String email) {

        return generateToken(email, "refresh", refreshTokenExpiration);
    }

    private String generateToken(String email, String type, long expiration) {

        Date currentDate = new Date();

        Date expiryDate = new Date(currentDate.getTime() + expiration);

        return Jwts.builder()
                .subject(email)
                .claim("type", type)
                .issuedAt(currentDate)
                .expiration(expiryDate)
                .signWith((SecretKey) getSigningKey())
                .compact();
    }

    // Extract email from token
    public String extractEmail(String token) {

        return getClaims(token).getSubject();
    }

    // Validate access token
    public boolean isAccessTokenValid(String token) {

        try {
            Claims claims = getClaims(token);

            return "access".equals(claims.get("type", String.class))
                    && claims.getExpiration().after(new Date());

        } catch (Exception e) {
            return false;
        }
    }

    // Validate refresh token
    public boolean isRefreshTokenValid(String token) {

        try {
            Claims claims = getClaims(token);

            return "refresh".equals(claims.get("type", String.class))
                    && claims.getExpiration().after(new Date());

        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {

        return Jwts.parser()
                .verifyWith((SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getRefreshTokenExpiration() {

        return refreshTokenExpiration;
    }
}
