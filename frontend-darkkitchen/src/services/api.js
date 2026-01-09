const API_BASE_URL = 'http://localhost:8080/api';

// Service d'authentification unifié avec séparation Clients/Staff
export const authService = {
  // Vérifier si un utilisateur est connecté
  isAuthenticated: () => {
    const user = localStorage.getItem('user');
    return user !== null && user !== 'null';
  },

  // Récupérer l'utilisateur courant
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.log('No user found in localStorage');
        return null;
      }
      
      const user = JSON.parse(userStr);
      console.log('Current user from localStorage:', user);
      return { 
        ...user,
        // Assurer la compatibilité
        fullName: user.fullName || 
                 `${user.firstName || ''} ${user.lastName || ''}`.trim() || 
                 user.email?.split('@')[0] || 
                 'Utilisateur',
        // Déterminer le type
        type: user.role && ['ADMIN', 'CHEF', 'DRIVER'].includes(user.role) ? 'STAFF' : 'CLIENT'
      };
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  },

  // Sauvegarder l'utilisateur
  saveUser: (userData) => {
    try {
      // Nettoyer et formater les données
      const cleanUserData = {
        ...userData,
        fullName: userData.fullName || 
                 `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 
                 userData.email?.split('@')[0] || 
                 'Utilisateur',
        // Déterminer le type
        type: userData.role && ['ADMIN', 'CHEF', 'DRIVER'].includes(userData.role) ? 'STAFF' : 'CLIENT'
      };
      
      localStorage.setItem('user', JSON.stringify(cleanUserData));
      console.log('User saved to localStorage:', cleanUserData);
      
      // Déclencher l'événement de mise à jour
      window.dispatchEvent(new CustomEvent('userUpdated'));
      
      return cleanUserData;
    } catch (error) {
      console.error('Error saving user:', error);
      return null;
    }
  },  getClientProfile: async (clientId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: Impossible de récupérer le profil`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get client profile error:', error);
      throw error;
    }
  },
  
  // Mettre à jour le profil utilisateur (connecté au backend)
  updateProfile: async (clientId, clientData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData)
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: Impossible de mettre à jour le profil`);
      }
      
      const updatedClient = await response.json();
      
      // Mettre à jour dans localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedClient));
      window.dispatchEvent(new Event('userUpdated'));
      
      return { success: true, client: updatedClient };
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  // Changer le mot de passe (connecté au backend)
  changePassword: async (clientId, currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${clientId}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Si c'est une erreur 401 (mot de passe incorrect)
        if (response.status === 401) {
          throw new Error(data.error || 'Mot de passe actuel incorrect');
        }
        // Si c'est une erreur 400 (validation)
        if (response.status === 400) {
          throw new Error(data.error || 'Données invalides');
        }
        throw new Error(data.error || `Erreur ${response.status}: Impossible de changer le mot de passe`);
      }
      
      // Mettre à jour dans localStorage avec les nouvelles données
      if (data.client) {
        localStorage.setItem('currentUser', JSON.stringify(data.client));
        window.dispatchEvent(new Event('userUpdated'));
      }
      
      return { 
        success: true, 
        message: data.message || 'Mot de passe modifié avec succès', 
        client: data.client 
      };
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },
  
  // Se déconnecter
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    window.dispatchEvent(new CustomEvent('userUpdated'));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    console.log('User logged out');
  },

  // Se connecter avec séparation Clients/Staff
  login: async (email, password, userType = 'AUTO') => {
    try {
      console.log(`Login attempt: ${email} (Type: ${userType})`);
      
      let endpoint;
      let requestBody;
      
      if (userType === 'STAFF') {
        // Connexion STAFF (Admin, Chef, Driver)
        endpoint = '/auth/staff/login';
        requestBody = { email, password };
      } else if (userType === 'CLIENT') {
        // Connexion CLIENT
        endpoint = '/auth/client/login';
        requestBody = { email, password };
      } else {
        // AUTO: utiliser l'endpoint unifié
        endpoint = '/auth/login';
        requestBody = { email, password };
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Échec de la connexion';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Login successful:', data);
      
      // Formater la réponse pour une utilisation cohérente
      const userData = {
        ...data,
        id: data.id || data.userId,
        email: data.email,
        role: data.role || 'CLIENT',
        fullName: data.fullName || data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim()
      };
      
      // Sauvegarder l'utilisateur
      const savedUser = authService.saveUser(userData);
      
      return {
        success: true,
        user: savedUser,
        message: 'Connexion réussie'
      };
      
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Email ou mot de passe incorrect. Veuillez réessayer.'
      };
    }
  },

  // S'inscrire (uniquement pour les clients)
  register: async (userData) => {
    try {
      console.log('Registration attempt:', userData);
      
      // Formatage des données pour le backend
      const registerData = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName || userData.fullName?.split(' ')[0] || '',
        lastName: userData.lastName || userData.fullName?.split(' ').slice(1).join(' ') || '',
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        city: userData.city || '',
        postalCode: userData.postalCode || ''
      };
      
      console.log('Sending registration data:', registerData);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(registerData)
      });
      
      console.log('Registration response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Échec de l\'inscription';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Registration successful:', data);
      
      // Sauvegarder l'utilisateur
      const userToSave = {
        ...data,
        role: 'CLIENT',
        type: 'CLIENT',
        fullName: data.fullName || `${registerData.firstName} ${registerData.lastName}`.trim()
      };
      
      const savedUser = authService.saveUser(userToSave);
      
      return {
        success: true,
        user: savedUser,
        message: 'Inscription réussie'
      };
      
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.message || 'Erreur d\'inscription. Veuillez réessayer.'
      };
    }
  },

  // Vérifier si un email existe (pour auto-détection)
  checkEmailExists: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-email/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return { exists: false };
    } catch (error) {
      console.error('Error checking email:', error);
      return { exists: false };
    }
  },

  // Créer un compte staff (admin seulement)
  createStaffAccount: async (staffData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(staffData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Échec de la création du compte staff');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Create staff error:', error);
      throw error;
    }
  }
};


export const orderService = {
  
  // Créer une commande
  createOrder: async (orderData) => {
    try {
      console.log('Envoi de la commande:', orderData);
      
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création de la commande');
      }
      
      console.log('Commande créée:', data);
      return data;
      
    } catch (error) {
      console.error('Erreur création commande:', error);
      throw error;
    }
  },

  // Vérifier si un client existe
  checkClientExists: async (email) => {
    try {
      console.log('Vérification client:', email);
      
      const response = await fetch(`${API_BASE_URL}/orders/check-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Erreur de vérification client');
      }

      const data = await response.json();
      console.log('Client existe:', data.exists);
      return data.exists;
      
    } catch (error) {
      console.error('Erreur vérification client:', error);
      throw error;
    }
  },

  // Connexion client
  loginClient: async (email, password) => {
    try {
      console.log('Connexion client:', email);
      
      const response = await fetch(`${API_BASE_URL}/orders/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }
      
      if (data.success) {
        console.log('Connexion réussie:', data.client);
        return data.client;
      } else {
        throw new Error(data.message || 'Email ou mot de passe incorrect');
      }
      
    } catch (error) {
      console.error('Erreur connexion client:', error);
      throw error;
    }
  },

  // Récupérer les commandes d'un client (SIMPLIFIÉ)
  getClientOrders: async (clientId, filters = {}) => {
  try {
    console.log('Récupération commandes pour client:', clientId, 'filters:', filters);
    
    // Construire l'URL avec les filtres
    let url = `${API_BASE_URL}/orders/client/${clientId}`;
    const params = [];
    
    if (filters.status && filters.status !== 'TOUS') {
      params.push(`status=${encodeURIComponent(filters.status)}`);
    }
    
    if (filters.startDate) {
      params.push(`startDate=${encodeURIComponent(filters.startDate)}`);
    }
    
    if (filters.endDate) {
      params.push(`endDate=${encodeURIComponent(filters.endDate)}`);
    }
    
    if (filters.sortBy) {
      params.push(`sortBy=${encodeURIComponent(filters.sortBy)}`);
    }
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    console.log('URL appel API:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Aucune commande trouvée pour ce client');
        return [];
      }
      
      const errorText = await response.text();
      console.error('Erreur API:', response.status, errorText);
      throw new Error(`Erreur ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Données reçues:', data);
    
    // Retourner les commandes du DTO
    return data.orders || [];
    
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    
    // En cas d'erreur, retourner des données de démo au bon format
    if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
      console.warn('API hors ligne, utilisation données démo');
    
    }
    
    throw error;
  }
},

  // Récupérer une commande par ID
  getOrderById: async (orderId) => {
    try {
      console.log('Récupération commande:', orderId);
      
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: Impossible de récupérer la commande`);
      }

      const data = await response.json();
      return data.order || data.data || data;
      
    } catch (error) {
      console.error('Erreur récupération commande:', error);
      throw error;
    }
  },

  // Annuler une commande
  cancelOrder: async (orderId, reason = 'Annulé par le client') => {
    try {
      console.log('Annulation commande:', orderId, 'raison:', reason);
      
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'annulation');
      }
      
      console.log('Commande annulée:', data);
      return data;
      
    } catch (error) {
      console.error('Erreur annulation commande:', error);
      throw error;
    }
  },

  // Commander à nouveau
  reorder: async (orderId) => {
    try {
      console.log('Recommandation de la commande:', orderId);
      
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la recréation');
      }
      
      console.log('Commande recréée:', data);
      return data;
      
    } catch (error) {
      console.error('Erreur recommandation:', error);
      throw error;
    }
  }

  ,// Dans orderService.js, corrigez ces deux méthodes :
getAllOrders: async () => {
  try {
    const user = authService.getCurrentUser();
    console.log('User in getAllOrders:', user);
    
    if (!user) {
      throw new Error('Veuillez vous connecter');
    }
    
    // Vérifier si c'est un admin/staff (simplifié)
    const isStaff = user.role && ['ADMIN', 'CHEF', 'DRIVER', 'admin', 'chef', 'driver'].includes(user.role);
    
    if (!isStaff) {
      throw new Error('Accès réservé aux administrateurs');
    }
    
    const response = await fetch(`${API_BASE_URL}/orders/admin/all`, {
      headers: {
        'Content-Type': 'application/json',
        // Pas besoin de token si votre backend ne l'utilise pas
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API getAllOrders:', response.status, errorText);
      throw new Error(`Erreur ${response.status}: ${errorText || 'Impossible de récupérer les commandes'}`);
    }
    
    const data = await response.json();
    console.log('API Response getAllOrders:', data);
    
    // Votre backend retourne {success: true, orders: [...]}
    return data.orders || [];
    
  } catch (error) {
    console.error('Erreur getAllOrders:', error);
    throw error;
  }
},

updateOrderStatus: async (orderId, status, updatedBy = 'admin') => {
  try {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Non authentifié');
    }
    
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/update-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        status: status,
        updatedBy: updatedBy
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur ${response.status}: ${errorText || 'Erreur lors de la mise à jour'}`);
    }
    
    const data = await response.json();
    console.log('updateOrderStatus response:', data);
    
    return data.order || data;
    
  } catch (error) {
    console.error('Erreur updateOrderStatus:', error);
    throw error;
  }
},

// Ajoutez cette méthode pour les statistiques
getOrdersByStatus: async (status) => {
  try {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Non authentifié');
    }
    
    const response = await fetch(`${API_BASE_URL}/orders/by-status/${status}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur ${response.status}: ${errorText || 'Erreur lors de la récupération'}`);
    }
    
    const data = await response.json();
    return data.orders || [];
    
  } catch (error) {
    console.error('Erreur getOrdersByStatus:', error);
    throw error;
  }
},
// Ajoutez ces méthodes dans orderService
getPendingOrdersForChef: async () => {
  try {
    const user = authService.getCurrentUser();
    if (!user || !['CHEF', 'chef', 'ADMIN', 'admin'].includes(user.role)) {
      throw new Error('Accès non autorisé');
    }
    
    const response = await fetch(`${API_BASE_URL}/orders/chef/pending`, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes');
    }
    
    const data = await response.json();
    return data.orders || [];
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
},

getReadyOrdersForDelivery: async () => {
  try {
    const user = authService.getCurrentUser();
    if (!user || !['DRIVER', 'driver', 'ADMIN', 'admin'].includes(user.role)) {
      throw new Error('Accès non autorisé');
    }
    
    const response = await fetch(`${API_BASE_URL}/orders/delivery/ready`, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes');
    }
    
    const data = await response.json();
    return data.orders || [];
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
},

// Méthode pour envoyer une notification
sendNotification: async (orderId, notificationType, message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: notificationType, message })
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi de la notification');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}
};




export const utilsService = {

    isValidEmail: (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  
  isValidPhone: (phone) => {
    return /^[0-9+\s]{10,}$/.test(phone.replace(/\s/g, ''));
  },
  
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  formatPrice: (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price || 0);
  }
};

// Service des plats
export const dishService = {
  // Récupérer tous les plats
  getAllDishes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Get dishes error:', error);
      return [];
    }
  },

  // Récupérer un plat par ID
  getDishById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes/${id}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Get dish error:', error);
      throw error;
    }
  },

  // Récupérer les plats par catégorie
  getDishesByCategory: async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes/category/${categoryId}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Get dishes by category error:', error);
      return [];
    }
  },

  // Rechercher des plats
  searchDishes: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Search dishes error:', error);
      return [];
    }
  },

  // Récupérer les plats populaires
  getPopularDishes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes/popular`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Get popular dishes error:', error);
      return [];
    }
  },

  // Récupérer les nouveaux plats
  getNewDishes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes/new`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Get new dishes error:', error);
      return [];
    }
  }
};

// Service des catégories
export const categoryService = {
  // Récupérer toutes les catégories
  getAllCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Get categories error:', error);
      return [];
    }
  },

  // Récupérer une catégorie par ID
  getCategoryById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Get category error:', error);
      throw error;
    }
  }
};

// Service du panier
export const cartService = {
  // Ajouter un article au panier
  addToCart: (dish, quantity = 1) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Vérifier si le plat existe déjà dans le panier
      const existingItemIndex = cart.findIndex(item => item.id === dish.id);
      
      if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += quantity;
      } else {
        cart.push({
          id: dish.id,
          name: dish.name,
          price: dish.price,
          image: dish.image || '/default-dish.jpg',
          category: dish.category ? (typeof dish.category === 'string' ? dish.category : dish.category.name) : null,
          quantity: quantity
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      
      return cart;
    } catch (error) {
      console.error('Add to cart error:', error);
      return [];
    }
  },

  // Retirer un article du panier
  removeFromCart: (dishId) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = cart.filter(item => item.id !== dishId);
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cartUpdated'));
      
      return updatedCart;
    } catch (error) {
      console.error('Remove from cart error:', error);
      return [];
    }
  },

  // Mettre à jour la quantité
  updateQuantity: (dishId, quantity) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = cart.map(item => {
        if (item.id === dishId) {
          return { ...item, quantity: Math.max(1, quantity) };
        }
        return item;
      });
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cartUpdated'));
      
      return updatedCart;
    } catch (error) {
      console.error('Update quantity error:', error);
      return [];
    }
  },

  // Vider le panier
  clearCart: () => {
    try {
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      return [];
    } catch (error) {
      console.error('Clear cart error:', error);
      return [];
    }
  },

  // Récupérer le panier
  getCart: () => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch (error) {
      console.error('Get cart error:', error);
      return [];
    }
  },

  // Calculer le nombre total d'articles
  getTotalItems: () => {
    try {
      const cart = cartService.getCart();
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Get total items error:', error);
      return 0;
    }
  },

  // Calculer le total du panier
  getCartTotal: () => {
    try {
      const cart = cartService.getCart();
      return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    } catch (error) {
      console.error('Get cart total error:', error);
      return 0;
    }
  },

  // Calculer les totaux détaillés
  getCartTotals: () => {
    try {
      const subtotal = cartService.getCartTotal();
      const deliveryFee = subtotal > 0 ? 2.99 : 0;
      const tax = subtotal * 0.10;
      const total = subtotal + deliveryFee + tax;

      return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        deliveryFee: parseFloat(deliveryFee.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      };
    } catch (error) {
      console.error('Get cart totals error:', error);
      return {
        subtotal: 0,
        deliveryFee: 0,
        tax: 0,
        total: 0
      };
    }
  }
};


export default {
  auth: authService,
  order: orderService,
  dish: dishService,
  category: categoryService,
  cart: cartService,
  utils: utilsService
};