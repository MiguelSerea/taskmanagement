"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useColorScheme } from "react-native"

// Define theme colors
const lightTheme = {
  background: "#F9FAFB",
  bgPrimary: "#F9FAFB",
  bgCard: "#FFFFFF",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  accent: "#3B82F6",
  borderColor: "#E5E7EB",
  inputBg: "#F9FAFB",
  shadow: "#000000",
}

const darkTheme = {
  background: "#111827",
  bgPrimary: "#111827",
  bgCard: "#1F2937",
  textPrimary: "#F9FAFB",
  textSecondary: "#D1D5DB",
  accent: "#60A5FA",
  borderColor: "#374151",
  inputBg: "#2D3748",
  shadow: "#000000",
}

// Create the context with a default value
const ThemeContext = createContext({
  isDarkMode: false,
  theme: lightTheme,
  toggleTheme: () => {},
  setTheme: () => {},
})

// Create the provider component
export const ThemeProvider = ({ children }) => {
  // Get the device color scheme
  const colorScheme = useColorScheme()

  // Initialize theme state based on device preference
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark")

  // Update theme when device preference changes
  useEffect(() => {
    setIsDarkMode(colorScheme === "dark")
  }, [colorScheme])

  // Get the current theme colors
  const theme = isDarkMode ? darkTheme : lightTheme

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev)
  }

  // Set a specific theme
  const setTheme = (themeType) => {
    setIsDarkMode(themeType === "dark")
  }

  return <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>
}

// Create a custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
