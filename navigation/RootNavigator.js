import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import LandlordNavigator from "./LandlordNavigator";
import TenantNavigator from "./TenantNavigator";
import AdminNavigator from "./AdminNavigator"; 
import { navigationRef } from "./RootNavigation";

export default function RootNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer ref={navigationRef}>
      {!user ? (
        <AuthNavigator />
      ) : user.role === "admin" ? (         
        <AdminNavigator />                  
      ) : user.role === "landlord" ? (
        <LandlordNavigator />
      ) : (
        <TenantNavigator />
      )}
    </NavigationContainer>
  );
}
