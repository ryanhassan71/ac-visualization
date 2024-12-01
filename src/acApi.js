// utils/acApi.js
import axios from 'axios';
import { BASE_URL } from './config';

// Store Constants

const STORE_ID = 10
const ENERGY_DEVICE_ID = 2

let token = null; // Global variable to store the token

// Function to login and get the token
const loginAndGetToken = async () => {
  if (token) {
    return token; // Return the token if it already exists
  }
  try {
    const response = await axios.post(`${BASE_URL}/auth/login/email/`, {
      email_or_phone: 'admin@gmail.com',
      password: 'ron123!@#',
    });

    if (response.data && response.data.success) {
      token = response.data.token;
      return token;
    } else {
      console.error('Failed to log in and retrieve token:', response.data);
      throw new Error('Failed to log in');
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Create an Axios instance with base URL
const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor to handle token dynamically
apiClient.interceptors.request.use(
  async (config) => {
    if (!token) {
      try {
        token = await loginAndGetToken(); // Fetch the latest token if not available
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Set the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to fetch AC sensor data
export const fetchTemperatureData = async () => {
  try {
    const response = await apiClient.get(`/temperature/sensor-overview/?store_id=${STORE_ID}`);
    if (response.data && response.data.success) {
      return response.data.ac_sensors;
    } else {
      console.error('Unexpected data format or API error:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    return [];
  }
};

// Function to fetch AC graph data (temperature over time)
export const fetchTemperatureGraphData = async (acId, type = 'daily') => {
  try {
    const response = await apiClient.get(`/temperature/temperature-graph-data/${acId}?type=${type}`);
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      console.error('Unexpected data format or API error:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching temperature graph data:', error);
    return [];
  }
};

export const TEMPERATURE_GRAPH_DATA_TIMER = 15 * 60 * 1000;

// Function to fetch energy graph data
export const fetchEnergyGraphData = async (type = 'weekly') => {
  try {
    const response = await apiClient.get(`/energy/energy-graph-data/${ENERGY_DEVICE_ID}?type=${type}`);
    if (response.data && response.data.success) {
      return response.data;
    } else {
      console.error('Unexpected data format or API error:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching energy graph data:', error);
    return null;
  }
};

// Exporting the client as well if needed for other API calls
export default apiClient;
