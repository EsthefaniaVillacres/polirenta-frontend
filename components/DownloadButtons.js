import React from "react";
import { View, Image, StyleSheet } from "react-native";

export default function DownloadButtons() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/google-play.png")}
        style={styles.button}
        resizeMode="contain"
      />
      <Image
        source={require("../assets/app-store.png")}
        style={styles.button}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "column",
    gap: 10,
  },
  button: {
    width: 250,
    height: 100,
    alignItems: "center",
  },
});
