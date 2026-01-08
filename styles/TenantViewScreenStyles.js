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
    flexDirection: "row",
    justifyContent: "center",
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
    minHeight: 40,
    textAlignVertical: "top",
    padding: 10,
    width: "100%",
    overflow: "visible",
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
    backgroundColor: "#000",
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
      backgroundColor: "#0d6a05",
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
    backgroundColor: "#007BFF", 
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
    fontSize: 14,
    color: "#777",
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
    fontSize: 14,
    color: "#000",
  },
  optionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  webSidebar: {
    position: "fixed",
    top: 60, 
    left: 16,
    width: 250,
    padding: 12,
    backgroundColor: "transparent",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    zIndex: 1000, 
    overflowY: "auto",
    maxHeight: "100vh", 
  },

  filterLabel: {
    fontWeight: "bold",
    marginTop: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  checkbox: {
    padding: 4,
  },
  filterButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    minWidth: 80,
  },
  filterButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  mainContentWeb: {
    flex: 1,
    paddingLeft: 100,
    paddingRight: 20,
    justifyContent: "flex-start",
    alignItems: "center", 
    display: "flex",
    position: "relative",
    zIndex: 1,
  },

  mainContentMobile: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginLeft: 0,
  },
  residencesContainerWeb: {
    width: "100%",
    maxWidth: 1200,
    alignItems: "center",
    marginHorizontal: "auto",
    position: "relative",
    zIndex: 1,
  },
  residencesContainerMobile: {
    flex: 1,
    paddingHorizontal: 16,
    maxWidth: 800,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginLeft: 0,
  },
  priceFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  priceInput: {
    flex: 1,
    marginRight: 8,
    minWidth: 120,
  },
  mobileSidebar: {
    width: "95%",
    maxWidth: 600,
    alignSelf: "center",
    padding: 12,
    backgroundColor: "transparent",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  expandButton: {
    paddingVertical: 10,
    alignItems: "center",
  },
  expandButtonText: {
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default styles;
