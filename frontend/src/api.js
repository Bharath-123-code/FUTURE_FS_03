import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty array to prevent CategoryGrid.jsx from crashing
    return [];
  }
};

export const fetchMenuItems = async (categoryId = null, searchQuery = null) => {
  try {
    let url = '/menu-items/';
    const params = new URLSearchParams();
    
    if (categoryId) params.append('category', categoryId);
    if (searchQuery) params.append('search', searchQuery);
    
    if (params.toString()) url += `?${params.toString()}`;
    
    console.log('API: Making request to:', url);
    const response = await api.get(url);
    console.log('API: Response received:', response.data);
    // Handle paginated response
    return response.data.results || response.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    // Return mock data for testing search functionality
    if (searchQuery) {
      console.log('API: Returning mock search results for:', searchQuery);
      return [
        { id: 1, name: `${searchQuery} Pizza`, price: 12.99, description: `Delicious ${searchQuery} pizza with fresh ingredients`, tag: 'Popular' },
        { id: 2, name: `${searchQuery} Burger`, price: 9.99, description: `Tasty ${searchQuery} burger with special sauce`, tag: 'Chef Special' },
        { id: 3, name: `${searchQuery} Pasta`, price: 11.99, description: `Creamy ${searchQuery} pasta with herbs`, tag: 'Vegetarian' }
      ];
    }
    // Return empty array to prevent PopularDishes.jsx from crashing
    return [];
  }
};

export const fetchAvailableWaiters = async () => {
  try {
    const response = await api.get('/available-waiters/');
    return response.data;
  } catch (error) {
    console.error('Error fetching available waiters:', error);
    throw error;
  }
};

// Additional API functions for future use
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders/', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const fetchOrders = async () => {
  try {
    const response = await api.get('/orders/');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const fetchWaiterOrders = async (waiterId) => {
  try {
    const response = await api.get(`/orders/?assigned_waiter=${waiterId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching waiter orders:', error);
    throw error;
  }
};

export const completeOrder = async (orderId) => {
  try {
    const response = await api.post(`/orders/${orderId}/complete_order/`);
    return response.data;
  } catch (error) {
    console.error('Error completing order:', error);
    throw error;
  }
};

export const fetchWaiterById = async (waiterId) => {
  try {
    const response = await api.get(`/waiters/${waiterId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching waiter details:', error);
    throw error;
  }
};

export const fetchOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

export default api;
