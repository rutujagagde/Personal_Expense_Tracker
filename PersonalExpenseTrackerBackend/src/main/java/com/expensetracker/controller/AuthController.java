package com.expensetracker.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.expensetracker.dto.AuthResponse;
import com.expensetracker.dto.LoginRequest;
import com.expensetracker.dto.RefreshRequest;
import com.expensetracker.dto.UserProfileDTO;
import com.expensetracker.entity.User;
import com.expensetracker.service.JwtService;
import com.expensetracker.service.RefreshTokenService;
import com.expensetracker.service.UserService;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(
            UserService userService,
            JwtService jwtService,
            RefreshTokenService refreshTokenService) {

        this.userService = userService;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        User user = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        String accessToken =
                jwtService.generateAccessToken(
                        user.getEmail()
                );

        String refreshToken =
                refreshTokenService.createRefreshToken(
                        user.getEmail()
                );

        UserProfileDTO profile =
                new UserProfileDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail()
                );

        return ResponseEntity.ok(
                new AuthResponse(
                        accessToken,
                        refreshToken,
                        profile
                )
        );
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<UserProfileDTO> register(
            @RequestBody User user) {

        User savedUser = userService.register(user);

        UserProfileDTO profile =
                new UserProfileDTO(
                        savedUser.getId(),
                        savedUser.getName(),
                        savedUser.getEmail()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(profile);
    }

    // REFRESH TOKEN
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @RequestBody RefreshRequest request) {

        String oldToken = request.getRefreshToken();

        if (!refreshTokenService.validateRefreshToken(oldToken)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid or expired refresh token"
                    ));
        }

        String email = jwtService.extractEmail(oldToken);

        User user = userService.getAllUsers()
                .stream()
                .filter(u -> u.getEmail().equals(email))
                .findFirst()
                .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        // Rotate refresh token
        refreshTokenService.deleteRefreshToken(oldToken);

        String newAccessToken =
                jwtService.generateAccessToken(email);

        String newRefreshToken =
                refreshTokenService.createRefreshToken(email);

        UserProfileDTO profile =
                new UserProfileDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail()
                );

        return ResponseEntity.ok(
                new AuthResponse(
                        newAccessToken,
                        newRefreshToken,
                        profile
                )
        );
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestBody RefreshRequest request) {

        refreshTokenService.deleteRefreshToken(
                request.getRefreshToken()
        );

        return ResponseEntity.ok(
                Map.of("message", "Logout successful")
        );
    }
}