import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import SearchFilterModal, { FilterValues } from './SearchFilterModal';
import { useSearch } from '../context/SearchContext';
import { Establishment } from '../api/types/establishment';

interface SearchButtonProps {
  onNavigateToDetails?: (establishment: Establishment) => void;
}

export default function SearchButton({ onNavigateToDetails }: SearchButtonProps) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const { setAppliedFilters, navigateToDetails } = useSearch();

  const handleApplyFilters = (filters: FilterValues) => {
    setModalVisible(false);
    setAppliedFilters(filters);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.iconButton, { backgroundColor: colors.surface }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="search" size={24} color={colors.text} />
      </TouchableOpacity>

      <SearchFilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApply={handleApplyFilters}
        onNavigateToDetails={onNavigateToDetails || navigateToDetails}
      />
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});