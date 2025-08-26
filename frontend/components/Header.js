import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Menu, User } from 'lucide-react-native'
import ThemeToggle from "../screens/ThemeToggle.js"

const Header = ({ onMenuPress, userData, theme }) => {
  return (
    <View style={[styles.header, { backgroundColor: theme.bgCard, borderColor: theme.borderColor }]}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <Menu size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Lista de Tarefas
        </Text>
      </View>

      <View style={styles.rightSection}>
        {userData && (
          <View style={styles.userSection}>
            <View style={[styles.userAvatar, { backgroundColor: theme.primary }]}>
              <User size={16} color="white" />
            </View>
            <Text style={[styles.userName, { color: theme.textPrimary }]}>
              Olá, {userData.name || userData.username || 'Usuário'}!
            </Text>
          </View>
        )}
        <ThemeToggle />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
  },
})

export default Header