import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import styles from "../../styles/LoginScreenStyles";
import { AuthContext } from "../../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function LoginModalContent({
  onOpenRegister,
  onOpenForgot, // ✅ abre modal forgot
  onClose,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);

  const { width: screenWidth } = Dimensions.get("window");
  const isWeb = Platform.OS === "web";

  const formWidth = isWeb ? Math.min(screenWidth * 0.92, 520) : "100%";
  const [showPassword, setShowPassword] = useState(false);

  const validateLoginData = () => {
    if (!email || !password) {
      alert("Por favor completa todos los campos.");
      return false;
    }
    return true;
  };

  const buildLoginPayload = () => JSON.stringify({ email, password });

  const sendLoginRequest = async (payload) => {
    const response = await fetch("http://192.168.0.103:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });
    return await response.json();
  };

  const handleLogin = async () => {
    if (!validateLoginData()) return;

    const payload = buildLoginPayload();
    const data = await sendLoginRequest(payload);

    if (data.success) {
      let role = "tenant";

      if (data.user.tipo === "propietario") role = "landlord";
      else if (data.user.tipo === "administrador" || data.user.tipo === "admin")
        role = "admin";

      setUser({
        ...data.user,
        token: data.token,
        role,
      });

      onClose?.();
    } else {
      alert(data.message);
      setEmail("");
      setPassword("");
    }
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
          {/* ✅ ICONO EXACTO como antes */}
          <Image
            source={require("../../assets/user-icon.png")}
            style={local.icon}
          />

          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Usuario:</Text>
            <TextInput
              style={[styles.input, { width: "100%" }]}
              placeholder="Correo"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Contraseña:</Text>
            <View style={[styles.passwordContainer, { width: "100%" }]}>
              <TextInput
                style={[styles.passwordInput, { flex: 1 }]}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>Ingresar</Text>
            </TouchableOpacity>

            {/* ✅ Forgot Password (ABRE MODAL) */}
            <TouchableOpacity
              onPress={() => {
                onOpenForgot?.(); // ✅ primero abrir forgot
              }}
            >
              <Text style={[styles.link, { textAlign: "center", marginTop: 10 }]}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* ✅ Register (ABRE MODAL) */}
            <TouchableOpacity
              onPress={() => {
                onOpenRegister?.();
              }}
            >
              <Text style={[styles.link, { textAlign: "center", marginTop: 8 }]}>
                Registrate
              </Text>
            </TouchableOpacity>
          </View>
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
  icon: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 14,
  },
});
