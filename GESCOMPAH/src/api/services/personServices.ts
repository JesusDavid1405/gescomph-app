import { API_BASE_URL, DEFAULT_HEADERS } from "../constant/config";
import { ENDPOINTS } from "../constant/environment";
import { ApiResponse } from "../types/apiTypes";
import { Person, PersonUpdateModel } from "../types/personTypes";

export const PersonService = {
  async getById(id: number, token?: string): Promise<ApiResponse<Person>> {
    const url = `${API_BASE_URL}${ENDPOINTS.PERSON.ID(id)}`;
    const headers = {
      ...DEFAULT_HEADERS,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      return { success: response.ok, data, message: data?.message };
    } catch (error) {
      console.error("Error en getById person:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  async update(id: number, data: PersonUpdateModel, token?: string): Promise<ApiResponse<any>> {
    const url = `${API_BASE_URL}${ENDPOINTS.PERSON.ID(id)}`;
    const headers = {
      ...DEFAULT_HEADERS,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      const text = await response.text();
      const responseData = text ? JSON.parse(text) : null;
      return { success: response.ok, data: responseData, message: responseData?.message };
    } catch (error) {
      console.error("Error en update person:", error);
      return { success: false, message: "Error de conexión" };
    }
  },
};