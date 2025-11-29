import { API_BASE_URL, DEFAULT_HEADERS } from "../constant/config";
import { ENDPOINTS } from "../constant/environment";
import { ApiResponse } from "../types/apiTypes";
import { ChangePasswordDto, ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, LoginResponse, VerifyRecoveryCodeRequest } from "../types/authTypes";

export const AuthService = {
  async login(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.LOGIN}`, {
        method: "POST",
        headers: DEFAULT_HEADERS,
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  async logout(): Promise<ApiResponse<null>> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      return { success: true };
    } catch (error) {
      console.error("Error en logout:", error);
      return { success: false, message: "Error cerrando sesión" };
    }
  },

  async forgotPassword(payload: ForgotPasswordRequest): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.RECOVER}`, {
        method: "POST",
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error("Error en forgotPassword:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  async verifyRecoveryCode(payload: VerifyRecoveryCodeRequest): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.RECOVER_VERIFY}`, {
        method: "POST",
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error("Error en verifyRecoveryCode:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  async changePassword(payload: ChangePasswordRequest): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.RECOVER_VERIFY}`, {
        method: "POST",
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error("Error en changePassword:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  async changeCurrentPassword(payload: ChangePasswordDto): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.CHANGE_PASSWORD}`, {
        method: "POST",
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (parseError) {
        data = null;
      }

      return { success: response.ok, data, message: data?.message || text };
    } catch (error) {
      return { success: false, message: "Error de conexión" };
    }
  },
};
