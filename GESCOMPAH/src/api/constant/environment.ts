// src/api/constant/endpoints.ts
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh-token",
    RECOVER: "/auth/recuperar/enviar-codigo",
    RECOVER_VERIFY: "/auth/recuperar/confirmar",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE: "/user/update",
  },
  APPOINTMENT: {
    BASE: "/appointment",
    ID: (id: string) => `/appointments/${id}`,
  },
  ESTABLISHMENT: {
    BASE: "/establishments",
    ID: (id: string) => `/establishments/${id}`,
  },
  IMAGE: {
    UPLOAD: (entityType: "Establishment" | "Plaza", entityId: number) => `/images/${entityType}/${entityId}`,
  },
};
