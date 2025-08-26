import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Save, X, Calendar, Flag } from 'lucide-react-native'

const TaskForm = ({ task, onSubmit, onCancel, theme }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || ''
      })
    }
  }, [task])

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      return
    }
    onSubmit(formData)
  }

  const priorities = [
    { value: 'low', label: 'Baixa', color: '#3b82f6' },
    { value: 'medium', label: 'Média', color: '#f59e0b' },
    { value: 'high', label: 'Alta', color: '#dc2626' }
  ]

  return (
    <View style={[styles.container, { backgroundColor: theme.bgCard, borderColor: theme.borderColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {task ? 'Editar Tarefa' : 'Nova Tarefa'}
        </Text>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <X size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {/* ✅ Título */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Título *</Text>
          <TextInput
            style={[styles.input, { 
              borderColor: theme.borderColor, 
              backgroundColor: theme.inputBg,
              color: theme.textPrimary 
            }]}
            placeholder="Digite o título da tarefa"
            placeholderTextColor={theme.textSecondary}
            value={formData.title}
            onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
          />
        </View>

        {/* ✅ Descrição */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Descrição</Text>
          <TextInput
            style={[styles.textArea, { 
              borderColor: theme.borderColor, 
              backgroundColor: theme.inputBg,
              color: theme.textPrimary 
            }]}
            placeholder="Digite uma descrição (opcional)"
            placeholderTextColor={theme.textSecondary}
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* ✅ Prioridade */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Prioridade</Text>
          <View style={styles.priorityContainer}>
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority.value}
                style={[
                  styles.priorityButton,
                  { borderColor: priority.color },
                  formData.priority === priority.value && { backgroundColor: priority.color }
                ]}
                onPress={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
              >
                <Flag size={16} color={formData.priority === priority.value ? 'white' : priority.color} />
                <Text style={[
                  styles.priorityText,
                  { color: formData.priority === priority.value ? 'white' : priority.color }
                ]}>
                  {priority.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ✅ Data de Vencimento */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Data de Vencimento</Text>
          <View style={[styles.dateInputContainer, { borderColor: theme.borderColor, backgroundColor: theme.inputBg }]}>
            <Calendar size={18} color={theme.textSecondary} />
            <TextInput
              style={[styles.dateInput, { color: theme.textPrimary }]}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={theme.textSecondary}
              value={formData.dueDate}
              onChangeText={(text) => setFormData(prev => ({ ...prev, dueDate: text }))}
            />
          </View>
        </View>

        {/* ✅ Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onCancel}
            style={[styles.button, styles.cancelButton, { borderColor: theme.borderColor }]}
          >
            <Text style={[styles.cancelButtonText, { color: theme.textPrimary }]}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.button, styles.submitButton]}
            disabled={!formData.title.trim()}
          >
            <Save size={18} color="white" />
            <Text style={styles.submitButtonText}>
              {task ? 'Atualizar' : 'Criar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
})

export default TaskForm