package com.expensetracker.service;

import org.springframework.stereotype.Service;

import com.expensetracker.repository.UserRepository;

@Service("userAccessService")
public class UserAccessService {

    private final UserRepository userRepository;

    public UserAccessService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean isOwner(Long userId, String email) {

        if (userId == null || email == null) {
            return false;
        }

        return userRepository.findByEmail(email)
                .map(user -> user.getId() == userId)
                .orElse(false);
    }
}