// src/services/OrderService.js (extrait des méthodes MyOrders)
import AuthService from './AuthService';

const API_URL = 'http://localhost:8080/api';

class OrderService {
  // Récupérer les commandes du client connecté
  async getMyOrders() {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_URL}/orders/my-orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Si l'endpoint n'existe pas encore (404), on lance une erreur spécifique
        if (response.status === 404) {
          throw new Error('Endpoint /api/orders/my-orders non disponible');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des commandes');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur OrderService.getMyOrders:', error);
      throw error;
    }
  }

  // Annuler une commande
  async cancelOrder(orderId) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'annulation');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur OrderService.cancelOrder:', error);
      throw error;
    }
  }

  // Confirmer une commande (paiement)
  async confirmOrder(orderId) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_URL}/orders/${orderId}/confirm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la confirmation');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur OrderService.confirmOrder:', error);
      throw error;
    }
  }

  // Récupérer les détails d'une commande
  async getOrderDetails(orderNumber) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_URL}/orders/${orderNumber}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Commande non trouvée');
        }
        throw new Error('Erreur lors de la récupération');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur OrderService.getOrderDetails:', error);
      throw error;
    }
  }

  // Ajouter cette méthode à OrderService.js
async generateInvoice(orderId) {
  try {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Non authentifié');
    }

    const response = await fetch(`${API_URL}/orders/${orderId}/invoice`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur OrderService.generateInvoice:', error);
    throw error;
  }
}
}

export default new OrderService();