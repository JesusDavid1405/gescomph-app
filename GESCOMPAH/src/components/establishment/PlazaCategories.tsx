import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface Plaza {
  id: number;
  name: string;
}

interface PlazaCategoriesProps {
  plazas: Plaza[];
  selectedPlaza: number;
  onSelectPlaza: (plazaId: number) => void;
}

export default function PlazaCategories({
  plazas,
  selectedPlaza,
  onSelectPlaza,
}: PlazaCategoriesProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.categoriesContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContent}
      >
        {plazas.map((plaza) => (
          <TouchableOpacity
            key={plaza.id}
            style={[
              styles.categoryButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
              selectedPlaza === plaza.id && { backgroundColor: colors.text, borderColor: colors.text },
            ]}
            onPress={() => onSelectPlaza(plaza.id)}
          >
            <Text
              style={[
                styles.categoryText,
                { color: colors.text },
                selectedPlaza === plaza.id && { color: colors.background },
              ]}
            >
              {plaza.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryButtonActive: {
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
  },
});