package com.ksenterprise.dto.response;

import com.ksenterprise.model.AuthProvider;
import com.ksenterprise.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private AuthProvider authProvider;
    private LocalDateTime createdAt;
}
