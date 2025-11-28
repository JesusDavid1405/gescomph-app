import { ApiResponse } from '../types/apiTypes';
import { Department } from '../types/locationTypes';
import { API_BASE_URL, DEFAULT_HEADERS } from '../constant/config';
import { ENDPOINTS } from '../constant/environment';

export class DepartmentService {
  private static baseUrl = `${API_BASE_URL}${ENDPOINTS.DEPARTMENT.BASE}`;

  static async getAll(token?: string): Promise<ApiResponse<Department[]>> {
    try {
      console.log('Department getAll URL:', this.baseUrl);
      const headers = {
        ...DEFAULT_HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers,
        credentials: 'include',
      });
      console.log('Department getAll response status:', response.status);

      if (response.ok) {
        const text = await response.text();
        console.log('Department getAll response text:', text);
        const data = text ? JSON.parse(text) : null;
        console.log('Department getAll parsed data:', data);
        return { success: true, data, message: data?.message };
      } else {
        console.log('Department getAll error status:', response.status);
        return { success: false, message: `Error: ${response.status}` };
      }
    } catch (error) {
      console.error('Error en getAll departments:', error);
      return { success: false, message: 'Error de conexión' };
    }
  }
}