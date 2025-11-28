import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';
import { Establishment } from '@/src/api/types/establishment';

interface EstablishmentCardProps {
  establishment: Establishment;
}

export default function EstablishmentCard({ establishment }: EstablishmentCardProps) {
  const { colors } = useTheme();
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.primary }]}>
      {/* Header with status */}
      <View style={styles.header}>
        <View style={[styles.statusBadge, establishment.active ? { backgroundColor: '#e8f5e8' } : { backgroundColor: '#ffebee' }]}>
          <Text style={[styles.statusBadgeText, establishment.active ? { color: colors.success } : { color: colors.danger }]}>
            {establishment.active ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>

      {/* Images */}
      {establishment.images && establishment.images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imagesContainer}
          contentContainerStyle={styles.imagesContent}
          pagingEnabled
          snapToInterval={126}
          decelerationRate="fast"
        >
          {establishment.images.map((image) => (
            <Image
              key={image.id}
              source={{ uri: image.filePath }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      {/* Main Info */}
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.primary }]}>{establishment.name}</Text>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Ionicons name="resize-outline" size={14} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Área:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{establishment.areaM2} m²</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={14} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Valor base:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{formatCurrency(establishment.rentValueBase)}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={14} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Dirección:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={2}>{establishment.address}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="calculator-outline" size={14} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>UVT:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{establishment.uvtQty}</Text>
          </View>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginBottom: 16,
    elevation: 2,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  imagesContainer: {
    marginBottom: 20,
  },
  imagesContent: {
    paddingHorizontal: 4,
  },
  image: {
    width: 120,
    height: 80,
    borderRadius: 12,
    marginRight: 6,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    marginLeft: 8,
    minWidth: 70,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
    flex: 1,
  },
});