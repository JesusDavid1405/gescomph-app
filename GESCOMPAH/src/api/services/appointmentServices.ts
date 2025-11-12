import { API_BASE_URL, DEFAULT_HEADERS } from "../constant/config";
import { ENDPOINTS } from "../constant/environment";
import { ApiResponse } from "../types/apiTypes";
import { Appointment } from "../types/appointment";

export const AppointmentService = {
    async getAll(): Promise<ApiResponse<Appointment[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.APPOINTMENT.BASE}`, {
                method: "GET",
                headers: DEFAULT_HEADERS,
                credentials: "include",
            });

            const data = await response.json();

            return { success: response.ok, data, message: data.message };
        } catch (error) {
            console.error("Error en getAll appointments:", error);
            return { success: false, message: "Error de conexión" };
        }
    },
};