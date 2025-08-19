import BASE_URL from './config';

class ApiClient {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Set token in localStorage
  setToken(token) {
    localStorage.setItem('token', token);
  }

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem('token');
  }

  // Build headers with authorization
  buildHeaders(customHeaders = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle API response
  async handleResponse(response) {
    if (response.status === 401) {
      // Token expired or invalid
      this.removeToken();
      window.location.href = '/login';
      throw new Error('Authentication expired. Please login again.');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
  }

  // GET request
  async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.buildHeaders()
    });
    return this.handleResponse(response);
  }

  // POST request
  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  // PUT request
  async put(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.buildHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  // DELETE request
  async delete(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.buildHeaders()
    });
    return this.handleResponse(response);
  }

  // File upload
  async upload(endpoint, formData) {
    const token = this.getToken();
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData
    });
    return this.handleResponse(response);
  }
}

const api = new ApiClient();
export default api;
