import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import styles from "../../styles/ForgotPasswordScreenStyles";
import { useWindowDimensions } from "react-native";

export default function ForgotPasswordModalContent({ onClose, onOpenLogin }) {
  const [email, setEmail] = useState("");
  const { width: screenWidth } = useWindowDimensions();

  const isWeb = Platform.OS === "web";

  // ✅ ancho adaptativo (web limitado / móvil full)
  const formWidth = isWeb ? Math.min(screenWidth * 0.92, 520) : "100%";

  const validateEmail = () => {
    if (!email) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico.");
      return false;
    }
    return true;
  };

  const buildResetPayload = () => {
    return JSON.stringify({ email });
  };

  const sendResetRequest = async (payload) => {
    const response = await fetch(
      "https://backend-arriendos-production.up.railway.app/api/auth/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      }
    );
    return await response.json();
  };

  const handlePasswordReset = async () => {
    if (!validateEmail()) return;

    const payload = buildResetPayload();
    const data = await sendResetRequest(payload);

    // ✅ tu lógica (sin cambiar backend)
    alert(data.message || "Correo enviado");

    // opcional: cerrar modal luego de enviar
    // onClose?.();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={local.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        horizontal={false}
      >
        <View style={[local.formWrapper, { width: formWidth }]}>
          {/* ✅ ICONO (ya existe en tu proyecto) */}
          <Image
            source={require("../../assets/recovery-icon.png")}
            style={local.icon}
          />


          <Text style={local.subtitle}>
            Ingresa tu correo y te enviaremos un enlace
          </Text>

          <Text style={styles.label}>Correo electrónico:</Text>
          <TextInput
            style={[styles.input, local.fullWidth]}
            placeholder="Ingresa tu correo"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* ✅ Botones (uno debajo del otro, pequeños y bonitos) */}
          <View style={local.buttonsColumn}>
            <TouchableOpacity
              style={[styles.button, styles.register, local.fullWidth, local.smallButton]}
              onPress={handlePasswordReset}
            >
              <Text style={[styles.buttonText, local.smallButtonText]}>
                Enviar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.back, local.fullWidth, local.smallButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, local.smallButtonText]}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Link para volver al login */}
          <TouchableOpacity
            onPress={() => {
              onClose?.();
              onOpenLogin?.();
            }}
          >
            <Text style={local.linkText}>Volver a iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const local = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  formWrapper: {
    alignSelf: "stretch",
  },
  fullWidth: {
    width: "100%",
  },
  icon: {
    width: 85,
    height: 85,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
    color: "#111",
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 14,
    color: "#666",
  },
  buttonsColumn: {
    marginTop: 14,
    gap: 10,
    width: "100%",
  },
  smallButton: {
    paddingVertical: 10,
    borderRadius: 10,
  },
  smallButtonText: {
    fontSize: 14,
    fontWeight: "800",
  },
  linkText: {
    textAlign: "center",
    marginTop: 14,
    fontSize: 13,
    fontWeight: "700",
    color: "#0E5A2A",
  },
});
