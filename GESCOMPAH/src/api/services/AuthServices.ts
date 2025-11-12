import CookieManager from '@react-native-cookies/cookies';
import { API_BASE_URL, DEFAULT_HEADERS } from "../constant/config";
import { ENDPOINTS } from "../constant/environment";
import { ApiResponse } from "../types/apiTypes";
import { LoginRequest, LoginResponse, ForgotPasswordRequest, VerifyRecoveryCodeRequest, ChangePasswordRequest } from "../types/authTypes";

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

      // ⚡ Captura el header Set-Cookie manualmente
      const rawCookies = response.headers.get("set-cookie");

      if (rawCookies) {
        await CookieManager.set(API_BASE_URL, {
          name: "session", // usa el nombre real que tu backend envía
          value: rawCookies.split("=")[1].split(";")[0],
          path: "/",
        });
      }

      const cookies = await CookieManager.get(API_BASE_URL);
      console.log("🍪 Cookies guardadas:", cookies);

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

      await CookieManager.clearAll();
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
};
