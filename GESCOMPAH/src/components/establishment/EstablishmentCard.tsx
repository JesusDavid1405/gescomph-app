import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/src/styles/color';
import { Establishment } from '@/src/api/types/establishment';

interface EstablishmentCardProps {
  establishment: Establishment;
}

export default function EstablishmentCard({ establishment }: EstablishmentCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <View style={styles.card}>
      {/* Header with status */}
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, establishment.active ? styles.activeDot : styles.inactiveDot]} />
          <Text style={[styles.statusText, establishment.active ? styles.activeText : styles.inactiveText]}>
            {establishment.active ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
        <Text style={styles.idText}>ID: {establishment.id}</Text>
      </View>

      {/* Images */}
      {establishment.images && establishment.images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imagesContainer}
          contentContainerStyle={styles.imagesContent}
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
        <Text style={styles.name}>{establishment.name}</Text>
        <Text style={styles.description}>{establishment.description}</Text>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Ionicons name="resize-outline" size={16} color={colors.primary} />
            <Text style={styles.detailLabel}>Área:</Text>
            <Text style={styles.detailValue}>{establishment.areaM2} m²</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={16} color={colors.primary} />
            <Text style={styles.detailLabel}>Valor base:</Text>
            <Text style={styles.detailValue}>{formatCurrency(establishment.rentValueBase)}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color={colors.primary} />
            <Text style={styles.detailLabel}>Dirección:</Text>
            <Text style={styles.detailValue} numberOfLines={2}>{establishment.address}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="business-outline" size={16} color={colors.primary} />
            <Text style={styles.detailLabel}>Plaza:</Text>
            <Text style={styles.detailValue}>{establishment.plazaName}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="calculator-outline" size={16} color={colors.primary} />
            <Text style={styles.detailLabel}>UVT:</Text>
            <Text style={styles.detailValue}>{establishment.uvtQty}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  activeDot: {
    backgroundColor: colors.success,
  },
  inactiveDot: {
    backgroundColor: colors.danger,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: colors.success,
  },
  inactiveText: {
    color: colors.danger,
  },
  idText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  imagesContainer: {
    marginBottom: 12,
  },
  imagesContent: {
    paddingHorizontal: 4,
  },
  image: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    minWidth: 70,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginLeft: 4,
    flex: 1,
  },
});