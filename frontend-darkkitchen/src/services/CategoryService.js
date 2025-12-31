// services/CategoryService.js
const API_BASE = "http://localhost:8080/api";

export const CategoryService = {
  getAllCategories: async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des catégories");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
};