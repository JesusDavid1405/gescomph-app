import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function DiscoverHeader() {
  const { colors } = useTheme();
  return (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: colors.text }]}>Descubre</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
});