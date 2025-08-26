import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ✅ Configuração da URL base
const getBaseUrl = () => {
  if (__DEV__) {
    // Desenvolvimento
    if (Platform.OS === 'web') {
      return 'http://localhost:8000';
    } else if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000'; // Emulador Android
    } else {
      return 'http://localhost:8000'; // iOS Simulator
    }
  } else {
    // Produção
    return 'https://your-production-api.com';
  }
};

const API_BASE_URL = getBaseUrl();

class ApiService {
  // ✅ Método auxiliar para fazer requisições com token
  static async makeRequest(endpoint, options = {}) {
    try {
      // Obter token do AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Platform': Platform.OS,
      };

      // Adicionar token se existir
      if (token) {
        defaultHeaders['Authorization'] = `Token ${token}`;
      }

      const config = {
        method: 'GET',
        headers: defaultHeaders,
        timeout: 10000,
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        // Tratamento específico para diferentes status codes
        if (response.status === 401) {
          // Token inválido - fazer logout
          await AsyncStorage.removeItem('authToken');
          throw new Error('Sessão expirada. Faça login novamente.');
        } else if (response.status === 500) {
          throw new Error('Erro no servidor. Tente novamente mais tarde.');
        } else {
          throw new Error(data.message || `Erro: ${response.status}`);
        }
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Network')) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      }
      throw error;
    }
  }

  // ✅ Login
  static async login(username, password) {
    try {
      const data = await this.makeRequest('/api/auth/login/', {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      // Salvar token automaticamente
      if (data.token) {
        await AsyncStorage.setItem('authToken', data.token);
        if (data.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        }
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Erro no login');
    }
  }

  // ✅ Registro
  static async register(userData) {
    try {
      // Gerar username se não fornecido
      if (!userData.username && userData.email) {
        userData.username = userData.email.split('@')[0];
      }

      const data = await this.makeRequest('/api/auth/register/', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      // Salvar token automaticamente
      if (data.token) {
        await AsyncStorage.setItem('authToken', data.token);
        if (data.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        }
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Erro no registro');
    }
  }

  // ✅ Esqueci a senha
  static async forgotPassword(identifier) {
    try {
      const payload = identifier.includes('@') 
        ? { email: identifier } 
        : { username: identifier };

      await this.makeRequest('/api/auth/forgot-password/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Por segurança, sempre retorna sucesso
      return {
        success: true,
        message: 'Se este email/usuário existir, você receberá um link de recuperação.'
      };
    } catch (error) {
      // Por segurança, não revelar se email existe
      return {
        success: true,
        message: 'Se este email/usuário existir, você receberá um link de recuperação.'
      };
    }
  }

  // ✅ Reset de senha
  static async resetPassword(token, newPassword) {
    try {
      return await this.makeRequest('/api/auth/reset-password/', {
        method: 'POST',
        body: JSON.stringify({
          token: token,
          password: newPassword,
        }),
      });
    } catch (error) {
      throw new Error(error.message || 'Erro ao redefinir senha');
    }
  }

  // ✅ Verificar username
  static async checkUsername(username) {
    try {
      return await this.makeRequest('/api/auth/check-username/', {
        method: 'POST',
        body: JSON.stringify({
          username: username,
        }),
      });
    } catch (error) {
      throw new Error(error.message || 'Erro ao verificar username');
    }
  }

  // ✅ Teste de conexão
  static async testConnection() {
    try {
      return await this.makeRequest('/api/test/');
    } catch (error) {
      throw new Error(error.message || 'Erro na conexão');
    }
  }

  // ✅ Logout
  static async logout() {
    try {
      // Tentar fazer logout no servidor
      await this.makeRequest('/api/auth/logout/', {
        method: 'POST',
      });
    } catch (error) {
      // Logout pode falhar silenciosamente
      console.warn('Erro no logout do servidor:', error.message);
    } finally {
      // Sempre limpar dados locais
      await AsyncStorage.multiRemove(['authToken', 'userData']);
    }
  }

  // ✅ Obter dados do usuário atual
  static async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  }

  // ✅ Verificar se está autenticado
  static async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // ✅ Métodos para gerenciamento de usuários (implementar depois)
  static async createUser(userData) {
    try {
      return await this.makeRequest('/api/users/create/', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      throw new Error(error.message || 'Erro ao criar usuário');
    }
  }

  static async listUsers() {
    try {
      return await this.makeRequest('/api/users/list/');
    } catch (error) {
      throw new Error(error.message || 'Erro ao listar usuários');
    }
  }

  static async changeUserPassword(userId, newPassword) {
    try {
      return await this.makeRequest(`/api/users/${userId}/change-password/`, {
        method: 'POST',
        body: JSON.stringify({ new_password: newPassword }),
      });
    } catch (error) {
      throw new Error(error.message || 'Erro ao alterar senha');
    }
  }

  static async deleteUser(userId) {
    try {
      return await this.makeRequest(`/api/users/${userId}/delete/`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw new Error(error.message || 'Erro ao excluir usuário');
    }
  }

  // ✅ Métodos para gerenciamento de tarefas (implementar depois)
  static async listTasks(userId = null) {
    try {
      const endpoint = userId ? `/api/tasks/list/?user_id=${userId}` : '/api/tasks/list/';
      return await this.makeRequest(endpoint);
    } catch (error) {
      throw new Error(error.message || 'Erro ao listar tarefas');
    }
  }

  static async createTask(taskData) {
    try {
      return await this.makeRequest('/api/tasks/create/', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
    } catch (error) {
      throw new Error(error.message || 'Erro ao criar tarefa');
    }
  }
}

export default ApiService;