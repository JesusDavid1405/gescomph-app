import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Establishment } from '../../api/types/establishment';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

interface HeroSectionProps {
  establishment: Establishment;
  selectedImage: number;
  setSelectedImage: (index: number) => void;
}

export default function HeroSection({ establishment, selectedImage, setSelectedImage }: HeroSectionProps) {
  const { colors } = useTheme();
  const locationBadgeBackground = colors.background === '#FFFFFF' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)';
  return (
    <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
      {establishment.images && establishment.images.length > 0 && (
        <>
          <Image
            source={{ uri: establishment.images[selectedImage].filePath }}
            style={styles.mainImage}
            resizeMode="cover"
          />

          {/* Thumbnail Gallery */}
          <View style={styles.thumbnailContainer}>
            {establishment.images.slice(0, 4).map((image, index) => (
              <TouchableOpacity
                key={image.id}
                onPress={() => setSelectedImage(index)}
                style={[
                  styles.thumbnail,
                  selectedImage === index && [styles.thumbnailActive, { borderColor: colors.primary }]
                ]}
              >
                <Image
                  source={{ uri: image.filePath }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Location Badge */}
          <View style={[styles.locationBadge, { backgroundColor: locationBadgeBackground }]}>
            <Text style={[styles.title, { color: colors.text }]}>{establishment.name}</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={[styles.locationText, { color: colors.textSecondary }]}>{establishment.address}</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    height: 450,
    position: 'relative',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailContainer: {
    position: 'absolute',
    right: 16,
    top: 80,
    gap: 12,
    zIndex: 5,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'white',
    overflow: 'hidden',
  },
  thumbnailActive: {
    transform: [{ scale: 1.05 }],
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  locationBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 100,
    padding: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationIcon: {
    fontSize: 14,
  },
  locationText: {
    fontSize: 14,
    flex: 1,
  },
});