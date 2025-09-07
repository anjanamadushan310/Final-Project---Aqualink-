package com.example.aqualink.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.aqualink.entity.ActiveStatus;
import com.example.aqualink.entity.Fish;

@Repository
public interface FishRepository extends JpaRepository<Fish, Long> {

    //add repo

    List<Fish> findByActiveStatus(ActiveStatus activeStatus);

    @Query("SELECT f FROM Fish f ORDER BY f.createDateAndTime DESC")
    List<Fish> findAllByOrderByCreateDateAndTimeDesc();


    //loard fish adds

    @Query("SELECT f FROM Fish f LEFT JOIN FETCH f.userProfile WHERE f.activeStatus = 'VERIFIED' AND f.stock > 0")
    List<Fish> findAvailableFishWithProfile();
    
    @Query("SELECT f FROM Fish f LEFT JOIN FETCH f.userProfile WHERE f.activeStatus = 'VERIFIED' AND f.stock > 0")
    List<Fish> findAvailableFish();
    
    List<Fish> findByNameContainingIgnoreCase(String name);

    @Query("SELECT f FROM Fish f LEFT JOIN FETCH f.userProfile WHERE f.id = :id")
    Optional<Fish> findByIdWithProfile(@Param("id") Long id);

    @Query("SELECT f FROM Fish f LEFT JOIN FETCH f.userProfile WHERE f.userProfile.userEmail = :userEmail")
    List<Fish> findByUserEmailWithProfile(@Param("userEmail") String userEmail);

}    
    
    
