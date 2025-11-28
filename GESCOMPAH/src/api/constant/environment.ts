// src/api/constant/endpoints.ts
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/mobile/login",
    REFRESH: "/auth/mobile/refresh",
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
    GET_BY_DATE: (date: string) => `/Appointment/GetByDate?date=${date}`,
  },
  ESTABLISHMENT: {
    BASE: "/establishments?activeOnly=true",
    ID: (id: number) => `/establishments/${id}`,
    BY_PLAZA: (plazaId: number) => `/Establishments/plaza/${plazaId}?activeOnly=true`,
  },
  IMAGE: {
    UPLOAD: (entityType: "Establishment" | "Plaza", entityId: number) => `/images/${entityType}/${entityId}`,
  },
  PERSON: {
    BASE: "/person",
    ID: (id: number) => `/person/${id}`,
  },
  PLAZA: {
    CARDS: "/Plaza/cards",
  },
  DEPARTMENT: {
    BASE: "/department",
  },
  CITY: {
    ID: (id: number) => `/city/${id}`,
    BY_DEPARTMENT: (departmentId: number) => `/city/CityWithDepartment/${departmentId}`,
  },
};
