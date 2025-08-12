package com.example.aqualink.repository;

import com.example.aqualink.entity.User;
import com.example.aqualink.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    List<UserRole> findByUser(User user);
    List<UserRole> findByUserId(Long userId);
}
