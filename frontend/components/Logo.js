import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../contexts/themeContexts.js'

function Logo() {
  const { theme } = useTheme()
  
  return (
    <View style={styles.container}>
      <View style={[styles.logoBox, { 
        borderColor: theme.textPrimary,
        backgroundColor: theme.bgCard 
      }]}>
        <Text style={[styles.logoText, { color: theme.textPrimary }]}>BK</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          ESPAÇO BK
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 160,
    marginBottom: 20,
  },
  logoBox: {
    borderLeftWidth: 2,
    borderRightWidth: 2,
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 4,
    marginTop: 8,
  },
})

export default Logo