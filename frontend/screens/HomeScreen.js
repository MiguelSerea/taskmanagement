"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { useTheme } from "../contexts/themeContexts.js"
import AsyncStorage from '@react-native-async-storage/async-storage'
import Sidebar from "../components/Sidebar.js"
import TaskList from "../components/TaskList.js"
import TaskForm from "../components/TaskForm.js"
import Header from "../components/Header.js"

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([])
  const [userData, setUserData] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [message, setMessage] = useState({ text: "", type: "" })
  const { theme } = useTheme()

  // ✅ Carregar dados do usuário
  useEffect(() => {
    loadUserData()
    loadTasks()
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

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks')
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
    }
  }

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks))
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error)
    }
  }

  // ✅ Função para mostrar mensagens
  const showMessage = (text, type = "info") => {
    setMessage({ text, type })
    setTimeout(() => {
      setMessage({ text: "", type: "" })
    }, 3000)
  }

  // ✅ CRUD Operations
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const newTasks = [...tasks, newTask]
    setTasks(newTasks)
    saveTasks(newTasks)
    setShowTaskForm(false)
    showMessage("Tarefa criada com sucesso!", "success")
  }

  const updateTask = (taskData) => {
    const newTasks = tasks.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
        : task
    )
    setTasks(newTasks)
    saveTasks(newTasks)
    setEditingTask(null)
    setShowTaskForm(false)
    showMessage("Tarefa atualizada com sucesso!", "success")
  }

  const deleteTask = (taskId) => {
    const newTasks = tasks.filter(task => task.id !== taskId)
    setTasks(newTasks)
    saveTasks(newTasks)
    showMessage("Tarefa excluída com sucesso!", "success")
  }

  const toggleTaskComplete = (taskId) => {
    const newTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
        : task
    )
    setTasks(newTasks)
    saveTasks(newTasks)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleCancelForm = () => {
    setShowTaskForm(false)
    setEditingTask(null)
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
          {showTaskForm ? (
            <TaskForm 
              task={editingTask}
              onSubmit={editingTask ? updateTask : addTask}
              onCancel={handleCancelForm}
              theme={theme}
            />
          ) : (
            <TaskList 
              tasks={tasks}
              onToggleComplete={toggleTaskComplete}
              onEdit={handleEditTask}
              onDelete={deleteTask}
              onAddNew={() => setShowTaskForm(true)}
              theme={theme}
            />
          )}
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
})

export default HomeScreen