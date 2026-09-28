package com.ksenterprise.service;

import com.ksenterprise.dto.request.*;
import com.ksenterprise.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse googleAuth(GoogleAuthRequest googleAuthRequest);
    void requestPasswordReset(ForgotPasswordRequest forgotPasswordRequest);
    void resetPassword(ResetPasswordRequest resetPasswordRequest);
}
