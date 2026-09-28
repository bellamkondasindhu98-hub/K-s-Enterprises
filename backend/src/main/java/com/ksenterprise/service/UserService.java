package com.ksenterprise.service;

import com.ksenterprise.dto.response.UserProfileResponse;

import java.util.List;

public interface UserService {
    UserProfileResponse getCurrentUserProfile(Long userId);
    UserProfileResponse updateUserProfile(Long userId, String name, String phone);
    List<UserProfileResponse> getAllCustomers();
}
