
package com.expensetracker.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import com.expensetracker.dto.UserProfileDTO;
import com.expensetracker.entity.User;
import com.expensetracker.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

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

	public User login(String email, String password) {

		Optional<User> result = userRepository.findByEmail(email);

		if (result.isPresent()) {

			User user = result.get();

			if (user.getPassword().equals(password)) {
				return user;
			}
		}

		return null;
	}

	public User register(User user) {
		user.setCreatedAt(LocalDateTime.now());
		if (userRepository.existsByEmail(user.getEmail())) {
			throw new RuntimeException("Email already registered");
		}

		return userRepository.save(user);
	}

	public User updateUser(Long id, User updatedUser) {

	    User existingUser = userRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    Optional<User> emailUser =
	            userRepository.findByEmail(updatedUser.getEmail());

	  
	    existingUser.setName(updatedUser.getName());
	    existingUser.setEmail(updatedUser.getEmail());
	    existingUser.setPassword(updatedUser.getPassword());

	    return userRepository.save(existingUser);
	}

	
}
