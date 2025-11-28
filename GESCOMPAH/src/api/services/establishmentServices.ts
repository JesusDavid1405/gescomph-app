import { API_BASE_URL, DEFAULT_HEADERS } from "../constant/config";
import { ENDPOINTS } from "../constant/environment";
import { ApiResponse } from "../types/apiTypes";
import { Establishment, CreateEstablishmentRequest } from "../types/establishment";
import { ImagePickerAsset } from "expo-image-picker";

export const EstablishmentService = {
  async getAll(): Promise<ApiResponse<Establishment[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ESTABLISHMENT.BASE}`, {
        method: "GET",
        headers: DEFAULT_HEADERS,
        credentials: "include",
      });

      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error("Error en getAll establishments:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  async getById(id: number): Promise<ApiResponse<Establishment>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ESTABLISHMENT.ID(id)}`, {
        method: "GET",
        headers: DEFAULT_HEADERS,
        credentials: "include",
      });

      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error("Error en getById establishment:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  async getByPlaza(plazaId: number): Promise<ApiResponse<Establishment[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ESTABLISHMENT.BY_PLAZA(plazaId)}`, {
        method: "GET",
        headers: DEFAULT_HEADERS,
        credentials: "include",
      });

      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error("Error en getByPlaza establishments:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  async create(establishmentData: CreateEstablishmentRequest): Promise<ApiResponse<Establishment>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ESTABLISHMENT.BASE}`, {
        method: "POST",
        headers: DEFAULT_HEADERS,
        credentials: "include",
        body: JSON.stringify(establishmentData),
      });

      const data = await response.json();

      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error("Error en create establishment:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  async uploadImages(imageData: { images: ImagePickerAsset[]; entityType: string; entityId: number }): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();

      imageData.images.forEach((image, index) => {
        const file = {
          uri: image.uri,
          type: image.type?.startsWith("image/") ? image.type : "image/jpeg",
          name: image.fileName ?? `image_${index}_${Date.now()}.jpg`,
        } as any;

        formData.append("files", file);
      });

      const url = `${API_BASE_URL}${ENDPOINTS.IMAGE.UPLOAD(
        imageData.entityType as "Establishment" | "Plaza",
        imageData.entityId
      )}`;

      const response = await fetch(url, {
        method: "POST",
        headers: DEFAULT_HEADERS,
        credentials: "include",
        body: formData,
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      return { success: response.ok, data, message: data?.message ?? "" };
    } catch (error) {
      return { success: false, message: "Error de conexión" };
    }
  },


  async createWithImages(establishmentData: CreateEstablishmentRequest, images: ImagePickerAsset[]): Promise<ApiResponse<Establishment>> {
    try {
      const createResult = await this.create(establishmentData);

      if (!createResult.success || !createResult.data) {
        return createResult;
      }

      const establishment = createResult.data;

      if (images && images.length > 0) {
        await this.uploadImages({
          images,
          entityType: "Establishment",
          entityId: establishment.id,
        });
      }

      return createResult;
    } catch (error) {
      return { success: false, message: "Error de conexión" };
    }
  },
};
