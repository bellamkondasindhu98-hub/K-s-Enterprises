package com.ksenterprise.service.impl;

import com.ksenterprise.dto.request.*;
import com.ksenterprise.dto.response.AuthResponse;
import com.ksenterprise.exception.BadRequestException;
import com.ksenterprise.exception.ResourceNotFoundException;
import com.ksenterprise.model.AuthProvider;
import com.ksenterprise.model.PasswordResetToken;
import com.ksenterprise.model.Role;
import com.ksenterprise.model.User;
import com.ksenterprise.repository.PasswordResetTokenRepository;
import com.ksenterprise.repository.UserRepository;
import com.ksenterprise.security.JwtTokenProvider;
import com.ksenterprise.security.UserPrincipal;
import com.ksenterprise.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        return AuthResponse.builder()
                .token(jwt)
                .id(userPrincipal.getId())
                .name(userPrincipal.getName())
                .email(userPrincipal.getEmail())
                .role(userPrincipal.getRole())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail().toLowerCase().trim())
                .phone(registerRequest.getPhone())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.CUSTOMER)
                .authProvider(AuthProvider.LOCAL)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        UserPrincipal principal = UserPrincipal.create(savedUser);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        String jwt = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse googleAuth(GoogleAuthRequest googleAuthRequest) {
        User user = userRepository.findByEmail(googleAuthRequest.getEmail().toLowerCase().trim())
                .map(existingUser -> {
                    if (existingUser.getAuthProvider() == AuthProvider.LOCAL && existingUser.getGoogleId() == null) {
                        existingUser.setGoogleId(googleAuthRequest.getGoogleId());
                        existingUser.setAuthProvider(AuthProvider.GOOGLE);
                    }
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .name(googleAuthRequest.getName())
                            .email(googleAuthRequest.getEmail().toLowerCase().trim())
                            .googleId(googleAuthRequest.getGoogleId())
                            .role(Role.CUSTOMER)
                            .authProvider(AuthProvider.GOOGLE)
                            .active(true)
                            .build();
                    return userRepository.save(newUser);
                });

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        String jwt = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    @Transactional
    public void requestPasswordReset(ForgotPasswordRequest forgotPasswordRequest) {
        User user = userRepository.findByEmail(forgotPasswordRequest.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", forgotPasswordRequest.getEmail()));

        // Invalidate old tokens for this user
        passwordResetTokenRepository.deleteByUserId(user.getId());

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(2))
                .used(false)
                .build();

        passwordResetTokenRepository.save(resetToken);
        log.info("Generated password reset token for email: {} - Token: {}", user.getEmail(), token);
        // Note: Production setup sends resetToken via email service
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {
        if (!resetPasswordRequest.getNewPassword().equals(resetPasswordRequest.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match");
        }

        PasswordResetToken resetToken = passwordResetTokenRepository
                .findByTokenAndUsedFalseAndExpiryDateAfter(resetPasswordRequest.getToken(), LocalDateTime.now())
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token"));

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(resetPasswordRequest.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
        log.info("Password successfully reset for user ID: {}", user.getId());
    }
}
