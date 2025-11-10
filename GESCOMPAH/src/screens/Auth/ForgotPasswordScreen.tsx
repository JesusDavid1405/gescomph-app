import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomStatusBar from "@/src/components/CustomStatusBar";

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    console.log("Correo de recuperación enviado a:", email);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <CustomStatusBar backgroundColor="#3F8A4E" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* ENCABEZADO CON GRADIENTE IGUAL AL LOGIN */}
        <LinearGradient
          colors={["#4FA35A", "#3F8A4E", "#8BC34A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Image
            source={require("../../../assets/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.subtitle}>
            No te preocupes, te enviaremos un correo para restablecerla.
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

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Enviar correo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  header: {
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#fefefe",
    marginTop: 6,
    textAlign: "center",
    maxWidth: 280,
  },
  form: {
    marginTop: 40,
    paddingHorizontal: 24,
    gap: 16,
  },
  label: {
    fontSize: 14,
    color: "#204D31",
    marginBottom: 4,
    fontWeight: "500",
  },
  input: {
    height: 48,
    borderColor: "#3F8A4E",
    borderWidth: 1.2,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#204D31",
    backgroundColor: "#F9F9F9",
  },
  button: {
    backgroundColor: "#3F8A4E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    alignItems: "center",
    marginTop: 12,
  },
  linkText: {
    color: "#3F8A4E",
    fontSize: 14,
    fontWeight: "500",
  },
});
