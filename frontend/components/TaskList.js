import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { Plus, Edit, Trash2, Check, Clock } from 'lucide-react-native'

const TaskList = ({ tasks, onToggleComplete, onEdit, onDelete, onAddNew, theme }) => {
  const pendingTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  const TaskItem = ({ task }) => (
    <View style={[styles.taskItem, { 
      backgroundColor: theme.bgCard, 
      borderColor: theme.borderColor,
      opacity: task.completed ? 0.7 : 1 
    }]}>
      <TouchableOpacity
        onPress={() => onToggleComplete(task.id)}
        style={[styles.checkbox, { 
          backgroundColor: task.completed ? '#16a34a' : 'transparent',
          borderColor: task.completed ? '#16a34a' : theme.borderColor 
        }]}
      >
        {task.completed && <Check size={16} color="white" />}
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <Text style={[
          styles.taskTitle, 
          { color: theme.textPrimary },
          task.completed && styles.taskCompleted
        ]}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={[
            styles.taskDescription, 
            { color: theme.textSecondary },
            task.completed && styles.taskCompleted
          ]}>
            {task.description}
          </Text>
        )}
        <View style={styles.taskMeta}>
          {task.priority && (
            <View style={[styles.priorityBadge, styles[`priority${task.priority}`]]}>
              <Text style={styles.priorityText}>{task.priority}</Text>
            </View>
          )}
          {task.dueDate && (
            <View style={styles.dueDateContainer}>
              <Clock size={12} color={theme.textSecondary} />
              <Text style={[styles.dueDate, { color: theme.textSecondary }]}>
                {new Date(task.dueDate).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.taskActions}>
        <TouchableOpacity
          onPress={() => onEdit(task)}
          style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
        >
          <Edit size={16} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(task.id)}
          style={[styles.actionButton, { backgroundColor: '#dc2626' }]}
        >
          <Trash2 size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* ✅ Botão Adicionar */}
      <TouchableOpacity
        onPress={onAddNew}
        style={[styles.addButton, { backgroundColor: theme.primary || '#3b82f6' }]}
      >
        <Plus size={20} color="white" />
        <Text style={styles.addButtonText}>Nova Tarefa</Text>
      </TouchableOpacity>

      {/* ✅ Estatísticas */}
      <View style={[styles.stats, { backgroundColor: theme.bgCard, borderColor: theme.borderColor }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.textPrimary }]}>{pendingTasks.length}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Pendentes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.textPrimary }]}>{completedTasks.length}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Concluídas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.textPrimary }]}>{tasks.length}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total</Text>
        </View>
      </View>

      {/* ✅ Tarefas Pendentes */}
      {pendingTasks.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Pendentes ({pendingTasks.length})
          </Text>
          {pendingTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </View>
      )}

      {/* ✅ Tarefas Concluídas */}
      {completedTasks.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Concluídas ({completedTasks.length})
          </Text>
          {completedTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </View>
      )}

      {/* ✅ Estado Vazio */}
      {tasks.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
            Nenhuma tarefa ainda
          </Text>
          <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>
            Clique em "Nova Tarefa" para começar a organizar suas atividades
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityHigh: {
    backgroundColor: '#fef2f2',
  },
  priorityMedium: {
    backgroundColor: '#fef3c7',
  },
  priorityLow: {
    backgroundColor: '#f0f9ff',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDate: {
    fontSize: 12,
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
})

export default TaskList