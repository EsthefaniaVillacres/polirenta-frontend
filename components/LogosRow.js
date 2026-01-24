import React from "react";
import { View, Image, StyleSheet, useWindowDimensions } from "react-native";

export default function LogosRow({ isWeb }) {
  const { width } = useWindowDimensions();

  const logoSize = isWeb ? 150 : width * 0.25;

  return (
    <View style={[{ marginBottom: 20 }, styles.row]}>
      <Image
        source={require("../assets/logo1.png")}
        style={[styles.logo, { width: logoSize, height: logoSize }]}
        resizeMode="contain"
      />
      <Image
        source={require("../assets/logo2.png")}
        style={[styles.logo, { width: logoSize, height: logoSize }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  logo: {
    borderRadius: 10,
  },
});
