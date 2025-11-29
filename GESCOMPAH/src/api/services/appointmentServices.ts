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

    async  create(appointmentData: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
        const url = `${API_BASE_URL}${ENDPOINTS.APPOINTMENT.BASE}`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: DEFAULT_HEADERS,
                credentials: "include",
                body: JSON.stringify(appointmentData),
            });
            const text = await response.text();
            const data = text ? JSON.parse(text) : null;
            return { success: response.ok, data, message: data?.message };
        } catch (error) {
            console.error("Error en create appointment:", error);
            return { success: false, message: "Error de conexión" };
        }
    },

    async getByEstablishmentAndDate(establishmentId: number, date: string): Promise<ApiResponse<Appointment[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.APPOINTMENT.BASE}?establishmentId=${establishmentId}&date=${date}`, {
                method: "GET",
                headers: DEFAULT_HEADERS,
                credentials: "include",
            });

            const data = await response.json();
            return { success: response.ok, data, message: data.message };
        } catch (error) {
            console.error("Error en getByEstablishmentAndDate appointments:", error);
            return { success: false, message: "Error de conexión" };
        }
    },

    async getByDate(date: string): Promise<ApiResponse<Appointment[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.APPOINTMENT.GET_BY_DATE(date)}`, {
                method: "GET",
                headers: DEFAULT_HEADERS,
                credentials: "include",
            });

            const data = await response.json();
            return { success: response.ok, data, message: data.message };
        } catch (error) {
            console.error("Error en getByDate appointments:", error);
            return { success: false, message: "Error de conexión" };
        }
    },

    async getByPersonId(personId: number, token?: string): Promise<ApiResponse<Appointment[]>> {
        try {
            const headers = {
                ...DEFAULT_HEADERS,
                ...(token && { Authorization: `Bearer ${token}` }),
            };

            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.APPOINTMENT.GET_BY_PERSON_ID(personId)}`, {
                method: "GET",
                headers,
                credentials: "include",
            });

            const text = await response.text();
            const data = text ? JSON.parse(text) : null;

            return { success: response.ok, data, message: data?.message };
        } catch (error) {
            console.error("Error en getByPersonId appointments:", error);
            return { success: false, message: "Error de conexión" };
        }
    }
};