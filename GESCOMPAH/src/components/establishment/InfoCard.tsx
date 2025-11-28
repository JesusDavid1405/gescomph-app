import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Establishment } from '../../api/types/establishment';
import { useTheme } from '../../context/ThemeContext';

interface InfoCardProps {
  establishment: Establishment;
}

export default function InfoCard({ establishment }: InfoCardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.statItem}>
        <Text style={[styles.statLabel, { color: colors.textMuted }]}>Área</Text>
        <Text style={[styles.statValue, { color: colors.primary }]}>{establishment.areaM2} m²</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={[styles.statLabel, { color: colors.textMuted }]}>UVT</Text>
        <Text style={[styles.statValue, { color: colors.primary }]}>{establishment.uvtQty}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
});