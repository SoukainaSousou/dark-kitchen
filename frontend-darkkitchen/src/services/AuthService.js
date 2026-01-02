// src/services/AuthService.js
const API_URL = 'http://localhost:8080/api';

class AuthService {
  // ==================== MÉTHODES CLIENT ====================
  
  async loginClient(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/client/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data || 'Erreur de connexion client');
      }

      this.saveClientAuthData(data.token, data.client);
      return data;
      
    } catch (error) {
      console.error('Erreur loginClient:', error);
      throw error;
    }
  }

  async registerClient(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/client/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data || "Erreur d'inscription client");
      }

      this.saveClientAuthData(data.token, data.client);
      return data;
      
    } catch (error) {
      console.error('Erreur registerClient:', error);
      throw error;
    }
  }

  // ==================== MÉTHODES ADMIN ====================
  
  async loginAdmin(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data || 'Erreur de connexion admin');
      }

      this.saveAdminAuthData(data.token, data.admin);
      return data;
      
    } catch (error) {
      console.error('Erreur loginAdmin:', error);
      throw error;
    }
  }

  // ==================== GESTION DU STOCKAGE ====================
  
  saveClientAuthData(token, client) {
    localStorage.setItem('token', token);
    localStorage.setItem('client', JSON.stringify(client));
    localStorage.setItem('userType', 'client');
  }

  saveAdminAuthData(token, admin) {
    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(admin));
    localStorage.setItem('userType', 'admin');
  }


  getUserType() {
    return localStorage.getItem('userType');
  }


  getCurrentClient() {
    const client = localStorage.getItem('client');
    return client ? JSON.parse(client) : null;
  }

  getCurrentAdmin() {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  }

  getCurrentUser() {
    if (this.isClient()) return this.getCurrentClient();
    if (this.isAdmin()) return this.getCurrentAdmin();
    return null;
  }

  logout() {
    localStorage.clear();
    window.location.href = '/';
  }



  getToken() {
    return localStorage.getItem('token');
  }
  
  isAuthenticated() {
    return !!this.getToken();
  }
  
  getUserType() {
    return localStorage.getItem('userType');
  }
  
  isClient() {
    return this.getUserType() === 'client';
  }
  
  isAdmin() {
    return this.getUserType() === 'admin';
  }
  
}


export default new AuthService();