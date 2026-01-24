import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  LayoutAnimation,
  Alert,
} from "react-native";
import { Checkbox, Text } from "react-native-paper";
import Header from "../../components/Header";
import styles from "../../styles/EditResidenceScreenStyles";
import * as ImagePicker from "expo-image-picker";
import MapComponent from "../../components/MapComponent";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const AdminEditDepartment = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  const { departmentId } = route.params;

  const [tenantType, setTenantType] = useState({
    men: false,
    women: false,
    mixed: false,
  });

  const [paymentMethods, setPaymentMethods] = useState({
    cash: false,
    deposit: false,
    transfer: false,
  });

  const [amenities, setAmenities] = useState({
    electricShower: false,
    showerHeater: false,
    washer: false,
    dryer: false,
    internet: false,
    water: false,
    light: false,
  });

  const [coexistence, setCoexistence] = useState({
    petsAllowed: false,
    sharedBathroom: false,
    sharedShower: false,
    sharedKitchen: false,
    sharedLivingRoom: false,
    sharedDinigRoom: false,
  });

  // eslint-disable-next-line no-unused-vars
  const [image, setImage] = useState(null);

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [menCount, setMenCount] = useState(0);
  const [womenCount, setWomenCount] = useState(0);
  const [individualRoomsCount, setIndividualRoomsCount] = useState(0);
  const [individualBathroomsCount, setIndividualBathroomsCount] = useState(0);
  const [sharedBathroomsCount, setSharedBathroomsCount] = useState(0);
  const [livingRoomsCount, setLivingRoomsCount] = useState(0);
  const [parkingSpotsCount, setParkingSpotsCount] = useState(0);
  const [expandedRentalType, setExpandedRentalType] = useState(false);
  const [expandedRentalSector, setExpandedRentalSector] = useState(false);
  const [selectedRentalType, setSelectedRentalType] = useState(null);
  const [selectedRentalSector, setSelectedRentalSector] = useState(null);
  const [propertyTitle, setPropertyTitle] = useState("");
  const [propertyDescription, setPropertyDescription] = useState("");
  const [propertyPrice, setPropertyPrice] = useState("");

  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageUrls = images.map((foto) => foto.uri);

  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const screenWidth = Dimensions.get("window").width;
  const isWeb = Platform.OS === "web";
  const inputWidth = isWeb ? Math.min(screenWidth * 0.95, 600) : "100%";
  const fontSizeTitle = isWeb ? 40 : screenWidth * 0.12;

  const rentalType = ["Residencia", "Departamento"];
  const rentalSector = [
    "Barrio Chino",
    "Puerta Principal (Pedro Vicente Maldonado)",
    "Puerta Intermedia (Milton Reyes)",
    "Puerta de Medicina (Canónico Ramos)",
  ];

  // ✅ Confirmación compatible Web + Android + iOS (sin romper SSR)
  const confirmAction = async (message) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return window.confirm(message);
    }

    return new Promise((resolve) => {
      Alert.alert("Confirmación", message, [
        { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
        { text: "Aceptar", onPress: () => resolve(true) },
      ]);
    });
  };

  const handleDeleteImage = async (index) => {
    const imageToDelete = images[index];

    const confirmed = await confirmAction(
      "¿Estás seguro de que deseas eliminar esta imagen?"
    );

    if (!confirmed) return;

    setImages((prev) => prev.filter((_, i) => i !== index));

    if (!imageToDelete.isNew) {
      setImagesToDelete((prev) => [...prev, imageToDelete.name]);
    }
  };

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const response = await axios.get(
          `https://backend-arriendos-production.up.railway.app/api/auth/departments/${departmentId}`
        );

        const departmentData = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        setPropertyTitle(departmentData.titulo);
        setPropertyDescription(departmentData.descripcion);
        setPropertyPrice(departmentData.precio_mensual?.toString() || "");
        setAddress(departmentData.direccion || "");
        setLocation({
          latitude: departmentData.latitud,
          longitude: departmentData.longitud,
        });

        setSelectedRentalType(departmentData.tipo_arriendo);
        setSelectedRentalSector(departmentData.sector);

        setMenCount(departmentData.cantidad_hombres || 0);
        setWomenCount(departmentData.cantidad_mujeres || 0);
        setIndividualRoomsCount(departmentData.cantidad_habitaciones || 0);
        setIndividualBathroomsCount(
          departmentData.cantidad_banos_individuales || 0
        );
        setSharedBathroomsCount(departmentData.cantidad_banos_compartidos || 0);

        setLivingRoomsCount(departmentData.cantidad_salas || 0);
        setParkingSpotsCount(departmentData.cantidad_parqueaderos || 0);

        // Tipo de arrendatario
        if (departmentData.tipo_arrendatario === "Hombre") {
          setTenantType({ men: true, women: false, mixed: false });
        } else if (departmentData.tipo_arrendatario === "Mujer") {
          setTenantType({ men: false, women: true, mixed: false });
        } else {
          setTenantType({ men: false, women: false, mixed: true });
        }

        // Métodos de pago
        const pagos =
          departmentData.metodos_pago?.split(",").map((p) => p.trim()) || [];
        setPaymentMethods({
          cash: pagos.includes("Efectivo"),
          deposit: pagos.includes("Depósito"),
          transfer: pagos.includes("Transferencia"),
        });

        // Comodidades
        const comodidades =
          departmentData.comodidades?.split(",").map((c) => c.trim()) || [];

        setAmenities({
          electricShower: comodidades.includes("Decha eléctrica"),
          showerHeater: comodidades.includes("Ducha con calefón"),
          washer: comodidades.includes("Lavadora"),
          dryer: comodidades.includes("Secadora"),
          internet: comodidades.includes("Internet"),
          water: comodidades.includes("Agua"),
          light: comodidades.includes("Luz"),
        });

        // Convivencia
        const convivencia =
          departmentData.convivencia?.split(",").map((c) => c.trim()) || [];
        setCoexistence({
          petsAllowed: convivencia.includes("Mascotas permitidas"),
          sharedBathroom: convivencia.includes("Baño compartido"),
          sharedShower: convivencia.includes("Ducha compartida"),
          sharedKitchen: convivencia.includes("Cocina compartida"),
          sharedLivingRoom: convivencia.includes("Sala compartida"),
          sharedDinigRoom: convivencia.includes("Comedor compartido"),
        });

        if (departmentData.fotos) {
          let fotosArray = [];
          try {
            fotosArray = Array.isArray(departmentData.fotos)
              ? departmentData.fotos
              : JSON.parse(departmentData.fotos);
          } catch (e) {
            console.error("Error al parsear las fotos:", e);
          }

          if (fotosArray.length > 0) {
            const formattedImages = fotosArray.map((nombre) => ({
              uri: `https://backend-arriendos-production.up.railway.app/images/${nombre}`,
              name: nombre,
              isNew: false,
            }));
            setImages(formattedImages);
            setImage(formattedImages[0].uri);
          }
        }
      } catch (error) {
        console.error("Error al obtener los datos del departamento:", error);
        alert("No se pudo cargar la información del departamento.");
      }
    };

    fetchDepartmentData();
  }, [departmentId]);

  const validateInputs = () => {
    if (!propertyTitle || !propertyDescription || !address || !propertyPrice) {
      alert("Por favor complete todos los campos obligatorios");
      throw new Error("Campos obligatorios faltantes");
    }

    if (images.length === 0) {
      alert("Debe subir al menos una imagen de la propiedad.");
      throw new Error("Sin imágenes");
    }

    if (parseFloat(propertyPrice) <= 0) {
      alert("El precio debe ser mayor a 0.");
      throw new Error("Precio inválido");
    }

    if (!location || !location.latitude || !location.longitude) {
      alert("Debe seleccionar una ubicación válida.");
      throw new Error("Ubicación inválida");
    }

    if (!selectedRentalType || !selectedRentalSector) {
      alert("Debe seleccionar el tipo y sector de arriendo.");
      throw new Error("Tipo o sector faltante");
    }
  };

  const handleImages = () => {
    const existingImagesToKeep = images
      .filter((img) => !img.isNew && !imagesToDelete.includes(img.name))
      .map((img) => img.name);

    return existingImagesToKeep;
  };

  const getSelectedTenantType = () => {
    if (tenantType.men && tenantType.women) return "Mixto";
    if (tenantType.women) return "Mujer";
    if (tenantType.men) return "Hombre";
    return "Mixto";
  };

  const prepareFormData = async (existingImagesToKeep) => {
    const formData = new FormData();

    const paymentMethodsString = Object.entries(paymentMethods)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const map = {
          cash: "Efectivo",
          deposit: "Depósito",
          transfer: "Transferencia",
        };
        return map[key] ?? "";
      })
      .join(", ");

    const amenitiesString = Object.entries(amenities)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const map = {
          electricShower: "Decha eléctrica",
          showerHeater: "Ducha con calefón",
          washer: "Lavadora",
          dryer: "Secadora",
          internet: "Internet",
          water: "Agua",
          light: "Luz",
        };
        return map[key] ?? "";
      })
      .join(", ");

    const coexistenceString = Object.entries(coexistence)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const map = {
          petsAllowed: "Mascotas permitidas",
          sharedBathroom: "Baño compartido",
          sharedShower: "Ducha compartida",
          sharedKitchen: "Cocina compartida",
          sharedLivingRoom: "Sala compartida",
          sharedDinigRoom: "Comedor compartido",
        };
        return map[key] ?? "";
      })
      .join(", ");

    formData.append("titulo", propertyTitle);
    formData.append("descripcion", propertyDescription);
    formData.append("direccion", address);
    formData.append("latitud", location?.latitude ?? 0);
    formData.append("longitud", location?.longitude ?? 0);
    formData.append("precio_mensual", parseFloat(propertyPrice) ?? 0);
    formData.append("tipo_arriendo", selectedRentalType ?? "Residencia");
    formData.append("sector", selectedRentalSector ?? "Barrio Chino");
    formData.append("tipo_arrendatario", getSelectedTenantType());
    formData.append("cantidad_hombres", menCount);
    formData.append("cantidad_mujeres", womenCount);
    formData.append("cantidad_habitaciones", individualRoomsCount);
    formData.append(
      "cantidad_banos_individuales",
      individualBathroomsCount ?? 0
    );
    formData.append("cantidad_banos_compartidos", sharedBathroomsCount ?? 0);
    formData.append("cantidad_salas", livingRoomsCount);
    formData.append("cantidad_parqueaderos", parkingSpotsCount);
    formData.append("metodos_pago", paymentMethodsString);
    formData.append("comodidades", amenitiesString);
    formData.append("convivencia", coexistenceString);
    formData.append("existingImages", JSON.stringify(existingImagesToKeep));

    for (const img of images) {
      if (img.isNew) {
        const type = img.uri.endsWith(".png") ? "image/png" : "image/jpeg";
        formData.append("fotos", {
          uri: img.uri,
          name: img.name,
          type,
        });
      }
    }

    if (imagesToDelete.length > 0) {
      formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
    }

    return formData;
  };

  const sendUpdateRequest = async (formData) => {
    const response = await fetch(
      `https://backend-arriendos-production.up.railway.app/api/auth/departments/${departmentId}`,
      {
        method: "PUT",
        headers: { Accept: "application/json" },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Error en el servidor: ${errorResponse.message}`);
    }

    alert("Departamento actualizado con éxito!");
    navigation.navigate("AdminDepartmentList");
  };

  const handleEditProperty = async () => {
    try {
      validateInputs();
      const existingImagesToKeep = handleImages();
      const formData = await prepareFormData(existingImagesToKeep);
      await sendUpdateRequest(formData);
    } catch (error) {
      console.error("Error al editar la propiedad:", error.message);
      alert("No se pudo actualizar la propiedad.");
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Se requiere permiso para acceder a la ubicación.");
      return;
    }
    let currentLocation = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = currentLocation.coords;
    setLocation({ latitude, longitude });
    reverseGeocode(latitude, longitude);
  };

  const handleAddressChange = (text) => {
    setAddress(text);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      fetchLocationSuggestions(text);
    }, 500);

    setDebounceTimeout(timeout);
  };

  const fetchLocationSuggestions = async (text) => {
    if (typeof text !== "string" || text.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const url = `https://backend-arriendos-production.up.railway.app/geocode?q=${encodeURIComponent(
      text + ", Riobamba, Ecuador"
    )}`;

    try {
      const response = await axios.get(url);

      const minLat = -1.8;
      const maxLat = -1.5;
      const minLon = -78.8;
      const maxLon = -78.5;

      const filtered = response.data.filter((item) => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
      });

      setSuggestions(filtered);
    } catch (error) {
      console.error("Error al buscar la dirección:", error);
    }
  };

  const toggleTenantType = (key) => {
    setTenantType({ men: false, women: false, mixed: false, [key]: true });

    if (key === "men") setWomenCount(0);
    else if (key === "women") setMenCount(0);
  };

  const togglePaymentMethod = (key) => {
    setPaymentMethods({
      cash: false,
      deposit: false,
      transfer: false,
      [key]: true,
    });
  };

  const toggleAmenity = (key) => {
    setAmenities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCoexistence = (key) => {
    setCoexistence((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const Counter = ({ label, subtitle, value, onIncrement, onDecrement }) => (
    <View style={styles.counterContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.counterControls}>
        <TouchableOpacity onPress={onIncrement} style={styles.counterButton}>
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.counterValue}>{value}</Text>
        <TouchableOpacity onPress={onDecrement} style={styles.counterButton}>
          <Text style={styles.counterButtonText}>−</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Se requiere permiso para acceder a la galería");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 5 - images.length,
        quality: 0.5,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.uri.split("/").pop(),
          isNew: true,
        }));

        const combinedImages = [...images, ...newImages];

        if (combinedImages.length > 5) {
          alert("Solo puedes elegir hasta 5 imágenes en total.");
          return;
        }

        setImages(combinedImages);
        setImage(combinedImages[0]?.uri);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      alert("Error al seleccionar imagen. Inténtalo de nuevo.");
    }
  };

  const handlePriceChange = (text) => {
    const numericText = text.replace(/[^0-9.]/g, "");
    setPropertyPrice(numericText);
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
      );
      const addressName = response.data.display_name;
      if (!addressName.includes("Riobamba")) {
        alert("Esta ubicación no está en Riobamba");
        return;
      }
      setAddress(addressName);
    } catch (error) {
      console.error("Error al obtener dirección:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <View style={isWeb ? styles.webContainer : styles.flex}>
        <ScrollView
          style={isWeb ? styles.webScrollView : styles.flex}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.container}>
            <Header isLoggedIn={true} />

            <View style={[styles.form, { width: inputWidth }]}>
              <Text
                style={[
                  styles.title,
                  { fontSize: fontSizeTitle, textAlign: "center" },
                ]}
              >
                Editar Departamento
              </Text>

              <View style={styles.carouselContainer}>
                {(() => {
                  if (imageUrls.length === 0) {
                    return (
                      <Text style={styles.imagePlaceholder}>Sin imágenes</Text>
                    );
                  }

                  const imageElement = (
                    <Image
                      source={{ uri: imageUrls[currentImageIndex] }}
                      style={styles.carouselImage}
                      resizeMode="cover"
                      onError={(e) =>
                        console.error(
                          "Error cargando imagen:",
                          e.nativeEvent.error
                        )
                      }
                      {...(isWeb
                        ? { onClick: () => setIsImageModalVisible(true) }
                        : {})}
                    />
                  );

                  return (
                    <>
                      {isWeb ? (
                        imageElement
                      ) : (
                        <TouchableOpacity
                          onPress={() => setIsImageModalVisible(true)}
                        >
                          {imageElement}
                        </TouchableOpacity>
                      )}

                      {imageUrls.length > 1 && (
                        <View style={styles.arrowContainer}>
                          <TouchableOpacity
                            onPress={() =>
                              setCurrentImageIndex(
                                currentImageIndex === 0
                                  ? imageUrls.length - 1
                                  : currentImageIndex - 1
                              )
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
                              setCurrentImageIndex(
                                currentImageIndex === imageUrls.length - 1
                                  ? 0
                                  : currentImageIndex + 1
                              )
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
                  );
                })()}
              </View>

              <TouchableOpacity
                onPress={pickImage}
                style={styles.addImageButton}
              >
                <Text style={styles.addImageText}>+ Agregar más imágenes</Text>
              </TouchableOpacity>

              {images.length >= 5 && (
                <Text style={styles.warningText}>
                  Has alcanzado el máximo de 5 imágenes.
                </Text>
              )}

              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                placeholder="Escriba una pequeña descripción"
                value={propertyTitle}
                onChangeText={setPropertyTitle}
              />

              <Text style={styles.label}>Precio</Text>
              <TextInput
                style={styles.input}
                placeholder="$"
                keyboardType="numeric"
                value={propertyPrice}
                onChangeText={handlePriceChange}
              />

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={styles.input}
                placeholder="Escriba una descripción detallada"
                value={propertyDescription}
                onChangeText={setPropertyDescription}
                multiline
              />

              <TouchableOpacity
                onPress={handleEditProperty}
                style={[styles.button, styles.register]}
              >
                <Text style={styles.buttonText}>Guardar Cambios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {isImageModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => setIsImageModalVisible(false)}
              style={styles.closeModalButton}
            >
              <Text style={styles.closeModalText}> X </Text>
            </TouchableOpacity>

            <ScrollView horizontal>
              {images.map((img, index) => (
                <View key={index} style={styles.imageItem}>
                  <Image source={{ uri: img.uri }} style={styles.thumbnail} />

                  <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={() => handleDeleteImage(index)}
                  >
                    <Ionicons name="trash" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <Text style={styles.imageCount}>{images.length}/5 imágenes</Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default AdminEditDepartment;
