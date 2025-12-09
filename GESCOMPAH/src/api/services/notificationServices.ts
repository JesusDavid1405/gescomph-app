import { API_BASE_URL, DEFAULT_HEADERS } from "../constant/config";
import { ENDPOINTS } from "../constant/environment";
import { ApiResponse } from "../types/apiTypes";
import { Notification } from "../types/notification";

export const NotificationService = {
  async getFeed(userId: number, token?: string): Promise<ApiResponse<Notification[]>> {
    try {
      console.log("NotificationService.getFeed - userId:", userId);
      const headers = {
        ...DEFAULT_HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      const url = `${API_BASE_URL}${ENDPOINTS.NOTIFICATION.FEED(userId)}`;
      console.log("NotificationService.getFeed - URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
      });

      console.log("NotificationService.getFeed - Response status:", response.status);
      const data = await response.json();
      console.log("NotificationService.getFeed - Response data:", data);
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error("Error en getFeed notifications:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  async getUnread(userId: number, token?: string): Promise<ApiResponse<Notification[]>> {
    try {
      console.log("NotificationService.getUnread - userId:", userId);
      const headers = {
        ...DEFAULT_HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      const url = `${API_BASE_URL}${ENDPOINTS.NOTIFICATION.UNREAD(userId)}`;
      console.log("NotificationService.getUnread - URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
      });

      console.log("NotificationService.getUnread - Response status:", response.status);
      const data = await response.json();
      console.log("NotificationService.getUnread - Response data:", data);
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error("Error en getUnread notifications:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  async markAsRead(notificationId: number, token?: string): Promise<ApiResponse<void>> {
    try {
      console.log("NotificationService.markAsRead - notificationId:", notificationId);
      const headers = {
        ...DEFAULT_HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      const url = `${API_BASE_URL}${ENDPOINTS.NOTIFICATION.READ(notificationId)}`;
      console.log("NotificationService.markAsRead - URL:", url);

      const response = await fetch(url, {
        method: "PATCH",
        headers,
        credentials: "include",
      });

      console.log("NotificationService.markAsRead - Response status:", response.status);
      const data = await response.json();
      console.log("NotificationService.markAsRead - Response data:", data);
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error("Error en markAsRead notification:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  async markAllAsRead(userId: number, token?: string): Promise<ApiResponse<void>> {
    try {
      console.log("NotificationService.markAllAsRead - userId:", userId);
      const headers = {
        ...DEFAULT_HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      const url = `${API_BASE_URL}${ENDPOINTS.NOTIFICATION.MARK_ALL_READ(userId)}`;
      console.log("NotificationService.markAllAsRead - URL:", url);

      const response = await fetch(url, {
        method: "PATCH",
        headers,
        credentials: "include",
      });

      console.log("NotificationService.markAllAsRead - Response status:", response.status);
      const data = await response.json();
      console.log("NotificationService.markAllAsRead - Response data:", data);
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error("Error en markAllAsRead notifications:", error);
      return { success: false, message: "Error de conexión" };
    }
  },
};