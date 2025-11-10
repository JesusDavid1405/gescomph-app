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
