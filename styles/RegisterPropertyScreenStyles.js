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
  label: {
    ...BASE_FONT_BOLD,
    marginTop: 10,
  },
  title: {
    ...BASE_FONT_BOLD,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    ...BASE_FONT,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
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

  genderRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
    gap: 5,
  },

  genderOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "32%",
    marginBottom: 10,
  },

  genderTextBlock: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
  },

  genderLabel: {
    ...BASE_FONT_BOLD,
  },

  genderDescription: {
    ...BASE_FONT,
    fontSize: 12,
    marginTop: 2,
  },
  subtitle: {
    ...BASE_FONT,
    fontSize: 12,
    textAlign: "left",
    marginTop: 2,
  },
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    alignSelf: "center",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imagePlaceholder: {
    fontSize: 16,
    color: "#888",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 10,
  },

  labelContainer: {
    flex: 1,
  },

  counterControls: {
    flexDirection: "row",
    alignItems: "center",
  },

  counterButton: {
    backgroundColor: "#ccc",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },

  counterButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  counterValue: {
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
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
  buttonLocation: {
    backgroundColor: "#007AFF",
    marginTop: 10,
  },
  clearButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
    backgroundColor: "#000",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 20,
  },
  menuButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
  },

  menuButton: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingVertical: 10,
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "#ddd",
  },

  menuButtonsWrapper: {
    alignSelf: "center",
  },

  menuButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default styles;
