package com.recipeplatform.service;

import com.recipeplatform.model.User;
import com.recipeplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import java.util.List; // <-- IMPORT ADDED

@Service
public class UserService implements UserDetailsService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // This method isn't used by your new code, but I left it in
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // This method isn't used by your new code, but I left it in
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // This method isn't used by your new code, but I left it in
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    // This method isn't used by your new code, but I left it in
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        // Assuming your User model implements UserDetails
        return user;
    }

    // --- METHODS ADDED FOR ADMIN DASHBOARD ---

    /**
     * Gets a list of all users.
     * @return List of all User objects
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Deletes a user by their ID.
     * Prevents an admin from deleting their own account.
     * @param idToDelete The ID of the user to delete
     * @param adminUser The currently authenticated admin user
     */
    public void deleteUser(Long idToDelete, User adminUser) {
        if (idToDelete.equals(adminUser.getId())) {
            throw new RuntimeException("Admin user cannot delete their own account.");
        }
        userRepository.deleteById(idToDelete);
    }

    /**
     * Finds a single user by their ID.
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}