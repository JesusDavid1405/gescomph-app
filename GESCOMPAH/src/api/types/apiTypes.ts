// src/api/types/api.types.ts
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
