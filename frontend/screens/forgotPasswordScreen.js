"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from "react-native"
import { Mail } from "lucide-react-native"
import { useTheme } from "../contexts/themeContexts.js"
import ThemeToggle from "./ThemeToggle.js"
import ApiService from "../services/api.js"

const ForgotPasswordScreen = ({ navigation }) => {
  const { theme } = useTheme()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleResetPassword = async () => {
    // Validação básica
    if (!email) {
      setError("Por favor, informe seu email.")
      return
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um email válido.")
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      // Usar ApiService para solicitar reset de senha
      const response = await ApiService.forgotPassword(email.toLowerCase().trim())
      
      Alert.alert(
        "Email enviado",
        response.message || "Se este email estiver cadastrado, você receberá instruções para redefinir sua senha.",
        [
          { 
            text: "OK", 
            onPress: () => {
              if (Platform.OS === 'web') {
                // Para web, usar window.location se disponível
                if (typeof window !== 'undefined') {
                  window.location.href = '/login'
                }
              } else {
                navigation.navigate("Login")
              }
            }
          }
        ]
      )
    } catch (err) {
      console.error("Erro ao solicitar reset de senha:", err)
      
      let errorMessage = "Ocorreu um erro ao processar sua solicitação. Tente novamente."
      
      // Tratamento de diferentes tipos de erro
      if (err.message) {
        errorMessage = err.message
      } else if (err.data) {
        if (err.data.email) {
          errorMessage = err.data.email[0]
        } else if (err.data.non_field_errors) {
          errorMessage = err.data.non_field_errors[0]
        } else if (err.data.message) {
          errorMessage = err.data.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      width: Platform.OS === 'web' ? '100vw' : '100%',
      height: Platform.OS === 'web' ? '100vh' : '100%',
      backgroundColor: theme.bgPrimary,
    },
    themeToggleContainer: {
      position: "absolute",
      top: 40,
      right: 20,
      zIndex: 10,
    },
    card: {
      width: Platform.OS === 'web' ? 400 : '100%',
      maxWidth: 400,
      borderRadius: 20,
      padding: 30,
      borderWidth: 1,
      borderColor: theme.borderColor,
      backgroundColor: theme.bgCard,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.3,
      shadowRadius: 30,
      elevation: 5,
      ...(Platform.OS === 'web' && {
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      }),
    },
    header: {
      alignItems: "center",
      marginBottom: 30,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      marginBottom: 10,
      color: theme.textPrimary,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      lineHeight: 24,
      color: theme.textSecondary,
    },
    form: {
      gap: 24,
    },
    formGroup: {
      gap: 8,
    },
    label: {
      fontWeight: "600",
      fontSize: 14,
      color: theme.textPrimary,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 2,
      borderRadius: 12,
      height: 52,
      borderColor: error ? (theme.error || "#ef4444") : theme.borderColor,
      backgroundColor: theme.inputBg || theme.bgCard,
    },
    inputIcon: {
      marginLeft: 16,
    },
    input: {
      flex: 1,
      height: 52,
      paddingHorizontal: 16,
      fontSize: 16,
      color: theme.textPrimary,
      backgroundColor: 'transparent',
    },
    submitButton: {
      width: "100%",
      height: 52,
      backgroundColor: theme.buttonPrimary || "#3b82f6",
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },
    submitButtonDisabled: {
      opacity: 0.7,
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    footer: {
      alignItems: "center",
      marginTop: 32,
    },
    footerText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    loginLink: {
      color: theme.linkColor || "#3b82f6",
      fontWeight: "500",
    },
    errorText: {
      color: theme.error || "#ef4444",
      fontSize: 12,
      marginTop: 4,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.themeToggleContainer}>
        <ThemeToggle />
      </View>

      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.subtitle}>
            Digite seu email para receber instruções de recuperação
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Mail 
                size={18} 
                color={theme.textSecondary} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                importantForAutofill="yes"
                textContentType="emailAddress"
                value={email}
                onChangeText={(text) => {
                  setEmail(text)
                  if (error) setError(null) // Limpa o erro quando o usuário começa a digitar
                }}
                editable={!isLoading}
              />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton, 
              isLoading && styles.submitButtonDisabled
            ]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.buttonText}>Enviando...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Enviar Instruções</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Lembrou sua senha?{" "}
            <Text 
              style={styles.loginLink} 
              onPress={() => {
                if (Platform.OS === 'web') {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/login'
                  }
                } else {
                  navigation.navigate("Login")
                }
              }}
            >
              Voltar ao login
            </Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

export default ForgotPasswordScreen