import { ApiResponse } from '../types/apiTypes';
import { City } from '../types/locationTypes';
import { API_BASE_URL, DEFAULT_HEADERS } from '../constant/config';
import { ENDPOINTS } from '../constant/environment';

export class CityService {
  private static baseUrl = API_BASE_URL;

  static async getById(cityId: number, token?: string): Promise<ApiResponse<City>> {
    try {
      const url = `${this.baseUrl}${ENDPOINTS.CITY.ID(cityId)}`;
      console.log('City getById URL:', url);
      const headers = {
        ...DEFAULT_HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
      });
      console.log('City getById response status:', response.status);

      if (response.ok) {
        const text = await response.text();
        console.log('City getById response text:', text);
        const data = text ? JSON.parse(text) : null;
        console.log('City getById parsed data:', data);
        return { success: true, data, message: data?.message };
      } else {
        console.log('City getById error status:', response.status);
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
      console.log('City getByDepartment URL:', url);
      const headers = {
        ...DEFAULT_HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
      });
      console.log('City getByDepartment response status:', response.status);

      if (response.ok) {
        const text = await response.text();
        console.log('City getByDepartment response text:', text);
        const data = text ? JSON.parse(text) : null;
        console.log('City getByDepartment parsed data:', data);
        return { success: true, data, message: data?.message };
      } else {
        console.log('City getByDepartment error status:', response.status);
        return { success: false, message: `Error: ${response.status}` };
      }
    } catch (error) {
      console.error('Error en getByDepartment cities:', error);
      return { success: false, message: 'Error de conexión' };
    }
  }
}