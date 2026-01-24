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

const BACKEND_URL = "https://backend-arriendos-production.up.railway.app";

const AdminDepartmentList = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const [inputHeight, setInputHeight] = useState(0);
  const [images, setImages] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isEditing] = useState(false);

  const [imageIndices, setImageIndices] = useState({});
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get("window").width;
  const isWeb = Platform.OS === "web";
  const inputWidth = isWeb ? Math.min(screenWidth * 0.95, 600) : "100%";

  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const notificationsRef = useRef([]);
  const pollingIntervalRef = useRef(null);
  const mountedRef = useRef(true);

  // ✅ Confirmación compatible Web + Android + iOS (sin romper SSR)
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

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Se requiere permiso para acceder a la galería.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImages((prev) => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      alert("No se pudo seleccionar la imagen.");
    }
  };

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/departments`);

      if (Array.isArray(response.data) && response.data.length > 0) {
        setDepartments(response.data);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error("Error al cargar departamentos:", error);
      alert("No se pudieron cargar los departamentos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchDepartments();
    }
  }, [fetchDepartments, user?.id]);

  const deleteDepartment = async (departmentId) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/api/auth/departments/${departmentId}`
      );

      if (response.status === 200) {
        // ✅ IMPORTANTE: filtrar por id_propiedad (tu backend usa ese campo)
        setDepartments((prev) =>
          prev.filter((department) => department.id_propiedad !== departmentId)
        );

        alert("Departamento eliminado con éxito.");
        fetchDepartments();
      }
    } catch (error) {
      console.error("Error al eliminar el departamento:", error);
      alert("No se pudo eliminar el departamento.");
    }
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

      const formattedNotifications = unreadNotifications.map((n) => {
        const data = JSON.parse(n.data ?? "{}");
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
    if (currentNotification) {
      const notificationData = JSON.parse(currentNotification.data ?? "{}");

      navigation.navigate("RentalRequests", {
        notificationId: currentNotification.id_notificacion,
        propertyId: notificationData.propertyId,
        inquilino: {
          id: notificationData.tenantId,
          nombres: notificationData.tenantName?.split(" ")[0] ?? "",
          apellidos:
            notificationData.tenantName?.split(" ").slice(1).join(" ") ?? "",
          email: notificationData.tenantEmail,
          telefono: notificationData.tenantPhone,
          cedula: notificationData.tenantCedula,
        },
      });

      setShowNotification(false);
    }
  };

  const handleNotificationClose = () => {
    if (currentNotification) {
      NotificationService.markAsRead(currentNotification.id_notificacion);

      const updatedNotifications = notifications.filter(
        (n) => n.id_notificacion !== currentNotification.id_notificacion
      );

      setNotifications(updatedNotifications);
      notificationsRef.current = updatedNotifications;

      if (updatedNotifications.length > 0) {
        setCurrentNotification(updatedNotifications[0]);
        setShowNotification(true);
      } else {
        setCurrentNotification(null);
        setShowNotification(false);
      }
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadNotifications();

      const timeoutId = setTimeout(() => {
        startPolling();
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [user?.id, loadNotifications, startPolling]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // ✅ función segura para fotos (evita que JSON.parse rompa)
  const getImageUrlsFromFotos = (fotos) => {
    try {
      let fotosArray = [];

      if (Array.isArray(fotos)) {
        fotosArray = fotos;
      } else if (typeof fotos === "string") {
        fotosArray = JSON.parse(fotos || "[]");
      } else {
        fotosArray = [];
      }

      if (!Array.isArray(fotosArray)) fotosArray = [];

      return fotosArray.map((foto) => `${BACKEND_URL}/images/${foto}`);
    } catch (error) {
      console.warn("Fotos inválidas, no se pudo parsear:", fotos);
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
            <Header isLoggedIn={true} />
            <Text style={styles.emptyMessage}>Departamento sin registrar</Text>
          </View>
        ) : (
          <ScrollView
            style={isWeb ? styles.webScrollView : styles.flex}
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
            <Header isLoggedIn={true} />

            {departments.map((department, index) => {
              const imageUrls = getImageUrlsFromFotos(department?.fotos);
              const currentIndex = imageIndices[index] || 0;

              return (
                <View key={department?.id_propiedad ?? index} style={styles.container}>
                  <View style={styles.departmentContent}></View>

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
                            onError={() => {
                              console.error("Error al cargar la imagen");
                            }}
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
                      <Text style={styles.title}>Departamento {index + 1}</Text>

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
                        onPress={() => navigation.goBack()}
                      >
                        <Text style={styles.buttonText}>Atrás</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.button, styles.register]}
                        onPress={() => {
                          navigation.navigate("AdminEditDepartment", {
                            departmentId: department.id_propiedad,
                          });
                        }}
                      >
                        <Text style={styles.buttonText}>Editar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.button, styles.delete]}
                        onPress={() => confirmDelete(department.id_propiedad)}
                      >
                        <Text style={styles.buttonText}>Eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default AdminDepartmentList;
