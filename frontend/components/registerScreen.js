"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from "react-native"
import { Mail, Lock, User, Eye, EyeOff, Check, X } from "lucide-react-native"
import { useTheme } from "../contexts/themeContexts.js"
import ThemeToggle from "./ThemeToggle.js"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { registerUser } from "../services/api"

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const { theme } = useTheme()

  useEffect(() => {
    if (formData.password) {
      let strength = 0
      if (formData.password.length >= 8) strength += 1
      if (/\d/.test(formData.password)) strength += 1
      if (/[A-Z]/.test(formData.password)) strength += 1
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1
      setPasswordStrength(strength)
    } else {
      setPasswordStrength(0)
    }
  }, [formData.password])

  const validateField = (name, value) => {
    let error = ""
    
    switch (name) {
      case "name":
        if (!value.trim()) error = "Nome completo é obrigatório"
        else if (value.trim().split(" ").length < 2) error = "Digite seu nome completo"
        break
      case "email":
        if (!value.trim()) error = "Email é obrigatório"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Email inválido"
        break
      case "password":
        if (!value) error = "Senha é obrigatória"
        else if (value.length < 8) error = "Mínimo 8 caracteres"
        break
      case "confirmPassword":
        if (!value) error = "Confirme sua senha"
        else if (value !== formData.password) error = "Senhas não coincidem"
        break
      default:
        break
    }
    
    setErrors(prev => ({ ...prev, [name]: error }))
    return !error
  }

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      validateField(name, value)
    }
  }

  const handleBlur = (name) => {
    validateField(name, formData[name])
  }

  const handleSubmit = async () => {
    const isNameValid = validateField("name", formData.name)
    const isEmailValid = validateField("email", formData.email)
    const isPasswordValid = validateField("password", formData.password)
    const isConfirmValid = validateField("confirmPassword", formData.confirmPassword)

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
      return
    }

    if (passwordStrength < 3) {
      Alert.alert(
        "Senha fraca", 
        "Sua senha deve atender a pelo menos 3 dos 4 critérios:\n" +
        "• 8 caracteres ou mais\n• 1 número\n• 1 letra maiúscula\n• 1 caractere especial",
        [{ text: "Entendi" }]
      )
      return
    }

    setIsLoading(true)

    try {
      const nameParts = formData.name.trim().split(" ")
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(" ") || " "

      const response = await registerUser({
        username: formData.email.split('@')[0],
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        password2: formData.confirmPassword,
        first_name: firstName,
        last_name: lastName,
      })

      await AsyncStorage.setItem('authToken', response.token)
      await AsyncStorage.setItem('userData', JSON.stringify(response.user))
      
      Alert.alert("Sucesso", "Conta criada com sucesso!", [
        { 
          text: "OK", 
          onPress: () => {
            if (Platform.OS === 'web') {
              window.location.href = '/home'
            } else {
              navigation.navigate("Home")
            }
          }
        }
      ])
    } catch (error) {
      console.error("Erro no registro:", error)
      
      let errorMessage = "Falha no registro. Tente novamente."
      if (error.response?.data) {
        const data = error.response.data
        if (data.email) errorMessage = data.email[0]
        else if (data.password) errorMessage = data.password[0]
        else if (data.username) errorMessage = data.username[0]
        else if (data.non_field_errors) errorMessage = data.non_field_errors[0]
      }
      
      Alert.alert("Erro", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const PasswordRequirement = ({ met, text }) => (
    <View style={styles.requirementItem}>
      {met ? (
        <Check size={14} color={theme.success || "#10b981"} />
      ) : (
        <X size={14} color={theme.error || "#ef4444"} />
      )}
      <Text style={[styles.requirementText, { color: theme.textSecondary }]}>{text}</Text>
    </View>
  )

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      width: '100%',
      height: '100%',
    },
    card: {
      width: Platform.OS === 'web' ? 450 : '90%',
      maxWidth: 450,
      borderRadius: 20,
      padding: 30,
      borderWidth: 1,
      borderColor: theme.borderColor,
      backgroundColor: theme.bgCard,
      ...Platform.select({
        ios: {
          shadowColor: theme.shadow || '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        android: {
          elevation: 5,
        },
        web: {
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }
      })
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
      gap: 20,
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
      borderColor: errors.name ? theme.error : theme.borderColor,
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
    passwordToggle: {
      padding: 10,
      marginRight: 10,
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
    passwordStrength: {
      flexDirection: "row",
      gap: 4,
      marginTop: 8,
    },
    strengthBar: {
      height: 4,
      borderRadius: 2,
      flex: 1,
    },
    requirementsContainer: {
      marginTop: 8,
      gap: 6,
    },
    requirementItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    requirementText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    themeToggleContainer: {
      position: 'absolute',
      top: 20,
      right: 20,
      zIndex: 1,
    }
  })

  return (
    <View style={[styles.container, { backgroundColor: theme.bgPrimary }]}>
      <View style={styles.themeToggleContainer}>
        <ThemeToggle />
      </View>

      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Cadastre-se</Text>
          <Text style={styles.subtitle}>Crie sua conta para começar</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome completo</Text>
            <View style={[
              styles.inputContainer,
              { borderColor: errors.name ? (theme.error || "#ef4444") : theme.borderColor }
            ]}>
              <User size={18} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Seu nome completo"
                placeholderTextColor={theme.textSecondary}
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
                onBlur={() => handleBlur("name")}
                autoCapitalize="words"
                importantForAutofill="yes"
                textContentType="name"
                editable={!isLoading}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[
              styles.inputContainer,
              { borderColor: errors.email ? (theme.error || "#ef4444") : theme.borderColor }
            ]}>
              <Mail size={18} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={theme.textSecondary}
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                onBlur={() => handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                importantForAutofill="yes"
                textContentType="emailAddress"
                editable={!isLoading}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={[
              styles.inputContainer,
              { borderColor: errors.password ? (theme.error || "#ef4444") : theme.borderColor }
            ]}>
              <Lock size={18} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Crie uma senha segura"
                placeholderTextColor={theme.textSecondary}
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                onBlur={() => handleBlur("password")}
                secureTextEntry={!showPassword}
                autoComplete="password-new"
                importantForAutofill="yes"
                textContentType="newPassword"
                editable={!isLoading}
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff size={18} color={theme.textSecondary} />
                ) : (
                  <Eye size={18} color={theme.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.passwordStrength}>
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.strengthBar,
                    { 
                      backgroundColor: passwordStrength >= i 
                        ? passwordStrength >= 3 
                          ? theme.success || "#10b981" 
                          : passwordStrength >= 2 
                            ? theme.warning || "#f59e0b"
                            : theme.error || "#ef4444"
                        : theme.inputBg 
                    }
                  ]}
                />
              ))}
            </View>
            
            <View style={styles.requirementsContainer}>
              <PasswordRequirement 
                met={formData.password.length >= 8} 
                text="Mínimo 8 caracteres" 
              />
              <PasswordRequirement 
                met={/\d/.test(formData.password)} 
                text="Pelo menos 1 número" 
              />
              <PasswordRequirement 
                met={/[A-Z]/.test(formData.password)} 
                text="Pelo menos 1 letra maiúscula" 
              />
              <PasswordRequirement 
                met={/[^A-Za-z0-9]/.test(formData.password)} 
                text="Pelo menos 1 caractere especial" 
              />
            </View>
            
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirmar senha</Text>
            <View style={[
              styles.inputContainer,
              { borderColor: errors.confirmPassword ? (theme.error || "#ef4444") : theme.borderColor }
            ]}>
              <Lock size={18} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirme sua senha"
                placeholderTextColor={theme.textSecondary}
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
                onBlur={() => handleBlur("confirmPassword")}
                secureTextEntry={!showConfirmPassword}
                autoComplete="password-new"
                importantForAutofill="yes"
                textContentType="newPassword"
                editable={!isLoading}
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} color={theme.textSecondary} />
                ) : (
                  <Eye size={18} color={theme.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton, 
              isLoading && styles.submitButtonDisabled,
              { backgroundColor: theme.buttonPrimary || "#3b82f6" }
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
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
          <Text style={styles.footerText}>
            Já tem uma conta?{" "}
            <Text 
              style={[styles.loginLink, { color: theme.linkColor || "#3b82f6" }]} 
              onPress={() => navigation.navigate("Login")}
            >
              Entrar
            </Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

export default RegisterScreen