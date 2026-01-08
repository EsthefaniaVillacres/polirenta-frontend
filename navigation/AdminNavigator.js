import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Dashboard
import AdminDashboardScreen from "../screens/Admin/AdminDashboardScreen";

// Secciones del Admin
import AdminUsersList from "../screens/Admin/AdminUsersList";
import AdminEditUser from "../screens/Admin/AdminEditUser";

import AdminResidencesList from "../screens/Admin/AdminResidencesList";
import AdminEditResidence from "../screens/Admin/AdminEditResidence";

import AdminRoomsList from "../screens/Admin/AdminRoomsList";
import AdminEditRoom from "../screens/Admin/AdminEditRoom";

import AdminContractsList from "../screens/Admin/AdminContractsList";
import AdminViewContract from "../screens/Admin/AdminViewContract";

import AdminRentalRequests from "../screens/Admin/AdminRentalRequests";

import AdminDepartmentList from "../screens/Admin/AdminDepartmentList";
import AdminEditDepartment from "../screens/Admin/AdminEditDepartment";

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminUsersList"
        component={AdminUsersList}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminEditUser"
        component={AdminEditUser}
        options={{ headerShown: false }}
      />

      {/* RESIDENCIAS */}
      <Stack.Screen
        name="AdminResidencesList"
        component={AdminResidencesList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminEditResidence"
        component={AdminEditResidence}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminRoomsList"
        component={AdminRoomsList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminEditRoom"
        component={AdminEditRoom}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminContractsList"
        component={AdminContractsList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminViewContract"
        component={AdminViewContract}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminRentalRequests"
        component={AdminRentalRequests}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminDepartmentList"
        component={AdminDepartmentList}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminEditDepartment"
        component={AdminEditDepartment}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
