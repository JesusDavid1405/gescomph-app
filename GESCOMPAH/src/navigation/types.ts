import { Contract } from '../api/types/contract';
import { Establishment } from '../api/types/establishment';

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  RecoveryCode: { email: string };
  ChangePassword: { email: string; code: string };
};

export type EstablishmentStackParamList = {
  EstablishmentList: undefined;
  DetailsEstablishment: { establishment: Establishment };
};

export type ContractStackParamList = {
  ContractList: undefined;
  DetailsContract: { contract: Contract };
};

export type AppDrawerParamList = {
  Inicio: undefined;
  Citas: undefined;
  Establecimientos: undefined;
  Contratos: undefined;
  Configuración: undefined;
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}