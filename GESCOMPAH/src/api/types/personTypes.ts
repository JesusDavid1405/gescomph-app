export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    document: string;
    address: string;
    email: string;
    phone: string;
    cityId: number;
}

export interface PersonUpdateModel {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  cityId: number;
}