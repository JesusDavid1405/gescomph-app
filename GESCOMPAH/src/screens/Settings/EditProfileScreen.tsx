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
import { CityService } from '../../api/services/cityServices';
import { DepartmentService } from '../../api/services/departmentServices';
import { PersonService } from '../../api/services/personServices';
import { City, Department } from '../../api/types/locationTypes';
import { PersonUpdateModel } from '../../api/types/personTypes';
import { AuthContext } from '../../context/AuthContext';
import { SettingsStackParamList } from '../../navigation/types';
import colors from '../../styles/color';

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
      console.log('Fetching city data for cityId:', cityId);
      const token = user?.data?.accessToken;
      const response = await CityService.getById(cityId, token);
      console.log('City response:', response);
      if (response.success && response.data) {
        const city = (response.data as any).data || response.data;
        console.log('City data:', city);
        if (city?.departmentName) {
          console.log('Looking for department with name:', city.departmentName);
          console.log('Departments list:', departmentsRef.current);
          console.log('Department names:', departmentsRef.current.map(d => d.name));
          const department = departmentsRef.current.find(dept => dept.name === city.departmentName);
          console.log('Found department:', department);
          if (department) {
            console.log('Setting selectedDepartment to:', department.id.toString());
            setSelectedDepartment(department.id.toString());
            console.log('Calling loadCities with:', department.id);
            await loadCities(department.id);
          } else {
            console.log('Department not found in list');
          }
        } else {
          console.log('City has no departmentName');
        }
      } else {
        console.log('City fetch failed:', response.message);
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
    }
  };

  const loadDepartments = async () => {
    try {
      console.log('Loading departments...');
      const token = user?.data?.accessToken;
      const response = await DepartmentService.getAll(token);
      console.log('Department response:', response);
      if (response.success && response.data) {
        const data = Array.isArray(response.data)
          ? response.data
          : (response.data as any).data;
        console.log('Departments data:', data);
        setDepartments(data || []);
        departmentsRef.current = data || [];
      } else {
        console.log('Failed to load departments:', response.message);
      }
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const loadCities = async (departmentId: number) => {
    try {
      console.log('Loading cities for department:', departmentId);
      const token = user?.data?.accessToken;
      const response = await CityService.getByDepartment(departmentId, token);
      console.log('City response:', response);
      if (response.success && response.data) {
        const data = Array.isArray(response.data)
          ? response.data
          : (response.data as any).data;
        console.log('Cities data:', data);
        setCities(data || []);
      } else {
        console.log('Failed to load cities:', response.message);
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
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerDecorator} />

        <View style={styles.content}>
          <Text style={styles.title}>Editar Perfil</Text>

          {/* Nombre */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(value) => updateFormData('firstName', value)}
              placeholder="Ingrese su nombre"
            />
          </View>

          {/* Apellido */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellido *</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(value) => updateFormData('lastName', value)}
              placeholder="Ingrese su apellido"
            />
          </View>

          {/* Dirección */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dirección *</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(value) => updateFormData('address', value)}
              placeholder="Ingrese su dirección"
            />
          </View>

          {/* Teléfono */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono *</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              placeholder="Ingrese su teléfono"
              keyboardType="phone-pad"
            />
          </View>

          {/* Departamento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Departamento *</Text>
            {dataLoaded ? (
              <View style={styles.pickerInput}>
                <Picker
                  selectedValue={selectedDepartment}
                  onValueChange={(value) => {
                    setSelectedDepartment(value);
                    setFormData(prev => ({ ...prev, cityId: 0 }));
                    setCities([]);
                  }}
                  style={{ flex: 1 }}
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
              <View style={styles.pickerInput}>
                <Text style={styles.loadingText}>Cargando departamentos...</Text>
              </View>
            )}
          </View>

          {/* Ciudad */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ciudad *</Text>
            {dataLoaded ? (
              <View style={styles.pickerInput}>
                <Picker
                  selectedValue={formData.cityId ? formData.cityId.toString() : ""}
                  enabled={!!selectedDepartment}
                  onValueChange={(value) =>
                    updateFormData('cityId', parseInt(value))
                  }
                  style={{ flex: 1 }}
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
              <View style={styles.pickerInput}>
                <Text style={styles.loadingText}>Cargando ciudades...</Text>
              </View>
            )}
          </View>

          {/* Botón guardar */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    position: 'relative',
  },
  headerDecorator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    fontSize: 16,
  },
  pickerInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 12,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
});
