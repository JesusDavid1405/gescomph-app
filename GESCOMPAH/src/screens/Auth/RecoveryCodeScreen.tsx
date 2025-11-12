import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/types';
import { AuthService } from '../../api/services/AuthServices';
import colors from '../../styles/color';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;
type RoutePropType = RouteProp<AuthStackParamList, 'RecoveryCode'>;

export default function RecoveryCodeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { email } = route.params;

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChangePassword = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Por favor ingresa el código de recuperación');
      return;
    }

    if (code.length !== 6) {
      Alert.alert('Error', 'El código debe tener 6 dígitos');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Por favor ingresa la nueva contraseña');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.changePassword({
        email,
        code: code.trim(),
        newPassword: newPassword.trim()
      });

      if (result.success) {
        Alert.alert(
          'Contraseña cambiada',
          'Tu contraseña ha sido cambiada exitosamente',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setResendLoading(true);
    try {
      const result = await AuthService.forgotPassword({ email });

      if (result.success) {
        Alert.alert('Código reenviado', 'Se ha enviado un nuevo código a tu correo');
        setCountdown(60); // 60 seconds countdown
      } else {
        Alert.alert('Error', result.message || 'Error al reenviar el código');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Verificar Código</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark-outline" size={80} color={colors.primary} />
          </View>

          <Text style={styles.description}>
            Ingresa el código de 6 dígitos que enviamos a
          </Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Código de recuperación</Text>
            <TextInput
              style={[styles.input, { color: 'black' }]}
              value={code}
              onChangeText={(text) => {
                // Only allow numbers and limit to 6 characters
                const numericText = text.replace(/[^0-9]/g, '');
                if (numericText.length <= 6) {
                  setCode(numericText);
                }
              }}
              placeholder="000000"
              placeholderTextColor="black"
              keyboardType="numeric"
              maxLength={6}
              editable={!loading}
              autoFocus
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nueva contraseña</Text>
            <TextInput
              style={[styles.passwordInput, { color: 'black' }]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Ingresa tu nueva contraseña"
              placeholderTextColor="black"
              secureTextEntry
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
              style={[styles.passwordInput, { color: 'black' }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirma tu nueva contraseña"
              placeholderTextColor="black"
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text style={[styles.buttonText, loading && styles.buttonTextDisabled]}>
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resendButton, (countdown > 0 || resendLoading) && styles.resendButtonDisabled]}
            onPress={handleResendCode}
            disabled={countdown > 0 || resendLoading}
          >
            <Text style={[styles.resendText, (countdown > 0 || resendLoading) && styles.resendTextDisabled]}>
              {resendLoading ? 'Reenviando...' : countdown > 0 ? `Reenviar código (${countdown}s)` : '¿No recibiste el código? Reenviar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 40,
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 18,
    backgroundColor: colors.surface,
    textAlign: 'center',
    letterSpacing: 8,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.surface,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: colors.textMuted,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: colors.textSecondary,
  },
  resendButton: {
    paddingVertical: 10,
  },
  resendButtonDisabled: {
    opacity: 0.6,
  },
  resendText: {
    color: colors.primary,
    fontSize: 14,
    textAlign: 'center',
  },
  resendTextDisabled: {
    color: colors.textMuted,
  },
});