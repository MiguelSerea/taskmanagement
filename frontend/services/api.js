import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

// Base API URL configuration
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'web') {
      return 'http://localhost:8000/api';
    } else {
      return DeviceInfo.isEmulator() 
        ? 'http://10.0.2.2:8000/api' 
        : 'http://YOUR_LOCAL_IP:8000/api'; // Replace with your machine's IP
    }
  } else {
    return 'https://your-production-api.com/api'; // Production API URL
  }
};

// Create axios instance
const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Platform': Platform.OS,
  },
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized (e.g., redirect to login)
      } else if (error.response.status === 500) {
        error.response.data = { 
          message: 'Server error. Please try again later.' 
        };
      }
      
      // Format error response consistently
      const formattedError = {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      };
      return Promise.reject(formattedError);
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({
        status: 0,
        data: { message: 'Network error. Please check your connection.' },
      });
    } else {
      // Something happened in setting up the request
      return Promise.reject({
        status: -1,
        data: { message: 'Request setup error.' },
      });
    }
  }
);

// API functions with improved error handling
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login/', credentials);
    return response.data;
  } catch (error) {
    if (error.data?.non_field_errors) {
      // Handle Django REST framework non-field errors
      throw { message: error.data.non_field_errors[0] };
    }
    throw error.data || { message: 'Login failed. Please try again.' };
  }
};

export const registerUser = async (userData) => {
  try {
    // Generate username if not provided
    if (!userData.username && userData.email) {
      userData.username = userData.email.split('@')[0];
    }

    const response = await api.post('/register/', userData);
    return response.data;
  } catch (error) {
    // Handle field-specific errors from Django
    if (error.data) {
      const firstError = Object.values(error.data)[0]?.[0];
      if (firstError) {
        throw { message: firstError };
      }
    }
    throw { message: 'Registration failed. Please try again.' };
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/password-reset/', { email });
    return {
      success: true,
      message: 'If this email exists, you will receive a reset link.'
    };
  } catch (error) {
    // Don't reveal whether email exists (security)
    return {
      success: true,
      message: 'If this email exists, you will receive a reset link.'
    };
  }
};

// Add more API functions as needed

export default api;