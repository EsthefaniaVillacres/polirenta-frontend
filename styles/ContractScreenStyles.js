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
  flex: {
    flex: 1,
  },
  webContainer: {
    height: "100vh",
    flexDirection: "column",
  },
  webScrollView: {
    flexGrow: 1,
    overflow: "auto",
  },
  container: {
    alignItems: "center",
    backgroundColor: colors.background,
    width: "100%",
    paddingTop: 10,
    paddingBottom: 20,
  },
  form: {
    paddingHorizontal: 20,
  },
  
  title: {
    ...BASE_FONT_BOLD,
    marginBottom: 50,
    textAlign: "center",
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
  register: {
    backgroundColor: "#0d6a05ff",
  },
  buttonText: {
    ...BASE_FONT_BOLD,
    color: "#fff",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  accordionContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginVertical: 5,
    overflow: "hidden",
    width: "100%",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: "100%",
  },

  accordionTitle: {
    ...BASE_FONT,

    fontWeight: "500",
  },

  accordionContent: {
    padding: 15,
    backgroundColor: "#fff",
  },
  optionButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginVertical: 5,
  },

  optionSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },

  optionText: {
    ...BASE_FONT,
    color: "#000",
  },

  optionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default styles;
