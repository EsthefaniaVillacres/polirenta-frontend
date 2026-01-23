import React, { useContext, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

export default function Header({ isLoggedIn = false }) {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, setUser } = useContext(AuthContext);

  // ✅ Protegemos el nombre de pantalla para que NO rompa en SSR/hydration
  const currentScreen = useMemo(() => {
    try {
      return route?.name ?? "Unknown";
    } catch (e) {
      return "Unknown";
    }
  }, [route]);

  // 🔥 Modo admin según la pantalla actual
  const isAdminScreen = currentScreen?.startsWith("Admin") ?? false;

  // Solo mostramos botones de login/register en Home, sin sesión y NO en admin
  const showAuthButtons =
    currentScreen === "Home" && !isLoggedIn && !isAdminScreen;

  // Icono de perfil: solo si está logueado, NO es admin y no está en Login/Register
  const showProfileIcon =
    isLoggedIn &&
    !isAdminScreen &&
    currentScreen !== "Login" &&
    currentScreen !== "Register";

  // ✅ Confirmación compatible Web + Android + iOS (sin romper SSR)
  const confirmAction = async (message) => {
    // Web: SOLO si existe window (evita error en Vercel SSR)
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return window.confirm(message);
    }

    // Android / iOS
    return new Promise((resolve) => {
      Alert.alert("Confirmación", message, [
        { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
        { text: "Aceptar", onPress: () => resolve(true) },
      ]);
    });
  };

  const handleLogout = async () => {
    const confirmed = await confirmAction(
      "¿Estás seguro de que quieres cerrar sesión?"
    );

    if (confirmed) {
      setUser(null);
      // opcional: te mando al Home
      navigation.navigate("Home");
    }
  };

  // 🔹 Comportamiento del botón Home
  const goHome = () => {
    // Si estoy en pantallas de admin → siempre al dashboard del admin
    if (isAdminScreen) {
      navigation.navigate("AdminDashboard");
      return;
    }

    // Resto de casos
    if (!user) {
      navigation.navigate("Home");
    } else if (user?.role === "landlord") {
      navigation.navigate("RegisterProperty");
    } else {
      navigation.navigate("Tenant");
    }
  };

  return (
    <View style={styles.header}>
      {/* Icono Home */}
      <TouchableOpacity onPress={goHome}>
        <Ionicons name="home" size={28} color={colors.primary} />
      </TouchableOpacity>

      <View style={styles.right}>
        {/* Botones Ingresar / Registrarse (solo no admin) */}
        {showAuthButtons && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.login]}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.text}>Ingresar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.register]}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.text}>Registrarse</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Icono de perfil + logout (solo no admin) */}
        {showProfileIcon && (
          <>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Ionicons
                name="person-circle-outline"
                size={32}
                color={colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 10 }}>
              <Ionicons name="log-out-outline" size={28} color="red" />
            </TouchableOpacity>
          </>
        )}

        {/* Logout solo para admin (sin icono de perfil) */}
        {isLoggedIn && isAdminScreen && (
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={28} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
    width: "100%",
  },
  right: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  button: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  register: {
    backgroundColor: "#f6a700",
  },
  login: {
    backgroundColor: "#000",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});
