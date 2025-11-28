import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Establishment } from '../../api/types/establishment';
import { useTheme } from '../../context/ThemeContext';

interface EstablishmentDiscoverCardProps {
  establishment: Establishment;
  onPress: () => void;
}

export default function EstablishmentDiscoverCard({
  establishment,
  onPress,
}: EstablishmentDiscoverCardProps) {
  const { colors } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardInfoBackground = colors.background === '#FFFFFF' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.77)';

  useEffect(() => {
    if (establishment.images && establishment.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === establishment.images!.length - 1 ? 0 : prev + 1
        );
      }, 3000); // Cambia cada 3 segundos

      return () => clearInterval(interval);
    }
  }, [establishment.images]);

  return (
    <TouchableOpacity style={[styles.discoverCard, { backgroundColor: colors.surface }]} onPress={onPress}>
      {establishment.images && establishment.images.length > 0 && (
        <Image
          source={{ uri: establishment.images[currentImageIndex].filePath }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.cardContent}>
        <View style={[styles.cardInfo, { backgroundColor: cardInfoBackground }]}>
          <Text style={[styles.cardName, { color: colors.text }]}>{establishment.name}</Text>
          <Text style={[styles.cardLocation, { color: colors.textSecondary }]}>{establishment.address}</Text>
        </View>
      </View>

      {/* Image indicators */}
      {establishment.images && establishment.images.length > 1 && (
        <View style={styles.indicators}>
          {establishment.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentImageIndex === index && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  discoverCard: {
    width: 320,
    height: 420,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  cardInfo: {
    padding: 16,
    borderRadius: 16,
  },
  cardName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 14,
  },
  indicators: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorActive: {
    backgroundColor: 'white',
    width: 20,
  },
});