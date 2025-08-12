import axios from 'axios';
import {
  WeatherRecord,
  CreateWeatherRequest,
  UpdateWeatherRequest,
  WeatherRecordsResponse,
  YouTubeResponse,
  MapsResponse,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Weather Records API
export const weatherApi = {
  // Create new weather record
  create: async (data: CreateWeatherRequest): Promise<WeatherRecord> => {
    const response = await api.post<{ record: WeatherRecord; message: string }>('/weather', data);
    return response.data.record;
  },

  // Get all weather records
  getAll: async (): Promise<WeatherRecord[]> => {
    const response = await api.get<WeatherRecordsResponse>('/weather');
    return response.data.records;
  },

  // Get specific weather record
  getById: async (id: number): Promise<WeatherRecord> => {
    const response = await api.get<WeatherRecord>(`/weather/${id}`);
    return response.data;
  },

  // Update weather record
  update: async (id: number, data: UpdateWeatherRequest): Promise<WeatherRecord> => {
    const response = await api.put<{ record: WeatherRecord; message: string }>(`/weather/${id}`, data);
    return response.data.record;
  },

  // Delete weather record
  delete: async (id: number): Promise<void> => {
    await api.delete(`/weather/${id}`);
  },

  // Get YouTube videos for location
  getYouTubeVideos: async (id: number): Promise<YouTubeResponse> => {
    const response = await api.get<YouTubeResponse>(`/weather/${id}/youtube`);
    return response.data;
  },

  // Get Google Maps data for location
  getMapsData: async (id: number): Promise<MapsResponse> => {
    const response = await api.get<MapsResponse>(`/weather/${id}/maps`);
    return response.data;
  },
};

// Data Export API
export const exportApi = {
  // Export as JSON
  json: async (): Promise<Blob> => {
    const response = await api.get('/export/json', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Export as CSV
  csv: async (): Promise<Blob> => {
    const response = await api.get('/export/csv', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Export as PDF
  pdf: async (): Promise<Blob> => {
    const response = await api.get('/export/pdf', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Export as Markdown
  markdown: async (): Promise<Blob> => {
    const response = await api.get('/export/markdown', {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Helper function to download file
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default api;
