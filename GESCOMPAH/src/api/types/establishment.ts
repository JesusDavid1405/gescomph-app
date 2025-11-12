// src/api/types/establishment.ts
import { ImagePickerAsset } from 'expo-image-picker';

export interface EstablishmentImage {
  fileName: string;
  filePath: string;
  publicId: string;
  establishmentId: number;
  id: number;
}

export interface Establishment {
  id: number;
  name: string;
  description: string;
  areaM2: number;
  rentValueBase: number;
  address: string;
  plazaId: number;
  plazaName: string;
  active: boolean;
  uvtQty: number;
  images: EstablishmentImage[];
}

export interface CreateEstablishmentRequest {
  name: string;
  description: string;
  areaM2: number;
  uvtQty: number;
  address: string;
  plazaId: number;
}

export interface UploadImageRequest {
  file: ImagePickerAsset;
  entityType: 'Establishment' | 'Plaza';
  entityId: number;
}