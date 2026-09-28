package com.ksenterprise.service.impl;

import com.ksenterprise.dto.response.UserProfileResponse;
import com.ksenterprise.exception.ResourceNotFoundException;
import com.ksenterprise.model.Role;
import com.ksenterprise.model.User;
import com.ksenterprise.repository.UserRepository;
import com.ksenterprise.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return mapToProfile(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateUserProfile(Long userId, String name, String phone) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (name != null && !name.trim().isEmpty()) {
            user.setName(name.trim());
        }
        if (phone != null) {
            user.setPhone(phone.trim());
        }

        User updatedUser = userRepository.save(user);
        return mapToProfile(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserProfileResponse> getAllCustomers() {
        return userRepository.findByRole(Role.CUSTOMER).stream()
                .map(this::mapToProfile)
                .collect(Collectors.toList());
    }

    private UserProfileResponse mapToProfile(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .authProvider(user.getAuthProvider())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
