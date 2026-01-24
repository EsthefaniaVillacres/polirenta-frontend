import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
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
import styles from "../../styles/ResidenceViewScreenStyles";
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

const ResidenceViewScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const [inputHeight, setInputHeight] = useState(0);
  const [images, setImages] = useState([]);
  const [residences, setResidences] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isEditing] = useState(false);
  const [imageIndices, setImageIndices] = useState({});
  const [loading, setLoading] = useState(true);

  // Referencias para evitar re-renders innecesarios
  const residencesRef = useRef([]);
  const notificationsRef = useRef([]);
  const pollingIntervalRef = useRef(null);
  const mountedRef = useRef(true);

  const { width: screenWidth } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const inputWidth = isWeb ? Math.min(screenWidth * 0.95, 600) : "100%";

  const mapComodidades = {
    "Ducha eléctrica": "electricShower",
    "Ducha con calefón": "showerHeater",
    Lavadora: "washer",
    Secadora: "dryer",
    Internet: "internet",
    Agua: "water",
    Luz: "light",
  };

  const mapConvivencia = {
    "Mascotas permitidas": "petsAllowed",
    "Baño compartido": "sharedBathroom",
    "Ducha compartida": "sharedShower",
    "Cocina compartida": "sharedKitchen",
    "Sala compartida": "sharedLivingRoom",
    "Comedor compartido": "sharedDinigRoom",
  };

  // ✅ JSON.parse seguro
  const safeParseJSON = (value, fallback = []) => {
    if (!value) return fallback;
    if (Array.isArray(value)) return value;

    try {
      const parsed = JSON.parse(value);
      return parsed ?? fallback;
    } catch (e) {
      return fallback;
    }
  };

  // ✅ confirmación compatible Web + Mobile + SSR
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

  const fetchResidences = useCallback(
    async (showLoadingIndicator = false) => {
      if (!user?.id) return;

      if (showLoadingIndicator) setLoading(true);

      try {
        const response = await axios.get(
          `https://backend-arriendos-production.up.railway.app/api/auth/residences?userId=${user?.id}`
        );

        const newResidences = Array.isArray(response.data) ? response.data : [];

        if (!isEqual(newResidences, residencesRef.current)) {
          residencesRef.current = newResidences;
          if (mountedRef.current) {
            setResidences(newResidences);
          }
        }
      } catch (error) {
        console.error("Error al cargar residencias:", error);
        if (showLoadingIndicator) {
          alert("No se pudieron cargar las residencias.");
        }
      } finally {
        if (showLoadingIndicator && mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [user?.id]
  );

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
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    pollingIntervalRef.current = setInterval(async () => {
      if (mountedRef.current && user?.id) {
        await Promise.all([fetchResidences(false), loadNotifications()]);
      }
    }, 3000);
  }, [fetchResidences, loadNotifications, user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    fetchResidences(true);
    loadNotifications();

    const timeoutId = setTimeout(() => {
      startPolling();
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [user?.id, fetchResidences, loadNotifications, startPolling]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const subscription = NotificationService.setupNotificationListener(
      (notification) => {
        console.log("Nueva notificación recibida:", notification);
        loadNotifications();
      }
    );

    return () => {
      if (subscription?.remove) subscription.remove();
    };
  }, [user?.id, loadNotifications]);

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
        nombres: notificationData.tenantName?.split(" ")[0] || "",
        apellidos:
          notificationData.tenantName?.split(" ").slice(1).join(" ") || "",
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
  };

  const deleteResidence = async (residenceId) => {
    try {
      const response = await axios.delete(
        `https://backend-arriendos-production.up.railway.app/api/auth/residences/${residenceId}`
      );

      if (response.status === 200) {
        // ✅ OJO: aquí se debe comparar con id_propiedad
        const updatedResidences = residences.filter(
          (r) => r.id_propiedad !== residenceId
        );

        setResidences(updatedResidences);
        residencesRef.current = updatedResidences;

        alert("Residencia eliminada con éxito.");

        setTimeout(() => {
          fetchResidences(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Error al eliminar la residencia:", error);
      alert("No se pudo eliminar la residencia.");
    }
  };

  const confirmDelete = async (residenceId) => {
    const confirmed = await confirmAction(
      "¿Estás seguro de que deseas eliminar esta residencia?"
    );

    if (confirmed) {
      deleteResidence(residenceId);
    }
  };

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
      const uri = result.assets?.[0]?.uri;
      if (uri) setImages((prev) => [...prev, uri]);
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
        ) : residences.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyMessage}>Residencias sin registrar</Text>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate("RegisterProperty")}
            >
              <Text style={styles.buttonText}>Registrar residencia</Text>
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

            {residences.map((residence, index) => {
              const comodidadesKeys = (residence.comodidades || "")
                .split(", ")
                .map((c) => mapComodidades[c])
                .filter(Boolean);

              const convivenciaKeys = (residence.convivencia || "")
                .split(", ")
                .map((c) => mapConvivencia[c])
                .filter(Boolean);

              const fotosArray = safeParseJSON(residence?.fotos, []);
              const imageUrls = fotosArray.map(
                (foto) =>
                  `https://backend-arriendos-production.up.railway.app/images/${foto}`
              );

              const currentIndex = imageIndices[index] || 0;

              return (
                <View
                  key={`residence-${residence.id_propiedad}-${index}`}
                  style={styles.container}
                >
                  <View style={styles.residenceContent}></View>

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
                            onError={() => console.error("Error al cargar imagen")}
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
                      <Text style={styles.title}>Residencia {index + 1}</Text>
                      <TextInput
                        style={[
                          styles.input,
                          styles.textAreaAuto,
                          { height: Math.max(40, inputHeight) },
                        ]}
                        value={residence?.descripcion || ""}
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
                          $ {residence?.precio_mensual || 0} al mes
                        </Text>
                        <Text style={styles.detailsText}>
                          {residence?.tipo_arrendatario || ""}
                        </Text>
                        <Text style={styles.detailsText}>
                          {residence?.cantidad_habitaciones || 0} Habitación(es)
                        </Text>
                        <Text style={styles.detailsText}>
                          {residence?.cantidad_banos_individuales || 0} Baño(s)
                          Individual(es)
                        </Text>
                        <Text style={styles.detailsText}>
                          {residence?.cantidad_salas || 0} Sala(s)
                        </Text>
                        <Text style={styles.detailsText}>
                          {residence?.cantidad_parqueaderos || 0} Parqueadero(s)
                        </Text>
                      </View>

                      <View style={styles.detailsColumn}>
                        <Text style={styles.detailsText}>Forma de pago</Text>
                        <Text style={styles.detailsSubText}>
                          {residence?.metodos_pago || ""}
                        </Text>
                        <Text style={styles.detailsText}>Comodidades</Text>
                        <Text style={styles.detailsSubText}>
                          {residence?.comodidades || ""}
                        </Text>
                        <Text style={styles.detailsText}>Convivencia</Text>
                        <Text style={styles.detailsSubText}>
                          {residence?.convivencia || ""}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailsText}>
                      <Text style={styles.label}>Ubicación</Text>
                      <TextInput
                        style={styles.input}
                        value={residence?.direccion || ""}
                        editable={false}
                        placeholder="Dirección no disponible"
                      />
                    </View>

                    <MapComponent
                      latitude={
                        isNaN(Number(residence?.latitud))
                          ? -1.66355
                          : Number(residence?.latitud)
                      }
                      longitude={
                        isNaN(Number(residence?.longitud))
                          ? -78.654646
                          : Number(residence?.longitud)
                      }
                    />

                    <TouchableOpacity
                      style={[styles.button, styles.secondary]}
                      onPress={() =>
                        navigation.navigate("ResidenceRoomView", {
                          residenceId: residence.id_propiedad,
                          precio_mensual: residence.precio_mensual,
                          cantidad_habitaciones: residence.cantidad_habitaciones,
                          tipo_bano:
                            residence.cantidad_banos_individuales > 0 &&
                            residence.cantidad_banos_compartidos > 0
                              ? "mixto"
                              : residence.cantidad_banos_individuales > 0
                              ? "individual"
                              : "compartido",
                          comodidades_residencia: comodidadesKeys,
                          convivencia_residencia: convivenciaKeys,
                          capacidad_total:
                            residence.capacidad_total ??
                            (residence.cantidad_hombres || 0) +
                              (residence.cantidad_mujeres || 0),
                        })
                      }
                    >
                      <Text style={styles.buttonText}>Cuartos de la residencia</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[styles.button, styles.back]}
                        onPress={() => confirmDelete(residence.id_propiedad)}
                      >
                        <Text style={styles.buttonText}>Eliminar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.button, styles.register]}
                        onPress={() =>
                          navigation.navigate("EditResidence", {
                            residenceId: residence.id_propiedad,
                          })
                        }
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
              <Text style={styles.addDeptText}>Agregar otra residencia</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ResidenceViewScreen;
