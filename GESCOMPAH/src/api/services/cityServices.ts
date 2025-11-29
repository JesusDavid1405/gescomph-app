import { API_BASE_URL, DEFAULT_HEADERS } from '../constant/config';
import { ENDPOINTS } from '../constant/environment';
import { ApiResponse } from '../types/apiTypes';
import { City } from '../types/locationTypes';

export class CityService {
  private static baseUrl = API_BASE_URL;

  static async getById(cityId: number, token?: string): Promise<ApiResponse<City>> {
    try {
      const url = `${this.baseUrl}${ENDPOINTS.CITY.ID(cityId)}`;
      const headers = {
        ...DEFAULT_HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      const response = await fetch(url, {
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
      console.error('Error en getById city:', error);
      return { success: false, message: 'Error de conexión' };
    }
  }

  static async getByDepartment(departmentId: number, token?: string): Promise<ApiResponse<City[]>> {
    try {
      const url = `${this.baseUrl}${ENDPOINTS.CITY.BY_DEPARTMENT(departmentId)}`;
      const headers = {
        ...DEFAULT_HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      const response = await fetch(url, {
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
      console.error('Error en getByDepartment cities:', error);
      return { success: false, message: 'Error de conexión' };
    }
  }
}