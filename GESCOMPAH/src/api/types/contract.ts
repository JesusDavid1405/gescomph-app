// Contract types
export interface Contract {
  id: number;
  fullName: string;
  document: string;
  phone: string;
  email: string;
  startDate: string;
  endDate: string;
  totalBaseRentAgreed: number;
  totalUvtQtyAgreed: number;
  active: boolean;
  premisesLeased?: PremisesLeased[];
  clauses?: any[];
  personId?: number;
  address?: string;
}

export interface PremisesLeased {
  id: number;
  establishmentId: number;
  establishmentName: string;
  description: string;
  areaM2: number;
  rentValueBase: number;
  address: string;
  plazaName: string;
  images: any[];
}

export interface ContractObligation {
  id: number;
  contractId: number;
  active: boolean;
  baseAmount: number;
  lateAmount: number;
  totalAmount: number;
  vatAmount: number;
  dueDate: string;
  paymentDate: string | null;
  status: string; // API returns: "Aprobada", "PreJuridico", etc.
  daysLate: number;
  locked: boolean;
  month: number;
  year: number;
  uvtQtyApplied: number;
  uvtValueApplied: number;
  vatRateApplied: number;
}

export interface ContractDetails extends Contract {
  obligations?: ContractObligation[];
  createdAt: string;
  updatedAt: string;
}