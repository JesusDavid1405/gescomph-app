import CookieManager from '@react-native-cookies/cookies';
import { API_BASE_URL, DEFAULT_HEADERS } from "../constant/config";
import { ENDPOINTS } from "../constant/environment";
import { ApiResponse } from "../types/apiTypes";
import { LoginRequest, LoginResponse } from "../types/authTypes";

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

      // 👇 Aquí obtenemos las cookies que guardó el backend
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
};
