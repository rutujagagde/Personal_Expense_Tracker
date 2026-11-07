package com.expensetracker.dto;

public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private UserProfileDTO user;

    public AuthResponse(
            String accessToken,
            String refreshToken,
            UserProfileDTO user) {

        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public UserProfileDTO getUser() {
        return user;
    }
}