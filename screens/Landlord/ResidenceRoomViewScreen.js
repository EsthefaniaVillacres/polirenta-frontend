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
import styles from "../../styles/ResidenceRoomViewScreenStyles";
import * as ImagePicker from "expo-image-picker";
import MapComponent from "../../components/MapComponent";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import NotificationBanner from "../../components/NotificationBanner";
import NotificationService from "../../services/NotificationService";
import isEqual from "lodash.isequal";
import axios from "axios";
import { useWindowDimensions } from "react-native";

const ResidenceRoomViewScreen = ({ navigation, route }) => {
  const {
    residenceId,
    precio_mensual,
    cantidad_habitaciones,
    tipo_bano,
    comodidades_residencia,
    convivencia_residencia,
    capacidad_total,
  } = route.params || {};

  const { user } = useContext(AuthContext);

  const [inputHeight, setInputHeight] = useState(0);
  const [images, setImages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isEditing] = useState(false);
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

  // ✅ parse seguro para fotos (evita crash)
  const safeParseFotos = (fotos) => {
    if (!fotos) return [];
    if (Array.isArray(fotos)) return fotos;

    try {
      const parsed = JSON.parse(fotos);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
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

  const fetchRooms = useCallback(async () => {
    if (!residenceId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://backend-arriendos-production.up.railway.app/api/auth/rooms/by-residence/${residenceId}`
      );

      const data = Array.isArray(response.data) ? response.data : [];
      setRooms(data);
    } catch (error) {
      console.error("Error al cargar cuartos:", error);
      alert("No se pudieron cargar los cuartos.");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [residenceId]);

  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, [fetchRooms])
  );

  useEffect(() => {
    if (!user) {
      alert("Sesión expirada. Por favor inicia sesión nuevamente.");
      navigation.navigate("Login");
      return;
    }

    if (!residenceId) {
      alert("No se proporcionó el ID de la residencia.");
      navigation.goBack();
      return;
    }
  }, [user, residenceId, navigation]);

  const deleteRoom = async (roomId) => {
    try {
      const response = await axios.delete(
        `https://backend-arriendos-production.up.railway.app/api/auth/rooms/${roomId}`
      );

      if (response.status === 200) {
        setRooms((prev) => prev.filter((r) => r.id_habitacion !== roomId));
        alert("Cuarto eliminado con éxito.");
        fetchRooms();
      }
    } catch (error) {
      console.error("Error al eliminar el cuarto:", error);
      alert("No se pudo eliminar el cuarto.");
    }
  };

  const confirmDeleteRoom = async (roomId) => {
    const confirmed = await confirmAction(
      "¿Estás seguro de que deseas eliminar este cuarto?"
    );

    if (confirmed) {
      deleteRoom(roomId);
    }
  };

  // =======================
  // NOTIFICACIONES (SEGURO)
  // =======================
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

        const fullName =
          data.tenantName ||
          data.tenantFullName ||
          (data.firstName && data.lastName
            ? `${data.firstName} ${data.lastName}`
            : null);

        return {
          ...n,
          title: "Nueva solicitud de arriendo",
          message: `El inquilino ${
            fullName || "desconocido"
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

  // =======================
  // UI
  // =======================
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
        ) : rooms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyMessage}>Cuartos sin registrar</Text>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => {
                if (rooms.length >= cantidad_habitaciones) {
                  alert(
                    "Ya has registrado todas las habitaciones permitidas para esta residencia."
                  );
                  return;
                }

                navigation.navigate("RegisterRoom", {
                  idPropiedad: residenceId,
                  cantidad_habitaciones,
                  habitaciones_registradas: rooms.length,
                  habitaciones_registradas_array: rooms.map(
                    (r) => r.numero_habitacion
                  ),
                  precio_total_residencia: precio_mensual,
                  sumaPreciosActuales: rooms.reduce((sum, r) => {
                    const precio = Number(r?.precio_mensual) || 0;
                    return Number(sum) + precio;
                  }, 0),
                  tipo_bano,
                  comodidades_residencia,
                  convivencia_residencia,
                  capacidad_total,
                  capacidad_actual: rooms.reduce((sum, r) => {
                    return Number(sum) + (Number(r?.capacidad) || 0);
                  }, 0),
                });
              }}
            >
              <Text style={styles.buttonText}>Registrar cuarto</Text>
            </TouchableOpacity>

            <View style={{ alignItems: "flex-start", marginTop: 20 }}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.buttonText}>Atrás</Text>
              </TouchableOpacity>
            </View>
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

            {rooms.map((room, index) => {
              const fotosArray = safeParseFotos(room?.fotos);
              const imageUrls = fotosArray.map(
                (foto) =>
                  `https://backend-arriendos-production.up.railway.app/images/${foto}`
              );
              const currentIndex = imageIndices[index] || 0;

              return (
                <View
                  key={room?.id_habitacion ?? index}
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
                      <Text style={styles.title}>Cuarto {index + 1}</Text>
                      <TextInput
                        style={[
                          styles.input,
                          styles.textAreaAuto,
                          { height: Math.max(40, inputHeight) },
                        ]}
                        value={room?.caracteristicas || ""}
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
                          Número de habitación:{" "}
                          {room?.numero_habitacion ?? "No especificado"}
                        </Text>

                        <Text style={styles.detailsText}>
                          $ {room?.precio_mensual || 0} al mes
                        </Text>

                        <Text style={styles.detailsText}>
                          {room?.tipo_arrendatario || ""}
                        </Text>

                        <Text style={styles.detailsText}>
                          {room?.cantidad_banos_individuales || 0} Baño(s)
                          Individual(es)
                        </Text>

                        <Text style={styles.detailsText}>
                          {room?.cantidad_parqueaderos || 0} Parqueadero(s)
                        </Text>
                      </View>

                      <View style={styles.detailsColumn}>
                        <Text style={styles.detailsText}>Forma de pago</Text>
                        <Text style={styles.detailsSubText}>
                          {room?.metodos_pago || ""}
                        </Text>

                        <Text style={styles.detailsText}>Comodidades</Text>
                        <Text style={styles.detailsSubText}>
                          {room?.comodidades || ""}
                        </Text>

                        <Text style={styles.detailsText}>Convivencia</Text>
                        <Text style={styles.detailsSubText}>
                          {room?.convivencia || ""}
                        </Text>

                        <Text style={styles.detailsText}>Capacidad</Text>
                        <Text style={styles.detailsSubText}>
                          {room?.capacidad ?? "No especificado"} personas
                        </Text>

                        <Text style={styles.detailsText}>Disponibilidad</Text>
                        <Text style={styles.detailsSubText}>
                          {room?.disponibilidad ?? "No especificada"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailsText}>
                      <Text style={styles.label}>Ubicación</Text>
                      <TextInput
                        style={styles.input}
                        value={room?.direccion || ""}
                        editable={false}
                        placeholder="Dirección no disponible"
                      />
                    </View>

                    <MapComponent
                      latitude={
                        isNaN(Number(room?.latitud))
                          ? -1.66355
                          : Number(room?.latitud)
                      }
                      longitude={
                        isNaN(Number(room?.longitud))
                          ? -78.654646
                          : Number(room?.longitud)
                      }
                    />

                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[styles.button, styles.back]}
                        onPress={() => confirmDeleteRoom(room.id_habitacion)}
                      >
                        <Text style={styles.buttonText}>Eliminar cuarto</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.button, styles.register]}
                        onPress={() => {
                          navigation.navigate("EditRoom", {
                            idPropiedad: room.id_propiedad,
                            cantidad_habitaciones,
                            habitaciones_registradas: rooms.length,
                            habitaciones_registradas_array: rooms.map(
                              (r) => r.numero_habitacion
                            ),
                            precio_total_residencia: precio_mensual,
                            sumaPreciosActuales: rooms.reduce((sum, r) => {
                              const precio = Number(r?.precio_mensual) || 0;
                              return Number(sum) + precio;
                            }, 0),
                            capacidad_total,
                            capacidad_actual: rooms.reduce((sum, r) => {
                              return Number(sum) + (Number(r?.capacidad) || 0);
                            }, 0),
                            comodidades_residencia,
                            convivencia_residencia,
                            roomData: room,
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
              onPress={() => {
                if (rooms.length >= cantidad_habitaciones) {
                  alert(
                    "Ya has registrado todas las habitaciones permitidas para esta residencia."
                  );
                  return;
                }

                navigation.navigate("RegisterRoom", {
                  idPropiedad: residenceId,
                  cantidad_habitaciones,
                  habitaciones_registradas: rooms.length,
                  habitaciones_registradas_array: rooms.map(
                    (r) => r.numero_habitacion
                  ),
                  precio_total_residencia: precio_mensual,
                  sumaPreciosActuales: rooms.reduce((sum, r) => {
                    const precio = Number(r?.precio_mensual) || 0;
                    return Number(sum) + precio;
                  }, 0),
                  tipo_bano,
                  comodidades_residencia,
                  convivencia_residencia,
                  capacidad_total,
                  capacidad_actual: rooms.reduce((sum, r) => {
                    return Number(sum) + (Number(r?.capacidad) || 0);
                  }, 0),
                });
              }}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.addDeptText}>Agregar otro cuarto</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ResidenceRoomViewScreen;
