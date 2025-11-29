import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { AppointmentService } from '../../api/services/appointmentServices';
import { ContractService } from '../../api/services/contractServices';
import { Contract } from '../../api/types/contract';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { AppDrawerParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');


type DashboardNavigationProp = DrawerNavigationProp<AppDrawerParamList, 'Inicio'>;

// Componente para las tarjetas KPI
const DashboardKpiCard = ({
  title,
  value,
  iconName,
  color
}: {
  title: string;
  value: number;
  iconName: string;
  color: string;
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.kpiCard, { backgroundColor: color }]}>
      <View style={styles.kpiIconContainer}>
        <Ionicons name={iconName as any} size={24} color="white" />
      </View>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiTitle}>{title}</Text>
    </View>
  );
};

// Componente para el próximo contrato a vencer
const NextContractCard = ({ contract }: { contract: Contract }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<DashboardNavigationProp>();

  const handlePress = () => {
    navigation.navigate('Contratos' as any);
    // TODO: Navigate to contract details
  };

  return (
    <View style={[styles.contractCard, { backgroundColor: colors.surface }]}>
      <View style={styles.contractHeader}>
        <Text style={[styles.contractId, { color: colors.textSecondary }]}>
          Contrato #{contract.id}
        </Text>
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

      <Text style={[styles.contractName, { color: colors.text }]}>{contract.fullName}</Text>

      <View style={styles.contractDetails}>
        <View style={styles.contractDetail}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.contractDetailText, { color: colors.textSecondary }]}>
            Vence: {new Date(contract.endDate).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </Text>
        </View>

        <View style={styles.contractDetail}>
          <Ionicons name="cash-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.contractDetailText, { color: colors.textSecondary }]}>
            ${contract.totalBaseRentAgreed?.toLocaleString('es-CO') || '0'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.contractButton, { backgroundColor: colors.primary }]}
        onPress={handlePress}
      >
        <Text style={[styles.contractButtonText, { color: colors.textLight }]}>
          Ver contrato
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
      </TouchableOpacity>
    </View>
  );
};

// Componente para botones de acción rápida
const QuickActionButton = ({
  title,
  iconName,
  onPress,
  color
}: {
  title: string;
  iconName: string;
  onPress: () => void;
  color: string;
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Ionicons name={iconName as any} size={32} color="white" />
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

// Componente para citas
const AppointmentCard = ({ appointment }: { appointment: any }) => {
  const { colors } = useTheme();

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case 'Confirmada':
        return { color: colors.success };
      case 'Pendiente':
        return { color: colors.warning };
      case 'Cancelada':
        return { color: colors.danger };
      default:
        return { color: colors.text };
    }
  };

  return (
    <View style={[styles.appointmentCard, { backgroundColor: colors.surface }]}>
      <View style={styles.appointmentHeader}>
        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
        <Text style={[styles.appointmentDate, { color: colors.text }]}>
          {appointment.fecha}
        </Text>
      </View>
      <Text style={[styles.appointmentTime, { color: colors.textSecondary }]}>
        {appointment.hora}
      </Text>
      <Text style={[styles.appointmentPlace, { color: colors.text }]}>
        {appointment.establecimiento}
      </Text>
      <Text style={[styles.appointmentStatus, getEstadoStyle(appointment.estado)]}>
        {appointment.estado}
      </Text>
    </View>
  );
};

export default function DashboardScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<DashboardNavigationProp>();
  const headerHeight = useHeaderHeight();
  const { user } = useContext(AuthContext);

  // State for dashboard data
  const [kpis, setKpis] = useState({
    contratosActivos: 0,
    obligacionesPendientes: 0,
    obligacionesVencidas: 0,
    citasProximas: 0,
  });
  const [nextContracts, setNextContracts] = useState<Contract[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.data?.accessToken) return;

    try {
      setLoading(true);

      // Decode JWT to get personId
      const token = user.data.accessToken;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const personId = decoded.person_id;

      // Load KPIs from contract metrics
      const metricsResult = await ContractService.getMetrics(token);
      if (metricsResult.success && metricsResult.data) {
        setKpis({
          contratosActivos: metricsResult.data.activos || 0,
          obligacionesPendientes: metricsResult.data.inactivos || 0,
          obligacionesVencidas: metricsResult.data.total || 0,
          citasProximas: 0, // Will be set from appointments
        });
      }

      // Load contracts and filter next to expire
      const contractsResult = await ContractService.getMine(token);
      if (contractsResult.success && contractsResult.data) {
        // Sort by end date and take the next 2 contracts to expire
        const sortedContracts = contractsResult.data
          .filter(contract => contract.active)
          .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
          .slice(0, 2);
        setNextContracts(sortedContracts);
      }

      // Load appointments
      const appointmentsResult = await AppointmentService.getByPersonId(personId, token);
      if (appointmentsResult.success && appointmentsResult.data) {
        // Format appointments for display
        const formattedAppointments = appointmentsResult.data.slice(0, 5).map(appointment => ({
          id: appointment.id,
          fecha: new Date(appointment.dateTimeAssigned).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short'
          }),
          hora: new Date(appointment.dateTimeAssigned).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          establecimiento: appointment.establishmentName,
          estado: appointment.active ? 'Confirmada' : 'Cancelada'
        }));
        setAppointments(formattedAppointments);

        // Update citas proximas KPI
        setKpis(prev => ({ ...prev, citasProximas: formattedAppointments.length }));
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToContracts = () => {
    navigation.navigate('Contratos');
  };

  const handleNavigateToEstablishments = () => {
    navigation.navigate('Establecimientos');
  };

  return (
    <View style={[styles.container, { paddingTop: headerHeight, backgroundColor: colors.surfaceSecondary }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Buenos días</Text>
          <Text style={[styles.welcomeText, { color: colors.text }]}>Aquí tienes un resumen de tu actividad</Text>
        </View>

        {/* KPI Section */}
        <View style={styles.kpiSection}>
          <View style={styles.kpiGrid}>
            <DashboardKpiCard
              title="Contratos Activos"
              value={kpis.contratosActivos}
              iconName="document-text"
              color={`${colors.primary}90`}
            />
            <DashboardKpiCard
              title="Contratos Inactivos"
              value={kpis.obligacionesPendientes}
              iconName="document-text-outline"
              color={`${colors.warning}90`}
            />
            <DashboardKpiCard
              title="Total Contratos"
              value={kpis.obligacionesVencidas}
              iconName="stats-chart"
              color={`${colors.success}90`}
            />
            <DashboardKpiCard
              title="Citas Próximas"
              value={kpis.citasProximas}
              iconName="calendar"
              color={`${colors.info}90`}
            />
          </View>
        </View>

        {/* Próximo Contrato a Vencer */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Próximo contrato a vencer</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : nextContracts.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.contractsScroll}
            >
              {nextContracts.map((contract) => (
                <NextContractCard key={contract.id} contract={contract} />
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No hay contratos próximos a vencer
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Acciones rápidas</Text>
          <View style={styles.actionsGrid}>
            <QuickActionButton
              title="Ver Contratos"
              iconName="document-text-outline"
              onPress={handleNavigateToContracts}
              color={`${colors.primary}95`}
            />
            <QuickActionButton
              title="Ver Establecimientos"
              iconName="business-outline"
              onPress={handleNavigateToEstablishments}
              color={`${colors.accent}95`}
            />
          </View>
        </View>

        {/* Próximas Citas */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Próximas citas</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : appointments.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.appointmentsScroll}
            >
              {appointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No hay citas próximas
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 8,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
  },

  // KPI Section
  kpiSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  kpiCard: {
    width: (width - 48) / 2 - 8,
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  kpiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  kpiTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },

  // Sections
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  // Next Contract
  contractsScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  contractCard: {
    width: width - 80,
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contractId: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contractName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  contractDetails: {
    gap: 8,
    marginBottom: 20,
  },
  contractDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contractDetailText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contractButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  contractButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginTop: 8,
  },

  // Appointments
  appointmentsScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  appointmentCard: {
    width: 160,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: '700',
  },
  appointmentTime: {
    fontSize: 14,
    marginBottom: 4,
  },
  appointmentPlace: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  appointmentStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});