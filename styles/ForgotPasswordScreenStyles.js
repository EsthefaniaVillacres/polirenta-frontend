import { StyleSheet, Platform } from "react-native";
import colors from "../constants/colors";
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
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  label: {
    ...BASE_FONT_BOLD,
    marginTop: 10,
    alignSelf: "flex-start",
    maxWidth: 400,
    width: "100%",
  },
  input: {
    ...BASE_FONT,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  back: {
    backgroundColor: "#888",
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  register: {
    backgroundColor: "#0d6a05ff",
  },
  buttonText: {
    ...BASE_FONT_BOLD,
    color: "#fff",
  },
});

export default styles;
