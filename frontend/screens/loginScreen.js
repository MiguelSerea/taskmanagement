"use client"
import { useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { useTheme } from "../contexts/themeContexts.js"
import { useAuth } from "../contexts/authContexts.js" // ✅ Adicionar import do AuthContext
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
  const { login } = useAuth() // ✅ Usar contexto de autenticação

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

  // ✅ Função de submit do login - CORRIGIDA
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
      
      // ✅ Usar o contexto para fazer login (isso vai automaticamente navegar)
      if (response.token) {
        await login(response.token, response.user) // ✅ Contexto cuida da navegação
        showMessage("Login realizado com sucesso!", "success")
        clearForm()
        
        console.log('🔄 Navegação será feita automaticamente pelo AuthContext')
        // ✅ Não precisa mais do navigation.navigate("Home") 
        // O RootNavigator vai automaticamente mostrar AppStack quando userToken for definido
      }
      
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
      onChangeText: (text) => setFormData(prev => ({ ...prev, username: text })),
      placeholder: "Digite seu nome de usuário",
      autoCapitalize: "none",
      autoComplete: "username",
      textContentType: "username"
    },
    {
      id: 2,
      title: "Senha",
      value: formData.password,
      onChangeText: (text) => setFormData(prev => ({ ...prev, password: text })),
      placeholder: "Digite sua senha",
      secureTextEntry: true,
      autoComplete: "password",
      textContentType: "password"
    }
  ]

  // ✅ Configuração dos botões
  const botaoConfig = [
    {
      id: 1,
      title: isLoading ? "Entrando..." : "Entrar",
      onPress: handleSubmit,
      disabled: isLoading,
      variant: "primary"
    },
    {
      id: 2,
      title: "Esqueceu a senha?",
      onPress: handleForgotPassword,
      variant: "link",
      disabled: isLoading
    },
    {
      id: 3,
      title: "Registre-se",
      onPress: () => navigation.navigate("Register"),
      variant: "secondary",
      disabled: isLoading
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
            shadowColor: theme.shadow,
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
            <ActivityIndicator size="small" color={theme.buttonPrimary || "#3b82f6"} />
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

        {/* ✅ Debug info (apenas em desenvolvimento) */}
        {__DEV__ && (
          <View style={styles.debugContainer}>
            <Text style={[styles.debugText, { color: theme.textSecondary }]}>
              Debug: {JSON.stringify({ 
                username: formData.username, 
                hasPassword: !!formData.password,
                isLoading 
              })}
            </Text>
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
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 5,
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
  debugContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
  },
  debugText: {
    fontSize: 10,
    fontFamily: "monospace",
  },
})

export default LoginScreen