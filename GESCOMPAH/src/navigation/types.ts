export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  RecoveryCode: { email: string };
  ChangePassword: { email: string; code: string };
};

import { Establishment } from '../api/types/establishment';

export type EstablishmentStackParamList = {
  EstablishmentList: undefined;
  DetailsEstablishment: { establishment: Establishment };
};

export type AppDrawerParamList = {
  Inicio: undefined;
  Citas: undefined;
  Establecimientos: undefined;
  Configuración: undefined;
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  EditProfile: undefined;
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