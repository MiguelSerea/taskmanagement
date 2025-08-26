import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'

function Botao({ botao, theme, isLoading }) {
  const getButtonStyle = (variant, disabled) => {
    const baseStyle = [styles.button]
    
    if (disabled) {
      baseStyle.push(styles.buttonDisabled)
    }
    
    switch (variant) {
      case 'link':
        return [styles.linkButton]
      case 'secondary':
        return [styles.secondaryButton, { borderColor: theme.borderColor }]
      case 'dev':
        return [styles.devButton]
      default:
        return baseStyle
    }
  }

  const getTextStyle = (variant) => {
    switch (variant) {
      case 'link':
        return styles.linkText
      case 'secondary':
        return [styles.secondaryText, { color: theme.textPrimary }]
      case 'dev':
        return styles.devText
      default:
        return styles.buttonText
    }
  }

  return (
    <View style={styles.container}>
      {botao.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={getButtonStyle(item.variant, item.disabled)}
          onPress={item.onPress}
          disabled={item.disabled || isLoading}
        >
          {item.disabled && isLoading && item.title.includes('Entrando') ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.buttonText}>Entrando...</Text>
            </View>
          ) : (
            <Text style={getTextStyle(item.variant)}>
              {item.title}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  linkButton: {
    backgroundColor: 'transparent',
    height: 'auto',
    paddingVertical: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  devButton: {
    backgroundColor: '#10b981',
    height: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  devText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
})

export default Botao