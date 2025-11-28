import React from 'react';
import colors from '../styles/color';
import Header from '../components/Header';

export const defaultHeaderOptions = {
  headerStyle: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
  headerTintColor: colors.primary,
  headerTitle: '',
  headerRight: () => <Header />,
};