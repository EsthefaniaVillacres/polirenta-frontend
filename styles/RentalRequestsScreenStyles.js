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
    marginBottom: 10,
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

  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
  },
  nameSection: {
    flex: 1,
  },
  name: {
    ...BASE_FONT_BOLD,
    fontSize: 16,
  },
  phone: {
    ...BASE_FONT,

    marginTop: 4,
  },

  acceptButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});

export default styles;
