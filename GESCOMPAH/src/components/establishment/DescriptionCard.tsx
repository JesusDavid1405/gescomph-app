import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Establishment } from '../../api/types/establishment';
import { useTheme } from '../../context/ThemeContext';

interface DescriptionCardProps {
  establishment: Establishment;
}

export default function DescriptionCard({ establishment }: DescriptionCardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.descriptionContainer, { backgroundColor: colors.background, shadowColor: colors.shadow }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Descripción</Text>
      <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
        {establishment.description}
      </Text>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Plaza</Text>
      <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
        {establishment.plazaName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  descriptionContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },
});
