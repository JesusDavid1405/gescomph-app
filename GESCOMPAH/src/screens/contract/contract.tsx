import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ContractService } from '../../api/services/contractServices';
import { Contract } from '../../api/types/contract';
import ContractCarousel from '../../components/contract/ContractCarousel';
import ContractMiniCard from '../../components/contract/ContractMiniCard';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ContractStackParamList } from '../../navigation/types';


// Componente Principal: ContractsScreen
export default function ContractScreen() {
  const { colors } = useTheme();
  const headerHeight = useHeaderHeight();
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<ContractStackParamList>>();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [activeContracts, setActiveContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const token = user?.data?.accessToken;
      const result = await ContractService.getMine(token);

      if (result.success && result.data) {
        setContracts(result.data);

        const activeContractsFiltered = result.data.filter((contract: Contract) => contract.active === true);
        setActiveContracts(activeContractsFiltered);
      } else {
        setContracts([]);
        setActiveContracts([]);
      }
    } catch (error) {
      setContracts([]);
      setActiveContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (contract: Contract) => {
    navigation.navigate('DetailsContract', { contract });
  };

  const handleDownload = async (contract: Contract) => {
    try {
      const token = user?.data?.accessToken;
      const result = await ContractService.downloadPdf(contract.id, token);

      if (result.success) {
        alert(result.message || `PDF del contrato #${contract.id} compartido exitosamente`);
      } else {
        alert(result.message || 'Error al descargar el PDF');
      }
    } catch (error) {
      alert('Error al descargar el PDF');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surfaceSecondary }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: headerHeight, backgroundColor: colors.surfaceSecondary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Contratos Activos
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            {activeContracts.length} contrato{activeContracts.length !== 1 ? 's' : ''} en vigor
          </Text>
        </View>

        {/* Carrusel de contratos activos */}
        {activeContracts.length > 0 ? (
          <ContractCarousel
            contracts={activeContracts}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="document-text" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No hay contratos activos
            </Text>
          </View>
        )}

        {/* Lista completa de contratos */}
        <View style={styles.listSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Todos los Contratos
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            {contracts.length} contrato{contracts.length !== 1 ? 's' : ''} en total
          </Text>
        </View>

        <View style={styles.contractsList}>
          {contracts.map((contract) => (
            <ContractMiniCard
              key={contract.id}
              contract={contract}
              onViewDetails={handleViewDetails}
              onDownload={handleDownload}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// Helpers
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

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
  },

  // Empty state
  emptyCard: {
    marginHorizontal: 20,
    height: 420,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginBottom: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },

  // Lista de contratos
  listSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  contractsList: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 32,
  },
});