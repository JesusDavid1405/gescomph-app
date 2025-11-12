import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { AuthService } from '../api/services/AuthServices';
import colors from '../styles/color';

export default function CustomDrawer(props: any) {
  const { setUser } = useContext(AuthContext);

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
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContainer}>
        {/* Header del drawer */}
        <View style={styles.header}>
          <Ionicons name="person-circle" size={60} color={colors.primary} />
          <Text style={styles.userName}>Usuario</Text>
          <Text style={styles.userEmail}>usuario@email.com</Text>
        </View>

        {/* Lista de items del drawer */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Botón de cerrar sesión fijo en la parte inferior */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={colors.danger} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 10,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    color: colors.danger,
    marginLeft: 10,
  },
});