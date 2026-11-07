package com.expensetracker.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.expensetracker.dto.UserProfileDTO;
import com.expensetracker.entity.User;
import com.expensetracker.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    @PreAuthorize(
    	    "@userAccessService.isOwner(#p0, authentication.name)"
    	)
    public List<UserProfileDTO> getAllUsers() {

        return userService.getAllUsers()
                .stream()
                .map(user -> new UserProfileDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail()
                ))
                .toList();
    }

    @GetMapping("/users/{id}")
    @PreAuthorize(
            "@userAccessService.isOwner(#p0, authentication.name)"
    )
    public UserProfileDTO getUserById(
            @PathVariable Long id) {

        User user = userService.getUserById(id);

        if (user == null) {
            return null;
        }

        return new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }

    @PutMapping("/users/{id}")
    @PreAuthorize(
            "@userAccessService.isOwner(#p0, authentication.name)"
    )
    public UserProfileDTO updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        User user = userService.updateUser(id, updatedUser);

        return new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}