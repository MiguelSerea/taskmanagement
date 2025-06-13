import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { api } from "../services/api"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  const login = async (token, user) => {
    try {
      await AsyncStorage.setItem('authToken', token)
      await AsyncStorage.setItem('userData', JSON.stringify(user))
      setUserToken(token)
      setUserData(user)
    } catch (error) {
      console.error('Failed to save auth data', error)
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken')
      await AsyncStorage.removeItem('userData')
      setUserToken(null)
      setUserData(null)
    } catch (error) {
      console.error('Failed to remove auth data', error)
    }
  }

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken')
      const user = JSON.parse(await AsyncStorage.getItem('userData'))
      
      if (token) {
        // Verifica se o token ainda é válido
        try {
          const response = await api.get('/profile/')
          setUserToken(token)
          setUserData(user || response.data)
        } catch (error) {
          // Token inválido, faz logout
          await logout()
        }
      }
    } catch (error) {
      console.error('Failed to check auth token', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkToken()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        userToken,
        isLoading,
        userData,
        login,
        logout,
        setUserToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}