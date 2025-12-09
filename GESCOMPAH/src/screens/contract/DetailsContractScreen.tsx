import { useHeaderHeight } from '@react-navigation/elements';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Linking, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ContractService } from '../../api/services/contractServices';
import { Contract, ContractObligation } from '../../api/types/contract';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ContractStackParamList } from '../../navigation/types';

// Placeholder components - will be created separately
const HeroSectionContract = ({ contract }: { contract: Contract }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
      <View style={styles.heroContent}>
        <Text style={[styles.contractId, { color: colors.textLight }]}>Contrato #{contract.id}</Text>
        <Text style={[styles.lesseeName, { color: colors.textLight }]}>{contract.fullName}</Text>
        <View style={[styles.statusBadge, {
          backgroundColor: contract.active ? `${colors.success}20` : `${colors.danger}20`
        }]}>
          <Text style={[styles.statusText, {
            color: contract.active ? colors.success : colors.danger
          }]}>
            {contract.active ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const InfoCardContract = ({ contract }: { contract: Contract }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Información del Arrendatario</Text>
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Documento:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{contract.document}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Teléfono:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{contract.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Correo:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{contract.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Estado:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{contract.active ? 'Activo' : 'Inactivo'}</Text>
        </View>
      </View>
    </View>
  );
};

const DatesCard = ({ contract }: { contract: Contract }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Periodo del Contrato</Text>
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Fecha Inicio:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{formatDate(contract.startDate)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Fecha Fin:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{formatDate(contract.endDate)}</Text>
        </View>
      </View>
    </View>
  );
};

const LocationsCard = ({ contract }: { contract: Contract }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Espacios Arrendados</Text>
      <View style={styles.cardContent}>
        {contract.premisesLeased && contract.premisesLeased.length > 0 ? (
          contract.premisesLeased.map((premise, index) => (
            <Text key={index} style={[styles.locationItem, { color: colors.text }]}>
              • {premise.establishmentName}
            </Text>
          ))
        ) : (
          <Text style={[styles.noLocations, { color: colors.textSecondary }]}>
            No hay espacios arrendados registrados
          </Text>
        )}
      </View>
    </View>
  );
};

const TotalsCard = ({ contract }: { contract: Contract }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Totales del Contrato</Text>
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Valor Base:</Text>
          <Text style={[styles.value, { color: colors.text }]}>${formatCurrency(contract.totalBaseRentAgreed || 0)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>UVT:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{contract.totalUvtQtyAgreed}</Text>
        </View>
      </View>
    </View>
  );
};

const ObligationsCard = ({ contract, refreshTrigger, onRefreshComplete }: { contract: Contract; refreshTrigger: number; onRefreshComplete?: () => void }) => {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);
  const [obligations, setObligations] = useState<ContractObligation[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    loadObligations();
  }, [contract.id, refreshTrigger]);

  const loadObligations = async () => {
    try {
      const token = user?.data?.accessToken;
      const result = await ContractService.getObligations(contract.id, token);

      if (result.success && result.data) {
        setObligations(result.data);
      } else {
        console.error('Error loading obligations:', result.message);
        setObligations([]);
      }
    } catch (error) {
      console.error('Exception in loadObligations:', error);
      setObligations([]);
    } finally {
      setLoading(false);
      if (onRefreshComplete) onRefreshComplete();
    }
  };

  const handlePayment = async (obligation: ContractObligation) => {
    Alert.alert(
      'Confirmar Pago',
      `¿Desea procesar el pago de ${formatCurrency(obligation.totalAmount || 0)} correspondiente a la obligación ${obligation.month}/${obligation.year}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Pagar',
          onPress: () => processMercadoPagoPayment(obligation)
        }
      ]
    );
  };

  const processMercadoPagoPayment = async (obligation: ContractObligation) => {
    try {
      setPaymentLoading(true);

      const token = user?.data?.accessToken;
      const result = await ContractService.createCheckout(obligation.id, token);

      if (result.success && result.data?.url) {
        // Open Mercado Pago Checkout Pro in the device's browser
        const canOpen = await Linking.canOpenURL(result.data.url);

        if (canOpen) {
          await Linking.openURL(result.data.url);
          Alert.alert(
            'Pago Iniciado',
            'Se ha abierto Mercado Pago para procesar el pago. Complete el proceso en su navegador.',
            [{ text: 'Entendido' }]
          );
        } else {
          Alert.alert('Error', 'No se pudo abrir Mercado Pago. Verifique su conexión a internet.');
        }
      } else {
        Alert.alert('Error', result.message || 'No se pudo obtener la URL de Mercado Pago.');
      }

    } catch (error) {
      console.error('Error processing Mercado Pago payment:', error);
      Alert.alert('Error', 'No se pudo procesar el pago. Intente nuevamente.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Obligaciones del Contrato</Text>
      <View style={styles.cardContent}>
        {loading ? (
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Cargando obligaciones...</Text>
        ) : obligations.length > 0 ? (
          obligations.map((obligation) => (
            <View key={obligation.id} style={[styles.obligationItem, {
              backgroundColor: obligation.daysLate > 0 ? `${colors.danger}10` : colors.surfaceSecondary
            }]}>
              <View style={styles.obligationInfo}>
                <Text style={[styles.obligationDescription, { color: colors.text }]}>
                  Obligación {obligation.month}/{obligation.year}
                </Text>
                <Text style={[styles.obligationAmount, { color: colors.primary }]}>
                  ${formatCurrency(obligation.totalAmount || 0)}
                </Text>
                <Text style={[styles.obligationDate, { color: colors.textSecondary }]}>
                  Vence: {formatDate(obligation.dueDate)}
                </Text>
                {obligation.paymentDate && (
                  <Text style={[styles.obligationDate, { color: colors.success }]}>
                    Pagado: {formatDate(obligation.paymentDate)}
                  </Text>
                )}
                {obligation.daysLate > 0 && (
                  <Text style={[styles.obligationLate, { color: colors.danger }]}>
                    {obligation.daysLate} días de mora
                  </Text>
                )}
                <View style={[styles.statusBadgeSmall, {
                  backgroundColor: obligation.status === 'Aprobada' ? `${colors.success}20` :
                                   obligation.status === 'PreJuridico' ? `${colors.danger}20` :
                                   `${colors.primary}20`
                }]}>
                  <Text style={[styles.statusTextSmall, {
                    color: obligation.status === 'Aprobada' ? colors.success :
                           obligation.status === 'PreJuridico' ? colors.danger :
                           colors.primary
                  }]}>
                    {obligation.status === 'Aprobada' ? 'Aprobada' :
                     obligation.status === 'PreJuridico' ? 'Pre Jurídico' :
                     obligation.status}
                  </Text>
                </View>
              </View>
              {!obligation.locked && obligation.status !== 'Pagada' && (
                <TouchableOpacity
                  style={[styles.payButton, { backgroundColor: colors.primary }]}
                  onPress={() => handlePayment(obligation)}
                  disabled={paymentLoading}
                >
                  <Text style={[styles.payButtonText, { color: colors.textLight }]}>
                    {paymentLoading ? 'Procesando...' : 'Pagar'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text style={[styles.noObligations, { color: colors.textSecondary }]}>
            No hay obligaciones registradas
          </Text>
        )}
      </View>
    </View>
  );
};

type DetailsContractRouteProp = RouteProp<ContractStackParamList, 'DetailsContract'>;

export default function DetailsContractScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<DetailsContractRouteProp>();
  const headerHeight = useHeaderHeight();
  const { contract } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: colors.text,
      headerStyle: { backgroundColor: colors.surface },
    });
  }, [navigation, colors]);

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
  };

  const onRefreshComplete = () => {
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { paddingTop: headerHeight, backgroundColor: colors.surfaceSecondary }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <HeroSectionContract contract={contract} />
        <InfoCardContract contract={contract} />
        <DatesCard contract={contract} />
        <LocationsCard contract={contract} />
        <TotalsCard contract={contract} />
        <ObligationsCard contract={contract} refreshTrigger={refreshTrigger} onRefreshComplete={onRefreshComplete} />
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };
  return date.toLocaleDateString('es-ES', options);
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('es-CO');
};

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

  // Hero Section
  heroSection: {
    padding: 24,
    marginBottom: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  contractId: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  lesseeName: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Cards
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  cardContent: {
    gap: 12,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Locations
  locationItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  noLocations: {
    fontSize: 14,
    fontStyle: 'italic',
  },

  // Obligations
  obligationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  obligationInfo: {
    flex: 1,
  },
  obligationDescription: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  obligationAmount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  obligationDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  obligationLate: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusBadgeSmall: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTextSmall: {
    fontSize: 11,
    fontWeight: '600',
  },
  payButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  noObligations: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});