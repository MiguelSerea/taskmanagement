const API_BASE_URL = 'http://localhost:8000' 

class ApiService {
  static async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {  // ✅ Corrigido
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro no login')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Erro de conexão')
    }
  }

  static async forgotPassword(identifier) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/`, {  // ✅ Corrigido
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(identifier.includes('@') 
            ? { email: identifier } 
            : { username: identifier }
          )
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar email de recuperação')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Erro de conexão')
    }
  }

  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {  // ✅ Corrigido
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro no registro')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Erro de conexão')
    }
  }

  static async checkUsername(username) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/check-username/`, {  // ✅ Corrigido
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao verificar username')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Erro de conexão')
    }
  }

  static async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password/`, {  // ✅ Corrigido
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          password: newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao redefinir senha')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Erro de conexão')
    }
  }

  static async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/test/`, {  // ✅ Esta permanece sem /auth/
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro na conexão')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Erro de conexão')
    }
  }
}

export default ApiService