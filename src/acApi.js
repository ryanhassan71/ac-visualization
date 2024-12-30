// utils/acApi.js
import axios from 'axios';
import { BASE_URL } from './config';

// Store Constants
export const convertToMilliseconds = (value, unit) => {
  const unitToMilliseconds = {
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
  };

  if (!unitToMilliseconds[unit]) {
    throw new Error(`Invalid unit provided: ${unit}. Valid units are 'seconds', 'minutes', 'hours'.`);
  }

  return value * unitToMilliseconds[unit];
};

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
export const fetchTemperatureData = async (storeId) => {
  
  
  try {
    const response = await apiClient.get(`/temperature/sensor-overview/?store_id=${storeId}`);
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

export const TEMPERATURE_DATA_INTERVAL = convertToMilliseconds(10, 'seconds')


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

export const TEMPERATURE_GRAPH_DATA_TIMER = convertToMilliseconds(15, 'minutes')

// Function to fetch energy graph data
export const fetchEnergyGraphData = async (type = 'weekly', energyDeviceId) => {
  
  try {
    const response = await apiClient.get(`/energy/energy-graph-data/${energyDeviceId}?type=${type}`);
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

// Function to fetch monthly energy data
export const fetchMonthlyEnergyData = async (energyDeviceId, month, year) => {
  try {
    const response = await apiClient.get(`/energy/energy-graph-data/${energyDeviceId}`, {
      params: { type: 'monthly', month, year },
    });

    if (response.data && response.data.success) {
      return response.data; // Return the data
    } else {
      console.error('Unexpected data format or API error:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching monthly energy data:', error);
    return null;
  }
};


export const DAILY_POWER_DATA_INTERVAL = convertToMilliseconds(1, 'hours')
// Function to control AC settings
export const controlAcSettings = async ({ sensor_id, off_on, temperature, ac_mode, fan_speed }) => {
  
  try {
    const response = await apiClient.post(`/temperature/ac/control/`, {
      sensor_id,
      off_on,
      temperature,
      ac_mode,
      fan_speed,
    });

    if (response.data && response.data.success) {
      return response.data;
    } else {
      console.error('Unexpected data format or API error:', response.data);
      throw new Error('Failed to control AC settings');
    }
  } catch (error) {
    console.error('Error controlling AC settings:', error);
    throw error;
  }
};


export const fetchRecentAcAlerts = async () => {
  
  
  try {
    const response = await apiClient.get(`/temperature/alerts/recent/ac/`);
    if (response.data && response.data.success) {
      return response.data.data; // Return the list of alerts
    } else {
      
      return [];
    }
  } catch (error) {
    console.error('Error fetching recent AC alerts:', error);
    return [];
  }
};

// Function to fetch the store list
export const fetchStoreList = async () => {
  try {
    const response = await apiClient.get(`/branch/store-list-energy/`);
    if (response.data && response.data.success) {
      return response.data.data; // Return the list of stores
    } else {
      console.error('Unexpected data format or API error:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching store list:', error);
    return [];
  }
};


export const AC_NOTIF_INTERVAL = convertToMilliseconds('60', 'seconds')
// Exporting the client as well if needed for other API calls
export default apiClient;
