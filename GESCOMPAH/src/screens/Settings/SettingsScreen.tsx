import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { AuthContext } from '../../context/AuthContext';
import { PersonService } from '../../api/services/personServices';

// Utility function to decode JWT
const decodeJWT = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    return null;
  }
};

type SettingsScreenNavigationProp = NativeStackNavigationProp<SettingsStackParamList, 'SettingsMain'>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const headerHeight = useHeaderHeight();
  const { user } = useContext(AuthContext);
  const { colors, isDark, toggleTheme } = useTheme();
  const [personData, setPersonData] = useState<any>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [headerTextColor, setHeaderTextColor] = useState(colors.textLight);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    // Cambiar el color del texto cuando el scroll llegue al área blanca (después de 120px)
    if (scrollY > 120) {
      setHeaderTextColor(colors.text);
    } else {
      setHeaderTextColor(colors.textLight);
    }
  };

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

  return (
    <View style={[styles.container, { paddingTop: headerHeight, backgroundColor: colors.surfaceSecondary }]}>
      {/* Header Decorator */}
      <View style={[styles.headerDecorator, { backgroundColor: colors.primary }]} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: colors.background }]}>
          <View style={styles.avatar}>
            <Ionicons name="person-circle" size={60} color={colors.primary} />
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>
            {personData ? `${personData.firstName} ${personData.lastName}` : 'Cargando...'}
          </Text>
          <Text style={[styles.userRole, { color: colors.textSecondary }]}>Usuario</Text>
    
          <TouchableOpacity
            style={[styles.editButton, { borderColor: colors.primary }]}
            onPress={() => {
              navigation.navigate('EditProfile');
            }}
          >
            <Text style={[styles.editButtonText, { color: colors.primary }]}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Security Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Seguridad</Text>

          {/* Two Factor Authentication */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Autenticación de dos factores</Text>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: '#E0E0E0', true: colors.primary }}
              thumbColor={twoFactorEnabled ? '#FFFFFF' : '#F4F4F4'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>

          {/* Change Password */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              // Navigate to change password screen
              console.log('Change password');
            }}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="key" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Cambiar contraseña</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Preferencias</Text>

          {/* Dark Mode */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons
                  name={isDark ? "moon" : "moon-outline"}
                  size={20}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Modo oscuro</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#E0E0E0', true: colors.primary }}
              thumbColor={isDark ? '#FFFFFF' : '#F4F4F4'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.background }]}
          onPress={() => {
            // Handle logout
            console.log('Logout');
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  transparentHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  headerDecorator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileSection: {
    borderRadius: 20,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 4,
    borderColor: 'white',
    position: 'absolute',
    top: -50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});