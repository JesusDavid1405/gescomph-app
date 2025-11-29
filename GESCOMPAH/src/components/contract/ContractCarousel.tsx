import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Contract } from '../../api/types/contract';
import { useTheme } from '../../context/ThemeContext';

interface ContractCarouselProps {
  contracts: Contract[];
  onViewDetails: (contract: Contract) => void;
}

export default function ContractCarousel({ contracts, onViewDetails }: ContractCarouselProps) {
  const { colors } = useTheme();


  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carouselContainer}
      pagingEnabled
      snapToInterval={340}
      decelerationRate="fast"
    >
      {contracts.map((contract) => (
        <View key={contract.id} style={[styles.carouselCard, { backgroundColor: colors.surface }]}>
          {/* Header con ID y Status */}
          <View style={styles.carouselHeader}>
            <View style={[styles.contractIdBadge, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="document-text" size={16} color={colors.primary} />
              <Text style={[styles.contractIdText, { color: colors.primary }]}>
                #{contract.id}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: contract.active ? `${colors.success}20` : `${colors.danger}20` }]}>
              <Text style={[styles.statusText, { color: contract.active ? colors.success : colors.danger }]}>
                {contract.active ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </View>

          {/* Nombre del arrendatario */}
          <Text style={[styles.carouselTitle, { color: colors.text }]} numberOfLines={2}>
            {contract.fullName}
          </Text>

          {/* Info cards */}
          <View style={styles.infoCardsRow}>
            {/* Periodo */}
            <View style={[styles.infoCard, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="calendar" size={18} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Periodo</Text>
              <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>
                {formatDate(contract.startDate)}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>
                {formatDate(contract.endDate)}
              </Text>
            </View>

            {/* Total Base */}
            <View style={[styles.infoCard, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="cash" size={18} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Total Base</Text>
              <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>
                ${formatCurrency(contract.totalBaseRentAgreed || 0)}
              </Text>
              <Text style={[styles.infoValueSmall, { color: colors.textMuted }]}>
                {contract.totalUvtQtyAgreed} UVT
              </Text>
            </View>
          </View>

          {/* Locales arrendados */}
          {contract.premisesLeased && contract.premisesLeased.length > 0 && (
            <View style={[styles.locationsContainer, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="location" size={14} color={colors.textMuted} />
              <Text style={[styles.locationsText, { color: colors.textSecondary }]} numberOfLines={1}>
                {contract.premisesLeased.map(p => p.establishmentName).join(', ')}
              </Text>
            </View>
          )}

          {/* Botón Ver Detalle */}
          <TouchableOpacity
            style={[styles.detailButton, { backgroundColor: colors.primary }]}
            onPress={() => onViewDetails(contract)}
          >
            <Ionicons name="document-text" size={18} color="#FFFFFF" />
            <Text style={styles.detailButtonText}>Ver Detalle</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };
  return date.toLocaleDateString('es-ES', options);
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('es-CO');
};

const styles = StyleSheet.create({
  carouselContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  carouselCard: {
    width: 320,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  carouselHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contractIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  contractIdText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoValueSmall: {
    fontSize: 11,
  },
  locationsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  locationsText: {
    fontSize: 12,
    flex: 1,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});