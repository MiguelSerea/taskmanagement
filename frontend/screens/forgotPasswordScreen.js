"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from "react-native"
import { Mail } from "lucide-react-native"
import { useTheme } from "../contexts/themeContexts.js"
import ThemeToggle from "./ThemeToggle.js"
<<<<<<< HEAD:frontend/screens/forgotPasswordScreen.js
import ApiService from "../services/api.js"
=======
import { requestPasswordReset } from "../services/api" // Importe a função da API
>>>>>>> 1def373015fbc27d0b5dd9d2abc2f76dd77f90f5:frontend/components/forgotPasswordScreen.js

const ForgotPasswordScreen = ({ navigation }) => {
  const { theme } = useTheme()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleResetPassword = async () => {
<<<<<<< HEAD:frontend/screens/forgotPasswordScreen.js
=======
    // Validação básica
>>>>>>> 1def373015fbc27d0b5dd9d2abc2f76dd77f90f5:frontend/components/forgotPasswordScreen.js
    if (!email) {
      setError("Por favor, informe seu email.")
      return
    }

<<<<<<< HEAD:frontend/screens/forgotPasswordScreen.js
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Por favor, informe um email válido.")
      return
    }

    setIsLoading(true)

    try {
      const response = await ApiService.forgotPassword(email)
      
      Alert.alert(
        "Email enviado",
        response.message || "Se este email estiver cadastrado, você receberá instruções para redefinir sua senha.",
        [{ 
          text: "OK", 
          onPress: () => navigation.navigate("Login") 
        }]
      )
      
    } catch (error) {
      Alert.alert(
        "Erro", 
        error.message || "Não foi possível enviar o email de recuperação. Tente novamente."
      )
=======
    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um email válido.")
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      // Chama a função da API para solicitar reset de senha
      await requestPasswordReset({ email: email.toLowerCase().trim() })
      
      Alert.alert(
        "Email enviado",
        "Se este email estiver cadastrado, você receberá instruções para redefinir sua senha.",
        [
          { 
            text: "OK", 
            onPress: () => {
              if (Platform.OS === 'web') {
                window.location.href = '/login'
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
      if (err.data) {
        if (err.data.email) errorMessage = err.data.email[0]
        else if (err.data.non_field_errors) errorMessage = err.data.non_field_errors[0]
      }
      
      setError(errorMessage)
>>>>>>> 1def373015fbc27d0b5dd9d2abc2f76dd77f90f5:frontend/components/forgotPasswordScreen.js
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
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      elevation: 5,
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
      backgroundColor: theme.inputBg,
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
    <View style={[styles.container, { backgroundColor: theme.bgPrimary }]}>
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
              <Mail size={18} color={theme.textSecondary} style={styles.inputIcon} />
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
<<<<<<< HEAD:frontend/screens/forgotPasswordScreen.js
                onChangeText={setEmail}
                editable={!isLoading}
=======
                onChangeText={(text) => {
                  setEmail(text)
                  if (error) setError(null) // Limpa o erro quando o usuário começa a digitar
                }}
>>>>>>> 1def373015fbc27d0b5dd9d2abc2f76dd77f90f5:frontend/components/forgotPasswordScreen.js
              />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton, 
              isLoading && styles.submitButtonDisabled,
              { backgroundColor: theme.buttonPrimary || "#3b82f6" }
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
              style={[styles.loginLink, { color: theme.linkColor || "#3b82f6" }]} 
              onPress={() => navigation.navigate("Login")}
            >
              Voltar ao login
            </Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

<<<<<<< HEAD:frontend/screens/forgotPasswordScreen.js
// Estilos permanecem os mesmos...
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
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
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
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    height: 52,
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  submitButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#3b82f6",
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
  },
  loginLink: {
    color: "#3b82f6",
    fontWeight: "500",
  },
})

=======
>>>>>>> 1def373015fbc27d0b5dd9d2abc2f76dd77f90f5:frontend/components/forgotPasswordScreen.js
export default ForgotPasswordScreen