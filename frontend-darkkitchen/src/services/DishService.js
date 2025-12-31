// services/DishService.js
const API_BASE = "http://localhost:8080/api";

export const DishService = {
  getFeaturedDishes: async () => {
    try {
      const response = await fetch(`${API_BASE}/dishes/featured`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des plats populaires");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getAllDishes: async () => {
    try {
      const response = await fetch(`${API_BASE}/dishes`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des plats");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getDishesByCategory: async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE}/dishes/category/${categoryId}`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des plats par catégorie");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
};