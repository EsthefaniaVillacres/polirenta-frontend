import { StyleSheet, Platform } from "react-native";

const BASE_FONT = {
  fontFamily:
    Platform.OS === "web"
      ? "Arial"
      : Platform.OS === "android"
      ? "Sans-Serif"
      : "Helvetica Neue",
  color: "#777",
};
const BASE_FONT_BOLD = {
  fontFamily:
    Platform.OS === "web"
      ? "Arial"
      : Platform.OS === "android"
      ? "Sans-Serif"
      : "Helvetica Neue",
  color: "#000",
  fontWeight: "bold",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  title: {
    ...BASE_FONT_BOLD,
    marginBottom: 10,
  },
  subtitle: {
    ...BASE_FONT,
    marginBottom: 10,
  },
  bottom: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  rightText: {
    ...BASE_FONT_BOLD,
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default styles;
