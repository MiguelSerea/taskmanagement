"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { Mail } from "lucide-react-native"
import { useTheme } from "../contexts/themeContexts.js"
import ThemeToggle from "./ThemeToggle.js"

const ForgotPasswordScreen = ({ navigation }) => {
  const { theme } = useTheme()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, informe seu email.")
      return
    }

    setIsLoading(true)

    // Simulando uma chamada de API
    setTimeout(() => {
      setIsLoading(false)
      Alert.alert(
        "Email enviado",
        "Se este email estiver cadastrado, você receberá instruções para redefinir sua senha.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }],
      )
    }, 1500)
  }

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
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Recuperar Senha</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Digite seu email para receber instruções de recuperação
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Email</Text>
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: theme.borderColor,
                  backgroundColor: theme.inputBg,
                },
              ]}
            >
              <Mail size={18} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="seu@email.com"
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
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
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Lembrou sua senha?{" "}
            <Text style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
              Voltar ao login
            </Text>
          </Text>
        </View>
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

export default ForgotPasswordScreen
