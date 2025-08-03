package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<Map<String, Object>> userList = users.stream().map(user -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("nicNumber", user.getNicNumber());
            userMap.put("name", user.getName());
            userMap.put("email", user.getEmail());
            userMap.put("phoneNumber", user.getPhoneNumber());
            userMap.put("userRoles", user.getUserRoles());
            userMap.put("active", user.isActive());
            userMap.put("nicDocumentPath", user.getNicDocumentPath());
            return userMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(userList);
    }

    @GetMapping("/users/active")
    public ResponseEntity<List<Map<String, Object>>> getActiveUsers() {
        List<User> users = userService.getActiveUsers();
        List<Map<String, Object>> userList = users.stream().map(user -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("nicNumber", user.getNicNumber());
            userMap.put("name", user.getName());
            userMap.put("email", user.getEmail());
            userMap.put("phoneNumber", user.getPhoneNumber());
            userMap.put("userRoles", user.getUserRoles());
            userMap.put("active", user.isActive());
            return userMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(userList);
    }

    @GetMapping("/users/inactive")
    public ResponseEntity<List<Map<String, Object>>> getInactiveUsers() {
        List<User> users = userService.getInactiveUsers();
        List<Map<String, Object>> userList = users.stream().map(user -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("nicNumber", user.getNicNumber());
            userMap.put("name", user.getName());
            userMap.put("email", user.getEmail());
            userMap.put("phoneNumber", user.getPhoneNumber());
            userMap.put("userRoles", user.getUserRoles());
            userMap.put("active", user.isActive());
            return userMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(userList);
    }

    @PostMapping("/users/{id}/deactivate")
    public ResponseEntity<Map<String, String>> deactivateUser(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        boolean success = userService.deactivateUser(id);
        if (success) {
            response.put("message", "User deactivated successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "User not found");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/users/{id}/activate")
    public ResponseEntity<Map<String, String>> activateUser(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        boolean success = userService.activateUser(id);
        if (success) {
            response.put("message", "User activated successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "User not found");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("nicNumber", user.getNicNumber());
                    userMap.put("name", user.getName());
                    userMap.put("email", user.getEmail());
                    userMap.put("phoneNumber", user.getPhoneNumber());
                    userMap.put("userRoles", user.getUserRoles());
                    userMap.put("active", user.isActive());
                    userMap.put("nicDocumentPath", user.getNicDocumentPath());
                    return ResponseEntity.ok(userMap);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
