package com.ksenterprise.controller;

import com.ksenterprise.dto.ApiResponse;
import com.ksenterprise.dto.response.UserProfileResponse;
import com.ksenterprise.security.UserPrincipal;
import com.ksenterprise.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserProfileResponse profile = userService.getCurrentUserProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, String> request) {
        UserProfileResponse updated = userService.updateProfile(
                currentUser.getId(),
                request.get("name"),
                request.get("phone")
        );
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
