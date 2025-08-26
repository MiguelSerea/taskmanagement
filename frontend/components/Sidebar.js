import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Home, CheckSquare, Settings, LogOut, X, User } from 'lucide-react-native'
import Logo from './Logo.js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Sidebar = ({ isOpen, onClose, navigation, userData, theme }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData'])
      navigation.navigate('Login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const menuItems = [
    {
      id: 1,
      title: 'Início',
      icon: Home,
      onPress: () => {
        navigation.navigate('Home')
        onClose()
      }
    },
    {
      id: 2,
      title: 'Tarefas',
      icon: CheckSquare,
      onPress: () => {
        navigation.navigate('Home')
        onClose()
      }
    },
    {
      id: 3,
      title: 'Configurações',
      icon: Settings,
      onPress: () => {
        // navigation.navigate('Settings')
        onClose()
      }
    }
  ]

  if (!isOpen) return null

  return (
    <View style={[styles.sidebar, { backgroundColor: theme.bgCard, borderColor: theme.borderColor }]}>
      {/* ✅ Header da Sidebar */}
      <View style={styles.sidebarHeader}>
        <Logo />
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* ✅ Informações do Usuário */}
      {userData && (
        <View style={[styles.userInfo, { borderColor: theme.borderColor }]}>
          <View style={[styles.userAvatar, { backgroundColor: theme.primary }]}>
            <User size={20} color="white" />
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: theme.textPrimary }]}>
              {userData.name || userData.username || 'Usuário'}
            </Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
              {userData.email || 'usuario@exemplo.com'}
            </Text>
          </View>
        </View>
      )}

      {/* ✅ Menu Items */}
      <View style={styles.menuItems}>
        {menuItems.map((item) => {
          const IconComponent = item.icon
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { borderColor: theme.borderColor }]}
              onPress={item.onPress}
            >
              <IconComponent size={20} color={theme.textSecondary} />
              <Text style={[styles.menuItemText, { color: theme.textPrimary }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* ✅ Logout */}
      <View style={styles.sidebarFooter}>
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: '#dc2626' }]}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    zIndex: 10,
    borderRightWidth: 1,
    paddingVertical: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
    borderBottomWidth: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
  },
  menuItems: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  sidebarFooter: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
})

export default Sidebar