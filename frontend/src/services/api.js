// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Notes API methods
  async getNotes() {
    return this.request('/notes/');
  }

  async getNote(id) {
    return this.request(`/notes/${id}/`);
  }

  async createNote(noteData) {
    return this.request('/notes/', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  async updateNote(id, noteData) {
    return this.request(`/notes/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
  }

  async patchNote(id, noteData) {
    return this.request(`/notes/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(noteData),
    });
  }

  async deleteNote(id) {
    return this.request(`/notes/${id}/`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();