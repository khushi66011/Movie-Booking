const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  getToken() {
    return localStorage.getItem('imovies_token');
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async handleResponse(response) {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorMsg = data.message || `HTTP Error ${response.status}: ${response.statusText}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }

  async get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}${endpoint}${query ? `?${query}` : ''}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async post(endpoint, body = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse(res);
  }
}

export const api = new ApiService();
export default api;

