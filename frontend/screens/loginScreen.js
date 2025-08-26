"use client"
import { useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { useTheme } from "../contexts/themeContexts.js"
import ThemeToggle from "./ThemeToggle.js"
import ApiService from "../services/api.js"
import AsyncStorage from '@react-native-async-storage/async-storage'
import Logo from "../components/Logo.js"
import AreaTexto from "../components/AreaTexto.js"
import Botao from "../components/Botao.js"

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" }) // success, error, info
  const { theme } = useTheme()

  // ✅ Função para mostrar mensagens
  const showMessage = (text, type = "info") => {
    setMessage({ text, type })
    // Auto-hide após 5 segundos
    setTimeout(() => {
      setMessage({ text: "", type: "" })
    }, 5000)
  }

  // ✅ Validação do formulário
  const validateForm = () => {
    if (!formData.username.trim() || !formData.password) {
      showMessage("Por favor, preencha todos os campos.", "error")
      return false
    }

    // Validar formato do nome de usuário
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    if (!usernameRegex.test(formData.username.trim())) {
      showMessage("Nome de usuário deve ter entre 3-20 caracteres (apenas letras, números e _).", "error")
      return false
    }

    return true
  }

  // ✅ Função para limpar formulário
  const clearForm = () => {
    setFormData({
      username: "",
      password: ""
    })
  }

  // ✅ Função para navegar para recuperação de senha
  const handleForgotPassword = () => {
    if (formData.username.trim()) {
      navigation.navigate("ForgotPassword", { username: formData.username.trim() })
    } else {
      navigation.navigate("ForgotPassword")
    }
  }

  // ✅ Função de submit do login
  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setMessage({ text: "", type: "" }) // Limpar mensagens anteriores

    try {
      console.log('📤 Tentando fazer login com:', formData.username)

      const response = await ApiService.login(
        formData.username.trim().toLowerCase(), 
        formData.password
      )
      
      console.log('✅ Login bem-sucedido:', response)
      
      // Salvar token no AsyncStorage
      if (response.token) {
        await AsyncStorage.setItem('userToken', response.token)
        await AsyncStorage.setItem('userData', JSON.stringify(response.user))
        console.log('💾 Token e dados salvos no AsyncStorage')
      }

      showMessage("Login realizado com sucesso!", "success")
      
      // Aguardar um pouco para mostrar a mensagem antes de navegar
      setTimeout(() => {
        clearForm()
        navigation.navigate("Home")
      }, 1500)
      
    } catch (error) {
      console.error('❌ Erro no login:', error)
      
      let errorMessage = "Falha no login. Verifique suas credenciais."
      
      if (error.message.includes('Usuário não encontrado')) {
        errorMessage = "Nome de usuário não encontrado. Verifique o nome ou registre-se."
      } else if (error.message.includes('Credenciais inválidas')) {
        errorMessage = "Senha incorreta. Tente novamente ou recupere sua senha."
      } else if (error.message.includes('Erro de conexão')) {
        errorMessage = "Problema de conexão. Verifique sua internet e tente novamente."
      }
      
      showMessage(errorMessage, "error")
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Configuração dos campos de texto
  const areaTextoConfig = [
    {
      id: 1,
      title: "Nome de Usuário",
      value: formData.username,
      onChangeText: (text) => setFormData(prev => ({ ...prev, username: text }))
    },
    {
      id: 2,
      title: "Senha",
      value: formData.password,
      onChangeText: (text) => setFormData(prev => ({ ...prev, password: text }))
    }
  ]

  // ✅ Configuração dos botões
  const botaoConfig = [
    {
      id: 1,
      title: isLoading ? "Entrando..." : "Entrar",
      onPress: handleSubmit,
      disabled: isLoading
    },
    {
      id: 2,
      title: "Esqueceu a senha?",
      onPress: handleForgotPassword,
      variant: "link"
    },
    {
      id: 3,
      title: "Registre-se",
      onPress: () => navigation.navigate("Register"),
      variant: "secondary"
    }
  ]

  return (
    <View style={[styles.container, { backgroundColor: theme.bgPrimary }]}>
      <View style={styles.themeToggleContainer}>
        <ThemeToggle />
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.bgCard,
            borderColor: theme.borderColor,
            boxShadow: `0px 10px 30px ${theme.shadow}`,
          },
        ]}
      >
        {/* ✅ Componente Logo */}
        <Logo />

        {/* ✅ Mensagem de feedback */}
        {message.text ? (
          <View style={[
            styles.messageContainer, 
            styles[`message${message.type.charAt(0).toUpperCase() + message.type.slice(1)}`]
          ]}>
            <Text style={[
              styles.messageText,
              styles[`messageText${message.type.charAt(0).toUpperCase() + message.type.slice(1)}`]
            ]}>
              {message.text}
            </Text>
          </View>
        ) : null}

        {/* ✅ Componente AreaTexto */}
        <AreaTexto 
          area={areaTextoConfig}
          theme={theme}
          isLoading={isLoading}
        />

        {/* ✅ Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Verificando credenciais...
            </Text>
          </View>
        )}

        {/* ✅ Componente Botao */}
        <Botao 
          botao={botaoConfig}
          theme={theme}
          isLoading={isLoading}
        />

        {/* ✅ Botão de desenvolvimento */}
        {__DEV__ && (
          <View style={styles.devContainer}>
            <Botao 
              botao={[{
                id: 99,
                title: "🚀 Preencher dados de teste",
                onPress: () => {
                  setFormData({
                    username: "usuario_teste",
                    password: "123456"
                  })
                  showMessage("Dados de teste preenchidos!", "info")
                },
                variant: "dev"
              }]}
              theme={theme}
            />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  themeToggleContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
  },
  // ✅ Estilos para mensagens
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  messageSuccess: {
    backgroundColor: "#dcfce7",
    borderColor: "#16a34a",
  },
  messageError: {
    backgroundColor: "#fef2f2",
    borderColor: "#dc2626",
  },
  messageInfo: {
    backgroundColor: "#dbeafe",
    borderColor: "#2563eb",
  },
  messageText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  messageTextSuccess: {
    color: "#15803d",
  },
  messageTextError: {
    color: "#dc2626",
  },
  messageTextInfo: {
    color: "#2563eb",
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
  },
  devContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
})

export default LoginScreen