import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Common/LoginScreen";
import RegisterScreen from "../screens/Common/RegisterScreen";
import ForgotPasswordScreen from "../screens/Common/ForgotPasswordScreen";
import HomeScreen from "../screens/Common/HomeScreen";
const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

    </Stack.Navigator>
  );
}
