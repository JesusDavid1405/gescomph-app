// src/api/types/appointment.ts
export interface Appointment {
  id: number;
  description: string;
  requestDate: string;
  dateTimeAssigned: string;
  active: boolean;
  personId: number;
  personName: string;
  phone: string;
  establishmentId: number;
  establishmentName: string;
}

export interface AppointmentBaseModel {
  description: string;
  observation?: string;
  requestDate: Date;
  dateTimeAssigned: Date;
  establishmentId: number;
  active: boolean;
}

export interface AppointmentCreateModel extends AppointmentBaseModel {
  firstName: string;
  lastName: string;
  document: string;
  address: string;
  email: string;
  phone: string;
  cityId: number;
}