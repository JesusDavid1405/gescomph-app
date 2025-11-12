import CookieManager from "@react-native-cookies/cookies";
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

  async create(establishmentData: CreateEstablishmentRequest): Promise<ApiResponse<Establishment>> {
    try {
      console.log("🧱 Creando establecimiento:", establishmentData);

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
      console.log("📤 Subiendo imágenes...");
      console.log("📦 Datos recibidos en uploadImages:", imageData);

      // Obtenemos las cookies guardadas del backend
      const cookies = await CookieManager.get(API_BASE_URL);
      console.log("🍪 Cookies actuales:", cookies);

      const formData = new FormData();

      imageData.images.forEach((image, index) => {
        const file = {
          uri: image.uri,
          type: image.type?.startsWith("image/") ? image.type : "image/jpeg",
          name: image.fileName ?? `image_${index}_${Date.now()}.jpg`,
        } as any;

        console.log(`🖼️ Agregando imagen [${index + 1}] al FormData:`, file);
        formData.append("files", file);
      });

      // 📍 Construimos la URL final
      const url = `${API_BASE_URL}${ENDPOINTS.IMAGE.UPLOAD(
        imageData.entityType as "Establishment" | "Plaza",
        imageData.entityId
      )}`;

      console.log("🌍 URL de subida:", url);
      console.log("🧾 Cantidad de imágenes en FormData:", imageData.images.length);

      // 🔥 Enviamos la cookie manualmente en los headers
      const response = await fetch(url, {
        method: "POST",
        headers: {
          // Ojo: en tu caso el token parece ser un JWT, no una cookie
          Authorization: `Bearer ${cookies?.session?.value || cookies?.jwt?.value || ""}`,
        },
        body: formData,
      });

      console.log("📡 Código de respuesta:", response.status);

      const text = await response.text(); // ← evita error de parseo vacío
      console.log("📥 Respuesta del servidor (texto crudo):", text);

      const data = text ? JSON.parse(text) : null;
      console.log("✅ JSON parseado:", data);

      return { success: response.ok, data, message: data?.message ?? "" };
    } catch (error) {
      console.error("❌ Error en uploadImages:", error);
      return { success: false, message: "Error de conexión" };
    }
  },


  async createWithImages(establishmentData: CreateEstablishmentRequest, images: ImagePickerAsset[]): Promise<ApiResponse<Establishment>> {
    try {
      console.log("🏗️ Creando establecimiento con imágenes...");
      const createResult = await this.create(establishmentData);

      if (!createResult.success || !createResult.data) {
        return createResult;
      }

      const establishment = createResult.data;

      if (images && images.length > 0) {
        console.log(`📤 Subiendo ${images.length} imágenes...`);
        // ⚡ Aquí también usamos uploadImages (que ya maneja cookies)
        await this.uploadImages({
          images,
          entityType: "Establishment",
          entityId: establishment.id,
        });
      }

      return createResult;
    } catch (error) {
      console.error("Error en createWithImages:", error);
      return { success: false, message: "Error de conexión" };
    }
  },
};
