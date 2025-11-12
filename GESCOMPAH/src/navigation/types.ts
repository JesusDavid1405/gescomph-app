export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  RecoveryCode: { email: string };
  ChangePassword: { email: string; code: string };
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