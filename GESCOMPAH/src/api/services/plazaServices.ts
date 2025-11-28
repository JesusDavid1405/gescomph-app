import { API_BASE_URL, DEFAULT_HEADERS } from "../constant/config";
import { ENDPOINTS } from "../constant/environment";
import { ApiResponse } from "../types/apiTypes";
import { PlazaCard } from "../types/plaza";

export const PlazaService = {
  async getCards(): Promise<ApiResponse<PlazaCard[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PLAZA.CARDS}`, {
        method: "GET",
        headers: DEFAULT_HEADERS,
        credentials: "include",
      });

      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error("Error en getCards plazas:", error);
      return { success: false, message: "Error de conexión" };
    }
  },
};