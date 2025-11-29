import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Contract } from '../../api/types/contract';
import { useTheme } from '../../context/ThemeContext';

interface ContractMiniCardProps {
  contract: Contract;
  onViewDetails: (contract: Contract) => void;
  onDownload: (contract: Contract) => void;
}

export default function ContractMiniCard({ contract, onViewDetails, onDownload }: ContractMiniCardProps) {
  const { colors } = useTheme();


  return (
    <View style={[styles.miniCard, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.miniCardHeader}>
        <View style={styles.miniCardTitleRow}>
          <View style={[styles.contractIdBadgeSmall, { backgroundColor: `${colors.primary}15` }]}>
            <Text style={[styles.contractIdTextSmall, { color: colors.primary }]}>
              #{contract.id}
            </Text>
          </View>
          <View style={[
            styles.statusBadgeSmall,
            { backgroundColor: contract.active ? `${colors.success}20` : `${colors.danger}20` }
          ]}>
            <Text style={[
              styles.statusTextSmall,
              { color: contract.active ? colors.success : colors.danger }
            ]}>
              {contract.active ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>
        <Text style={[styles.miniCardTitle, { color: colors.text }]} numberOfLines={1}>
          {contract.fullName}
        </Text>
      </View>

      {/* Info Row */}
      <View style={styles.miniCardInfo}>
        <View style={styles.miniInfoItem}>
          <Ionicons name="calendar" size={14} color={colors.textMuted} />
          <Text style={[styles.miniInfoText, { color: colors.textSecondary }]}>
            {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
          </Text>
        </View>
        <View style={styles.miniInfoItem}>
          <Ionicons name="cash" size={14} color={colors.textMuted} />
          <Text style={[styles.miniInfoText, { color: colors.textSecondary }]}>
            ${formatCurrency(contract.totalBaseRentAgreed || 0)}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.miniCardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.downloadButton, { backgroundColor: `${colors.primary}15` }]}
          onPress={() => onDownload(contract)}
        >
          <Ionicons name="download" size={16} color={colors.primary} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>Descargar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => onViewDetails(contract)}
        >
          <Ionicons name="document-text" size={16} color="#FFFFFF" />
          <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Ver Detalle</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  miniCard: {
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  miniCardHeader: {
    marginBottom: 12,
  },
  miniCardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contractIdBadgeSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  contractIdTextSmall: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadgeSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTextSmall: {
    fontSize: 11,
    fontWeight: '600',
  },
  miniCardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  miniCardInfo: {
    gap: 8,
    marginBottom: 12,
  },
  miniInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniInfoText: {
    fontSize: 13,
  },
  miniCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  downloadButton: {
    flex: 0.9,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});