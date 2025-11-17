import apiService from './apiService';

class FishService {
  // Get all approved fish ads for the logged-in farm owner
  async getMyApprovedFish() {
    try {
      const response = await apiService.get('/fish/my-approved');
      return response;
    } catch (error) {
      console.error('Error fetching approved fish ads:', error);
      throw error;
    }
  }

  // Update stock for a specific fish ad
  async updateFishStock(fishId, newStock) {
    try {
      const response = await apiService.put(`/fish/${fishId}/stock`, { stock: newStock });
      return response;
    } catch (error) {
      console.error('Error updating fish stock:', error);
      throw error;
    }
  }

  // Get all available fish (public)
  async getAllFish() {
    try {
      const response = await apiService.get('/fish');
      return response;
    } catch (error) {
      console.error('Error fetching fish:', error);
      throw error;
    }
  }

  // Get fish by ID
  async getFishById(id) {
    try {
      const response = await apiService.get(`/fish/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching fish by ID:', error);
      throw error;
    }
  }

  // Search fish
  async searchFish(query) {
    try {
      const response = await apiService.get(`/fish/search?q=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      console.error('Error searching fish:', error);
      throw error;
    }
  }
}

export default new FishService();
