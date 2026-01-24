import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { Text } from "react-native-paper";
import Header from "../../components/Header";
import styles from "../../styles/LandlordViewScreenStyles";
import * as ImagePicker from "expo-image-picker";
import MapComponent from "../../components/MapComponent";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import NotificationBanner from "../../components/NotificationBanner";
import NotificationService from "../../services/NotificationService";
import isEqual from "lodash.isequal";
import { useWindowDimensions } from "react-native";

const LandlordViewScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const [inputHeight, setInputHeight] = useState(0);
  const [images, setImages] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isEditing] = useState(false); // lo mantengo, pero no lo usas para editar
  const [imageIndices, setImageIndices] = useState({});
  const [loading, setLoading] = useState(true);

  const { width: screenWidth } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const inputWidth = isWeb ? Math.min(screenWidth * 0.95, 600) : "100%";

  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const notificationsRef = useRef([]);
  const pollingIntervalRef = useRef(null);
  const mountedRef = useRef(true);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult?.granted) {
      alert("Se requiere permiso para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets?.[0]?.uri].filter(Boolean));
    }
  };

  const fetchDepartments = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://backend-arriendos-production.up.railway.app/api/auth/departments?userId=${user.id}`
      );

      const data = Array.isArray(response.data) ? response.data : [];
      setDepartments(data);
    } catch (error) {
      console.error("Error al cargar departamentos:", error);
      alert("No se pudieron cargar los departamentos.");
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchDepartments();
  }, [fetchDepartments, user?.id]);

  const deleteDepartment = async (departmentId) => {
    try {
      const response = await axios.delete(
        `https://backend-arriendos-production.up.railway.app/api/auth/departments/${departmentId}`
      );

      if (response.status === 200) {
        // ✅ CORRECCIÓN: tu ID real es id_propiedad, no "id"
        setDepartments((prev) =>
          prev.filter((d) => d.id_propiedad !== departmentId)
        );
        alert("Departamento eliminado con éxito.");
        fetchDepartments();
      }
    } catch (error) {
      console.error("Error al eliminar el departamento:", error);
      alert("No se pudo eliminar el departamento.");
    }
  };

  // ✅ Confirmación segura en Web y Mobile
  const confirmAction = async (message) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return window.confirm(message);
    }

    return new Promise((resolve) => {
      Alert.alert("Confirmación", message, [
        { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
        { text: "Eliminar", style: "destructive", onPress: () => resolve(true) },
      ]);
    });
  };

  const confirmDelete = async (departmentId) => {
    const confirmed = await confirmAction(
      "¿Estás seguro de que deseas eliminar este departamento?"
    );

    if (confirmed) {
      deleteDepartment(departmentId);
    }
  };

  const loadNotifications = useCallback(async () => {
    try {
      const unreadNotifications =
        await NotificationService.getUnreadNotificationsLandlord(user?.id);

      const formattedNotifications = (unreadNotifications ?? []).map((n) => {
        let data = {};
        try {
          data = JSON.parse(n.data ?? "{}");
        } catch {
          data = {};
        }

        return {
          ...n,
          title: "Nueva solicitud de arriendo",
          message: `El inquilino ${
            data.tenantName ?? "desconocido"
          } está interesado en tu propiedad.`,
        };
      });

      if (!isEqual(formattedNotifications, notificationsRef.current)) {
        notificationsRef.current = formattedNotifications;

        if (mountedRef.current) {
          setNotifications(formattedNotifications);

          if (formattedNotifications.length > 0) {
            setCurrentNotification(formattedNotifications[0]);
            setShowNotification(true);
          } else {
            setCurrentNotification(null);
            setShowNotification(false);
          }
        }
      }
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    }
  }, [user?.id]);

  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      if (mountedRef.current && user?.id) {
        await loadNotifications();
      }
    }, 3000);
  }, [loadNotifications, user?.id]);

  const handleNotificationPress = () => {
    if (!currentNotification) return;

    let notificationData = {};
    try {
      notificationData = JSON.parse(currentNotification.data ?? "{}");
    } catch {
      notificationData = {};
    }

    navigation.navigate("RentalRequests", {
      notificationId: currentNotification.id_notificacion,
      propertyId: notificationData.propertyId,
      inquilino: {
        id: notificationData.tenantId,
        nombres: notificationData.tenantName?.split(" ")[0] ?? "",
        apellidos: notificationData.tenantName
          ? notificationData.tenantName.split(" ").slice(1).join(" ")
          : "",
        email: notificationData.tenantEmail,
        telefono: notificationData.tenantPhone,
        cedula: notificationData.tenantCedula,
      },
    });

    setShowNotification(false);
  };

  const handleNotificationClose = () => {
    if (!currentNotification) return;

    NotificationService.markAsRead(currentNotification.id_notificacion);

    const updated = notifications.filter(
      (n) => n.id_notificacion !== currentNotification.id_notificacion
    );

    setNotifications(updated);
    notificationsRef.current = updated;

    if (updated.length > 0) {
      setCurrentNotification(updated[0]);
      setShowNotification(true);
    } else {
      setCurrentNotification(null);
      setShowNotification(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    loadNotifications();
    const timeoutId = setTimeout(() => startPolling(), 2000);

    return () => {
      clearTimeout(timeoutId);
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [user?.id, loadNotifications, startPolling]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  // ✅ parse seguro de fotos (evita crash por JSON.parse)
  const safeParseFotos = (fotos) => {
    if (!fotos) return [];
    if (Array.isArray(fotos)) return fotos;

    try {
      const parsed = JSON.parse(fotos);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <NotificationBanner
        notification={currentNotification}
        onPress={handleNotificationPress}
        onClose={handleNotificationClose}
        isVisible={showNotification}
      />

      <View style={isWeb ? styles.webContainer : styles.flex}>
        {loading ? (
          <Text>Cargando...</Text>
        ) : departments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyMessage}>Departamento sin registrar</Text>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate("RegisterProperty")}
            >
              <Text style={styles.buttonText}>Registrar departamento</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            style={isWeb ? styles.webScrollView : styles.flex}
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
            {/* ENCABEZADO */}
            <View
              style={{
                height: 70,
                width: "100%",
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 1, backgroundColor: "#B80000" }} />
              <View style={{ flex: 1, backgroundColor: "#ffffff" }} />
              <View style={{ flex: 1, backgroundColor: "#006400" }} />
            </View>

            <Header isLoggedIn={true} />

            {departments.map((department, index) => {
              const fotosArray = safeParseFotos(department?.fotos);
              const imageUrls = fotosArray.map(
                (foto) =>
                  `https://backend-arriendos-production.up.railway.app/images/${foto}`
              );
              const currentIndex = imageIndices[index] || 0;

              return (
                <View key={department?.id_propiedad ?? index} style={styles.container}>
                  <View style={styles.departmentContent} />
                  <View style={[styles.form, { width: inputWidth }]}>
                    {isEditing && (
                      <TouchableOpacity
                        onPress={pickImage}
                        style={[styles.imagePicker, { width: inputWidth }]}
                      >
                        {images.length > 0 ? (
                          <Image
                            source={{ uri: images[0] }}
                            style={styles.imagePreview}
                            onError={() => console.error("Error al cargar la imagen")}
                          />
                        ) : (
                          <Text style={styles.imagePlaceholder}>
                            + Agregar imagen
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}

                    <View style={[styles.carouselWrapper, { width: inputWidth }]}>
                      <View style={styles.carouselContainer}>
                        {imageUrls.length === 0 ? (
                          <Text style={styles.imagePlaceholder}>Sin imágenes</Text>
                        ) : (
                          <>
                            <Image
                              source={{ uri: imageUrls[currentIndex] }}
                              style={styles.carouselImage}
                              resizeMode="cover"
                            />
                            {imageUrls.length > 1 && (
                              <View style={styles.arrowContainer}>
                                <TouchableOpacity
                                  onPress={() =>
                                    setImageIndices((prev) => ({
                                      ...prev,
                                      [index]:
                                        currentIndex === 0
                                          ? imageUrls.length - 1
                                          : currentIndex - 1,
                                    }))
                                  }
                                  style={styles.arrowButton}
                                >
                                  <Ionicons
                                    name="chevron-back"
                                    size={32}
                                    color="#fff"
                                  />
                                </TouchableOpacity>

                                <TouchableOpacity
                                  onPress={() =>
                                    setImageIndices((prev) => ({
                                      ...prev,
                                      [index]:
                                        currentIndex === imageUrls.length - 1
                                          ? 0
                                          : currentIndex + 1,
                                    }))
                                  }
                                  style={styles.arrowButton}
                                >
                                  <Ionicons
                                    name="chevron-forward"
                                    size={32}
                                    color="#fff"
                                  />
                                </TouchableOpacity>
                              </View>
                            )}
                          </>
                        )}
                      </View>
                    </View>

                    <View style={styles.container}>
                      <Text style={styles.title}>
                        Departamento {index + 1}
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          styles.textAreaAuto,
                          { height: Math.max(40, inputHeight) },
                        ]}
                        value={department?.descripcion || ""}
                        multiline
                        editable={false}
                        scrollEnabled={false}
                        onContentSizeChange={(event) =>
                          setInputHeight(event.nativeEvent.contentSize.height)
                        }
                      />
                    </View>

                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("RentalRequests")}
                      >
                        <Icon name="users" size={24} color="#000" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.detailsRow}>
                      <View style={styles.detailsColumn}>
                        <Text style={styles.detailsText}>
                          $ {department?.precio_mensual || 0} al mes
                        </Text>
                        <Text style={styles.detailsText}>
                          {department?.tipo_arrendatario || ""}
                        </Text>
                        <Text style={styles.detailsText}>
                          {department?.cantidad_habitaciones || 0} Habitación(es)
                        </Text>
                        <Text style={styles.detailsText}>
                          {department?.cantidad_banos_individuales || 0} Baño(s)
                          Individual(es)
                        </Text>
                        <Text style={styles.detailsText}>
                          {department?.cantidad_salas || 0} Sala(s)
                        </Text>
                        <Text style={styles.detailsText}>
                          {department?.cantidad_parqueaderos || 0} Parqueadero(s)
                        </Text>
                      </View>

                      <View style={styles.detailsColumn}>
                        <Text style={styles.detailsText}>Forma de pago</Text>
                        <Text style={styles.detailsSubText}>
                          {department?.metodos_pago || ""}
                        </Text>

                        <Text style={styles.detailsText}>Comodidades</Text>
                        <Text style={styles.detailsSubText}>
                          {department?.comodidades || ""}
                        </Text>

                        <Text style={styles.detailsText}>Convivencia</Text>
                        <Text style={styles.detailsSubText}>
                          {department?.convivencia || ""}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailsText}>
                      <Text style={styles.label}>Ubicación</Text>
                      <TextInput
                        style={styles.input}
                        value={department?.direccion || ""}
                        editable={false}
                        placeholder="Dirección no disponible"
                      />
                    </View>

                    <MapComponent
                      latitude={
                        isNaN(Number(department?.latitud))
                          ? -1.66355
                          : Number(department?.latitud)
                      }
                      longitude={
                        isNaN(Number(department?.longitud))
                          ? -78.654646
                          : Number(department?.longitud)
                      }
                    />

                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[styles.button, styles.back]}
                        onPress={() => confirmDelete(department.id_propiedad)}
                      >
                        <Text style={styles.buttonText}>Eliminar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.button, styles.register]}
                        onPress={() => {
                          navigation.navigate("EditDepartment", {
                            departmentId: department.id_propiedad,
                          });
                        }}
                      >
                        <Text style={styles.buttonText}>Editar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}

            <TouchableOpacity
              style={styles.addDeptButton}
              onPress={() => navigation.navigate("RegisterProperty")}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.addDeptText}>Agregar otro departamento</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default LandlordViewScreen;
