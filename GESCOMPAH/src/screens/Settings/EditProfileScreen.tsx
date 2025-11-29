import { Picker } from '@react-native-picker/picker';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CityService } from '../../api/services/cityServices';
import { DepartmentService } from '../../api/services/departmentServices';
import { PersonService } from '../../api/services/personServices';
import { City, Department } from '../../api/types/locationTypes';
import { PersonUpdateModel } from '../../api/types/personTypes';
import { AuthContext } from '../../context/AuthContext';
import { SettingsStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

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

type EditProfileScreenNavigationProp =
  NativeStackNavigationProp<SettingsStackParamList, 'EditProfile'>;

export default function EditProfileScreen() {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const headerHeight = useHeaderHeight();
  const { user } = useContext(AuthContext);
  const { colors } = useTheme();

  const [personData, setPersonData] = useState<any>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const departmentsRef = useRef<Department[]>([]);

  const [formData, setFormData] = useState<PersonUpdateModel>({
    id: 0,
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    cityId: 0,
  });

  useEffect(() => {
    if (user?.data?.accessToken) {
      const decoded = decodeJWT(user.data.accessToken);
      if (decoded?.person_id) {
        const loadData = async () => {
          await loadDepartments();
          await fetchPersonData(decoded.person_id);
        };
        loadData();
      }
    }
  }, [user]);

  useEffect(() => {
    if (selectedDepartment) {
      loadCities(parseInt(selectedDepartment));
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (departments.length > 0 && selectedDepartment) {
      setDataLoaded(true);
    }
  }, [departments, selectedDepartment]);

  const fetchPersonData = async (personId: string) => {
    try {
      const token = user?.data?.accessToken;
      const response = await PersonService.getById(parseInt(personId), token);

      if (response.success && response.data) {
        const person = response.data;
        setPersonData(person);

        setFormData({
          id: person.id,
          firstName: person.firstName,
          lastName: person.lastName,
          address: person.address,
          phone: person.phone,
          cityId: person.cityId,
        });

        if (person.cityId) {
          await fetchCityData(person.cityId);
        }
      }
    } catch (error) {
      console.error('Error fetching person data:', error);
    }
  };

  const fetchCityData = async (cityId: number) => {
    try {
      const token = user?.data?.accessToken;
      const response = await CityService.getById(cityId, token);
      if (response.success && response.data) {
        const city = (response.data as any).data || response.data;
        if (city?.departmentName) {
          const department = departmentsRef.current.find(dept => dept.name === city.departmentName);
          if (department) {
            setSelectedDepartment(department.id.toString());
            await loadCities(department.id);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
    }
  };

  const loadDepartments = async () => {
    try {
      const token = user?.data?.accessToken;
      const response = await DepartmentService.getAll(token);
      if (response.success && response.data) {
        const data = Array.isArray(response.data)
          ? response.data
          : (response.data as any).data;
        setDepartments(data || []);
        departmentsRef.current = data || [];
      }
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const loadCities = async (departmentId: number) => {
    try {
      const token = user?.data?.accessToken;
      const response = await CityService.getByDepartment(departmentId, token);
      if (response.success && response.data) {
        const data = Array.isArray(response.data)
          ? response.data
          : (response.data as any).data;
        setCities(data || []);
      }
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.address.trim() ||
      !formData.phone.trim()
    ) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    try {
      const token = user?.data?.accessToken;
      const response = await PersonService.update(formData.id, formData, token);
      if (response.success) {
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof PersonUpdateModel, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={[styles.container, { paddingTop: headerHeight, backgroundColor: colors.surfaceSecondary }]}>
      {/* Header Decorator */}
      <View style={[styles.headerDecorator, { backgroundColor: colors.primary }]} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Section */}
        <View style={[styles.profileSection, { backgroundColor: colors.background }]}>
          <View style={styles.avatar}>
            <Ionicons name="person-circle" size={60} color={colors.primary} />
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>
            {personData ? `${personData.firstName} ${personData.lastName}` : 'Cargando...'}
          </Text>
          <Text style={[styles.userRole, { color: colors.textSecondary }]}>Editar información</Text>
        </View>

        {/* Información Personal */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Información Personal</Text>

          {/* Nombre */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="person-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.inputContent}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={formData.firstName}
                  onChangeText={(value) => updateFormData('firstName', value)}
                  placeholder="Ingrese su nombre"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </View>

          {/* Apellido */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="person-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.inputContent}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Apellido</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={formData.lastName}
                  onChangeText={(value) => updateFormData('lastName', value)}
                  placeholder="Ingrese su apellido"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </View>

          {/* Documento */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="card-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.inputContent}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Documento</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={personData?.document || ''}
                  placeholder="Número de documento"
                  placeholderTextColor={colors.textSecondary}
                  editable={false}
                />
              </View>
            </View>
          </View>

          {/* Teléfono */}
          <View style={[styles.inputWrapper, styles.lastInput]}>
            <View style={styles.inputLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="call-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.inputContent}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Teléfono</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={formData.phone}
                  onChangeText={(value) => updateFormData('phone', value)}
                  placeholder="Ingrese su teléfono"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Información de Contacto */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Información de Contacto</Text>

          {/* Correo Electrónico */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="mail-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.inputContent}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Correo Electrónico</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={personData?.email || ''}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor={colors.textSecondary}
                  editable={false}
                />
              </View>
            </View>
          </View>

          {/* Dirección */}
          <View style={[styles.inputWrapper, styles.lastInput]}>
            <View style={styles.inputLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="home-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.inputContent}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Dirección</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={formData.address}
                  onChangeText={(value) => updateFormData('address', value)}
                  placeholder="Ingrese su dirección"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Información Geográfica */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Información Geográfica</Text>

          {/* Departamento */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="map-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.inputContent}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Departamento</Text>
                {dataLoaded ? (
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedDepartment}
                      onValueChange={(value) => {
                        setSelectedDepartment(value);
                        setFormData(prev => ({ ...prev, cityId: 0 }));
                        setCities([]);
                      }}
                      style={[styles.picker, { color: colors.text }]}
                    >
                      <Picker.Item label="Seleccionar departamento" value="" />
                      {departments.map((dept) => (
                        <Picker.Item
                          key={dept.id}
                          label={dept.name}
                          value={dept.id.toString()}
                        />
                      ))}
                    </Picker>
                  </View>
                ) : (
                  <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                    Cargando...
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Ciudad */}
          <View style={[styles.inputWrapper, styles.lastInput]}>
            <View style={styles.inputLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="location-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.inputContent}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Ciudad</Text>
                {dataLoaded ? (
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formData.cityId ? formData.cityId.toString() : ""}
                      enabled={!!selectedDepartment}
                      onValueChange={(value) =>
                        updateFormData('cityId', parseInt(value))
                      }
                      style={[styles.picker, { color: colors.text }]}
                    >
                      <Picker.Item label="Seleccionar ciudad" value="" />
                      {cities.map((city) => (
                        <Picker.Item
                          key={city.id}
                          label={city.name}
                          value={city.id.toString()}
                        />
                      ))}
                    </Picker>
                  </View>
                ) : (
                  <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                    Cargando...
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: colors.primary },
            loading && styles.saveButtonDisabled
          ]}
          onPress={handleUpdateProfile}
          disabled={loading}
        >
          <Ionicons name="checkmark-circle-outline" size={24} color="white" />
          <Text style={styles.saveButtonText}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Text>
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
  inputWrapper: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastInput: {
    borderBottomWidth: 0,
  },
  inputLeft: {
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
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 0,
  },
  pickerContainer: {
    marginTop: 4,
  },
  picker: {
    height: 50,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
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
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});