import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { AuthService } from '../api/services/AuthServices';
import { PersonService } from '../api/services/personServices';
import { useTheme } from '../context/ThemeContext';

// Utility function to decode JWT
const decodeJWT = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export default function CustomDrawer(props: any) {
  const { user, setUser } = useContext(AuthContext);
  const { colors } = useTheme();
  const [personData, setPersonData] = useState<any>(null);

  useEffect(() => {
    if (user?.data?.accessToken) {
      const decoded = decodeJWT(user.data.accessToken);
      if (decoded?.person_id) {
        fetchPersonData(decoded.person_id);
      }
    }
  }, [user]);

  const fetchPersonData = async (personId: string) => {
    try {
      const token = user?.data?.accessToken;
      const response = await PersonService.getById(parseInt(personId), token);
      if (response.success && response.data) {
        setPersonData(response.data);
      }
    } catch (error) {
      console.error('Error fetching person data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            const result = await AuthService.logout();
            if (result.success) {
              setUser(null);
            } else {
              Alert.alert('Error', result.message || 'Error al cerrar sesión');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContainer}>
        {/* Header del drawer */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Ionicons name="person-circle" size={60} color={colors.primary} />
          <Text style={[styles.userName, { color: colors.primary }]}>
            {personData ? `${personData.firstName} ${personData.lastName}` : 'Cargando...'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {personData ? personData.email : 'Cargando...'}
          </Text>
        </View>

        {/* Lista de items del drawer */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Botón de cerrar sesión fijo en la parte inferior */}
      <View style={[styles.logoutContainer, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.surface }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 14,
    marginTop: 5,
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 10,
  },
});