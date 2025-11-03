package com.recipeplatform.repository;

import com.recipeplatform.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    // Find a specific follow relationship
    Optional<Follow> findByFollowerIdAndFollowingId(Long followerId, Long followingId);

    // Check if a follow relationship exists
    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);

    // Get all the IDs of users that this user is following
    @Query("SELECT f.following.id FROM Follow f WHERE f.follower.id = :followerId")
    List<Long> findFollowingIdsByFollowerId(Long followerId);
}

