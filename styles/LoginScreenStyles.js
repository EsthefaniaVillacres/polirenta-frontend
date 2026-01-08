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
  icon: {
    width: 100,
    height: 100,
    marginBottom: 30,
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: "#0d6a05ff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  loginText: {
    ...BASE_FONT_BOLD,
    color: "#fff",
  },
  link: {
    ...BASE_FONT,
    color: colors.primary,
    marginTop: 10,
    textDecorationLine: "underline",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },
});

export default styles;
