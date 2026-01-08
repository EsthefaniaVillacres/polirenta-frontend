import React from "react";
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

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

export default function HomeScreen() {
  const fontSizeTitle = isWeb ? 40 : width * 0.12;
  const fontSizeSubtitle = isWeb ? 20 : width * 0.05;

  return (
    <SafeAreaView style={styles.container}>
      {/* ENCABEZADO */}
    <View style={{
      height: 70,
      width: "100%",
      flexDirection: "row"
    }}>
      <View style={{ flex: 1, backgroundColor: "#B80000" }} />   
      <View style={{ flex: 1, backgroundColor: "#ffffff" }} />
      <View style={{ flex: 1, backgroundColor: "#006400" }} />
    </View>
      <Header isLoggedIn={false} />

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
    </SafeAreaView>
  );
}
