import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from "../contexts/themeContexts.js"

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: theme.bgCard, borderColor: theme.borderColor }
      ]} 
      onPress={toggleTheme}
    >
      {isDarkMode ? (
        <Moon size={20} color={theme.textPrimary} />
      ) : (
        <Sun size={20} color={theme.textPrimary} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});