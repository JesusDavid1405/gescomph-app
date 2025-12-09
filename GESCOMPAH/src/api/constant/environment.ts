// src/api/constant/endpoints.ts
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/mobile/login",
    REFRESH: "/auth/mobile/refresh",
    RECOVER: "/auth/recuperar/enviar-codigo",
    RECOVER_VERIFY: "/auth/recuperar/confirmar",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE: "/user/update",
  },
  APPOINTMENT: {
    BASE: "/appointment",
    ID: (id: string) => `/appointments/${id}`,
    GET_BY_DATE: (date: string) => `/Appointment/GetByDate?date=${date}`,
    GET_BY_PERSON_ID: (personId: number) => `/Appointment/GetByPersonId?personId=${personId}`,
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
  CONTRACT: {
    MINE: "/Contract/mine",
    METRICS: "/Contract/metrics",
    ID: (id: number) => `/Contract/${id}`,
    PDF: (id: number) => `/Contract/${id}/pdf`,
    OBLIGATIONS: (id: number) => `/Contract/${id}/obligations`,
  },
  PAYMENTS: {
    CHECKOUT: (obligationId: number) => `/payments/obligations/${obligationId}/checkout`,
  },
  NOTIFICATION: {
    FEED: (userId: number) => `/Notification/feed/${userId}`,
    UNREAD: (userId: number) => `/Notification/${userId}/unread`,
    READ: (notificationId: number) => `/Notification/${notificationId}/read`,
    MARK_ALL_READ: (userId: number) => `/Notification/mark-all/${userId}/read`,
  },
};
