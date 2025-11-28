import { API_BASE_URL, DEFAULT_HEADERS } from "../constant/config";
import { ENDPOINTS } from "../constant/environment";
import { ApiResponse } from "../types/apiTypes";
import { Department, City } from "../types/locationTypes";

export const LocationService = {
  async getDepartments(): Promise<ApiResponse<Department[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DEPARTMENT.BASE}`, {
        method: "GET",
        headers: DEFAULT_HEADERS,
        credentials: "include",
      });

      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error("Error en getDepartments:", error);
      return { success: false, data: [], message: "Error de conexión" };
    }
  },

  async getCitiesByDepartment(departmentId: number): Promise<ApiResponse<City[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CITY.BY_DEPARTMENT(departmentId)}`, {
        method: "GET",
        headers: DEFAULT_HEADERS,
        credentials: "include",
      });

      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error("Error en getCitiesByDepartment:", error);
      return { success: false, data: [], message: "Error de conexión" };
    }
  },
};