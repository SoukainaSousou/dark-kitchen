const API_BASE = "http://localhost:8080/api/dishes";

export const DishService = {
  getFeaturedDishes: async () => {
    try {
      const response = await fetch(`${API_BASE}/featured`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des plats populaires");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
};
