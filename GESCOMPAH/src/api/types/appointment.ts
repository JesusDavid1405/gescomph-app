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