import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapUpdater = ({ latitude, longitude }) => {
  const map = useMap();

  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], 17);
    }
  }, [latitude, longitude, map]);

  return null;
};

const MapComponent = ({
  latitude = -1.66355,
  longitude = -78.654646,
  onLocationSelect,
}) => {

  const [position, setPosition] = useState([latitude, longitude]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);

        if (onLocationSelect) {
          onLocationSelect({ latitude: lat, longitude: lng });
        }
      },
    });

    return <Marker position={position} icon={markerIcon} />;
  };

  return (
    <div style={{
      width: "100%",
      height: 300,
      borderRadius: 10,
      overflow: "hidden",
      margin: "10px 0"
    }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={17}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker />

        <MapUpdater latitude={latitude} longitude={longitude} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
