<<<<<<< HEAD
import { StyleSheet } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ThemeProvider } from "./contexts/themeContexts"
import LoginScreen from "./screens/loginScreen.js"
import RegisterScreen from "./screens/registerScreen.js"
import ForgotPasswordScreen from "./screens/forgotPasswordScreen.js"
import HomeScreen from "./screens/HomeScreen.js"
import SettingsScreen from "./screens/SettingsScreen.js"
=======
import React, { useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ThemeProvider } from "./contexts/themeContexts"
import { AuthProvider, useAuth } from "./contexts/authContexts"
import AsyncStorage from '@react-native-async-storage/async-storage'

// Screens
import LoginScreen from "./components/loginScreen.js"
import RegisterScreen from "./components/registerScreen.js"
import ForgotPasswordScreen from "./components/forgotPasswordScreen.js"
import HomeScreen from "./components/homeScreen.js"

const Stack = createNativeStackNavigator()

function AuthChecker({ children }) {
  const { isLoading, userToken, setUserToken } = useAuth()

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken')
        setUserToken(token)
      } catch (error) {
        console.error('Failed to check auth token', error)
      }
    }

    checkToken()
  }, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return children
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  )
}
>>>>>>> 1def373015fbc27d0b5dd9d2abc2f76dd77f90f5

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  )
}

function RootNavigator() {
  const { userToken } = useAuth()
  return userToken ? <AppStack /> : <AuthStack />
}

export default function App() {
  return (
    <ThemeProvider>
<<<<<<< HEAD
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
=======
      <AuthProvider>
        <NavigationContainer>
          <AuthChecker>
            <RootNavigator />
          </AuthChecker>
        </NavigationContainer>
      </AuthProvider>
>>>>>>> 1def373015fbc27d0b5dd9d2abc2f76dd77f90f5
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