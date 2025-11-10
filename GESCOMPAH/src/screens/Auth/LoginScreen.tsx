import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomStatusBar from '@/src/components/CustomStatusBar';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Intento de login:', email, password);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <CustomStatusBar backgroundColor="#3F8A4E" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* ENCABEZADO CON CURVA */}
        <LinearGradient
          colors={['#418a2fff', '#3F8A4E', '#8BC34A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Bienvenido a</Text>
          <Text style={styles.brand}>GESCOMPH</Text>
          <Text style={styles.subtitle}>
            Soluciones Comerciales Inteligentes
          </Text>
        </LinearGradient>


        {/* FORMULARIO */}
        <View style={styles.form}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="usuario@correo.com"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* BOTÓN */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          {/* ENLACES */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.link}
          >
            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '500',
  },
  brand: {
    fontSize: 26,
    color: '#F2C94C',
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    color: '#fefefe',
    marginTop: 4,
    textAlign: 'center',
  },
  form: {
    marginTop: 40,
    paddingHorizontal: 24,
    gap: 16,
  },
  label: {
    fontSize: 14,
    color: '#204D31',
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderColor: '#3F8A4E',
    borderWidth: 1.2,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#204D31',
    backgroundColor: '#F9F9F9',
  },
  button: {
    backgroundColor: '#3F8A4E',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    alignItems: 'center',
    marginTop: 12,
  },
  linkText: {
    color: '#3F8A4E',
    fontSize: 14,
    fontWeight: '500',
  },
});
