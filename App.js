import RootNavigation from "./navigation/RootNavigator";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <AuthProvider>
          <RootNavigation />
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
