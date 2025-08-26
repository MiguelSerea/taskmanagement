import { View, Text, Button, StyleSheet } from "react-native"
import { useAuth } from "../contexts/authContexts"
import { useTheme } from "../contexts/themeContexts"

export default function HomeScreen({ navigation }) {
  const { userData, logout } = useAuth()
  const { theme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.bgPrimary }]}>
      <Text style={{ color: theme.textPrimary }}>Bem-vindo, {userData?.first_name || 'Usuário'}!</Text>
      <Text style={{ color: theme.textSecondary }}>Email: {userData?.email}</Text>
      
      <Button 
        title="Sair" 
        onPress={logout}
        color={theme.buttonPrimary || "#3b82f6"}
      />
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
})