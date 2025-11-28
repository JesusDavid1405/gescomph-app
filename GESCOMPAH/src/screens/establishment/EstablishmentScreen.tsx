import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EstablishmentStackParamList } from '../../navigation/types';
import { Establishment } from '@/src/api/types/establishment';
import { EstablishmentService } from '@/src/api/services/establishmentServices';
import { PlazaService } from '@/src/api/services/plazaServices';
import { PlazaCard } from '@/src/api/types/plaza';
import { useTheme } from '@/src/context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import PlazaCategories from '../../components/establishment/PlazaCategories';
import EstablishmentDiscoverCard from '../../components/establishment/EstablishmentDiscoverCard';
import FeaturedSection from '../../components/establishment/FeaturedSection';
import { useSearch } from '../../context/SearchContext';

type DiscoverScreenNavigationProp = NativeStackNavigationProp<
  EstablishmentStackParamList,
  'EstablishmentList'
>;

export default function EstablishmentScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<DiscoverScreenNavigationProp>();
  const headerHeight = useHeaderHeight();
  const { appliedFilters, setNavigateToDetails } = useSearch();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredEstablishments, setFeaturedEstablishments] = useState<Establishment[]>([]);
  const [plazas, setPlazas] = useState<PlazaCard[]>([]);
  const [selectedPlaza, setSelectedPlaza] = useState<number>(0);
  const [allEstablishments, setAllEstablishments] = useState<Establishment[]>([]);

  useEffect(() => {
    loadPlazas();
    loadAllEstablishments();
  }, []);

  useEffect(() => {
    setNavigateToDetails(() => handleNavigateToDetails);
  }, []);

  useEffect(() => {
    if (selectedPlaza > 0) {
      loadEstablishmentsByPlaza(selectedPlaza);
    }
  }, [selectedPlaza]);

  const loadPlazas = async () => {
    try {
      const result = await PlazaService.getCards();
      if (result.success && result.data) {
        setPlazas(result.data);
        if (result.data.length > 0) {
          setSelectedPlaza(result.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading plazas:', error);
    }
  };

  const loadAllEstablishments = async () => {
    try {
      const result = await EstablishmentService.getAll();
      if (result.success && result.data) {
        setAllEstablishments(result.data);
        // Get random 4 establishments for featured section from all establishments
        const shuffled = [...result.data].sort(() => 0.5 - Math.random());
        setFeaturedEstablishments(shuffled.slice(0, 4));
      }
    } catch (error) {
      console.error('Error loading all establishments:', error);
    }
  };

  const loadEstablishmentsByPlaza = async (plazaId: number) => {
    try {
      setLoading(true);
      const result = await EstablishmentService.getByPlaza(plazaId);
      if (result.success && result.data) {
        setEstablishments(result.data);
      }
    } catch (error) {
      console.error('Error loading establishments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEstablishmentPress = (establishment: Establishment) => {
    navigation.navigate('DetailsEstablishment', { establishment });
  };

  const handleNavigateToDetails = (establishment: Establishment) => {
    navigation.navigate('DetailsEstablishment', { establishment });
  };

  const getFilteredEstablishments = () => {
    if (!appliedFilters || !appliedFilters.searchName) return establishments;

    const query = appliedFilters.searchName.toLowerCase();
    return establishments.filter((est) =>
      est.name.toLowerCase().includes(query) ||
      est.description.toLowerCase().includes(query) ||
      est.plazaName.toLowerCase().includes(query) ||
      est.address.toLowerCase().includes(query)
    );
  };

  const filteredEstablishments = getFilteredEstablishments();

  return (
    <View style={[styles.container, { paddingTop: headerHeight, backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PlazaCategories
          plazas={plazas}
          selectedPlaza={selectedPlaza}
          onSelectPlaza={setSelectedPlaza}
        />

        {/* Establishments Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
          pagingEnabled
          snapToInterval={340}
          decelerationRate="fast"
        >
          {filteredEstablishments.length > 0 ? (
            filteredEstablishments.map((establishment) => (
              <EstablishmentDiscoverCard
                key={establishment.id}
                establishment={establishment}
                onPress={() => handleEstablishmentPress(establishment)}
              />
            ))
          ) : (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No hay establecimientos en esta plaza
              </Text>
            </View>
          )}
        </ScrollView>

        <FeaturedSection
          featuredEstablishments={featuredEstablishments}
          onEstablishmentPress={handleEstablishmentPress}
        />
      </ScrollView>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  emptyCard: {
    width: 320,
    height: 420,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});