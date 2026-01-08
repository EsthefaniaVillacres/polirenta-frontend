import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TenantViewScreen from "../screens/Tenant/TenantViewScreen";
import TenantRoomViewScreen from "../screens/Tenant/TenantRoomViewScreen";
import RentalViewScreen from "../screens/Tenant/RentalViewScreen";
import AcceptRentalScreen from "../screens/Tenant/AcceptRentalScreen";
import ContactScreen from "../screens/Tenant/ContactScreen";
import ProfileScreen from "../screens/Common/ProfileScreen";
import ResidenceRoomsMapScreen from "../screens/Tenant/ResidenceRoomsMapScreen";

const Stack = createStackNavigator();

export default function TenantNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tenant" component={TenantViewScreen} />
      <Stack.Screen name="TenantRoomView" component={TenantRoomViewScreen} />
      <Stack.Screen name="RentalView" component={RentalViewScreen} />
      <Stack.Screen name="AcceptRental" component={AcceptRentalScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="ResidenceRoomsMap"
        component={ResidenceRoomsMapScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
