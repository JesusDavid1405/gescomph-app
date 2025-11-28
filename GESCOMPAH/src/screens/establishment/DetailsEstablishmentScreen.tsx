import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { EstablishmentStackParamList } from '../../navigation/types';
import { Establishment } from '../../api/types/establishment';
import { useTheme } from '../../context/ThemeContext';
import HeroSection from '../../components/establishment/HeroSection';
import InfoCard from '../../components/establishment/InfoCard';
import DescriptionCard from '../../components/establishment/DescriptionCard';
import PriceCard from '../../components/establishment/PriceCard';
import AppointmentModal from '../../components/establishment/AppointmentModal';
import { useHeaderHeight } from '@react-navigation/elements';

type DetailsEstablishmentRouteProp = RouteProp<EstablishmentStackParamList, 'DetailsEstablishment'>;

export default function DetailsEstablishmentScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<DetailsEstablishmentRouteProp>();
  const headerHeight = useHeaderHeight();
  const { establishment } = route.params;

  const [selectedImage, setSelectedImage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: colors.text,
      headerStyle: { backgroundColor: colors.surface },
    });
  }, [navigation, colors]);

  return (
    <View style={[styles.container, { paddingTop: headerHeight, backgroundColor: colors.surfaceSecondary }]}>
      <ScrollView style={[styles.scrollView]} contentContainerStyle={styles.scrollContent}>
        <HeroSection
          establishment={establishment}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        <InfoCard establishment={establishment} />
        <DescriptionCard establishment={establishment} />
        <PriceCard establishment={establishment} />
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.scheduleButton, { backgroundColor: colors.primary, shadowColor: colors.shadow }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.buttonText, { color: colors.textLight }]}>Agendar cita</Text>
          <Text style={[styles.arrowIcon, { color: colors.textLight }]}>→</Text>
        </TouchableOpacity>
      </View>

      <AppointmentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        establishment={establishment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  scheduleButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  arrowIcon: {
    fontSize: 20,
  },
});