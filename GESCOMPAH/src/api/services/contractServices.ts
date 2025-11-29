import { API_BASE_URL, DEFAULT_HEADERS } from "../constant/config";
import { ENDPOINTS } from "../constant/environment";
import { ApiResponse } from "../types/apiTypes";
import { Contract, ContractObligation } from "../types/contract";

// Import expo modules
const FileSystem = require('expo-file-system/legacy');
const Sharing = require('expo-sharing');

export const ContractService = {
  async getMine(token?: string): Promise<ApiResponse<Contract[]>> {
    const headers = {
      ...DEFAULT_HEADERS,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONTRACT.MINE}`, {
        method: "GET",
        headers,
        credentials: "include",
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      return { success: response.ok, data, message: data?.message };
    } catch (error) {
      console.error("Error en getMine contracts:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  async getById(id: number, token?: string): Promise<ApiResponse<Contract>> {
    const headers = {
      ...DEFAULT_HEADERS,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONTRACT.ID(id)}`, {
        method: "GET",
        headers,
        credentials: "include",
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      return { success: response.ok, data, message: data?.message };
    } catch (error) {
      console.error("Error en getById contract:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  async downloadPdf(id: number, token?: string): Promise<ApiResponse<string>> {
    try {
      const pdfUrl = `${API_BASE_URL}${ENDPOINTS.CONTRACT.PDF(id)}`;
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Download the PDF file to cache directory first
      const filename = `contrato_${id}_${Date.now()}.pdf`;
      const downloadResult = await FileSystem.downloadAsync(pdfUrl, FileSystem.cacheDirectory + filename, {
        headers
      });

      // Try to open the downloaded file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Contrato #${id}`,
        });
        return {
          success: true,
          data: downloadResult.uri,
          message: 'PDF descargado y abierto exitosamente'
        };
      } else {
        return {
          success: true,
          data: downloadResult.uri,
          message: `PDF guardado en: ${downloadResult.uri}`
        };
      }
    } catch (error) {
      console.error("Error en downloadPdf contract:", error);
      return { success: false, message: "Error al descargar el PDF" };
    }
  },

  // Helper method to convert ArrayBuffer to base64
  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },

  async getObligations(id: number, token?: string): Promise<ApiResponse<ContractObligation[]>> {
    const headers = {
      ...DEFAULT_HEADERS,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONTRACT.OBLIGATIONS(id)}`, {
        method: "GET",
        headers,
        credentials: "include",
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      return { success: response.ok, data, message: data?.message };
    } catch (error) {
      console.error("Error en getObligations contract:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  async getMetrics(token?: string): Promise<ApiResponse<{
    activos: number;
    inactivos: number;
    total: number;
  }>> {
    const headers = {
      ...DEFAULT_HEADERS,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONTRACT.METRICS}`, {
        method: "GET",
        headers,
        credentials: "include",
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      return { success: response.ok, data, message: data?.message };
    } catch (error) {
      console.error("Error en getMetrics contract:", error);
      return { success: false, message: "Error de conexión" };
    }
  },
};