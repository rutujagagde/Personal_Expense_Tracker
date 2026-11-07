package com.expensetracker.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.expensetracker.entity.User;
import com.expensetracker.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Login using BCrypt
    public User login(String email, String password) {

        Optional<User> result =
                userRepository.findByEmail(email);

        if (result.isEmpty()) {
            return null;
        }

        User user = result.get();

        String storedPassword = user.getPassword();

        if (storedPassword == null || password == null) {
            return null;
        }

        // Check BCrypt password first
        if (passwordEncoder.matches(password, storedPassword)) {
            return user;
        }

        // Migrate existing plain-text passwords
        // after a successful legacy login
        if (storedPassword.equals(password)) {

            user.setPassword(
                    passwordEncoder.encode(password)
            );

            userRepository.save(user);

            return user;
        }

        return null;
    }

    // Registration
    public User register(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already registered"
            );
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    // Update user profile
    public User updateUser(Long id, User updatedUser) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        Optional<User> emailUser =
                userRepository.findByEmail(
                        updatedUser.getEmail()
                );

        if (emailUser.isPresent()
                && emailUser.get().getId() != id) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already registered"
            );
        }

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());

        // Do not replace password if profile request
        // does not contain a new password
        if (updatedUser.getPassword() != null
                && !updatedUser.getPassword().isBlank()) {

            existingUser.setPassword(
                    passwordEncoder.encode(
                            updatedUser.getPassword()
                    )
            );
        }

        return userRepository.save(existingUser);
    }
}