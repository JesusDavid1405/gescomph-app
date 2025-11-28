import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Establishment } from '../../api/types/establishment';
import { AppointmentCreateModel } from '../../api/types/appointment';
import { useTheme } from '../../context/ThemeContext';
import Calendar from '../calendario/Calendar';
import { AppointmentService } from '../../api/services/appointmentServices';
import { PersonService } from '../../api/services/personServices';
import { AuthContext } from '../../context/AuthContext';

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

interface AppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  establishment: Establishment;
}

export default function AppointmentModal({ visible, onClose, establishment }: AppointmentModalProps) {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);

  const [appointmentData, setAppointmentData] = useState<AppointmentCreateModel>({
    description: '',
    requestDate: new Date(),
    dateTimeAssigned: new Date(),
    establishmentId: establishment.id,
    active: true,
    firstName: '',
    lastName: '',
    document: '',
    address: '',
    email: '',
    phone: '',
    cityId: 1,
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // Define available time slots
  const timeSlots = [
    '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  useEffect(() => {
    if (visible && user?.data?.accessToken) {
      const decoded = decodeJWT(user.data.accessToken);
      if (decoded?.person_id) {
        fetchPersonData(decoded.person_id);
      }
    }
  }, [visible, user]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimes();
    }
  }, [selectedDate]);

  const fetchPersonData = async (personId: string) => {
    const token = user?.data?.accessToken;
    try {
      const response = await PersonService.getById(parseInt(personId), token);
      if (response.success && response.data) {
        const person = response.data;
        setAppointmentData(prev => ({
          ...prev,
          firstName: person.firstName,
          lastName: person.lastName,
          document: person.document,
          address: person.address,
          email: person.email,
          phone: person.phone,
        }));
      }
    } catch (error) {
      console.error('Error fetching person data:', error);
    }
  };

  const fetchAvailableTimes = async () => {
    try {
      const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      const response = await AppointmentService.getByDate(dateString);
      if (response.success && response.data) {
        // Filter appointments for this establishment
        const establishmentAppointments = response.data.filter(app => app.establishmentId === establishment.id);
        const occupiedTimes = establishmentAppointments.map(app => {
          const date = new Date(app.dateTimeAssigned);
          return date.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
        });
        const available = timeSlots.filter(slot => !occupiedTimes.includes(slot));
        setAvailableTimes(available);
      } else {
        setAvailableTimes(timeSlots);
      }
    } catch (error) {
      setAvailableTimes(timeSlots);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    const [hours, minutes] = time.split(':');
    const dateTime = new Date(selectedDate);
    dateTime.setHours(parseInt(hours), parseInt(minutes));
    // Adjust to Colombia UTC-5 by subtracting 5 hours
    dateTime.setHours(dateTime.getHours() - 5);
    setAppointmentData(prev => ({ ...prev, dateTimeAssigned: dateTime }));
  };

  const handleScheduleAppointment = async () => {
    if (
      !appointmentData.description.trim() ||
      !selectedDate ||
      !selectedTime
    ) {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      const payload = {
        ...appointmentData,
        requestDate: appointmentData.requestDate.toISOString(),
        dateTimeAssigned: appointmentData.dateTimeAssigned.toISOString(),
      };
      const response = await AppointmentService.create(payload);
      if (response.success) {
        Alert.alert('Éxito', 'Cita agendada correctamente');
        onClose();
        resetAppointmentForm();
      } else {
        Alert.alert('Error', response.message || 'Error al agendar la cita');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión');
    }
  };

  const resetAppointmentForm = () => {
    setAppointmentData({
      description: '',
      requestDate: new Date(),
      dateTimeAssigned: new Date(),
      establishmentId: establishment.id,
      active: true,
      firstName: '',
      lastName: '',
      document: '',
      address: '',
      email: '',
      phone: '',
      cityId: 1,
    });
    setSelectedDate(new Date());
    setSelectedTime('');
    setAvailableTimes([]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ScrollView style={[styles.modalContainer, { backgroundColor: colors.surfaceSecondary }]}>
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Agendar Cita</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Descripción *</Text>
            <TextInput
              style={[styles.input, styles.textArea, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
              value={appointmentData.description}
              onChangeText={(text) => setAppointmentData(prev => ({ ...prev, description: text }))}
              placeholder="Describe el motivo de la cita"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Date Selection */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Fecha *</Text>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </View>

          {/* Time Selection */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Hora disponible *</Text>
            <View style={styles.timeSlots}>
              {availableTimes.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    { borderColor: colors.border, backgroundColor: colors.surface },
                    selectedTime === time && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => handleTimeSelect(time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    { color: colors.text },
                    selectedTime === time && { color: colors.textLight },
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>


          <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.primary }]} onPress={handleScheduleAppointment}>
            <Text style={[styles.submitButtonText, { color: colors.textLight }]}>Agendar Cita</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedTimeSlot: {
  },
  timeSlotText: {
    fontSize: 14,
  },
  selectedTimeSlotText: {
  },
});