import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RegisterPropertyScreen from "../screens/Landlord/RegisterPropertyScreen";

import LandlordViewScreen from "../screens/Landlord/LandlordViewScreen";
import RentalRequestsScreen from "../screens/Landlord/RentalRequestsScreen";
import ResidenceViewScreen from "../screens/Landlord/ResidenceViewScreen";
import ResidenceRoomViewScreen from "../screens/Landlord/ResidenceRoomViewScreen";
import ContractScreen from "../screens/Landlord/ContractScreen";
import EditResidenceScreen from "../screens/Landlord/EditResidenceScreen";
import RegisterRoomScreen from "../screens/Landlord/RegisterRoomScreen";
import EditDepartmentScreen from "../screens/Landlord/EditDepartmentScreen";
import EditRoomScreen from "../screens/Landlord/EditRoomScreen"; 
import ProfileScreen from "../screens/Common/ProfileScreen";
const Stack = createStackNavigator();

export default function LandlordNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RegisterProperty" component={RegisterPropertyScreen} />
    
      <Stack.Screen name="LandlordView" component={LandlordViewScreen} />
      <Stack.Screen name="RentalRequests" component={RentalRequestsScreen} />
      <Stack.Screen name="ResidenceView" component={ResidenceViewScreen} />
      <Stack.Screen name="ResidenceRoomView" component={ResidenceRoomViewScreen} />
      <Stack.Screen name="Contract" component={ContractScreen} />
      <Stack.Screen name="EditResidence" component={EditResidenceScreen} />
      <Stack.Screen name="RegisterRoom" component={RegisterRoomScreen} />
      <Stack.Screen name="EditDepartment" component={EditDepartmentScreen} />
      <Stack.Screen name="EditRoom" component={EditRoomScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
