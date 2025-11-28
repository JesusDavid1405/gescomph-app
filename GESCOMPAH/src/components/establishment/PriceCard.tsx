import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Establishment } from '../../api/types/establishment';
import { useTheme } from '../../context/ThemeContext';

interface PriceCardProps {
  establishment: Establishment;
}

export default function PriceCard({ establishment }: PriceCardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.priceSection, { backgroundColor: colors.background, shadowColor: colors.shadow }]}>
      <Text style={[styles.priceLabel, { color: colors.textMuted }]}>Valor base de alquiler</Text>
      <Text style={[styles.priceValue, { color: colors.text }]}>
        ${establishment.rentValueBase.toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  priceSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  priceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '700',
  },
});