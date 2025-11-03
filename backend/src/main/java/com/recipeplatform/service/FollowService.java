package com.recipeplatform.service;

import com.recipeplatform.model.Follow;
import com.recipeplatform.model.User;
import com.recipeplatform.repository.FollowRepository;
import com.recipeplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    public void followCook(User follower, Long cookToFollowId) {
        // 1. Check for self-follow
        if (follower.getId().equals(cookToFollowId)) {
            throw new RuntimeException("You cannot follow yourself.");
        }

        // 2. Find the user to follow
        User cookToFollow = userRepository.findById(cookToFollowId)
                .orElseThrow(() -> new RuntimeException("User to follow not found."));

        // 3. Check if they are a COOK or ADMIN
        if (cookToFollow.getRole() == User.Role.USER) {
            throw new RuntimeException("You can only follow users with the COOK or ADMIN role.");
        }

        // 4. Check if already following
        if (followRepository.existsByFollowerIdAndFollowingId(follower.getId(), cookToFollowId)) {
            throw new RuntimeException("You are already following this user.");
        }

        // 5. Create and save the follow
        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(cookToFollow);
        followRepository.save(follow);
    }

    public void unfollowCook(User follower, Long cookToUnfollowId) {
        // Find the follow relationship
        Follow follow = followRepository.findByFollowerIdAndFollowingId(follower.getId(), cookToUnfollowId)
                .orElseThrow(() -> new RuntimeException("You are not following this user."));
        
        // Delete it
        followRepository.delete(follow);
    }

    public Map<String, Boolean> checkFollowStatus(User follower, Long cookId) {
        boolean isFollowing = followRepository.existsByFollowerIdAndFollowingId(follower.getId(), cookId);
        return Map.of("isFollowing", isFollowing);
    }
}
