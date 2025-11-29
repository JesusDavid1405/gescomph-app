import React from 'react';
import Header from '../components/Header';
import colors from '../styles/color';

export const defaultHeaderOptions = {
  headerStyle: {
    backgroundColor: 'transparent',
  },
  headerTintColor: colors.primary,
  headerTitle: '',
  headerRight: () => <Header />,
};