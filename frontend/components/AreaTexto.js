import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { User, Lock } from 'lucide-react-native'

function AreaTexto({ area, theme, isLoading }) {
  const getIcon = (title) => {
    if (title.toLowerCase().includes('senha')) {
      return <Lock size={18} color={theme.textSecondary} style={styles.inputIcon} />
    }
    return <User size={18} color={theme.textSecondary} style={styles.inputIcon} />
  }

  const getPlaceholder = (title) => {
    if (title.toLowerCase().includes('senha')) {
      return "Digite sua senha"
    }
    return "seu_usuario"
  }

  return (
    <View style={styles.container}>
      {area.map((item) => (
        <View key={item.id} style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>
            {item.title}
          </Text>
          <View
            style={[
              styles.inputContainer,
              {
                borderColor: theme.borderColor,
                backgroundColor: theme.inputBg,
              },
            ]}
          >
            {getIcon(item.title)}
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder={getPlaceholder(item.title)}
              placeholderTextColor={theme.textSecondary}
              value={item.value}
              onChangeText={item.onChangeText}
              secureTextEntry={item.title.toLowerCase().includes('senha')}
              autoCapitalize="none"
              editable={!isLoading}
              autoComplete={item.title.toLowerCase().includes('senha') ? 'password' : 'username'}
              maxLength={item.title.toLowerCase().includes('senha') ? undefined : 20}
            />
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
})

export default AreaTexto