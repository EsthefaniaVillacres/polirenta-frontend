import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import Header from "../../components/Header";
import LogosRow from "../../components/LogosRow";
import DownloadButtons from "../../components/DownloadButtons";
import styles from "../../styles/HomeScreenStyles";

import ModalWrapper from "../../components/ModalWrapper";
import LoginModalContent from "./LoginModalContent";
import RegisterModalContent from "./RegisterModalContent";
import ForgotPasswordModalContent from "./ForgotPasswordModalContent";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

export default function HomeScreen() {
  const fontSizeTitle = isWeb ? 40 : width * 0.12;
  const fontSizeSubtitle = isWeb ? 20 : width * 0.05;

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* ENCABEZADO */}
      <View
        style={{
          height: 70,
          width: "100%",
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 1, backgroundColor: "#B80000" }} />
        <View style={{ flex: 1, backgroundColor: "#ffffff" }} />
        <View style={{ flex: 1, backgroundColor: "#006400" }} />
      </View>

      {/* Header: en Home abre modal (gracias a las props) */}
      <Header
        isLoggedIn={false}
        onPressLogin={() => setShowLoginModal(true)}
        onPressRegister={() => setShowRegisterModal(true)}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <LogosRow isWeb={isWeb} />
        <Text style={[styles.title, { fontSize: fontSizeTitle }]}>
          POLIRENTA
        </Text>
        <Text style={[styles.subtitle, { fontSize: fontSizeSubtitle }]}>
          Encuentra tu arrendamiento
        </Text>

        <View style={styles.bottom}>
          <Text style={styles.rightText}>Consigue tu app</Text>
          <DownloadButtons />
        </View>
      </ScrollView>

      {/* MODAL LOGIN */}
      <ModalWrapper
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Iniciar sesión"
      >
        <LoginModalContent
          onClose={() => setShowLoginModal(false)}
          onOpenRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
          onOpenForgot={() => {
            setShowLoginModal(false);
            setShowForgotModal(true);
          }}
        />
      </ModalWrapper>


      {/* MODAL REGISTER */}
      <ModalWrapper
        visible={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Registro"
      >
        <RegisterModalContent
          onClose={() => setShowRegisterModal(false)}
          onOpenLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />

      </ModalWrapper>
      {/* MODAL FORGOT PASSWORD */}
      <ModalWrapper
        visible={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Recuperar contraseña"
      >
        <ForgotPasswordModalContent
          onClose={() => setShowForgotModal(false)}
          onOpenLogin={() => {
            setShowForgotModal(false);
            setShowLoginModal(true);
          }}
        />
      </ModalWrapper>


    </SafeAreaView>
  );
}
