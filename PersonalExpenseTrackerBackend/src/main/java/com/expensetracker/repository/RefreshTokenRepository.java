package com.expensetracker.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.expensetracker.entity.RefreshToken;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    // Find refresh token using its hash
    Optional<RefreshToken> findByTokenHash(String tokenHash);

    // Delete a particular refresh token
    void deleteByTokenHash(String tokenHash);

    // Delete all refresh tokens belonging to a user
    void deleteByEmail(String email);
}