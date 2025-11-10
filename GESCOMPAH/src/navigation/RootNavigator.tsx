import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

export default function RootNavigator() {
  const { user } = useContext(AuthContext);

  return user ? <AppNavigator /> : <AuthNavigator />;
}
