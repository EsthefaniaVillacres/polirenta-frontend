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
    backgroundColor: "#fff",
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
  textAreaAuto: {
    textAlignVertical: "top",
    padding: 10,
    width: "100%",
  },
  iconContainer: {
    width: "100%",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 15,
  },

  detailsColumn: {
    width: "48%",
  },

  detailsText: {
    ...BASE_FONT_BOLD,
    marginBottom: 5,
  },

  detailsSubText: {
    ...BASE_FONT,

    marginBottom: 10,
  },
  addDeptButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0d6a05ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 30,
    alignSelf: "center",
    marginBottom: 30,
  },

  addDeptText: {
    ...BASE_FONT_BOLD,
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
  carouselWrapper: {
    alignSelf: "center",
    marginBottom: 20,
  },

  carouselContainer: {
    position: "relative",
    height: 250,
    borderRadius: 10,
    overflow: "hidden",
  },

  carouselImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },

  arrowContainer: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    top: "45%",
  },

  arrowButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 5,
  },

  secondary: {
    backgroundColor: "#04786dff",
    marginBottom: 10,
  },

  label: {
    ...BASE_FONT_BOLD,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  registerButton: {
    backgroundColor: "#0d6a05ff", 
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  separator: {
    height: 5,
    backgroundColor: "red", 
    marginVertical: 50,
  },

  residenceContent: {
    padding: 10, 
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
});

export default styles;
