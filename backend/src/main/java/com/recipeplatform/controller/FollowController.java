package com.recipeplatform.controller;

import com.recipeplatform.model.User;
import com.recipeplatform.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/follow")
@CrossOrigin(origins = "http://localhost:3000")
public class FollowController {

    @Autowired
    private FollowService followService;

    // POST /api/follow/12 (Follow user 12)
    @PostMapping("/{cookId}")
    public ResponseEntity<Void> followUser(@PathVariable Long cookId,
                                           @AuthenticationPrincipal User user) {
        followService.followCook(user, cookId);
        return ResponseEntity.ok().build();
    }

    // DELETE /api/follow/12 (Unfollow user 12)
    @DeleteMapping("/{cookId}")
    public ResponseEntity<Void> unfollowUser(@PathVariable Long cookId,
                                             @AuthenticationPrincipal User user) {
        followService.unfollowCook(user, cookId);
        return ResponseEntity.noContent().build();
    }

    // GET /api/follow/12/status (Check if I follow user 12)
    @GetMapping("/{cookId}/status")
    public ResponseEntity<Map<String, Boolean>> getFollowStatus(@PathVariable Long cookId,
                                                                @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(followService.checkFollowStatus(user, cookId));
    }
}
