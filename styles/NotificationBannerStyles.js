import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  message: {
    fontSize: 13,
    color: "#555",
  },
  viewButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    padding: 4,
  },
});
