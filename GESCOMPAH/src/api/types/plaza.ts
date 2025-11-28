export interface Plaza {
  id: number;
  name: string;
  description?: string;
  address?: string;
  images?: PlazaImage[];
  active?: boolean;
}

export interface PlazaImage {
  id: number;
  filePath: string;
  plazaId: number;
}

export interface PlazaCard {
  id: number;
  name: string;
  imageUrl?: string;
  establishmentCount?: number;
}