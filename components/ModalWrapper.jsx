import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

export default function ModalWrapper({ visible, onClose, title, children }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType={isWeb ? "fade" : "slide"}
      onRequestClose={onClose}
    >
      {/* Fondo oscuro + cerrar al tocar fuera */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Evita que tocar dentro cierre */}
        <Pressable style={styles.modalBox} onPress={() => {}}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon name="close" size={20} color="#111" />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.modalBody}>{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: isWeb ? "center" : "flex-end",
    alignItems: "center",
    padding: 12,
  },

  modalBox: {
    width: isWeb ? Math.min(width * 0.55, 650) : "100%",
    maxWidth: 700,

    // 🔥 Esto es CLAVE para que el scroll funcione
    height: isWeb ? Math.min(height * 0.85, 750) : height * 0.88,

    backgroundColor: "#fff",
    borderRadius: isWeb ? 16 : 18,

    ...(isWeb
      ? {}
      : {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }),

    overflow: "hidden",
    elevation: 10,
  },

  modalHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  closeBtn: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: "#f2f2f2",
  },

  modalBody: {
    flex: 1, // 🔥 esto permite que ScrollView adentro funcione
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
