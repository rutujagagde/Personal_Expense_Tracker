
package com.expensetracker.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expensetracker.entity.RefreshToken;
import com.expensetracker.repository.RefreshTokenRepository;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private JwtService jwtService;

    // Create and save refresh token
    public String createRefreshToken(String email) {

        String token = jwtService.generateRefreshToken(email);

        String tokenHash = hashToken(token);

        LocalDateTime expiryDate = LocalDateTime.now()
                .plusSeconds(jwtService.getRefreshTokenExpiration() / 1000);

        RefreshToken refreshToken =
                new RefreshToken(email, tokenHash, expiryDate);

        refreshTokenRepository.save(refreshToken);

        return token;
    }

    // Validate refresh token using database
    public boolean validateRefreshToken(String token) {

        if (token == null || !jwtService.isRefreshTokenValid(token)) {
            return false;
        }

        String tokenHash = hashToken(token);

        Optional<RefreshToken> savedToken =
                refreshTokenRepository.findByTokenHash(tokenHash);

        return savedToken.isPresent()
                && savedToken.get().getExpiryDate().isAfter(LocalDateTime.now());
    }

    // Delete one refresh token
    public void deleteRefreshToken(String token) {

        if (token != null) {
            refreshTokenRepository.deleteByTokenHash(hashToken(token));
        }
    }

    // Delete all refresh sessions for a user
    public void deleteAllUserTokens(String email) {

        refreshTokenRepository.deleteByEmail(email);
    }

    // SHA-256 hashing
    private String hashToken(String token) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8));

            return Base64.getEncoder().encodeToString(hash);

        } catch (Exception e) {
            throw new RuntimeException("Unable to hash refresh token", e);
        }
    }
}
