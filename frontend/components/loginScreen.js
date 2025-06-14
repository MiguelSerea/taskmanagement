"use client"
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native"
import { Mail, Lock } from "lucide-react-native"
import { useTheme } from "../contexts/themeContexts.js"
import ThemeToggle from "./ThemeToggle.js"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loginUser } from "../services/api" // Importe a função de login que criamos anteriormente

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { isDarkMode, theme } = useTheme()

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.")
      return
    }

    setIsLoading(true)

    try {
      // Chama a função de login da API
      const response = await loginUser({ 
        email: email.toLowerCase().trim(), 
        password 
      })
      
      // Armazena o token de autenticação
      await AsyncStorage.setItem('authToken', response.token)
      
      // Armazena os dados do usuário se necessário
      await AsyncStorage.setItem('userData', JSON.stringify(response.user))
      
      Alert.alert("Sucesso", "Login realizado com sucesso!")
      navigation.navigate("Home")
    } catch (error) {
      console.error("Erro no login:", error)
      let errorMessage = "Falha no login. Verifique suas credenciais."
      
      if (error.response) {
        // Se o backend retornou um erro específico
        errorMessage = error.response.data.error || errorMessage
      }
      
      Alert.alert("Erro", errorMessage)
    } finally {
      setIsLoading(false)
    }
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
          <Text style={[styles.title, { color: theme.textPrimary }]}>Login</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Entre com suas credenciais para acessar sua conta
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
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                importantForAutofill="yes"
                textContentType="emailAddress"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Senha</Text>
              <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                <Text style={[styles.forgotLink, { color: theme.linkColor || "#3b82f6" }]}>
                  Esqueceu a senha?
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: theme.borderColor,
                  backgroundColor: theme.inputBg,
                },
              ]}
            >
              <Lock size={18} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="Digite sua senha"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCorrect={false}
                importantForAutofill="yes"
                textContentType="password"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton, 
              { backgroundColor: theme.buttonPrimary || "#3b82f6" },
              isLoading && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.buttonText}>Entrando...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Não tem uma conta?{" "}
            <Text 
              style={[styles.registerLink, { color: theme.linkColor || "#3b82f6" }]} 
              onPress={() => navigation.navigate("Register")}
            >
              Registre-se
            </Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

// Mantenha os estilos como estão, apenas adicionei referências ao tema onde necessário
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
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
  },
  forgotLink: {
    fontSize: 14,
    fontWeight: "500",
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "500",
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
})

export default LoginScreen