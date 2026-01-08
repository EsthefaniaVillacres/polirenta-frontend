import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapComponent = ({
  latitude = -1.66355,
  longitude = -78.654646,
  onLocationSelect
}) => {

  const [position, setPosition] = useState({
    latitude,
    longitude,
  });

  const handleSelect = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    setPosition({ latitude, longitude });

    if (onLocationSelect) {
      onLocationSelect({ latitude, longitude });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleSelect}
      >
        <Marker
          coordinate={position}
          draggable
          onDragEnd={handleSelect}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
});

export default MapComponent;
