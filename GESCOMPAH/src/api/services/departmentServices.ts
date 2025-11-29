import { API_BASE_URL, DEFAULT_HEADERS } from '../constant/config';
import { ENDPOINTS } from '../constant/environment';
import { ApiResponse } from '../types/apiTypes';
import { Department } from '../types/locationTypes';

export class DepartmentService {
  private static baseUrl = `${API_BASE_URL}${ENDPOINTS.DEPARTMENT.BASE}`;

  static async getAll(token?: string): Promise<ApiResponse<Department[]>> {
    try {
      const headers = {
        ...DEFAULT_HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        return { success: true, data, message: data?.message };
      } else {
        return { success: false, message: `Error: ${response.status}` };
      }
    } catch (error) {
      console.error('Error en getAll departments:', error);
      return { success: false, message: 'Error de conexión' };
    }
  }
}