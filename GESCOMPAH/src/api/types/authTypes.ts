// src/api/types/auth.types.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean,
  message: string,
  expiresAt: Date
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyRecoveryCodeRequest {
  email: string;
  code: string;
}

export interface ChangePasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}
