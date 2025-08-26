import { StyleSheet } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ThemeProvider } from "./contexts/themeContexts"
import LoginScreen from "./screens/loginScreen.js"
import RegisterScreen from "./screens/registerScreen.js"
import ForgotPasswordScreen from "./screens/forgotPasswordScreen.js"
import HomeScreen from "./screens/HomeScreen.js"
import SettingsScreen from "./screens/SettingsScreen.js"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login" 
          screenOptions={{ 
            headerShown: false,
            animation: 'slide_from_right', // ✅ Animação suave entre telas
            animationDuration: 300
          }}
        >
          {/* ✅ Telas de Autenticação */}
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
              gestureEnabled: false // ✅ Impede voltar por gesto na tela de login
            }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{
              title: "Criar Conta"
            }}
          />
          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPasswordScreen}
            options={{
              title: "Recuperar Senha"
            }}
          />
          
          {/* ✅ Telas Principais da Aplicação */}
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              gestureEnabled: false, // ✅ Impede voltar para login por gesto
              title: "Lista de Tarefas"
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              title: "Configurações"
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})