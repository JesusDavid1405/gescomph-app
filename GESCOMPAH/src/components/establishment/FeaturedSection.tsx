import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Establishment } from '../../api/types/establishment';
import { useTheme } from '../../context/ThemeContext';

interface FeaturedSectionProps {
  featuredEstablishments: Establishment[];
  onEstablishmentPress: (establishment: Establishment) => void;
  onMorePress?: () => void;
}

export default function FeaturedSection({
  featuredEstablishments,
  onEstablishmentPress,
  onMorePress,
}: FeaturedSectionProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.featuredSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Destacados</Text>
        <TouchableOpacity onPress={onMorePress}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.featuredGrid}>
        {featuredEstablishments.map((establishment) => (
          <TouchableOpacity
            key={establishment.id}
            style={styles.featuredCard}
            onPress={() => onEstablishmentPress(establishment)}
          >
            {establishment.images && establishment.images.length > 0 && (
              <Image
                source={{ uri: establishment.images[0].filePath }}
                style={styles.featuredImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.featuredOverlay}>
              <Text style={styles.featuredName} numberOfLines={1}>
                {establishment.name}
              </Text>
              <Text style={styles.featuredLocation} numberOfLines={1}>
                {establishment.address}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  featuredSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featuredCard: {
    width: '48%',
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  featuredName: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    marginBottom: 2,
  },
  featuredLocation: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});