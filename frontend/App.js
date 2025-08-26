import React, { useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ThemeProvider } from "./contexts/themeContexts"
import { AuthProvider, useAuth } from "./contexts/authContexts"
import AsyncStorage from '@react-native-async-storage/async-storage'

// Screens
import LoginScreen from "./screens/loginScreen.js"        // ✅ Mudar para screens
import RegisterScreen from "./screens/registerScreen.js"  // ✅ Mudar para screens
import ForgotPasswordScreen from "./screens/forgotPasswordScreen.js" // ✅ Mudar para screens
import HomeScreen from "./screens/HomeScreen.js"          // ✅ Mudar para screens

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  return children
}

function AuthStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          gestureEnabled: false // Impede voltar por gesto na tela de login
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          title: "Criar Conta",
          gestureEnabled: true
        }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{
          title: "Recuperar Senha",
          gestureEnabled: true
        }}
      />
    </Stack.Navigator>
  )
}

function AppStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          gestureEnabled: false, // Impede voltar para login por gesto
          title: "Lista de Tarefas"
        }}
      />
      {/* ✅ Adicione outras telas principais aqui conforme necessário */}
    </Stack.Navigator>
  )
}

function RootNavigator() {
  const { userToken } = useAuth()
  
  // ✅ Renderiza stack baseado no estado de autenticação
  return userToken ? <AppStack /> : <AuthStack />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <AuthChecker>
            <RootNavigator />
          </AuthChecker>
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  }
})