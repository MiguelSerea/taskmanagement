"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useTheme } from "../contexts/themeContexts.js"
import AsyncStorage from '@react-native-async-storage/async-storage'
import Sidebar from "../components/Sidebar.js"
import Header from "../components/Header.js"
import { 
  User, 
  Moon, 
  Sun, 
  Trash2, 
  LogOut, 
  Shield, 
  Bell,
  Info,
  ChevronRight 
} from "lucide-react-native"

const SettingsScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData')
      if (data) {
        setUserData(JSON.parse(data))
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
    }
  }

  // ✅ Função para mostrar mensagens
  const showMessage = (text, type = "info") => {
    setMessage({ text, type })
    setTimeout(() => {
      setMessage({ text: "", type: "" })
    }, 3000)
  }

  // ✅ Limpar todas as tarefas
  const clearAllTasks = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir todas as tarefas? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('tasks')
              showMessage("Todas as tarefas foram excluídas!", "success")
            } catch (error) {
              showMessage("Erro ao excluir tarefas", "error")
            }
          }
        }
      ]
    )
  }

  // ✅ Logout
  const handleLogout = () => {
    Alert.alert(
      "Confirmar Logout",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['userToken', 'userData'])
              navigation.navigate('Login')
            } catch (error) {
              console.error('Erro ao fazer logout:', error)
            }
          }
        }
      ]
    )
  }

  const settingsOptions = [
    {
      id: 1,
      title: "Perfil do Usuário",
      subtitle: "Visualizar informações da conta",
      icon: User,
      onPress: () => showMessage("Funcionalidade em desenvolvimento", "info")
    },
    {
      id: 2,
      title: "Tema",
      subtitle: theme.name === 'dark' ? "Modo Escuro" : "Modo Claro",
      icon: theme.name === 'dark' ? Moon : Sun,
      onPress: toggleTheme
    },
    {
      id: 3,
      title: "Notificações",
      subtitle: "Configurar alertas e lembretes",
      icon: Bell,
      onPress: () => showMessage("Funcionalidade em desenvolvimento", "info")
    },
    {
      id: 4,
      title: "Privacidade",
      subtitle: "Configurações de segurança",
      icon: Shield,
      onPress: () => showMessage("Funcionalidade em desenvolvimento", "info")
    }
  ]

  const dangerOptions = [
    {
      id: 1,
      title: "Limpar Todas as Tarefas",
      subtitle: "Excluir permanentemente todas as tarefas",
      icon: Trash2,
      onPress: clearAllTasks,
      danger: true
    },
    {
      id: 2,
      title: "Sair da Conta",
      subtitle: "Fazer logout da aplicação",
      icon: LogOut,
      onPress: handleLogout,
      danger: true
    }
  ]

  const SettingItem = ({ item }) => {
    const IconComponent = item.icon
    return (
      <TouchableOpacity
        style={[
          styles.settingItem, 
          { 
            backgroundColor: theme.bgCard, 
            borderColor: theme.borderColor 
          }
        ]}
        onPress={item.onPress}
      >
        <View style={[
          styles.iconContainer, 
          { backgroundColor: item.danger ? '#fef2f2' : theme.primary + '20' }
        ]}>
          <IconComponent 
            size={20} 
            color={item.danger ? '#dc2626' : theme.primary || '#3b82f6'} 
          />
        </View>
        
        <View style={styles.settingContent}>
          <Text style={[
            styles.settingTitle, 
            { color: item.danger ? '#dc2626' : theme.textPrimary }
          ]}>
            {item.title}
          </Text>
          <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
            {item.subtitle}
          </Text>
        </View>
        
        <ChevronRight size={20} color={theme.textSecondary} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bgPrimary }]}>
      {/* ✅ Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
        userData={userData}
        theme={theme}
      />

      {/* ✅ Overlay para fechar sidebar */}
      {sidebarOpen && (
        <View 
          style={styles.overlay}
          onTouchStart={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ Conteúdo Principal */}
      <View style={[styles.mainContent, sidebarOpen && styles.mainContentShifted]}>
        {/* ✅ Header */}
        <Header 
          onMenuPress={() => setSidebarOpen(true)}
          userData={userData}
          theme={theme}
        />

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

        {/* ✅ Conteúdo */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* ✅ Informações do Usuário */}
          {userData && (
            <View style={[
              styles.userCard, 
              { backgroundColor: theme.bgCard, borderColor: theme.borderColor }
            ]}>
              <View style={[styles.userAvatar, { backgroundColor: theme.primary || '#3b82f6' }]}>
                <User size={24} color="white" />
              </View>
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.textPrimary }]}>
                  {userData.name || userData.username || 'Usuário'}
                </Text>
                <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                  {userData.email || 'usuario@exemplo.com'}
                </Text>
              </View>
            </View>
          )}

          {/* ✅ Configurações Gerais */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Configurações
            </Text>
            {settingsOptions.map(item => (
              <SettingItem key={item.id} item={item} />
            ))}
          </View>

          {/* ✅ Zona de Perigo */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#dc2626' }]}>
              Zona de Perigo
            </Text>
            {dangerOptions.map(item => (
              <SettingItem key={item.id} item={item} />
            ))}
          </View>

          {/* ✅ Informações da App */}
          <View style={[
            styles.appInfo, 
            { backgroundColor: theme.bgCard, borderColor: theme.borderColor }
          ]}>
            <Info size={16} color={theme.textSecondary} />
            <Text style={[styles.appInfoText, { color: theme.textSecondary }]}>
              Lista de Tarefas v1.0.0
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 5,
  },
  mainContent: {
    flex: 1,
    transition: 'margin-left 0.3s ease',
  },
  mainContentShifted: {
    marginLeft: 280,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  // Mensagens
  messageContainer: {
    margin: 20,
    marginBottom: 0,
    padding: 12,
    borderRadius: 8,
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
  // Card do usuário
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  // Seções
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  // Items de configuração
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  // Info da app
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 20,
    gap: 8,
  },
  appInfoText: {
    fontSize: 12,
  },
})

export default SettingsScreen