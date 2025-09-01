package com.example.aqualink.repository;

import com.example.aqualink.entity.ActiveStatus;
import com.example.aqualink.entity.Fish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FishRepository extends JpaRepository<Fish, Long> {

    //add repo

    List<Fish> findByActiveStatus(ActiveStatus activeStatus);

    @Query("SELECT f FROM Fish f ORDER BY f.createDateAndTime DESC")
    List<Fish> findAllByOrderByCreateDateAndTimeDesc();


    //loard fish adds

    @Query("SELECT f FROM Fish f WHERE f.activeStatus = 'VERIFIED' AND f.stock > 0")
    List<Fish> findAvailableFish();

    List<Fish> findByNameContainingIgnoreCase(String name);
}
