"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from "react-native"
import { Mail, Lock, User } from "lucide-react-native"
import { useTheme } from "../contexts/themeContexts.js"
import ThemeToggle from "./ThemeToggle.js"
import ApiService from "../services/api.js"
import AsyncStorage from '@react-native-async-storage/async-storage'

// ✅ Função para calcular força da senha
const getPasswordStrength = (password) => {
  if (password.length === 0) return { strength: 0, text: '', color: '#6b7280' }
  if (password.length < 6) return { strength: 1, text: 'Muito fraca', color: '#ef4444' }
  
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  
  if (score < 2) return { strength: 2, text: 'Fraca', color: '#f97316' }
  if (score < 4) return { strength: 3, text: 'Média', color: '#eab308' }
  return { strength: 4, text: 'Forte', color: '#22c55e' }
}

// ✅ Função para mostrar mensagem compatível com Web e Mobile
const showMessage = (title, message, onOK = () => {}) => {
  if (Platform.OS === 'web') {
    // Para Web: usar window.alert ou console
    const result = window.confirm(`${title}\n\n${message}`)
    if (result) onOK()
  } else {
    // Para Mobile: usar Alert nativo
    Alert.alert(title, message, [{ text: "OK", onPress: onOK }])
  }
}

const showError = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`)
  } else {
    Alert.alert(title, message)
  }
}

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, text: '', color: '#6b7280' })
  const { theme } = useTheme()

  // ✅ Detectar plataforma para logs
  useEffect(() => {
    console.log(`📱 RegisterScreen carregado no ${Platform.OS}`)
  }, [])

  const validateForm = () => {
    // Verificar campos obrigatórios
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      showError("Erro", "Por favor, preencha todos os campos.")
      return false
    }

    // Validar nome (mínimo 2 caracteres)
    if (name.trim().length < 2) {
      showError("Erro", "Nome deve ter pelo menos 2 caracteres.")
      return false
    }

    // Validar email mais rigoroso
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email.trim())) {
      showError("Erro", "Por favor, informe um email válido.")
      return false
    }

    // Validar senha mais rigorosa
    if (password.length < 6) {
      showError("Erro", "A senha deve ter pelo menos 6 caracteres.")
      return false
    }

    // Verificar se a senha tem pelo menos uma letra e um número
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/
    if (!passwordRegex.test(password)) {
      showError("Senha Fraca", "A senha deve conter pelo menos uma letra e um número.")
      return false
    }

    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      showError("Erro", "As senhas não coincidem.")
      return false
    }

    return true
  }

  // ✅ Função para limpar formulário
  const clearForm = () => {
    setName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setPasswordStrength({ strength: 0, text: '', color: '#6b7280' })
  }

  const handleSubmit = async () => {
    console.log(`🚀 Iniciando registro no ${Platform.OS}`)
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Separar nome em primeiro e último nome
      const nameParts = name.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ')

      const userData = {
        username: email.split('@')[0],
        email: email.trim().toLowerCase(),
        password: password,
        first_name: firstName,
        last_name: lastName
      }

      console.log('📤 Enviando dados de registro:', { ...userData, password: '***' })

      const response = await ApiService.register(userData)
      
      console.log('✅ Registro bem-sucedido:', response)
      
      // ✅ Sucesso - usar função compatível
      showMessage(
        "Sucesso", 
        "Conta criada com sucesso! Agora faça login com suas credenciais.",
        () => {
          console.log('🧹 Limpando formulário e navegando...')
          clearForm()
          
          // ✅ Navegação compatível
          try {
            navigation.navigate("Login", { 
              registeredEmail: email.trim().toLowerCase()
            })
            console.log('✅ Navegação executada com sucesso')
          } catch (navError) {
            console.error('❌ Erro na navegação:', navError)
            // Fallback: navegação simples
            navigation.navigate("Login")
          }
        }
      )
      
    } catch (error) {
      console.error('❌ Erro no registro:', error)
      
      // ✅ Tratamento de erros específicos
      let errorMessage = "Falha no registro. Tente novamente."
      
      if (error.message.includes('email já está cadastrado')) {
        errorMessage = "Este email já está em uso. Tente fazer login ou use outro email."
      } else if (error.message.includes('username já existe')) {
        errorMessage = "Nome de usuário já existe. Tente outro email."
      } else if (error.message.includes('Erro de conexão')) {
        errorMessage = "Problema de conexão. Verifique sua internet e tente novamente."
      }
      
      showError("Erro", errorMessage)
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
          <Text style={[styles.title, { color: theme.textPrimary }]}>Cadastre-se</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Crie sua conta para começar {Platform.OS === 'web' ? '🌐' : '📱'}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Nome completo</Text>
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: theme.borderColor,
                  backgroundColor: theme.inputBg,
                },
              ]}
            >
              <User size={18} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="Seu nome completo"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
                editable={!isLoading}
                autoCapitalize="words"
                // ✅ Otimizações para Web
                autoComplete={Platform.OS === 'web' ? 'name' : 'off'}
              />
            </View>
          </View>

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
                editable={!isLoading}
                // ✅ Otimizações para Web
                autoComplete={Platform.OS === 'web' ? 'email' : 'off'}
                inputMode={Platform.OS === 'web' ? 'email' : 'default'}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Senha</Text>
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
                placeholder="Crie uma senha (mín. 6 caracteres)"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  setPasswordStrength(getPasswordStrength(text))
                }}
                secureTextEntry
                editable={!isLoading}
                // ✅ Otimizações para Web
                autoComplete={Platform.OS === 'web' ? 'new-password' : 'off'}
              />
            </View>
            
            {/* ✅ Indicador de força da senha */}
            {password.length > 0 && (
              <View style={styles.passwordStrengthContainer}>
                <View style={styles.passwordStrengthBar}>
                  <View 
                    style={[
                      styles.passwordStrengthFill, 
                      { 
                        width: `${(passwordStrength.strength / 4) * 100}%`,
                        backgroundColor: passwordStrength.color 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.passwordStrengthText, { color: passwordStrength.color }]}>
                  {passwordStrength.text}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Confirmar senha</Text>
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
                placeholder="Confirme sua senha"
                placeholderTextColor={theme.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!isLoading}
                // ✅ Otimizações para Web
                autoComplete={Platform.OS === 'web' ? 'new-password' : 'off'}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton, 
              isLoading && styles.submitButtonDisabled,
              // ✅ Estilo adicional para Web
              Platform.OS === 'web' && styles.submitButtonWeb
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
            // ✅ Acessibilidade
            accessibilityLabel="Registrar nova conta"
            accessibilityHint="Toque para criar sua conta"
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.buttonText}>Registrando...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Registrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Já tem uma conta?{" "}
            <Text 
              style={styles.loginLink} 
              onPress={() => navigation.navigate("Login")}
              // ✅ Acessibilidade
              accessibilityLabel="Ir para tela de login"
            >
              Entrar
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
    gap: 20,
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
    // ✅ Melhorias para Web
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
    }),
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
  // ✅ Estilo específico para Web
  submitButtonWeb: {
    cursor: 'pointer',
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
    // ✅ Cursor para Web
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  passwordStrengthContainer: {
    marginTop: 8,
  },
  passwordStrengthBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  passwordStrengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
    fontWeight: '500',
  },
})

export default RegisterScreen