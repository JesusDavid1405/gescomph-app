import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Establishment } from '../api/types/establishment';
import { EstablishmentService } from '../api/services/establishmentServices';

interface SearchFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  onNavigateToDetails?: (establishment: Establishment) => void;
}

export interface FilterValues {
  searchName: string | null;
}

const PLAZAS = [
  'Todas las plazas',
  'Plaza de mercado',
  'Plaza Occidental',
  'Edificio nuevo de la alcaldia',
];

export default function SearchFilterModal({
  visible,
  onClose,
  onApply,
  onNavigateToDetails,
}: SearchFilterModalProps) {
  const { colors } = useTheme();
  // Search and results
  const [searchQuery, setSearchQuery] = useState('');
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadEstablishments();
      setSearchQuery(''); // Clear search when modal opens
    }
  }, [visible]);

  useEffect(() => {
    applyFiltersToData();
  }, [searchQuery, establishments]);

  const loadEstablishments = async () => {
    setLoading(true);
    try {
      const result = await EstablishmentService.getAll();
      if (result.success && result.data) {
        setEstablishments(result.data);
        setFilteredEstablishments(result.data);
      }
    } catch (error) {
      console.error('Error loading establishments:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersToData = () => {
    if (!searchQuery.trim()) {
      setFilteredEstablishments(establishments);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = establishments.filter((est) =>
      est.name.toLowerCase().includes(query) ||
      est.description.toLowerCase().includes(query) ||
      est.plazaName.toLowerCase().includes(query) ||
      est.address.toLowerCase().includes(query)
    );

    setFilteredEstablishments(filtered);
  };

  const handleApply = () => {
    const filters: FilterValues = {
      searchName: searchQuery.trim() || null,
    };
    onApply(filters);
    setSearchQuery(''); // Clear the input automatically
  };

  const handleClearFilters = () => {
    setSearchQuery('');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const renderEstablishment = ({ item }: { item: Establishment }) => (
    <TouchableOpacity
      style={[styles.resultItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => {
        if (onNavigateToDetails) {
          onNavigateToDetails(item);
          onClose(); // Close modal after navigation
        }
      }}
    >
      <View style={styles.resultInfo}>
        <Text style={[styles.resultName, { color: colors.text }]}>{item.name}</Text>
        <View style={styles.resultDetails}>
          <Text style={[styles.resultDetail, { color: colors.textSecondary }]}>
            <Ionicons name="resize-outline" size={12} color={colors.textSecondary} />
            {' '}{item.areaM2} m²
          </Text>
          <Text style={[styles.resultDetail, { color: colors.textSecondary }]}>
            <Ionicons name="cash-outline" size={12} color={colors.textSecondary} />
            {' '}{formatCurrency(item.rentValueBase)}
          </Text>
        </View>
        <Text style={[styles.resultLocation, { color: colors.textSecondary }]}>
          <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
          {' '}{item.plazaName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.surface }]} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Buscar y Filtrar</Text>
            <TouchableOpacity style={[styles.doneButton, { backgroundColor: colors.primary }]} onPress={handleApply}>
              <Text style={styles.doneButtonText}>Listo</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Search Input */}
            <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
              <Ionicons name="search" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Buscar establecimientos..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={colors.textSecondary}
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Results Section */}
            <View style={styles.resultsSection}>
              <Text style={[styles.resultsTitle, { color: colors.text }]}>
                Resultados ({filteredEstablishments.length})
              </Text>

              {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
              ) : filteredEstablishments.length > 0 ? (
                <FlatList
                  data={filteredEstablishments}
                  renderItem={renderEstablishment}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              ) : (
                <View style={styles.emptyResults}>
                  <Ionicons name="search-outline" size={48} color={colors.textMuted} />
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>No se encontraron resultados</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  doneButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
    marginBottom: 24,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInputInFilter: {
    flex: 1,
    fontSize: 16,
  },
  filtersSection: {
    marginBottom: 24,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  rangeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rangeInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  currencySymbol: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: '600',
  },
  unitText: {
    fontSize: 14,
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  rangeSeparator: {
    fontSize: 16,
    fontWeight: '600',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  dropdownItemSelected: {
  },
  dropdownItemText: {
    fontSize: 16,
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
  },
  resultsSection: {
    marginBottom: 32,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  resultItem: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  resultDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  resultDetail: {
    fontSize: 14,
  },
  resultLocation: {
    fontSize: 14,
    marginTop: 4,
  },
  separator: {
    height: 12,
  },
  loader: {
    marginVertical: 32,
  },
  emptyResults: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});